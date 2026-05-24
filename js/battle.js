// ==========================================
// 🕒 🔄 更新検知・タイムスタンプ刻印システム
// ==========================================
console.log("%c🔄 [BATTLE SYSTEMS] ①ハニカム3D化・②魔法フェード・③巨大化・浮遊・本物突進完全実装！ (出現ラグ解消版)", "color: #00ff00; font-weight: bold;");

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
// 🧙‍♂️👹 2. ③ キャラ巨大化・オーラ浮遊強制制御
// ==========================================
function applyMegaVisuals() {
    // 主人公：巨大化＆青い魔力オーラ＆浮遊アニメ直結
    const pContainer = document.getElementById('p-sprite-container');
    const pGraphic = document.getElementById('p-sprite-graphic');
    if (pContainer && pGraphic) {
        pContainer.style.width = '200px'; 
        pContainer.style.height = '200px';
        pContainer.style.animation = 'floatP_Mega 1.5s infinite alternate ease-in-out'; 
        pGraphic.style.filter = 'drop-shadow(0 0 15px #3b82f6)'; 
    }

    // 敵：超巨大化＆赤い邪気オーラ＆重厚な浮遊アニメ直結
    const eContainer = document.getElementById('e-sprite-container');
    const eGraphic = document.getElementById('e-sprite-graphic');
    if (eContainer && eGraphic) {
        eContainer.style.width = '280px'; 
        eContainer.style.height = '280px';
        eContainer.style.animation = 'floatE_Mega 2.2s infinite alternate ease-in-out'; 
        eGraphic.style.filter = 'drop-shadow(0 0 20px #ef4444)'; 
    }
}

// ==========================================
// 🔥 🛡️ ❄️ ✨ 3. ①ハニカム3D＆②魔法フェード＆ホーリー完全実装
// ==========================================
function renderMagicVisual(type) {
    const layer = document.getElementById('spell-effect-layer');
    const frontLayer = document.getElementById('front-effect-layer');
    if (!layer || !frontLayer) return;
    
    layer.innerHTML = ""; 
    frontLayer.innerHTML = ""; 

    const firePath = "assets/effects/standard/fire/";
    const icePath = "assets/effects/standard/ice/";
    const holyPath = "assets/effects/standard/holy/";

    if (type === 'fire') {
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
            
            setTimeout(() => { storm.style.opacity = '0'; storm.style.transition = 'opacity 0.3s'; }, 300);
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
                
                setTimeout(() => { p.style.opacity = '0'; p.style.transition = 'opacity 0.25s'; }, 250);
            }, 350 + (index * 60));
        });

    } else if (type === 'ice') {
        for (let m = 1; m <= 8; m++) {
            setTimeout(() => {
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

                if (m === 8) {
                    setTimeout(() => { 
                        iceFrame.style.opacity = '0'; 
                        iceFrame.style.transform = 'scale(0.8)'; 
                        iceFrame.style.transition = 'all 0.4s ease-out'; 
                    }, 400);
                }
            }, (m - 1) * 65);
        }

    } else if (type === 'holy') {
        const cross = document.createElement('img');
        cross.src = holyPath + "cross_01.png";
        cross.style.position = 'absolute';
        cross.style.width = '180px';
        cross.style.height = '180px';
        cross.style.left = '370px';
        cross.style.top = '-200px'; 
        cross.style.transition = 'top 0.25s cubic-bezier(0.25, 1, 0.5, 1)';
        cross.style.mixBlendMode = 'screen';
        layer.appendChild(cross);

        setTimeout(() => { cross.style.top = '60px'; }, 10);
        setTimeout(() => { cross.src = holyPath + "cross_02.png"; }, 250);
        setTimeout(() => { cross.src = holyPath + "cross_03.png"; }, 400);
        
        setTimeout(() => { 
            cross.style.opacity = '0'; 
            cross.style.transform = 'scale(1.2) rotate(15deg)'; 
            cross.style.transition = 'all 0.25s ease-out'; 
        }, 650);

        setTimeout(() => {
            const animDiv = document.createElement('div');
            animDiv.style.position = 'absolute';
            animDiv.style.width = '120px';  
            animDiv.style.height = '120px'; 
            animDiv.style.left = '400px';
            animDiv.style.top = '90px';
            animDiv.style.backgroundImage = `url('${holyPath}pipo-btleffect171_480sheet.png')`;
            animDiv.style.backgroundRepeat = 'no-repeat';
            animDiv.style.mixBlendMode = 'screen';
            animDiv.style.transform = 'scale(1.3)';
            frontLayer.appendChild(animDiv);

            let frame = 0;
            const sheetTimer = setInterval(() => {
                if (frame >= 16) {
                    clearInterval(sheetTimer);
                    animDiv.style.opacity = '0';
                    animDiv.style.transition = 'opacity 0.2s';
                    setTimeout(() => { if (animDiv.parentNode) animDiv.parentNode.removeChild(animDiv); }, 210);
                    return;
                }
                const col = frame % 4;
                const row = Math.floor(frame / 4);
                animDiv.style.backgroundPosition = `-${col * 120}px -${row * 120}px`;
                frame++;
            }, 40);
        }, 200);

        setTimeout(() => {
            const flash = document.createElement('div');
            flash.style.position = 'absolute';
            flash.style.width = '100%'; flash.style.height = '100%'; flash.style.top = '0'; flash.style.left = '0';
            flash.style.backgroundColor = '#ffffff';
            flash.style.opacity = '0';
            flash.style.transition = 'opacity 0.1s';
            flash.style.pointerEvents = 'none'; 
            flash.style.mixBlendMode = 'overlay'; 
            layer.appendChild(flash);

            setTimeout(() => { flash.style.opacity = '0.6'; }, 10);
            setTimeout(() => { flash.style.opacity = '0'; flash.style.transition = 'opacity 0.25s'; }, 110);
        }, 250);

    } else if (type === 'def') {
        const shield = document.createElement('div');
        shield.style.position = 'absolute';
        shield.style.width = '240px'; 
        shield.style.height = '240px';
        shield.style.left = '40px';
        shield.style.top = '70px';
        
        shield.style.backgroundColor = 'transparent';
        shield.style.backgroundImage = 'linear-gradient(30deg, #10b981 12%, transparent 12.5%, transparent 87%, #10b981 87.5%, #10b981), \
                                         linear-gradient(150deg, #10b981 12%, transparent 12.5%, transparent 87%, #10b981 87.5%, #10b981), \
                                         linear-gradient(30deg, #10b981 12%, transparent 12.5%, transparent 87%, #10b981 87.5%, #10b981), \
                                         linear-gradient(150deg, #10b981 12%, transparent 12.5%, transparent 87%, #10b981 87.5%, #10b981), \
                                         linear-gradient(60deg, rgba(52,211,153,0.3) 25%, transparent 25.5%, transparent 75%, rgba(52,211,153,0.3) 75.5%, rgba(52,211,153,0.3)), \
                                         linear-gradient(60deg, rgba(52,211,153,0.3) 25%, transparent 25.5%, transparent 75%, rgba(52,211,153,0.3) 75.5%, rgba(52,211,153,0.3))';
        shield.style.backgroundSize = '20px 35px';
        shield.style.backgroundPosition = '0 0, 0 0, 10px 18px, 10px 18px, 0 0, 10px 18px';
        
        shield.style.borderRadius = '50%';
        shield.style.border = '8px solid #ffffff'; 
        shield.style.boxShadow = '0 0 20px #10b981, 0 0 40px #34d399, inset 0 0 25px rgba(255,255,255,0.8), inset 0 0 50px rgba(16,185,129,0.5)';
        shield.style.filter = 'drop-shadow(0 0 20px #10b981)';
        
        shield.style.transform = 'scale(0.2) rotate(-135deg)';
        shield.style.opacity = '0';
        shield.style.transition = 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'; 
        frontLayer.appendChild(shield);

        setTimeout(() => {
            shield.style.opacity = '1';
            shield.style.transform = 'scale(1) rotate(0deg)';
        }, 10);

        setTimeout(() => {
            shield.style.opacity = '0';
            shield.style.transform = 'scale(0.3) rotate(90deg)';
            shield.style.transition = 'all 0.35s ease-out';
            setTimeout(() => { if (shield.parentNode) shield.parentNode.removeChild(shield); }, 360);
        }, 1300);
    }
}

// ==========================================
// 🧙‍♂️ 4. プレイヤー行動・基本戦闘ループ
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

    renderMagicVisual(playerMove);

    try {
        if (typeof startSpellEffect === "function") {
            startSpellEffect(playerMove);
        } else if (typeof openMagic === "function") {
            openMagic(playerMove);
        }
    } catch (spellError) {
        console.warn("⚠️ 外部演出内のエラーを隔離:", spellError);
    }

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
// 🎒 5. アイテムバッグ・ステージ進行管理
// ==========================================
function useItem(itemType) {
    if (window.isBusy || window.itemInventory[itemType] <= 0) return;
    window.isBusy = true; 
    window.itemInventory[itemType]--; 
    closeItemBag();
    
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

// ➔ 【ラグバスター箇所】50msのタイマーを完全除去・直列最適化
function startBattle() {
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
    const logEl = document.getElementById('battle-log');
    
    if (itemBadge) itemBadge.style.display = "none"; 
    if (chargeBadge) chargeBadge.style.display = "none";
    if (eName) eName.innerText = data.name;
    
    // 1. 画面切り替えの瞬間に、透明ドットを挟まず直接モンスターの「本物のグラフィック」を代入
    let folderType = data.type; 
    if (eGraphic && MASTER_ANIM_MAP[folderType]) { 
        eGraphic.src = MASTER_ANIM_MAP[folderType][0];
    }
    
    showScreen('scr-battle'); 
    updateHpUI(); 
    checkDevPassword();
    
    // 2. 待機時間なしで、即座に巨大化・浮遊制御を連動点火（最初からバシッと佇む）
    applyMegaVisuals();

    if (logEl) logEl.innerHTML = `${data.name}が現れた！弱点: ${data.weak.toUpperCase()}`;
    if (typeof startBGM === "function") startBGM("battle");

    // 3. 外部アニメーションシステムもディレイ無しでノータイムで完全同期キック
    if (typeof startCustomAnimation === "function") {
        startCustomAnimation(folderType); 
    }
}

// ==========================================
// 👹 6. エネミーターン行動AI・③本物物理突進実装
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
            eContainer.style.animation = "enemyAssault_Mega 0.4s cubic-bezier(0.19, 1, 0.22, 1) forwards";
            
            setTimeout(() => { 
                if (eContainer) eContainer.style.animation = "floatE_Mega 2.2s infinite alternate ease-in-out"; 
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
// 💥 7. 勝敗判定・ゲームリセット
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
