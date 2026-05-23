// ==========================================
// 🕒 🔄 更新検知・タイムスタンプ刻印システム
// ==========================================
console.log("%c🔄 [BATTLE SYSTEMS] 残像根絶・3大本物魔法画像（ファイア・アイス・ホーリー）完全結合版", "color: #00ff00; font-weight: bold;");

// ==========================================
// ⚔️ 1. グローバル戦闘ステータス管理変数
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
// 🖼️ 2. 【本物画像スプライト＆シート駆動】エフェクト描画回路
// ==========================================
function renderMagicVisual(type) {
    const layer = document.getElementById('spell-effect-layer');
    const frontLayer = document.getElementById('front-effect-layer');
    if (!layer || !frontLayer) return;
    
    // レイヤーの即時完全初期化
    layer.innerHTML = ""; 
    frontLayer.innerHTML = ""; 

    const firePath = "assets/effects/standard/fire/";
    const icePath = "assets/effects/standard/ice/";
    const holyPath = "assets/effects/standard/holy/";

    if (type === 'fire') {
        // --- 🔥 ファイア：多層大炎上本物画像アニメ ---
        const ball = document.createElement('img');
        ball.src = firePath + "fire01.png";
        ball.style.position = 'absolute';
        ball.style.width = '120px';
        ball.style.height = '120px';
        ball.style.animation = 'fireMissile 0.4s cubic-bezier(0.25, 1, 0.5, 1) forwards';
        layer.appendChild(ball);

        setTimeout(() => {
            const storm = document.createElement('img');
            storm.src = firePath + "firestorm01.png";
            storm.style.position = 'absolute';
            storm.style.width = '260px';
            storm.style.height = '200px';
            storm.style.left = '320px';
            storm.style.bottom = '10px';
            storm.style.mixBlendMode = 'screen';
            layer.appendChild(storm);
        }, 300);

        const pillars = ["pillar_of_fire01.png", "pillar_of_fire02.png", "pillar_of_fire03.png", "pillar_of_fire04.png"];
        pillars.forEach((imgName, index) => {
            setTimeout(() => {
                const p = document.createElement('img');
                p.src = firePath + imgName;
                p.style.position = 'absolute';
                p.style.width = '160px';
                p.style.height = '350px';
                p.style.left = `${340 + (index * 15)}px`; 
                p.style.bottom = '-20px';
                p.style.mixBlendMode = 'screen';
                layer.appendChild(p);
            }, 350 + (index * 60));
        });

    } else if (type === 'ice') {
        // --- ❄️ アイス：ICE_01〜08本物パラパラ漫画 ---
        for (let m = 1; m <= 8; m++) {
            setTimeout(() => {
                // 前の氷コマをクリアして残像を防ぐ
                layer.innerHTML = ""; 
                const iceFrame = document.createElement('img');
                const numStr = m < 10 ? "0" + m : m;
                iceFrame.src = icePath + `ICE_${numStr}.png`;
                iceFrame.style.position = 'absolute';
                iceFrame.style.width = '240px';
                iceFrame.style.height = '240px';
                iceFrame.style.left = '340px';
                iceFrame.style.bottom = '10px';
                iceFrame.style.mixBlendMode = 'screen';
                layer.appendChild(iceFrame);
            }, (m - 1) * 65);
        }

    } else if (type === 'holy') {
        // --- ✨ ホーリー：スライム/クモの脳頭へ落とす十字架＆スプライトシート大爆発 ---
        
        // 1. 聖なる十字架の超高速垂直落下アニメ（cross_01 -> 02 -> 03 切り替え）
        const cross = document.createElement('img');
        cross.src = holyPath + "cross_01.png";
        cross.style.position = 'absolute';
        cross.style.width = '180px';
        cross.style.height = '180px';
        cross.style.left = '370px';
        cross.style.top = '-200px'; // 画面外上空
        cross.style.transition = 'top 0.25s cubic-bezier(0.25, 1, 0.5, 1)';
        cross.style.mixBlendMode = 'screen';
        layer.appendChild(cross);

        // 高速着弾
        setTimeout(() => { cross.style.top = '60px'; }, 10);

        // 着弾後のグラフィック形状変化（粉砕余韻）
        setTimeout(() => { cross.src = holyPath + "cross_02.png"; }, 250);
        setTimeout(() => { cross.src = holyPath + "cross_03.png"; }, 400);
        setTimeout(() => { cross.style.opacity = '0'; cross.style.transition = 'opacity 0.2s'; }, 650);

        // 2. pipo-btleffect171_480sheet.png による中心部スプライトシートアニメーション駆動
        setTimeout(() => {
            const animDiv = document.createElement('div');
            animDiv.style.position = 'absolute';
            animDiv.style.width = '120px';  // 1コマの幅
            animDiv.style.height = '120px'; // 1コマの高さ
            animDiv.style.left = '400px';
            animDiv.style.top = '90px';
            animDiv.style.backgroundImage = `url('${holyPath}pipo-btleffect171_480sheet.png')`;
            animDiv.style.backgroundRepeat = 'no-repeat';
            animDiv.style.mixBlendMode = 'screen';
            frontLayer.appendChild(animDiv);

            // 4x4の全16コマを高速ループ移動させて爆発を完全再現
            let frame = 0;
            const sheetTimer = setInterval(() => {
                if (frame >= 16) {
                    clearInterval(sheetTimer);
                    if (animDiv.parentNode) animDiv.parentNode.removeChild(animDiv);
                    return;
                }
                const col = frame % 4;
                const row = Math.floor(frame / 4);
                animDiv.style.backgroundPosition = `-${col * 120}px -${row * 120}px`;
                frame++;
            }, 40);
        }, 200);

    } else if (type === 'def') {
        // --- 🛡️ シールド：ハニカム演出 ---
        const shield = document.createElement('div');
        shield.style.position = 'absolute';
        shield.style.width = '220px'; shield.style.height = '220px'; shield.style.left = '50px'; shield.style.top = '80px';
        shield.style.backgroundColor = 'transparent';
        shield.style.backgroundImage = 'linear-gradient(30deg, #10b981 12%, transparent 12.5%, transparent 87%, #10b981 87.5%, #10b981), \
                                         linear-gradient(150deg, #10b981 12%, transparent 12.5%, transparent 87%, #10b981 87.5%, #10b981), \
                                         linear-gradient(30deg, #10b981 12%, transparent 12.5%, transparent 87%, #10b981 87.5%, #10b981), \
                                         linear-gradient(150deg, #10b981 12%, transparent 12.5%, transparent 87%, #10b981 87.5%, #10b981), \
                                         linear-gradient(60deg, rgba(52,211,153,0.3) 25%, transparent 25.5%, transparent 75%, rgba(52,211,153,0.3) 75.5%, rgba(52,211,153,0.3)), \
                                         linear-gradient(60deg, rgba(52,211,153,0.3) 25%, transparent 25.5%, transparent 75%, rgba(52,211,153,0.3) 75.5%, rgba(52,211,153,0.3))';
        shield.style.backgroundSize = '20px 35px'; shield.style.backgroundPosition = '0 0, 0 0, 10px 18px, 10px 18px, 0 0, 10px 18px';
        shield.style.borderRadius = '50%'; shield.style.border = '6px solid #10b981'; shield.style.filter = 'drop-shadow(0 0 15px #34d399)';
        shield.style.transform = 'scale(0.2) rotate(-90deg)'; shield.style.opacity = '0';
        shield.style.transition = 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
        frontLayer.appendChild(shield);

        setTimeout(() => { shield.style.opacity = '1'; shield.style.transform = 'scale(1) rotate(0deg)'; }, 10);
        setTimeout(() => {
            shield.style.opacity = '0'; shield.style.transform = 'scale(0.2) rotate(90deg)';
            setTimeout(() => { if (shield.parentNode) shield.parentNode.removeChild(shield); }, 300);
        }, 1300);
    }
}

// ==========================================
// 🧙‍♂️ 3. プレイヤー行動・基本戦闘ループ
// ==========================================
function turn(playerMove) {
    if (window.isBusy || window.pHp <= 0 || window.eHp <= 0) return; 
    window.isBusy = true;

    if (window.isPlayerStunned) { 
        window.isPlayerStunned = false; 
        const logEl = document.getElementById('battle-log');
        if (logEl) logEl.innerHTML = "🚨 <span style='color: #f59e0b; font-weight: bold;'>体が痺れて動けない！ ターンがスキップされた！</span>"; 
        setTimeout(() => { enemyTurnAction(); }, 1200); 
        return; 
    }
  
    const data = STAGES[window.curIdx]; 
    let isCritical = (playerMove === data.weak);
    
    if (playerMove === 'debug_death') { 
        window.eHp = 0; 
        updateHpUI(); 
        const logEl = document.getElementById('battle-log');
        if (logEl) logEl.innerText = "☠ デスコード起動。"; 
        setTimeout(checkBattleEnd, 500); 
        return; 
    }

    let baseDmg = 15;
    if (playerMove === 'fire') baseDmg = 20;
    else if (playerMove === 'ice') baseDmg = 20;
    else if (playerMove === 'holy') baseDmg = 35;

    let dmg = Math.floor(baseDmg * (isCritical ? 2.2 : 1) * window.mana);
    if (window.isEnemyShieldActive) { 
        dmg = Math.floor(dmg * 0.25); 
    }

    window.isEnemyShieldActive = false;

    // 画像演出回路のキック
    renderMagicVisual(playerMove);

    // 外部演出（effects.js）のエラー監禁シールド呼び出し
    try {
        if (typeof startSpellEffect === "function") {
            startSpellEffect(playerMove);
        } else if (typeof openMagic === "function") {
            openMagic(playerMove);
        }
    } catch (spellError) {
        console.warn("⚠️ 外部演出内のエラーを隔離:", spellError);
    }

    // 効果音再生
    try {
        if (typeof playSE === "function") {
            if (playerMove === 'fire' && typeof SOUND_FIRE !== 'undefined') playSE(SOUND_FIRE);
            else if (playerMove === 'ice' && typeof SOUND_ICE !== 'undefined') playSE(SOUND_ICE);
            else if (playerMove === 'holy' && typeof SOUND_HOLY !== 'undefined') playSE(SOUND_HOLY);
        }
    } catch (seError) {
        console.warn("⚠️ 効果音再生エラー隔離:", seError);
    }

    if (playerMove === 'def') {
        const logEl = document.getElementById('battle-log');
        if (logEl) logEl.innerText = "🛡 シールドを展開！防御姿勢をとった。";
        try { if (typeof playSE === "function" && typeof SOUND_SHIELD !== 'undefined') playSE(SOUND_SHIELD); } catch(e){}
        setTimeout(() => { enemyTurnAction(true); }, 1500); 
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
        try { if (typeof playSE === "function" && typeof SOUND_CHARGE !== 'undefined') playSE(SOUND_CHARGE); } catch(e){}
        setTimeout(() => { enemyTurnAction(false); }, 800); 
        return;
    }

    // ダメージ適用確定タイマー
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
// 🎒 4. アイテムバッグ・ステージ進行管理
// ==========================================
function useItem(itemType) {
    if (window.isBusy || window.itemInventory[itemType] <= 0) return;
    window.isBusy = true; 
    window.itemInventory[itemType]--; 
    closeItemBag();
    
    // アイテム使用時もエフェクトレイヤーを即時掃除して残像バグを防ぐ
    const layer = document.getElementById('spell-effect-layer');
    const frontLayer = document.getElementById('front-effect-layer');
    if (layer) layer.innerHTML = "";
    if (frontLayer) frontLayer.innerHTML = "";

    const logEl = document.getElementById('battle-log');
    if (itemType === 'potion') { 
        window.pHp = Math.min(window.pMaxHp, window.pHp + 50); 
        if (logEl) logEl.innerText = "🎒 回復薬を使用！HPが50回復！"; 
        try { if (typeof playSE === "function" && typeof SOUND_HEAL !== 'undefined') playSE(SOUND_HEAL); } catch(e){}
    } else { 
        window.isAmuletActive = 3; 
        const badge = document.getElementById('item-badge');
        if (badge) badge.style.display = "block"; 
        if (logEl) logEl.innerText = "🎒 お守りを使用！3ターン被ダメ半減！"; 
        try { if (typeof playSE === "function" && typeof SOUND_SHIELD !== 'undefined') playSE(SOUND_SHIELD); } catch(e){}
    }
    updateHpUI(); 
    setTimeout(enemyTurnAction, 1000);
}

function nextStage() {
    if (typeof closeItemBag === "function") closeItemBag(); 
    
    // 🚨 次のステージ移動命令が走った瞬間に、画面上の全演出残像を強制的に物理消去する
    const layer = document.getElementById('spell-effect-layer');
    const frontLayer = document.getElementById('front-effect-layer');
    if (layer) layer.innerHTML = "";
    if (frontLayer) frontLayer.innerHTML = "";

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
    // 🚨 新しい戦闘画面が組み上がる直前にも、すべてのエフェクトゴミ箱を空にして残像を完封する
    const layer = document.getElementById('spell-effect-layer');
    const frontLayer = document.getElementById('front-effect-layer');
    if (layer) layer.innerHTML = "";
    if (frontLayer) frontLayer.innerHTML = "";

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
// 👹 5. エネミーターン行動AI
// ==========================================
function enemyTurnAction(isPlayerDefending = false) {
    if (window.eHp <= 0 || window.pHp <= 0) return; 
    const data = STAGES[window.curIdx];
    const logEl = document.getElementById('battle-log');
    
    let isSpecial = false;
    if (window.battleTurnCount > 1 && Math.random() < 0.4) {
        isSpecial = true;
    }

    let dmg = isPlayerDefending ? Math.max(1, Math.floor(data.atk * 0.15)) : data.atk;
    dmg = Math.floor(dmg * window.enemyMana); 
    window.enemyMana = 1.0; 
    
    if (window.isAmuletActive > 0 && !isPlayerDefending) {
        dmg = Math.floor(dmg * 0.5);
    }

    // 敵行動開始時にプレイヤー側魔法エフェクトの残骸を即時消去
    const layer = document.getElementById('spell-effect-layer'); 
    const frontLayer = document.getElementById('front-effect-layer');
    if (layer) layer.innerHTML = "";
    if (frontLayer) frontLayer.innerHTML = "";

    if (isSpecial) {
        if (data.type === 'slime') {
            if (logEl) logEl.innerHTML = `👹 ${data.name}の【緑の液体投げ】！`;
            try { if (typeof triggerEnemyEffect === "function") triggerEnemyEffect('slime_acid'); } catch(e) {}
        } 
        else if (data.type === 'spider') {
            if (logEl) logEl.innerHTML = `👹 ${data.name}の【粘着糸吐き】！`;
            try { if (typeof triggerEnemyEffect === "function") triggerEnemyEffect('spider_web'); } catch(e) {}
            window.isPlayerStunned = true; 
        } 
        else if (data.type === 'harpy') {
            if (logEl) logEl.innerHTML = `👹 ${data.name}の【雷光急襲】！⚡`;
            try { if (typeof triggerEnemyEffect === "function") triggerEnemyEffect('harpy_thunder'); } catch(e) {}
            window.isPlayerStunned = (Math.random() < 0.5); 
        }
        else if (data.type === 'dragon') {
            if (logEl) logEl.innerHTML = `👹 ${data.name}の【滅びの烈火】！🔥`;
            try { if (typeof triggerEnemyEffect === "function") triggerEnemyEffect('dragon_breath'); } catch(e) {}
            dmg = Math.floor(dmg * 1.5); 
        }
    } else {
        if (logEl) logEl.innerText = `${data.name}の突進攻撃！【${dmg}】のダメージ！`;
        
        const eContainer = document.getElementById('e-sprite-container');
        if (eContainer) {
            eContainer.style.animation = "enemyAssault 0.45s forwards";
            setTimeout(() => { 
                if (eContainer) eContainer.style.animation = "floatE 2.2s infinite alternate ease-in-out"; 
            }, 460);
        }
    }

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
    
    setTimeout(() => { 
        window.isBusy = false;
        checkBattleEnd(); 
    }, 800);
}

// ==========================================
// 💥 6. 勝敗判定・ゲームリセット
// ==========================================
function checkBattleEnd() {
    if (window.pHp <= 0 || window.eHp <= 0) { 
        if (typeof stopBGM === "function") stopBGM(); 
        if (typeof stopSlimeAnimation === "function") {
            stopSlimeAnimation();
        }
        if (window.eHp <= 0) {
            try { if (typeof playSE === "function" && typeof SOUND_FREEZE_DEAD !== 'undefined') playSE(SOUND_FREEZE_DEAD); } catch(e){}
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
