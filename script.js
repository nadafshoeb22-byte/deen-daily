const reminders = [
    {
        text: "“So remember Me; I will remember you.”",
        translation: "[Surah Al-Baqarah, 2:152]"
    },
    {
        text: "“The best among you are those who have the best manners and character.”",
        translation: "[Sahih Al-Bukhari]"
    },
    {
        text: "“Verily, with hardship comes ease.”",
        translation: "[Surah Al-Inshirah, 94:6]"
    },
    {
        text: "“And speak to people good words.”",
        translation: "[Surah Al-Baqarah, 2:83]"
    },
    {
        text: "“He who does not show mercy to others, will not be shown mercy.”",
        translation: "[Sahih Muslim]"
    }
];

const reminderText = document.getElementById('reminder-text');
const reminderTranslation = document.getElementById('reminder-translation');
const nextBtn = document.getElementById('next-btn');

const countBtn = document.getElementById('count-btn');
const resetBtn = document.getElementById('reset-btn');
const counterVal = document.getElementById('counter-val');

function getRandomReminder() {
    const randomIndex = Math.floor(Math.random() * reminders.length);
    reminderText.innerText = reminders[randomIndex].text;
    reminderTranslation.innerText = reminders[randomIndex].translation;
}

nextBtn.addEventListener('click', getRandomReminder);

let count = 0;
countBtn.addEventListener('click', () => {
    count++;
    counterVal.innerText = count;
});

resetBtn.addEventListener('click', () => {
    count = 0;
    counterVal.innerText = count;
});

window.onload = getRandomReminder;
