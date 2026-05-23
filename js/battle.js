// ==========================================
// 🕒 🔄 更新検知・タイムスタンプ刻印システム
// ==========================================
console.log("%c🔄 [BATTLE SYSTEMS] 2026.05.23 23:59最終版：旧戦闘DNA（全魔法・特殊AI）完全覚醒・合流完了！", "color: #00ff00; font-weight: bold;");

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
window.battleTurnCount = 1; // ターンカウント用変数

// ==========================================
// 🧙‍♂️ 2. プレイヤー行動・全コマンドロジック（完全復活）
// ==========================================
function turn(playerMove) {
    // プレイヤーが行動中、または両者のHPが0以下の場合は入力を完全に遮断
    if (window.isBusy || window.pHp <= 0 || window.eHp <= 0) return; 
    window.isBusy = true;

    // 🚨 麻痺（スタン）チェックロジックの完全復元
    if (window.isPlayerStunned) { 
        window.isPlayerStunned = false; 
        const logEl = document.getElementById('battle-log');
        if (logEl) logEl.innerText = "🚨 麻痺して動けない！"; 
        setTimeout(enemyTurnAction, 1000); 
        return; 
    }
  
    const data = STAGES[window.curIdx]; 
    
    // 🚨 弱点直撃（クリティカル）判定
    let isCritical = (playerMove === data.weak);
    
    // 🚨 デスコード（debug_death）の完全復元
    if (playerMove === 'debug_death') { 
        window.eHp = 0; 
        updateHpUI(); 
        const logEl = document.getElementById('battle-log');
        if (logEl) logEl.innerText = "☠ デスコード起動。"; 
        setTimeout(checkBattleEnd, 500); 
        return; 
    }

    // 🚨 ホーリー（35）とその他（15）のベース威力の完全復元（弱点時は2.2倍）
    let dmg = Math.floor((playerMove === 'holy' ? 35 : 15) * (isCritical ? 2.2 : 1) * window.mana);
    
    // 🚨 敵の骨盾によるダメージ75%カット処理の復元
    if (window.isEnemyShieldActive) { 
        dmg = Math.floor(dmg * 0.25); 
    }

    const effLayer = document.getElementById('spell-effect-layer');
    if (effLayer) effLayer.innerHTML = ""; 
    window.isEnemyShieldActive = false; // 攻撃を叩き込んだので盾は解除

    // 🧙‍♂️ 各コマンドの演出・分岐処理
    if (playerMove === 'fire') {
        if (effLayer) effLayer.innerHTML = MISSILE_EFFECTS.fire;
    } else if (playerMove === 'ice') {
        if (effLayer) effLayer.innerHTML = `<img src="${ANIMS_EFFECT_ICE[0]}" style="position:absolute; width:100px; height:100px; left:400px; top:120px; animation:stalkPulse 0.4s forwards;">`;
    } else if (playerMove === 'holy') {
        if (effLayer) effLayer.innerHTML = `<img src="${ANIMS_EFFECT_CROSS[0]}" style="position:absolute; width:140px; height:140px; left:400px; top:120px; animation:stalkPulse 0.5s forwards;">`;
    } else if (playerMove === 'def') {
        // 🚨 シールド防御コマンドの完全復元
        const logEl = document.getElementById('battle-log');
        if (logEl) logEl.innerText = "🛡 シールドを展開！防御姿勢をとった。";
        setTimeout(() => { enemyTurnAction(true); }, 800); 
        window.mana = 1.0; 
        const chargeBadge = document.getElementById('charge-badge');
        if (chargeBadge) chargeBadge.style.display = "none"; 
        return;
    } else if (playerMove === 'chg') {
        // 🚨 チャージ（次回威力2.5倍）コマンドの完全復元
        window.mana = 2.5; 
        const chargeBadge = document.getElementById('charge-badge');
        if (chargeBadge) chargeBadge.style.display = "block"; 
        const logEl = document.getElementById('battle-log');
        if (logEl) logEl.innerText = "⚡ パワーをチャージした！次回威力2.5倍！";
        setTimeout(() => { enemyTurnAction(false); }, 800); 
        return;
    }

    // 💥 魔法ヒット・ダメージ適用タイミング（400ミリ秒ディレイ）の完全同期
    setTimeout(() => {
        window.eHp = Math.max(0, window.eHp - dmg); 
        updateHpUI(); 
        createDmgPop(dmg, false);
        
        const logEl = document.getElementById('battle-log');
        if (logEl) {
            logEl.innerText = isCritical ? `💥 弱点直撃！敵に ${dmg} ダメージ！` : `敵に ${dmg} ダメージ！`;
        }
        
        window.mana = 1.0; 
        const chargeBadge = document.getElementById('charge-badge');
        if (chargeBadge) chargeBadge.style.display = "none";
        
        // 敵が倒れていなければ、800ミリ秒後にエネミーターンを起動
        setTimeout(() => { if (!checkBattleEnd()) enemyTurnAction(); }, 800);
    }, 400);
}

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
    if (window.curIdx >= STAGES.length) { 
        resetGame(); 
        showScreen('scr-start'); 
        const indicator = document.getElementById('floor-indicator'); 
        if (indicator) indicator.style.visibility = 'hidden'; 
        startBGM("title"); 
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
    window.battleTurnCount = 1; 

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
    
    showScreen('scr-battle'); 
    updateHpUI(); 
    checkDevPassword();
    if (logEl) logEl.innerHTML = `${data.name}が現れた！弱点: ${data.weak.toUpperCase()}`;
    startBGM("battle");

    // 🚀 新倉庫アセットを100%安全に描画＆起動する50ms同期タイマー
    setTimeout(() => {
        if (eGraphic && MASTER_ANIM_MAP[data.type]) { 
            eGraphic.src = MASTER_ANIM_MAP[data.type][0];
        }
        if (typeof startCustomAnimation === "function") {
            startCustomAnimation(data.type); 
        }
    }, 50);
}

// ==========================================
// 👹 3. エネミーターン行動AIロジック（特殊攻撃完全復元版）
// ==========================================
function enemyTurnAction(isPlayerDefending = false) {
    if (window.eHp <= 0 || window.pHp <= 0) return; 
    const data = STAGES[window.curIdx];
    
    // 40%の確率で特殊AIを発動
    let isSpecial = (Math.random() < 0.4);
    
    // シールド防御時はダメージを15%に激減、通常時はステージ指定の攻撃力
    let dmg = isPlayerDefending ? Math.max(1, Math.floor(data.atk * 0.15)) : data.atk;
    
    // 敵が魔力集約していた場合はダメージ2倍
    dmg = Math.floor(dmg * window.enemyMana); 
    window.enemyMana = 1.0; // 消費
    
    // お守り結界が発動しており、かつシールド防御をしていない場合は被ダメ半減
    if (window.isAmuletActive > 0 && !isPlayerDefending) {
        dmg = Math.floor(dmg * 0.5);
    }

    const effLayer = document.getElementById('spell-effect-layer'); 
    if (effLayer) effLayer.innerHTML = "";

    const logEl = document.getElementById('battle-log');

    if (isSpecial) {
        // 🚨 スケルトンナイト（3階）の骨盾AIの完全復元
        if (data.type === 'skelton') {
            window.isEnemyShieldActive = true; 
            if (logEl) logEl.innerText = `🛡️ ${data.name}は骨盾を構えた！次の被ダメを大幅カット！`;
            postEnemyTurnCleanup(); 
            return;
        }
        // 🚨 ガーゴイル（6階）の魔力集約AIの完全復元
        if (data.type === 'gargoil') {
            window.enemyMana = 2.0; 
            if (logEl) logEl.innerText = `⚡ ${data.name}は魔力を集約！次回の攻撃力2倍！`;
            postEnemyTurnCleanup(); 
            return;
        }

        // 特殊攻撃のエフェクトアニメーション
        if (effLayer) {
            if (['slime', 'spider', 'harpy', 'dragon', 'golem'].includes(data.type)) {
                effLayer.innerHTML = ENEMY_MISSILE_EFFECTS[data.type] || "";
            } else {
                effLayer.innerHTML = `<div style="position:absolute; width:120px; height:120px; border-radius:50%; background:rgba(168,85,247,0.5); left:100px; top:120px; animation:stalkPulse 0.5s forwards; filter:blur(10px);"></div>`;
            }
        }

        // 🚨 クモの特殊攻撃によるプレイヤー麻痺（スタン）の完全復元
        if (data.type === 'spider') {
            window.isPlayerStunned = true;
        }
        if (logEl) logEl.innerText = `🚨 ${data.name}の特殊攻撃を被弾！【${dmg}】ダメージ！`;
    } else {
        // 通常の突進突撃アニメーション演出
        const eContainer = document.getElementById('e-sprite-container');
        if (eContainer) eContainer.style.animation = "enemyAssault 0.45s forwards";
        setTimeout(() => { 
            if (eContainer) eContainer.style.animation = "floatE 2.2s infinite alternate ease-in-out"; 
        }, 460);
        
        if (logEl) logEl.innerText = `${data.name}の突進攻撃！【${dmg}】ダメージ！`;
    }

    // プレイヤーへダメージ適用、ポップアップ生成
    window.pHp = Math.max(0, window.pHp - dmg); 
    updateHpUI(); 
    createDmgPop(dmg, true);
    
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
    setTimeout(() => { checkBattleEnd(); }, 800);
}

// ==========================================
// 💥 4. 勝敗判定・ゲームリセットロジック
// ==========================================
function checkBattleEnd() {
    if (window.pHp <= 0 || window.eHp <= 0) { 
        stopBGM(); 
        if (typeof stopSlimeAnimation === "function") {
            stopSlimeAnimation();
        }
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
    if (typeof stopSlimeAnimation === "function") {
        stopSlimeAnimation(); 
    }
}
