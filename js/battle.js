// ==========================================
// 🕒 🔄 更新検知・タイムスタンプ刻印システム
// ==========================================
console.log("%c🔄 [BATTLE SYSTEMS] Ver 7.65: クリティカルヒット！！（トドメ or 25%暴発1.6倍型）大溶接マスター全コード。", "color: #00ff00; font-weight: bold;");

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

// 🧪 敵側の状態異常永続カウンターの一括設置
window.enemyBurnTurns = 0;   // 🔥火傷カウンター（毎ターン15点スリップ）
window.enemyFreezeTurns = 0; // ❄️凍結カウンター（1ターン行動完全スキップ）
window.enemyBlindTurns = 0;  // ✨暗闇カウンター（2ターン通常物理ミス率50%）

// アイテムバッグ初期化
window.itemInventory = { potion: 1, amulet: 1 };
window.isAmuletActive = 0;

// 状態異常・特殊効果用追加フラグの一括管理
window.isPlayerStunned = false;       
window.isPlayerCorroded = false;     
window.isHarpySpeedActive = false;   
window.isPlayerMuted = false;        
window.isItemBlocked = false;        

// ⚡ 多重衝突を防ぐタイマーIDのチケット管理
window._activeMagicTimeout = null;
window._logResetTimeout = null;       

// ==========================================
// 🚀 2. ステージ・戦闘遷移
// ==========================================

window.nextStage = function() {
    if (typeof closeMagicBag === 'function') closeMagicBag();
    if (typeof closeItemBag === 'function') closeItemBag();
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
    
    window.isBusy = false; 
    window.isPlayerStunned = false;
    window.isPlayerCorroded = false;
    window.isHarpySpeedActive = false;
    window.isPlayerMuted = false;
    window.isItemBlocked = false;
    
    // 敵の状態異常バッファを完全に引き算クリア！
    window.enemyBurnTurns = 0;
    window.enemyFreezeTurns = 0;
    window.enemyBlindTurns = 0;
    
    window.isAmuletActive = 0;
    window.enemyMana = 1.0;
    window.isEnemyShieldActive = false;
    window.eHp = window.eMaxHp = data.hp;

    if (window._activeMagicTimeout) { clearTimeout(window._activeMagicTimeout); window._activeMagicTimeout = null; }
    if (window._logResetTimeout) { clearTimeout(window._logResetTimeout); window._logResetTimeout = null; }

    const eContainer = document.getElementById('e-sprite-container');
    const eSpriteGraphic = document.getElementById('e-sprite-graphic');
    
    // 👑【最凶スライム青化ゾンビバグ・絶対即死回路】
    if (eContainer) {
        eContainer.style.opacity = "1";
        eContainer.style.transform = "scale(1)";
        eContainer.style.background = "none";
        eContainer.style.removeProperty("filter"); 
        
        if (data.type === 'slime') {
            eContainer.style.setProperty("filter", "hue-rotate(65deg) saturate(2.5) brightness(1.2)", "important");
        }
    }
    if (eSpriteGraphic) {
        eSpriteGraphic.style.removeProperty("filter");
    }

    const pGraphic = document.getElementById('p-sprite-graphic');
    if (pGraphic) {
        pGraphic.src = './assets/enemies/player/player_wizard.png';
    }

    const itemBadge = document.getElementById('item-badge');
    const chargeBadge = document.getElementById('charge-badge');
    const eName = document.getElementById('e-name');
    const effScr = document.getElementById('eff-scr');
    const cutin = document.getElementById('cutin-bar');

    if (itemBadge) itemBadge.style.display = "none";
    if (chargeBadge) chargeBadge.style.display = "none";
    if (cutin) cutin.style.display = "none";
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

    if (effScr) {
        effScr.style.pointerEvents = "none";
        effScr.className = (data.type === 'slime') ? "anim-slime-yellow" : "";
    }

    const battleLog = document.getElementById('battle-log');
    if (battleLog) {
        battleLog.innerHTML = `${data.name}が現れた！弱点: ${data.weak.toUpperCase()}`;
    }

    startBGM("battle");
};

// ==========================================
// 🎒 3. アイテム使用
// ==========================================
window.useItem = function(itemType) {
    if (window.isBusy || window.pHp <= 0 || window.eHp <= 0 || window.itemInventory[itemType] <= 0) return;
    
    if (window.isItemBlocked) {
        const battleLog = document.getElementById('battle-log');
        if (battleLog) battleLog.innerText = "🚨 呪いでアイテムバッグが石化していて開けない！";
        return;
    }

    if (window._logResetTimeout) { clearTimeout(window._logResetTimeout); window._logResetTimeout = null; }

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
    if (playerMove === 'debug_death') {
        window.isBusy = false; 
        window.eHp = 0;
        if (typeof updateHpUI === 'function') updateHpUI();
        const battleLog = document.getElementById('battle-log');
        if (battleLog) battleLog.innerText = "☠ デスコード起動。";
        window.checkBattleEnd();
        return;
    }

    if (window.isBusy || window.pHp <= 0 || window.eHp <= 0) return;

    if (window.isPlayerMuted && (playerMove === 'fire' || playerMove === 'ice' || playerMove === 'holy')) {
        const battleLog = document.getElementById('battle-log');
        if (battleLog) battleLog.innerText = "🚨 魔力封印により、呪文が唱えられない！";
        if (typeof closeMagicBag === 'function') closeMagicBag();
        return;
    }

    if (window._logResetTimeout) { clearTimeout(window._logResetTimeout); window._logResetTimeout = null; }

    window.isBusy = true;
    
    // 🔮 呪文選択後、下部インラインスロットを自動でA面（メイン行動選択）へ最速格納！
    if (typeof closeMagicBag === 'function') closeMagicBag(); 

    if (window._activeMagicTimeout) { clearTimeout(window._activeMagicTimeout); }

    if (window.isPlayerStunned) {
        window.isPlayerStunned = false;
        const battleLog = document.getElementById('battle-log');
        if (battleLog) battleLog.innerText = "🚨 麻痺して動けない！";
        setTimeout(() => { window.isBusy = false; window.enemyTurnAction(); }, 1000);
        return;
    }

    const data = STAGES[window.curIdx];
    
    // ─── 📊 基礎ダメージおよび特殊倍率計算フェーズ ───
    let isWeak = (playerMove === data.weak);
    // 弱点なら2.2倍の基礎ボーナス
    let baseDmg = Math.floor((playerMove === 'holy' ? 35 : 15) * (isWeak ? 2.2 : 1) * window.mana);
    
    if (window.isEnemyShieldActive) { baseDmg = Math.floor(baseDmg * 0.25); }
    window.isEnemyShieldActive = false;

    // 🛡️ シールド展開
    if (playerMove === 'def') {
        const battleLog = document.getElementById('battle-log');
        if (battleLog) battleLog.innerText = "🛡 シールドを展開！防御姿勢をとった。";
        window.mana = 1.0;
        const chargeBadge = document.getElementById('charge-badge');
        if (chargeBadge) chargeBadge.style.display = "none";
        
        const effScr = document.getElementById('eff-scr');
        let baseClass = (data.type === 'slime') ? "anim-slime-yellow " : "";
        if (effScr) { effScr.className = baseClass + "anim-player-def"; setTimeout(() => { effScr.className = (data.type === 'slime') ? "anim-slime-yellow" : ""; }, 1100); }
        setTimeout(() => { window.enemyTurnAction(true); }, 1200);
        return;
    }
    
    // ⚡ チャージ
    if (playerMove === 'chg') {
        window.mana = 2.5;
        const chargeBadge = document.getElementById('charge-badge');
        const battleLog = document.getElementById('battle-log');
        if (chargeBadge) chargeBadge.style.display = "block";
        if (battleLog) battleLog.innerText = "⚡ パワーをチャージした！次回威力2.5倍！";
        
        const effScr = document.getElementById('eff-scr');
        let baseClass = (data.type === 'slime') ? "anim-slime-yellow " : "";
        if (effScr) { effScr.className = baseClass + "anim-player-chg"; setTimeout(() => { effScr.className = (data.type === 'slime') ? "anim-slime-yellow" : ""; }, 1100); }
        setTimeout(() => { window.enemyTurnAction(false); }, 1200);
        return;
    }

    // ─── 🎯 新・クリティカルヒット判定トリガー（25%暴発 or 弱点トドメ殺し） ───
    let isLuckRoll = (Math.random() < 0.25);                  // 確率25%ガチャの合致
    let isOverkillRoll = (isWeak && baseDmg >= window.eHp);   // 弱点かつこの一撃で殺せる（トドメ）
    
    let isCriticalHit = (isLuckRoll || isOverkillRoll);       // どちらか成立でクリティカル確定！
    let finalDmg = isCriticalHit ? Math.floor(baseDmg * 1.6) : baseDmg; // 発生時はダメージをさらに1.6倍乗算！

    let currentSE = SOUND_FIRE;
    let spellLabel = "ファイア";
    let magicClass = "anim-player-fire"; 

    if (playerMove === 'ice') { 
        currentSE = SOUND_ICE; spellLabel = "アイス"; magicClass = "anim-player-ice"; 
    } else if (playerMove === 'holy') { 
        currentSE = SOUND_HOLY; spellLabel = "ホーリー"; magicClass = "anim-player-holy"; 
    }

    // 🎬 新・クリティカルヒット！！演出カットイン着火
    if (isCriticalHit) {
        const cutin = document.getElementById('cutin-bar');
        const cutinText = cutin ? cutin.querySelector('.cutin-text') : null;
        const board = document.getElementById('sq-board'); // 白い特大ボード
        
        // 文字列を「クリティカルヒット！！」へ動的上書き
        if (cutinText) cutinText.innerText = "🧙‍♂️ クリティカルヒット！！";
        
        if (cutin) { cutin.style.display = "flex"; setTimeout(() => { cutin.style.display = "none"; }, 1000); }
        if (board) { board.classList.add("screen-shake-flash"); setTimeout(() => { board.classList.remove("screen-shake-flash"); }, 450); }
    }

    const effScr = document.getElementById('eff-scr');
    let baseClass = (data.type === 'slime') ? "anim-slime-yellow " : "";
    if (effScr) effScr.className = baseClass + magicClass;

    window._activeMagicTimeout = setTimeout(() => {
        playSE(currentSE);
        window.eHp = Math.max(0, window.eHp - finalDmg);
        if (typeof updateHpUI === 'function') updateHpUI();
        createDmgPop(finalDmg, false);

        // 🧪 属性ごとの「状態異常カウンター」付与判定（実況テキスト同期）
        let statusLog = "";
        if (playerMove === 'fire') {
            window.enemyBurnTurns = 3;
            statusLog = " (🔥敵を大火傷にさせた！)";
        } else if (playerMove === 'ice') {
            window.enemyFreezeTurns = 1;
            statusLog = " (❄️敵を完全氷結させた！)";
        } else if (playerMove === 'holy') {
            window.enemyBlindTurns = 2;
            statusLog = " (✨敵の目を潰し暗闇にした！)";
        }

        const battleLog = document.getElementById('battle-log');
        if (battleLog) {
            if (isCriticalHit) {
                battleLog.innerText = `💥 会心の一撃！『${spellLabel}』で ${finalDmg} の超絶ダメージ！！${statusLog}`;
            } else {
                battleLog.innerText = `『${spellLabel}』で ${finalDmg} ダメージ！${statusLog}`;
            }
        }

        window.mana = 1.0;
        const chargeBadge = document.getElementById('charge-badge');
        if (chargeBadge) chargeBadge.style.display = "none";

        window._activeMagicTimeout = null;
        
        setTimeout(() => { 
            if (effScr) effScr.className = (data.type === 'slime') ? "anim-slime-yellow" : "";
            if (!window.checkBattleEnd()) window.enemyTurnAction(); 
        }, 600);

    }, 600);
};

// ==========================================
// 👹 5. エネミーターン行動AI＆カウンター処理
// ==========================================
window.enemyTurnAction = function(isPlayerDefending = false) {
    if (window.eHp <= 0 || window.pHp <= 0) { window.isBusy = false; return; }
    const data = STAGES[window.curIdx];
    const battleLog = document.getElementById('battle-log');

    // ─── 🧪 敵の状態異常判定フェーズ ───
    
    // 1. 🔥 火傷のスリップダメージ処理
    if (window.enemyBurnTurns > 0) {
        window.eHp = Math.max(0, window.eHp - 15);
        window.enemyBurnTurns--;
        createDmgPop(15, false);
        if (typeof updateHpUI === 'function') updateHpUI();
        if (battleLog) battleLog.innerText = `🔥 火傷が蝕む！スリップダメージで${data.name}に【15】ダメージ！`;
        
        if (window.checkBattleEnd()) return;
    }

    // 2. ❄️ 凍結による敵の行動完全スキップ処理
    if (window.enemyFreezeTurns > 0) {
        window.enemyFreezeTurns--;
        if (battleLog) battleLog.innerText = `❄️ ${data.name}はガチガチに凍りついていて身動きがとれない！`;
        window.postEnemyTurnCleanup(1200);
        return;
    }

    let isSpecial = (Math.random() < 0.4); 

    if (window.isPlayerCorroded && isPlayerDefending) { isPlayerDefending = false; }

    let dmg = isPlayerDefending ? Math.max(1, Math.floor(data.atk * 0.15)) : data.atk;
    dmg = Math.floor(dmg * window.enemyMana);
    window.enemyMana = 1.0;

    if (window.isAmuletActive > 0 && !isPlayerDefending) { dmg = Math.floor(dmg * 0.5); }

    // 3. ✨ 暗闇による通常体当たりのミス判定（命中率50%に引き算）
    if (window.enemyBlindTurns > 0 && !isSpecial) {
        window.enemyBlindTurns--;
        if (Math.random() < 0.5) {
            if (battleLog) battleLog.innerText = `✨ 暗闇の目潰し！ ${data.name}の突進攻撃は空を切った（MISS）！`;
            window.postEnemyTurnCleanup(1000);
            return;
        }
    } else if (window.enemyBlindTurns > 0) {
        window.enemyBlindTurns--;
    }

    window.isPlayerMuted = false; window.isItemBlocked = false; window.isPlayerCorroded = false;

    let specialTurnDelay = 1200;
    let baseClass = (data.type === 'slime') ? "anim-slime-yellow " : "";

    if (isSpecial) {
        playSE(SOUND_HOLY);
        const effScr = document.getElementById('eff-scr');

        if (effScr) effScr.style.pointerEvents = "auto";

        // ─── 1階：ヘドロスライム ───
        if (data.type === 'slime') {
            window.isPlayerCorroded = true;
            if (battleLog) battleLog.innerText = `🚨 ${data.name}の溶解液を吐きかけた！【${dmg}】ダメージ！(次回防御不可)`;
            if (effScr) { effScr.className = "anim-slime-yellow shoot-acid"; setTimeout(() => { effScr.className = "anim-slime-yellow"; }, 1100); }
        }
        
        // ─── 2階：ブラッドスパイダー ───
        else if (data.type === 'spider') {
            window.isPlayerStunned = true;
            if (battleLog) battleLog.innerText = `🚨 ${data.name}の麻痺毒糸を吐いた！【${dmg}】ダメージ！(次回スタン)`;
            if (effScr) { effScr.className = "anim-spider-poison"; setTimeout(() => { effScr.className = baseClass; }, 1100); }
        }
        
        // ─── 3階：スケルトンナイト ───
        else if (data.type === 'skelton' || data.type === 'skeleton') {
            window.isEnemyShieldActive = true;
            if (battleLog) battleLog.innerText = `🛡️ ${data.name}は骨盾を構えた！次の被ダメを大幅カット！`;
            if (effScr) { effScr.className = "anim-skelton-shield"; setTimeout(() => { effScr.className = baseClass; }, 1100); }
            window.postEnemyTurnCleanup(specialTurnDelay);
            return;
        }
        
        // ─── 4階：ハーピィ ───
        else if (data.type === 'harpy') {
            window.isHarpySpeedActive = true;
            if (battleLog) battleLog.innerText = `🚨 ${data.name}の超音波を放った！【${dmg}】ダメージ！(敵次ターン爆速化)`;
            if (effScr) { effScr.className = "anim-harpy-storm"; setTimeout(() => { effScr.className = baseClass; }, 1100); }
        }
        
        // ─── 5階：ゴーレム ───
        else if (data.type === 'golem') {
            window.mana = 1.0; 
            const chargeBadge = document.getElementById('charge-badge');
            if (chargeBadge) chargeBadge.style.display = "none";
            if (battleLog) battleLog.innerText = `🚨 ${data.name}の岩石大投擲！【${dmg}】ダメージ！(チャージ強制解除)`;
            if (effScr) { effScr.className = "anim-golem-earthquake"; setTimeout(() => { effScr.className = baseClass; }, 1100); }
        }
        
        // ─── 6階：ガーゴイル ───
        else if (data.type === 'gargoil' || data.type === 'gargoyle') {
            window.enemyMana = 2.0;
            if (battleLog) battleLog.innerText = `⚡ ${data.name}は魔力シールドを展開！次回の攻撃力2倍！`;
            if (effScr) { effScr.className = "anim-gargoil-charge"; setTimeout(() => { effScr.className = baseClass; }, 1100); }
            window.postEnemyTurnCleanup(specialTurnDelay);
            return;
        }
        
        // ─── 7階：マイコニド ───
        else if (data.type === 'mush' || data.type === 'myconid') {
            window.mana = 0.5; 
            if (battleLog) battleLog.innerText = `🚨 ${data.name}の胞子拡散！【${dmg}】ダメージ！(次回魔法威力半減)`;
            if (effScr) { effScr.className = "anim-myconid-spore"; setTimeout(() => { effScr.className = baseClass; }, 1100); }
        }
        
        // ─── 8階：ファントム ───
        else if (data.type === 'phantom' || data.type === 'ghost') {
            window.isItemBlocked = true;
            if (battleLog) battleLog.innerText = `🚨 ${data.name}のエナジードレイン！【${dmg}】ダメージ！(次回アイテム使用不可)`;
            if (effScr) { effScr.className = "anim-phantom-curse"; setTimeout(() => { effScr.className = baseClass; }, 1100); }
        }
        
        // ─── 9階：イビルアイ ───
        else if (data.type === 'eyes' || data.type === 'evileye') {
            window.isPlayerMuted = true;
            if (battleLog) battleLog.innerText = `🚨 ${data.name}の魔力封印の邪眼！【${dmg}】ダメージ！(次回魔法不可)`;
            if (effScr) { effScr.className = "anim-evileye-mute"; setTimeout(() => { effScr.className = baseClass; }, 1100); }
        }
        
        // ─── 10階：カリスドラゴン ───
        else if (data.type === 'dragon') {
            window.eHp = Math.min(window.eMaxHp, window.eHp + 30); 
            if (battleLog) battleLog.innerText = `🚨 ${data.name}のカタストロフィ・ブレス！【${dmg}】ダメージ！(敵のHPが30回復)`;
            if (effScr) { effScr.className = "anim-dragon-breath"; setTimeout(() => { effScr.className = baseClass; }, 1100); }
        }
        
        window.pHp = Math.max(0, window.pHp - dmg);
        if (typeof updateHpUI === 'function') updateHpUI();
        createDmgPop(dmg, true);
        window.postEnemyTurnCleanup(specialTurnDelay);
    } else {
        // 通常突進攻撃
        setTimeout(() => { playSE(SOUND_KICK); }, 200);
        const eContainer = document.getElementById('e-sprite-container');
        if (eContainer) {
            eContainer.style.setProperty('--assaultX', '-140px');
            eContainer.style.animation = "enemyAssault 0.45s forwards";
        }
        setTimeout(() => { if (eContainer) eContainer.style.animation = "floatE 2.2s infinite alternate ease-in-out"; }, 460);

        if (battleLog) battleLog.innerText = `${data.name}の突進体当たり攻撃！【${dmg}】ダメージ！`;
        
        window.pHp = Math.max(0, window.pHp - dmg);
        if (typeof updateHpUI === 'function') updateHpUI();
        createDmgPop(dmg, true);
        window.postEnemyTurnCleanup(specialTurnDelay);
    }
};

window.postEnemyTurnCleanup = function(forcedDelay = 800) {
    if (window.isAmuletActive > 0) {
        window.isAmuletActive--;
        if (window.isAmuletActive <= 0) {
            const itemBadge = document.getElementById('item-badge');
            if (itemBadge) itemBadge.style.display = "none";
        }
    }
    
    let nextTurnDelay = window.isHarpySpeedActive ? 400 : forcedDelay;
    window.isHarpySpeedActive = false; 

    setTimeout(() => {
        if (!window.checkBattleEnd()) {
            window.isBusy = false; 
            const effScr = document.getElementById('eff-scr');
            if (effScr) effScr.style.pointerEvents = "none";

            if (window._logResetTimeout) { clearTimeout(window._logResetTimeout); }

            window._logResetTimeout = setTimeout(() => {
                const battleLog = document.getElementById('battle-log');
                if (battleLog && window.pHp > 0 && window.eHp > 0 && !window.isBusy) {
                    battleLog.innerText = "コマンドを選択せよ。";
                }
                window._logResetTimeout = null; 
            }, 2600);
        }
    }, nextTurnDelay);
};

window.checkBattleEnd = function() {
    if (window.pHp <= 0 || window.eHp <= 0) {
        stopBGM();
        if (typeof stopSlimeAnimation === 'function') stopSlimeAnimation();
        if (window._logResetTimeout) { clearTimeout(window._logResetTimeout); window._logResetTimeout = null; }

        const effScr = document.getElementById('eff-scr');
        if (effScr) effScr.style.pointerEvents = "none";

        if (window.eHp <= 0) {
            playSE(SOUND_FREEZE_DEAD);
            const eContainer = document.getElementById('e-sprite-container');
            if (eContainer) { eContainer.style.opacity = "0"; eContainer.style.transform = "scale(0.5)"; }
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
    if (!window.isDebugUnlocked) { window.pMaxHp = 100; window.pHp = 100; } 
    else { window.pMaxHp = 8000; window.pHp = 8000; }
    window.mana = 1.0; window.curIdx = -1;
    window.itemInventory = { potion: 1, amulet: 1 }; window.isAmuletActive = 0;
    window.enemyBurnTurns = 0; window.enemyFreezeTurns = 0; window.enemyBlindTurns = 0;

    const cleanContainer = document.getElementById('e-sprite-container');
    if (cleanContainer) { cleanContainer.style.background = "none"; cleanContainer.style.removeProperty("filter"); }

    const effScr = document.getElementById('eff-scr');
    if (effScr) { effScr.className = ""; effScr.style.pointerEvents = "none"; }

    if (window._logResetTimeout) { clearTimeout(window._logResetTimeout); window._logResetTimeout = null; }
    const battleLog = document.getElementById('battle-log');
    if (battleLog) battleLog.innerHTML = "コマンドを選択せよ。";

    stopBGM();
    if (typeof stopSlimeAnimation === 'function') stopSlimeAnimation();
};
