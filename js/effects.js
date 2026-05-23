// ==========================================
// ✨ 1. 固定エフェクトテンプレート定義（HTML文字列）
// ==========================================
const MISSILE_EFFECTS = {
    holy: `<div class="pulse-motion" style="width:200px; height:200px; background:rgba(250,204,21,0.2); border-radius:50%; --posX:400px; --posY:130px; --speed:0.5s; display:flex; align-items:center; justify-content:center; font-size:5rem;">✨</div>`
};

const ENEMY_MISSILE_EFFECTS = {
    slime: `<div style="position:absolute; width:35px; height:35px; background:#22c55e; border-radius:50%; left:400px; top:130px; animation:enemyMissile 0.45s forwards;"></div>`,
    spider: `<div style="position:absolute; width:50px; height:50px; border:2px dashed #e2e8f0; border-radius:50%; left:400px; top:130px; animation:enemyMissile 0.45s forwards;"></div>`,
    harpy: `<div style="position:absolute; width:80px; height:20px; background:rgba(255,255,255,0.6); left:400px; top:130px; animation:enemyMissile 0.4s forwards; transform:rotate(-15deg);"></div>`,
    golem: `<div style="position:absolute; width:60px; height:60px; background:#78350f; border-radius:12px; left:400px; top:130px; animation:enemyMissile 0.5s forwards;"></div>`,
    dragon: `<div style="position:absolute; width:120px; height:60px; background:linear-gradient(90deg,#ef4444,transparent); left:400px; top:130px; animation:enemyMissile 0.4s forwards; blur(5px);"></div>`
};

// ==========================================
// 🔮 2. プレイヤー呪文発動・演出制御マシン
// ==========================================

/**
 * プレイヤーが選択したコマンド（魔法・防御・チャージ）を処理するメイン関数
 */
function turn(playerMove) {
    if (isBusy || pHp <= 0 || eHp <= 0) return; 
    isBusy = true;
    
    if (isPlayerStunned) { 
        isPlayerStunned = false; 
        const logEl = document.getElementById('battle-log');
        if (logEl) logEl.innerText = "🚨 麻痺して動けない！"; 
        setTimeout(enemyTurnAction, 1000); 
        return; 
    }
    
    const data = STAGES[curIdx]; 
    let isCritical = (playerMove === data.weak);
    
    // デバッグコマンド
    if (playerMove === 'debug_death') { 
        eHp = 0; 
        updateHpUI(); 
        const logEl = document.getElementById('battle-log');
        if (logEl) logEl.innerText = "☠ デスコード起動。"; 
        setTimeout(checkBattleEnd, 500); 
        return; 
    }

    // ダメージ基本計算
    let dmg = Math.floor((playerMove === 'holy' ? 35 : 15) * (isCritical ? 2.2 : 1) * mana);
    if (isEnemyShieldActive) dmg = Math.floor(dmg * 0.25);

    const effLayer = document.getElementById('spell-effect-layer');
    if (effLayer) effLayer.innerHTML = ""; 
    isEnemyShieldActive = false;

    try {
        // 🔥 ファイア発動演出
        if (playerMove === 'fire') {
            if (effLayer) effLayer.innerHTML = `<div style="position:absolute; width:55px; height:55px; background:radial-gradient(circle, #facc15 10%, #f97316 50%, #ef4444 100%); border-radius:50%; box-shadow:0 0 35px #f97316, 0 0 60px #ef4444; animation: fireMissile 0.4s cubic-bezier(0.25, 1, 0.5, 1) forwards;"></div>`;
            setTimeout(() => { 
                playSE(SOUND_FIRE); 
                if (effLayer) effLayer.innerHTML = `<div id="pillar-of-fire" style="position:absolute; width:160px; height:320px; right:40px; bottom:20px; background:linear-gradient(to top, #ef4444 0%, #f97316 40%, #facc15 80%, transparent 100%); border-radius:50px 50px 0 0; animation: firePillarGlow 0.6s ease-out forwards; pointer-events:none; z-index:11;"></div>`;
            }, 400);
        } 
        // ❄️ アイス発動演出（フェードイン・アウト安全版）
        else if (playerMove === 'ice') {
            if (effLayer) {
                effLayer.innerHTML = `<img id="ice-anim-sprite" style="position:absolute; width:200px; height:200px; right:30px; top:80px; object-fit:contain; image-rendering:pixelated; mix-blend-mode:screen !important; background:transparent !important; transition: opacity 0.12s ease-in-out; opacity: 0; pointer-events:none; z-index:10;">`;
                setTimeout(() => {
                    const iceImg = document.getElementById("ice-anim-sprite");
                    let frame = 0;
                    function playIceFrame() {
                        if (frame < ANIMS_EFFECT_ICE.length) {
                            if (iceImg) {
                                iceImg.src = ANIMS_EFFECT_ICE[frame];
                                if (frame <= 1) iceImg.style.opacity = (frame + 1) * 0.5; 
                                else if (frame >= 6) iceImg.style.opacity = (8 - frame) * 0.5; 
                                else iceImg.style.opacity = 1;
                            }
                            frame++;
                            setTimeout(playIceFrame, 55); 
                        }
                    }
                    playIceFrame();
                }, 10);
            }
            setTimeout(() => { playSE(SOUND_ICE); }, 400);
        } 
        // ✨ ホーリー発動演出
        else if (playerMove === 'holy') {
            if (effLayer) effLayer.innerHTML = MISSILE_EFFECTS.holy;
            setTimeout(() => { playSE(SOUND_HOLY); }, 400);
        } 
        // 🛡️ シールド防御処理
        else if (playerMove === 'def') {
            const logEl = document.getElementById('battle-log');
            if (logEl) logEl.innerText = "🛡 シールドを展開！防御姿勢をとった。";
            mana = 1.0; 
            const badge = document.getElementById('charge-badge');
            if (badge) badge.style.display = "none";
            setTimeout(() => { enemyTurnAction(true); }, 800); 
            return;
        } 
        // ⚡ 魔力チャージ処理
        else if (playerMove === 'chg') {
            mana = 2.5; 
            const badge = document.getElementById('charge-badge');
            if (badge) badge.style.display = "block"; 
            const logEl = document.getElementById('battle-log');
            if (logEl) logEl.innerText = "⚡ パワーをチャージした！次回威力2.5倍！";
            setTimeout(() => { enemyTurnAction(false); }, 800); 
            return;
        }
    } catch(e) {
        console.error("Effect Playback Safety Catch:", e);
    }

    // ダメージ確定とログ出力のタイムライン制御
    setTimeout(() => {
        eHp = Math.max(0, eHp - dmg); 
        updateHpUI(); 
        createDmgPop(dmg, false);
        
        const logEl = document.getElementById('battle-log');
        if (logEl) logEl.innerText = isCritical ? `💥 弱点直撃！敵に ${dmg} ダメージ！` : `敵に ${dmg} ダメージ！`;
        
        mana = 1.0; 
        const badge = document.getElementById('charge-badge');
        if (badge) badge.style.display = "none";
        
        setTimeout(() => { if (!checkBattleEnd()) enemyTurnAction(); }, 800);
    }, 400);
}

// ==========================================
// 👹 3. エネミー行動・ターン終了処理
// ==========================================

/**
 * 敵のAI行動（突進または各魔物の特殊スキル）を実行する関数
 */
function enemyTurnAction(isPlayerDefending = false) {
    if (eHp <= 0 || pHp <= 0) { isBusy = false; return; } 
    const data = STAGES[curIdx];
    let isSpecial = (Math.random() < 0.4);
    
    // 防御時は被ダメージを15%に軽減
    let dmg = isPlayerDefending ? Math.max(1, Math.floor(data.atk * 0.15)) : data.atk;
    dmg = Math.floor(dmg * enemyMana); 
    enemyMana = 1.0;
    
    // お守り結界時はダメージ半減
    if (isAmuletActive > 0 && !isPlayerDefending) dmg = Math.floor(dmg * 0.5);

    const effLayer = document.getElementById('spell-effect-layer'); 
    if (effLayer) effLayer.innerHTML = "";

    const logEl = document.getElementById('battle-log');

    if (isSpecial) {
        playSE(SOUND_HOLY);
        if (data.type === 'skelton') {
            isEnemyShieldActive = true; 
            if (logEl) logEl.innerText = `🛡️ ${data.name}は骨盾を構えた！次の被ダメを大幅カット！`;
            postEnemyTurnCleanup(); 
            return;
        }
        if (data.type === 'gargoil') {
            enemyMana = 2.0; 
            if (logEl) logEl.innerText = `⚡ ${data.name}は魔力を集約！次回の攻撃力2倍！`;
            postEnemyTurnCleanup(); 
            return;
        }
        // 特殊弾幕エフェクトの射出
        if (['slime', 'spider', 'harpy', 'dragon', 'golem'].includes(data.type)) {
            if (effLayer) effLayer.innerHTML = ENEMY_MISSILE_EFFECTS[data.type] || "";
        } else {
            if (effLayer) effLayer.innerHTML = `<div style="position:absolute; width:120px; height:120px; border-radius:50%; background:rgba(168,85,247,0.5); left:100px; top:120px; animation:stalkPulse 0.5s forwards; filter:blur(10px); mix-blend-mode:screen !important;"></div>`;
        }
        if (data.type === 'spider') isPlayerStunned = true;
        if (logEl) logEl.innerText = `🚨 ${data.name}の特殊攻撃を被弾！【${dmg}】ダメージ！`;
    } else {
        // 通常突進攻撃
        setTimeout(() => { playSE(SOUND_FIRE); }, 200);
        const eContainer = document.getElementById('e-sprite-container');
        if (eContainer) {
            eContainer.style.setProperty('--assaultX', '-140px');
            eContainer.style.animation = "enemyAssault 0.45s forwards";
        }
        setTimeout(() => { if (eContainer) eContainer.style.animation = "floatE 2.2s infinite alternate ease-in-out"; }, 460);
        if (logEl) logEl.innerText = `${data.name}の突進攻撃！【${dmg}】ダメージ！`;
    }

    pHp = Math.max(0, pHp - dmg); 
    updateHpUI(); 
    createDmgPop(dmg, true);
    postEnemyTurnCleanup();
}

/**
 * 敵のターン終了時に状態バフのカウントダウンを行い、プレイヤーへ権限を戻す関数
 */
function postEnemyTurnCleanup() {
    if (isAmuletActive > 0) { 
        isAmuletActive--; 
        if (isAmuletActive <= 0) {
            const badge = document.getElementById('item-badge');
            if (badge) badge.style.display = "none"; 
        }
    }
    setTimeout(() => { 
        if (!checkBattleEnd()) { 
            isBusy = false; 
            const logEl = document.getElementById('battle-log');
            if (logEl) logEl.innerText = "コマンドを選択せよ。"; 
        } 
    }, 800);
}
