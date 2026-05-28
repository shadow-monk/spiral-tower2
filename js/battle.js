// ==========================================
// 🕒 🔄 更新検知・タイムスタンプ刻印システム
// ==========================================
console.log("%c🔄 [BATTLE SYSTEMS] Ver 8.50: ユーザー手動クリック進行（ボタン送り）＆全23呪文演出・全20アイテムテキスト完全点火。", "color: #00ff00; font-weight: bold;");

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

// ⚡ ボタン送り（手動進行）用の戦術ステートチケット管理
// 'NONE': 通常受付中、'PLAYER_DONE': プレイヤー行動後待機、'ENEMY_DONE': 敵行動後待機
window.battleStepState = 'NONE';
window.nextTurnIsEnemySpecial = false; // 敵の次の行動が特殊技かどうかの記録

// ⚡ タイマーID管理
window._activeMagicTimeout = null;
window._logResetTimeout = null;       

// ==========================================
// 🕹️ 【心臓部】バトルログ枠手動クリック進行回路（仕掛けの溶接）
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    const logBox = document.getElementById('battle-log');
    if (logBox) {
        logBox.style.cursor = 'pointer'; // マウスを乗せたら指マークにして直感誘導！
        logBox.setAttribute("onclick", "window.advanceBattleStep()");
    }
});

window.advanceBattleStep = function() {
    // ログがクリックされたときに、現在の進行状況に応じて未来へ電気信号を送る
    if (window.battleStepState === 'PLAYER_DONE') {
        window.battleStepState = 'NONE';
        if (!window.checkBattleEnd()) {
            window.enemyTurnAction(); // ユーザーのクリックで初めて敵の行動が開始！
        }
    } else if (window.battleStepState === 'ENEMY_DONE') {
        window.battleStepState = 'NONE';
        if (!window.checkBattleEnd()) {
            // 敵のターンが終わり、完全に安全な状態で下部コマンドを再点灯！
            window.isBusy = false;
            const battleLog = document.getElementById('battle-log');
            if (battleLog) battleLog.innerHTML = "コマンドを選択せよ。";
            const effScr = document.getElementById('eff-scr');
            if (effScr) effScr.style.pointerEvents = "none";
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

    const eContainer = document.getElementById('e-sprite-container');
    const eSpriteGraphic = document.getElementById('e-sprite-graphic');
    
    if (eContainer) {
        eContainer.style.opacity = "1";
        eContainer.style.transform = "scale(1)";
        eContainer.style.background = "none";
        eContainer.style.removeProperty("filter"); 
        eContainer.style.transition = "none"; 
        
        if (data.type === 'slime') {
            eContainer.style.setProperty("filter", "hue-rotate(65deg) saturate(2.5) brightness(1.2)", "important");
        }
    }
    if (eSpriteGraphic) {
        eSpriteGraphic.style.removeProperty("filter");
    }

    const pGraphic = document.getElementById('p-sprite-graphic');
    if (pGraphic) {
        pGraphic.src = './assets/enemies/player/player_wizard.png';
    }

    const itemBadge = document.getElementById('item-badge');
    const chargeBadge = document.getElementById('charge-badge');
    const eName = document.getElementById('e-name');
    const effScr = document.getElementById('eff-scr');
    const cutin = document.getElementById('cutin-bar');

    if (itemBadge) itemBadge.style.display = "none";
    if (chargeBadge) chargeBadge.style.display = "none";
    if (cutin) cutin.style.display = "none";
    if (eName) eName.innerText = data.name;

    if (eSpriteGraphic && MASTER_ANIM_MAP[data.type]) {
        let rawUrl = MASTER_ANIM_MAP[data.type][0];
        let cleanUrl = rawUrl.replace(/^\.\//, '').replace(/^\//, '').replace(/^spiral-tower2\//, '');
        eSpriteGraphic.src = './' + cleanUrl;
    }

    showScreen('scr-battle');

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

    const battleLog = document.getElementById('battle-log');
    if (battleLog) {
        battleLog.innerHTML = `${data.name}が現れた！弱点: ${data.weak.toUpperCase()}`;
    }

    startBGM("battle");
};

// ==========================================
// 🎒 3. 大容量アイテム使用（全20種類ストーリー実況＋お遊び骨枠）
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
    const data = STAGES[window.curIdx];

    // ─── 📜 ディレクター承認・全20アイテム個別実況テキスト大要塞 ───
    if (itemType === 'potion') {
        window.pHp = Math.min(window.pMaxHp, window.pHp + 50);
        battleLog.innerHTML = "🧪 回復薬を取り出して一気に飲み干した！傷口が塞がり、HPが50回復する！ <span>▶</span>";
    } else if (itemType === 'amulet') {
        window.isAmuletActive = 3;
        const itemBadge = document.getElementById('item-badge');
        if (itemBadge) itemBadge.style.display = "block";
        battleLog.innerHTML = "🧿 古びたお守りを強く握りしめた！聖なる結界が身体を包み込み、3ターンの間被ダメージを半減する！ <span>▶</span>";
    } else if (itemType === 'elix') {
        window.pHp = window.pMaxHp;
        window.isPlayerMuted = false; window.isPlayerStunned = false;
        battleLog.innerHTML = "🧪 伝説の至高薬エリクサーの雫を垂らした！五臓六腑が激しく脈動し、HPが100%全回復した！ <span>▶</span>";
    } else if (itemType === 'bomb') {
        window.eHp = Math.max(0, window.eHp - 30);
        battleLog.innerHTML = "💣 魔導手榴弾のピンを抜いて投げつけた！シールドや耐性を全て無視する固定30ダメージ！ <span>▶</span>";
    } else if (itemType === 'cure') {
        window.isPlayerCorroded = false; window.isPlayerStunned = false; window.pHp = Math.min(window.pMaxHp, window.pHp + 10);
        battleLog.innerHTML = "🧪 七色の薬草を調合した万能薬を服用した！身体の毒や麻痺が瞬時に消滅していく！ <span>▶</span>";
    } else if (itemType === 'hour') {
        battleLog.innerHTML = "⏳ 時の砂時計を静かにひっくり返した！流れる砂が因果を遅らせ、敵の行動を2ターン分遅延させる！ <span>▶</span>";
    } else if (itemType === 'whet') {
        battleLog.innerHTML = "🗡️ 無骨な研ぎ石で魔導杖の先端を鋭く研ぎ澄ました！2ターンの間、物理・素材系攻撃の威力が1.5倍に！ <span>▶</span>";
    } else if (itemType === 'mirr') {
        battleLog.innerHTML = "🪞 魔力を帯びた鏡の破片を前に突き出した！1ターンの間、敵が放つ状態異常魔法を100%オウム返しする！ <span>▶</span>";
    } else if (itemType === 'mana') {
        window.mana = 2.5;
        const chargeBadge = document.getElementById('charge-badge');
        if (chargeBadge) chargeBadge.style.display = "block";
        battleLog.innerHTML = "🧪 透き通った魔力の雫を飲み干した！瞑想なしで、次回の呪文威力を強制的に2.5倍モードに変形！ <span>▶</span>";
    } else if (itemType === 'scro') {
        battleLog.innerHTML = `📜 古文書の記述をハキハキと解読した！アナライズが走り、敵の正確な残りHPは [ ${window.eHp} ] だ！ <span>▶</span>`;
    } else if (itemType === 'smok') {
        battleLog.innerHTML = "🌀 足元へ煙幕弾を叩きつけた！凄まじい黒煙が敵の視界を遮り、次の敵の攻撃を100%不発（MISS）にする！ <span>▶</span>";
    } 
    // 魔物ドロップ素材（ディレクター修正案を完全溶接）
    else if (itemType === 'wing') {
        window.eHp = Math.max(0, window.eHp - 20);
        const effScr = document.getElementById('eff-scr');
        if (effScr) { effScr.className = (data.type === 'slime' ? "anim-slime-yellow " : "") + "anim-player-aero"; setTimeout(() => { effScr.className = (data.type === 'slime' ? "anim-slime-yellow" : ""); }, 600); }
        battleLog.innerHTML = "🪶 ハーピーの羽根を投げた。風を切り裂き、相手に突き刺さる！ <span>▶</span>";
    } else if (itemType === 'bone') {
        // 【お遊び死にアイテム枠】
        const effScr = document.getElementById('eff-scr');
        if (effScr) { effScr.className = (data.type === 'slime' ? "anim-slime-yellow " : "") + "anim-player-def"; setTimeout(() => { effScr.className = (data.type === 'slime' ? "anim-slime-yellow" : ""); }, 600); }
        battleLog.innerHTML = "🦴 骸骨の骨を地面に放り投げた。……特に何も起きない。（動物や犬系なら気を取られたかもしれない） <span>▶</span>";
    } else if (itemType === 'web') {
        window.enemyFreezeTurns = 1;
        const effScr = document.getElementById('eff-scr');
        if (effScr) { effScr.className = (data.type === 'slime' ? "anim-slime-yellow " : "") + "anim-player-slow"; setTimeout(() => { effScr.className = (data.type === 'slime' ? "anim-slime-yellow" : ""); }, 600); }
        battleLog.innerHTML = "🕸️ ブラッドスパイダーの糸を投げつけた！敵の足元をガチガチに絡め取る！ <span>▶</span>";
    } else if (itemType === 'ston') {
        window.isEnemyShieldActive = false; window.eHp = Math.max(0, window.eHp - 25);
        battleLog.innerHTML = "🪨 ゴーレムの頑強な石を投げつけた！敵の張っている防御結界を粉砕！ <span>▶</span>";
    } else if (itemType === 'cand') {
        window.isPlayerStunned = false; window.isPlayerMuted = false;
        battleLog.innerHTML = "🕯️ 不気味に燃えるファントムの蝋燭を点した。立ち上る紫煙が、我が身の呪いを焼き尽くす！ <span>▶</span>";
    } else if (itemType === 'jewe') {
        window.isPlayerMuted = false; window.mana = 2.5;
        battleLog.innerHTML = "💎 エビルアイの目玉の宝石を掲げた！邪眼の魔力が反転し、己の魔力を暴発させる！ <span>▶</span>";
    } else if (itemType === 'hone') {
        window.isPlayerCorroded = false; window.pHp = Math.min(window.pMaxHp, window.pHp + 30);
        battleLog.innerHTML = "🍯 ヘドロスライムから採れた黄金の蜜を飲み干した！ドロッとした溶解液が綺麗に洗い流される！ <span>▶</span>";
    } else if (itemType === 'spor') {
        window.enemyFreezeTurns = 2;
        battleLog.innerHTML = "🍄 マイコニドの幻覚胞子をばら撒いた！妖しい粉煙が敵の五感を狂わせる！ <span>▶</span>";
    } else if (itemType === 'scal') {
        window.eHp = Math.max(0, window.eHp - 50);
        battleLog.innerHTML = "🐉 カリスドラゴンの逆鱗を激しく激昂させた！怒りの爆炎が戦場全てを焼き尽くす！ <span>▶</span>";
    }

    if (typeof updateHpUI === 'function') updateHpUI();
    createDmgPop(0, false); // 表示更新用

    // ★時間を完全停止させてクリック待ちへステレート移行！
    window.battleStepState = 'PLAYER_DONE';
};

// ==========================================
// 🧙‍♂️ 4. プレイヤー魔導アクション・全23呪文個別演出溶接
// ==========================================
window.turn = function(playerMove) {
    if (playerMove === 'debug_death') {
        window.isBusy = false; 
        window.eHp = 0;
        if (typeof updateHpUI === 'function') updateHpUI();
        const battleLog = document.getElementById('battle-log');
        if (battleLog) battleLog.innerText = "☠ デスコード起動。";
        window.checkBattleEnd();
        return;
    }

    if (window.isBusy || window.pHp <= 0 || window.eHp <= 0) return;

    if (window.isPlayerMuted && ['fire','ice','holy','wasp','scre','refl','wisp','mmis','scis','flas','drai','slow','flod','bio','quak','slee','dead','mete','aero','come','grav','anal','ulti'].includes(playerMove)) {
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
        window.battleStepState = 'PLAYER_DONE'; // 動けなくてもターン消費してクリック待ち
        return;
    }

    const data = STAGES[window.curIdx];
    
    // ─── 📊 23呪文すべての個別割り当てDNA ───
    let basePower = 15;
    let spellLabel = "魔導魔法";
    let magicClass = "anim-player-fire";
    let currentSE = SOUND_FIRE;

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
        ulti: { pow: 50, label: "アルテマ", se: SOUND_HOLY, cls: "anim-player-ulti" }
    };

    // 🛡️ シールド防御姿勢
    if (playerMove === 'def') {
        const battleLog = document.getElementById('battle-log');
        if (battleLog) battleLog.innerHTML = "🛡 シールドを展開！防御姿勢をとった。 <span>▶</span>";
        window.mana = 1.0;
        const chargeBadge = document.getElementById('charge-badge');
        if (chargeBadge) chargeBadge.style.display = "none";
        const effScr = document.getElementById('eff-scr');
        let baseClass = (data.type === 'slime') ? "anim-slime-yellow " : "";
        if (effScr) { effScr.className = baseClass + "anim-player-def"; setTimeout(() => { effScr.className = (data.type === 'slime') ? "anim-slime-yellow" : ""; }, 1100); }
        
        window.nextTurnIsEnemySpecial = true; // 次は被ダメ軽減状態で受動
        window.battleStepState = 'PLAYER_DONE';
        return;
    }
    
    // ⚡ チャージ姿勢
    if (playerMove === 'chg') {
        window.mana = 2.5;
        const chargeBadge = document.getElementById('charge-badge');
        const battleLog = document.getElementById('battle-log');
        if (chargeBadge) chargeBadge.style.display = "block";
        if (battleLog) battleLog.innerHTML = "⚡ パワーをチャージした！次回威力2.5倍！ <span>▶</span>";
        const effScr = document.getElementById('eff-scr');
        let baseClass = (data.type === 'slime') ? "anim-slime-yellow " : "";
        if (effScr) { effScr.className = baseClass + "anim-player-chg"; setTimeout(() => { effScr.className = (data.type === 'slime') ? "anim-slime-yellow" : ""; }, 1100); }
        
        window.nextTurnIsEnemySpecial = false;
        window.battleStepState = 'PLAYER_DONE';
        return;
    }

    if (spellSpecs[playerMove]) {
        basePower = spellSpecs[playerMove].pow;
        spellLabel = spellSpecs[playerMove].label;
        currentSE = spellSpecs[playerMove].se;
        magicClass = spellSpecs[playerMove].cls;
    }

    let isWeak = (playerMove === data.weak);
    let baseDmg = Math.floor(basePower * (isWeak ? 2.2 : 1) * window.mana);
    
    if (window.isEnemyShieldActive && playerMove !== 'mmis' && playerMove !== 'aero') { baseDmg = Math.floor(baseDmg * 0.25); }
    window.isEnemyShieldActive = false;

    // 🎯 クリティカル判定（25%暴発 or 弱点トドメ殺し）
    let isLuckRoll = (Math.random() < 0.25);                  
    let isOverkillRoll = (isWeak && baseDmg >= window.eHp);   
    let isCriticalHit = (isLuckRoll || isOverkillRoll);       
    let finalDmg = isCriticalHit ? Math.floor(baseDmg * 1.6) : baseDmg; 

    // 🎬 クリティカルヒット上部カットイン発火
    if (isCriticalHit) {
        const cutin = document.getElementById('cutin-bar');
        const cutinText = cutin ? cutin.querySelector('.cutin-text') : null;
        const board = document.getElementById('sq-board'); 
        if (cutinText) cutinText.innerText = "🧙‍♂️ クリティカルヒット！！";
        if (cutin) { cutin.style.display = "flex"; setTimeout(() => { cutin.style.display = "none"; }, 1000); }
        if (board) { board.classList.add("screen-shake-flash"); setTimeout(() => { board.classList.remove("screen-shake-flash"); }, 450); }
    }

    // 導火線点火：戦闘大箱に個別CSSクラスを一斉付与！
    const effScr = document.getElementById('eff-scr');
    let baseClass = (data.type === 'slime') ? "anim-slime-yellow " : "";
    if (effScr) effScr.className = baseClass + magicClass;

    window._activeMagicTimeout = setTimeout(() => {
        playSE(currentSE);
        window.eHp = Math.max(0, window.eHp - finalDmg);
        if (typeof updateHpUI === 'function') updateHpUI();
        createDmgPop(finalDmg, false);

        // 🧪 状態異常追加カウンター
        let statusLog = "";
        if (playerMove === 'fire') { window.enemyBurnTurns = 3; statusLog = " (🔥敵を大火傷にさせた！)"; }
        else if (playerMove === 'ice') { window.enemyFreezeTurns = 1; statusLog = " (❄️敵を完全氷結させた！)"; }
        else if (playerMove === 'holy') { window.enemyBlindTurns = 2; statusLog = " (✨敵の目を潰し暗闇にした！)"; }
        else if (playerMove === 'wasp') { if (Math.random() < 0.3) { window.enemyFreezeTurns = 1; statusLog = " (🐝麻痺毒が回り身動きを止めた！)"; } }
        else if (playerMove === 'drai') { window.pHp = Math.min(window.pMaxHp, window.pHp + 20); statusLog = " (🩸味方のHPが20ドレイン回復！)"; }
        else if (playerMove === 'bio') { window.enemyBurnTurns = 5; statusLog = " (🧪猛毒の胞子が永続スリップ開始！)"; }

        const battleLog = document.getElementById('battle-log');
        if (battleLog) {
            let coreTxt = isCriticalHit ? `💥 会心の一撃！『${spellLabel}』で ${finalDmg} の超絶ダメージ！！${statusLog}` : `『${spellLabel}』で ${finalDmg} ダメージ！${statusLog}`;
            if (playerMove === 'anal') {
                coreTxt = `🔮 【アナライズ】成功！敵のHP: ${window.eHp}/${window.eMaxHp} | 弱点属性は [ ${data.weak.toUpperCase()} ] だ！`;
            }
            battleLog.innerHTML = `${coreTxt} <span>▶</span>`; // 矢印を付与して一時停止
        }

        window.mana = 1.0;
        const chargeBadge = document.getElementById('charge-badge');
        if (chargeBadge) chargeBadge.style.display = "none";

        window._activeMagicTimeout = null;
        
        setTimeout(() => { 
            if (effScr) effScr.className = (data.type === 'slime') ? "anim-slime-yellow" : "";
            // ★タイマー進行を完全消滅させ、クリック待ちのステートへ！
            window.battleStepState = 'PLAYER_DONE';
        }, 600);

    }, 600);
};

// ==========================================
// 👹 5. エネミーターン行動AI＆カウンター処理
// ==========================================
window.enemyTurnAction = function() {
    let isPlayerDefending = window.nextTurnIsEnemySpecial;
    window.nextTurnIsEnemySpecial = false;

    if (window.eHp <= 0 || window.pHp <= 0) { window.battleStepState = 'ENEMY_DONE'; window.advanceBattleStep(); return; }
    const data = STAGES[window.curIdx];
    const battleLog = document.getElementById('battle-log');

    // 1. 🔥 スリップダメージ処理
    if (window.enemyBurnTurns > 0) {
        window.eHp = Math.max(0, window.eHp - 15);
        window.enemyBurnTurns--;
        createDmgPop(15, false);
        if (typeof updateHpUI === 'function') updateHpUI();
        if (battleLog) battleLog.innerHTML = `🔥 スリップが蝕む！追加効果により${data.name}に【15】ダメージ！ <span>▶</span>`;
        if (window.eHp <= 0) { window.battleStepState = 'PLAYER_DONE'; return; }
    }

    // 2. ❄️ 凍結スキップ処理
    if (window.enemyFreezeTurns > 0) {
        window.enemyFreezeTurns--;
        if (battleLog) battleLog.innerHTML = `❄️ ${data.name}はガチガチに身動きがとれない！ターンがスキップされます。 <span>▶</span>`;
        window.battleStepState = 'ENEMY_DONE';
        return;
    }

    let isSpecial = (Math.random() < 0.4); 
    if (window.isPlayerCorroded && isPlayerDefending) { isPlayerDefending = false; }

    let dmg = isPlayerDefending ? Math.max(1, Math.floor(data.atk * 0.15)) : data.atk;
    dmg = Math.floor(dmg * window.enemyMana);
    window.enemyMana = 1.0;

    if (window.isAmuletActive > 0 && !isPlayerDefending) { dmg = Math.floor(dmg * 0.5); }

    // 3. ✨ 暗闇のミス判定
    if (window.enemyBlindTurns > 0 && !isSpecial) {
        window.enemyBlindTurns--;
        if (Math.random() < 0.5) {
            if (battleLog) battleLog.innerHTML = `✨ 暗闇の目潰し！ ${data.name}の突進攻撃は空を切った（MISS）！ <span>▶</span>`;
            window.battleStepState = 'ENEMY_DONE';
            return;
        }
    } else if (window.enemyBlindTurns > 0) {
        window.enemyBlindTurns--;
    }

    window.isPlayerMuted = false; window.isItemBlocked = false; window.isPlayerCorroded = false;
    let baseClass = (data.type === 'slime') ? "anim-slime-yellow " : "";

    if (isSpecial) {
        playSE(SOUND_HOLY);
        const effScr = document.getElementById('eff-scr');
        if (effScr) effScr.style.pointerEvents = "auto";

        if (data.type === 'slime') {
            window.isPlayerCorroded = true;
            if (battleLog) battleLog.innerHTML = `🚨 ${data.name}の溶解液を吐きかけた！【${dmg}】ダメージ！(次回防御不可) <span>▶</span>`;
            if (effScr) { effScr.className = "anim-slime-yellow shoot-acid"; setTimeout(() => { effScr.className = "anim-slime-yellow"; }, 1100); }
        }
        else if (data.type === 'spider') {
            window.isPlayerStunned = true;
            if (battleLog) battleLog.innerHTML = `🚨 ${data.name}の麻痺毒糸を吐いた！【${dmg}】ダメージ！(次回スタン) <span>▶</span>`;
            if (effScr) { effScr.className = "anim-spider-poison"; setTimeout(() => { effScr.className = baseClass; }, 1100); }
        }
        else if (data.type === 'skelton' || data.type === 'skeleton') {
            window.isEnemyShieldActive = true;
            if (battleLog) battleLog.innerHTML = `🛡️ ${data.name}は骨盾を構えた！次の被ダメを大幅カット！ <span>▶</span>`;
            if (effScr) { effScr.className = "anim-skelton-shield"; setTimeout(() => { effScr.className = baseClass; }, 1100); }
            window.battleStepState = 'ENEMY_DONE';
            return;
        }
        else if (data.type === 'harpy') {
            window.isHarpySpeedActive = true;
            if (battleLog) battleLog.innerHTML = `🚨 ${data.name}の超音波を放った！【${dmg}】ダメージ！(敵次ターン爆速化) <span>▶</span>`;
            if (effScr) { effScr.className = "anim-harpy-storm"; setTimeout(() => { effScr.className = baseClass; }, 1100); }
        }
        else if (data.type === 'golem') {
            window.mana = 1.0; 
            const chargeBadge = document.getElementById('charge-badge');
            if (chargeBadge) chargeBadge.style.display = "none";
            if (battleLog) battleLog.innerHTML = `🚨 ${data.name}の岩石大投擲！【${dmg}】ダメージ！(チャージ強制解除) <span>▶</span>`;
            if (effScr) { effScr.className = "anim-golem-earthquake"; setTimeout(() => { effScr.className = baseClass; }, 1100); }
        }
        else if (data.type === 'gargoil' || data.type === 'gargoyle') {
            window.enemyMana = 2.0;
            if (battleLog) battleLog.innerHTML = `⚡ ${data.name}は魔力シールドを展開！次回の攻撃力2倍！ <span>▶</span>`;
            if (effScr) { effScr.className = "anim-gargoil-charge"; setTimeout(() => { effScr.className = baseClass; }, 1100); }
            window.battleStepState = 'ENEMY_DONE';
            return;
        }
        else if (data.type === 'mush' || data.type === 'myconid') {
            window.mana = 0.5; 
            if (battleLog) battleLog.innerText = `🚨 ${data.name}の胞子拡散！【${dmg}】ダメージ！(次回魔法威力半減) <span>▶</span>`;
            if (effScr) { effScr.className = "anim-myconid-spore"; setTimeout(() => { effScr.className = baseClass; }, 1100); }
        }
        else if (data.type === 'phantom' || data.type === 'ghost') {
            window.isItemBlocked = true;
            if (battleLog) battleLog.innerHTML = `🚨 ${data.name}のエナジードレイン！【${dmg}】ダメージ！(次回アイテム使用不可) <span>▶</span>`;
            if (effScr) { effScr.className = "anim-phantom-curse"; setTimeout(() => { effScr.className = baseClass; }, 1100); }
        }
        else if (data.type === 'eyes' || data.type === 'evileye') {
            window.isPlayerMuted = true;
            if (battleLog) battleLog.innerHTML = `🚨 ${data.name}の魔力封印の邪眼！【${dmg}】ダメージ！(次回魔法不可) <span>▶</span>`;
            if (effScr) { effScr.className = "anim-evileye-mute"; setTimeout(() => { effScr.className = baseClass; }, 1100); }
        }
        else if (data.type === 'dragon') {
            window.eHp = Math.min(window.eMaxHp, window.eHp + 30); 
            if (battleLog) battleLog.innerHTML = `🚨 ${data.name}のカタストロフィ・ブレス！【${dmg}】ダメージ！(敵のHPが30回復) <span>▶</span>`;
            if (effScr) { effScr.className = "anim-dragon-breath"; setTimeout(() => { effScr.className = baseClass; }, 1100); }
        }
        
        window.pHp = Math.max(0, window.pHp - dmg);
        if (typeof updateHpUI === 'function') updateHpUI();
        createDmgPop(dmg, true);
    } else {
        // 通常突進攻撃
        setTimeout(() => { playSE(SOUND_KICK); }, 200);
        const eContainer = document.getElementById('e-sprite-container');
        if (eContainer) {
            eContainer.style.setProperty('--assaultX', '-140px');
            eContainer.style.animation = "enemyAssault 0.45s forwards";
        }
        setTimeout(() => { if (eContainer) eContainer.style.animation = "floatE 2.2s infinite alternate ease-in-out"; }, 460);

        if (battleLog) battleLog.innerHTML = `${data.name}の突進体当たり攻撃！【${dmg}】ダメージ！ <span>▶</span>`;
        
        window.pHp = Math.max(0, window.pHp - dmg);
        if (typeof updateHpUI === 'function') updateHpUI();
        createDmgPop(dmg, true);
    }

    // 🛡️ お守り軽減カウント減衰
    if (window.isAmuletActive > 0) {
        window.isAmuletActive--;
        if (window.isAmuletActive <= 0) {
            const itemBadge = document.getElementById('item-badge');
            if (itemBadge) itemBadge.style.display = "none";
        }
    }

    // ★敵の処理が終わったら、次のクリック待ちステートをセットして完全静止！
    window.battleStepState = 'ENEMY_DONE';
};

window.checkBattleEnd = function() {
    if (window.pHp <= 0 || window.eHp <= 0) {
        stopBGM();
        if (typeof stopSlimeAnimation === 'function') stopSlimeAnimation();
        if (window._logResetTimeout) { clearTimeout(window._logResetTimeout); window._logResetTimeout = null; }

        const effScr = document.getElementById('eff-scr');
        if (effScr) effScr.style.pointerEvents = "none";

        if (window.eHp <= 0) {
            playSE(SOUND_FREEZE_DEAD);
            
            // ☠️ 【2. 激震：断末魔ドット砕け消滅演出】
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
    window.battleStepState = 'NONE';
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
    }

    const effScr = document.getElementById('eff-scr');
    if (effScr) { effScr.className = ""; effScr.style.pointerEvents = "none"; }

    if (window._logResetTimeout) { clearTimeout(window._logResetTimeout); window._logResetTimeout = null; }
    const battleLog = document.getElementById('battle-log');
    if (battleLog) battleLog.innerHTML = "コマンドを選択せよ。";

    stopBGM();
    if (typeof stopSlimeAnimation === 'function') stopSlimeAnimation();
};
