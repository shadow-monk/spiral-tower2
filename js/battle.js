// ==========================================
// 🕒 🔄 更新検知・タイムスタンプ刻印システム
// ==========================================
console.log("%c🔄 [BATTLE SYSTEMS] Ver 7.09: 10大魔物・最新技名テキスト ＆ 蜘蛛の巣演出適合修正版。", "color: #00ff00; font-weight: bold;");

// ==========================================
// ⚔️ 1. グローバル戦闘ステータス管理変数の窓口開通
// ==========================================
window.curIdx = -1;
window.pMaxHp = 100;
window.pHp = 100;
window.eHp = 100;
window.eMaxHp = 100;
window.mana = 1.0;
window.isBusy = false;

// ステータスフラグ管理
window.enemyMana = 1.0;
window.isEnemyShieldActive = false;

// アイテムバッグ初期化
window.itemInventory = { potion: 1, amulet: 1 };
window.isAmuletActive = 0;

// 状態異常・特殊効果用追加フラグの一括管理
window.isPlayerStunned = false;       // 2階: ブラッドスパイダー（麻痺状態）
window.isPlayerCorroded = false;     // 1階: ヘドロスライム（酸による防御不可状態）
window.isHarpySpeedActive = false;   // 4階: ハーピィ（敵の次のターン待機時間が半分）
window.isPlayerMuted = false;        // 9階: エビルアイ（魔法コマンド封印状態）
window.isItemBlocked = false;        // 8階: ファントム（アイテム使用封印状態）

// ⚡ 【多重衝突バグ根絶】魔法タイマーの予約チケット管理番号を保持する安全弁
window._activeMagicTimeout = null;

// ==========================================
// 🚀 2. ステージ・戦闘遷移
// ==========================================

window.nextStage = function() {
    closeItemBag();
    window.curIdx++;

    if (window.curIdx >= STAGES.length) {
        window.resetGame();
        showScreen('scr-start');
        const floorIndicator = document.getElementById('floor-indicator');
        if (floorIndicator) floorIndicator.style.visibility = 'hidden';
        startBGM("title");
        return;
    }

    const data = STAGES[window.curIdx];

    if (!window.isDebugUnlocked) {
        window.pMaxHp = 100;
        window.pHp = 100;
    }

    const floorIndicator = document.getElementById('floor-indicator');
    if (floorIndicator) {
        floorIndicator.style.visibility = 'visible';
        floorIndicator.innerText = `${data.floor}階`;
    }

    const introChNum = document.getElementById('intro-ch-num');
    const introChTitle = document.getElementById('intro-ch-title');
    const introText = document.getElementById('intro-text');

    if (introChNum) introChNum.innerText = `FLOOR 0${data.floor}`;
    if (introChTitle) introChTitle.innerText = data.name;
    if (introText) introText.innerText = data.txt;

    showScreen('scr-intro');
    stopBGM();
};

window.startBattle = function() {
    const data = STAGES[window.curIdx];
    
    // 全状態異常フラグを試合開始時に初期化
    window.isBusy = false; 
    window.isPlayerStunned = false;
    window.isPlayerCorroded = false;
    window.isHarpySpeedActive = false;
    window.isPlayerMuted = false;
    window.isItemBlocked = false;
    
    window.isAmuletActive = 0;
    window.enemyMana = 1.0;
    window.isEnemyShieldActive = false;
    window.eHp = window.eMaxHp = data.hp;

    if (window._activeMagicTimeout) {
        clearTimeout(window._activeMagicTimeout);
        window._activeMagicTimeout = null;
    }

    const eContainer = document.getElementById('e-sprite-container');
    if (eContainer) {
        eContainer.style.opacity = "1";
        eContainer.style.transform = "scale(1)";
        eContainer.style.background = "none";
    }

    const pGraphic = document.getElementById('p-sprite-graphic');
    if (pGraphic) {
        pGraphic.src = './assets/enemies/player/player_wizard.png';
    }

    const itemBadge = document.getElementById('item-badge');
    const chargeBadge = document.getElementById('charge-badge');
    const eName = document.getElementById('e-name');
    const eSpriteGraphic = document.getElementById('e-sprite-graphic');
    const effScr = document.getElementById('eff-scr');

    if (itemBadge) itemBadge.style.display = "none";
    if (chargeBadge) chargeBadge.style.display = "none";
    if (eName) eName.innerText = data.name;

    if (eSpriteGraphic && MASTER_ANIM_MAP[data.type]) {
        let rawUrl = MASTER_ANIM_MAP[data.type][0];
        let cleanUrl = rawUrl.replace(/^\.\//, '').replace(/^\//, '').replace(/^spiral-tower2\//, '');
        eSpriteGraphic.src = './' + cleanUrl;
    }

    showScreen('scr-battle');

    if (typeof startCustomAnimation === 'function') {
        startCustomAnimation(data.type);
    }
    
    if (typeof updateHpUI === 'function') {
        updateHpUI();
    }

    if (typeof checkDevPassword === 'function') {
        checkDevPassword();
    }

    if (effScr) {
        effScr.className = ""; 
    }

    const battleLog = document.getElementById('battle-log');
    if (battleLog) {
        battleLog.innerHTML = `${data.name}が現れた！弱点: ${data.weak.toUpperCase()}`;
    }

    startBGM("battle");
};

// ==========================================
// 🎒 3. 消耗品アイテム使用連携回路
// ==========================================
window.useItem = function(itemType) {
    if (window.isBusy || window.pHp <= 0 || window.eHp <= 0 || window.itemInventory[itemType] <= 0) return;
    
    if (window.isItemBlocked) {
        const battleLog = document.getElementById('battle-log');
        if (battleLog) battleLog.innerText = "🚨 呪いでアイテムバッグが石化していて開けない！";
        return;
    }

    window.isBusy = true;
    window.itemInventory[itemType]--;
    closeItemBag();

    const battleLog = document.getElementById('battle-log');

    if (itemType === 'potion') {
        window.pHp = Math.min(window.pMaxHp, window.pHp + 50);
        if (battleLog) battleLog.innerText = "🎒 回復薬を使用！HPが50回復！";
    } else {
        window.isAmuletActive = 3;
        const itemBadge = document.getElementById('item-badge');
        if (itemBadge) itemBadge.style.display = "block";
        if (battleLog) battleLog.innerText = "🎒 お守りを使用！3ターン被ダメ半減！";
    }

    if (typeof updateHpUI === 'function') updateHpUI();
    setTimeout(window.enemyTurnAction, 1000);
};

// ==========================================
// 🧙‍♂️ 4. プレイヤー魔導アクション
// ==========================================
window.turn = function(playerMove) {
    if (window.isBusy || window.pHp <= 0 || window.eHp <= 0) return;

    if (window.isPlayerMuted && (playerMove === 'fire' || playerMove === 'ice' || playerMove === 'holy')) {
        const battleLog = document.getElementById('battle-log');
        if (battleLog) battleLog.innerText = "🚨 魔力封印により、呪文が唱えられない！";
        return;
    }

    window.isBusy = true;

    if (window._activeMagicTimeout) {
        clearTimeout(window._activeMagicTimeout);
    }

    if (window.isPlayerStunned) {
        window.isPlayerStunned = false;
        const battleLog = document.getElementById('battle-log');
        if (battleLog) battleLog.innerText = "🚨 麻痺して動けない！";
        
        setTimeout(() => {
            window.isBusy = false;
            window.enemyTurnAction();
        }, 1000);
        return;
    }

    if (playerMove === 'debug_death') {
        window.eHp = 0;
        if (typeof updateHpUI === 'function') updateHpUI();
        const battleLog = document.getElementById('battle-log');
        if (battleLog) battleLog.innerText = "☠ デスコード起動。";
        
        setTimeout(() => {
            window.checkBattleEnd();
        }, 1200);
        return;
    }

    const data = STAGES[window.curIdx];
    let isCritical = (playerMove === data.weak);

    let dmg = Math.floor((playerMove === 'holy' ? 35 : 15) * (isCritical ? 2.2 : 1) * window.mana);

    if (window.isEnemyShieldActive) {
        dmg = Math.floor(dmg * 0.25);
    }

    window.isEnemyShieldActive = false;

    if (playerMove === 'def') {
        const battleLog = document.getElementById('battle-log');
        if (battleLog) battleLog.innerText = "🛡 シールドを展開！防御姿勢をとった。";
        window.mana = 1.0;
        const chargeBadge = document.getElementById('charge-badge');
        if (chargeBadge) chargeBadge.style.display = "none";
        setTimeout(() => { window.enemyTurnAction(true); }, 800);
        return;
    }
    
    if (playerMove === 'chg') {
        window.mana = 2.5;
        const chargeBadge = document.getElementById('charge-badge');
        const battleLog = document.getElementById('battle-log');
        if (chargeBadge) chargeBadge.style.display = "block";
        if (battleLog) battleLog.innerText = "⚡ パワーをチャージした！次回威力2.5倍！";
        setTimeout(() => { window.enemyTurnAction(false); }, 800);
        return;
    }

    let currentSE = SOUND_FIRE;
    let spellLabel = "ファイア";

    if (playerMove === 'ice') {
        currentSE = SOUND_ICE;
        spellLabel = "アイス";
    } else if (playerMove === 'holy') {
        currentSE = SOUND_HOLY;
        spellLabel = "ホーリー";
    }

    window._activeMagicTimeout = setTimeout(() => {
        playSE(currentSE);
        
        window.eHp = Math.max(0, window.eHp - dmg);
        if (typeof updateHpUI === 'function') updateHpUI();
        createDmgPop(dmg, false);

        const battleLog = document.getElementById('battle-log');
        if (battleLog) {
            battleLog.innerText = isCritical ? `💥 弱点直撃！『${spellLabel}』で ${dmg} ダメージ！` : `『${spellLabel}』で ${dmg} ダメージ！`;
        }

        window.mana = 1.0;
        const chargeBadge = document.getElementById('charge-badge');
        if (chargeBadge) chargeBadge.style.display = "none";

        window._activeMagicTimeout = null;
        setTimeout(() => { if (!window.checkBattleEnd()) window.enemyTurnAction(); }, 1400);
    }, 600);
};

// ==========================================
// 👹 5. エネミーターン行動AI＆カウンター処理
// ==========================================
window.enemyTurnAction = function(isPlayerDefending = false) {
    if (isPlayerDefending === 'die') {
        window.eHp = 0;
        window.isBusy = false;
        if (typeof updateHpUI === 'function') updateHpUI();
        const battleLog = document.getElementById('battle-log');
        if (battleLog) battleLog.innerText = "☠ デスコード起動。";
        setTimeout(() => {
            window.checkBattleEnd();
        }, 1200);
        return;
    }

    if (window.eHp <= 0 || window.pHp <= 0) {
        window.isBusy = false;
        return;
    }
    const data = STAGES[window.curIdx];
    let isSpecial = (Math.random() < 0.4); 

    if (window.isPlayerCorroded && isPlayerDefending) {
        isPlayerDefending = false; 
    }

    let dmg = isPlayerDefending ? Math.max(1, Math.floor(data.atk * 0.15)) : data.atk;

    dmg = Math.floor(dmg * window.enemyMana);
    window.enemyMana = 1.0;

    if (window.isAmuletActive > 0 && !isPlayerDefending) {
        dmg = Math.floor(dmg * 0.5);
    }

    // 状態異常フラグは敵が行動を起こした瞬間に自動的に自然解除
    window.isPlayerMuted = false;
    window.isItemBlocked = false;
    window.isPlayerCorroded = false;

    if (isSpecial) {
        playSE(SOUND_HOLY);
        const battleLog = document.getElementById('battle-log');
        const effScr = document.getElementById('eff-scr');

        // ==========================================
        // 🔮 【1〜10階層】 最新テキスト ＆ 演出合図ドッキング大要塞
        // ==========================================

        // 1階：ヘドロスライム
        if (data.type === 'slime') {
            window.isPlayerCorroded = true;
            if (battleLog) battleLog.innerText = `🚨 ${data.name}の溶解液を吐きかけた！【${dmg}】ダメージ！(次回防御不可)`;
            if (effScr) { effScr.className = "anim-slime-acid"; setTimeout(() => { effScr.className = ""; }, 800); }
        }
        
        // 2階：ブラッドスパイダー
        else if (data.type === 'spider') {
            window.isPlayerStunned = true;
            if (battleLog) battleLog.innerText = `🚨 ${data.name}の麻痺毒糸を吐いた！【${dmg}】ダメージ！(次回スタン)`;
            if (effScr) { effScr.className = "anim-spider-poison"; setTimeout(() => { effScr.className = ""; }, 800); }
        }
        
        // 3階：スケルトンナイト
        else if (data.type === 'skelton' || data.type === 'skeleton') {
            window.isEnemyShieldActive = true;
            if (battleLog) battleLog.innerText = `🛡️ ${data.name}は骨盾を構えた！次の被ダメを大幅カット！`;
            if (effScr) { effScr.className = "anim-skelton-shield"; setTimeout(() => { effScr.className = ""; }, 1000); }
            window.postEnemyTurnCleanup();
            return;
        }
        
        // 4階：ハーピィ
        else if (data.type === 'harpy') {
            window.isHarpySpeedActive = true;
            if (battleLog) battleLog.innerText = `🚨 ${data.name}の超音波を放った！【${dmg}】ダメージ！(敵次ターン爆速化)`;
            if (effScr) { effScr.className = "anim-harpy-storm"; setTimeout(() => { effScr.className = ""; }, 600); }
        }
        
        // 5階：ロックゴーレム
        else if (data.type === 'golem') {
            window.mana = 1.0; 
            const chargeBadge = document.getElementById('charge-badge');
            if (chargeBadge) chargeBadge.style.display = "none";
            if (battleLog) battleLog.innerText = `🚨 ${data.name}の大地鳴動！【${dmg}】ダメージ！(チャージ強制解除)`;
            if (effScr) { effScr.className = "anim-golem-earthquake"; setTimeout(() => { effScr.className = ""; }, 800); }
        }
        
        // 6階：ガーゴイル
        else if (data.type === 'gargoil' || data.type === 'gargoyle') {
            window.enemyMana = 2.0;
            if (battleLog) battleLog.innerText = `⚡ ${data.name}は魔力シールドを展開！次回の攻撃力2倍！`;
            if (effScr) { effScr.className = "anim-gargoil-charge"; setTimeout(() => { effScr.className = ""; }, 1000); }
            window.postEnemyTurnCleanup();
            return;
        }
        
        // 7階：マイコニド (※あらゆる登録スペルに対応する防衛網を敷設)
        else if (data.type === 'myconid' || data.type === 'mush') {
            window.mana = 0.5; 
            if (battleLog) battleLog.innerText = `🚨 ${data.name}の胞子拡散！【${dmg}】ダメージ！(次回魔法威力半減)`;
            if (effScr) { effScr.className = "anim-myconid-spore"; setTimeout(() => { effScr.className = ""; }, 900); }
        }
        
        // 8階：ファントム (※ghost/phantomの両面を完全キャッチ)
        else if (data.type === 'ghost' || data.type === 'phantom') {
            window.isItemBlocked = true;
            if (battleLog) battleLog.innerText = `🚨 ${data.name}の呪いの視線！【${dmg}】ダメージ！(次回アイテム使用不可)`;
            if (effScr) { effScr.className = "anim-phantom-curse"; setTimeout(() => { effScr.className = ""; }, 1000); }
        }
        
        // 9階：エビルアイ
        else if (data.type === 'eyes' || data.type === 'evileye') {
            window.isPlayerMuted = true;
            if (battleLog) battleLog.innerText = `🚨 ${data.name}の魔力封印の邪眼！【${dmg}】ダメージ！(次回魔法不可)`;
            if (effScr) { effScr.className = "anim-evileye-mute"; setTimeout(() => { effScr.className = ""; }, 800); }
        }
        
        // 10階：カリスドラゴン
        else if (data.type === 'dragon') {
            window.eHp = Math.min(window.eMaxHp, window.eHp + 30); 
            if (battleLog) battleLog.innerText = `🚨 ${data.name}のカタストロフィ・ブレス！【${dmg}】ダメージ！(敵のHPが30回復)`;
            if (effScr) { effScr.className = "anim-dragon-breath"; setTimeout(() => { effScr.className = ""; }, 1200); }
        }
        
        else {
            if (battleLog) battleLog.innerText = `🚨 ${data.name}の特殊攻撃を被弾！【${dmg}】ダメージ！`;
        }
        
        window.pHp = Math.max(0, window.pHp - dmg);
        if (typeof updateHpUI === 'function') updateHpUI();
        createDmgPop(dmg, true);
        window.postEnemyTurnCleanup();
    } else {
        // 通常突進攻撃
        setTimeout(() => { playSE(SOUND_KICK); }, 200);

        const eContainer = document.getElementById('e-sprite-container');
        if (eContainer) {
            eContainer.style.setProperty('--assaultX', '-140px');
            eContainer.style.animation = "enemyAssault 0.45s forwards";
        }
        setTimeout(() => {
            if (eContainer) eContainer.style.animation = "floatE 2.2s infinite alternate ease-in-out";
        }, 460);

        const battleLog = document.getElementById('battle-log');
        if (battleLog) battleLog.innerText = `${data.name}の突進体当たり攻撃！【${dmg}】ダメージ！`;
        
        window.pHp = Math.max(0, window.pHp - dmg);
        if (typeof updateHpUI === 'function') updateHpUI();
        createDmgPop(dmg, true);
        
        window.postEnemyTurnCleanup();
    }
};

window.postEnemyTurnCleanup = function() {
    if (window.isAmuletActive > 0) {
        window.isAmuletActive--;
        if (window.isAmuletActive <= 0) {
            const itemBadge = document.getElementById('item-badge');
            if (itemBadge) itemBadge.style.display = "none";
        }
    }
    
    let nextTurnDelay = window.isHarpySpeedActive ? 400 : 800;
    window.isHarpySpeedActive = false; 

    setTimeout(() => {
        if (!window.checkBattleEnd()) {
            window.isBusy = false;
            const battleLog = document.getElementById('battle-log');
            if (battleLog) battleLog.innerText = "コマンドを選択せよ。";
        }
    }, nextTurnDelay);
};

window.checkBattleEnd = function() {
    if (window.pHp <= 0 || window.eHp <= 0) {
        stopBGM();
        if (typeof stopSlimeAnimation === 'function') stopSlimeAnimation();

        if (window.eHp <= 0) {
            playSE(SOUND_FREEZE_DEAD);
            const eContainer = document.getElementById('e-sprite-container');
            if (eContainer) {
                eContainer.style.opacity = "0";
                eContainer.style.transform = "scale(0.5)";
            }
            setTimeout(() => { window.transitionToResult(); }, 1400);
        } else {
            window.transitionToResult();
        }
        return true;
    }
    return false;
};

window.transitionToResult = function() {
    showScreen('scr-result');
    const rTitle = document.getElementById('res-title');
    const rText = document.getElementById('res-text');
    const rBtn = document.getElementById('res-btn');

    const pAuraLayer = document.getElementById('p-aura-layer');
    if (pAuraLayer) pAuraLayer.style.display = "none";

    const battleLog = document.getElementById('battle-log');
    const chargeBadge = document.getElementById('charge-badge');

    if (battleLog) battleLog.innerHTML = "コマンドを選択せよ。";
    if (chargeBadge) chargeBadge.style.display = "none";

    if (window.eHp <= 0) {
        if (rTitle) { rTitle.innerText = "VICTORY"; rTitle.style.color = '#10b981'; }
        const resIcon = document.getElementById('res-icon');
        if (resIcon) resIcon.innerText = "🏆";

        if (window.curIdx === STAGES.length - 1) {
            if (rTitle) rTitle.innerText = "GRAND END";
            if (rText) rText.innerText = "最上階の暗黒竜を討伐し、螺旋の塔に永遠の平穏が訪れた！1周目完全クリアおめでとうございます！";
            if (rBtn) rBtn.innerText = "タイトルへ戻る";
            startBGM("grand_end");
        } else {
            if (rText) rText.innerText = `${STAGES[window.curIdx].name}を撃破した！次の階層への扉が開く。`;
            if (rBtn) rBtn.innerText = "次へ進む";
        }
    } else {
        if (rTitle) { rTitle.innerText = "DEFEATED"; rTitle.style.color = '#f43f5e'; }
        const resIcon = document.getElementById('res-icon');
        if (resIcon) resIcon.innerText = "💀";
        if (rText) rText.innerText = "目の前が真っ暗になった...";
        if (rBtn) rBtn.innerText = "タイトルへ戻る";
        window.curIdx = -1;
    }
    window.isBusy = false;
};

window.resetGame = function() {
    window.isBusy = false; 
    
    if (!window.isDebugUnlocked) {
        window.pMaxHp = 100;
        window.pHp = 100;
    } else {
        window.pMaxHp = 8000;
        window.pHp = 8000;
    }
    window.mana = 1.0;
    window.curIdx = -1;
    window.itemInventory = { potion: 1, amulet: 1 };
    window.isAmuletActive = 0;

    const cleanContainer = document.getElementById('e-sprite-container');
    if (cleanContainer) {
        cleanContainer.style.background = "none";
    }

    const effScr = document.getElementById('eff-scr');
    if (effScr) {
        effScr.className = "";
    }

    const battleLog = document.getElementById('battle-log');
    if (battleLog) battleLog.innerHTML = "コマンドを選択せよ。";

    stopBGM();
    if (typeof stopSlimeAnimation === 'function') stopSlimeAnimation();
};
// ==========================================
// 🕒 📦 END OF FILE - js/battle.js [Ver 7.09]
// ==========================================
