// ==========================================
// 🕒 🔄 更新検知・タイムスタンプ刻印システム
// ==========================================
console.log("%c🔄 [BATTLE SYSTEMS] Ver 6.32: 効果音鳴り分け＆体当たり専用SE完全適合版クレンジング完了。", "color: #00ff00; font-weight: bold;");

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

// 追加のステータスフラグ管理
window.enemyMana = 1.0;
window.isEnemyShieldActive = false;

// アイテムバッグ初期化
window.itemInventory = { potion: 1, amulet: 1 };
window.isAmuletActive = 0;
window.isPlayerStunned = false;

// ==========================================
// 🚀 2. ステージ・戦闘遷移（開通・showScreen完全同期回路）
// ==========================================

/**
 * 3階層ボタン（onclick="nextStage()"）から叩かれる、グローバル開通版nextStage
 */
window.nextStage = function() {
    closeItemBag();
    window.curIdx++;

    // 全10階層のエンディング判定
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
 * 導入画面から戦闘画面へ移行し、各種ステータスを初期化のうえ、
 * ウィザード画像を通信ラグのないローカルキャッシュパスで安全に起動する関数
 */
window.startBattle = function() {
    const data = STAGES[window.curIdx];
    
    window.eHp = window.eMaxHp = data.hp;
    window.isBusy = false;
    window.isPlayerStunned = false;
    window.isAmuletActive = 0;
    window.enemyMana = 1.0;
    window.isEnemyShieldActive = false;

    const eContainer = document.getElementById('e-sprite-container');
    if (eContainer) {
        eContainer.style.opacity = "1";
        eContainer.style.transform = "scale(1)";
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
    
    updateHpUI();
    
    if (typeof checkDevPassword === 'function') {
        checkDevPassword();
    }

    if (effScr) {
        effScr.style.borderColor = data.floor === 10 ? '#be123c' : '#334155';
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
    if (window.isBusy || window.itemInventory[itemType] <= 0) return;
    window.isBusy = true;
    window.itemInventory[itemType]--;
    closeItemBag();

    const spellEffectLayer = document.getElementById('spell-effect-layer');
    const battleLog = document.getElementById('battle-log');
    if (spellEffectLayer) spellEffectLayer.innerHTML = "";

    if (itemType === 'potion') {
        window.pHp = Math.min(window.pMaxHp, window.pHp + 50);
        if (battleLog) battleLog.innerText = "🎒 回復薬を使用！HPが50回復！";
    } else {
        window.isAmuletActive = 3;
        const itemBadge = document.getElementById('item-badge');
        if (itemBadge) itemBadge.style.display = "block";
        if (battleLog) battleLog.innerText = "🎒 お守りを使用！3ターン被ダメ半減！";
    }

    updateHpUI();
    setTimeout(window.enemyTurnAction, 1000);
};

// ==========================================
// 🧙‍♂️ 4. プレイヤー魔導アクション戦闘ループ
// ==========================================

/**
 * 3階層ボタン（onclick="turn('fire')"等）から直接叩かれる、グローバル開通版戦闘ループの起点
 */
window.turn = function(playerMove) {
    if (window.isBusy || window.pHp <= 0 || window.eHp <= 0) return;
    window.isBusy = true;

    if (window.isPlayerStunned) {
        window.isPlayerStunned = false;
        const battleLog = document.getElementById('battle-log');
        if (battleLog) battleLog.innerText = "🚨 麻痺して動けない！";
        setTimeout(window.enemyTurnAction, 1000);
        return;
    }

    const data = STAGES[window.curIdx];
    let isCritical = (playerMove === data.weak);

    if (playerMove === 'debug_death') {
        window.eHp = 0;
        updateHpUI();
        const battleLog = document.getElementById('battle-log');
        if (battleLog) battleLog.innerText = "☠ デスコード起動。";
        setTimeout(window.checkBattleEnd, 500);
        return;
    }

    let dmg = Math.floor((playerMove === 'holy' ? 35 : 15) * (isCritical ? 2.2 : 1) * window.mana);

    if (window.isEnemyShieldActive) {
        dmg = Math.floor(dmg * 0.25);
    }

    const effLayer = document.getElementById('spell-effect-layer');
    if (effLayer) effLayer.innerHTML = "";
    window.isEnemyShieldActive = false;

    // 各属性魔法に応じたオリジナルアセットの飛行およびタイマーフレーム演出の再生
    try {
        if (playerMove === 'fire') {
            if (effLayer) effLayer.innerHTML = MISSILE_EFFECTS.fire;
            // 💡【バグ修正】単なる文字の 'fire' ではなく、audio.jsのURL定数である「SOUND_FIRE」を安全キック
            setTimeout(() => { playSE(SOUND_FIRE); }, 400);
        }
        else if (playerMove === 'ice') {
            if (effLayer) {
                effLayer.innerHTML = `<img id="ice-anim-sprite" style="position:absolute; width:240px; height:240px; left:330px; top:80px; object-fit:contain; image-rendering:pixelated; mix-blend-mode:screen !important; background:transparent !important; pointer-events:none;">`;
                const iceImg = document.getElementById("ice-anim-sprite");
                let frame = 0;
                function playIceFrame() {
                    if (frame < ANIMS_EFFECT_ICE.length) {
                        if (iceImg) iceImg.src = ANIMS_EFFECT_ICE[frame];
                        frame++;
                        setTimeout(playIceFrame, 55);
                    }
                }
                playIceFrame();
            }
            // 💡【バグ修正】単なる文字の 'ice' ではなく、URL定数である「SOUND_ICE」を安全キック
            setTimeout(() => { playSE(SOUND_ICE); }, 400);
        }
        else if (playerMove === 'holy') {
            if (effLayer) effLayer.innerHTML = MISSILE_EFFECTS.holy;
            // 💡【バグ修正】単なる文字の 'holy' ではなく、URL定数である「SOUND_HOLYを表示」を安全キック
            setTimeout(() => { playSE(SOUND_HOLY); }, 400);
        }
        else if (playerMove === 'def') {
            const battleLog = document.getElementById('battle-log');
            if (battleLog) battleLog.innerText = "🛡 シールドを展開！防御姿勢をとった。";
            window.mana = 1.0;
            const chargeBadge = document.getElementById('charge-badge');
            if (chargeBadge) chargeBadge.style.display = "none";
            setTimeout(() => { window.enemyTurnAction(true); }, 800);
            return;
        }
        else if (playerMove === 'chg') {
            window.mana = 2.5;
            const chargeBadge = document.getElementById('charge-badge');
            const battleLog = document.getElementById('battle-log');
            if (chargeBadge) chargeBadge.style.display = "block";
            if (battleLog) battleLog.innerText = "⚡ パワーをチャージした！次回威力2.5倍！";
            setTimeout(() => { window.enemyTurnAction(false); }, 800);
            return;
        }
    } catch(e) {
        console.error("Effect Playback Error Safety Catch:", e);
    }

    setTimeout(() => {
        window.eHp = Math.max(0, window.eHp - dmg);
        updateHpUI();
        createDmgPop(dmg, false);

        const battleLog = document.getElementById('battle-log');
        if (battleLog) {
            battleLog.innerText = isCritical ? `💥 弱点直撃！敵に ${dmg} ダメージ！` : `敵に ${dmg} ダメージ！`;
        }

        window.mana = 1.0;
        const chargeBadge = document.getElementById('charge-badge');
        if (chargeBadge) chargeBadge.style.display = "none";

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

    const effLayer = document.getElementById('spell-effect-layer');
    if (effLayer) effLayer.innerHTML = "";

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

        if (['slime', 'spider', 'harpy', 'dragon', 'golem'].includes(data.type)) {
            if (effLayer) effLayer.innerHTML = ENEMY_MISSILE_EFFECTS[data.type] || "";
        } else {
            if (effLayer) effLayer.innerHTML = `<div style="position:absolute; width:120px; height:120px; border-radius:50%; background:rgba(168,85,247,0.5); left:100px; top:120px; animation:stalkPulse 0.5s forwards; filter:blur(10px); mix-blend-mode:screen !important;"></div>`;
        }

        if (data.type === 'spider') window.isPlayerStunned = true;

        if (battleLog) battleLog.innerText = `🚨 ${data.name}の特殊攻撃を被弾！【${dmg}】ダメージ！`;
    } else {
        // 💡【核心のバグ修正】敵の通常突進時に、間違えて直書きされていた「SOUND_FIRE」を引き抜き、
        //    ディレクターが指定した体当たり専用アセット「SOUND_KICK」に完全差し替え！
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
        if (battleLog) battleLog.innerText = `${data.name}の突進攻撃！【${dmg}】ダメージ！`;
    }

    window.pHp = Math.max(0, window.pHp - dmg);
    updateHpUI();
    createDmgPop(dmg, true);
    window.postEnemyTurnCleanup();
};

/**
 * 敵の行動処理が終わったあとのクリーンアップ
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
 * 戦闘結果をリザルト表示領域へ綺麗に流し込む関数
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
 * タイトル画面へ戻る際のステータスリセット処理
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

    const battleLog = document.getElementById('battle-log');
    if (battleLog) battleLog.innerHTML = "コマンドを選択せよ。";

    stopBGM();
    stopSlimeAnimation();
};

// ==========================================
// 🕒 📦 END OF FILE - js/battle.js [Ver 6.32]
// ==========================================
