// --- 1. CONFIGURATION & STATE SYSTEM ---
const APP_STATE = {
    isLoggedIn: false,
    currentUser: null,
    todayData: {
        Fajr: false,
        Dhuhr: false,
        Asr: false,
        Maghrib: false,
        Isha: false
    }
};

// Valid credentials setup
const VALID_USERS = {
    "shoeb": "786",
    "nadaf": "786"
};

// --- 2. INITIALIZATION ON PAGE LOAD ---
document.addEventListener("DOMContentLoaded", () => {
    checkAuthSession();
    setupEventListeners();
    fetchPrayerTimes();
    updateDateDisplay();
});

// Update standard date across views
function updateDateDisplay() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const todayStr = new Date().toLocaleDateString('en-US', options);
    
    const elements = ['#today-date', '#tracker-date'];
    elements.forEach(sel => {
        const el = document.querySelector(sel);
        if(el) el.textContent = todayStr;
    });
}

// --- 3. AUTHENTICATION CONTROLLER ---
function checkAuthSession() {
    const session = localStorage.getItem("islamic_app_session");
    if (session) {
        APP_STATE.isLoggedIn = true;
        APP_STATE.currentUser = session;
        loadUserTrackerData();
        showPage("dashboard-page");
        toggleNavigation(true);
    } else {
        APP_STATE.isLoggedIn = false;
        showPage("login-page");
        toggleNavigation(false);
    }
}

function handleLogin(e) {
    e.preventDefault();
    const usernameInput = document.getElementById("username").value.trim().toLowerCase();
    const passwordInput = document.getElementById("password").value.trim();
    const errorMessage = document.getElementById("login-error");

    if (VALID_USERS[usernameInput] && VALID_USERS[usernameInput] === passwordInput) {
        localStorage.setItem("islamic_app_session", usernameInput);
        if(errorMessage) errorMessage.style.display = "none";
        
        // Reset and animate into dashboard
        document.getElementById("login-form").reset();
        checkAuthSession();
    } else {
        if(errorMessage) {
            errorMessage.textContent = "Invalid Credentials! Please try again.";
            errorMessage.style.display = "block";
        }
    }
}

function handleLogout() {
    localStorage.removeItem("islamic_app_session");
    checkAuthSession();
}

function toggleNavigation(show) {
    const navBar = document.getElementById("bottom-navigation");
    if(navBar) navBar.style.display = show ? "grid" : "none";
}

// --- 4. NAVIGATION HANDLER ---
function showPage(pageId) {
    // Auth Guard check
    if (!APP_STATE.isLoggedIn && pageId !== "login-page") {
        pageId = "login-page";
    }

    // Toggle active classes on pages
    document.querySelectorAll(".app-page").forEach(page => {
        page.classList.remove("active");
    });
    const activePage = document.getElementById(pageId);
    if(activePage) activePage.classList.add("active");

    // Toggle active states on buttons
    document.querySelectorAll(".nav-item").forEach(btn => {
        btn.classList.remove("active");
        if(btn.getAttribute("onclick")?.includes(pageId)) {
            btn.classList.add("active");
        }
    });
    
    // Smooth scroll back to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function setupEventListeners() {
    const loginForm = document.getElementById("login-form");
    if(loginForm) loginForm.addEventListener("submit", handleLogin);
}

// --- 5. PRAYER TIMINGS ENGINE (API INTEGRATION) ---
async function fetchPrayerTimes() {
    // API uses Kolhapur coordinates as default
    const url = "https://api.aladhan.com/v1/timingsByCity?city=Kolhapur&country=India&method=2";
    
    try {
        const response = await fetch(url);
        const json = await response.json();
        
        if(json.code === 200 && json.data) {
            const timings = json.data.timings;
            renderPrayerTimings(timings);
            detectCurrentActiveNamaz(timings);
        }
    } catch (error) {
        console.error("Failed to sync times:", error);
        // Fallback local static timings if network fails
        const fallback = { Fajr: "04:45", Dhuhr: "12:35", Asr: "16:05", Maghrib: "19:12", Isha: "20:35" };
        renderPrayerTimings(fallback);
    }
}

function renderPrayerTimings(timings) {
    const targets = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    targets.forEach(namaz => {
        const timeBox = document.getElementById(`time-${namaz.toLowerCase()}`);
        if(timeBox) {
            timeBox.textContent = convertTo12Hour(timings[namaz]);
            timeBox.classList.remove("skeleton");
        }
    });
}

function convertTo12Hour(timeStr) {
    if(!timeStr) return "--:--";
    let [hours, minutes] = timeStr.split(':');
    hours = parseInt(hours);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // hours '0' should be '12'
    return `${hours}:${minutes} ${ampm}`;
}

function detectCurrentActiveNamaz(timings) {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const parseToMinutes = (tStr) => {
        const [h, m] = tStr.split(':').map(Number);
        return h * 60 + m;
    };

    // Remove old highlights
    document.querySelectorAll(".prayer-item").forEach(el => el.classList.remove("active-namaz"));

    // Check bounds sequentially
    if (currentMinutes >= parseToMinutes(timings.Fajr) && currentMinutes < parseToMinutes(timings.Dhuhr)) {
        document.getElementById("item-fajr")?.classList.add("active-namaz");
    } else if (currentMinutes >= parseToMinutes(timings.Dhuhr) && currentMinutes < parseToMinutes(timings.Asr)) {
        document.getElementById("item-dhuhr")?.classList.add("active-namaz");
    } else if (currentMinutes >= parseToMinutes(timings.Asr) && currentMinutes < parseToMinutes(timings.Maghrib)) {
        document.getElementById("item-asr")?.classList.add("active-namaz");
    } else if (currentMinutes >= parseToMinutes(timings.Maghrib) && currentMinutes < parseToMinutes(timings.Isha)) {
        document.getElementById("item-maghrib")?.classList.add("active-namaz");
    } else {
        document.getElementById("item-isha")?.classList.add("active-namaz");
    }
}

// --- 6. LOCALSTORAGE PROGRESS TRACKER ENGINE ---
function loadUserTrackerData() {
    const key = `tracker_${APP_STATE.currentUser}_${getTodayKey()}`;
    const saved = localStorage.getItem(key);
    
    if (saved) {
        APP_STATE.todayData = JSON.parse(saved);
    } else {
        APP_STATE.todayData = { Fajr: false, Dhuhr: false, Asr: false, Maghrib: false, Isha: false };
    }
    
    syncTrackerDOM();
}

function toggleNamazStatus(namazName) {
    // Toggle state sequence
    APP_STATE.todayData[namazName] = !APP_STATE.todayData[namazName];
    
    // Persist data
    const key = `tracker_${APP_STATE.currentUser}_${getTodayKey()}`;
    localStorage.setItem(key, JSON.stringify(APP_STATE.todayData));
    
    syncTrackerDOM();
}

function syncTrackerDOM() {
    let checkedCount = 0;
    const keys = Object.keys(APP_STATE.todayData);
    
    keys.forEach(namaz => {
        const isChecked = APP_STATE.todayData[namaz];
        const row = document.getElementById(`row-${namaz.toLowerCase()}`);
        const icon = document.getElementById(`check-icon-${namaz.toLowerCase()}`);
        
        if(isChecked) checkedCount++;
        
        if(row && icon) {
            if(isChecked) {
                row.classList.add("checked");
                icon.className = "fas fa-check";
            } else {
                row.classList.remove("checked");
                icon.className = "fas fa-plus";
            }
        }
    });

    // Calculate percent global data
    const total = keys.length;
    const percent = Math.round((checkedCount / total) * 100);
    
    // Update progress elements across application frames
    const fill = document.getElementById("progress-fill");
    const percentText = document.getElementById("progress-percent");
    const countText = document.getElementById("completed-count");
    
    if(fill) fill.style.width = `${percent}%`;
    if(percentText) percentText.textContent = `${percent}%`;
    if(countText) countText.textContent = checkedCount;

    // Synchronize founder special calculations view data
    const streakMetric = document.getElementById("f-streak-metric");
    if(streakMetric) {
        // Logic builds visual presentation data
        streakMetric.textContent = percent === 100 ? "100%" : `${percent}%`;
    }
}

function getTodayKey() {
    const d = new Date();
    return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
}
