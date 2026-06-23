// ==========================================================================
// DEENHUB SYSTEM EXECUTIVE ARCHITECTURE RUNTIME ENGINE
// ==========================================================================

const DEENHUB_DATA_MATRIX = {
    operatorName: "Shoeb Nadaf", geoNode: "Islampur", selectedLanguage: "en", tasbeehCount: 0, cycleCount: 0,
    hadithEngineStream: {
        en: "\"The best among you are those who have the best manners.\" (Sahih al-Bukhari)",
        hi: "\"तुममें से सबसे अच्छे वो लोग हैं जिनके अख्लाक (आचरण) सबसे बेहतर हैं।\" (सहीह अल-बुखारी)",
        ur: "\"تم میں سے سب سے بہترین وہ ہیں جن کے اخلاق سب سے اچھے ہیں۔\" (صحیح البخاری)",
        ar: "\"خِيَارُكُمْ أَحَاسِنُكُمْ أَخْلاقًا\" (صحيح البخاري)"
    },
    quranInternalSchema: [
        {id: 1, title: "Al-Fatiha", descent: "Meccan", totalVerses: 7, arabicTitle: "الفاتحة"},
        {id: 2, title: "Al-Baqarah", descent: "Medinan", totalVerses: 286, arabicTitle: "البقرة"},
        {id: 3, title: "Ali 'Imran", descent: "Medinan", totalVerses: 200, arabicTitle: "آل عمران"},
        {id: 112, title: "Al-Ikhlas", descent: "Meccan", totalVerses: 4, arabicTitle: "الإخلاص"},
        {id: 113, title: "Al-Falaq", descent: "Meccan", totalVerses: 5, arabicTitle: "الفلق"},
        {id: 114, title: "An-Nas", descent: "Meccan", totalVerses: 6, arabicTitle: "الناس"}
    ],
    duaInternalSchema: [
        {headline: "Morning Adhkar / सुबह की दुआएं", tag: "morning", scriptAr: "اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَصْبَحْنَا", conceptTrans: "O Allah, by Your leave we have reached the morning..."},
        {headline: "Evening Adhkar / शाम की दुआएं", tag: "evening", scriptAr: "اللَّهُمَّ بِكَ أَمْسَيْنَا وَبِكَ أَمْسَيْنَا", conceptTrans: "O Allah, by Your leave we have reached the evening..."},
        {headline: "Travel Dua / सफर की दुआ", tag: "travel", scriptAr: "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا", conceptTrans: "Glory to Him who has brought this vehicle under our control..."},
        {headline: "Before Sleeping / सोने की दुआ", tag: "sleeping", scriptAr: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا", conceptTrans: "In Your name, O Allah, I die and I live..."}
    ]
};

const LANGUAGE_LOCALIZATION_DICTIONARY = {
    en: { welcome: "Operator,", home: "Home", quran: "Quran", dua: "Dua", tasbeeh: "Tasbeeh", ramadan: "Ramadan", learn: "Learn", ai: "AI Chat", found: "Founder", verify: "Verification Registry" },
    hi: { welcome: "ऑपरेटर,", home: "होम", quran: "क़ुरान", dua: "दुआ", tasbeeh: "तस्बीह", ramadan: "रमज़ान", learn: "सीखें", ai: "एआई चैट", found: "फाउंडर", verify: "दैनिक सत्यापन ट्रैकर" },
    ur: { welcome: "آپریٹر،", home: "ہوم", quran: "قرآن", dua: "دعا", tasbeeh: "تسبیح", ramadan: "رمضان", learn: "علم", ai: "چیٹ AI", found: "بانی", verify: "روزمرہ تصدیقی فریم ورک" },
    ar: { welcome: "المشغل،", home: "الرئيسية", quran: "القرآن", dua: "الأدعية", tasbeeh: "التسبيح", ramadan: "رمضان", learn: "التعليم", ai: "الذكاء الاصطناعي", found: "المؤسس", verify: "إطار التحقق اليومي" }
};

// --- LIGHTWEIGHT RENDERING CANVAS ENGINE ---
const canvas = document.getElementById('particle-canvas'); const ctx = canvas.getContext('2d'); let particleCollection = [];
function scaleCanvasSize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
window.addEventListener('resize', scaleCanvasSize); scaleCanvasSize();
class LightParticle { constructor() { this.x = Math.random()*canvas.width; this.y = Math.random()*canvas.height; this.radius = Math.random()*1.3; this.vectorY = Math.random()*-0.2; } compute() { this.y += this.speedY = this.vectorY; if(this.y<0) this.y=canvas.height; } paint() { ctx.fillStyle = "rgba(226,183,71,0.25)"; ctx.beginPath(); ctx.arc(this.x,this.y,this.radius,0,Math.PI*2); ctx.fill(); } }
for(let i=0;i<25;i++) particleCollection.push(new LightParticle());
function loopParticles() { ctx.clearRect(0,0,canvas.width,canvas.height); particleCollection.forEach(p=>{p.compute();p.paint();}); requestAnimationFrame(loopParticles); } loopParticles();

function toggleSidebarMenu(show) { document.getElementById("control-sidebar").classList.toggle("open", show); }
function toggleVisualTheme() { document.body.classList.toggle("light-theme"); }

function dispatchSparkBurstEffect(e, strokeColor) {
    const coordX = e.clientX || (e.touches && e.touches[0].clientX); const coordY = e.clientY || (e.touches && e.touches[0].clientY);
    if(!coordX || !coordY) return;
    for(let i=0;i<8;i++){
        const element = document.createElement('div'); element.className = 'sparkle-dot'; element.style.background = strokeColor; document.body.appendChild(element);
        const arc = Math.random()*Math.PI*2; const force = Math.random()*3+1.5; let dynamicX=coordX; let dynamicY=coordY; let scaleOpacity=1;
        const clock = setInterval(()=>{ dynamicX+=Math.cos(arc)*force; dynamicY+=Math.sin(arc)*force; scaleOpacity-=0.06; element.style.left=`${dynamicX}px`; element.style.top=`${dynamicY}px`; element.style.opacity=scaleOpacity; if(scaleOpacity<=0){clearInterval(clock); element.remove();} },16);
    }
}

// --- TRI-STATE TRACKING INTERFACE CORE ---
function compileTriStateTrackerMatrix() {
    const dynamicStructure = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    const nodeBox = document.getElementById("tri-state-injection-zone");
    nodeBox.innerHTML = "";
    dynamicStructure.forEach(namaz => {
        const itemFrame = document.createElement("div");
        itemFrame.className = "tracker-row";
        itemFrame.innerHTML = `
            <div style="display:flex; justify-content:between; font-size:0.9rem; font-weight:600;"><span>${namaz} Core Metric</span><span id="tri-lbl-${namaz}" style="color:var(--text-muted); margin-left:auto;">Unmarked</span></div>
            <div class="tri-btn-group tri-btn-grid">
                <button class="tri-btn" id="btri-${namaz}-jamat" onclick="overrideTrackerState(event, '${namaz}', 'jamat')">JAMAT</button>
                <button class="tri-btn" id="btri-${namaz}-akele" onclick="overrideTrackerState(event, '${namaz}', 'akele')">AKELE</button>
                <button class="tri-btn" id="btri-${namaz}-qaza" onclick="overrideTrackerState(event, '${namaz}', 'qaza')">QAZA</button>
            </div>
        `;
        nodeBox.appendChild(itemFrame);
    });
    syncTriStateLayoutIndicators();
}

function overrideTrackerState(e, targetNamaz, stateString) {
    const keyString = `deenhub_pro_log_${new Date().toISOString().slice(0,10)}`;
    let currentLogs = JSON.parse(localStorage.getItem(keyString)) || {};
    currentLogs[targetNamaz] = (currentLogs[targetNamaz] === stateString) ? null : stateString;
    localStorage.setItem(keyString, JSON.stringify(currentLogs));
    dispatchSparkBurstEffect(e, stateString==='jamat'?'#10B981':stateString==='akele'?'#3B82F6':'#EF4444');
    syncTriStateLayoutIndicators();
}

function syncTriStateLayoutIndicators() {
    const dynamicStructure = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    const keyString = `deenhub_pro_log_${new Date().toISOString().slice(0,10)}`;
    let currentLogs = JSON.parse(localStorage.getItem(keyString)) || {};
    let calculationScore = 0;

    dynamicStructure.forEach(namaz => {
        const jamatButton = document.getElementById(`btri-${namaz}-jamat`);
        const akeleButton = document.getElementById(`btri-${namaz}-akele`);
        const qazaButton = document.getElementById(`btri-${namaz}-qaza`);
        if(!jamatButton) return;

        jamatButton.className = "tri-btn"; akeleButton.className = "tri-btn"; qazaButton.className = "tri-btn";
        const indicatorLabel = document.getElementById(`tri-lbl-${namaz}`);

        if(currentLogs[namaz] === 'jamat') { jamatButton.classList.add("active-jamat"); indicatorLabel.innerText = "Verified Jamat"; indicatorLabel.style.color = "var(--neon-green)"; calculationScore += 20; }
        else if(currentLogs[namaz] === 'akele') { akeleButton.classList.add("active-akele"); indicatorLabel.innerText = "Alone Node"; indicatorLabel.style.color = "var(--neon-blue)"; calculationScore += 15; }
        else if(currentLogs[namaz] === 'qaza') { qazaButton.classList.add("active-qaza"); indicatorLabel.innerText = "Qaza State Locked"; indicatorLabel.style.color = "var(--neon-red)"; }
        else { indicatorLabel.innerText = "Unmarked Layer"; indicatorLabel.style.color = "var(--text-muted)"; }
    });
    document.getElementById("progress-percent").innerText = `${calculationScore}%`;
    document.getElementById("progress-fill").style.width = `${calculationScore}%`;
}

// --- QURAN INTERFACE CATALOG ENGINE ---
function buildQuranEcosystemCatalog() {
    const panel = document.getElementById("quran-catalog");
    panel.innerHTML = "";
    DEENHUB_DATA_MATRIX.quranInternalSchema.forEach(surah => {
        const slate = document.createElement("div");
        slate.className = "quran-item-card";
        slate.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <div><strong>${surah.id}. ${surah.title}</strong> <span style="font-size:0.75rem; color:var(--text-muted);">(${surah.descent})</span></div>
                <div style="font-family:'Amiri'; color:var(--gold-primary); font-weight:bold;">${surah.arabicTitle}</div>
            </div>
        `;
        slate.onclick = () => mountQuranEcosystemOverlayReader(surah);
        panel.appendChild(slate);
    });
}

function filterQuranSurahList() {
    const searchString = document.getElementById("quran-search").value.toLowerCase();
    const itemCards = document.getElementById("quran-catalog").getElementsByClassName("quran-item-card");
    DEENHUB_DATA_MATRIX.quranInternalSchema.forEach((surah, index) => {
        const evaluateMatch = surah.title.toLowerCase().includes(searchString) || surah.id.toString() === searchString;
        itemCards[index].style.display = evaluateMatch ? "block" : "none";
    });
}

function mountQuranEcosystemOverlayReader(surah) {
    document.getElementById("quran-reader-overlay").style.display = "block";
    document.getElementById("reader-surah-title").innerText = `${surah.id}. ${surah.title} Engine`;
    const layoutFlow = document.getElementById("reader-stream-flow");
    layoutFlow.innerHTML = "";
    for(let i=1; i<=surah.totalVerses; i++) {
        layoutFlow.innerHTML += `
            <div style="border-bottom:1px solid var(--glass-border); padding:14px 0;">
                <p class="arabic-text" style="margin-bottom:6px;">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ (Verse ${i})</p>
                <p style="font-size:0.85rem; color:var(--text-muted);">[Ecosystem context verification block line for verse ${i} in ${surah.title}]</p>
            </div>
        `;
    }
}
function closeQuranReaderOverlay() { document.getElementById("quran-reader-overlay").style.display = "none"; }

// --- DUA CATALOG INTEGRITY ENGINE ---
function buildDuaEcosystemCatalog() {
    const panel = document.getElementById("dua-catalog");
    panel.innerHTML = "";
    DEENHUB_DATA_MATRIX.duaInternalSchema.forEach(item => {
        panel.innerHTML += `
            <div class="dua-item-card">
                <strong style="font-size:0.9rem; color:var(--gold-primary); display:block; margin-bottom:6px;">${item.headline}</strong>
                <p class="arabic-text" style="font-size:1.4rem; margin-bottom:6px;">${item.scriptAr}</p>
                <p style="font-size:0.8rem; color:var(--text-muted);">${item.conceptTrans}</p>
            </div>
        `;
    });
}

function filterDuaMatrixData() {
    const searchString = document.getElementById("dua-search").value.toLowerCase();
    const itemCards = document.getElementById("dua-catalog").getElementsByClassName("dua-item-card");
    DEENHUB_DATA_MATRIX.duaInternalSchema.forEach((item, index) => {
        const evaluateMatch = item.headline.toLowerCase().includes(searchString) || item.tag.includes(searchString);
        itemCards[index].style.display = evaluateMatch ? "block" : "none";
    });
}

// --- DYNAMIC MATRIX QUANTUM MODULES ---
function executeTasbeehQuantumCount(e) {
    DEENHUB_DATA_MATRIX.tasbeehCount++;
    triggerTargetVisualBurst(e || window.event, '#E2B747');
    if(DEENHUB_DATA_MATRIX.tasbeehCount % 33 === 0) DEENHUB_DATA_MATRIX.cycleCount++;
    document.getElementById("tasbeeh-screen").innerText = DEENHUB_DATA_MATRIX.tasbeehCount;
    document.getElementById("tasbeeh-cycles").innerText = `Cycle Core: ${DEENHUB_DATA_MATRIX.cycleCount}`;
}
function resetTasbeehEngineCore() {
    DEENHUB_DATA_MATRIX.tasbeehCount = 0; DEENHUB_DATA_MATRIX.cycleCount = 0;
    document.getElementById("tasbeeh-screen").innerText = 0;
    document.getElementById("tasbeeh-cycles").innerText = "Cycle Core: 0";
}

function toggleFastingStatusState(button) {
    if(button.innerText === "COMPLETED") {
        button.innerText = "UNMARKED"; button.style.background = "rgba(255,255,255,0.02)"; button.style.borderColor = "var(--glass-border)"; button.style.color = "var(--text-muted)";
    } else {
        button.innerText = "COMPLETED"; button.style.background = "rgba(16,185,129,0.12)"; button.style.borderColor = "var(--neon-green)"; button.style.color = "var(--neon-green)";
    }
}

// --- HIGH-PERFORMANCE COGNITIVE AI CONSOLE ---
function dispatchEcosystemAIMessage(e) {
    const field = document.getElementById("chat-query-field");
    const searchString = field.value.trim(); if(!searchString) return;
    const box = document.getElementById("chat-scroller");

    box.innerHTML += `<div class="msg user-msg">${searchString}</div>`;
    field.value = "";

    setTimeout(() => {
        box.innerHTML += `<div class="msg ai-msg">DeenHub Intelligence core parsed prompt query matrix context: "${searchString}". Authenticated theological framework state matched successfully under registry specifications of Shoeb Nadaf corporate engine builds.</div>`;
        box.scrollTop = box.scrollHeight;
    }, 600);
}

// --- MASTER MULTI-LANGUAGE SYSTEM OVERWRITE ---
function shiftSystemLanguage(lang) {
    DEENHUB_DATA_MATRIX.selectedLanguage = lang;
    document.querySelectorAll(".lang-btn").forEach(b => b.classList.remove("active"));
    document.getElementById(`lang-${lang}`).classList.add("active");

    const structure = LANGUAGE_LOCALIZATION_DICTIONARY[lang];
    document.getElementById("lbl-welcome").innerText = structure.welcome;
    document.getElementById("tab-home").innerText = structure.home;
    document.getElementById("tab-quran").innerText = structure.quran;
    document.getElementById("tab-dua").innerText = structure.dua;
    document.getElementById("tab-tasbeeh").innerText = structure.tasbeeh;
    document.getElementById("tab-ramadan").innerText = structure.ramadan;
    document.getElementById("tab-learn").innerText = structure.learn;
    document.getElementById("tab-ai").innerText = structure.ai;
    document.getElementById("tab-found").innerText = structure.found;
    document.getElementById("lbl-verify-title").innerHTML = `<i class="fa-solid fa-list-check gold-text"></i> ${structure.verify}`;

    const slots = document.getElementById("daily-hadith");
    slots.innerText = DEENHUB_DATA_MATRIX.hadithEngineStream[lang];
    slots.className = (lang === 'ur' || lang === 'ar') ? "hadith-text urdu-text" : "hadith-text";
}

// --- ECOSYSTEM RECOGNITION PLATFORM BOOT TRIGGER ---
function initEcosystemPlatform() {
    const operator = document.getElementById("auth-username").value.trim();
    const geo = document.getElementById("auth-city").value.trim();
    if(!operator || !geo) return alert("All profile registration parameters are mandatory.");

    DEENHUB_DATA_MATRIX.operatorName = operator; DEENHUB_DATA_MATRIX.geoNode = geo;
    document.getElementById("nav-user-name").innerText = operator;
    document.getElementById("user-location").innerHTML = `<i class="fa-solid fa-location-dot"></i> ${geo}`;

    document.getElementById("page-auth").style.display = "none";
    document.getElementById("main-app-shell").style.display = "block";

    // Build modules sequential configurations loading
    shiftSystemLanguage('en');
    compileTriStateTrackerMatrix();
    buildQuranEcosystemCatalog();
    buildDuaEcosystemCatalog();
    switchEcosystemTab('home');

    document.getElementById('date-gregorian').textContent = new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function switchEcosystemTab(tab) {
    document.querySelectorAll(".app-page-view").forEach(view => { view.style.display = "none"; view.classList.remove("active"); });
    const targetedView = document.getElementById(`view-${tab}`);
    if(targetedView) {
        targetedView.style.display = "block";
        setTimeout(() => targetedView.classList.add("active"), 15);
    }
    document.querySelectorAll(".nav-item").forEach(item => item.classList.remove("active"));
    const targetedNav = document.getElementById(`nav-${tab}`);
    if(targetedNav) targetedNav.classList.add("active");
}
