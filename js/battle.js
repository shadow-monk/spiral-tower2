// ==========================================
// 🕒 🔄 更新検知・タイムスタンプ刻印システム
// 📦 VERSION: 1.2 (資料e65ffa6演出完全統合・出現ラグ無し確定版)
// ==========================================
console.log("%c🔄 [BATTLE SYSTEMS] Ver 1.2：①ハニカム3D＆②魔法フェードを完全維持 ＋ 資料e65ffa6（体当たり・カットイン・酸糸・麻痺拘束）100%完全融合！", "color: #00ff00; font-weight: bold;");

// ==========================================
// ⚔️ 1. グローバル戦闘ステータス管理変数（Ver 1.1ベースを完全保護）
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
// 🎨 2. 【新設】資料e65ffa6準拠：CSSアニメーション動的注入システム
// ==========================================
// HTML側に元の美しい@keyframesが存在しない場合でも、JS側から不壊の描画として強制注入する
(function injectRequiredStyles() {
    if (document.getElementById('v12-merged-styles')) return;
    const style = document.createElement('style');
    style.id = 'v12-merged-styles';
    style.innerHTML = `
        /* 🧙‍♂️👹 キャラクター標準ホバー浮遊（資料e65ffa6完全復元） */
        @keyframes floatP { 0% { transform: translateY(0px) scaleY(1); } 100% { transform: translateY(-12px) scaleY(1.02); } }
        @keyframes floatE { 0% { transform: translateY(0px) scale(1); } 100% { transform: translateY(-10px) scale(1.03); } }
        
        /* 👹 敵通常攻撃：本物物理突進体当たり（資料e65ffa6完全復元） */
        @keyframes enemyAssault { 
            0% { transform: translateX(0); } 
            20% { transform: translateX(30px); } 
            45% { transform: translateX(-160px) scale(1.1); } 
            70% { transform: translateX(15px); } 
            100% { transform: translateX(0); } 
        }
        
        /* ☠ トドメの映画風クリティカル帯スライド（資料e65ffa6完全復元） */
        @keyframes cutinSlide { 
            0% { transform: translateX(-100%) skewX(-15deg); opacity: 0; } 
            15% { transform: translateX(0%) skewX(-15deg); opacity: 1; } 
            85% { transform: translateX(0%) skewX(-15deg); opacity: 1; } 
            100% { transform: translateX(100%) skewX(-15deg); opacity: 0; } 
        }
        
        /* 🕸🧪 敵特殊行動：飛び道具飛翔エフェクト（資料e65ffa6完全復元） */
        @keyframes enemyMissileFly {
            0% { transform: translate(140px, -20px) scale(0.5); background-position: 0px 0px; opacity: 0; }
            15% { opacity: 1; }
            33% { background-position: -64px 0px; }
            66% { background-position: -128px 0px; }
            100% { transform: translate(-110px, 40px) scale(1.3); background-position: -192px 0px; opacity: 0; }
        }
    `;
    document.head.appendChild(style);
})();

// ==========================================
// 🧙‍♂️👹 3. キャラサイズ高画素浮遊・オーラ強制制御（資料e65ffa6完全適合化）
// ==========================================
function applyMegaVisuals() {
    const data = STAGES[window.curIdx];
    const pContainer = document.getElementById('p-sprite-container');
    const pGraphic = document.getElementById('p-sprite-graphic') || document.getElementById('p-sprite-img');
    
    // 主人公：資料e65ffa6に完全準拠した140px高画素浮遊化
    if (pContainer && pGraphic) {
        pContainer.style.width = '160px'; 
        pContainer.style.height = '160px';
        pContainer.style.animation = 'floatP 1.8s infinite alternate ease-in-out'; 
        pGraphic.style.width = '140px';
        pGraphic.style.height = '140px';
        pGraphic.style.imageRendering = 'pixelated';
        pGraphic.style.filter = 'drop-shadow(0 0 15px rgba(79,70,229,0.4))'; 
    }

    // 敵：資料e65ffa6に完全準拠した200px高画素・ボス属性個有オーラ化
    const eContainer = document.getElementById('e-sprite-container');
    const eGraphic = document.getElementById('e-sprite-graphic');
    if (eContainer && eGraphic) {
        eContainer.removeAttribute("style"); // 残像スタイルのデストロイ
        eContainer.style.width = '200px'; 
        eContainer.style.height = '200px';
        eContainer.style.display = 'flex';
        eContainer.style.justifyContent = 'center';
        eContainer.style.alignItems = 'center';
        eContainer.style.position = 'relative';
        eContainer.style.animation = 'floatE 2.2s infinite alternate ease-in-out'; 
        eContainer.style.filter = `drop-shadow(0 0 25px ${data ? data.glow : 'rgba(239,68,68,0.4)'})`; 
        
        eGraphic.removeAttribute("style");
        eGraphic.style.width = '200px';
        eGraphic.style.height = '200px';
        eGraphic.style.objectFit = 'contain';
        eGraphic.style.imageRendering = 'pixelated';
        eGraphic.style.display = 'block';
        if (data && data.type === "eyes") { eGraphic.style.transform = "scaleX(-1)"; }
    }
}

// ==========================================
// 🔥 🛡️ ❄️ ✨ 4. ①ハニカム3D＆②魔法フェード＆ホーリー（Ver 1.1の聖域）
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
// 🧙‍♂️ 5. プレイヤー行動・基本戦闘ループ（資料e65ffa6トドメのカットイン搭載）
// ==========================================
function turn(playerMove) {
    if (window.isBusy || window.pHp <= 0 || window.eHp <= 0) return; 
    window.isBusy = true;

    // 麻痺（スタン）時：1ターン完全行動不能スキップ（資料e65ffa6設計完全マージ）
    if (window.isPlayerStunned) { 
        window.isPlayerStunned = false; 
        const logEl = document.getElementById('battle-log');
        if (logEl) logEl.innerHTML = "🚨 <span style='color: #f59e0b; font-weight: bold;'>粘着糸に絡め取られて動けない！ ターンがスキップされた！</span>"; 
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

    // トドメの一撃かつ弱点直撃（クリティカル）時の暗転カットイン割り込み（資料e65ffa6完全復元回路）
    if (isCritical && (window.eHp - dmg <= 0)) {
        try { if (typeof playSE === "function") playSE('boom'); } catch(e){}
        
        const darkLayer = document.getElementById('cutin-dark-layer');
        const cutinBar = document.getElementById('cutin-bar');
        
        if (darkLayer && cutinBar) {
            darkLayer.style.display = "block";
            cutinBar.style.display = "flex";
            cutinBar.style.animation = "cutinSlide 1.0s ease-in-out forwards";
            
            setTimeout(() => {
                darkLayer.style.display = "none";
                cutinBar.style.display = "none";
                executeActualDamage(playerMove, isCritical, dmg);
            }, 1000);
            return;
        }
    }

    executeActualDamage(playerMove, isCritical, dmg);
}

// ダメージ適用処理の分離カプセル
function executeActualDamage(playerMove, isCritical, dmg) {
    renderMagicVisual(playerMove);

    // 外部演出用エラー隔離シールド
    try {
        if (typeof startSpellEffect === "function") {
            startSpellEffect(playerMove);
        } else if (typeof openMagic === "function") {
            openMagic(playerMove);
        }
    } catch (spellError) { console.warn("⚠️ 外部演出内のエラーを隔離:", spellError); }

    // 効果音再生
    try {
        if (typeof playSE === "function") {
            if (playerMove === 'fire' && typeof SOUND_FIRE !== 'undefined') playSE(SOUND_FIRE);
            else if (playerMove === 'ice' && typeof SOUND_ICE !== 'undefined') playSE(SOUND_ICE);
            else if (playerMove === 'holy' && typeof SOUND_HOLY !== 'undefined') playSE(SOUND_HOLY);
        }
    } catch (seError) { console.warn("⚠️ 効果音再生エラー隔離:", seError); }

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
    if (chNum) chNum.innerText = `FLOOR ${data.floor < 10 ? '0' + data.floor : data.floor}`; 
    if (chTitle) chTitle.innerText = data.name; 
    if (introTxt) introTxt.innerText = data.txt;
    showScreen('scr-intro'); 
    if (typeof stopBGM === "function") stopBGM();
}

// 【Ver 1.1聖域】爆速出現ラグバスター直列処理システム
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
    if (eContainer) { eContainer.style.opacity = "1"; eContainer.style.transform = "none"; }
    const pGraphic = document.getElementById('p-sprite-graphic') || document.getElementById('p-sprite-img');
    if (pGraphic) pGraphic.src = getAssetPath('hero', 'Wizard.png');
    
    const itemBadge = document.getElementById('item-badge');
    const chargeBadge = document.getElementById('charge-badge');
    const eName = document.getElementById('e-name');
    const eGraphic = document.getElementById('e-sprite-graphic');
    const logEl = document.getElementById('battle-log');
    
    if (itemBadge) itemBadge.style.display = "none"; 
    if (chargeBadge) chargeBadge.style.display = "none";
    if (eName) eName.innerText = data.name;
    
    // 画面遷移と同時に直接本物画像を流し込む（1ミリ秒の隙間も与えない出現ラグ潰し）
    let folderType = data.type; 
    if (eGraphic && MASTER_ANIM_MAP[folderType]) { 
        eGraphic.src = MASTER_ANIM_MAP[folderType][0];
    }
    
    showScreen('scr-battle'); 
    updateHpUI(); 
    checkDevPassword();
    
    // 即時、資料e65ffa6に最適化された高画素ホバーサイズを反映
    applyMegaVisuals();

    if (logEl) logEl.innerHTML = `戦闘領域展開。${data.name}を駆逐せよ。 <span style='color:#38bdf8;'>[弱点: ${data.weak.toUpperCase()}]</span>`;
    if (typeof startBGM === "function") startBGM("battle");

    if (typeof startCustomAnimation === "function") {
        startCustomAnimation(folderType); 
    }
}

// ==========================================
// 👹 7. エネミーターン行動AI・資料e65ffa6（体当たり突進＆酸・糸特殊攻撃）完全同期版
// ==========================================
function enemyTurnAction(isPlayerDefending = false) {
    if (window.eHp <= 0 || window.pHp <= 0) return; 
    const data = STAGES[window.curIdx];
    const logEl = document.getElementById('battle-log');
    
    // 資料基準の特殊行動発火判定（36%確率発動）
    let isSpecial = (Math.random() < 0.36) && ['slime', 'spider', 'harpy', 'dragon'].includes(data.type);

    let dmg = isPlayerDefending ? Math.max(1, Math.floor(data.atk * 0.12)) : data.atk;
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
        // 資料e65ffa6に内包されている各種毒・糸・スラッシュのスプライト動的インジェクション
        if (data.type === 'slime') {
            if (layer) layer.innerHTML = '<div style="position:absolute; width:64px; height:64px; background-image:url(\'https://raw.githubusercontent.com/shadow-monk/game1/main/assets/effect/poison.png\'); background-size:256px 64px; left:220px; top:145px; animation:enemyMissileFly 0.45s ease-in forwards; image-rendering:pixelated; mix-blend-mode:screen;"></div>';
            dmg = Math.floor(dmg * 0.9);
            if (logEl) logEl.innerHTML = `🚨 ${data.name}の【溶解酸液】被弾！防御低下！`;
        } 
        else if (data.type === 'spider') {
            if (layer) layer.innerHTML = '<div style="position:absolute; width:64px; height:64px; background-image:url(\'https://raw.githubusercontent.com/shadow-monk/game1/main/assets/effect/GUS.png\'); background-size:256px 64px; left:220px; top:145px; animation:enemyMissileFly 0.45s ease-in forwards; image-rendering:pixelated; mix-blend-mode:screen;"></div>';
            dmg = 5; 
            window.isPlayerStunned = true; // 次ターン麻痺確定化
            if (logEl) logEl.innerHTML = `🚨 ${data.name}の【粘着拘束糸】被弾！次ターン【麻痺行動不能】！`;
        } 
        else if (data.type === 'harpy') {
            if (layer) layer.innerHTML = '<div style="position:absolute; width:64px; height:64px; background-image:url(\'https://raw.githubusercontent.com/shadow-monk/game1/main/assets/effect/slash.png\'); background-size:256px 64px; left:220px; top:145px; animation:enemyMissileFly 0.45s ease-in forwards; image-rendering:pixelated; mix-blend-mode:screen;"></div>';
            dmg = Math.floor(dmg * 1.1);
            if (logEl) logEl.innerHTML = `🚨 ${data.name}の【真空引き裂き刃】！【${dmg}】被弾！`;
        }
        else if (data.type === 'dragon') {
            if (layer) layer.innerHTML = '<div style="position:absolute; width:64px; height:64px; background-image:url(\'https://raw.githubusercontent.com/shadow-monk/game1/main/assets/effect/kaenbeam.png\'); background-size:256px 64px; left:220px; top:145px; animation:enemyMissileFly 0.45s ease-in forwards; image-rendering:pixelated; mix-blend-mode:screen;"></div>';
            dmg = Math.floor(dmg * 1.3);
            if (logEl) logEl.innerHTML = `🔥 黒竜激昂！【滅びのバーストブレス】！【${dmg}】被弾！`;
        }

        setTimeout(() => {
            try { if (typeof playSE === "function") playSE('boom'); } catch(e){}
            if (typeof triggerShake === "function") triggerShake('attack_success');
            if (typeof createDmgPop === "function") createDmgPop(dmg, false, true);
            
            window.pHp = Math.max(0, window.pHp - dmg); 
            updateHpUI(); 
            if (layer) layer.innerHTML = "";
            postEnemyTurnCleanup();
        }, 400);

    } else {
        // 通常行動：資料e65ffa6準拠の『本物突進体当たり（enemyAssault）』発動回路
        if (logEl) {
            logEl.innerHTML = isPlayerDefending ? `🛡 絶対障壁適応！被弾を【${dmg}】に封滅！` : `${data.name}の突進体当たりを喰らい【${dmg}】被弾！`;
        }
        
        const eContainer = document.getElementById('e-sprite-container');
        if (eContainer) {
            eContainer.style.transform = 'translateX(0)';
            eContainer.style.animation = 'none'; 
            void eContainer.offsetWidth; // リフローによるアニメーションの強制再着火
            eContainer.style.animation = "enemyAssault 0.45s forwards";
            
            setTimeout(() => { 
                if (eContainer) eContainer.style.animation = "floatE 2.2s infinite alternate ease-in-out"; 
            }, 460);
        }

        setTimeout(() => {
            try { if (typeof playSE === "function") playSE('boom'); } catch(e){}
            if (typeof triggerShake === "function") triggerShake('attack_success');
            if (typeof createDmgPop === "function") createDmgPop(dmg, false, true);
            
            window.pHp = Math.max(0, window.pHp - dmg); 
            updateHpUI(); 
            postEnemyTurnCleanup();
        }, 220);
    }
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
    }, 500);
}

// ==========================================
// 💥 8. 勝敗判定・ゲームリセット（資料e65ffa6回転縮小吹っ飛び死亡処理マージ）
// ==========================================
function checkBattleEnd() {
    if (window.pHp <= 0 || window.eHp <= 0) { 
        if (typeof stopBGM === "function") stopBGM(); 
        if (typeof stopSlimeAnimation === "function") { stopSlimeAnimation(); }
        
        if (window.eHp <= 0) {
            try { if (typeof playSE === "function") playSE('boom'); } catch(e){}
            if (typeof triggerShake === "function") triggerShake('critical_shake');
            if (typeof flashCritical === "function") flashCritical('#ffffff');
            
            // 敵死亡時：資料e65ffa6に記載された美しい回転縮小吹っ飛び（scale(0.01) rotate(180deg)）を完全体現
            const eContainer = document.getElementById('e-sprite-container');
            if (eContainer) { 
                eContainer.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)'; 
                eContainer.style.transform = 'scale(0.01) rotate(180deg)'; 
                eContainer.style.opacity = '0'; 
            }
            
            // 戦利品獲得フラグ（資料e65ffa6内部ロジックプロテクト）
            if (window.curIdx === 0 || window.curIdx === 3) { window.itemInventory.potion++; } 
            if (window.curIdx === 1 || window.curIdx === 5) { window.itemInventory.amulet++; }
            
            setTimeout(() => { transitionToResult(); }, STAGES[window.curIdx].floor === 10 ? 1200 : 650);
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
    const rIcon = document.getElementById('res-icon');
    
    if (window.eHp <= 0) {
        if (window.curIdx === STAGES.length - 1) {
            if (rIcon) rIcon.innerText = "👑";
            if (rTitle) { rTitle.innerText = "GRAND END"; rTitle.style.color = '#eab308'; }
            if (rText) rText.innerText = "最上階に君臨せし黒竜は消滅し、世界を包んでいた暗黒の呪縛は完全に霧散した。新星術式を極めし賢者ウィザードの英知により、螺旋の塔へ永遠の平穏が取り戻される。戦いは終わり、英雄の叙事詩が今ここに完結した。あなたの勝利は歴史に永久に刻まれ、新たな光の時代が幕を開ける。平和 of 光とともに歩みを進めよ。";
            if (rBtn) rBtn.innerText = "タイトルに戻る"; 
            if (typeof startBGM === "function") startBGM("grand_end"); 
        } else {
            if (rIcon) rIcon.innerText = "🏆";
            if (rTitle) { rTitle.innerText = "VICTORY"; rTitle.style.color = '#10b981'; }
            let dLog = (window.curIdx === 0 || window.curIdx === 3) ? "➔ 戦利品【🧪回復薬】を獲得！" : (window.curIdx === 1 || window.curIdx === 5) ? "➔ 戦利品【🧿お守り】を獲得！" : "";
            if (rText) rText.innerText = `激闘の末、立ちはだかる${STAGES[window.curIdx].name}を完全に粉砕した！${dLog}`; 
            if (rBtn) rBtn.innerText = "次の階層へ進む";
            if (typeof stopBGM === "function") stopBGM(); // 道中完全無音プロテクト
        }
    } else {
        if (rIcon) rIcon.innerText = "💀";
        if (rTitle) { rTitle.innerText = "DEFEATED"; rTitle.style.color = '#f43f5e'; }
        if (rText) rText.innerText = `${STAGES[window.curIdx].name}に敗北した...`; 
        if (rBtn) rBtn.innerText = "タイトルに戻る"; 
        window.curIdx = -1;
        if (typeof stopBGM === "function") stopBGM();
    }
    window.isBusy = false;
}

function resetGame() { 
    window.pMaxHp = 100; 
    window.pHp = 100; 
    window.mana = 1.0; 
    window.curIdx = -1; 
    window.isBusy = false; 
    window.itemInventory = { potion: 1, amulet: 1 }; 
    window.isAmuletActive = 0; 
    const logEl = document.getElementById('battle-log');
    if (logEl) logEl.innerHTML = "コマンドを選択せよ。";
    if (typeof stopBGM === "function") stopBGM(); 
    if (typeof stopSlimeAnimation === "function") { stopSlimeAnimation(); }
    if (typeof clearCrisisAlertEffects === "function") { clearCrisisAlertEffects(); }
}
// ==========================================
// 🕒 📦 END OF FILE - js/battle.js [Ver 1.2]
// ==========================================
