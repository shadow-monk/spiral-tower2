// ==========================================
// 🕒 🔄 更新検知・タイムスタンプ刻印システム
// 📦 VERSION: 1.4 (全機能開通・主人公蘇生・粒子四散完全統合版)
// ==========================================
console.log("%c🔄 [BATTLE SYSTEMS] Ver 1.4: ターンガードのタイポを完全修正！デス呪文全面解放・主人公画像100%復活確定版！", "color: #00ff00; font-weight: bold;");

// ⚔️ 外部変数を絶対に汚染・上書きしないためのセーフティプロテクト
window.mana = window.mana || 1.0;
window.isBusy = false; 
window.isPlayerStunned = window.isPlayerStunned || false;
window.isAmuletActive = window.isAmuletActive || 0;
window.itemInventory = window.itemInventory || { potion: 1, amulet: 1 };
window.currentAudioBgm = window.currentAudioBgm || null;

// ==========================================
// 🎧 1. オーディオ制御回路
// ==========================================
function startBGM(mode) {
    stopBGM(); 
    if (window.isMuted) return;
    let targetUrl = "";
    
    const titleBgm = (typeof BGM_PEACE_FANTASY !== 'undefined') ? BGM_PEACE_FANTASY : "https://raw.githubusercontent.com/shadow-monk/game1/main/assets/music/peace_bgm_fantasy14.mp3";
    const battleList = (typeof BGM_BATTLE_LIST !== 'undefined') ? BGM_BATTLE_LIST : [
        "https://raw.githubusercontent.com/shadow-monk/game1/main/assets/music/tactics12.mp3",
        "https://raw.githubusercontent.com/shadow-monk/game1/main/assets/music/pianobattre.mp3",
        "https://raw.githubusercontent.com/shadow-monk/game1/main/assets/music/battrefantasy11.mp3",
        "https://raw.githubusercontent.com/shadow-monk/game1/main/assets/music/Darkbattrey09.mp3"
    ];

    if (mode === "title" || mode === "grand_end") {
        targetUrl = titleBgm;
    } else if (mode === "battle") {
        if (typeof BGM_BATTLE_LIST !== 'undefined' && Array.isArray(BGM_BATTLE_LIST) && BGM_BATTLE_LIST.length > 0) {
            targetUrl = BGM_BATTLE_LIST[Math.floor(Math.random() * BGM_BATTLE_LIST.length)];
        } else if (Array.isArray(battleList) && battleList.length > 0) {
            targetUrl = battleList[Math.floor(Math.random() * battleList.length)];
        }
    }
    
    if (targetUrl) {
        try { 
            window.currentAudioBgm = new Audio(targetUrl);
            window.currentAudioBgm.loop = (mode !== "grand_end"); 
            window.currentAudioBgm.volume = 0.4; 
            window.currentAudioBgm.play().catch(e => null); 
        } catch (e) {}
    }
}

function stopBGM() { 
    if (window.currentAudioBgm) { 
        try { 
            window.currentAudioBgm.pause();
            window.currentAudioBgm = null; 
        } catch (e) {} 
    } 
}

function toggleMute() {
    window.isMuted = !window.isMuted; 
    const muteBtn = document.getElementById('btn-mute');
    if (muteBtn) muteBtn.innerText = window.isMuted ? "🔇 音声: OFF" : "🔊 音声: ON";
    if (window.isMuted) stopBGM(); 
    else { 
        if (document.getElementById('scr-battle') && document.getElementById('scr-battle').style.display === "block") {
            startBGM("battle");
        }
    }
}

function playSE(type) {
    if (window.isMuted) return;
    if (typeof SE_MAGIC !== 'undefined' && SE_MAGIC[type]) { 
        try { 
            let mAudio = new Audio(SE_MAGIC[type]); 
            mAudio.volume = 0.6;
            mAudio.play().catch(e => null); 
            return; 
        } catch (e) {} 
    }
    try {
        let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        let now = audioCtx.currentTime; 
        let osc = audioCtx.createOscillator(); 
        let gain = audioCtx.createGain();
        osc.connect(gain); gain.connect(audioCtx.destination);
        if (type === 'click') { 
            osc.type = 'sine'; osc.frequency.setValueAtTime(800, now); gain.gain.setValueAtTime(0.05, now);
        } else if (type === 'def') { 
            osc.type = 'triangle'; osc.frequency.setValueAtTime(260, now); osc.frequency.linearRampToValueAtTime(580, now + 0.3); gain.gain.setValueAtTime(0.2, now); 
        } else if (type === 'chg') { 
            osc.type = 'sine'; osc.frequency.setValueAtTime(440, now); osc.frequency.linearRampToValueAtTime(880, now + 0.3); gain.gain.setValueAtTime(0.12, now); 
        } else { 
            osc.type = 'sawtooth'; osc.frequency.setValueAtTime(80, now); osc.frequency.linearRampToValueAtTime(10, now + 0.4); gain.gain.setValueAtTime(0.3, now); 
        }
        gain.gain.linearRampToValueAtTime(0.001, now + 0.35); 
        osc.start(now); osc.stop(now + 0.35);
    } catch (e) {}
}

// ==========================================
// 🎒 2. アイテムバッグシステム
// ==========================================
function openItemBag() { 
    playSE('click'); 
    const slotPotion = document.getElementById('item-slot-potion');
    const slotAmulet = document.getElementById('item-slot-amulet');
    const panel = document.getElementById('item-bag-panel');
    if (slotPotion) slotPotion.innerText = `🧪 回復薬 (${window.itemInventory.potion})`; 
    if (slotAmulet) slotAmulet.innerText = `🧿 お守り (${window.itemInventory.amulet})`; 
    if (panel) panel.style.display = 'flex';
}

function closeItemBag() { 
    playSE('click'); 
    const panel = document.getElementById('item-bag-panel');
    if (panel) panel.style.display = 'none'; 
}

function useItem(itemType) {
    if (window.isBusy || window.itemInventory[itemType] <= 0) return;
    window.isBusy = true; 
    window.itemInventory[itemType]--; 
    closeItemBag();
    
    const effectLayer = document.getElementById('spell-effect-layer');
    if (effectLayer) effectLayer.innerHTML = "";
    let log = "";
    
    if (itemType === 'potion') { 
        window.pHp = Math.min(100, window.pHp + 50); 
        updateHpUI(); 
        log = "🎒 消耗品【回復薬】を使用！HPが【50】回復した！";
        flashScreen("#10b981"); 
        playSE('holy'); 
    } else if (itemType === 'amulet') { 
        window.isAmuletActive = 3; 
        log = "🎒 消耗品【守護のお守り】を使用！3ターンの間、全被ダメージを半減！";
        const badge = document.getElementById('item-badge');
        if (badge) {
            badge.style.display = "block"; 
            badge.innerText = "🛡 お守り結界中"; 
        }
        flashScreen("#eab308"); 
        playSE('def'); 
    }
    const logEl = document.getElementById('battle-log');
    if (logEl) logEl.innerHTML = log;
    setTimeout(() => { enemyTurnAction(); }, 1000);
}

// ==========================================
// 🎨 3. 演出ビジュアル効果関数群（★鉄壁ガード化）
// ==========================================
function applyManaStockAura(moveType) {
    const aura = document.getElementById('p-aura-layer'); 
    if (!aura) return;
    if (window.mana > 1.0) {
        aura.style.display = "block";
        if (moveType === 'fire') aura.style.background = "radial-gradient(circle, rgba(239,68,68,0.8) 0%, transparent 70%)";
        if (moveType === 'ice') aura.style.background = "radial-gradient(circle, rgba(56,189,248,0.8) 0%, transparent 70%)";
        if (moveType === 'holy') aura.style.background = "radial-gradient(circle, rgba(234,179,8,0.8) 0%, transparent 70%)";
    }
}

function createDmgPop(dmg, isWeak, isPlayer) {
    const layer = document.getElementById("dmg-layer"); if(!layer) return;
    const pop = document.createElement("div");
    pop.style.position = "absolute"; pop.style.fontSize = isWeak ? "3.2rem" : "2.4rem"; pop.style.fontWeight = "900"; pop.style.fontStyle = "italic";
    pop.style.textShadow = "2px 2px 0px #000";
    if (isPlayer) { 
        pop.style.left = "130px"; pop.style.top = "120px"; pop.style.color = "#ef4444"; pop.innerText = `-${dmg}`; 
    } else { 
        pop.style.right = "90px"; pop.style.top = "90px"; pop.style.color = isWeak ? "#facc15" : "#ffffff"; pop.innerText = isWeak ? `💥 ${dmg}` : dmg; 
    }
    let yIdx = 0; let opacity = 1;
    const upTimer = setInterval(() => { yIdx -= 3; pop.style.transform = `translateY(${yIdx}px)`; opacity -= 0.04; pop.style.opacity = opacity; if(opacity <= 0) { clearInterval(upTimer); pop.remove(); } }, 20);
    layer.appendChild(pop);
}

function triggerShake(shakeType) {
    const stage = document.getElementById('icon-stage'); if(!stage) return;
    let power = shakeType === 'critical_shake' ? 26 : 14; let count = 0;
    const interval = setInterval(() => {
        if (count >= 16) { stage.style.transform = 'none'; clearInterval(interval); return; }
        stage.style.transform = `translate3d(${(Math.random()*power - power/2)}px, ${(Math.random()*power - power/2)}px, 0px)`; count++;
    }, 16);
}

function triggerEnemyHitPulse(isWeak, type) {
    const box = document.getElementById('e-sprite-graphic'); 
    const container = document.getElementById('e-sprite-container'); 
    if (!box || !container) return;
    window.isKnockedBack = true;
    container.style.animation = 'none'; 
    let pCount = 0;
    const pulseTimer = setInterval(() => {
        if (pCount > 6) { 
            box.style.transform = (type === "eyes") ? "scaleX(-1)" : "none"; 
            container.style.animation = 'floatE 2.2s infinite alternate ease-in-out'; 
            window.isKnockedBack = false; 
            clearInterval(pulseTimer); 
            return; 
        }
        let angle = isWeak ? (pCount % 2 === 0 ? 12 : -12) : (pCount % 2 === 0 ? 5 : -5);
        box.style.transform = `translate3d(${(pCount % 2 === 0 ? 15 : -15)}px, ${pCount * -2}px, 0px) rotate(${angle}deg) ${(type === "eyes" ? "scaleX(-1)" : "")}`; 
        pCount++;
    }, 35);
}

function flashScreen(color) { const screen = document.getElementById('eff-scr'); if(!screen) return; screen.style.backgroundColor = color; setTimeout(() => { screen.style.backgroundColor = (window.pHp <= 30) ? 'rgba(239, 68, 68, 0.1)' : '#0f172a'; }, 130); }
function flashCritical(color) { const screen = document.getElementById('eff-scr'); if(!screen) return; screen.style.backgroundColor = color; setTimeout(() => { screen.style.backgroundColor = '#0f172a'; setTimeout(() => { screen.style.backgroundColor = color; setTimeout(() => { screen.style.backgroundColor = (window.pHp <= 30) ? 'rgba(239, 68, 68, 0.1)' : '#0f172a'; }, 65); }, 45); }, 65); }
function hideAll() { ['scr-start','scr-intro','scr-battle','scr-result'].forEach(id => { const el = document.getElementById(id); if (el) el.style.display = 'none'; }); }
function clearCrisisAlertEffects() { const scr = document.getElementById('eff-scr'); const alertBadge = document.getElementById('p-hp-alert-badge'); if(scr) { scr.style.animation = 'none'; scr.style.borderColor = '#334155'; scr.style.backgroundColor = '#0f172a'; } if(alertBadge) alertBadge.style.display = "none"; }

// ==========================================
// 🌌 ②課題：『ドット粒子四散デストロイ』独立エンジン
// ==========================================
function triggerParticle四散(targetContainer, particleColor) {
    if (!targetContainer) return;
    const parent = document.getElementById('eff-scr'); if (!parent) return;

    const rect = targetContainer.getBoundingClientRect();
    const parentRect = parent.getBoundingClientRect();
    const centerX = (rect.left - parentRect.left) + rect.width / 2;
    const centerY = (rect.top - parentRect.top) + rect.height / 2;
    
    const pCount = 45; const particles = [];
    for (let i = 0; i < pCount; i++) {
        const p = document.createElement('div'); p.style.position = 'absolute';
        const pSize = Math.floor(Math.random() * 5) + 4; 
        p.style.width = `${pSize}px`; p.style.height = `${pSize}px`; p.style.left = `${centerX}px`; p.style.top = `${centerY}px`;
        p.style.backgroundColor = particleColor || '#ffffff'; p.style.boxShadow = `0 0 8px ${particleColor || '#ffffff'}`;
        p.style.imageRendering = 'pixelated'; p.style.pointerEvents = 'none'; p.style.zIndex = '99';
        parent.appendChild(p);

        const angle = Math.random() * Math.PI * 2; const speed = Math.random() * 9 + 4; 
        particles.push({ element: p, x: centerX, y: centerY, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, opacity: 1.0 });
    }

    let pFrameCount = 0;
    const loop = setInterval(() => {
        pFrameCount++; let alive = false;
        particles.forEach(p => {
            if (p.opacity <= 0) return; alive = true;
            p.x += p.vx; p.y += p.vy; p.vy += 0.16; p.vx *= 0.97; p.opacity -= 0.022;
            p.element.style.left = `${p.x}px`; p.element.style.top = `${p.y}px`; p.element.style.opacity = p.opacity;
            p.element.style.transform = `scale(${p.opacity > 0 ? p.opacity : 0})`;
        });
        if (!alive || pFrameCount > 60) { clearInterval(loop); particles.forEach(p => p.element.remove()); }
    }, 16);
}

// ==========================================
// 🚀 4. ステージ進行・戦闘遷移
// ==========================================
function nextStage() {
    if (typeof playSE === "function") playSE('click'); 
    
    let targetIdx = (typeof curIdx !== 'undefined') ? curIdx : (window.curIdx !== undefined ? window.curIdx : -1);
    targetIdx++;
    if (typeof curIdx !== 'undefined') curIdx = targetIdx;
    window.curIdx = targetIdx;
    
    clearCrisisAlertEffects();
    
    if (typeof STAGES === 'undefined' || targetIdx >= STAGES.length || targetIdx < 0 || !STAGES[targetIdx]) { 
        resetGame(); hideAll(); 
        const scrStart = document.getElementById('scr-start');
        const fInd = document.getElementById('floor-indicator');
        if (scrStart) scrStart.style.display = 'block'; 
        if (fInd) fInd.style.visibility = 'hidden'; 
        startBGM("title"); 
        return;
    }
    
    const data = STAGES[targetIdx]; 
    window.pHp = 100; 
    hideAll(); 
    if (typeof stopSlimeAnimation === "function") stopSlimeAnimation();
    
    const fInd = document.getElementById('floor-indicator');
    if (fInd) { fInd.style.visibility = 'visible'; fInd.innerText = `${data.floor}階`; }
    
    const scrIntro = document.getElementById('scr-intro');
    if (scrIntro) scrIntro.style.display = 'block';
    
    const chNum = document.getElementById('intro-ch-num');
    const chTitle = document.getElementById('intro-ch-title');
    const introTxt = document.getElementById('intro-text');
    if (chNum) chNum.innerText = `FLOOR ${data.floor < 10 ? '0'+data.floor : data.floor}`; 
    if (chTitle) chTitle.innerText = data.name; 
    if (introTxt) introTxt.innerText = data.txt;
    stopBGM(); 
}

function startBattle() {
    if (typeof playSE === "function") playSE('click'); 
    let targetIdx = (typeof curIdx !== 'undefined') ? curIdx : (window.curIdx !== undefined ? window.curIdx : 0);
    if (typeof STAGES === 'undefined' || targetIdx < 0 || !STAGES[targetIdx]) return;
    
    const data = STAGES[targetIdx];
    window.eHp = window.eMaxHp = data.hp; 
    hideAll(); 
    window.isBusy = false; 
    window.isPlayerStunned = false;
    window.isAmuletActive = 0;
    
    clearCrisisAlertEffects(); 
    const itemB = document.getElementById('item-badge');
    if (itemB) itemB.style.display = "none";
    
    const container = document.getElementById('e-sprite-container'); 
    if (container) { 
        container.removeAttribute("style");
        container.style.animation = 'floatE 2.2s infinite alternate ease-in-out'; 
        container.style.width = '200px'; container.style.height = '200px'; container.style.display = 'flex';
        container.style.filter = `drop-shadow(0 0 25px ${data.glow})`; 
        container.style.opacity = '1'; container.style.transform = 'none';
    }
    
    const graphicEl = document.getElementById('e-sprite-graphic'); 
    if (graphicEl) { 
        graphicEl.removeAttribute("style"); 
        graphicEl.style.width = "200px"; graphicEl.style.height = "200px"; graphicEl.style.display = "block"; 
        if (data.type === "eyes") { graphicEl.style.transform = "scaleX(-1)"; } 
    }

    // 🧙‍♂️ 主人公ウィザードの浮遊状態を強制再適用して完全復活（透明化バグの根絶）
    const pContainer = document.getElementById('p-sprite-container');
    if (pContainer) {
        pContainer.removeAttribute("style");
        pContainer.style.width = '160px'; pContainer.style.height = '160px'; pContainer.style.display = 'flex';
        pContainer.style.animation = 'floatP 1.8s infinite alternate ease-in-out';
    }
    
    if (graphicEl && typeof MASTER_ANIM_MAP !== 'undefined' && MASTER_ANIM_MAP[data.type]) {
        graphicEl.src = MASTER_ANIM_MAP[data.type][0];
    }
    
    const scrBattle = document.getElementById('scr-battle');
    if (scrBattle) scrBattle.style.display = 'block';
    const eNameEl = document.getElementById('e-name');
    if (eNameEl) eNameEl.innerText = data.name;
    
    if (typeof startCustomAnimation === "function") startCustomAnimation(data.type); 
    updateHpUI(); 
    if (typeof checkDevPassword === "function") { try { checkDevPassword(); } catch(e){} }
    
    const logEl = document.getElementById('battle-log');
    if (logEl) logEl.innerHTML = `戦闘領域展開。${data.name}を駆逐せよ。 <span style='color:#38bdf8;'>[弱点: ${data.weak.toUpperCase()}]</span>`;
    startBGM("battle");
}

function updateHpUI() {
    let targetIdx = (typeof curIdx !== 'undefined') ? curIdx : (window.curIdx !== undefined ? window.curIdx : 0);
    const scr = document.getElementById('eff-scr'); 
    const alertBadge = document.getElementById('p-hp-alert-badge'); 
    if (!scr) return;
    
    let pPct = (window.pHp / 100) * 100; 
    let ePct = (window.eMaxHp > 0) ? (window.eHp / window.eMaxHp) * 100 : 0;
    
    const pHpBar = document.getElementById('p-hp-bar');
    const pHpBarB = document.getElementById('p-hp-bar-back');
    const eHpBar = document.getElementById('e-hp-bar');
    const eHpBarB = document.getElementById('e-hp-bar-back');
    const pHpTxt = document.getElementById('p-hp-txt');
    const eHpTxt = document.getElementById('e-hp-txt');
    
    if (pHpBar) pHpBar.style.width = `${pPct}%`;
    if (pHpBarB) pHpBarB.style.width = `${pPct}%`;
    if (eHpBar) eHpBar.style.width = `${ePct}%`; 
    if (eHpBarB) eHpBarB.style.width = `${ePct}%`;
    if (pHpTxt) pHpTxt.innerText = `HP: ${window.pHp} / 100`;
    if (eHpTxt) eHpTxt.innerText = `HP: ${window.eHp} / ${window.eMaxHp || 100}`;
    
    if (window.pHp <= 30 && window.pHp > 0) { 
        scr.style.animation = 'crisisAlert 1.0s infinite alternate';
        scr.style.borderColor = '#f43f5e'; 
        if (alertBadge) alertBadge.style.display = "block"; 
    } else { 
        scr.style.animation = 'none';
        if (typeof STAGES !== 'undefined' && STAGES[targetIdx]) {
            scr.style.borderColor = (STAGES[targetIdx].floor === 10) ? '#be123c' : '#334155'; 
        } else {
            scr.style.borderColor = '#334155';
        }
        if (alertBadge) alertBadge.style.display = "none";
    }
}

// ==========================================
// 🧙‍♂️ 5. プレイヤー行動戦闘ループ（★不発ガード完全撤去・開通）
// ==========================================
function turn(playerMove) {
    // ➔ 修正：STAGESオブジェクトの有無による、ボタン入力を不発にさせていたガード命令を完全撤去！
    if (window.isBusy || window.pHp <= 0 || window.eHp <= 0) return; 
    window.isBusy = true;
    
    if (window.isPlayerStunned) {
        window.isPlayerStunned = false; 
        document.getElementById('battle-log').innerHTML = "🚨 麻痺して動けない！"; 
        setTimeout(() => { enemyTurnAction(); }, 1200); 
        return;
    }
  
    // 外部環境（enemies.js）からインデックスを安全に取得
    let targetIdx = (typeof curIdx !== 'undefined') ? curIdx : (window.curIdx !== undefined ? window.curIdx : 0);
    let isCritical = false;
    
    if (typeof STAGES !== 'undefined' && STAGES[targetIdx]) {
        isCritical = (playerMove === STAGES[targetIdx].weak);
    }
    
    if (playerMove === 'debug_death') { 
        playSE('boom'); window.eHp = 0; updateHpUI(); 
        document.getElementById('battle-log').innerHTML = `☠ デスコード書き換え。`; 
        setTimeout(() => { checkBattleEnd(); }, 400); 
        return;
    }

    let calculatedDmg = Math.floor((playerMove === 'holy' ? 36 : 16) * (isCritical ? 2.3 : 1) * window.mana);
    executePlayerAttack(playerMove, isCritical, calculatedDmg);
}

function executePlayerAttack(playerMove, isCritical, calculatedDmg) {
    let targetIdx = (typeof curIdx !== 'undefined') ? curIdx : (window.curIdx !== undefined ? window.curIdx : 0);
    
    const effectLayer = document.getElementById('spell-effect-layer'); 
    const frontLayer = document.getElementById('front-effect-layer');
    const pContainer = document.getElementById('p-sprite-container'); 

    if (effectLayer) effectLayer.innerHTML = "";
    if (frontLayer) frontLayer.innerHTML = "";

    let spellName = playerMove === 'fire' ? "ファイア" : (playerMove === 'ice' ? "アイス" : "ホーリー"); 
    let flashColor = playerMove === 'fire' ? "#e11d48" : (playerMove === 'ice' ? "#0284c7" : "#eab308");
    
    let borderKillStyle = "position:absolute; image-rendering:pixelated; background-color:transparent !important; mix-blend-mode:plus-lighter !important; filter:contrast(130%) brightness(110%); pointer-events:none;";

    if (playerMove === 'ice') {
        if (effectLayer && typeof ANIMS_EFFECT_ICE !== 'undefined') {
            effectLayer.innerHTML = `
              <img src="${ANIMS_EFFECT_ICE[0]}" style="${borderKillStyle} width:50px; height:50px; left:410px; top:110px; animation:iceSurround1 0.35s ease-out forwards;">
              <img src="${ANIMS_EFFECT_ICE[0]}" style="${borderKillStyle} width:50px; height:50px; left:320px; top:240px; animation:iceSurround2 0.35s ease-out forwards;">
              <img src="${ANIMS_EFFECT_ICE[0]}" style="${borderKillStyle} width:50px; height:50px; left:430px; top:230px; animation:iceSurround3 0.35s ease-out forwards;">
            `;
        }
    } else if (playerMove === 'holy') {
        if (effectLayer && typeof MISSILE_EFFECTS !== 'undefined' && MISSILE_EFFECTS['holy']) {
            effectLayer.innerHTML = MISSILE_EFFECTS['holy'].replace(/style="/g, `style="mix-blend-mode:plus-lighter !important; filter:contrast(130%) brightness(110%); `);
        }
    } else {
        if (effectLayer && typeof MISSILE_EFFECTS !== 'undefined' && MISSILE_EFFECTS[playerMove]) {
            effectLayer.innerHTML = MISSILE_EFFECTS[playerMove];
        }
    }

    if (pContainer) pContainer.style.transform = 'translateX(45px) scale(1.08)'; 
    setTimeout(() => { 
        if (pContainer) {
            pContainer.style.transform = 'none'; 
            pContainer.style.animation = 'floatP 1.8s infinite alternate ease-in-out'; // アニメーションヘッドを確実に再結合
        }
    }, 350);
    
    setTimeout(() => {
        playSE(playerMove); 
        if (typeof burstSlimeAnimation === "function") burstSlimeAnimation(); 
        
        window.eHp = Math.max(0, window.eHp - calculatedDmg);
        const containerEl = document.getElementById('e-sprite-container');
        
        if (containerEl && frontLayer) {
            const parentRect = document.getElementById('eff-scr').getBoundingClientRect(); 
            const targetRect = containerEl.getBoundingClientRect(); 
            const relativeX = (targetRect.left - parentRect.left) + targetRect.width / 2; 
            const relativeY = (targetRect.top - parentRect.top) + targetRect.height / 2;
            const hitBox = document.createElement('div'); 
            hitBox.style.position = 'absolute'; hitBox.style.left = `${relativeX}px`; hitBox.style.top = `${relativeY}px`; hitBox.style.pointerEvents = 'none';
            hitBox.style.mixBlendMode = "plus-lighter"; hitBox.style.backgroundColor = "transparent";

            if (playerMove === 'ice' && typeof ANIMS_EFFECT_ICE !== 'undefined') {
                let iceFrame = 0; const iceImg = document.createElement('img'); iceImg.setAttribute("style", borderKillStyle);
                iceImg.style.width = '140px'; iceImg.style.height = '140px'; iceImg.style.transform = 'translate(-50%,-50%)';
                hitBox.appendChild(iceImg); frontLayer.appendChild(hitBox);
                const iceInterval = setInterval(() => { if (iceFrame >= ANIMS_EFFECT_ICE.length) { clearInterval(iceInterval); hitBox.remove(); } else { iceImg.src = ANIMS_EFFECT_ICE[iceFrame]; iceFrame++; } }, 45);
            } else if (playerMove === 'holy' && typeof ANIMS_EFFECT_CROSS !== 'undefined') {
                frontLayer.appendChild(hitBox);
                let holyStyleRandom = Math.floor(Math.random() * 4) + 1;
                if (holyStyleRandom === 1) {
                    let hFrame = 0; const holyImg = document.createElement('img'); holyImg.setAttribute("style", borderKillStyle);
                    holyImg.style.width = '130px'; holyImg.style.height = '130px'; holyImg.style.transform = 'translate(-50%,-50%)'; hitBox.appendChild(holyImg);
                    const hInterval = setInterval(() => { if (hFrame >= ANIMS_EFFECT_CROSS.length) { clearInterval(hInterval); hitBox.remove(); } else { holyImg.src = ANIMS_EFFECT_CROSS[hFrame]; hFrame++; } }, 65);
                } else if (holyStyleRandom === 2) {
                    hitBox.innerHTML = `<img src="${ANIMS_EFFECT_CROSS[0]}" style="${borderKillStyle} width:120px; height:120px; animation:holyThunder1 0.3s forwards;"><img src="${ANIMS_EFFECT_CROSS[1]}" style="${borderKillStyle} width:140px; height:140px; animation:holyThunder2 0.4s 0.1s forwards;"><img src="${ANIMS_EFFECT_CROSS[2]}" style="${borderKillStyle} width:160px; height:160px; animation:holyThunder3 0.5s 0.2s forwards;">`;
                    setTimeout(() => hitBox.remove(), 750);
                } else if (holyStyleRandom === 3) {
                    hitBox.innerHTML = `<img src="${ANIMS_EFFECT_CROSS[0]}" style="${borderKillStyle} width:60px; height:60px; animation:holy陣1 0.4s ease-out forwards;"><img src="${ANIMS_EFFECT_CROSS[1]}" style="${borderKillStyle} width:70px; height:70px; animation:holy陣2 0.4s ease-out forwards;"><img src="${ANIMS_EFFECT_CROSS[2]}" style="${borderKillStyle} width:80px; height:80px; animation:holy陣3 0.4s ease-out forwards;">`;
                    setTimeout(() => hitBox.remove(), 500);
                } else if (holyStyleRandom === 4) {
                    hitBox.innerHTML = `<img src="${ANIMS_EFFECT_CROSS[2]}" style="${borderKillStyle} width:100px; height:100px; animation:holyGodNova 0.6s cubic-bezier(0.1, 0.8, 0.3, 1) forwards;">`;
                    setTimeout(() => hitBox.remove(), 650);
                }
            } else {
                if (typeof HIT_LAND_EFFECTS !== 'undefined' && HIT_LAND_EFFECTS[playerMove]) hitBox.innerHTML = HIT_LAND_EFFECTS[playerMove];
                frontLayer.appendChild(hitBox);
                setTimeout(() => { hitBox.remove(); if (effectLayer) effectLayer.innerHTML = ""; }, 420);
            }
        }
        
        let enemyType = "slime";
        if (typeof STAGES !== 'undefined' && STAGES[targetIdx]) enemyType = STAGES[targetIdx].type;
        
        triggerEnemyHitPulse(isCritical, enemyType); 
        triggerShake(isCritical ? 'critical_shake' : 'attack_success');
        createDmgPop(calculatedDmg, isCritical, false); 
        if (isCritical) { flashCritical(flashColor); } else { flashScreen(flashColor); }
        updateHpUI();
        
        document.getElementById('battle-log').innerHTML = isCritical ? `💥 弱点適合！『${spellName}』直撃！【${calculatedDmg}】ダメージ！` : `『${spellName}』命中！敵に ${calculatedDmg} ダメージ！`;
          
        if (isCritical && window.eHp <= 0) {
            const darkLayer = document.getElementById('cutin-dark-layer');
            const cBar = document.getElementById('cutin-bar');
            if (darkLayer && cBar) {
                darkLayer.style.display = "block"; cBar.style.display = "flex";
                cBar.style.animation = "none"; void cBar.offsetWidth; 
                cBar.style.animation = "cutinSlide 1.0s ease-in-out forwards";
                setTimeout(() => { darkLayer.style.display = "none"; cBar.style.display = "none"; checkBattleEnd(); }, 1000);
                return;
            }
        }
        setTimeout(() => { checkBattleEnd() ? null : enemyTurnAction(); }, 600);
    }, 360);
    
    window.mana = 1.0; 
    const auraLayer = document.getElementById('p-aura-layer');
    const chgBadge = document.getElementById('charge-badge');
    if (auraLayer) auraLayer.style.display = "none"; 
    if (chgBadge) chgBadge.style.display = "none";
}

// ==========================================
// 👹 6. エネミーターンAI行動
// ==========================================
function enemyTurnAction(isPlayerDefending = false) {
    let targetIdx = (typeof curIdx !== 'undefined') ? curIdx : (window.curIdx !== undefined ? window.curIdx : 0);
    if (window.eHp <= 0 || window.pHp <= 0 || typeof STAGES === 'undefined' || targetIdx < 0 || !STAGES[targetIdx]) return;
    const data = STAGES[targetIdx];
    let isSpecial = (Math.random() < 0.36) && ['slime', 'spider', 'harpy', 'dragon'].includes(data.type);
    let pDamage = isPlayerDefending ? Math.max(1, Math.floor(data.atk * 0.12)) : data.atk;
    
    if (window.isAmuletActive > 0 && !isPlayerDefending) { 
        pDamage = Math.max(1, Math.floor(pDamage * 0.5));
    }
    const containerEl = document.getElementById('e-sprite-container'); 
    const effectLayer = document.getElementById('spell-effect-layer');
    
    if (isSpecial) {
        if (effectLayer && typeof ENEMY_MISSILE_EFFECTS !== 'undefined') effectLayer.innerHTML = ENEMY_MISSILE_EFFECTS[data.type];
        let specLog = "";
        if (data.type === 'slime') { pDamage = Math.floor(pDamage * 0.9); specLog = `🚨 ${data.name}の【溶解酸液】被弾！防御低下！`; }
        if (data.type === 'spider') { pDamage = 5; window.isPlayerStunned = true; specLog = `🚨 ${data.name}の【粘着拘束糸】被弾！次ターン【麻痺行動不能】！`; }
        if (data.type === 'harpy') { pDamage = Math.floor(pDamage * 1.1); specLog = `🚨 ${data.name}の【真空引き裂き刃】！【${pDamage}】被弾！`; }
        if (data.type === 'dragon') { pDamage = Math.floor(pDamage * 1.3); specLog = `🔥 黒竜激昂！【滅びのバーストブレス】！【${pDamage}】被弾！`; }
        
        setTimeout(() => {
            playSE('boom'); triggerShake('attack_success'); createDmgPop(pDamage, false, true);
            window.pHp = Math.max(0, window.pHp - pDamage); updateHpUI(); document.getElementById('battle-log').innerHTML = specLog;
            if (effectLayer) effectLayer.innerHTML = ""; postEnemyTurnCleanup();
        }, 400);
    } else {
        if (containerEl) { 
            containerEl.style.transform = 'translateX(0)'; containerEl.style.animation = 'none'; void containerEl.offsetWidth; 
            containerEl.style.animation = 'enemyAssault 0.45s forwards'; 
        }
        setTimeout(() => { if (containerEl) containerEl.style.animation = 'floatE 2.2s infinite alternate ease-in-out'; }, 460);
        setTimeout(() => {
            playSE('boom'); triggerShake('attack_success'); createDmgPop(pDamage, false, true); window.pHp = Math.max(0, window.pHp - pDamage); updateHpUI();
            document.getElementById('battle-log').innerHTML = isPlayerDefending ? `🛡 絶対障壁適応！被弾を【${pDamage}】に封滅！` : `${data.name}の突進体当たりを喰らい【${pDamage}】被弾！`;
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
    setTimeout(() => { checkBattleEnd(); }, 500);
}

// ==========================================
// 💥 7. 勝敗判定・ゲーム終了処理（粒子四散）
// ==========================================
function checkBattleEnd() {
    let targetIdx = (typeof curIdx !== 'undefined') ? curIdx : (window.curIdx !== undefined ? window.curIdx : 0);
    if (window.pHp <= 0 || window.eHp <= 0) return false;
    
    if (window.eHp <= 0) {
        stopBGM(); 
        if (typeof stopSlimeAnimation === "function") stopSlimeAnimation();
        playSE('boom'); triggerShake('critical_shake'); flashCritical('#ffffff');
        
        const containerEl = document.getElementById('e-sprite-container');
        let glowColor = "rgba(34,197,94,0.4)";
        if (typeof STAGES !== 'undefined' && STAGES[targetIdx]) glowColor = STAGES[targetIdx].glow;
        
        if (containerEl) { 
            containerEl.style.transition = 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'; 
            containerEl.style.transform = 'scale(0.01) rotate(180deg)'; 
            containerEl.style.opacity = '0';
            triggerParticle四散(containerEl, glowColor);
        }
        
        if (targetIdx === 0 || targetIdx === 3) { window.itemInventory.potion++; } 
        if (targetIdx === 1 || targetIdx === 5) { window.itemInventory.amulet++; }
        
        let delayTime = 800;
        if (typeof STAGES !== 'undefined' && STAGES[targetIdx] && STAGES[targetIdx].floor === 10) delayTime = 1400;
        setTimeout(() => { endBattle(); }, delayTime);
        return true;
    } else if (window.pHp <= 0) {
        stopBGM(); if (typeof stopSlimeAnimation === "function") stopSlimeAnimation();
        endBattle(); return true;
    }
    window.isBusy = false; return false;
}

function endBattle() {
    hideAll(); 
    if (typeof stopSlimeAnimation === "function") stopSlimeAnimation();
    clearCrisisAlertEffects(); 
    const scrResult = document.getElementById('scr-result');
    if (scrResult) scrResult.style.display = 'block';
    
    const rIcon = document.getElementById('res-icon'); 
    const rTitle = document.getElementById('res-title'); 
    const rText = document.getElementById('res-text'); 
    const rBtn = document.getElementById('res-btn');
    const auraLayer = document.getElementById('p-aura-layer');
    if (auraLayer) auraLayer.style.display = "none"; 
    document.getElementById('battle-log').innerHTML = "コマンドを選択せよ。";
    
    let targetIdx = (typeof curIdx !== 'undefined') ? curIdx : (window.curIdx !== undefined ? window.curIdx : 0);
    if (window.eHp <= 0) {
        if (typeof STAGES !== 'undefined' && targetIdx === STAGES.length - 1) {
            if (rIcon) rIcon.innerText = "👑"; if (rTitle) { rTitle.innerText = "GRAND END"; rTitle.style.color = '#eab308'; }
            if (rText) rText.innerText = "最上階に君臨せし黒竜は消滅し、世界を包んでいた暗黒の呪縛は完全に霧散した。新星術式を極めし賢者ウィザードの英知により、螺旋の塔へ永遠の平穏が取り戻される。戦いは終わり、英雄の叙事詩が今ここに完結した。あなたの勝利は歴史に永久に刻まれ、新たな光の時代が幕を開ける。平和の光とともに歩みを進めよ。";
            if (rBtn) rBtn.innerText = "タイトルに戻る";
            startBGM("grand_end"); 
        } else {
            if (rIcon) rIcon.innerText = "🏆"; if (rTitle) { rTitle.innerText = "VICTORY"; rTitle.style.color = '#10b981'; }
            let dLog = (targetIdx===0||targetIdx===3)?"➔ 戦利品【🧪回復薬】を獲得！":(targetIdx===1||targetIdx===5)?"➔ 戦利品【🧿お守り】を獲得！":"";
            let enemyName = (typeof STAGES !== 'undefined' && STAGES[targetIdx]) ? STAGES[targetIdx].name : "魔物";
            if (rText) rText.innerText = `激闘の末、立ちはだかる${enemyName}を完全に粉砕した！${dLog}`; 
            if (rBtn) rBtn.innerText = "次の階層へ進む";
            stopBGM();
        }
    } else { 
        if (rIcon) rIcon.innerText = "💀"; if (rTitle) { rTitle.innerText = "DEFEATED"; rTitle.style.color = '#f43f5e'; }
        let enemyName = (typeof STAGES !== 'undefined' && STAGES[targetIdx]) ? STAGES[targetIdx].name : "魔物";
        if (rText) rText.innerText = `${enemyName}に敗北した...`; 
        if (rBtn) rBtn.innerText = "タイトルに戻る"; 
        if (typeof curIdx !== 'undefined') curIdx = -1; window.curIdx = -1; 
        stopBGM(); 
    }
    window.isBusy = false;
}

function resetGame() { 
    window.pHp = 100; window.mana = 1.0; window.isBusy = false; 
    if (typeof curIdx !== 'undefined') curIdx = -1; window.curIdx = -1; 
    window.itemInventory = { potion: 1, amulet: 1 }; window.isAmuletActive = 0;
    document.getElementById('battle-log').innerHTML = "コマンドを選択せよ。"; 
    stopBGM(); if (typeof stopSlimeAnimation === "function") stopSlimeAnimation(); 
    clearCrisisAlertEffects(); 
}
// ==========================================
// 🕒 📦 END OF FILE - js/battle.js [Ver 1.4 最終確定版]
// ==========================================
