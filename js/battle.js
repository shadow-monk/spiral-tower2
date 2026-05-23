// ==========================================
// 🕒 🔄 更新検知・タイムスタンプ刻印システム
// ==========================================
console.log("%c🔄 [BATTLE SYSTEMS] ①ファイア・アイス多層グラフィックエフェクト完全実装完了！", "color: #00ff00; font-weight: bold;");

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
// 🔥 ❄️ 【新設計】① ファイア・アイス多層グラフィックエフェクト回路
// ==========================================
function renderMagicVisual(type) {
    const layer = document.getElementById('spell-effect-layer');
    if (!layer) return;
    layer.innerHTML = ""; // 前の演出をクリア

    if (type === 'fire') {
        // ==========================================
        // 🔥 ファイア：多層大炎上・プロミネンス演出
        // ==========================================
        
        // レイヤー1：飛び交う無数の連射火炎弾（0ms〜200msで時間差射出）
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const b = document.createElement('div');
                b.style.position = 'absolute';
                b.style.width = '35px';
                b.style.height = '35px';
                b.style.background = 'radial-gradient(circle, #ffedd5 10%, #f97316 50%, #ef4444 80%, transparent 100%)';
                b.style.borderRadius = '50%';
                b.style.filter = 'blur(1px)';
                b.style.boxShadow = '0 0 15px #ef4444, 0 0 30px #ea580c';
                b.style.animation = 'fireMissile 0.4s cubic-bezier(0.25, 1, 0.5, 1) forwards';
                // 弾道にわずかな上下の散らばり（ブレ）を与えて多層感を演出
                b.style.transform = `translateY(${(i - 2) * 15}px)`;
                layer.appendChild(b);
            }, i * 60);
        }

        // レイヤー2：敵の足元に広がる大炎上の渦（350ms後に着弾展開）
        setTimeout(() => {
            const vortex = document.createElement('div');
            vortex.style.position = 'absolute';
            vortex.style.width = '240px';
            vortex.style.height = '90px';
            vortex.style.left = '330px';
            vortex.style.bottom = '5px';
            vortex.style.background = 'radial-gradient(ellipse, rgba(239,68,68,0.9) 20%, rgba(249,115,22,0.6) 60%, transparent 80%)';
            vortex.style.borderRadius = '50%';
            vortex.style.border = '4px double #facc15';
            vortex.style.boxShadow = '0 0 35px #ef4444, inset 0 0 20px #f97316';
            vortex.style.opacity = '0';
            vortex.style.transform = 'scale(0.5)';
            vortex.style.transition = 'all 0.2s ease-out';
            layer.appendChild(vortex);
            
            // 瞬時に広がる
            setTimeout(() => { 
                vortex.style.opacity = '1'; 
                vortex.style.transform = 'scale(1.1) rotate(15deg)'; 
            }, 10);
            
            // ターン終了に合わせて消去
            setTimeout(() => { vortex.style.opacity = '0'; }, 600);
        }, 350);

        // レイヤー3：下から突き上げる3本の巨大火柱（400ms〜500msで時間差連動）
        for (let j = 0; j < 3; j++) {
            setTimeout(() => {
                const pillar = document.createElement('div');
                pillar.style.position = 'absolute';
                pillar.style.width = '70px';
                pillar.style.height = '340px';
                // 敵を包み込むように左・中央・右に配置
                pillar.style.left = `${350 + (j * 45)}px`;
                pillar.style.bottom = '-10px';
                pillar.style.background = 'linear-gradient(to top, #ffffff 5%, #facc15 20%, #ef4444 60%, transparent 100%)';
                pillar.style.borderRadius = '40% 40% 0 0';
                pillar.style.filter = 'blur(2px)';
                pillar.style.boxShadow = '0 0 40px #ef4444, 0 0 70px #f97316';
                pillar.style.transformOrigin = 'bottom center';
                pillar.style.animation = 'firePillarGlow 0.6s cubic-bezier(0.11, 0, 0.5, 0) forwards';
                layer.appendChild(pillar);
            }, 400 + (j * 60));
        }

    } else if (type === 'ice') {
        // ==========================================
        // ❄️ アイス：地面からの氷柱・巨大氷結城塞演出
        // ==========================================
        
        // レイヤー1：地面から牙のように突き出す前衛の氷柱群（0ms〜150ms）
        for (let k = 0; k < 4; k++) {
            setTimeout(() => {
                const spike = document.createElement('div');
                spike.style.position = 'absolute';
                spike.style.bottom = '-10px';
                spike.style.left = `${340 + (k * 55)}px`;
                spike.style.width = '45px';
                spike.style.height = '140px';
                spike.style.background = 'linear-gradient(30deg, #0c4a6e 10%, #38bdf8 60%, #f0f9ff 90%)';
                // 鋭い氷のトゲの形状にクリップ
                spike.style.clipPath = 'polygon(50% 0%, 100% 100%, 0% 100%)';
                spike.style.filter = 'drop-shadow(0 0 10px #0284c7)';
                spike.style.transformOrigin = 'bottom center';
                spike.style.transform = `scaleY(0) rotate(${(k - 1.5) * 8}deg)`;
                spike.style.transition = 'transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                layer.appendChild(spike);

                // 地面から突き刺さるように出現
                setTimeout(() => { spike.style.transform = `scaleY(1.3) rotate(${(k - 1.5) * 8}deg)`; }, 10);
                // 後ほど消去
                setTimeout(() => { spike.style.opacity = '0'; spike.style.transform = 'scaleY(0)'; spike.style.transition = 'all 0.3s'; }, 700);
            }, k * 40);
        }

        // レイヤー2：敵の頭上・周囲に展開する氷結の陣（250ms後）
        setTimeout(() => {
            // 周囲から中心へ収束する8つの巨大氷結結晶
            for (let m = 0; m < 8; m++) {
                const crystal = document.createElement('div');
                crystal.style.position = 'absolute';
                crystal.style.width = '35px';
                crystal.style.height = '50px';
                crystal.style.background = 'linear-gradient(135deg, rgba(240,249,255,0.95) 0%, rgba(56,189,248,0.8) 50%, rgba(2,132,199,0.9) 100%)';
                crystal.style.clipPath = 'polygon(50% 0%, 100% 35%, 100% 70%, 50% 100%, 0% 70%, 0% 35%)'; // 美しい精密な結晶体
                
                // 円周上に配置
                const angle = (m * Math.PI) / 4;
                crystal.style.left = `${415 + Math.sin(angle) * 110}px`;
                crystal.style.top = `${120 + Math.cos(angle) * 110}px`;
                crystal.style.boxShadow = '0 0 20px #0ea5e9';
                crystal.style.transform = `scale(0.1) rotate(${m * 45}deg)`;
                crystal.style.transition = 'all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1)';
                layer.appendChild(crystal);

                // 敵の中心へ向かって一気に収束・突き刺さる
                setTimeout(() => {
                    crystal.style.left = '415px';
                    crystal.style.top = '120px';
                    crystal.style.transform = `scale(1.2) rotate(${m * 45 + 180}deg)`;
                }, 20);
            }
        }, 250);

        // レイヤー3：中心で全てを完全凍結させる「巨大氷結城塞」（450ms後）
        setTimeout(() => {
            const fortress = document.createElement('div');
            fortress.style.position = 'absolute';
            fortress.style.left = '365px';
            fortress.style.bottom = '10px';
            fortress.style.width = '140px';
            fortress.style.height = '230px';
            fortress.style.background = 'linear-gradient(to top, rgba(2,132,199,0.8) 0%, rgba(56,189,248,0.9) 50%, #ffffff 95%)';
            fortress.style.clipPath = 'polygon(50% 0%, 85% 25%, 100% 60%, 80% 100%, 20% 100%, 0% 60%, 15% 25%)'; // 巨大な水晶・氷山の形状
            fortress.style.filter = 'drop-shadow(0 0 25px #38bdf8) blur(0.5px)';
            fortress.style.transformOrigin = 'bottom center';
            fortress.style.transform = 'scale(0.2)';
            fortress.style.opacity = '0';
            fortress.style.transition = 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)';
            layer.appendChild(fortress);

            // ドンッ！と大サイズで出現（完全に敵を閉じ込める）
            setTimeout(() => {
                fortress.style.opacity = '1';
                fortress.style.transform = 'scale(1.15)';
            }, 10);

            // ターン終了時にバリバリと砕け散るようにフェードアウト
            setTimeout(() => {
                fortress.style.opacity = '0';
                fortress.style.transform = 'scale(0.8) rotate(5deg)';
            }, 550);
        }, 450);
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

    // 🚨 ①新設された「多層グラフィックエフェクト回路」を起動
    renderMagicVisual(playerMove);

    // 外部演出関数（effects.js）のエラー監禁シールド呼び出し
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
        setTimeout(() => { enemyTurnAction(true); }, 800); 
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
    const effLayer = document.getElementById('spell-effect-layer');
    if (effLayer) effLayer.innerHTML = "";
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
    
    // 残像バグ完全根絶
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

    const effLayer = document.getElementById('spell-effect-layer'); 
    if (effLayer) effLayer.innerHTML = "";

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
