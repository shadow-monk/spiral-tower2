// ==========================================
// 🕒 🔄 更新検知・タイムスタンプ刻印システム
// ==========================================
console.log("%c🔄 [BATTLE SYSTEMS] Ver 6.70: デバッグ暴走正常化 ＆ コマンドフリーズ沼完全撲滅版がリリースされました。", "color: #00ff00; font-weight: bold;");

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
window.isPlayerStunned = false;

// ⚡ 【多重衝突バグ根絶】魔法タイマーの予約チケット管理番号を保持する安全弁
window._activeMagicTimeout = null;

// ==========================================
// 🚀 2. ステージ・戦闘遷移
// ==========================================

/**
 * 次の階層へ進む処理
 */
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

/**
 * 戦闘開始の初期化処理
 */
window.startBattle = function() {
    const data = STAGES[window.curIdx];
    
    window.eHp = window.eMaxHp = data.hp;
    window.isBusy = false;
    window.isPlayerStunned = false;
    window.isAmuletActive = 0;
    window.enemyMana = 1.0;
    window.isEnemyShieldActive = false;

    // 前の試合の魔法タイマーの残像を完全抹殺
    if (window._activeMagicTimeout) {
        clearTimeout(window._activeMagicTimeout);
        window._activeMagicTimeout = null;
    }

    const eContainer = document.getElementById('e-sprite-container');
    if (eContainer) {
        eContainer.style.opacity = "1";
        eContainer.style.transform = "scale(1)";
        
        // 🎨【背面オーラ同期】敵が現れる瞬間に、
        // データベースから取得した属性カラー（data.glow）で敵の真後ろだけを美しい後光で染める
        if (data.glow) {
            eContainer.style.background = `radial-gradient(circle, ${data.glow} 0%, rgba(15,23,42,0) 70%)`;
            eContainer.style.borderRadius = "50%"; // オーラを綺麗な真ん丸に成形
        } else {
            eContainer.style.background = "none";
            eContainer.style.borderRadius = "0";
        }
    }

    const pGraphic = document.getElementById('p-sprite-graphic');
    if (pGraphic) {
        pGraphic.src = 'https://raw.githubusercontent.com/shadow-monk/spiral-tower2/main/assets/enemies/player/player_wizard.png';
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
        eSpriteGraphic.src = MASTER_ANIM_MAP[data.type][0];
    }

    showScreen('scr-battle');

    if (typeof startCustomAnimation === 'function') {
        startCustomAnimation(data.type);
    }
    
    // 🛡️【①デバッグ正常化ガード策】
    // ui.jsが読み込まれる前に外部デバッグからここが叩かれてクラッシュ・混線するのを100%防ぐ防波堤
    if (typeof updateHpUI === 'function') {
        updateHpUI();
    }

    if (typeof checkDevPassword === 'function') {
        checkDevPassword();
    }

    // 🎨【Glow演出：理想のキャラクター背面オーラ仕様の土台】
    if (effScr) {
        effScr.style.backgroundColor = '#0f172a'; // 画面全体はクリアでクッキリした漆黒を100%維持
        effScr.style.boxShadow = 'none';           // 画面全体の曇りを完全にシャットアウト
        effScr.style.borderColor = data.floor === 10 ? '#be123c' : '#334155'; // 10階ボスのみ赤、他は通常枠線
    }

    // ログエリアの正常点灯
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
// 🧙‍♂️ 4. プレイヤー魔導アクション（SE完全精密マッピング版）
// ==========================================
window.turn = function(playerMove) {
    if (window.isBusy || window.pHp <= 0 || window.eHp <= 0) return;
    window.isBusy = true;

    // 🔒【連打・混線ガード】もし前ターンの未爆発タイマーが残っていたら、その場で破棄して上書き汚染を完全遮断！
    if (window._activeMagicTimeout) {
        clearTimeout(window._activeMagicTimeout);
    }

    // 🛡️【②フリーズ対策：麻痺ルートのロック解除漏れ撲滅】
    // 麻痺行動不能インターセプト時に、window.isBusy を解除しないまま敵に進んでいた致命的バグを完治
    if (window.isPlayerStunned) {
        window.isPlayerStunned = false;
        const battleLog = document.getElementById('battle-log');
        if (battleLog) battleLog.innerText = "🚨 麻痺して動けない！";
        
        setTimeout(() => {
            window.isBusy = false; // 敵ターンへ渡る前に、プレイヤーの入力権フラグを一度正常に解放する
            window.enemyTurnAction();
        }, 1000);
        return;
    }

    const data = STAGES[window.curIdx];
    let isCritical = (playerMove === data.weak);

    // デスコード（デバッグワンパン窓口の保護強化）
    if (playerMove === 'debug_death') {
        window.eHp = 0;
        if (typeof updateHpUI === 'function') updateHpUI();
        const battleLog = document.getElementById('battle-log');
        if (battleLog) battleLog.innerText = "☠ デスコード起動。";
        setTimeout(window.checkBattleEnd, 500);
        return;
    }

    // 威力計算
    let dmg = Math.floor((playerMove === 'holy' ? 35 : 15) * (isCritical ? 2.2 : 1) * window.mana);

    if (window.isEnemyShieldActive) {
        dmg = Math.floor(dmg * 0.25);
    }

    window.isEnemyShieldActive = false;

    // 🛡️ シールドコマンド時の即時分岐
    if (playerMove === 'def') {
        const battleLog = document.getElementById('battle-log');
        if (battleLog) battleLog.innerText = "🛡 シールドを展開！防御姿勢をとった。";
        window.mana = 1.0;
        const chargeBadge = document.getElementById('charge-badge');
        if (chargeBadge) chargeBadge.style.display = "none";
        setTimeout(() => { window.enemyTurnAction(true); }, 800);
        return;
    }
    
    // ⚡ チャージコマンド時の即時分岐
    if (playerMove === 'chg') {
        window.mana = 2.5;
        const chargeBadge = document.getElementById('charge-badge');
        const battleLog = document.getElementById('battle-log');
        if (chargeBadge) chargeBadge.style.display = "block";
        if (battleLog) battleLog.innerText = "⚡ パワーをチャージした！次回威力2.5倍！";
        setTimeout(() => { window.enemyTurnAction(false); }, 800);
        return;
    }

    // 定数とラベルをローカルカプセル化
    let currentSE = SOUND_FIRE;
    let spellLabel = "ファイア";

    if (playerMove === 'ice') {
        currentSE = SOUND_ICE;
        spellLabel = "アイス";
    } else if (playerMove === 'holy') {
        currentSE = SOUND_HOLY;
        spellLabel = "ホーリー";
    }

    // 400ms後に音を鳴らし、ダメージを安全に同期発火させる予約
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
        setTimeout(() => { if (!window.checkBattleEnd()) window.enemyTurnAction(); }, 800);
    }, 400);
};

// ==========================================
// 👹 5. エネミーターン行動AI＆カウンター処理
// ==========================================
window.enemyTurnAction = function(isPlayerDefending = false) {
    if (window.eHp <= 0 || window.pHp <= 0) {
        window.isBusy = false;
        return;
    }
    const data = STAGES[window.curIdx];
    let isSpecial = (Math.random() < 0.4); 

    let dmg = isPlayerDefending ? Math.max(1, Math.floor(data.atk * 0.15)) : data.atk;

    dmg = Math.floor(dmg * window.enemyMana);
    window.enemyMana = 1.0;

    if (window.isAmuletActive > 0 && !isPlayerDefending) {
        dmg = Math.floor(dmg * 0.5);
    }

    if (isSpecial) {
        playSE(SOUND_HOLY);
        const battleLog = document.getElementById('battle-log');

        if (data.type === 'skelton') {
            window.isEnemyShieldActive = true;
            if (battleLog) battleLog.innerText = `🛡️ ${data.name}は骨盾を構えた！次の被ダメを大幅カット！`;
            window.postEnemyTurnCleanup();
            return;
        }
        if (data.type === 'gargoil') {
            window.enemyMana = 2.0;
            if (battleLog) battleLog.innerText = `⚡ ${data.name}は魔力を集約！次回の攻撃力2倍！`;
            window.postEnemyTurnCleanup();
            return;
        }

        if (data.type === 'spider') window.isPlayerStunned = true;

        if (battleLog) battleLog.innerText = `🚨 ${data.name}の特殊攻撃を被弾！【${dmg}】ダメージ！`;
        
        window.pHp = Math.max(0, window.pHp - dmg);
        if (typeof updateHpUI === 'function') updateHpUI();
        createDmgPop(dmg, true);
        window.postEnemyTurnCleanup();
    } else {
        // 敵の体当たり通常攻撃音：SOUND_KICKがジャスト連動
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
        
        // 🛡️【②フリーズ対策：通常攻撃ルートのロック解除漏れ撲滅】
        // 通常攻撃（突進体当たり）を喰らった直後に postEnemyTurnCleanup が呼ばれず、isBusy が true で固まるバグを完全粉砕！
        window.postEnemyTurnCleanup();
    }
};

/**
 * 敵行動後のバフ減算および操作ロック解放処理
 */
window.postEnemyTurnCleanup = function() {
    if (window.isAmuletActive > 0) {
        window.isAmuletActive--;
        if (window.isAmuletActive <= 0) {
            const itemBadge = document.getElementById('item-badge');
            if (itemBadge) itemBadge.style.display = "none";
        }
    }
    setTimeout(() => {
        if (!window.checkBattleEnd()) {
            window.isBusy = false;
            const battleLog = document.getElementById('battle-log');
            if (battleLog) battleLog.innerText = "コマンドを選択せよ。";
        }
    }, 800);
};

// ==========================================
// 💥 6. 勝敗・終了判定およびリザルト遷移
// ==========================================
window.checkBattleEnd = function() {
    if (window.pHp <= 0 || window.eHp <= 0) {
        stopBGM();
        stopSlimeAnimation();

        if (window.eHp <= 0) {
            playSE(SOUND_FREEZE_DEAD);
            const eContainer = document.getElementById('e-sprite-container');
            if (eContainer) {
                eContainer.style.opacity = "0";
                eContainer.style.transform = "scale(0.5)";
            }
            setTimeout(() => { window.transitionToResult(); }, 800);
        } else {
            window.transitionToResult();
        }
        return true;
    }
    return false;
};

/**
 * 戦闘結果リザルト表示への流し込み
 */
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

/**
 * タイトル画面へ戻る際のリセット処理
 */
window.resetGame = function() {
    if (!window.isDebugUnlocked) {
        window.pMaxHp = 100;
        window.pHp = 100;
    } else {
        window.pMaxHp = 8000;
        window.pHp = 8000;
    }
    window.mana = 1.0;
    window.curIdx = -1;
    window.isBusy = false;
    window.itemInventory = { potion: 1, amulet: 1 };
    window.isAmuletActive = 0;

    // 🎨【オーラ完全消灯】タイトルへ戻る際、敵キャラクターコンテナの背面を完全にリセット
    const cleanContainer = document.getElementById('e-sprite-container');
    if (cleanContainer) {
        cleanContainer.style.background = "none";
        cleanContainer.style.borderRadius = "0";
    }

    const battleLog = document.getElementById('battle-log');
    if (battleLog) battleLog.innerHTML = "コマンドを選択せよ。";

    stopBGM();
    stopSlimeAnimation();
};

// ==========================================
// 🕒 📦 END OF FILE - js/battle.js [Ver 6.70]
// ==========================================
