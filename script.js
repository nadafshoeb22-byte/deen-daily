// --- 1. DAILY ISLAMIC QUOTES DATA ---
const islamicQuotes = [
    { text: '"Verily, with hardship, there is relief."', source: "— Surah Al-Inshirah [94:6]" },
    { text: '"So remember Me; I will remember you."', source: "— Surah Al-Baqarah [2:152]" },
    { text: '"He knows what is in every heart."', source: "— Surah Al-Mulk [67:13]" },
    { text: '"The best among you are those who have the best manners and character."', source: "— Prophet Muhammad (PBUH)" },
    { text: '"Call upon Me; I will respond to you."', source: "— Surah Ghafir [40:60]" }
];

// --- 2. INITIALIZE VARIABLES & DOM ELEMENTS ---
let count = 0;
let target = 33;

const counterNumber = document.getElementById('counter-number');
const btnCount = document.getElementById('btn-count');
const btnReset = document.getElementById('btn-reset');
const dhikrSelect = document.getElementById('dhikr-select');
const targetText = document.getElementById('target-text');
const quoteText = document.getElementById('daily-quote');
const quoteSource = document.getElementById('quote-source');

// Developer Modal Elements
const devBadge = document.getElementById('dev-badge');
const devModal = document.getElementById('dev-modal');
const closeModal = document.getElementById('close-modal');

// --- 3. INTERACTIVE DEVELOPER MODAL LOGIC (SHOEB NADAF POPUP) ---
devBadge.addEventListener('click', () => {
    devModal.classList.add('open');
    if (navigator.vibrate) navigator.vibrate([30, 50, 30]); // Premium triple vibration
});

closeModal.addEventListener('click', () => {
    devModal.classList.remove('open');
});

// Close modal if user clicks outside the card
devModal.addEventListener('click', (e) => {
    if (e.target === devModal) {
        devModal.classList.remove('open');
    }
});

// --- 4. LIVE ACCURATE PRAYER TIMES DATA FROM API ---
async function fetchLivePrayerTimes() {
    const locText = document.getElementById('user-location');
    const hijriText = document.getElementById('hijri-date');

    try {
        // Step A: Automatically detect location via IP API (Fast & Mobile Friendly)
        const ipResponse = await fetch('https://ipapi.co/json/');
        const ipData = await ipResponse.json();
        
        const city = ipData.city || "Mumbai";
        const country = ipData.country_name || "India";
        locText.innerText = `${city}, ${ipData.country_code}`;

        // Step B: Fetch Prayer Times & Hijri Date from Aladhan API based on City
        const prayerResponse = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}&method=2`);
        const pData = await prayerResponse.json();
        
        if (pData.code === 200) {
            const timings = pData.data.timings;
            const hijri = pData.data.date.hijri;

            // Update Hijri Date
            hijriText.innerText = `${hijri.day} ${hijri.month.en} ${hijri.year} AH`;

            // List of prayers we want to display
            const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

            prayers.forEach(prayer => {
                const itemBox = document.getElementById(prayer);
                const timeStr = timings[prayer];
                
                // Convert 24h to 12h Format with AM/PM
                const [hours, minutes] = timeStr.split(':');
                const ampm = hours >= 12 ? 'PM' : 'AM';
                const formattedHours = hours % 12 || 12;
                const finalTime = `${String(formattedHours).padStart(2, '0')}:${minutes} ${ampm}`;

                // Inject Time and Remove Skeleton loading shimmer
                document.getElementById(`time-${prayer}`).innerText = finalTime;
                itemBox.classList.remove('skeleton');
            });

            // Highlight the current active/upcoming prayer based on local time
            highlightCurrentPrayer(timings);
        }
    } catch (error) {
        console.log("API Error, falling back to safe data...", error);
        locText.innerText = "India (Default)";
        hijriText.innerText = "10 Muharram 1448 AH";
        // Remove skeleton even if it fails
        ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].forEach(p => {
            document.getElementById(p).classList.remove('skeleton');
        });
    }
}

// Logic to highlight current running namaz box
function highlightCurrentPrayer(timings) {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    let activePrayer = 'Isha'; // Default fallback

    // Convert prayer timings to absolute minutes from midnight
    const prayerMinutes = {};
    prayers.forEach(p => {
        const [h, m] = timings[p].split(':');
        prayerMinutes[p] = parseInt(h) * 60 + parseInt(m);
    });

    if (currentMinutes >= prayerMinutes['Fajr'] && currentMinutes < prayerMinutes['Dhuhr']) activePrayer = 'Fajr';
    else if (currentMinutes >= prayerMinutes['Dhuhr'] && currentMinutes < prayerMinutes['Asr']) activePrayer = 'Dhuhr';
    else if (currentMinutes >= prayerMinutes['Asr'] && currentMinutes < prayerMinutes['Maghrib']) activePrayer = 'Asr';
    else if (currentMinutes >= prayerMinutes['Maghrib'] && currentMinutes < prayerMinutes['Isha']) activePrayer = 'Maghrib';

    // Apply active-namaz glow effect class
    document.getElementById(activePrayer).classList.add('active-namaz');
}

// --- 5. INITIAL LOAD ---
window.addEventListener('DOMContentLoaded', () => {
    // Set Random Quote
    const randomIndex = Math.floor(Math.random() * islamicQuotes.length);
    quoteText.innerText = islamicQuotes[randomIndex].text;
    quoteSource.innerText = islamicQuotes[randomIndex].source;
    
    // Call API for Live Namaz Timings
    fetchLivePrayerTimes();
});

// --- 6. TASBEEH COUNTER LOGIC ---
btnCount.addEventListener('click', () => {
    count++;
    counterNumber.innerText = count;

    counterNumber.classList.add('pop-effect');
    setTimeout(() => { counterNumber.classList.remove('pop-effect'); }, 100);

    if (navigator.vibrate) navigator.vibrate(15); 

    if (count >= target) {
        counterNumber.style.color = '#D4AF37'; // Lock gold color at target
    } else {
        counterNumber.style.color = '#FFF';
    }
});

btnReset.addEventListener('click', () => {
    count = 0;
    counterNumber.innerText = count;
    counterNumber.style.color = '#FFF';
});

dhikrSelect.addEventListener('change', () => {
    count = 0;
    counterNumber.innerText = count;
    counterNumber.style.color = '#FFF';
    target = dhikrSelect.value === 'Astaghfirullah' ? 100 : 33;
    targetText.innerText = `Target: ${target}`;
});
