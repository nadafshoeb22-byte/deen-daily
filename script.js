
// --- 1. DAILY ISLAMIC QUOTES DATA ---
const islamicQuotes = [
    { text: '"Verily, with hardship, there is relief."', source: "— Surah Al-Inshirah [94:6]" },
    { text: '"So remember Me; I will remember you."', source: "— Surah Al-Baqarah [2:152]" },
    { text: '"He knows what is in every heart."', source: "— Surah Al-Mulk [67:13]" },
    { text: '"The best among you are those who have the best manners and character."', source: "— Prophet Muhammad (PBUH)" },
    { text: '"Call upon Me; I will respond to you."', source: "— Surah Ghafir [40:60]" }
];

// --- 2. INITIALIZE VARIABLES ---
let count = 0;
let target = 33;

// DOM Elements
const counterNumber = document.getElementById('counter-number');
const btnCount = document.getElementById('btn-count');
const btnReset = document.getElementById('btn-reset');
const dhikrSelect = document.getElementById('dhikr-select');
const targetText = document.getElementById('target-text');
const quoteText = document.getElementById('daily-quote');
const quoteSource = document.getElementById('quote-source');

// --- 3. AUTO CHANGE QUOTE ON LOAD ---
window.addEventListener('DOMContentLoaded', () => {
    const randomIndex = Math.floor(Math.random() * islamicQuotes.length);
    quoteText.innerText = islamicQuotes[randomIndex].text;
    quoteSource.innerText = islamicQuotes[randomIndex].source;
    
    // Highlight current active prayer box (Just as a design placeholder for now)
    // Agle update me hum isme real live time API jodh sakte hain!
    document.getElementById('fajr-box').classList.add('active-namaz');
});

// --- 4. TASBEEH COUNTER LOGIC ---

// Count Button Click
btnCount.addEventListener('click', () => {
    count++;
    counterNumber.innerText = count;

    // Premium Pop Animation Effect
    counterNumber.classList.add('pop-effect');
    setTimeout(() => {
        counterNumber.classList.remove('pop-effect');
    }, 100);

    // Mobile Vibration (Agar phone support karta hai toh click par halke se vibrate hoga)
    if (navigator.vibrate) {
        navigator.vibrate(15); 
    }

    // Target complete hone par visual hint
    if (count >= target) {
        counterNumber.style.color = '#D4AF37'; // Gold color lock jab target hit ho jaye
    } else {
        counterNumber.style.color = '#FFF';
    }
});

// Reset Button Click
btnReset.addEventListener('click', () => {
    count = 0;
    counterNumber.innerText = count;
    counterNumber.style.color = '#FFF';
});

// Dhikr Change Dropdown
dhikrSelect.addEventListener('change', () => {
    // Reset counter when dhikr changes
    count = 0;
    counterNumber.innerText = count;
    counterNumber.style.color = '#FFF';
    
    // Custom targets based on selection (Example: Astaghfirullah has 100 target)
    if (dhikrSelect.value === 'Astaghfirullah') {
        target = 100;
    } else {
        target = 33;
    }
    targetText.innerText = `Target: ${target}`;
});
