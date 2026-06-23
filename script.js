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

const devBadge = document.getElementById('dev-badge');
const devModal = document.getElementById('dev-modal');
const closeModal = document.getElementById('close-modal');

// --- 3. INTERACTIVE DEVELOPER MODAL (SHOEB NADAF POPUP) ---
devBadge.addEventListener('click', () => {
    devModal.classList.add('open');
    if (navigator.vibrate) navigator.vibrate([30, 50, 30]);
});

closeModal.addEventListener('click', () => {
    devModal.classList.remove('remove'); // Safe backup call
    devModal.classList.remove('open');
});

devModal.addEventListener('click', (e) => {
    if (e.target === devModal) devModal.classList.remove('open');
});

// --- 4. SAFE FALLBACK DATA (Agar API block ho jaye toh ye chalega) ---
const fallbackTimings = {
    Fajr: "04:45 AM",
    Dhuhr: "12:30 PM",
    Asr: "04:15 PM",
    Maghrib: "07:10 PM",
    Isha: "08:40 PM"
};

function useFallbackData() {
    document.getElementById('user-location').innerText = "India (Standard)";
    document.getElementById('hijri-date').innerText = "08 Muharram 1448 AH";
    
    const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    prayers.forEach(prayer => {
        const itemBox = document.getElementById(prayer);
        document.getElementById(`time-${prayer}`).innerText = fallbackTimings[prayer];
        itemBox.classList.remove('skeleton');
    });
    
    // Default highlight Dhuhr or Asr based on simple time
    document.getElementById('Dhuhr').classList.add('active-namaz');
}

// --- 5. LIVE PRAYER TIMES FROM API WITH TIMEOUT PROTECTION ---
async function fetchLivePrayerTimes() {
    const locText = document.getElementById('user-location');
    const hijriText = document.getElementById('hijri-date');

    // Create a timeout to force fallback if API takes more than 4 seconds
    const apiTimeout = setTimeout(() => {
        console.log("API took too long. Forcing fallback data.");
        useFallbackData();
    }, 4000);

    try {
        // Automatically detect location via IP API
        const ipResponse = await fetch('https://ipapi.co/json/');
        if (!ipResponse.ok) throw new Error("IP API failed");
        const ipData = await ipResponse.json();
        
        const city = ipData.city || "Mumbai";
        const country = ipData.country_name || "India";
        locText.innerText = `${city}, ${ipData.country_code}`;

        // Fetch Prayer Times from Aladhan API
        const prayerResponse = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}&method=2`);
        if (!prayerResponse.ok) throw new Error("Prayer API failed");
        const pData = await prayerResponse.json();
        
        if (pData.code === 200) {
            clearTimeout(apiTimeout); // Stop the fallback since API responded!
            
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

                document.getElementById(`time-${prayer}`).innerText = finalTime;
                itemBox.classList.remove('skeleton');
            });

            highlightCurrentPrayer(timings);
        } else {
            throw new Error("API Data Invalid");
        }
    } catch (error) {
        console.log("API Error, using fallback data...", error);
        clearTimeout(apiTimeout);
        useFallbackData();
    }
}

function highlightCurrentPrayer(timings) {
    try {
        const now = new Date();
        const currentMinutes = now.getHours() * 60 + now.getMinutes();
        const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
        let activePrayer = 'Isha';

        const prayerMinutes = {};
        prayers.forEach(p => {
            const [h, m] = timings[p].split(':');
            prayerMinutes[p] = parseInt(h) * 60 + parseInt(m);
        });

        if (currentMinutes >= prayerMinutes['Fajr'] && currentMinutes < prayerMinutes['Dhuhr']) activePrayer = 'Fajr';
        else if (currentMinutes >= prayerMinutes['Dhuhr'] && currentMinutes < prayerMinutes['Asr']) activePrayer = 'Dhuhr';
        else if (currentMinutes >= prayerMinutes['Asr'] && currentMinutes < prayerMinutes['Maghrib']) activePrayer = 'Asr';
        else if (currentMinutes >= prayerMinutes['Maghrib'] && currentMinutes < prayerMinutes['Isha']) activePrayer = 'Maghrib';

        document.getElementById(activePrayer).classList.add('active-namaz');
    } catch(e) {
        document.getElementById('Dhuhr').classList.add('active-namaz');
    }
}

// --- 6. INITIAL LOAD ---
window.addEventListener('DOMContentLoaded', () => {
    const randomIndex = Math.floor(Math.random() * islamicQuotes.length);
    quoteText.innerText = islamicQuotes[randomIndex].text;
    quoteSource.innerText = islamicQuotes[randomIndex].source;
    
    fetchLivePrayerTimes();
});

// --- 7. TASBEEH COUNTER LOGIC ---
btnCount.addEventListener('click', () => {
    count++;
    counterNumber.innerText = count;
    counterNumber.classList.add('pop-effect');
    setTimeout(() => { counterNumber.classList.remove('pop-effect'); }, 100);

    if (navigator.vibrate) navigator.vibrate(15); 

    if (count >= target) {
        counterNumber.style.color = '#D4AF37';
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
