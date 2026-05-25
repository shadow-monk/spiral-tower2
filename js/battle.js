// ==========================================
// 🕒 🔄 更新検知・タイムスタンプ刻印システム
// ==========================================
console.log("%c🔄 [BATTLE SYSTEMS] 本物レンガ背景 ＋ 正規機能（1〜5）完全統合・バグ完全排除版", "color: #00ff00; font-weight: bold;");

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
// 🧙‍♂️👹 2. 【機能1】本物サイズ・画素・浮遊感・オーラ完全注入回路
// ==========================================
function injectOriginalVisuals() {
    if (!document.getElementById('retro-battle-keyframes')) {
        const styleTrack = document.createElement('style');
        styleTrack.id = 'retro-battle-keyframes';
        styleTrack.innerHTML = `
            @keyframes floatP { 
                0% { transform: translateY(0px) scaleY(1); } 
                100% { transform: translateY(-12px) scaleY(1.02); } 
            }
            @keyframes floatE { 
                0% { transform: translateY(0px) scale(1); } 
                100% { transform: translateY(-10px) scale(1.03); } 
            }
            @keyframes shieldDeploy {
                0% { transform: scale(0.5); opacity: 0; }
                30% { transform: scale(1.1); opacity: 1; }
                50% { transform: scale(1.0); opacity: 1; }
                80% { transform: scale(1.0); opacity: 1; }
                100% { transform: scale(0.8); opacity: 0; }
            }
            @keyframes enemyAssault_Retro {
                0% { transform: translateX(0); }
                20% { transform: translateX(30px); }
                40% { transform: translateX(-380px) translateY(10px) scale(1.15); }
                70% { transform: translateX(-380px) translateY(10px) scale(1.15); }
                100% { transform: translateX(0); }
            }
            @keyframes cutInAnim {
                0% { transform: translateX(-100%) skewX(-15deg); opacity: 0; }
                15% { transform: translateX(0) skewX(-15deg); opacity: 1; }
                85% { transform: translateX(0) skewX(-15deg); opacity: 1; }
                100% { transform: translateX(100%) skewX(-15deg); opacity: 0; }
            }
        `;
        document.head.appendChild(styleTrack);
    }

    // 主人公：本来のサイズ(150px)・クッキリ画素・往復2.2秒浮遊
    const pContainer = document.getElementById('p-sprite-container');
    const pGraphic = document.getElementById('p-sprite-graphic');
    if (pContainer && pGraphic) {
        pContainer.style.width = '150px'; 
        pContainer.style.height = '150px';
        pContainer.style.animation = 'floatP 2.2s infinite alternate ease-in-out';
        pGraphic.style.imageRendering = 'pixelated';
    }

    // モンスター：本来のサイズ(180px)・クッキリ画素・2.5秒往復浮遊
    const eContainer = document.getElementById('e-sprite-container');
    const eGraphic = document.getElementById('e-sprite-graphic');
    if (eContainer && eGraphic) {
        eContainer.style.width = '180px'; 
        eContainer.style.height = '180px';
        eContainer.style.animation = 'floatE 2.5s infinite alternate ease-in-out';
        eGraphic.style.imageRendering = 'pixelated';
    }

    const pAura = document.getElementById('p-aura-layer');
    const eAura = document.getElementById('e-aura-layer');
    if (pAura) pAura.style.display = "block";
    if (eAura) eAura.style.display = "block";
}

// ==========================================
// 🔥 🛡️ ❄️ ✨ 3. 【機能2】立体ハニカムシールド ＆ 魔法演出
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
        // ファイア：横5コマ一列Sheet切開
        const ball = document.createElement('img');
        ball.src = firePath + "fire01.png";
        ball.style.position = 'absolute';
        ball.style.width = '100px'; ball.style.height = '100px';
        ball.style.animation = 'fireMissile 0.4s cubic-bezier(0.25, 1, 0.5, 1) forwards';
        layer.appendChild(ball);

        setTimeout(() => {
            const fireSheet = document.createElement('div');
            fireSheet.style.position = 'absolute';
            fireSheet.style.width = '120px'; fireSheet.style.height = '120px'; 
            fireSheet.style.left = '390px'; fireSheet.style.bottom = '40px';
            fireSheet.style.backgroundImage = `url('${firePath}firestorm01.png')`;
            fireSheet.style.backgroundRepeat = 'no-repeat';
            fireSheet.style.transform = 'scale(2.0)';
            fireSheet.style.mixBlendMode = 'screen';
            layer.appendChild(fireSheet);

            let frame = 0;
            const fireTimer = setInterval(() => {
                if (frame >= 5) {
                    clearInterval(fireTimer);
                    fireSheet.style.opacity = '0';
                    fireSheet.style.transition = 'opacity 0.2s';
                    setTimeout(() => { if (fireSheet.parentNode) fireSheet.parentNode.removeChild(fireSheet); }, 210);
                    return;
                }
                fireSheet.style.backgroundPosition = `-${frame * 120px} 0px`;
                frame++;
            }, 50);
        }, 300);

    } else if (type === 'ice') {
        // アイス：パラパラ漫画消去
        for (let m = 1; m <= 8; m++) {
            setTimeout(() => {
                layer.innerHTML = ""; 
                const iceFrame = document.createElement('img');
                const numStr = m < 10 ? "0" + m : m;
                iceFrame.src = icePath + `ICE_${numStr}.png`;
                iceFrame.style.position = 'absolute';
                iceFrame.style.width = '200px'; iceFrame.style.height = '200px';
                iceFrame.style.left = '350px'; iceFrame.style.bottom = '10px';
                iceFrame.style.mixBlendMode = 'screen';
                layer.appendChild(iceFrame);

                if (m === 8) {
                    setTimeout(() => { 
                        iceFrame.style.opacity = '0'; 
                        iceFrame.style.transition = 'opacity 0.3s ease-out'; 
                    }, 450); 
                }
            }, (m - 1) * 65);
        }

    } else if (type === 'holy') {
        // ホーリー：十字架 ➔ 爆発Sheet
        const cross = document.createElement('img');
        cross.src = holyPath + "cross_01.png";
        cross.style.position = 'absolute';
        cross.style.width = '160px'; cross.style.height = '160px';
        cross.style.left = '370px'; cross.style.top = '-200px'; 
        cross.style.transition = 'top 0.25s cubic-bezier(0.25, 1, 0.5, 1)';
        cross.style.mixBlendMode = 'screen';
        layer.appendChild(cross);

        setTimeout(() => { cross.style.top = '50px'; }, 10);
        setTimeout(() => { cross.src = holyPath + "cross_02.png"; }, 250);
        setTimeout(() => { cross.src = holyPath + "cross_03.png"; }, 400);
        setTimeout(() => { cross.style.opacity = '0'; cross.style.transition = 'opacity 0.2s'; }, 650);

        setTimeout(() => {
            const animDiv = document.createElement('div');
            animDiv.style.position = 'absolute';
            animDiv.style.width = '120px'; animDiv.style.height = '120px';
            animDiv.style.left = '390px'; animDiv.style.top = '90px';
            animDiv.style.backgroundImage = `url('${holyPath}pipo-btleffect171_480sheet.png')`;
            animDiv.style.backgroundRepeat = 'no-repeat';
            animDiv.style.mixBlendMode = 'screen';
            animDiv.style.transform = 'scale(1.4)';
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

    } else if (type === 'def') {
        // ==========================================
        // 🛡️ 【機能2】本物ハニカムシールド（立体球体ドーム）
        // 🚨 バグ排除：無駄な攻撃判定を一切挟まない安全完全クリーン仕様
        // ==========================================
        const shield = document.createElement('div');
        shield.id = 'hologram-shield';
        shield.style.position = 'absolute';
        shield.style.width = '150px'; shield.style.height = '150px';
        shield.style.left = '35px'; shield.style.top = '35px';
        
        shield.style.backgroundImage = "url('assets/effects/standard/Hexagonal_grid.svg')";
        shield.style.backgroundSize = '30px 30px';
        shield.style.filter = 'hue-rotate(30deg)';
        
        shield.style.borderRadius = '50%';
        shield.style.border = '4px solid rgba(255, 255, 255, 0.95)';
        shield.style.boxShadow = 'inset 0 0 25px #06b6d4, 0 0 20px rgba(6,182,212,0.6)';
        
        shield.style.animation = 'shieldDeploy 0.7s forwards ease-in-out';
        frontLayer.appendChild(shield);

        setTimeout(() => { if (shield.parentNode) shield.parentNode.removeChild(shield); }, 750);
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
    if (window.isEnemyShieldActive) { dmg = Math.floor(dmg * 0.25); }
    window.isEnemyShieldActive = false;

    renderMagicVisual(playerMove);

    try {
        if (typeof startSpellEffect === "function") startSpellEffect(playerMove);
        else if (typeof openMagic === "function") openMagic(playerMove);
    } catch (e) {}

    try {
        if (typeof playSE === "function") {
            if (playerMove === 'fire' && typeof SOUND_FIRE !== 'undefined') playSE(SOUND_FIRE);
            else if (playerMove === 'ice' && typeof SOUND_ICE !== 'undefined') playSE(SOUND_ICE);
            else if (playerMove === 'holy' && typeof SOUND_HOLY !== 'undefined') playSE(SOUND_HOLY);
        }
    } catch (e) {}

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

    const willDie = (window.eHp - dmg <= 0);
    const triggerCutIn = (isCritical && willDie);

    setTimeout(() => {
        window.eHp = Math.max(0, window.eHp - dmg); 
        updateHpUI(); 
        if (typeof createDmgPop === "function") createDmgPop(dmg, false);
        
        const logEl = document.getElementById('battle-log');
        if (logEl) {
            logEl.innerHTML = isCritical ? `💥 弱点直撃！敵に <span style='color: #ef4444; font-weight: bold;'>${dmg}</span> ダメージ！` : `敵に ${dmg} ダメージ！`;
        }
        
        window.mana = 1.0; 
        const chargeBadge = document.getElementById('charge-badge');
        if (chargeBadge) chargeBadge.style.display = "none"; 
        
        // 💥 【機能5】トドメのクリティカルカットイン演出分岐
        if (triggerCutIn) {
            executeCriticalCutIn();
        } else {
            setTimeout(() => { if (!checkBattleEnd()) enemyTurnAction(); }, 800);
        }
    }, 400);
}

// ==========================================
// 💥 5. 【機能5】弱点トドメの「カットイン演出」
// ==========================================
function executeCriticalCutIn() {
    const layer = document.getElementById('front-effect-layer');
    if (!layer) { checkBattleEnd(); return; }

    const cutInBar = document.createElement('div');
    cutInBar.style.position = 'absolute';
    cutInBar.style.width = '100%'; cutInBar.style.height = '110px';
    cutInBar.style.left = '0'; cutInBar.style.top = '120px';
    cutInBar.style.backgroundColor = 'rgba(15, 23, 42, 0.9)';
    cutInBar.style.borderTop = '3px solid #eab308';
    cutInBar.style.borderBottom = '3px solid #eab308';
    cutInBar.style.boxShadow = '0 0 30px rgba(234, 179, 8, 0.5)';
    cutInBar.style.display = 'flex'; cutInBar.style.alignItems = 'center'; cutInBar.style.justifyContent = 'center';
    cutInBar.style.overflow = 'hidden';
    cutInBar.style.animation = 'cutInAnim 1.4s forwards cubic-bezier(0.16, 1, 0.3, 1)';
    
    const cutInText = document.createElement('div');
    cutInText.innerHTML = "✨ CRITICAL FINISH ✨";
    cutInText.style.color = '#eab308';
    cutInText.style.fontFamily = "'Impact', 'Arial Black', sans-serif";
    cutInText.style.fontSize = '32px';
    cutInText.style.letterSpacing = '4px';
    cutInText.style.textShadow = '0 0 10px #f59e0b, 0 0 20px #ef4444';
    cutInBar.appendChild(cutInText);
    layer.appendChild(cutInBar);

    const eContainer = document.getElementById('e-sprite-container');
    if (eContainer) {
        eContainer.style.transition = 'all 1.2s cubic-bezier(0.1, 1, 0.1, 1)';
        eContainer.style.transform = 'translateX(400px) translateY(-80px) rotate(45deg) scale(0.1)';
        eContainer.style.opacity = '0';
    }

    setTimeout(() => {
        if (cutInBar.parentNode) cutInBar.parentNode.removeChild(cutInBar);
        checkBattleEnd();
    }, 1450);
}

// ==========================================
// 🎒 6. アイテムバッグ・ステージ進行管理
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

function startBattle() {
    const layer = document.getElementById('spell-effect-layer');
    const frontLayer = document.getElementById('front-effect-layer');
    if (layer) layer.innerHTML = "";
    if (frontLayer) frontLayer.innerHTML = "";

    const data = STAGES[window.curIdx]; 
    window.eHp = window.eMaxHp = data.hp; 
    window.isBusy = false; window.isPlayerStunned = false; window.isAmuletActive = 0; window.enemyMana = 1.0; window.isEnemyShieldActive = false; window.battleTurnCount = 1; 

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
    
    injectOriginalVisuals();

    if (logEl) logEl.innerHTML = `${data.name}が現れた！弱点: ${data.weak.toUpperCase()}`;
    if (typeof startBGM === "function") startBGM("battle");

    setTimeout(() => {
        let folderType = data.type; 
        if (eGraphic && MASTER_ANIM_MAP[folderType]) { eGraphic.src = MASTER_ANIM_MAP[folderType][0]; }
        if (typeof startCustomAnimation === "function") startCustomAnimation(folderType); 
    }, 50);
}

// ==========================================
// 👹 7. エネミーターン ＆【機能3・4】物理突進・特殊行動移植
// ==========================================
function enemyTurnAction(isPlayerDefending = false) {
    if (window.eHp <= 0 || window.pHp <= 0) return; 
    const data = STAGES[window.curIdx];
    const logEl = document.getElementById('battle-log');
    
    let isSpecial = false;
    if (window.battleTurnCount > 1 && Math.random() < 0.4) isSpecial = true;

    let dmg = isPlayerDefending ? Math.max(1, Math.floor(data.atk * 0.15)) : data.atk;
    dmg = Math.floor(dmg * window.enemyMana); window.enemyMana = 1.0; 
    if (window.isAmuletActive > 0 && !isPlayerDefending) dmg = Math.floor(dmg * 0.5);

    const layer = document.getElementById('spell-effect-layer'); 
    const frontLayer = document.getElementById('front-effect-layer');
    if (layer) layer.innerHTML = "";
    if (frontLayer) frontLayer.innerHTML = "";

    if (isSpecial) {
        // --- 【機能4】モンスター特殊攻撃演出（酸・蜘蛛糸） ---
        if (data.type === 'slime') {
            if (logEl) logEl.innerHTML = `👹 ${data.name}の【緑の液体投げ（酸）】！`;
            try { if (typeof triggerEnemyEffect === "function") triggerEnemyEffect('slime_acid'); } catch(e) {}
        } 
        else if (data.type === 'spider') {
            if (logEl) logEl.innerHTML = `👹 ${data.name}の【粘着糸吐き】！体を拘束された！`;
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
        
        // --- 【機能3】モンスター本物物理突進（左端ブチ抜き体当たり） ---
        const eContainer = document.getElementById('e-sprite-container');
        if (eContainer) {
            eContainer.style.animation = "enemyAssault_Retro 0.4s cubic-bezier(0.19, 1, 0.22, 1) forwards";
            setTimeout(() => { 
                if (eContainer) eContainer.style.animation = "floatE 2.5s infinite alternate ease-in-out"; 
            }, 410);
        }
    }

    window.pHp = Math.max(0, window.pHp - dmg); 
    updateHpUI(); 
    if (typeof createDmgPop === "function") createDmgPop(dmg, true);
    
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
    setTimeout(() => { window.isBusy = false; checkBattleEnd(); }, 800);
}

function checkBattleEnd() {
    if (window.pHp <= 0 || window.eHp <= 0) { 
        if (typeof stopBGM === "function") stopBGM(); 
        if (typeof stopSlimeAnimation === "function") stopSlimeAnimation();
        if (window.eHp <= 0) {
            try { if (typeof playSE === "function" && typeof SOUND_FREEZE_DEAD !== 'undefined') playSE(SOUND_FREEZE_DEAD); } catch(e){}
            const eContainer = document.getElementById('e-sprite-container');
            if (eContainer) { eContainer.style.opacity = "0"; eContainer.style.transform = "scale(0.5)"; }
            setTimeout(() => { transitionToResult(); }, 800);
        } else { transitionToResult(); }
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
    window.mana = 1.0; window.curIdx = -1; window.isBusy = false; window.itemInventory = { potion: 1, amulet: 1 }; window.isAmuletActive = 0; 
    if (typeof stopBGM === "function") stopBGM(); 
    if (typeof stopSlimeAnimation === "function") stopSlimeAnimation(); 
}

// ==========================================
// 🧱 8. 【追加機能】資料33ab04fb由来 本物背景レンガ自動描画回路
// ==========================================
window.addEventListener('DOMContentLoaded', () => {
    drawBricks();
});

function drawBricks() {
  const canvas = document.getElementById('brick-canvas'); if (!canvas) return;
  const ctx = canvas.getContext('2d'); if (!ctx) return;
  const w = canvas.width = window.innerWidth; const h = canvas.height = window.innerHeight;
  
  // 基礎背景のダークスレート塗りつぶし
  ctx.fillStyle = '#0f172a'; ctx.fillRect(0, 0, w, h); 
  
  // 緻密なグリッドレンガ線の描画
  ctx.strokeStyle = 'rgba(51, 65, 85, 0.4)'; ctx.lineWidth = 2;
  const brickW = 80; const brickH = 40;
  
  for (let y = 0; y < h; y += brickH) {
    const shift = (Math.floor(y / brickH) % 2) * (brickW / 2);
    // 横線
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    // 縦線（段違いシフト）
    for (let x = shift - brickW; x < w + brickW; x += brickW) {
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + brickH); ctx.stroke();
    }
  }
}
