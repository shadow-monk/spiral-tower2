// ==========================================
// 🕒 🔄 更新検知・タイムスタンプ刻印システム
// ==========================================
console.log("%c🔄 [BATTLE SYSTEMS] Ver 7.60: クリティカル激震・火傷/凍結/暗闇カウンター・スライム黄色完全同期版。", "color: #00ff00; font-weight: bold;");

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
    // CSSの旧キャッシュを跡形もなく粉砕するため、一旦フィルターを完全にクリアしてインラインで黄金化を強制溶接！
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
    
    // 🔮【核心のバグ修正】魔法を選んだその瞬間に、下部スロットを自動でA面（メイン行動選択）へ最速格納！
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
    let isCritical = (playerMove === data.weak);
    let dmg = Math.floor((playerMove === 'holy' ? 35 : 15) * (isCritical ? 2.2 : 1) * window.mana);

    if (window.isEnemyShieldActive) { dmg = Math.floor(dmg * 0.25); }
    window.isEnemyShieldActive = false;

    const effScr = document.getElementById('eff-scr');
    let baseClass = (data.type === 'slime') ? "anim-slime-yellow " : "";

    // 🛡️ シールド展開！
    if (playerMove === 'def') {
        const battleLog = document.getElementById('battle-log');
        if (battleLog) battleLog.innerText = "🛡 シールドを展開！防御姿勢をとった。";
        window.mana = 1.0;
        const chargeBadge = document.getElementById('charge-badge');
        if (chargeBadge) chargeBadge.style.display = "none";
        
        if (effScr) { effScr.className = baseClass + "anim-player-def"; setTimeout(() => { effScr.className = (data.type === 'slime') ? "anim-slime-yellow" : ""; }, 1100); }
        setTimeout(() => { window.enemyTurnAction(true); }, 1200);
        return;
    }
    
    // ⚡ チャージ！
    if (playerMove === 'chg') {
        window.mana = 2.5;
        const chargeBadge = document.getElementById('charge-badge');
        const battleLog = document.getElementById('battle-log');
        if (chargeBadge) chargeBadge.style.display = "block";
        if (battleLog) battleLog.innerText = "⚡ パワーをチャージした！次回威力2.5倍！";
        
        if (effScr) { effScr.className = baseClass + "anim-player-chg"; setTimeout(() => { effScr.className = (data.type === 'slime') ? "anim-slime-yellow" : ""; }, 1100); }
        setTimeout(() => { window.enemyTurnAction(false); }, 1200);
        return;
    }

    let currentSE = SOUND_FIRE;
    let spellLabel = "ファイア";
    let magicClass = "anim-player-fire"; 

    if (playerMove === 'ice') { 
        currentSE = SOUND_ICE; spellLabel = "アイス"; magicClass = "anim-player-ice"; 
    } else if (playerMove === 'holy') { 
        currentSE = SOUND_HOLY; spellLabel = "ホーリー"; magicClass = "anim-player-holy"; 
    }

    // 🎬【最凶カットイン＆激震フラッシュ着火回路】
    // 弱点属性を突いた瞬間、htmlのカットインバーを展開し、ゲーム外枠を激しくシェイク！
    if (isCritical) {
        const cutin = document.getElementById('cutin-bar');
        const board = document.getElementById('sq-board'); // 白い特大ボード
        if (cutin) { cutin.style.display = "flex"; setTimeout(() => { cutin.style.display = "none"; }, 1000); }
        if (board) { board.classList.add("screen-shake-flash"); setTimeout(() => { board.classList.remove("screen-shake-flash"); }, 500); }
    }

    if (effScr) effScr.className = baseClass + magicClass;

    window._activeMagicTimeout = setTimeout(() => {
        playSE(currentSE);
        window.eHp = Math.max(0, window.eHp - dmg);
        if (typeof updateHpUI === 'function') updateHpUI();
        createDmgPop(dmg, false);

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
            battleLog.innerText = isCritical ? `💥 弱点直撃！『${spellLabel}』で ${dmg} ダメージ！${statusLog}` : `『${spellLabel}』で ${dmg} ダメージ！${statusLog}`;
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

    // ─── 🧪 敵の状態異常判定フェーズ（追加足し算） ───
    
    // 1. 🔥 火傷のスリップダメージ処理
    if (window.enemyBurnTurns > 0) {
        window.eHp = Math.max(0, window.eHp - 15);
        window.enemyBurnTurns--;
        createDmgPop(15, false); // 敵の脳天へ15ダメ
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
        window.enemyBlindTurns--; // 特殊技の場合は必中とするが残りターン数は消費
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
            if (battleLog) battleLog.innerText = `⚡ ${data.name}
