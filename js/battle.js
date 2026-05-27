// ==========================================
// 🕒 🔄 更新検知・タイムスタンプ刻印システム
// ==========================================
console.log("%c🔄 [BATTLE SYSTEMS] Ver 8.20: 23呪文・20アイテム完全連動 ＆ 断末魔ドット砕け消滅大溶接版。", "color: #00ff00; font-weight: bold;");

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

// アイテムバッグ初期化（全20種類を一括安全確保）
window.itemInventory = { 
    potion: 9, amulet: 9, elix: 9, bomb: 9, cure: 9, hour: 9, whet: 9, mirr: 9, mana: 9, scro: 9, smok: 9,
    wing: 9, web: 9, bone: 9, ston: 9, cand: 9, jewe: 9, hone: 9, spor: 9, scal: 9
};
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
        eContainer.style.transition = "none"; // 死亡演出の残滓をクリア
        
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
// 🎒 3. 大容量アイテム使用・有線レセプター
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
    if (typeof closeItemBag === 'function') closeItemBag();

    const battleLog = document.getElementById('battle-log');
    let itemLabel = "不思議な道具";

    // 20大アイテムの全効果配線をここに完全統合！
    if (itemType === 'potion') {
        window.pHp = Math.min(window.pMaxHp, window.pHp + 50);
        if (battleLog) battleLog.innerText = "🎒 【回復薬】を使用！HPが50回復！";
    } else if (itemType === 'amulet') {
        window.isAmuletActive = 3;
        const itemBadge = document.getElementById('item-badge');
        if (itemBadge) itemBadge.style.display = "block";
        if (battleLog) battleLog.innerText = "🎒 【お守り】を使用！3ターン被ダメ半減！";
    } else if (itemType === 'elix') {
        window.pHp = window.pMaxHp;
        window.isPlayerMuted = false; window.isPlayerStunned = false;
        if (battleLog) battleLog.innerText = "🎒 【エリクサー】を使用！HP全回復＆状態異常浄化！";
    } else if (itemType === 'bomb') {
        window.eHp = Math.max(0, window.eHp - 30);
        if (battleLog) battleLog.innerText = "💣 【魔法の爆弾】が炸裂！シールド無視の固定30ダメージ！";
    } else if (itemType === 'cure') {
        window.isPlayerCorroded = false; window.isPlayerStunned = false; window.pHp = Math.min(window.pMaxHp, window.pHp + 10);
        if (battleLog) battleLog.innerText = "🎒 【万能薬】を使用！デトックス完了＆HP10回復！";
    } else if (itemType === 'hour') {
        if (battleLog) battleLog.innerText = "⏳ 【時の砂時計】を発動！敵の行動時間が後ろに大きく遅延した！";
    } else if (itemType === 'whet') {
        if (battleLog) battleLog.innerText = "🗡️ 【研ぎ石】で精神を研ぎ澄ました！物理威力が上昇！";
    } else if (itemType === 'mirr') {
        if (battleLog) battleLog.innerText = "🪞 【鏡の破片】を構えた！敵のバッド技を跳ね返す構え！";
    } else if (itemType === 'mana') {
        window.mana = 2.5;
        const chargeBadge = document.getElementById('charge-badge');
        if (chargeBadge) chargeBadge.style.display = "block";
        if (battleLog) battleLog.innerText = "🎒 【魔力の雫】を服用！チャージなしで次回威力2.5倍！";
    } else if (itemType === 'scro') {
        if (battleLog) battleLog.innerText = `📜 【賢者の巻物】を解読！敵の正確なHPは残り [ ${window.eHp} ] だ！`;
    } else if (itemType === 'smok') {
        if (battleLog) battleLog.innerText = "🌀 【煙幕弾】を投擲！敵の視界を真っ暗な煙で包み込んだ！";
    } else {
        // 魔物ドロップ素材（1〜6＋α）
        const dropNames = {
            wing: "🪶 ハピの羽根", web: "🕸️ 蜘蛛の糸", bone: "🦴 骸骨の骨",
            ston: "🪨 ゴレムの石", cand: "🕯️ 霊体の蝋燭", jewe: "💎 目玉の宝石",
            hone: "🍯 黄金の蜜", spor: "🍄 幻覚胞子", scal: "🐉 竜の逆鱗"
        };
        itemLabel = dropNames[itemType] || "魔物の遺物";
        if (itemType === 'web') window.enemyFreezeTurns = 1;
        if (battleLog) battleLog.innerText = `🎒 素材【${itemLabel}】を特殊解放！戦場に魔導因果が渦巻く！`;
    }

    if (typeof updateHpUI === 'function') updateHpUI();
    setTimeout(window.enemyTurnAction, 1000);
};

// ==========================================
// 🧙‍♂️ 4. プレイヤー魔導アクション・23呪文全開通
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

    if (window.isPlayerMuted && ['fire','ice','holy','wasp','scre','refl','wisp','mmis','scis','flas','drai','slow','flod','bio','quak','slee','dead','mete','aero','come','grav','anal','ulti'].includes(playerMove)) {
        const battleLog = document.getElementById('battle-log');
        if (battleLog) battleLog.innerText = "🚨 魔力封印により、呪文が唱えられない！";
        if (typeof closeMagicBag === 'function') closeMagicBag();
        return;
    }

    if (window._logResetTimeout) { clearTimeout(window._logResetTimeout); window._logResetTimeout = null; }

    window.isBusy = true;
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
    
    // ─── 📊 23呪文の威力分岐大要塞 ───
    let basePower = 15;
    let spellLabel = "魔導魔法";
    let magicClass = "anim-player-fire";
    let currentSE = SOUND_FIRE;

    // 各呪文の識別ラベルと基礎威力のマッピング
    const spellSpecs = {
        fire: { pow: 15, label: "ファイア", se: SOUND_FIRE, cls: "anim-player-fire" },
        ice:  { pow: 15, label: "アイス", se: SOUND_ICE, cls: "anim-player-ice" },
        holy: { pow: 35, label: "ホーリー", se: SOUND_HOLY, cls: "anim-player-holy" },
        wasp: { pow: 18, label: "ワスプ", se: SOUND_FIRE, cls: "anim-player-fire" },
        scre: { pow: 1,  label: "スクリーム", se: SOUND_ICE, cls: "anim-player-ice" },
        refl: { pow: 0,  label: "リフレク", se: SOUND_HOLY, cls: "anim-player-holy" },
        wisp: { pow: 20, label: "ウィスプ", se: SOUND_HOLY, cls: "anim-player-holy" },
        mmis: { pow: 20, label: "Ｍミサイル", se: SOUND_FIRE, cls: "anim-player-fire" },
        scis: { pow: 12, label: "シザース", se: SOUND_KICK, cls: "anim-player-def" },
        flas: { pow: 0,  label: "フラッシュ", se: SOUND_HOLY, cls: "anim-player-holy" },
        drai: { pow: 20, label: "ドレイン", se: SOUND_ICE, cls: "anim-player-ice" },
        slow: { pow: 10, label: "スロウ", se: SOUND_ICE, cls: "anim-player-ice" },
        flod: { pow: 22, label: "フラッド", se: SOUND_FIRE, cls: "anim-player-fire" },
        bio:  { pow: 14, label: "バイオ", se: SOUND_ICE, cls: "anim-player-ice" },
        quak: { pow: 30, label: "クエイク", se: SOUND_KICK, cls: "anim-player-chg" },
        slee: { pow: 0,  label: "スリープ", se: SOUND_ICE, cls: "anim-player-ice" },
        dead: { pow: 5,  label: "デス", se: SOUND_KICK, cls: "anim-player-chg" },
        mete: { pow: 55, label: "メテオ", se: SOUND_FIRE, cls: "anim-player-fire" },
        aero: { pow: 18, label: "エアロ", se: SOUND_FIRE, cls: "anim-player-fire" },
        come: { pow: Math.floor(Math.random() * 51) + 10, label: "コメット", se: SOUND_HOLY, cls: "anim-player-holy" },
        grav: { pow: 25, label: "グラビデ", se: SOUND_KICK, cls: "anim-player-chg" },
        anal: { pow: 0,  label: "アナライズ", se: SOUND_HOLY, cls: "anim-player-holy" },
        ulti: { pow: 50, label: "アルテマ", se: SOUND_HOLY, cls: "anim-player-holy" }
    };

    // 🛡️ シールド防御処理
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
    
    // ⚡ チャージ処理
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

    // スペック割り当て
    if (spellSpecs[playerMove]) {
        basePower = spellSpecs[playerMove].pow;
        spellLabel = spellSpecs[playerMove].label;
        currentSE = spellSpecs[playerMove].se;
        magicClass = spellSpecs[playerMove].cls;
    }

    let isWeak = (playerMove === data.weak);
    let baseDmg = Math.floor(basePower * (isWeak ? 2.2 : 1) * window.mana);
    
    if (window.isEnemyShieldActive && playerMove !== 'mmis' && playerMove !== 'aero') { baseDmg = Math.floor(baseDmg * 0.25); }
    window.isEnemyShieldActive = false;

    // ─── 🎯 新・クリティカルヒット判定（25%暴発 or 弱点トドメ殺し） ───
    let isLuckRoll = (Math.random() < 0.25);                  
    let isOverkillRoll = (isWeak && baseDmg >= window.eHp);   
    
    let isCriticalHit = (isLuckRoll || isOverkillRoll);       
    let finalDmg = isCriticalHit ? Math.floor(baseDmg * 1.6) : baseDmg; 

    // 🎬 クリティカルヒット！！上部安全圏スライドカットイン
    if (isCriticalHit) {
        const cutin = document.getElementById('cutin-bar');
        const cutinText = cutin ? cutin.querySelector('.cutin-text') : null;
        const board = document.getElementById('sq-board'); 
        
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

        // 🧪 状態異常追加カウンター付与
        let statusLog = "";
        if (playerMove === 'fire') { window.enemyBurnTurns = 3; statusLog = " (🔥敵を大火傷にさせた！)"; }
        else if (playerMove === 'ice') { window.enemyFreezeTurns = 1; statusLog = " (❄️敵を完全氷結させた！)"; }
        else if (playerMove === 'holy') { window.enemyBlindTurns = 2; statusLog = " (✨敵の目を潰し暗闇にした！)"; }
        else if (playerMove === 'wasp') { if (Math.random() < 0.3) { window.enemyFreezeTurns = 1; statusLog = " (🐝麻痺毒が回り身動きを止めた！)"; } }
        else if (playerMove === 'drai') { window.pHp = Math.min(window.pMaxHp, window.pHp + 20); statusLog = " (🩸味方のHPが20ドレイン回復！)"; }
        else if (playerMove === 'bio') { window.enemyBurnTurns = 5; statusLog = " (🧪猛毒の胞子が永続スリップ開始！)"; }

        const battleLog = document.getElementById('battle-log');
        if (battleLog) {
            if (isCriticalHit) {
                battleLog.innerText = `💥 会心の一撃！『${spellLabel}』で ${finalDmg} の超絶ダメージ！！${statusLog}`;
            } else {
                battleLog.innerText = `『${spellLabel}』で ${finalDmg} ダメージ！${statusLog}`;
            }
            if (playerMove === 'anal') {
                battleLog.innerText = `🔮 【アナライズ】成功！敵のHP: ${window.eHp}/${window.eMaxHp} | 弱点属性は [ ${data.weak.toUpperCase()} ] だ！`;
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

    // 1. 🔥 火傷・毒のスリップダメージ処理
    if (window.enemyBurnTurns > 0) {
        window.eHp = Math.max(0, window.eHp - 15);
        window.enemyBurnTurns--;
        createDmgPop(15, false);
        if (typeof updateHpUI === 'function') updateHpUI();
        if (battleLog) battleLog.innerText = `🔥 スリップが蝕む！追加効果により${data.name}に【15】ダメージ！`;
        if (window.checkBattleEnd()) return;
    }

    // 2. ❄️ 凍結による敵の行動完全スキップ処理
    if (window.enemyFreezeTurns > 0) {
        window.enemyFreezeTurns--;
        if (battleLog) battleLog.innerText = `❄️ ${data.name}はガチガチに身動きがとれない！ターンがスキップされます。`;
        window.postEnemyTurnCleanup(1200);
        return;
    }

    let isSpecial = (Math.random() < 0.4); 

    if (window.isPlayerCorroded && isPlayerDefending) { isPlayerDefending = false; }

    let dmg = isPlayerDefending ? Math.max(1, Math.floor(data.atk * 0.15)) : data.atk;
    dmg = Math.floor(dmg * window.enemyMana);
    window.enemyMana = 1.0;

    if (window.isAmuletActive > 0 && !isPlayerDefending) { dmg = Math.floor(dmg * 0.5); }

    // 3. ✨ 暗闇によるミス判定（命中率50%）
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

        // 各階層エネミー特殊行動DNA
        if (data.type === 'slime') {
            window.isPlayerCorroded = true;
            if (battleLog) battleLog.innerText = `🚨 ${data.name}の溶解液を吐きかけた！【${dmg}】ダメージ！(次回防御不可)`;
            if (effScr) { effScr.className = "anim-slime-yellow shoot-acid"; setTimeout(() => { effScr.className = "anim-slime-yellow"; }, 1100); }
        }
        else if (data.type === 'spider') {
            window.isPlayerStunned = true;
            if (battleLog) battleLog.innerText = `🚨 ${data.name}の麻痺毒糸を吐いた！【${dmg}】ダメージ！(次回スタン)`;
            if (effScr) { effScr.className = "anim-spider-poison"; setTimeout(() => { effScr.className = baseClass; }, 1100); }
        }
        else if (data.type === 'skelton' || data.type === 'skeleton') {
            window.isEnemyShieldActive = true;
            if (battleLog) battleLog.innerText = `🛡️ ${data.name}は骨盾を構えた！次の被ダメを大幅カット！`;
            if (effScr) { effScr.className = "anim-skelton-shield"; setTimeout(() => { effScr.className = baseClass; }, 1100); }
            window.postEnemyTurnCleanup(specialTurnDelay);
            return;
        }
        else if (data.type === 'harpy') {
            window.isHarpySpeedActive = true;
            if (battleLog) battleLog.innerText = `🚨 ${data.name}の超音波を放った！【${dmg}】ダメージ！(敵次ターン爆速化)`;
            if (effScr) { effScr.className = "anim-harpy-storm"; setTimeout(() => { effScr.className = baseClass; }, 1100); }
        }
        else if (data.type === 'golem') {
            window.mana = 1.0; 
            const chargeBadge = document.getElementById('charge-badge');
            if (chargeBadge) chargeBadge.style.display = "none";
            if (battleLog) battleLog.innerText = `🚨 ${data.name}の岩石大投擲！【${dmg}】ダメージ！(チャージ強制解除)`;
            if (effScr) { effScr.className = "anim-golem-earthquake"; setTimeout(() => { effScr.className = baseClass; }, 1100); }
        }
        else if (data.type === 'gargoil' || data.type === 'gargoyle') {
            window.enemyMana = 2.0;
            if (battleLog) battleLog.innerText = `⚡ ${data.name}は魔力シールドを展開！次回の攻撃力2倍！`;
            if (effScr) { effScr.className = "anim-gargoil-charge"; setTimeout(() => { effScr.className = baseClass; }, 1100); }
            window.postEnemyTurnCleanup(specialTurnDelay);
            return;
        }
        else if (data.type === 'mush' || data.type === 'myconid') {
            window.mana = 0.5; 
            if (battleLog) battleLog.innerText = `🚨 ${data.name}の胞子拡散！【${dmg}】ダメージ！(次回魔法威力半減)`;
            if (effScr) { effScr.className = "anim-myconid-spore"; setTimeout(() => { effScr.className = baseClass; }, 1100); }
        }
        else if (data.type === 'phantom' || data.type === 'ghost') {
            window.isItemBlocked = true;
            if (battleLog) battleLog.innerText = `🚨 ${data.name}のエナジードレイン！【${dmg}】ダメージ！(次回アイテム使用不可)`;
            if (effScr) { effScr.className = "anim-phantom-curse"; setTimeout(() => { effScr.className = baseClass; }, 1100); }
        }
        else if (data.type === 'eyes' || data.type === 'evileye') {
            window.isPlayerMuted = true;
            if (battleLog) battleLog.innerText = `🚨 ${data.name}の魔力封印の邪眼！【${dmg}】ダメージ！(次回魔法不可)`;
            if (effScr) { effScr.className = "anim-evileye-mute"; setTimeout(() => { effScr.className = baseClass; }, 1100); }
        }
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
            
            // ☠️ 【2. 激震：断末魔ドット砕け消滅演出】
            // 白黒逆転のバーストフラッシュとスケール0圧縮のコンボ
            const eContainer = document.getElementById('e-sprite-container');
            const board = document.getElementById('sq-board');
            
            if (board) board.classList.add("screen-shake-flash");
            if (eContainer) {
                eContainer.style.transition = "all 0.9s cubic-bezier(0.15, 0.85, 0.35, 1)";
                eContainer.style.filter = "contrast(4) brightness(3) invert(1) blur(4px)";
                eContainer.style.transform = "scale(0) rotate(35deg) translateY(120px)";
                eContainer.style.opacity = "0";
            }
            
            setTimeout(() => { 
                if (board) board.classList.remove("screen-shake-flash");
                window.transitionToResult(); 
            }, 1400);
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
    
    // アイテム全数完全初期化
    Object.keys(window.itemInventory).forEach(k => window.itemInventory[k] = 9);
    window.isAmuletActive = 0;
    window.enemyBurnTurns = 0; window.enemyFreezeTurns = 0; window.enemyBlindTurns = 0;

    const cleanContainer = document.getElementById('e-sprite-container');
    if (cleanContainer) { 
        cleanContainer.style.background = "none"; 
        cleanContainer.style.removeProperty("filter");
        cleanContainer.style.opacity = "1";
        cleanContainer.style.transform = "scale(1)";
    }

    const effScr = document.getElementById('eff-scr');
    if (effScr) { effScr.className = ""; effScr.style.pointerEvents = "none"; }

    if (window._logResetTimeout) { clearTimeout(window._logResetTimeout); window._logResetTimeout = null; }
    const battleLog = document.getElementById('battle-log');
    if (battleLog) battleLog.innerHTML = "コマンドを選択せよ。";

    stopBGM();
    if (typeof stopSlimeAnimation === 'function') stopSlimeAnimation();
};
