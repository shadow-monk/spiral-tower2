// ==========================================
// 🕒 🔄 更新検知・タイムスタンプ刻印システム
// ==========================================
console.log("%c🔄 [BATTLE SYSTEMS] Ver 11.00: 全24呪文対応 ＆ 新・ライトニング(防御無視/会心35%) ＆ 複数弱点・複数耐性(0ダメ演出ログ) ＆ 4大エネミー特殊技ダメージ・吸血点火 最終完成神コード。", "color: #00ffff; font-weight: bold;");

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

// 🧪 敵側の状態異常永続カウンターの一括設置
window.enemyBurnTurns = 0;   // 🔥火傷カウンター
window.enemyFreezeTurns = 0; // ❄️凍結カウンター
window.enemyBlindTurns = 0;  // ✨暗闇カウンター

// アイテムバッグ初期化
window.itemInventory = { 
    potion: 9, amulet: 9, elix: 9, bomb: 9, cure: 9, hour: 9, whet: 9, mirr: 9, mana: 9, scro: 9, smok: 9,
    wing: 9, web: 9, bone: 9, ston: 9, cand: 9, jewe: 9, hone: 9, spor: 9, scal: 9
};
window.isAmuletActive = 0;

// 状態異常・特殊効果用追加フラグの一括管理
window.isPlayerStunned = false;       
window.isPlayerCorroded = false;     
window.isHarpySpeedActive = false;   
window.isPlayerMuted = false;        
window.isItemBlocked = false;        

// ⚡ ボタン送り用の戦術ステートチケット管理
window.battleStepState = 'NONE';
window.nextTurnIsEnemySpecial = false; 

// ⚡ タイマーID管理
window._activeMagicTimeout = null;
window._logResetTimeout = null;       
window._freezeAnimationTimeout = null; // ❄️アイス・スリープ・麻痺時空停止用

// ==========================================
// 🕹️ ①【画面どこでもクリック進行】コマンドウィンドウ含む全域対応拡張
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    const fullClickTargets = ['#sq-board', '#cmd-panel', '#battle-log', 'body'];
    
    fullClickTargets.forEach(selector => {
        const element = document.getElementById(selector.replace('#','')) || document.querySelector(selector);
        if (element) {
            element.addEventListener("click", (e) => {
                if (e.target.closest('button')) return;
                if (window.battleStepState !== 'NONE') {
                    window.advanceBattleStep();
                }
            });
        }
    });
    
    window.injectStatusHeaderContainers();
});

/**
 * 📊 最新CSS（#status-badge-header）と完全有線連動させる動的コンテナ構築回路
 */
window.injectStatusHeaderContainers = function() {
    const effScr = document.getElementById('eff-scr');
    if (effScr && !document.getElementById('status-badge-header')) {
        const header = document.createElement('div');
        header.id = 'status-badge-header';
        header.style.cssText = "position:absolute; top:5px; left:0; width:100%; padding:0 10px; box-sizing:border-box; display:flex; justify-content:space-between; z-index:999; pointer-events:none;";
        
        const pRow = document.createElement('div');
        pRow.id = 'player-status-row';
        pRow.className = 'status-row-p';
        
        const eRow = document.createElement('div');
        eRow.id = 'enemy-status-row';
        eRow.className = 'status-row-e';
        
        header.appendChild(pRow);
        header.appendChild(eRow);
        effScr.appendChild(header);
    }
};

/**
 * 🏆 【１】効果ラベル：全12種類のフラグを戦闘画面最上部に左右セパレート配置させるUI制御回路
 */
window.updateStatusBadgesUI = function() {
    window.injectStatusHeaderContainers(); 
    const pRow = document.getElementById('player-status-row');
    const eRow = document.getElementById('enemy-status-row');
    
    if (pRow) {
        pRow.innerHTML = ""; 
        if (window.isPlayerStunned)  pRow.innerHTML += `<span class="retro-status-tag" style="background:#ef4444; color:#fff;">☠️ 麻痺</span>`;
        if (window.isPlayerMuted)    pRow.innerHTML += `<span class="retro-status-tag" style="background:#a855f7; color:#fff;">🚨 封印</span>`;
        if (window.isPlayerCorroded) pRow.innerHTML += `<span class="retro-status-tag" style="background:#eab308; color:#000;">🧪 溶解</span>`;
        if (window.isItemBlocked)    pRow.innerHTML += `<span class="retro-status-tag" style="background:#6b7280; color:#fff;">🎒 呪い</span>`;
        if (window.isAmuletActive > 0) pRow.innerHTML += `<span class="retro-status-tag" style="background:#10b981; color:#fff;">🛡️ お守り:${window.isAmuletActive}T</span>`;
        if (window.mana > 1.0)       pRow.innerHTML += `<span class="retro-status-tag" style="background:#3b82f6; color:#fff; box-shadow:0 0 10px #3b82f6;">⚡ 集中</span>`;
    }
    
    if (eRow) {
        eRow.innerHTML = "";
        if (window.enemyBurnTurns > 0)   eRow.innerHTML += `<span class="retro-status-tag" style="background:#f97316; color:#fff;">🔥 火傷:${window.enemyBurnTurns}T</span>`;
        if (window.enemyFreezeTurns > 0) eRow.innerHTML += `<span class="retro-status-tag" style="background:#0ea5e9; color:#fff; box-shadow:0 0 10px #0ea5e9;">❄️ 凍結:${window.enemyFreezeTurns}T</span>`;
        if (window.enemyBlindTurns > 0)  eRow.innerHTML += `<span class="retro-status-tag" style="background:#65a30d; color:#fff;">✨ 暗闇:${window.enemyBlindTurns}T</span>`;
        if (window.isEnemyShieldActive)  eRow.innerHTML += `<span class="retro-status-tag" style="background:#dc2626; color:#fff; border:1px solid #fff;">🛡️ 骨盾</span>`;
        if (window.enemyMana > 1.0)      eRow.innerHTML += `<span class="retro-status-tag" style="background:#b91c1c; color:#fff; font-style:italic;">⚡ 暴走</span>`;
        if (window.isHarpySpeedActive)   eRow.innerHTML += `<span class="retro-status-tag" style="background:#06b6d4; color:#fff;">🌀 鈍足</span>`;
    }
};

window.advanceBattleStep = function() {
    if (window.battleStepState === 'PLAYER_DONE') {
        window.battleStepState = 'NONE';
        if (!window.checkBattleEnd()) {
            window.enemyTurnAction(); 
        }
    } else if (window.battleStepState === 'ENEMY_DONE') {
        window.battleStepState = 'NONE';
        if (!window.checkBattleEnd()) {
            window.isBusy = false;
            const battleLog = document.getElementById('battle-log');
            if (battleLog) battleLog.innerHTML = "コマンドを選択せよ。";
            const effScr = document.getElementById('eff-scr');
            if (effScr) effScr.style.pointerEvents = "none";
            window.updateStatusBadgesUI();
        }
    }
};

// ==========================================
// 🚀 2. ステージ・戦闘遷移 
// ==========================================
window.nextStage = function() {
    if (typeof closeMagicBag === 'function') closeMagicBag();
    if (typeof closeItemBag === 'function') closeItemBag();
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

window.startBattle = function() {
    const data = STAGES[window.curIdx];
    
    window.isBusy = false; 
    window.battleStepState = 'NONE';
    window.isPlayerStunned = false;
    window.isPlayerCorroded = false;
    window.isHarpySpeedActive = false;
    window.isPlayerMuted = false;
    window.isItemBlocked = false;
    
    window.enemyBurnTurns = 0;
    window.enemyFreezeTurns = 0;
    window.enemyBlindTurns = 0;
    
    window.isAmuletActive = 0;
    window.enemyMana = 1.0;
    window.isEnemyShieldActive = false;
    window.eHp = window.eMaxHp = data.hp;

    if (window._activeMagicTimeout) { clearTimeout(window._activeMagicTimeout); window._activeMagicTimeout = null; }
    if (window._logResetTimeout) { clearTimeout(window._logResetTimeout); window._logResetTimeout = null; }
    if (window._freezeAnimationTimeout) { clearTimeout(window._freezeAnimationTimeout); window._freezeAnimationTimeout = null; }

    const eContainer = document.getElementById('e-sprite-container');
    const eSpriteGraphic = document.getElementById('e-sprite-graphic');
    
    if (eContainer) {
        eContainer.style.opacity = "1";
        eContainer.style.transform = "scale(1)";
        eContainer.style.background = "none";
        eContainer.style.removeProperty("filter"); 
        eContainer.style.transition = "none"; 
        eContainer.style.removeProperty("animation-play-state"); 
        
        if (window.curIdx >= 10) {
            eContainer.style.animation = "floatE 0.13s infinite alternate ease-in-out, playerStunShake 0.25s infinite alternate"; 
        } else {
            eContainer.style.animation = "floatE 2.2s infinite alternate ease-in-out"; 
        }
        
        if (data.type === 'slime') {
            eContainer.style.setProperty("filter", "hue-rotate(65deg) saturate(2.5) brightness(1.2)", "important");
        }
        
        if (window.curIdx >= 10) {
            let hueRotateDeg = (window.curIdx * 45) % 360;
            eContainer.style.setProperty("filter", `hue-rotate(${hueRotateDeg}deg) saturate(2) brightness(1.15)`, "important");
        }
    }
    if (eSpriteGraphic) {
        eSpriteGraphic.style.removeProperty("filter");
    }

    const pGraphic = document.getElementById('p-sprite-graphic');
    if (pGraphic) {
        pGraphic.src = './assets/enemies/player/player_wizard.png';
    }

    const eName = document.getElementById('e-name');
    const effScr = document.getElementById('eff-scr');
    const cutin = document.getElementById('cutin-bar');

    if (cutin) cutin.style.display = "none";
    if (eName) eName.innerText = data.name;

    if (eSpriteGraphic && MASTER_ANIM_MAP[data.type]) {
        let rawUrl = MASTER_ANIM_MAP[data.type][0];
        let cleanUrl = rawUrl.replace(/^\.\//, '').replace(/^\//, '').replace(/^spiral-tower2\//, '');
        eSpriteGraphic.src = './' + cleanUrl;
    }

    showScreen('scr-battle');
    window.updateStatusBadgesUI(); 

    if (typeof startCustomAnimation === 'function') {
        startCustomAnimation(data.type);
    }
    
    if (typeof updateHpUI === 'function') {
        updateHpUI();
    }

    if (effScr) {
        effScr.style.pointerEvents = "none";
        effScr.className = (data.type === 'slime') ? "anim-slime-yellow" : "";
    }

    startBGM("battle");

    const battleLog = document.getElementById('battle-log');
    if (battleLog) {
        let currentDisplayWeak = Array.isArray(data.weak) ? data.weak.join(', ').toUpperCase() : data.weak.toUpperCase();
        let suffix = (window.curIdx >= 10) ? " (😈裏タワー解放：弱点【シークレット】特殊2個ドッキングAI)" : ` 弱点: ${currentDisplayWeak || "なし"}`;
        battleLog.innerHTML = `${data.name}が現れた！${suffix}`;
    }
};

// ==========================================
// 🎒 3. 大容量アイテム使用 
// ==========================================
window.useItem = function(itemType) {
    if (window.isBusy || window.pHp <= 0 || window.eHp <= 0 || window.itemInventory[itemType] <= 0) return;
    
    if (window.isItemBlocked) {
        const battleLog = document.getElementById('battle-log');
        if (battleLog) battleLog.innerHTML = "🚨 呪いでアイテムバッグが石化していて開けない！ <span>▶</span>";
        return;
    }

    window.isBusy = true;
    window.itemInventory[itemType]--;
    if (typeof closeItemBag === 'function') closeItemBag();

    const battleLog = document.getElementById('battle-log');
    const effScr = document.getElementById('eff-scr');
    const data = STAGES[window.curIdx];

    if (itemType === 'potion') {
        window.pHp = Math.min(window.pMaxHp, window.pHp + 50);
        playSE(SOUND_HOLY);
        if (effScr) { effScr.className = "anim-player-wisp"; setTimeout(() => { effScr.className = ""; }, 600); }
        battleLog.innerHTML = "🧪 回復薬を取り出して一気に飲み干した！傷口が光の粒子で塞がり、HPが50回復する！ <span>▶</span>";
    } else if (itemType === 'amulet') {
        window.isAmuletActive = 3;
        playSE(SOUND_HOLY);
        if (effScr) { effScr.className = "anim-player-refl"; setTimeout(() => { effScr.className = ""; }, 1100); }
        battleLog.innerHTML = "🧿 古びたお守りを強く握りしめた！円形の魔導鏡結界が身体を包み込み、3ターンの間被ダメージを半減する！ <span>▶</span>";
    } else if (itemType === 'elix') {
        window.pHp = window.pMaxHp;
        window.isPlayerMuted = false; window.isPlayerStunned = false;
        playSE(SOUND_HOLY);
        if (effScr) { effScr.className = "anim-player-chg"; setTimeout(() => { effScr.className = ""; }, 1100); }
        battleLog.innerHTML = "🧪 伝説の至高薬エリクサーの雫を垂らした！まばゆいオーラが脈動し、HPと全ての呪いが全回復した！ <span>▶</span>";
    } else if (itemType === 'bomb') {
        window.eHp = Math.max(0, window.eHp - 30);
        playSE(SOUND_FIRE);
        if (effScr) { effScr.className = "anim-player-fire"; setTimeout(() => { effScr.className = ""; }, 600); }
        battleLog.innerHTML = "💣 魔導手榴弾のピンを抜いて投げつけた！敵の懐で大爆発を起こし、固定30ダメージ！ <span>▶</span>";
    } else if (itemType === 'cure') {
        window.isPlayerCorroded = false; window.isPlayerStunned = false; window.pHp = Math.min(window.pMaxHp, window.pHp + 10);
        playSE(SOUND_HOLY);
        battleLog.innerHTML = "🧪 七色の薬草を調合した万能薬を服用した！身体の毒や麻痺が瞬時に消滅していく！ <span>▶</span>";
    } else if (itemType === 'hour') {
        playSE(SOUND_ICE);
        if (effScr) { effScr.className = "anim-player-slow"; setTimeout(() => { effScr.className = ""; }, 600); }
        battleLog.innerHTML = "⏳ 時の砂時計を静かにひっくり返した！流れる砂が因果を遅らせ、敵の行動を2ターン分遅延させる！ <span>▶</span>";
    } else if (itemType === 'whet') {
        playSE(SOUND_KICK);
        battleLog.innerHTML = "🗡️ 無骨な研ぎ石で魔導杖の先端を鋭く研ぎ澄ました！2ターンの間、物理・素材系攻撃の威力が1.5倍に！ <span>▶</span>";
    } else if (itemType === 'mirr') {
        playSE(SOUND_HOLY);
        if (effScr) { effScr.className = "anim-player-refl"; setTimeout(() => { effScr.className = ""; }, 1100); }
        battleLog.innerHTML = "🪞 魔力を帯びた鏡の破片を前に突き出した！1ターンの間、敵が放つ状態異常魔法を100%オウム返しする！ <span>▶</span>";
    } else if (itemType === 'mana') {
        window.mana = 2.5;
        playSE(SOUND_HOLY);
        if (effScr) { effScr.className = "anim-player-chg"; setTimeout(() => { effScr.className = ""; }, 1100); }
        battleLog.innerHTML = "🧪 透き通った魔力の雫を飲み干した！瞑想なしで、次回の呪文威力を強制的に2.5倍モードに変形！ <span>▶</span>";
    } else if (itemType === 'scro') {
        playSE(SOUND_HOLY);
        if (effScr) { effScr.className = "anim-player-anal"; setTimeout(() => { effScr.className = ""; }, 600); }
        battleLog.innerHTML = `📜 古文書の記述をハキハキと解読した！アナライズが走り、敵の正確な残りHPは [ ${window.eHp} ] だ！ <span>▶</span>`;
    } else if (itemType === 'smok') {
        playSE(SOUND_ICE);
        battleLog.innerHTML = "🌀 足元へ煙幕弾を叩きつけた！凄まじい黒煙が敵の視界を遮り、次の敵の攻撃を100%不発（MISS）にする！ <span>▶</span>";
    } 
    else if (itemType === 'wing') {
        window.eHp = Math.max(0, window.eHp - 20);
        playSE(SOUND_FIRE);
        if (effScr) { effScr.className = "anim-player-aero"; setTimeout(() => { effScr.className = ""; }, 600); }
        battleLog.innerHTML = "🪶 ハーピーの羽根を投げた。鋭い風切り羽が相手の肉体に突き刺さる！ <span>▶</span>";
    } else if (itemType === 'bone') {
        playSE(SOUND_KICK);
        battleLog.innerHTML = "🦴 骸骨の骨を地面に放り投げた。……特に何も起きない。（動物や犬系なら気を取られたかもしれない） <span>▶</span>";
    } else if (itemType === 'web') {
        window.enemyFreezeTurns = 1;
        playSE(SOUND_ICE);
        if (effScr) { effScr.className = "anim-player-slow"; setTimeout(() => { effScr.className = ""; }, 600); }
        battleLog.innerHTML = "🕸️ ブラッドスパイダーの糸を投げつけた！強靭な粘着糸が敵の足元をガチガチに絡め取る！ <span>▶</span>";
    } else if (itemType === 'ston') {
        window.isEnemyShieldActive = false; window.eHp = Math.max(0, window.eHp - 25);
        playSE(SOUND_KICK);
        if (effScr) { effScr.className = "anim-player-quak"; setTimeout(() => { effScr.className = ""; }, 600); }
        battleLog.innerHTML = "🪨 ゴーレムの頑強な石を投げつけた！敵の張っている防御結界を木っ端微塵に粉砕！ <span>▶</span>";
    } else if (itemType === 'cand') {
        window.isPlayerStunned = false; window.isPlayerMuted = false;
        playSE(SOUND_HOLY);
        battleLog.innerHTML = "🕯️ 不気味に燃えるファントムの蝋燭を点した。立ち上る紫煙が、我が身の呪いを焼き尽くす！ <span>▶</span>";
    } else if (itemType === 'jewe') {
        window.isPlayerMuted = false; window.mana = 2.5;
        playSE(SOUND_HOLY);
        battleLog.innerHTML = "💎 エビルアイの目玉の宝石を掲げた！邪眼の魔力が反転し、己の魔力を暴発させる！ <span>▶</span>";
    } else if (itemType === 'hone') {
        window.isPlayerCorroded = false; window.pHp = Math.min(window.pMaxHp, window.pHp + 30);
        playSE(SOUND_HOLY);
        battleLog.innerHTML = "🍯 ヘドロスライムから採れた黄金の蜜を飲み干した！ドロッとした溶解液が綺麗に洗い流される！ <span>▶</span>";
    } else if (itemType === 'spor') {
        window.enemyFreezeTurns = 2;
        playSE(SOUND_ICE);
        battleLog.innerHTML = "🍄 マイコニドの幻覚胞子をばら撒いた！妖しい粉煙が敵の五感を狂わせる！ <span>▶</span>";
    } else if (itemType === 'scal') {
        window.eHp = Math.max(0, window.eHp - 50);
        playSE(SOUND_FIRE);
        if (effScr) { effScr.className = "anim-player-mete"; setTimeout(() => { effScr.className = ""; }, 600); }
        battleLog.innerHTML = "🐉 カリスドラゴンの逆鱗を激しく激昂させた！怒りの爆炎が戦場全てを焼き尽くす！ <span>▶</span>";
    }

    if (typeof updateHpUI === 'function') updateHpUI();
    window.updateStatusBadgesUI();
    window.battleStepState = 'PLAYER_DONE';
};

// ==========================================
// 🧙‍♂️ 4. プレイヤー魔導アクション 
// ==========================================
window.turn = function(playerMove) {
    if (playerMove === 'debug_death') {
        window.isBusy = false; 
        window.eHp = 0;
        if (typeof updateHpUI === 'function') updateHpUI();
        window.checkBattleEnd();
        return;
    }

    if (window.isBusy || window.pHp <= 0 || window.eHp <= 0) return;

    // 全24呪文対応。ライトニング（ele）も詠唱制限（封印）の配列網にドッキング完了！
    if (window.isPlayerMuted && ['fire','ice','holy','wasp','scre','refl','wisp','mmis','scis','flas','drai','slow','flod','bio','quak','slee','dead','mete','aero','come','grav','anal','ulti','ele'].includes(playerMove)) {
        const battleLog = document.getElementById('battle-log');
        if (battleLog) battleLog.innerHTML = "🚨 魔力封印により、呪文が唱えられない！ <span>▶</span>";
        if (typeof closeMagicBag === 'function') closeMagicBag();
        return;
    }

    window.isBusy = true;
    if (typeof closeMagicBag === 'function') closeMagicBag(); 

    if (window._activeMagicTimeout) { clearTimeout(window._activeMagicTimeout); }

    if (window.isPlayerStunned) {
        window.isPlayerStunned = false;
        const battleLog = document.getElementById('battle-log');
        if (battleLog) battleLog.innerHTML = "🚨 麻痺して動けない！ <span>▶</span>";
        window.battleStepState = 'PLAYER_DONE';
        return;
    }

    const data = STAGES[window.curIdx];
    let basePower = 15;
    let spellLabel = "魔導魔法";
    let magicClass = "anim-player-fire";
    let currentSE = SOUND_FIRE;

    // ⚡ 24番目の新呪文「ライトニング（ele）」の基本スペックをネイティブ配置！
    const spellSpecs = {
        fire: { pow: 15, label: "ファイア", se: SOUND_FIRE, cls: "anim-player-fire" },
        ice:  { pow: 15, label: "アイス", se: SOUND_ICE, cls: "anim-player-ice" },
        holy: { pow: 35, label: "ホーリー", se: SOUND_HOLY, cls: "anim-player-holy" },
        wasp: { pow: 18, label: "ワスプ", se: SOUND_FIRE, cls: "anim-player-wasp" },
        scre: { pow: 1,  label: "スクリーム", se: SOUND_ICE, cls: "anim-player-scre" },
        refl: { pow: 0,  label: "リフレク", se: SOUND_HOLY, cls: "anim-player-refl" },
        wisp: { pow: 20, label: "ウィスプ", se: SOUND_HOLY, cls: "anim-player-wisp" },
        mmis: { pow: 20, label: "Ｍミサイル", se: SOUND_FIRE, cls: "anim-player-mmis" },
        scis: { pow: 12, label: "シザース", se: SOUND_KICK, cls: "anim-player-scis" },
        flas: { pow: 0,  label: "フラッシュ", se: SOUND_HOLY, cls: "anim-player-flas" },
        drai: { pow: 20, label: "ドレイン", se: SOUND_ICE, cls: "anim-player-drai" },
        slow: { pow: 10, label: "スロウ", se: SOUND_ICE, cls: "anim-player-slow" },
        flod: { pow: 22, label: "フラッド", se: SOUND_FIRE, cls: "anim-player-flod" },
        bio:  { pow: 14, label: "バイオ", se: SOUND_ICE, cls: "anim-player-bio" },
        quak: { pow: 30, label: "クエイク", se: SOUND_KICK, cls: "anim-player-quak" },
        slee: { pow: 0,  label: "スリープ", se: SOUND_ICE, cls: "anim-player-slee" },
        dead: { pow: 5,  label: "デス", se: SOUND_KICK, cls: "anim-player-dead" },
        mete: { pow: 55, label: "メテオ", se: SOUND_FIRE, cls: "anim-player-mete" },
        aero: { pow: 18, label: "エアロ", se: SOUND_FIRE, cls: "anim-player-aero" },
        come: { pow: Math.floor(Math.random() * 51) + 10, label: "コメット", se: SOUND_HOLY, cls: "anim-player-come" },
        grav: { pow: 25, label: "グラビデ", se: SOUND_KICK, cls: "anim-player-grav" },
        anal: { pow: 0,  label: "アナライズ", se: SOUND_HOLY, cls: "anim-player-anal" },
        ulti: { pow: 50, label: "アルテマ", se: SOUND_HOLY, cls: "anim-player-ulti" },
        ele:  { pow: 17, label: "ライトニング", se: SOUND_FIRE, cls: "anim-player-ele" } // ⚡ライトニング追加
    };

    if (playerMove === 'def') {
        const battleLog = document.getElementById('battle-log');
        if (battleLog) battleLog.innerHTML = "🛡 シールドを展開！魔力を練りながら完璧な防御姿勢をとった。 <span>▶</span>";
        window.mana = 1.0;
        const effScr = document.getElementById('eff-scr');
        if (effScr) { effScr.className = "anim-player-def"; setTimeout(() => { effScr.className = ""; }, 1100); }
        window.nextTurnIsEnemySpecial = true; 
        window.battleStepState = 'PLAYER_DONE';
        window.updateStatusBadgesUI();
        return;
    }
    
    if (playerMove === 'chg') {
        window.mana = 2.5;
        const battleLog = document.getElementById('battle-log');
        if (battleLog) battleLog.innerHTML = "⚡ 深い瞑想に入りパワーを極限までチャージした！次回呪文威力2.5倍！ <span>▶</span>";
        const effScr = document.getElementById('eff-scr');
        if (effScr) { effScr.className = "anim-player-chg"; setTimeout(() => { effScr.className = ""; }, 1100); }
        window.nextTurnIsEnemySpecial = false;
        window.battleStepState = 'PLAYER_DONE';
        window.updateStatusBadgesUI();
        return;
    }

    if (spellSpecs[playerMove]) {
        basePower = spellSpecs[playerMove].pow;
        spellLabel = spellSpecs[playerMove].label;
        currentSE = spellSpecs[playerMove].se;
        magicClass = spellSpecs[playerMove].cls;
    }

    // 🛡️ 新・弱点/耐性（配列形式）のマルチ自動検知エンジン
    let isWeak = Array.isArray(data.weak) ? data.weak.includes(playerMove) : (playerMove === data.weak);
    let isResist = Array.isArray(data.resist) ? data.resist.includes(playerMove) : false;

    let baseDmg = Math.floor(basePower * (isWeak ? 2.2 : 1) * window.mana);
    
    // ⚡ 骨盾カット処理（Mミサイル、エアロ、そして新呪文ライトニング（ele）は防御を100%無視！）
    if (window.isEnemyShieldActive && playerMove !== 'mmis' && playerMove !== 'aero' && playerMove !== 'ele') { 
        baseDmg = Math.floor(baseDmg * 0.25); 
    }
    window.isEnemyShieldActive = false;

    // 耐性（ダメージ0）判定時の冷徹な引き算回路
    if (isResist) {
        baseDmg = 0;
    }

    let isAttackSpell = (basePower > 0);
    // ⚡ クリティカル率計算（ライトニング（ele）は会心率が通常25%からさらに10%ハジけ飛び、35%の爆確率に！）
    let criticalChance = (playerMove === 'ele') ? 0.35 : 0.25;
    let isLuckRoll = (isAttackSpell && !isResist && Math.random() < criticalChance);                 
    let isOverkillRoll = (isAttackSpell && !isResist && isWeak && baseDmg >= window.eHp);   
    let isCriticalHit = (isLuckRoll || isOverkillRoll);       
    let finalDmg = isCriticalHit ? Math.floor(baseDmg * 1.6) : baseDmg; 

    if (isCriticalHit) {
        const cutin = document.getElementById('cutin-bar');
        const cutinText = cutin ? cutin.querySelector('.cutin-text') : null;
        const board = document.getElementById('sq-board'); 
        if (cutinText) cutinText.innerText = "🧙‍♂️ 会心の一撃！！";
        if (cutin) { cutin.style.display = "flex"; setTimeout(() => { cutin.style.display = "none"; }, 1000); }
        if (board) { board.classList.add("screen-shake-flash"); setTimeout(() => { board.classList.remove("screen-shake-flash"); }, 450); }
    }

    const effScr = document.getElementById('eff-scr');
    if (effScr) effScr.className = magicClass;

    window._activeMagicTimeout = setTimeout(() => {
        playSE(currentSE);
        window.eHp = Math.max(0, window.eHp - finalDmg);
        if (typeof updateHpUI === 'function') updateHpUI();
        createDmgPop(finalDmg, false);

        let statusLog = "";
        let flavorTxt = `『${spellLabel}』を詠唱！`;

        // 耐性・弱点・通常の3大テキスト演出ルーティング回路
        let coreTxt = "";
        if (isResist) {
            coreTxt = `🚨【耐性】${data.name}に${spellLabel}は全く効かなかった！（${finalDmg}ダメージ）`;
        } else {
            if (playerMove === 'fire') { 
                window.enemyBurnTurns = 3; 
                flavorTxt = "燃え盛る火炎弾が敵の脳天を直撃！";
                statusLog = " (🔥敵を激しく大火傷にさせた！)"; 
            }
            else if (playerMove === 'ice') { 
                window.enemyFreezeTurns = 1; 
                flavorTxt = "絶対零度の氷結晶が敵の周囲を包み込み、激しく内包収縮爆発！";
                statusLog = " (❄️敵を青白き氷像へと完全氷結させた！)"; 
                
                const eContainer = document.getElementById('e-sprite-container');
                if (eContainer) {
                    eContainer.style.setProperty("filter", "brightness(3) saturate(0) drop-shadow(0 0 25px #0ea5e9)", "important");
                    eContainer.style.animationPlayState = "paused"; 
                    
                    if (window._freezeAnimationTimeout) clearTimeout(window._freezeAnimationTimeout);
                    window._freezeAnimationTimeout = setTimeout(() => {
                        eContainer.style.removeProperty("animation-play-state"); 
                        if (window.curIdx < 10) {
                            eContainer.style.setProperty("filter", (data.type === 'slime') ? "hue-rotate(65deg) saturate(2.5) brightness(1.2)" : "none");
                        } else {
                            let hueRotateDeg = (window.curIdx * 45) % 360;
                            eContainer.style.setProperty("filter", `hue-rotate(${hueRotateDeg}deg) saturate(2) brightness(1.15)`, "important");
                        }
                    }, 2000);
                }
            }
            else if (playerMove === 'slee') {
                window.enemyFreezeTurns = 2;
                flavorTxt = "神秘の催眠波動が敵の精神を優しく包み込む……！";
                statusLog = " (💤魔物は深い眠りに落ち、2ターンの間完全行動不能になった！)";
                
                const eContainer = document.getElementById('e-sprite-container');
                if (eContainer) {
                    eContainer.style.setProperty("filter", "brightness(1.5) saturate(0.2) sepia(0.6) drop-shadow(0 0 20px #38bdf8)", "important");
                    eContainer.style.animationPlayState = "paused"; 
                    
                    if (window._freezeAnimationTimeout) clearTimeout(window._freezeAnimationTimeout);
                    window._freezeAnimationTimeout = setTimeout(() => {
                        eContainer.style.removeProperty("animation-play-state");
                        if (window.curIdx < 10) {
                            eContainer.style.setProperty("filter", (data.type === 'slime') ? "hue-rotate(65deg) saturate(2.5) brightness(1.2)" : "none");
                        } else {
                            let hueRotateDeg = (window.curIdx * 45) % 360;
                            eContainer.style.setProperty("filter", `hue-rotate(${hueRotateDeg}deg) saturate(2) brightness(1.15)`, "important");
                        }
                    }, 2000);
                }
            }
            else if (playerMove === 'holy') { 
                window.enemyBlindTurns = 2; 
                flavorTxt = "天から降り注ぐ神死な聖光波が炸裂！";
                statusLog = " (✨激しい光が敵の目を潰し暗闇にした！)"; 
            }
            else if (playerMove === 'wasp') { 
                flavorTxt = "召喚された無数の蜂の群れが不規則なジグザグ軌道で敵を襲撃！";
                if (Math.random() < 0.3) { 
                    window.enemyFreezeTurns = 1; 
                    statusLog = " (🐝麻痺毒が回り、敵の身動きを完全に止めた！)"; 
                    const eContainer = document.getElementById('e-sprite-container');
                    if (eContainer) { eContainer.style.animationPlayState = "paused"; }
                } else {
                    statusLog = " (追加麻痺効果はミス！)";
                }
            }
            else if (playerMove === 'scre') { 
                flavorTxt = "激しい音波の衝撃波が敵の鼓膜と肉体を激しく震わせる！"; 
                statusLog = " (📢精神衝撃により敵の攻撃力を引き算！)"; 
            }
            else if (playerMove === 'refl') { flavorTxt = "自身の前に光り輝く魔導矩形鏡を設置した！"; }
            else if (playerMove === 'wisp') { flavorTxt = "精霊の怪しい燐光が敵の足元から湧き上がる！"; }
            else if (playerMove === 'mmis') { flavorTxt = "時空を突き破る魔力ミサイルが連続で高速直進命中！"; }
            else if (playerMove === 'scis') { flavorTxt = "巨大な空間断裂のハサミが敵のド真ん中を鋭く交差！"; }
            else if (playerMove === 'flas') { flavorTxt = "戦場全体を真っ白な閃光が包み込み、敵の視界を奪う！"; }
            else if (playerMove === 'drai') { 
                window.pHp = Math.min(window.pMaxHp, window.pHp + 20); 
                flavorTxt = "敵の生命エネルギーを強引に吸い上げる！";
                statusLog = " (🩸吸い上げた血で味方のHPが20ドレイン回復！)"; 
            }
            else if (playerMove === 'slow') { flavorTxt = "敵の周囲の時間軸を歪ませ、動きを極限まで鈍化させる！"; }
            else if (playerMove === 'flod') { flavorTxt = "画面全体を飲み込む大津波がステージを激しく押し流す！"; }
            else if (playerMove === 'bio') { 
                window.enemyBurnTurns = 5; 
                flavorTxt = "ドロドロとした有害なバイオバブルが敵の体表で弾ける！";
                statusLog = " (🧪猛毒の胞子が蝕み、永続スリップダメージ開始！)"; 
            }
            else if (playerMove === 'quak') { flavorTxt = "大地が激しく隆起し、戦場全体を大地震が襲う！"; }
            else if (playerMove === 'dead') { flavorTxt = "死神の巨大な鎌が空間ごと敵の魂を刈り取る……！"; }
            else if (playerMove === 'mete') { flavorTxt = "燃え盛る巨大な巨大隕石が超高速で大気圏を突破し激突！"; }
            else if (playerMove === 'aero') { flavorTxt = "真空の刃が竜巻きを起こし、敵の防壁ごと切り裂く！"; }
            else if (playerMove === 'come') { flavorTxt = "夜空から無数の星屑の雨が不規則に降り注ぐ！"; }
            else if (playerMove === 'grav') { flavorTxt = "超重力のブラックホールが出現し、中心へ敵を収縮圧縮！"; }
            else if (playerMove === 'ulti') { flavorTxt = "宇宙創世の究極魔導が発動し、全画面の時空が反転フラッシュ！"; }
            else if (playerMove === 'ele') { flavorTxt = "火花散らす電撃が相手を貫き感電させる！"; statusLog = " (⚡高確率の防御無視雷撃が貫通！)"; }

            let tagPrefix = isWeak ? "【弱点！】" : "";
            coreTxt = isCriticalHit ? `💥 会心の一撃！${tagPrefix}${flavorTxt} ${finalDmg} の超絶ダメージ！！${statusLog}` : `${tagPrefix}${flavorTxt} ${finalDmg} ダメージ！${statusLog}`;
        }

        if (playerMove === 'anal') {
            let currentWeak = Array.isArray(data.weak) ? data.weak.join(', ').toUpperCase() : data.weak.toUpperCase();
            if (window.curIdx >= 10) currentWeak = "シークレット（全属性検証せよ）";
            coreTxt = `🔮 【アナライズ】成功！敵の深層データをスキャン！ 残りHP: ${window.eHp}/${window.eMaxHp} | 弱点属性は [ ${currentWeak || "なし"} ] だ！`;
        }

        const battleLog = document.getElementById('battle-log');
        if (battleLog) {
            battleLog.innerHTML = `${coreTxt} <span>▶</span>`; 
        }

        window.mana = 1.0;
        window._activeMagicTimeout = null;
        window.updateStatusBadgesUI();
        
        setTimeout(() => { 
            if (effScr) effScr.className = "";
            window.battleStepState = 'PLAYER_DONE';
        }, 600);

    }, 600);
};

// ==========================================
// 👑 5. エネミーターン行動AI（アビリティ小ダメ ＆ 15P吸血ドッキング版）
// ==========================================
window.enemyTurnAction = function() {
    let isPlayerDefending = window.nextTurnIsEnemySpecial;
    window.nextTurnIsEnemySpecial = false;

    if (window.eHp <= 0 || window.pHp <= 0) { window.battleStepState = 'ENEMY_DONE'; window.advanceBattleStep(); return; }
    const data = STAGES[window.curIdx];
    const battleLog = document.getElementById('battle-log');

    // 1. 🔥 火傷スリップダメージ
    if (window.enemyBurnTurns > 0) {
        window.eHp = Math.max(0, window.eHp - 15);
        window.enemyBurnTurns--;
        createDmgPop(15, false);
        if (typeof updateHpUI === 'function') updateHpUI();
        if (battleLog) battleLog.innerHTML = `🔥 追加効果の猛烈な火傷スリップが蝕む！${data.name}に【15】ダメージ！ <span>▶</span>`;
        if (window.eHp <= 0) { window.battleStepState = 'PLAYER_DONE'; return; }
    }

    // 2. ❄️ 凍結・睡眠・麻痺スキップ
    if (window.enemyFreezeTurns > 0) {
        window.enemyFreezeTurns--;
        if (battleLog) battleLog.innerHTML = `💤 ${data.name}は凍結・睡眠の束縛に縛られピクリとも動けない！ターンが完全スキップされた！ <span>▶</span>`;
        window.battleStepState = 'ENEMY_DONE';
        window.updateStatusBadgesUI();
        return;
    }

    let isSpecial = (Math.random() < 0.4); 
    if (window.isPlayerCorroded && isPlayerDefending) { isPlayerDefending = false; }

    let dmg = isPlayerDefending ? Math.max(1, Math.floor(data.atk * 0.15)) : data.atk;
    dmg = Math.floor(dmg * window.enemyMana);
    window.enemyMana = 1.0;

    if (window.isAmuletActive > 0 && !isPlayerDefending) { dmg = Math.floor(dmg * 0.5); }

    // 3. ✨ 暗闇通常攻撃ミス判定
    if (window.enemyBlindTurns > 0 && !isSpecial) {
        window.enemyBlindTurns--;
        if (Math.random() < 0.5) {
            if (battleLog) battleLog.innerHTML = `✨ 暗闇の目潰し効果！ 視界を失った${data.name}の猛撃は虚しく空を切った（MISS）！ <span>▶</span>`;
            window.battleStepState = 'ENEMY_DONE';
            return;
        }
    } else if (window.enemyBlindTurns > 0) {
        window.enemyBlindTurns--;
    }

    window.isPlayerMuted = false; window.isItemBlocked = false; window.isPlayerCorroded = false;

    let isDoubleAbilityActive = (window.curIdx >= 10 && isSpecial);

    if (isSpecial) {
        playSE(SOUND_HOLY);
        const effScr = document.getElementById('eff-scr');
        if (effScr) effScr.style.pointerEvents = "auto";

        let logTxt = "";

        // 👹 4大アビリティに小ダメージ ＆ 吸血を完全溶接！
        if (data.type === 'slime' || isDoubleAbilityActive) {
            window.isPlayerCorroded = true;
            let totalDmg = dmg + 5; // 🧪 溶解液 ＋ 【New】固定5ダメージ
            logTxt += `🚨 ${data.name}のドロッとした溶解液放射！【${totalDmg}】の強酸ダメージ！(味方の次回防御不可状態に！)`;
            if (effScr) effScr.className = "shoot-acid";
            dmg = totalDmg;
        }
        else if (data.type === 'spider' || (isDoubleAbilityActive && data.type !== 'slime')) {
            window.isPlayerStunned = true;
            logTxt += `🚨 ${data.name}の不気味な粘着麻痺毒糸！【${dmg}】ダメ！(味方の次回スタン状態)`;
            if (effScr) effScr.className = "anim-spider-poison";
        }
        else if (data.type === 'skelton' || data.type === 'skeleton') {
            window.isEnemyShieldActive = true;
            logTxt += `🛡️ ${data.name}は魔力の骨盾をガチッと構えた！次のプレイヤーからの被ダメージを75%大幅カット！`;
            if (effScr) effScr.className = "anim-skelton-shield";
        }
        else if (data.type === 'harpy') {
            window.isHarpySpeedActive = true;
            let totalDmg = dmg + 8; // 🦅 超音波 ＋ 【New】固定8ダメージ
            logTxt += `🚨 ${data.name}の耳を裂く狂気の超音波！【${totalDmg}】の精神ダメージ！(敵の次回ターンスピード爆速化！)`;
            if (effScr) effScr.className = "anim-harpy-storm";
            dmg = totalDmg;
        }
        else if (data.type === 'golem') {
            window.mana = 1.0; 
            let totalDmg = dmg + 10; // 🤖 岩石投げ ＋ 【New】固定10ダメージ
            logTxt += `🚨 ${data.name}の超巨大岩石大投擲！【${totalDmg}】の激突ダメージ！(味方のチャージ集中状態を粉砕！)`;
            if (effScr) effScr.className = "anim-golem-earthquake";
            dmg = totalDmg;
        }
        else if (data.type === 'gargoil' || data.type === 'gargoyle') {
            window.enemyMana = 2.0;
            logTxt += `⚡ ${data.name}は邪悪な魔力シールドを展開！魔力を吸収し次回の攻撃力が確定2倍！`;
            if (effScr) effScr.className = "anim-gargoil-charge";
        }
        else if (data.type === 'mush' || data.type === 'myconid') {
            window.mana = 0.5; 
            logTxt += `🚨 ${data.name}の怪しい幻覚胞子拡散！【${dmg}】ダメージ！(味方の次回魔法威力半減デバフ)`;
            if (effScr) effScr.className = "anim-myconid-spore";
        }
        else if (data.type === 'phantom' || data.type === 'ghost') {
            window.isItemBlocked = true;
            let totalDmg = dmg + 15; // 👻 吸血エナジー ＋ 【New】固定15ダメージ
            window.eHp = Math.min(window.eMaxHp, window.eHp + 15); // 敵の体力を15ポイント自動回復（吸血）
            logTxt += `👻 ${data.name}のエナジードレイン！【${totalDmg}】ダメ！命を【15P】吸い取られ、道具袋も石化ロックされた！`;
            if (effScr) effScr.className = "anim-phantom-curse";
            dmg = totalDmg;
        }
        else if (data.type === 'eyes' || data.type === 'evileye') {
            window.isPlayerMuted = true;
            logTxt += `🚨 ${data.name}の魔力封印の石化邪眼光！【${dmg}】ダメ！(味方の次回魔法詠唱不可状態)`;
            if (effScr) effScr.className = "anim-evileye-mute";
        }
        else if (data.type === 'dragon') {
            window.eHp = Math.min(window.eMaxHp, window.eHp + 30); 
            logTxt += `🚨 ${data.name}の破滅カタストロフィ・ブレス！【${dmg}】ダメ！(暗黒の吸血魔力で敵HPが30自動回復)`;
            if (effScr) effScr.className = "anim-dragon-breath";
        }

        if (isDoubleAbilityActive) {
            logTxt = `😈【裏モード解放】${data.name}の複合スキル2個が同時ドッキング連鎖発動！！ 【${dmg}】の壊滅多重状態異常ダメージ！！`;
        }
        
        battleLog.innerHTML = `${logTxt} <span>▶</span>`;
        window.pHp = Math.max(0, window.pHp - dmg);
        if (typeof updateHpUI === 'function') updateHpUI();
        createDmgPop(dmg, true);
        
        setTimeout(() => { if (effScr) effScr.className = ""; }, 1100);
    } else {
        setTimeout(() => { playSE(SOUND_KICK); }, 200);
        const eContainer = document.getElementById('e-sprite-container');
        if (eContainer) {
            if (window.curIdx >= 10) {
                eContainer.style.setProperty('--assaultX', '-180px');
                eContainer.style.animation = "enemyAssault 0.2s 2 ease-in-out alternate"; 
            } else {
                eContainer.style.setProperty('--assaultX', '-140px');
                eContainer.style.animation = "enemyAssault 0.45s forwards";
            }
        }
        setTimeout(() => { 
            if (eContainer) {
                if (window.curIdx >= 10) {
                    eContainer.style.animation = "floatE 0.13s infinite alternate ease-in-out, playerStunShake 0.25s infinite alternate"; 
                } else {
                    eContainer.style.animation = "floatE 2.2s infinite alternate ease-in-out"; 
                }
            }
        }, 460);

        const physicalAttackTexts = [
            `${data.name}の激しい攻撃！`,
            `${data.name}の強烈な体当たり！`,
            `${data.name}の凄まじい突進！`
        ];
        const chosenText = physicalAttackTexts[Math.floor(Math.random() * physicalAttackTexts.length)];

        if (battleLog) battleLog.innerHTML = `${chosenText}【${dmg}】の物理ダメージを喰らった！ <span>▶</span>`;
        
        window.pHp = Math.max(0, window.pHp - dmg);
        if (typeof updateHpUI === 'function') updateHpUI();
        createDmgPop(dmg, true);
    }

    if (window.isAmuletActive > 0) {
        window.isAmuletActive--;
    }

    window.updateStatusBadgesUI();
    window.battleStepState = 'ENEMY_DONE';
};

window.checkBattleEnd = function() {
    if (window.pHp <= 0 || window.eHp <= 0) {
        stopBGM();
        if (typeof stopSlimeAnimation === 'function') stopSlimeAnimation();
        if (window._logResetTimeout) { clearTimeout(window._logResetTimeout); window._logResetTimeout = null; }
        if (window._freezeAnimationTimeout) { clearTimeout(window._freezeAnimationTimeout); window._freezeAnimationTimeout = null; }

        const effScr = document.getElementById('eff-scr');
        if (effScr) effScr.style.pointerEvents = "none";

        if (window.eHp <= 0) {
            playSE(SOUND_FREEZE_DEAD);
            const eContainer = document.getElementById('e-sprite-container');
            const board = document.getElementById('sq-board');
            
            if (board) board.classList.add("screen-shake-flash");
            if (eContainer) {
                eContainer.style.transition = "all 0.9s cubic-bezier(0.15, 0.85, 0.35, 1)";
                eContainer.style.filter = "contrast(4) brightness(3) invert(1) blur(4px)";
                eContainer.style.transform = "scale(0) rotate(35deg) translateY(120px)";
                eContainer.style.opacity = "0";
            }
            
            setTimeout(() => { 
                if (board) board.classList.remove("screen-shake-flash");
                window.transitionToResult(); 
            }, 1400);
        } else {
            window.transitionToResult();
        }
        return true;
    }
    return false;
};

window.transitionToResult = function() {
    showScreen('scr-result');
    const rTitle = document.getElementById('res-title');
    const rText = document.getElementById('res-text');
    const rBtn = document.getElementById('res-btn');
    const battleLog = document.getElementById('battle-log');
    if (battleLog) battleLog.innerHTML = "コマンドを選択せよ。";

    if (window.eHp <= 0) {
        if (rTitle) { rTitle.innerText = "VICTORY"; rTitle.style.color = '#10b981'; }
        const resIcon = document.getElementById('res-icon');
        if (resIcon) resIcon.innerText = "🏆";

        if (window.curIdx === STAGES.length - 1) {
            if (rTitle) rTitle.innerText = "GRAND END";
            if (rText) rText.innerText = "最上階の暗黒竜を討伐し、螺旋の塔に永遠の平穏が訪れた！螺旋のタワー完全制覇、おめでとうございます！";
            if (rBtn) rBtn.innerText = "タイトルへ戻る";
            startBGM("grand_end");
        } else {
            let nextTxt = (window.curIdx === 9) ? "1周目クリア！扉の奥からさらなる凶悪な魔力を放つ【裏タワー（2周目：11〜20階）】が姿を現した……！" : `${STAGES[window.curIdx].name}を撃破した！次の階層への扉が開く。`;
            if (rText) rText.innerText = nextTxt;
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
    window.battleStepState = 'NONE';
    window.updateStatusBadgesUI();
};

window.resetGame = function() {
    window.isBusy = false; 
    window.battleStepState = 'NONE';
    if (!window.isDebugUnlocked) { window.pMaxHp = 100; window.pHp = 100; } 
    else { window.pMaxHp = 8000; window.pHp = 8000; }
    window.mana = 1.0; window.curIdx = -1;
    
    Object.keys(window.itemInventory).forEach(k => window.itemInventory[k] = 9);
    window.isAmuletActive = 0;
    window.enemyBurnTurns = 0; window.enemyFreezeTurns = 0; window.enemyBlindTurns = 0;

    const cleanContainer = document.getElementById('e-sprite-container');
    if (cleanContainer) { 
        cleanContainer.style.background = "none"; 
        cleanContainer.style.removeProperty("filter");
        cleanContainer.style.opacity = "1";
        cleanContainer.style.transform = "scale(1)";
        cleanContainer.style.removeProperty("animation-play-state");
        cleanContainer.style.animation = "floatE 2.2s infinite alternate ease-in-out";
    }

    const effScr = document.getElementById('eff-scr');
    if (effScr) { effScr.className = ""; effScr.style.pointerEvents = "none"; }

    if (window._logResetTimeout) { clearTimeout(window._logResetTimeout); window._logResetTimeout = null; }
    if (window._freezeAnimationTimeout) { clearTimeout(window._freezeAnimationTimeout); window._freezeAnimationTimeout = null; }
    const battleLog = document.getElementById('battle-log');
    if (battleLog) battleLog.innerHTML = "コマンドを選択せよ。";

    stopBGM();
    if (typeof stopSlimeAnimation === 'function') stopSlimeAnimation();
    window.updateStatusBadgesUI();
};
