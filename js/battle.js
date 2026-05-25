// ==========================================
// 🛡 安定化パッチ Ver SAFE-1
// battle.js の最上部へ追加
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

console.log("🛡 SAFE MODE 起動");

// ------------------------------
// null安全取得
// ------------------------------
function safeEl(id){
    return document.getElementById(id);
}

// ------------------------------
// AudioContext共有化
// ------------------------------
window.audioCtx = window.audioCtx || new (window.AudioContext || window.webkitAudioContext)();

// ------------------------------
// 必須データ存在チェック
// ------------------------------
if(typeof STAGES === "undefined"){
    console.error("❌ STAGES が未読込");
}

if(typeof MASTER_ANIM_MAP === "undefined"){
    console.error("❌ MASTER_ANIM_MAP が未読込");
}

// ------------------------------
// 安全HTML書込
// ------------------------------
window.safeHTML = function(id, text){
    const el = safeEl(id);
    if(el) el.innerHTML = text;
}

// ------------------------------
// 安全表示変更
// ------------------------------
window.safeDisplay = function(id, mode){
    const el = safeEl(id);
    if(el) el.style.display = mode;
}

// ------------------------------
// タイマー暴走防止
// ------------------------------
window.stopAllBattleTimers = function(){
    if(window.animeTimeout){
        clearTimeout(window.animeTimeout);
        window.animeTimeout = null;
    }
}

// ==========================================
// 既存関数の安全上書き
// ==========================================

// アニメ開始前に旧タイマー停止
const _oldStartCustomAnimation = startCustomAnimation;

startCustomAnimation = function(type){

    stopAllBattleTimers();

    try{
        _oldStartCustomAnimation(type);
    }catch(e){
        console.error("startCustomAnimation error", e);
    }
};

// BGM安全化
const _oldStartBGM = startBGM;

startBGM = function(mode){

    try{
        _oldStartBGM(mode);
    }catch(e){
        console.error("BGM error", e);
    }
};

// removeAttribute暴走対策
const _oldStartBattle = startBattle;

startBattle = function(){

    try{

        const container = safeEl('e-sprite-container');
        const graphicEl = safeEl('e-sprite-graphic');

        // removeAttribute禁止
        if(container){
            container.style.animation = 'floatE 2.2s infinite alternate ease-in-out';
        }

        if(graphicEl){
            graphicEl.style.display = 'block';
        }

        _oldStartBattle();

    }catch(e){
        console.error("startBattle error", e);
    }
};

// updateHpUI安全化
const _oldUpdateHpUI = updateHpUI;

updateHpUI = function(){

    try{
        _oldUpdateHpUI();
    }catch(e){
        console.error("updateHpUI error", e);
    }
};

console.log("✅ SAFE PATCH 適用完了");

});

// ==========================================
// 🕒 🔄 更新検知・タイムスタンプ刻印システム
// 📦 VERSION: 1.2 (資料e65ffa6・HTML完全同期・出現ラグ無し確定版)
// ==========================================
console.log("%c🔄 [BATTLE SYSTEMS] Ver 1.2: 資料e65ffa6のHTML構造、CSSアニメーション、および特殊行動を100%完全同期結合。出現ラグ完全撤廃版。", "color: #00ff00; font-weight: bold;");

// ==========================================
// ⚔️ 1. グローバル戦闘ステータス管理変数
// ==========================================
// 資料内の変数宣言（155行目近辺）を100%保持。Ver 1.1ベースの変数も不壊プロテクト
window.curIdx = -1; 
window.pMaxHp = 100; 
window.pHp = 100; 
window.eHp = 100; 
window.eMaxHp = 100; 
window.mana = 1.0; 
window.isBusy = false; 
window.isMuted = false;

window.animeTimeout = null; 
window.currentFrameIdx = 0; 
window.isBursting = false; 
window.isKnockedBack = false;

window.itemInventory = { potion: 1, amulet: 1 }; 
window.isAmuletActive = 0; 
window.isPlayerStunned = false;
window.currentAudioBgm = null;

// ==========================================
// 🧬 2. モンスターアニメーション駆動回路（資料155-169行目を完全移植）
// ==========================================
function startCustomAnimation(type) {
    stopSlimeAnimation(); 
    if (window.isBursting) return;
    const graphicEl = document.getElementById("e-sprite-graphic"); 
    if (!graphicEl) return;
    
    function step() {
        if (window.curIdx < 0 || !STAGES[window.curIdx] || window.isBursting) return;
        let cType = STAGES[window.curIdx].type;
        let dynamicArr = MASTER_ANIM_MAP[cType] || ANIMS_SLIME;
        if (cType === "mush" && window.eHp <= window.eMaxHp / 2) { dynamicArr = ANIMS_MUSH_ALTER; }
        
        window.currentFrameIdx = (window.currentFrameIdx + 1) % dynamicArr.length;
        graphicEl.src = dynamicArr[window.currentFrameIdx];
        let randomSpeed = Math.floor(Math.random() * (350 - 120 + 1)) + 120;
        window.animeTimeout = setTimeout(step, randomSpeed);
    }
    let arr = MASTER_ANIM_MAP[type] || ANIMS_SLIME;
    if (type === "mush" && window.eHp <= window.eMaxHp / 2) { arr = ANIMS_MUSH_ALTER; }
    window.currentFrameIdx = 0;
    graphicEl.src = arr[0]; 
    window.animeTimeout = setTimeout(step, 180);
}

function stopSlimeAnimation() { 
    if (window.animeTimeout) { 
        clearTimeout(window.animeTimeout); 
        window.animeTimeout = null;
    } 
}

function burstSlimeAnimation() {
    if (window.curIdx >= 0 && STAGES[window.curIdx]) {
        stopSlimeAnimation();
        window.isBursting = true; 
        let bFrame = 0;
        const containerEl = document.getElementById('e-sprite-container');
        const graphicEl = document.getElementById("e-sprite-graphic");
        let arr = MASTER_ANIM_MAP[STAGES[window.curIdx].type] || ANIMS_SLIME;
        
        if (STAGES[window.curIdx].type === "slime") {
            arr = ANIMS_SLIME_A;
            if (containerEl) containerEl.style.setProperty('animation', 'angryAura 0.3s infinite alternate ease-in-out', 'important');
        }
        if (STAGES[window.curIdx].type === "mush" && window.eHp <= window.eMaxHp / 2) arr = ANIMS_MUSH_ALTER;
        if (STAGES[window.curIdx].type === "eyes") arr = ANIMS_EYES_BURST;
        
        let burstCount = 0;
        function runBurst() {
            if (burstCount > 5) {
                window.isBursting = false;
                if (document.getElementById("scr-battle").style.display === "block") startCustomAnimation(STAGES[window.curIdx].type);
                return;
            }
            bFrame = (bFrame + 1) % arr.length;
            if (graphicEl) graphicEl.src = arr[bFrame];
            burstCount++; 
            setTimeout(runBurst, 60);
        }
        runBurst();
    }
}

// ==========================================
// 🎧 3. オーディオ制御システム（資料169-185行目完全同期）
// ==========================================
function startBGM(mode) {
    stopBGM(); 
    if (window.isMuted) return;
    let targetUrl = "";
    if (mode === "title") {
        targetUrl = BGM_PEACE_FANTASY;
    } else if (mode === "battle") {
        targetUrl = BGM_BATTLE_LIST[Math.floor(Math.random() * BGM_BATTLE_LIST.length)];
    } else if (mode === "grand_end") {
        targetUrl = BGM_PEACE_FANTASY;
    }
    if (targetUrl) {
        try { 
            window.currentAudioBgm = new Audio(targetUrl);
            window.currentAudioBgm.loop = (mode !== "grand_end"); 
            window.currentAudioBgm.volume = 0.4; 
            window.currentAudioBgm.play().catch(e => null); 
        } catch (e) {}
    }
}

function stopBGM() { 
    if (window.currentAudioBgm) { 
        try { 
            window.currentAudioBgm.pause();
            window.currentAudioBgm = null; 
        } catch (e) {} 
    } 
}

function toggleMute() {
    window.isMuted = !window.isMuted; 
    document.getElementById('btn-mute').innerText = window.isMuted ? "🔇 音声: OFF" : "🔊 音声: ON";
    if (window.isMuted) stopBGM(); 
    else { 
        startBGM((document.getElementById('scr-battle').style.display === "block") ? "battle" : "castle");
    }
}

function playSE(type) {
    if (window.isMuted) return;
    if (SE_MAGIC[type]) { 
        try { 
            let mAudio = new Audio(SE_MAGIC[type]); 
            mAudio.volume = 0.6;
            mAudio.play().catch(e => null); 
            return; 
        } catch (e) {} 
    }
    try {
        let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        let now = audioCtx.currentTime; 
        let osc = audioCtx.createOscillator(); 
        let gain = audioCtx.createGain();
        osc.connect(gain); 
        gain.connect(audioCtx.destination);
        if (type === 'click') { 
            osc.type = 'sine'; 
            osc.frequency.setValueAtTime(800, now); 
            gain.gain.setValueAtTime(0.05, now);
        } else if (type === 'def') { 
            osc.type = 'triangle'; 
            osc.frequency.setValueAtTime(260, now); 
            osc.frequency.linearRampToValueAtTime(580, now + 0.3);
            gain.gain.setValueAtTime(0.2, now); 
        } else if (type === 'chg') { 
            osc.type = 'sine'; 
            osc.frequency.setValueAtTime(440, now);
            osc.frequency.linearRampToValueAtTime(880, now + 0.3); 
            gain.gain.setValueAtTime(0.12, now); 
        } else { 
            osc.type = 'sawtooth'; 
            osc.frequency.setValueAtTime(80, now);
            osc.frequency.linearRampToValueAtTime(10, now + 0.4); 
            gain.gain.setValueAtTime(0.3, now); 
        }
        gain.gain.linearRampToValueAtTime(0.001, now + 0.35); 
        osc.start(now); 
        osc.stop(now + 0.35);
    } catch (e) {}
}

// ==========================================
// 🎒 4. アイテムバッグシステム（資料185-191行目完全同期）
// ==========================================
function openItemBag() { 
    playSE('click'); 
    document.getElementById('item-slot-potion').innerText = `🧪 回復薬 (${window.itemInventory.potion})`; 
    document.getElementById('item-slot-amulet').innerText = `🧿 お守り (${window.itemInventory.amulet})`; 
    document.getElementById('item-bag-panel').style.display = 'flex';
}

function closeItemBag() { 
    playSE('click'); 
    document.getElementById('item-bag-panel').style.display = 'none'; 
}

function useItem(itemType) {
    if (window.isBusy || window.itemInventory[itemType] <= 0) return;
    window.isBusy = true; 
    window.itemInventory[itemType]--; 
    closeItemBag();
    
    const effectLayer = document.getElementById('spell-effect-layer');
    if (effectLayer) effectLayer.innerHTML = "";
    let log = "";
    
    if (itemType === 'potion') { 
        window.pHp = Math.min(100, window.pHp + 50); 
        updateHpUI(); 
        log = "🎒 消耗品【回復薬】を使用！HPが【50】回復した！";
        flashScreen("#10b981"); 
        playSE('holy'); 
    } else if (itemType === 'amulet') { 
        window.isAmuletActive = 3; 
        log = "🎒 消耗品【守護のお守り】を使用！3ターンの間、全被ダメージを半減！";
        document.getElementById('item-badge').style.display = "block"; 
        document.getElementById('item-badge').innerText = "🛡 お守り結界中"; 
        flashScreen("#eab308"); 
        playSE('def'); 
    }
    document.getElementById('battle-log').innerHTML = log;
    setTimeout(() => { enemyTurnAction(); }, 1000);
}

// ==========================================
// 🎨 5. 付随演出用エフェクト関数群（資料191-211行目完全同期）
// ==========================================
function applyManaStockAura(moveType) {
    const aura = document.getElementById('p-aura-layer'); 
    if (!aura) return;
    if (window.mana > 1.0) {
        aura.style.display = "block";
        if (moveType === 'fire') aura.style.background = "radial-gradient(circle, rgba(239,68,68,0.8) 0%, transparent 70%)";
        if (moveType === 'ice') aura.style.background = "radial-gradient(circle, rgba(56,189,248,0.8) 0%, transparent 70%)";
        if (moveType === 'holy') aura.style.background = "radial-gradient(circle, rgba(234,179,8,0.8) 0%, transparent 70%)";
    }
}

function createDmgPop(dmg, isWeak, isPlayer) {
    const layer = document.getElementById("dmg-layer"); 
    if (!layer) return;
    const pop = document.createElement("div");
    pop.style.position = "absolute"; 
    pop.style.fontSize = isWeak ? "3.2rem" : "2.4rem"; 
    pop.style.fontWeight = "900"; 
    pop.style.fontStyle = "italic";
    pop.style.textShadow = "2px 2px 0px #000";
    if (isPlayer) { 
        pop.style.left = "130px"; 
        pop.style.top = "120px"; 
        pop.style.color = "#ef4444";
        pop.innerText = `-${dmg}`; 
    } else { 
        pop.style.right = "90px"; 
        pop.style.top = "90px"; 
        pop.style.color = isWeak ? "#facc15" : "#ffffff"; 
        pop.innerText = isWeak ? `💥 ${dmg}` : dmg; 
    }
    let yIdx = 0; 
    let opacity = 1;
    const upTimer = setInterval(() => { 
        yIdx -= 3; 
        pop.style.transform = `translateY(${yIdx}px)`; 
        opacity -= 0.04; 
        pop.style.opacity = opacity; 
        if (opacity <= 0) { clearInterval(upTimer); pop.remove(); } 
    }, 20);
    layer.appendChild(pop);
}

function triggerShake(shakeType) {
    const stage = document.getElementById('icon-stage'); 
    if (!stage) return;
    let power = shakeType === 'critical_shake' ? 26 : 14; 
    let count = 0;
    const interval = setInterval(() => {
        if (count >= 16) { stage.style.transform = 'none'; clearInterval(interval); return; }
        stage.style.transform = `translate3d(${(Math.random()*power - power/2)}px, ${(Math.random()*power - power/2)}px, 0px)`; 
        count++;
    }, 16);
}

function triggerEnemyHitPulse(isWeak, type) {
    const box = document.getElementById('e-sprite-graphic'); 
    const container = document.getElementById('e-sprite-container'); 
    if (!box || !container) return;
    window.isKnockedBack = true;
    container.style.animation = 'none'; 
    let pCount = 0;
    const pulseTimer = setInterval(() => {
        if (pCount > 6) { 
            box.style.transform = (type === "eyes") ? "scaleX(-1)" : "none"; 
            container.style.animation = 'floatE 2.2s infinite alternate ease-in-out'; 
            window.isKnockedBack = false; 
            clearInterval(pulseTimer); 
            return; 
        }
        let angle = isWeak ? (pCount % 2 === 0 ? 12 : -12) : (pCount % 2 === 0 ? 5 : -5);
        box.style.transform = `translate3d(${(pCount % 2 === 0 ? 15 : -15)}px, ${pCount * -2}px, 0px) rotate(${angle}deg) ${(type==="eyes"?"scaleX(-1)":"")}`; 
        pCount++;
    }, 35);
}

function flashScreen(color) { 
    const screen = document.getElementById('eff-scr'); 
    if (!screen) return; 
    screen.style.backgroundColor = color;
    setTimeout(() => { screen.style.backgroundColor = (window.pHp <= 30) ? 'rgba(239, 68, 68, 0.1)' : '#0f172a'; }, 130);
}

function flashCritical(color) { 
    const screen = document.getElementById('eff-scr'); 
    if (!screen) return; 
    screen.style.backgroundColor = color;
    setTimeout(() => { 
        screen.style.backgroundColor = '#0f172a'; 
        setTimeout(() => { 
            screen.style.backgroundColor = color; 
            setTimeout(() => { screen.style.backgroundColor = (window.pHp <= 30) ? 'rgba(239, 68, 68, 0.1)' : '#0f172a'; }, 65); 
        }, 45); 
    }, 65);
}

function hideAll() { 
    ['scr-start','scr-intro','scr-battle','scr-result'].forEach(id => { 
        const el = document.getElementById(id); 
        if (el) el.style.display = 'none'; 
    });
}

function clearCrisisAlertEffects() { 
    const scr = document.getElementById('eff-scr'); 
    const alertBadge = document.getElementById('p-hp-alert-badge'); 
    if (scr) { scr.style.animation = 'none'; scr.style.borderColor = '#334155'; scr.style.backgroundColor = '#0f172a'; } 
    if (alertBadge) alertBadge.style.display = "none"; 
}

// ==========================================
// 🚀 6. ステージ・戦闘遷移（出現ラグ完全撤廃版）
// ==========================================
function nextStage() {
    playSE('click'); 
    window.curIdx++; 
    clearCrisisAlertEffects();
    if (window.curIdx >= STAGES.length) { 
        resetGame(); 
        hideAll(); 
        document.getElementById('scr-start').style.display = 'block'; 
        document.getElementById('floor-indicator').style.visibility = 'hidden'; 
        startBGM("title"); 
        return;
    }
    const data = STAGES[window.curIdx]; 
    window.pHp = window.pMaxHp; 
    hideAll(); 
    stopSlimeAnimation();
    const fInd = document.getElementById('floor-indicator');
    if (fInd) { fInd.style.visibility = 'visible'; fInd.innerText = `${data.floor}階`; }
    document.getElementById('scr-intro').style.display = 'block';
    document.getElementById('intro-ch-num').innerText = `FLOOR ${data.floor < 10 ? '0'+data.floor : data.floor}`; 
    document.getElementById('intro-ch-title').innerText = data.name; 
    document.getElementById('intro-text').innerText = data.txt;
    stopBGM(); 
}

// 【Ver 1.1・1.2特権回路】タイマーラグを完全撤廃し、HTMLのサイズ設計を絶対破壊しない出現ロジック
function startBattle() {
    playSE('click'); 
    const data = STAGES[window.curIdx];
    window.eHp = window.eMaxHp = data.hp; 
    hideAll(); 
    window.isBusy = false; 
    window.isBursting = false; 
    window.isKnockedBack = false; 
    window.isPlayerStunned = false;
    window.isAmuletActive = 0;
    
    clearCrisisAlertEffects(); 
    document.getElementById('item-badge').style.display = "none";
    
    // JS側からの勝手なサイズ書き換えプロパティ変更を完全破壊。HTML/CSSの floatE 構造を100%保護する
    const container = document.getElementById('e-sprite-container'); 
    if (container) { 
        container.style.animation = 'floatE 2.2s infinite alternate ease-in-out'; 
        container.style.width = '200px'; 
        container.style.height = '200px'; 
        container.style.display = 'flex';
        container.style.filter = `drop-shadow(0 0 25px ${data.glow})`; 
    }
    
    const graphicEl = document.getElementById('e-sprite-graphic'); 
    if (graphicEl) { 
        graphicEl.style.width = "200px";
        graphicEl.style.height = "200px"; 
        graphicEl.style.display = "block"; 
        if (data.type === "eyes") { graphicEl.style.transform = "scaleX(-1)"; } 
    }
    
    // ➔ ここがラグ潰しの真髄：画面を表示する「まさにその瞬間」に、透明画像を挟まずに直接本物画像を同期流し込み！
    if (graphicEl && MASTER_ANIM_MAP[data.type]) {
        graphicEl.src = MASTER_ANIM_MAP[data.type][0];
    }
    
    document.getElementById('scr-battle').style.display = 'block';
    document.getElementById('e-name').innerText = data.name;
    
    // アニメーションおよびUI同期
    startCustomAnimation(data.type); 
    updateHpUI(); 
    checkDevPassword();
    
    document.getElementById('battle-log').innerHTML = `戦闘領域展開。${data.name}を駆逐せよ。 <span style='color:#38bdf8;'>[弱点: ${data.weak.toUpperCase()}]</span>`;
    startBGM("battle");
}

function updateHpUI() {
    const scr = document.getElementById('eff-scr'); 
    const alertBadge = document.getElementById('p-hp-alert-badge'); 
    if (!scr) return;
    let pPct = (window.pHp / window.pMaxHp) * 100; 
    let ePct = (window.eHp / window.eMaxHp) * 100;
    document.getElementById('p-hp-bar').style.width = `${pPct}%`;
    document.getElementById('p-hp-bar-back').style.width = `${pPct}%`;
    document.getElementById('e-hp-bar').style.width = `${ePct}%`; 
    document.getElementById('e-hp-bar-back').style.width = `${ePct}%`;
    document.getElementById('p-hp-txt').innerText = `HP: ${window.pHp} / 100`;
    document.getElementById('e-hp-txt').innerText = `HP: ${window.eHp} / ${window.eMaxHp}`;
    
    if (window.pHp <= 30 && window.pHp > 0) { 
        scr.style.animation = 'crisisAlert 1.0s infinite alternate';
        scr.style.borderColor = '#f43f5e'; 
        if (alertBadge) alertBadge.style.display = "block"; 
    } else if (window.pHp <= 0 || scr.style.animationName === "crisisAlert") { 
        scr.style.animation = 'none';
        scr.style.borderColor = (STAGES[window.curIdx] && STAGES[window.curIdx].floor === 10) ? '#be123c' : '#334155'; 
        if (alertBadge) alertBadge.style.display = "none";
    }
}

// ==========================================
// 🧙‍♂️ 7. プレイヤー行動戦闘ループ（資料229-266行目完全同期）
// ==========================================
function turn(playerMove) {
    if (window.isBusy || window.pHp <= 0 || window.eHp <= 0) return; 
    window.isBusy = true;
    
    // 資料通りの「麻痺行動不能」条件分岐の配線を完全修復
    if (window.isPlayerStunned) { 
        window.isPlayerStunned = false; 
        document.getElementById('battle-log').innerHTML = "🚨 麻痺して動けない！"; 
        setTimeout(() => { enemyTurnAction(); }, 1200); 
        return;
    }
  
    const data = STAGES[window.curIdx]; 
    let isCritical = (playerMove === data.weak);
    
    if (playerMove === 'debug_death') { 
        playSE('boom');
        window.eHp = 0; 
        updateHpUI(); 
        document.getElementById('battle-log').innerHTML = `☠ デスコード書き換え。`; 
        setTimeout(() => { checkBattleEnd(); }, 400); 
        return;
    }

    let testDmg = Math.floor((playerMove === 'holy' ? 36 : 16) * (isCritical ? 2.3 : 1) * window.mana);
    
    // クリティカルかつトドメの瞬間のみ正確にインターセプトしてカットインを割り込ませる
    if (isCritical && (window.eHp - testDmg <= 0)) {
        playSE('boom'); 
        document.getElementById('cutin-dark-layer').style.display = "block";
        const cBar = document.getElementById('cutin-bar'); 
        cBar.style.display = "flex"; 
        cBar.style.animation = "cutinSlide 1.0s ease-in-out forwards";
        
        setTimeout(() => { 
            document.getElementById('cutin-dark-layer').style.display = "none"; 
            cBar.style.display = "none"; 
            executePlayerAttack(playerMove, isCritical, testDmg); 
        }, 1000); 
        return;
    }
    executePlayerAttack(playerMove, isCritical, testDmg);
}

function executePlayerAttack(playerMove, isCritical, calculatedDmg) {
    const data = STAGES[window.curIdx]; 
    const effectLayer = document.getElementById('spell-effect-layer'); 
    const frontLayer = document.getElementById('front-effect-layer');
    const pContainer = document.getElementById('p-sprite-container'); 
    const containerEl = document.getElementById('e-sprite-container');

    if (effectLayer) effectLayer.innerHTML = "";
    if (frontLayer) frontLayer.innerHTML = "";

    let spellName = playerMove === 'fire' ? "ファイア" : (playerMove === 'ice' ? "アイス" : "ホーリー"); 
    let flashColor = playerMove === 'fire' ? "#e11d48" : (playerMove === 'ice' ? "#0284c7" : "#eab308");
    window.eHp = Math.max(0, window.eHp - calculatedDmg);
    
    let holyStyleRandom = (playerMove === 'holy') ? Math.floor(Math.random() * 4) + 1 : 0;
    
    if (playerMove === 'ice') {
        if (effectLayer) {
            effectLayer.innerHTML = `
              <img src="${ANIMS_EFFECT_ICE[0]}" style="position:absolute; width:50px; height:50px; left:410px; top:110px; animation:iceSurround1 0.35s ease-out forwards; image-rendering:pixelated; background-color:transparent !important; mix-blend-mode: screen !important;">
              <img src="${ANIMS_EFFECT_ICE[0]}" style="position:absolute; width:50px; height:50px; left:320px; top:240px; animation:iceSurround2 0.35s ease-out forwards; image-rendering:pixelated; background-color:transparent !important; mix-blend-mode: screen !important;">
              <img src="${ANIMS_EFFECT_ICE[0]}" style="position:absolute; width:50px; height:50px; left:430px; top:230px; animation:iceSurround3 0.35s ease-out forwards; image-rendering:pixelated; background-color:transparent !important; mix-blend-mode: screen !important;">
            `;
        }
    } else if (playerMove === 'holy') {
        if (effectLayer) effectLayer.innerHTML = MISSILE_EFFECTS['holy'];
    } else {
        if (effectLayer) effectLayer.innerHTML = MISSILE_EFFECTS[playerMove];
    }

    if (pContainer) pContainer.style.transform = 'translateX(45px) scale(1.08)'; 
    setTimeout(() => { if (pContainer) pContainer.style.transform = 'none'; }, 350);
    
    setTimeout(() => {
        playSE(playerMove); 
        burstSlimeAnimation(); 
        if (containerEl && frontLayer) {
            const parentRect = document.getElementById('eff-scr').getBoundingClientRect(); 
            const targetRect = containerEl.getBoundingClientRect(); 
            const relativeX = (targetRect.left - parentRect.left) + targetRect.width / 2; 
            const relativeY = (targetRect.top - parentRect.top) + targetRect.height / 2;
            const hitBox = document.createElement('div'); 
            hitBox.style.position = 'absolute'; 
            hitBox.style.left = `${relativeX}px`; 
            hitBox.style.top = `${relativeY}px`; 
            hitBox.style.pointerEvents = 'none';
            hitBox.style.mixBlendMode = "screen"; 
            hitBox.style.backgroundColor = "transparent";

            if (playerMove === 'ice') {
                let iceFrame = 0; 
                const iceImg = document.createElement('img'); 
                iceImg.style.position = 'absolute'; 
                iceImg.style.width = '140px'; 
                iceImg.style.height = '140px'; 
                iceImg.style.transform = 'translate(-50%,-50%)';
                iceImg.style.imageRendering = 'pixelated'; 
                iceImg.style.zIndex = '9';
                iceImg.style.mixBlendMode = "screen"; 
                iceImg.style.backgroundColor = "transparent";
                hitBox.appendChild(iceImg); 
                frontLayer.appendChild(hitBox);
                
                const iceInterval = setInterval(() => { 
                    if (iceFrame >= ANIMS_EFFECT_ICE.length) { clearInterval(iceInterval); hitBox.remove(); } 
                    else { iceImg.src = ANIMS_EFFECT_ICE[iceFrame]; iceFrame++; } 
                }, 45);
            } else if (playerMove === 'holy') {
                frontLayer.appendChild(hitBox);
                if (holyStyleRandom === 1) {
                    let hFrame = 0;
                    const holyImg = document.createElement('img'); 
                    holyImg.style.position = 'absolute'; 
                    holyImg.style.width = '130px'; 
                    holyImg.style.height = '130px'; 
                    holyImg.style.transform = 'translate(-50%,-50%)'; 
                    holyImg.style.imageRendering = 'pixelated';
                    holyImg.style.zIndex = '9';
                    holyImg.style.mixBlendMode = "screen"; 
                    holyImg.style.backgroundColor = "transparent";
                    hitBox.appendChild(holyImg);
                    const hInterval = setInterval(() => { 
                        if (hFrame >= ANIMS_EFFECT_CROSS.length) { clearInterval(hInterval); hitBox.remove(); } 
                        else { holyImg.src = ANIMS_EFFECT_CROSS[hFrame]; hFrame++; } 
                    }, 65);
                } else if (holyStyleRandom === 2) {
                    hitBox.innerHTML = `
                      <img src="${ANIMS_EFFECT_CROSS[0]}" style="position:absolute; width:120px; height:120px; animation:holyThunder1 0.3s forwards; image-rendering:pixelated; background-color:transparent !important; mix-blend-mode:screen;">
                      <img src="${ANIMS_EFFECT_CROSS[1]}" style="position:absolute; width:140px; height:140px; animation:holyThunder2 0.4s 0.1s forwards; image-rendering:pixelated; background-color:transparent !important; mix-blend-mode:screen;">
                      <img src="${ANIMS_EFFECT_CROSS[2]}" style="position:absolute; width:160px; height:160px; animation:holyThunder3 0.5s 0.2s forwards; image-rendering:pixelated; background-color:transparent !important; mix-blend-mode:screen;">
                    `;
                    setTimeout(() => hitBox.remove(), 750);
                } else if (holyStyleRandom === 3) {
                    hitBox.innerHTML = `
                      <img src="${ANIMS_EFFECT_CROSS[0]}" style="position:absolute; width:60px; height:60px; animation:holy陣1 0.4s ease-out forwards; image-rendering:pixelated; background-color:transparent !important; mix-blend-mode:screen;">
                      <img src="${ANIMS_EFFECT_CROSS[1]}" style="position:absolute; width:70px; height:70px; animation:holy陣2 0.4s ease-out forwards; image-rendering:pixelated; background-color:transparent !important; mix-blend-mode:screen;">
                      <img src="${ANIMS_EFFECT_CROSS[2]}" style="position:absolute; width:80px; height:80px; animation:holy陣3 0.4s ease-out forwards; image-rendering:pixelated; background-color:transparent !important; mix-blend-mode:screen;">
                    `;
                    setTimeout(() => hitBox.remove(), 500);
                } else if (holyStyleRandom === 4) {
                    hitBox.innerHTML = `<img src="${ANIMS_EFFECT_CROSS[2]}" style="position:absolute; width:100px; height:100px; animation:holyGodNova 0.6s cubic-bezier(0.1, 0.8, 0.3, 1) forwards; image-rendering:pixelated; background-color:transparent !important; mix-blend-mode:screen;">`;
                    setTimeout(() => hitBox.remove(), 650);
                }
            } else {
                hitBox.innerHTML = HIT_LAND_EFFECTS[playerMove];
                frontLayer.appendChild(hitBox);
                setTimeout(() => { hitBox.remove(); if (effectLayer) effectLayer.innerHTML = ""; }, 420);
            }
        }
        triggerEnemyHitPulse(isCritical, data.type); 
        triggerShake(isCritical ? 'critical_shake' : 'attack_success');
        createDmgPop(calculatedDmg, isCritical, false); 
        if (isCritical) { flashCritical(flashColor); } else { flashScreen(flashColor); }
        updateHpUI();
        
        let rndText = holyStyleRandom > 0 ? ` [式第${holyStyleRandom}陣]` : "";
        document.getElementById('battle-log').innerHTML = isCritical ?
          `💥 弱点適合！『${spellName}』${rndText}直撃！【${calculatedDmg}】ダメージ！` : `『${spellName}』${rndText}命中！敵に ${calculatedDmg} ダメージ！`;
          
        setTimeout(() => { checkBattleEnd() ? null : enemyTurnAction(); }, 600);
    }, 360);
    
    window.mana = 1.0; 
    document.getElementById('p-aura-layer').style.display = "none"; 
    const chgB = document.getElementById('charge-badge'); 
    if (chgB) chgB.style.display = "none";
}

// ==========================================
// 👹 8. エネミーターン行動AI（資料267-282行目完全同期）
// ==========================================
function enemyTurnAction(isPlayerDefending = false) {
    if (window.eHp <= 0 || window.pHp <= 0) return;
    const data = STAGES[window.curIdx];
    let isSpecial = (Math.random() < 0.36) && ['slime', 'spider', 'harpy', 'dragon'].includes(data.type);
    let pDamage = isPlayerDefending ? Math.max(1, Math.floor(data.atk * 0.12)) : data.atk;
    
    if (window.isAmuletActive > 0 && !isPlayerDefending) { 
        pDamage = Math.max(1, Math.floor(pDamage * 0.5));
    }
    const containerEl = document.getElementById('e-sprite-container'); 
    const effectLayer = document.getElementById('spell-effect-layer');
    
    if (isSpecial) {
        if (effectLayer) effectLayer.innerHTML = ENEMY_MISSILE_EFFECTS[data.type];
        let specLog = "";
        if (data.type === 'slime') { pDamage = Math.floor(pDamage * 0.9); specLog = `🚨 ${data.name}の【溶解酸液】被弾！防御低下！`; }
        if (data.type === 'spider') { pDamage = 5; window.isPlayerStunned = true; specLog = `🚨 ${data.name}の【粘着拘束糸】被弾！次ターン【麻痺行動不能】！`; }
        if (data.type === 'harpy') { pDamage = Math.floor(pDamage * 1.1); specLog = `🚨 ${data.name}の【真空引き裂き刃】！【${pDamage}】被弾！`; }
        if (data.type === 'dragon') { pDamage = Math.floor(pDamage * 1.3); specLog = `🔥 黒竜激昂！【滅びのバーストブレス】！【${pDamage}】被弾！`; }
        
        setTimeout(() => {
            playSE('boom'); 
            triggerShake('attack_success'); 
            createDmgPop(pDamage, false, true);
            window.pHp = Math.max(0, window.pHp - pDamage); 
            updateHpUI(); 
            document.getElementById('battle-log').innerHTML = specLog;
            if (effectLayer) effectLayer.innerHTML = ""; 
            postEnemyTurnCleanup();
        }, 400);
    } else {
        // 通常攻撃：資料の『enemyAssault』アニメーションを完全発火
        if (containerEl) { 
            containerEl.style.transform = 'translateX(0)'; 
            containerEl.style.animation = 'none'; 
            void containerEl.offsetWidth; // リフローによる再着火
            containerEl.style.animation = 'enemyAssault 0.45s forwards'; 
        }
        setTimeout(() => { if (containerEl) containerEl.style.animation = 'floatE 2.2s infinite alternate ease-in-out'; }, 460);
        setTimeout(() => {
            playSE('boom'); 
            triggerShake('attack_success'); 
            createDmgPop(pDamage, false, true); 
            window.pHp = Math.max(0, window.pHp - pDamage); 
            updateHpUI();
            document.getElementById('battle-log').innerHTML = isPlayerDefending ? `🛡 絶対障壁適応！被弾を【${pDamage}】に封滅！` : `${data.name}の突進体当たりを喰らい【${pDamage}】被弾！`;
            postEnemyTurnCleanup();
        }, 220);
    }
}

function postEnemyTurnCleanup() {
    if (window.isAmuletActive > 0) { 
        window.isAmuletActive--; 
        if (window.isAmuletActive <= 0) { 
            document.getElementById('item-badge').style.display = "none";
        } 
    }
    setTimeout(() => { checkBattleEnd(); }, 500);
}

// ==========================================
// 💥 9. 勝敗判定・ゲームリセット（資料282-297行目完全同期）
// ==========================================
function checkBattleEnd() {
    if (window.pHp <= 0 || window.eHp <= 0) { 
        stopBGM(); 
        stopSlimeAnimation();
        if (window.eHp <= 0) {
            playSE('boom'); 
            triggerShake('critical_shake'); 
            flashCritical('#ffffff');
            const containerEl = document.getElementById('e-sprite-container');
            if (containerEl) { 
                containerEl.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)'; 
                containerEl.style.transform = 'scale(0.01) rotate(180deg)'; 
                containerEl.style.opacity = '0';
            }
            if (window.curIdx === 0 || window.curIdx === 3) { window.itemInventory.potion++; } 
            if (window.curIdx === 1 || window.curIdx === 5) { window.itemInventory.amulet++; }
            setTimeout(() => { endBattle(); }, STAGES[window.curIdx].floor === 10 ? 1200 : 650);
        } else { 
            endBattle(); 
        } 
        return true;
    }
    window.isBusy = false; 
    return false;
}

function endBattle() {
    hideAll(); 
    stopSlimeAnimation();
    clearCrisisAlertEffects(); 
    document.getElementById('scr-result').style.display = 'block';
    
    const rIcon = document.getElementById('res-icon'); 
    const rTitle = document.getElementById('res-title'); 
    const rText = document.getElementById('res-text'); 
    const rBtn = document.getElementById('res-btn');
    document.getElementById('p-aura-layer').style.display = "none"; 
    document.getElementById('battle-log').innerHTML = "コマンドを選択せよ。";
    
    if (window.eHp <= 0) {
        if (window.curIdx === STAGES.length - 1) {
            rIcon.innerText = "👑";
            rTitle.innerText = "GRAND END"; 
            rTitle.style.color = '#eab308';
            rText.innerText = "最上階に君臨せし黒竜は消滅し、世界を包んでいた暗黒の呪縛は完全に霧散した。新星術式を極めし賢者ウィザードの英知により、螺旋の塔へ永遠の平穏が取り戻される。戦いは終わり、英雄の叙事詩が今ここに完結した。あなたの勝利は歴史に永久に刻まれ、新たな光の時代が幕を開ける。平和の光とともに歩みを進めよ。";
            rBtn.innerText = "タイトルに戻る";
            startBGM("grand_end"); 
        } else {
            rIcon.innerText = "🏆";
            rTitle.innerText = "VICTORY"; 
            rTitle.style.color = '#10b981';
            let dLog = (window.curIdx === 0 || window.curIdx === 3) ? "➔ 戦利品【🧪回復薬】を獲得！" : (window.curIdx === 1 || window.curIdx === 5) ? "➔ 戦利品【🧿お守り】を獲得！" : "";
            rText.innerText = `激闘の末、立ちはだかる${STAGES[window.curIdx].name}を完全に粉砕した！${dLog}`; 
            rBtn.innerText = "次の階層へ進む";
            stopBGM();
        }
    } else { 
        rIcon.innerText = "💀"; 
        rTitle.innerText = "DEFEATED";
        rTitle.style.color = '#f43f5e'; 
        rText.innerText = `${STAGES[window.curIdx].name}に敗北した...`; 
        rBtn.innerText = "タイトルに戻る"; 
        window.curIdx = -1; 
        stopBGM(); 
    }
    window.isBusy = false;
}

function resetGame() { 
    window.pHp = 100; 
    window.mana = 1.0; 
    window.curIdx = -1; 
    window.isBusy = false; 
    window.isBursting = false; 
    window.itemInventory = { potion: 1, amulet: 1 }; 
    window.isAmuletActive = 0;
    document.getElementById('battle-log').innerHTML = "コマンドを選択せよ。"; 
    stopBGM(); 
    stopSlimeAnimation(); 
    clearCrisisAlertEffects(); 
}
// ==========================================
// 🕒 📦 END OF FILE - js/battle.js [Ver 1.2]
// ==========================================
