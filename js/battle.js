// ==========================================
// ⚔️ 1. グローバル戦闘ステータス管理変数
// ==========================================
let curIdx = -1; 
let pMaxHp = 100; 
let pHp = 100; 
let eHp = 100; 
let eMaxHp = 100; 
let mana = 1.0; 
let isBusy = false;

let itemInventory = { potion: 1, amulet: 1 }; 
let isAmuletActive = 0; 
let isPlayerStunned = false;

let enemyMana = 1.0; 
let isEnemyShieldActive = false;

// ==========================================
// 🧙‍♂️ 2. プレイヤー行動・アイテムロジック
// ==========================================

/**
 * アイテム（回復薬・お守り）を使用し、効果を反映して敵のターンへ移行する関数
 */
function useItem(itemType) {
    if (isBusy || itemInventory[itemType] <= 0) return;
    isBusy = true; 
    itemInventory[itemType]--; 
    closeItemBag();
    
    const effLayer = document.getElementById('spell-effect-layer');
    if (effLayer) effLayer.innerHTML = "";
    
    const logEl = document.getElementById('battle-log');
    
    if (itemType === 'potion') { 
        pHp = Math.min(pMaxHp, pHp + 50); 
        if (logEl) logEl.innerText = "🎒 回復薬を使用！HPが50回復！"; 
    } else { 
        isAmuletActive = 3; 
        const badge = document.getElementById('item-badge');
        if (badge) badge.style.display = "block"; 
        if (logEl) logEl.innerText = "🎒 お守りを使用！3ターン被ダメ半減！"; 
    }
    
    updateHpUI(); 
    setTimeout(enemyTurnAction, 1000);
}

/**
 * 次のステージ（階層）をセットアップし、導入画面を表示する関数
 */
function nextStage() {
    closeItemBag(); 
    curIdx++;
    
    if (curIdx >= STAGES.length) { 
        resetGame(); 
        showScreen('scr-start'); 
        const indicator = document.getElementById('floor-indicator');
        if (indicator) indicator.style.visibility = 'hidden'; 
        startBGM("title"); 
        return; 
    }
    
    const data = STAGES[curIdx]; 
    if (!isDebugUnlocked) { pMaxHp = 100; pHp = 100; }
    
    const indicator = document.getElementById('floor-indicator');
    if (indicator) {
        indicator.style.visibility = 'visible'; 
        indicator.innerText = `${data.floor}階`;
    }
    
    const chNum = document.getElementById('intro-ch-num');
    const chTitle = document.getElementById('intro-ch-title');
    const introTxt = document.getElementById('intro-text');
    
    if (chNum) chNum.innerText = `FLOOR 0${data.floor}`; 
    if (chTitle) chTitle.innerText = data.name; 
    if (introTxt) introTxt.innerText = data.txt;
    
    showScreen('scr-intro'); 
    stopBGM();
}

/**
 * バトル画面の各種数値を初期化し、戦闘を開始する関数
 */
function startBattle() {
    const data = STAGES[curIdx]; 
    eHp = eMaxHp = data.hp; 
    isBusy = false; 
    isPlayerStunned = false; 
    isAmuletActive = 0; 
    enemyMana = 1.0; 
    isEnemyShieldActive = false;
    
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

/**
 * プレイヤーまたは敵の死亡を検知し、戦闘終了処理を行う関数
 */
function checkBattleEnd() {
    if (pHp <= 0 || eHp <= 0) { 
        stopBGM(); 
        stopSlimeAnimation();
        if (eHp <= 0) {
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

/**
 * 戦闘結果（勝利・敗北・グランドエンド）に応じてリザルト画面を構築する関数
 */
function transitionToResult() {
    showScreen('scr-result');
    const rTitle = document.getElementById('res-title'); 
    const rText = document.getElementById('res-text'); 
    const rBtn = document.getElementById('res-btn');
    
    if (eHp <= 0) {
        if (curIdx === STAGES.length - 1) {
            if (rTitle) rTitle.innerText = "GRAND END"; 
            if (rText) rText.innerText = "最上階の暗黒竜を討伐し、螺旋の塔に永遠の平穏が訪れた！1周目完全クリアおめでとうございます！"; 
            if (rBtn) rBtn.innerText = "タイトルへ戻る"; 
            startBGM("grand_end"); 
        } else {
            if (rTitle) rTitle.innerText = "VICTORY"; 
            if (rText) rText.innerText = `${STAGES[curIdx].name}を撃破した！次の階層への扉が開く。`; 
            if (rBtn) rBtn.innerText = "次へ進む";
        }
    } else {
        if (rTitle) rTitle.innerText = "DEFEATED"; 
        if (rText) rText.innerText = "目の前が真っ暗になった..."; 
        if (rBtn) rBtn.innerText = "タイトルへ戻る"; 
        curIdx = -1;
    }
    isBusy = false;
}

/**
 * ゲームデータを初期状態（デバッグ状態を考慮）に完全リセットする関数
 */
function resetGame() { 
    if (!isDebugUnlocked) { pMaxHp = 100; pHp = 100; } else { pMaxHp = 8000; pHp = 8000; } 
    mana = 1.0; 
    curIdx = -1; 
    isBusy = false; 
    itemInventory = { potion: 1, amulet: 1 }; 
    isAmuletActive = 0; 
    stopBGM(); 
    stopSlimeAnimation(); 
}
