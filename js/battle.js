// ==========================================
// 🕒 🔄 更新検知・タイムスタンプ刻印システム
// 📦 VERSION: 6.30 (js/battle.js モジュール完全開通・絶縁打破・実機最速起動版)
// ==========================================
console.log("%c🔄 [BATTLE SYSTEMS] Ver 6.30: 周囲の外部モジュール（④⑤⑥⑦⑨⑩）と100%同期。HTMLからの直接コールに完全開通した決定版。", "color: #00ff00; font-weight: bold;");

// ==========================================
// ⚔️ 1. グローバル戦闘ステータス管理変数の窓口開通
// ==========================================
// index.html側や他のjsファイル（⑥⑦⑩）から剥き出しで参照・上書きされても
// 100%エラーを起こさず、メモリ空間を完全共有するためのwindow直結プロテクト
window.curIdx = -1; 
window.pMaxHp = 100; 
window.pHp = 100; 
window.eHp = 100; 
window.eMaxHp = 100; 
window.mana = 1.0; 
window.isBusy = false; 

// ⑩の設計図に準拠した追加のステータスフラグ管理
window.enemyMana = 1.0;
window.isEnemyShieldActive = false;

// ==========================================
// 🚀 2. ステージ・戦闘遷移（開通・showScreen完全同期回路）
// ==========================================

/**
 * 3階層ボタン（onclick="nextStage()"）から叩かれる、グローバル開通版nextStage
 */
window.nextStage = function() {
    closeItemBag(); 
    window.curIdx++;
    
    // 全10階層（⑤のSTAGES）を走破した際のエンディング判定
    if (window.curIdx >= STAGES.length) { 
        window.resetGame(); 
        showScreen('scr-start'); 
        const floorIndicator = document.getElementById('floor-indicator');
        if (floorIndicator) floorIndicator.style.visibility = 'hidden'; 
        startBGM("title"); 
        return; 
    }
    
    const data = STAGES[window.curIdx]; 
    
    // ⑦メインJSのデバッグロック（UNLOCKED）がかかっていない通常時のみ、HPを100にリセット
    if (!window.isDebugUnlocked) { 
        window.pMaxHp = 100; 
        window.pHp = 100; 
    }
    
    // ⑥UI JSの最新の画面切り替え（showScreen）へ完全有線直結
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
 * 3階層ボタン（onclick="startBattle()"）から叩かれる、グローバル開通版startBattle
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
    
    // 🔮 ウィザードのグラフィックを⑤ステージJS経由のリモートアセットに同期直撃
    const pGraphic = document.getElementById('p-sprite-graphic');
    if (pGraphic) pGraphic.src = getAssetPath('hero', 'Wizard.png');

    const itemBadge = document.getElementById('item-badge');
    const chargeBadge = document.getElementById('charge-badge');
    const eName = document.getElementById('e-name');
    const eSpriteGraphic = document.getElementById('e-sprite-graphic');
    const effScr = document.getElementById('eff-scr');
    
    if (itemBadge) itemBadge.style.display = "none"; 
    if (chargeBadge) chargeBadge.style.display = "none";
    if (eName) eName.innerText = data.name;
    
    // ➔ ラグ潰しの真髄：画面が表示されるその瞬間に、④エネミーJSが生成したローカルの1コマ目を直撃流し込み
    if (eSpriteGraphic && MASTER_ANIM_MAP[data.type]) {
        eSpriteGraphic.src = MASTER_ANIM_MAP[data.type][0];
    }
    
    showScreen('scr-battle'); 
    
    // ④エネミーJSに実装されている、生物的ゆらぎアニメーション回路（startCustomAnimation）をキック
    startCustomAnimation(data.type); 
    updateHpUI(); 
    checkDevPassword();
    
    if (effScr) {
        effScr.style.borderColor = data.floor === 10 ? '#be123c' : '#334155';
    }
    
    const battleLog = document.getElementById('battle-log');
    if (battleLog) {
        battleLog.innerHTML = `${data.name}が現れた！弱点: ${data.weak.toUpperCase()}`;
    }
    
    // ⑨"battle" に統一してオーディオJSへ電波を飛ばす
    startBGM(data.floor === 10 ? "battle");
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
    // ⑩の設計図通り、1000ms後に敵の判定を非同期キック
    setTimeout(window.enemyTurnAction, 1000);
};

// ==========================================
// 🧙‍♂️ 4. プレイヤー魔導アクション戦闘ループ（⑩設計図の数式・進行を完全死守）
// ==========================================

/**
 * 3階層ボタン（onclick="turn('fire')"等）から直接叩かれる、グローバル開通版戦闘ループの起点
 */
window.turn = function(playerMove) {
    if (window.isBusy || window.pHp <= 0 || window.eHp <= 0) return; 
    window.isBusy = true;
    
    // ⑩設計図通りの「麻痺行動不能」インターセプト処理
    if (window.isPlayerStunned) { 
        window.isPlayerStunned = false; 
        const battleLog = document.getElementById('battle-log');
        if (battleLog) battleLog.innerText = "🚨 麻痺して動けない！"; 
        setTimeout(window.enemyTurnAction, 1000); 
        return; 
    }
  
    const data = STAGES[window.curIdx]; 
    let isCritical = (playerMove === data.weak);
    
    // ☠️ デスコード（1192ロック解除時のワンパン機能）
    if (playerMove === 'debug_death') { 
        window.eHp = 0; 
        updateHpUI(); 
        const battleLog = document.getElementById('battle-log');
        if (battleLog) battleLog.innerText = "☠ デスコード起動。"; 
        setTimeout(window.checkBattleEnd, 500); 
        return; 
    }

    // ➔ ⑩の設計図に完全適合した、最新の威力計算式
    let dmg = Math.floor((playerMove === 'holy' ? 35 : 15) * (isCritical ? 2.2 : 1) * window.mana);
    
    // 敵の盾（スケルトンの特殊行動）が有効な場合、ダメージを大幅カット（0.25倍）
    if (window.isEnemyShieldActive) { 
        dmg = Math.floor(dmg * 0.25); 
    }

    const effLayer = document.getElementById('spell-effect-layer');
    if (effLayer) effLayer.innerHTML = ""; 
    window.isEnemyShieldActive = false; // 盾の判定は攻撃ヒットにより即時消費

    // 各属性魔法に応じたオリジナルアセットの飛行およびタイマーフレーム演出の再生
    try {
        if (playerMove === 'fire') {
            if (effLayer) effLayer.innerHTML = MISSILE_EFFECTS.fire;
            // ⑨オーディオJSに直結し、mp3実音源を正確なタイミング（400ms）で演奏
            setTimeout(() => { playSE(SOUND_FIRE); }, 400);
        } 
        else if (playerMove === 'ice') {
            if (effLayer) {
                // ⑩設計図そのまま、黒枠を完全蒸発（mix-blend-mode:screen）させるimg連番の超高速フレーム再生
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
            setTimeout(() => { playSE(SOUND_ICE); }, 400);
        } 
        else if (playerMove === 'holy') {
            if (effLayer) effLayer.innerHTML = MISSILE_EFFECTS.holy;
            setTimeout(() => { playSE(SOUND_HOLY); }, 400);
        } 
        // シールドコマンド選択時：ダメージ計算を挟まず、即座に敵カウンターへ移行（軽減フラグON）
        else if (playerMove === 'def') {
            const battleLog = document.getElementById('battle-log');
            if (battleLog) battleLog.innerText = "🛡 シールドを展開！防御姿勢をとった。";
            window.mana = 1.0; 
            const chargeBadge = document.getElementById('charge-badge');
            if (chargeBadge) chargeBadge.style.display = "none";
            setTimeout(() => { window.enemyTurnAction(true); }, 800); 
            return;
        } 
        // チャージコマンド選択時：次回の威力を2.5倍に引き上げて、即座に敵のターンへ移行
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

    // 魔法着弾（400ms後）、ダメージポップおよび敵HPの減算を実行
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
        
        // 勝敗が決していなければ、800msの間を置いて敵のAI行動をキック（数数繋ぎ非同期進行）
        setTimeout(() => { if (!window.checkBattleEnd()) window.enemyTurnAction(); }, 800);
    }, 400);
};

// ==========================================
// 👹 5. エネミーターン行動AI＆カウンター処理（⑩設計図の挙動を完全死守）
// ==========================================
window.enemyTurnAction = function(isPlayerDefending = false) {
    if (window.eHp <= 0 || window.pHp <= 0) { 
        window.isBusy = false; 
        return; 
    } 
    const data = STAGES[window.curIdx];
    let isSpecial = (Math.random() < 0.4); // ⑩の設計図通り40%の確率で特殊行動を発火
    
    // シールド時は攻撃力を15%（0.15倍）に遮断、通常時は等倍被弾
    let dmg = isPlayerDefending ? Math.max(1, Math.floor(data.atk * 0.15)) : data.atk;
    
    // ガーゴイルの魔力集約（2倍）バフの適用
    dmg = Math.floor(dmg * window.enemyMana); 
    window.enemyMana = 1.0; 
    
    // お守り（結界）有効時の全被ダメージ半減補正
    if (window.isAmuletActive > 0 && !isPlayerDefending) {
        dmg = Math.floor(dmg * 0.5);
    }

    const effLayer = document.getElementById('spell-effect-layer'); 
    if (effLayer) effLayer.innerHTML = "";

    if (isSpecial) {
        // ⑩設計ファクト：敵のバフ・特殊詠唱の溜め効果音として「se_holy_hit.mp3」を応用！
        playSE(SOUND_HOLY);

        const battleLog = document.getElementById('battle-log');
        
        // 3階：スケルトンナイト専用の【骨盾】（防御バフフラグ）
        if (data.type === 'skelton') {
            window.isEnemyShieldActive = true; 
            if (battleLog) battleLog.innerText = `🛡️ ${data.name}は骨盾を構えた！次の被ダメを大幅カット！`;
            window.postEnemyTurnCleanup(); 
            return;
        }
        // 6階：ガーゴイル専用の【魔力集約】（攻撃2倍バフフラグ）
        if (data.type === 'gargoil') {
            window.enemyMana = 2.0; 
            if (battleLog) battleLog.innerText = `⚡ ${data.name}は魔力を集約！次回の攻撃力2倍！`;
            window.postEnemyTurnCleanup(); 
            return;
        }
        
        // その他アセット持ちのモンスターによる、特殊飛び道具レイヤーの展開
        if (['slime', 'spider', 'harpy', 'dragon', 'golem'].includes(data.type)) {
            if (effLayer) effLayer.innerHTML = ENEMY_MISSILE_EFFECTS[data.type] || "";
        } else {
            if (effLayer) effLayer.innerHTML = `<div style="position:absolute; width:120px; height:120px; border-radius:50%; background:rgba(168,85,247,0.5); left:100px; top:120px; animation:stalkPulse 0.5s forwards; filter:blur(10px); mix-blend-mode:screen !important;"></div>`;
        }
        
        // 2階・8階：スパイダー系統被弾時の次ターン「麻痺」フラグの埋め込み
        if (data.type === 'spider') window.isPlayerStunned = true;
        
        if (battleLog) battleLog.innerText = `🚨 ${data.name}の特殊攻撃を被弾！【${dmg}】ダメージ！`;
    } else {
        // ⑩設計ファクト：通常攻撃（物理突進）被弾時の痛撃音に「se_fire_hit.mp3」を応用！
        setTimeout(() => { playSE(SOUND_FIRE); }, 200);

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
 * 敵の行動処理が終わったあとの、各種お守りバフカウント減算および戦闘終了へのクリーンアップ
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
            // ⑩設計ファクト：モンスターが完全に消滅・陥落した瞬間の効果音に「se_freeze_hit.mp3」を最高に応用！
            playSE(SOUND_FREEZE_DEAD);

            const eContainer = document.getElementById('e-sprite-container');
            if (eContainer) { 
                eContainer.style.opacity = "0"; 
                eContainer.style.transform = "scale(0.5)"; 
            }
            // 崩壊消滅グラフィックの余韻を残して、800ms後にリザルト画面へ遷移
            setTimeout(() => { window.transitionToResult(); }, 800);
        } else { 
            window.transitionToResult(); 
        } 
        return true;
    }
    return false;
};

/**
 * 戦闘結果（勝利・完全制覇・敗北）をリザルト表示領域へ綺麗に流し込む関数
 */
window.transitionToResult = function() {
    showScreen('scr-result');
    const rTitle = document.getElementById('res-title'); 
    const rText = document.getElementById('res-text'); 
    const rBtn = document.getElementById('res-btn');
    
    const pAuraLayer = document.getElementById('p-aura-layer');
    const battleLog = document.getElementById('battle-log');
    const chargeBadge = document.getElementById('charge-badge');
    
    if (pAuraLayer) pAuraLayer.style.display = "none"; 
    if (battleLog) battleLog.innerHTML = "コマンドを選択せよ。";
    if (chargeBadge) chargeBadge.style.display = "none";
    
    if (window.eHp <= 0) {
        if (rTitle) { rTitle.innerText = "VICTORY"; rTitle.style.color = '#10b981'; }
        const resIcon = document.getElementById('res-icon');
        if (resIcon) resIcon.innerText = "🏆";
        
        // 10階層の最終竜カリスドラゴンを粉砕した場合のグランドフィナーレ判定
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
// 🕒 📦 END OF FILE - js/battle.js [Ver 6.30]
// ==========================================
