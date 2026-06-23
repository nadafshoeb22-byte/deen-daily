// --- 1. GLOBAL APP STATE ---
const APP_STATE = {
    isLoggedIn: false,
    currentUser: "",
    currentCity: "",
    todayData: { Fajr: false, Dhuhr: false, Asr: false, Maghrib: false, Isha: false }
};

// --- 2. PAGE INITIALIZATION ---
document.addEventListener("DOMContentLoaded", () => {
    checkUserSession();
    fetchLivePrayerTimes();
    setupLoginButton();
});

// --- 3. SESSION & LOGIN GUARD ---
function checkUserSession() {
    const savedUser = localStorage.getItem("deen_user_name");
    const savedCity = localStorage.getItem("deen_user_city");

    if (savedUser && savedCity) {
        APP_STATE.isLoggedIn = true;
        APP_STATE.currentUser = savedUser;
        APP_STATE.currentCity = savedCity;

        // Header and Dashboard me naam update karo
        document.getElementById("nav-user-name").innerText = savedUser;
        document.getElementById("user-location").innerText = savedCity;

        // Hidden tracker data load karo aur dashboard dikhao
        loadSavedTrackerData();
        switchTab("home");
    } else {
        APP_STATE.isLoggedIn = false;
        // Agar login nahi hai toh jabardasti login screen dikhao
        hideAllPages();
        document.getElementById("page-auth").classList.add("active");
    }
}

function setupLoginButton() {
    const loginBtn = document.getElementById("btn-login");
    if (loginBtn) {
        loginBtn.addEventListener("click", () => {
            const nameInput = document.getElementById("auth-username").value.trim();
            const cityInput = document.getElementById("auth-city").value.trim();

            if (nameInput === "" || cityInput === "") {
                alert("Bhai, apna Naam aur City dono daalo!");
                return;
            }

            // LocalStorage me data save karo permanent
            localStorage.setItem("deen_user_name", nameInput);
            localStorage.setItem("deen_user_city", cityInput);

            // App State refresh karo
            checkUserSession();
        });
    }
}

// --- 4. NAVIGATION TABS CONTROLLER ---
function switchTab(tabName) {
    // Agar login nahi hai, toh kisi aur page par jaane mat do
    if (!localStorage.getItem("deen_user_name")) {
        hideAllPages();
        document.getElementById("page-auth").classList.add("active");
        return;
    }

    hideAllPages();
    
    // Target page show karo
    const targetPage = document.getElementById(`page-${tabName}`);
    if (targetPage) targetPage.classList.add("active");

    // Bottom Navigation buttons active set karo
    document.querySelectorAll(".nav-item").forEach(item => item.classList.remove("active"));
    const activeNav = document.getElementById(`nav-${tabName}`);
    if (activeNav) activeNav.classList.add("active");
}

function hideAllPages() {
    document.getElementById("page-auth").classList.remove("active");
    document.getElementById("page-home").classList.remove("active");
    document.getElementById("page-tracker").classList.remove("active");
    document.getElementById("page-founder").classList.remove("active");
}

// --- 5. LIVE API PRAYER TIMES ---
async function fetchLivePrayerTimes() {
    const locText = document.getElementById('user-location');
    const hijriText = document.getElementById('hijri-date');
    
    // User ki dalee hui city nikaalo, nahi toh safe default Islampur ya Kolhapur
    const userCity = localStorage.getItem("deen_user_city") || "Kolhapur";

    try {
        const response = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${userCity}&country=India&method=2`);
        const pData = await response.json();
        
        if (pData.code === 200) {
            const timings = pData.data.timings;
            const hijri = pData.data.date.hijri;

            hijriText.innerText = `${hijri.day} ${hijri.month.en} ${hijri.year} AH`;

            const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
            prayers.forEach(prayer => {
                const itemBox = document.getElementById(prayer);
                const timeStr = timings[prayer];
                
                const [hours, minutes] = timeStr.split(':');
                const ampm = hours >= 12 ? 'PM' : 'AM';
                const formattedHours = hours % 12 || 12;
                const finalTime = `${String(formattedHours).padStart(2, '0')}:${minutes} ${ampm}`;

                if(document.getElementById(`time-${prayer}`)) {
                    document.getElementById(`time-${prayer}`).innerText = finalTime;
                }
                if(itemBox) itemBox.classList.remove('skeleton');
            });

            highlightCurrentPrayer(timings);
        }
    } catch (error) {
        console.log("API Error, using safe display...");
        hijriText.innerText = "08 Muharram 1448 AH";
        ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].forEach(p => {
            const itemBox = document.getElementById(p);
            if(itemBox) itemBox.classList.remove('skeleton');
        });
    }
}

function highlightCurrentPrayer(timings) {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    let activePrayer = 'Isha';

    const prayerMinutes = {};
    prayers.forEach(p => {
        if(timings[p]) {
            const [h, m] = timings[p].split(':');
            prayerMinutes[p] = parseInt(h) * 60 + parseInt(m);
        }
    });

    if (currentMinutes >= prayerMinutes['Fajr'] && currentMinutes < prayerMinutes['Dhuhr']) activePrayer = 'Fajr';
    else if (currentMinutes >= prayerMinutes['Dhuhr'] && currentMinutes < prayerMinutes['Asr']) activePrayer = 'Dhuhr';
    else if (currentMinutes >= prayerMinutes['Asr'] && currentMinutes < prayerMinutes['Maghrib']) activePrayer = 'Asr';
    else if (currentMinutes >= prayerMinutes['Maghrib'] && currentMinutes < prayerMinutes['Isha']) activePrayer = 'Maghrib';

    const activeBox = document.getElementById(activePrayer);
    if(activeBox) activeBox.classList.add('active-namaz');
}

// --- 6. NAMAZ TRACKER & LOCAL STORAGE SAVER ---
function togglePrayer(namaz) {
    APP_STATE.todayData[namaz] = !APP_STATE.todayData[namaz];
    
    // Save to phone storage
    const dateKey = new Date().toISOString().slice(0, 10);
    localStorage.setItem(`namaz_log_${dateKey}`, JSON.stringify(APP_STATE.todayData));
    
    syncTrackerUI();
}

function loadSavedTrackerData() {
    const dateKey = new Date().toISOString().slice(0, 10);
    const saved = localStorage.getItem(`namaz_log_${dateKey}`);
    if (saved) {
        APP_STATE.todayData = JSON.parse(saved);
    }
    syncTrackerUI();
}

function syncTrackerUI() {
    let checkedCount = 0;
    const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    
    prayers.forEach(p => {
        const isChecked = APP_STATE.todayData[p];
        const row = document.querySelector(`[data-prayer="${p}"]`);
        
        if (isChecked) {
            checkedCount++;
            if(row) row.classList.add("checked");
        } else {
            if(row) row.classList.remove("checked");
        }
    });

    // Score calculations
    const percent = Math.round((checkedCount / 5) * 100);
    
    document.getElementById("progress-percent").innerText = `${percent}%`;
    document.getElementById("progress-fill").style.width = `${percent}%`;
    document.getElementById("progress-status-text").innerText = `You have completed ${checkedCount} out of 5 prayers today.`;
}
