// ==========================================
// 🕒 🔄 更新検知・タイムスタンプ刻印システム
// ==========================================
console.log("%c🔄 [BATTLE SYSTEMS] 品質保証最終決定版：残痕根絶・全魔法演出・敵特殊行動AI完全復元！", "color: #00ff00; font-weight: bold;");

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
window.battleTurnCount = 1;

// ==========================================
// 🧙‍♂️ 2. プレイヤー行動・魔法演出＆計算ループ
// ==========================================
function turn(playerMove) {
    if (window.isBusy || window.pHp <= 0 || window.eHp <= 0) return; 
    window.isBusy = true;

    // 麻痺（スタン）チェック
    if (window.isPlayerStunned) { 
        window.isPlayerStunned = false; 
        const logEl = document.getElementById('battle-log');
        if (logEl) logEl.innerHTML = "🚨 <span style='color: #f59e0b; font-weight: bold;'>体が痺れて動けない！ ターンがスキップされた！</span>"; 
        setTimeout(() => { enemyTurnAction(); }, 1200); 
        return; 
    }
  
    const data = STAGES[window.curIdx]; 
    let isCritical = (playerMove === data.weak);
    
    // 💀 開発者デスコード（最優先即時決着）
    if (playerMove === 'debug_death') { 
        window.eHp = 0; 
        updateHpUI(); 
        const logEl = document.getElementById('battle-log');
        if (logEl) logEl.innerText = "☠ デスコード起動。"; 
        setTimeout(checkBattleEnd, 500); 
        return; 
    }

    // 基本ダメージ計算
    let baseDmg = 15;
    if (playerMove === 'fire') baseDmg = 20;
    else if (playerMove === 'ice') baseDmg = 20;
    else if (playerMove === 'holy') baseDmg = 35;

    let dmg = Math.floor(baseDmg * (isCritical ? 2.2 : 1) * window.mana);
    if (window.isEnemyShieldActive) { 
        dmg = Math.floor(dmg * 0.25); 
    }

    const effLayer = document.getElementById('spell-effect-layer');
    if (effLayer) effLayer.innerHTML = ""; 
    window.isEnemyShieldActive = false;

    // ⚡ ②魔法イラスト・演出エフェクトの復活（effects.js側関数の安全呼び出し）
    if (typeof startSpellEffect === "function") {
        startSpellEffect(playerMove);
    } else if (typeof openMagic === "function") {
        openMagic(playerMove);
    }

    // ②魔法効果音（SE）の復活
    if (typeof playSE === "function") {
        if (playerMove === 'fire') playSE(SOUND_FIRE);
        else if (playerMove === 'ice') playSE(SOUND_ICE);
        else if (playerMove === 'holy') playSE(SOUND_HOLY);
    }

    // 補助コマンドの処理
    if (playerMove === 'def') {
        const logEl = document.getElementById('battle-log');
        if (logEl) logEl.innerText = "🛡 シールドを展開！防御姿勢をとった。";
        if (typeof playSE === "function") playSE(SOUND_SHIELD);
        setTimeout(() => { enemyTurnAction(true); }, 800); 
        window.mana = 1.0; 
        const chargeBadge = document.getElementById('charge-badge');
        if (chargeBadge) chargeBadge.style.display = "none"; 
        return;
    } else if (playerMove === 'chg') {
        window.mana = 2.5; 
        const chargeBadge = document.getElementById('charge-badge');
        if (chargeBadge) chargeBadge.style.display = "block"; 
        const logEl = document.getElementById('battle-log');
        if (logEl) logEl.innerText = "⚡ パワーをチャージした！次回魔法威力2.5倍！";
        if (typeof playSE === "function") playSE(SOUND_CHARGE);
        setTimeout(() => { enemyTurnAction(false); }, 800); 
        return;
    }

    // 魔法着火タイマー
    setTimeout(() => {
        window.eHp = Math.max(0, window.eHp - dmg); 
        updateHpUI(); 
        
        if (typeof createDmgPop === "function") {
            createDmgPop(dmg, false);
        }
        
        const logEl = document.getElementById('battle-log');
        if (logEl) {
            logEl.innerHTML = isCritical ? `💥 弱点直撃！敵に <span style='color: #ef4444; font-weight: bold;'>${dmg}</span> ダメージ！` : `敵に ${dmg} ダメージ！`;
        }
        
        window.mana = 1.0; 
        const chargeBadge = document.getElementById('charge-badge');
        if (chargeBadge) chargeBadge.style.display = "none";
        
        setTimeout(() => { if (!checkBattleEnd()) enemyTurnAction(); }, 800);
    }, 400);
}

// ==========================================
// 🎒 3. アイテムバッグ・ステージ進行管理
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
        if (typeof playSE === "function") playSE(SOUND_HEAL);
    } else { 
        window.isAmuletActive = 3; 
        const badge = document.getElementById('item-badge');
        if (badge) badge.style.display = "block"; 
        if (logEl) logEl.innerText = "🎒 お守りを使用！3ターン被ダメ半減！"; 
        if (typeof playSE === "function") playSE(SOUND_SHIELD);
    }
    updateHpUI(); 
    setTimeout(enemyTurnAction, 1000);
}

function nextStage() {
    if (typeof closeItemBag === "function") closeItemBag(); 
    window.curIdx++;
    if (window.curIdx >= STAGES.length) { 
        resetGame(); 
        showScreen('scr-start'); 
        const indicator = document.getElementById('floor-indicator'); 
        if (indicator) indicator.style.visibility = 'hidden'; 
        if (typeof startBGM === "function") startBGM("title"); 
        return; 
    }
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
    if (typeof stopBGM === "function") stopBGM();
}

function startBattle() {
    const data = STAGES[window.curIdx]; 
    window.eHp = window.eMaxHp = data.hp; 
    window.isBusy = false; 
    window.isPlayerStunned = false; 
    window.isAmuletActive = 0; 
    window.enemyMana = 1.0; 
    window.isEnemyShieldActive = false;
    window.battleTurnCount = 1; 

    const eContainer = document.getElementById('e-sprite-container');
    if (eContainer) { eContainer.style.opacity = "1"; eContainer.style.transform = "scale(1)"; }
    const pGraphic = document.getElementById('p-sprite-graphic');
    if (pGraphic) pGraphic.src = getAssetPath('hero', 'Wizard.png');
    const itemBadge = document.getElementById('item-badge');
    const chargeBadge = document.getElementById('charge-badge');
    const eName = document.getElementById('e-name');
    const eGraphic = document.getElementById('e-sprite-graphic');
    
    // 🚨 ①対策：タイマー暴発と競合するアドレスクリアを廃止。ブラウザが絶対にエラーを起こさず、かつ画面上完全に消去できる「1pxの透明画像」にすり替える！
    if (eGraphic) eGraphic.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

    const logEl = document.getElementById('battle-log');
    if (itemBadge) itemBadge.style.display = "none"; 
    if (chargeBadge) chargeBadge.style.display = "none";
    if (eName) eName.innerText = data.name;
    
    showScreen('scr-battle'); 
    updateHpUI(); 
    checkDevPassword();
    if (logEl) logEl.innerHTML = `${data.name}が現れた！弱点: ${data.weak.toUpperCase()}`;
    if (typeof startBGM === "function") startBGM("battle");

    setTimeout(() => {
        let folderType = data.type; 

        if (eGraphic && MASTER_ANIM_MAP[folderType]) { 
            eGraphic.src = MASTER_ANIM_MAP[folderType][0];
        }
        if (typeof startCustomAnimation === "function") {
            startCustomAnimation(folderType); 
        }
    }, 50);
}

// ==========================================
// 👹 4. エネミーターン行動AI・特殊攻撃復元ロジック
// ==========================================
function enemyTurnAction(isPlayerDefending = false) {
    if (window.eHp <= 0 || window.pHp <= 0) return; 
    const data = STAGES[window.curIdx];
    const logEl = document.getElementById('battle-log');
    
    let isSpecial = false;
    // ③敵の特殊攻撃判定：2ターン目以降かつ40%の確率で特殊行動を発動
    if (window.battleTurnCount > 1 && Math.random() < 0.4) {
        isSpecial = true;
    }

    let dmg = isPlayerDefending ? Math.max(1, Math.floor(data.atk * 0.15)) : data.atk;
    dmg = Math.floor(dmg * window.enemyMana); 
    window.enemyMana = 1.0; 
    
    if (window.isAmuletActive > 0 && !isPlayerDefending) {
        dmg = Math.floor(dmg * 0.5);
    }

    const effLayer = document.getElementById('spell-effect-layer'); 
    if (effLayer) effLayer.innerHTML = "";

    // 通常攻撃か特殊行動かで分岐処理
    if (isSpecial) {
        // ③敵ごとの特殊エフェクトアニメーション＆効果音の復元
        if (data.type === 'slime') {
            if (logEl) logEl.innerHTML = `👹 ${data.name}の【緑の液体投げ】！`;
            if (typeof triggerEnemyEffect === "function") triggerEnemyEffect('slime_acid');
            if (typeof playSE === "function") playSE(SOUND_FIRE); // 液体着弾音
            dmg = Math.floor(dmg * 1.3); // 威力が少し高い
        } 
        else if (data.type === 'spider') {
            if (logEl) logEl.innerHTML = `👹 ${data.name}の【粘着糸吐き】！`;
            if (typeof triggerEnemyEffect === "function") triggerEnemyEffect('spider_web');
            if (typeof playSE === "function") playSE(SOUND_ICE); // 糸の拘束音
            window.isPlayerStunned = true; // 次のターン行動不能
        } 
        else if (data.type === 'harpy') {
            if (logEl) logEl.innerHTML = `👹 ${data.name}の【雷光急襲】！⚡`;
            if (typeof triggerEnemyEffect === "function") triggerEnemyEffect('harpy_thunder');
            if (typeof playSE === "function") playSE(SOUND_HOLY); // 雷撃爆発音
            window.isPlayerStunned = (Math.random() < 0.5); // 50%で麻痺
        }
        else if (data.type === 'dragon') {
            if (logEl) logEl.innerHTML = `👹 ${data.name}の【滅びの烈火】！🔥`;
            if (typeof triggerEnemyEffect === "function") triggerEnemyEffect('dragon_breath');
            if (typeof playSE === "function") playSE(SOUND_FIRE);
            dmg = Math.floor(dmg * 1.5); // 大ダメージ
        }
    } else {
        // 通常の突進攻撃
        if (logEl) logEl.innerText = `${data.name}の突進攻撃！`;
        if (typeof playSE === "function") playSE(SOUND_ATTACK || 1);
        const eContainer = document.getElementById('e-sprite-container');
        if (eContainer) eContainer.style.animation = "enemyAssault 0.45s forwards";
        setTimeout(() => { 
            if (eContainer) eContainer.style.animation = "floatE 2.2s infinite alternate ease-in-out"; 
        }, 460);
    }

    // ダメージ適用
    window.pHp = Math.max(0, window.pHp - dmg); 
    updateHpUI(); 
    
    if (typeof createDmgPop === "function") {
        createDmgPop(dmg, true);
    }
    
    window.battleTurnCount++;
    postEnemyTurnCleanup();
}

function postEnemyTurnCleanup() {
    if (window.isAmuletActive > 0) { 
        window.isAmuletActive--; 
        if (window.isAmuletActive <= 0) {
            const badge = document.getElementById('item-badge');
            if (badge) badge.style.display = "none";
        }
    }
    
    // ①対策：何があっても最後に確実に busy を false にしてプレイヤーに入力を明け渡す
    setTimeout(() => { 
        window.isBusy = false;
        checkBattleEnd(); 
    }, 800);
}

// ==========================================
// 💥 5. 勝敗判定・ゲームリセットロジック
// ==========================================
function checkBattleEnd() {
    if (window.pHp <= 0 || window.eHp <= 0) { 
        if (typeof stopBGM === "function") stopBGM(); 
        if (typeof stopSlimeAnimation === "function") {
            stopSlimeAnimation();
        }
        if (window.eHp <= 0) {
            if (typeof playSE === "function") playSE(SOUND_FREEZE_DEAD);
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
            if (typeof startBGM === "function") startBGM("grand_end"); 
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
    if (typeof stopBGM === "function") stopBGM(); 
    if (typeof stopSlimeAnimation === "function") {
        stopSlimeAnimation(); 
    }
}
