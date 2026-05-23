// ==========================================
// ⚔️ 1. グローバル戦闘ステータス管理変数（全ファイル共有解放版）
// ==========================================
window.curIdx = -1; 
window.pMaxHp = 100; 
window.pHp = 100; 
window.eHp = 100; 
window.eMaxHp = 100; 
window.mana = 1.0; 
window.isBusy = false;

window.itemInventory = { potion: 1, amulet: 1 }; 
window.isAmuletActive = 0; 
window.isPlayerStunned = false;

window.enemyMana = 1.0; 
window.isEnemyShieldActive = false;

// ==========================================
// 🧙‍♂️ 2. プレイヤー行動・アイテムロジック
// ==========================================
function useItem(itemType) {
    if (window.isBusy || window.itemInventory[itemType] <= 0) return;
    window.isBusy = true; 
    window.itemInventory[itemType]--; 
    closeItemBag();
    const effLayer = document.getElementById('spell-effect-layer');
    if (effLayer) effLayer.innerHTML = "";
    const logEl = document.getElementById('battle-log');
    if (itemType === 'potion') { 
        window.pHp = Math.min(window.pMaxHp, window.pHp + 50); 
        if (logEl) logEl.innerText = "🎒 回復薬を使用！HPが50回復！"; 
    } else { 
        window.isAmuletActive = 3; 
        const badge = document.getElementById('item-badge');
        if (badge) badge.style.display = "block"; 
        if (logEl) logEl.innerText = "🎒 お守りを使用！3ターン被ダメ半減！"; 
    }
    updateHpUI(); 
    setTimeout(enemyTurnAction, 1000);
}

function nextStage() {
    closeItemBag(); 
    window.curIdx++;
    if (window.curIdx >= STAGES.length) { resetGame(); showScreen('scr-start'); const indicator = document.getElementById('floor-indicator'); if (indicator) indicator.style.visibility = 'hidden'; startBGM("title"); return; }
    const data = STAGES[window.curIdx]; 
    if (!window.isDebugUnlocked) { window.pMaxHp = 100; window.pHp = 100; }
    const indicator = document.getElementById('floor-indicator');
    if (indicator) { indicator.style.visibility = 'visible'; indicator.innerText = `${data.floor}階`; }
    const chNum = document.getElementById('intro-ch-num');
    const chTitle = document.getElementById('intro-ch-title');
    const introTxt = document.getElementById('intro-text');
    if (chNum) chNum.innerText = `FLOOR 0${data.floor}`; 
    if (chTitle) chTitle.innerText = data.name; 
    if (introTxt) introTxt.innerText = data.txt;
    showScreen('scr-intro'); 
    stopBGM();
}

function startBattle() {
    const data = STAGES[window.curIdx]; 
    window.eHp = window.eMaxHp = data.hp; 
    window.isBusy = false; 
    window.isPlayerStunned = false; 
    window.isAmuletActive = 0; 
    window.enemyMana = 1.0; 
    window.isEnemyShieldActive = false;
    const eContainer = document.getElementById('e-sprite-container');
    if (eContainer) { eContainer.style.opacity = "1"; eContainer.style.transform = "scale(1)"; }
    const pGraphic = document.getElementById('p-sprite-graphic');
    if (pGraphic) pGraphic.src = getAssetPath('hero', 'Wizard.png');
    const itemBadge = document.getElementById('item-badge');
    const chargeBadge = document.getElementById('charge-badge');
    const eName = document.getElementById('e-name');
    const eGraphic = document.getElementById('e-sprite-graphic');
    const logEl = document.getElementById('battle-log');
    if (itemBadge) itemBadge.style.display = "none"; 
    if (chargeBadge) chargeBadge.style.display = "none";
    if (eName) eName.innerText = data.name;
    if (eGraphic) eGraphic.src = MASTER_ANIM_MAP[data.type][0];
    showScreen('scr-battle'); 
    startCustomAnimation(data.type); 
    updateHpUI(); 
    checkDevPassword();
    if (logEl) logEl.innerHTML = `${data.name}が現れた！弱点: ${data.weak.toUpperCase()}`;
    startBGM("battle");
}

// ==========================================
// 💥 3. 勝敗判定・ゲームリセットロジック
// ==========================================
function checkBattleEnd() {
    if (window.pHp <= 0 || window.eHp <= 0) { 
        stopBGM(); 
        stopSlimeAnimation();
        if (window.eHp <= 0) {
            playSE(SOUND_FREEZE_DEAD);
            const eContainer = document.getElementById('e-sprite-container');
            if (eContainer) { eContainer.style.opacity = "0"; eContainer.style.transform = "scale(0.5)"; }
            setTimeout(() => { transitionToResult(); }, 800);
        } else { 
            transitionToResult(); 
        }
        return true;
    }
    return false;
}

function transitionToResult() {
    showScreen('scr-result');
    const rTitle = document.getElementById('res-title'); 
    const rText = document.getElementById('res-text'); 
    const rBtn = document.getElementById('res-btn');
    if (window.eHp <= 0) {
        if (window.curIdx === STAGES.length - 1) {
            if (rTitle) rTitle.innerText = "GRAND END"; 
            if (rText) rText.innerText = "最上階の暗黒竜を討伐し、螺旋の塔に永遠の平穏が訪れた！1周目完全クリアおめでとうございます！"; 
            if (rBtn) rBtn.innerText = "タイトルへ戻る"; 
            startBGM("grand_end"); 
        } else {
            if (rTitle) rTitle.innerText = "VICTORY"; 
            if (rText) rText.innerText = `${STAGES[window.curIdx].name}を撃破した！次の階層への扉が開く。`; 
            if (rBtn) rBtn.innerText = "次へ進む";
        }
    } else {
        if (rTitle) rTitle.innerText = "DEFEATED"; 
        if (rText) rText.innerText = "目の前が真っ暗になった..."; 
        if (rBtn) rBtn.innerText = "タイトルへ戻る"; 
        window.curIdx = -1;
    }
    window.isBusy = false;
}

function resetGame() { 
    if (!window.isDebugUnlocked) { window.pMaxHp = 100; window.pHp = 100; } else { window.pMaxHp = 8000; window.pHp = 8000; } 
    window.mana = 1.0; 
    window.curIdx = -1; 
    window.isBusy = false; 
    window.itemInventory = { potion: 1, amulet: 1 }; 
    window.isAmuletActive = 0; 
    stopBGM(); 
    stopSlimeAnimation(); 
}
