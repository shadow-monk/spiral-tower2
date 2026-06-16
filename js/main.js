// 【０】目次
// 【１】開発者コンソール・デバッグ制御ロジック
// 【２】大容量マルチメディア・アセットプリロード
// 【３】魔道職業セッティング
// 【４】主人公ステータス基本構成
// 【５】経験値・レベルアップ駆動システム


//==========================================
// 🔧 １　開発者コンソール・デバッグ制御ロジック
// ==========================================
console.log("%c🔄 [MAIN SYSTEMS] Ver 7.35: デスコードラグ・2重ワープ・全回復誤配線を完全修復しました。", "color: #10b981; font-weight: bold;");

/**
 * 開発者コンソールの入力パスワード（1192）を検証し、デバッグ機能を解放する関数
 */
function checkDevPassword() {
    const inputField = document.getElementById("dev-password-input");
    const badge = document.getElementById("dev-status-badge");
    const consoleWindow = document.getElementById("dev-console-window");
    
    if (!inputField) return;

    // パスワード「1192」でロック解除
if (inputField.value === "1192") { 
        if (badge) {
            badge.innerText = "UNLOCKED"; 
            badge.style.color = '#10b981';
        }
        window.isDebugUnlocked = true;
        
    
        if (typeof startBGM === 'function') {
            startBGM("title"); 
        }

// 🔑 パスワードが「1192」のときだけ、この中でデバッグボタン群を動的に生成してOPENする
        if (consoleWindow) {
            // 入力欄（inputField）の記述を消さないよう、その下にデバッグボタンの部屋をドッキングします
            let debugMenu = document.getElementById("debug-activated-menu");
            if (!debugMenu) {
                debugMenu = document.createElement("div");
                debugMenu.id = "debug-activated-menu";
                debugMenu.style.cssText = "margin-top:15px; display:grid; grid-template-columns: repeat(2, 1fr); gap: 8px; font-family:monospace;";
                debugMenu.innerHTML = `
                    <button onclick="window.isBusy=false; if(typeof window.turn==='function') window.turn('debug_death');" style="background:#ef4444; color:white; border:none; border-radius:8px; padding:12px; font-size:0.85rem; font-weight:bold; cursor:pointer; box-shadow:0 4px #b91c1c;">☠️ デス (瞬殺)</button>
                    <button onclick="if(typeof window.triggerDebugWarpSelect==='function') window.triggerDebugWarpSelect();" style="background:#8b5cf6; color:white; border:none; border-radius:8px; padding:12px; font-size:0.85rem; font-weight:bold; cursor:pointer; box-shadow:0 4px #6d28d9;">🔮 時空跳躍 (ワープ)</button>
                    <button onclick="if(typeof window.triggerDebugFullEquip==='function') window.triggerDebugFullEquip();" style="background:#3b82f6; color:white; border:none; border-radius:8px; padding:12px; font-size:0.85rem; font-weight:bold; cursor:pointer; box-shadow:0 4px #1d4ed8;">🎒 フル装備補給</button>
                    <button onclick="if(typeof window.triggerDebugReadScroll==='function') window.triggerDebugReadScroll();" style="background:#eab308; color:black; border:none; border-radius:8px; padding:12px; font-size:0.85rem; font-weight:bold; cursor:pointer; box-shadow:0 4px #a16207;">📜 羊皮紙の強制解読</button>
                `;
                consoleWindow.appendChild(debugMenu);
            }
        }
} else {
        // 🔒 パスワードが未入力、または「1192」ではない時は確実にロックを死守！
        if (badge) {
            badge.innerText = "LOCKED"; 
            badge.style.color = '#ef4444';
        }
        window.isDebugUnlocked = false;
        
        // 画面にボタンが残っていたら跡形もなく消去する
        const debugMenu = document.getElementById("debug-activated-menu");
        if (debugMenu) debugMenu.remove();
    }
}

// ==========================================
// 📦 ２大容量マルチメディア・アセットプリロード
// ==========================================

/**
 * 通信のタイムラグや画像チラつき、404エラーを100%防止するために
 * 配列から環境に応じた絶対URLを安全に生成して先読みホールドする関数
 */
function preloadAllEnemyAssets() {
    if (typeof MASTER_ANIM_MAP === 'undefined' || typeof window.getCleanAssetPath === 'undefined') {
        setTimeout(preloadAllEnemyAssets, 100);
        return;
    }

    let loadedCount = 0;
    let totalCount = 0;
    
    // 🛡️ 【404根絶の足し算有線！】
    // 手動で結合されていた不完全なパスをすべて廃止し、安全解析関数を100%直結。
    // スペースバグや階層のズレを完全に吸収した絶対パスを動的に配列へプッシュします。
    const urlsToLoad = [window.getCleanAssetPath("assets/enemies/player/player_wizard.png")];

    for (let key in MASTER_ANIM_MAP) {
        if (Array.isArray(MASTER_ANIM_MAP[key])) {
            MASTER_ANIM_MAP[key].forEach(url => {
                urlsToLoad.push(window.getCleanAssetPath(url));
            });
        }
    }

    totalCount = urlsToLoad.length;

    urlsToLoad.forEach(url => {
        const img = new Image();
        img.onload = () => {
            loadedCount++;
            // 📡 【ロスト項目：全画像プリロードの完全開通検知・コンソール報告システム大回復！】
            if (loadedCount === totalCount) {
                console.log(`%cmain.js: 成功！現在のブラウザ環境に応じた全 ${totalCount} 枚（プレイヤー＆魔物）のアセットがエラーなしで完全ホールドされました！`, "color: #10b981; font-weight: bold;");
            }
        };
        img.onerror = () => {
            console.error(`main.js: 画像の仕入れプリロードに失敗しました: ${url}`);
        };
        // 🛡️ 歪んだドメイン合体を排除し、1本化された純粋な絶対URLをそのまま流し込みます
        img.src = url;
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', preloadAllEnemyAssets);
} else {
    preloadAllEnemyAssets();
}

// ==========================================
// 📦 ３　魔道職業セッティング
// ==========================================

window.selectPlayerStyle = function(styleKey, baseHp, baseMp) {
    window.pStyle = styleKey;
    
    // 画面表示用のスタイリッシュな職業名マッピング（演出用を完全保護）
    const jobNames = {
        'WIZARD': '🧙‍♂️ ウィザード',
        'SORCERER': '🔮 ソーサラー',
        'MAGICIAN': '🃏 マジシャン',
        'WARMAGE': '⚔️ ウォーメイジ',
        'MASTER': '👑 スペルマスター',
        'ALCHEMIST': '🎒 アルケミスト',
        'BREAKER': '🛡️ ブレイカー',
        'NECRO': '🦇 ネクロマンサー'
    };
    
    // 表示用の職業名をグローバル金庫に保存（ステータス画面と同期用）
    window.pStyleName = jobNames[styleKey] ? jobNames[styleKey].replace(/[^a-zA-Z0-9\u30a0-\u30ff\u3040-\u309f\u4e00-\u9faf]/g, '') : "ウィザード";

    // 🧙‍♂️ ①絶対基準：ウィザード（正統バランス）の初期ステータス
    window.pSavedStats = { str:11, dex: 11, con: 12, int: 18, wis: 14, cha: 10 };
    
    // 各種Z仕様ボーナス変数の初期化
    let hpBonus = 0;
    let mpBonus = 0;
    window.pMpCostOffset = 0; // ソーサラー用の消費MP軽減（-1）フラグ

    // 初期呪文の基本セット（ファイア、アイス、スクリーム）
    window.playerSpells = ['fire','aero','wasp2','scis','def'];

    // 🔮 【Developer Z指定】厳選職業のプラスマイナス差分・完全連動ロジック
    if (styleKey === 'SORCERER') {
        // ・ソーサラー（Int＋1、ST-1、HP-10、MP＋10、MP消費―1）
        window.pSavedStats.int += 1;
        window.pSavedStats.str -= 1;
        hpBonus = -10;
        mpBonus = 10;
        window.pMpCostOffset = -1; // 🎯 消費MPを1減らす特権(現状配線無し) 
    } 
    else if (styleKey === 'WARMAGE') {
        // ・ウォーメイジ（ST＋3、con+1、Int-1、Wiz-1、HP＋10、MP－10）
        window.pSavedStats.str += 3;
        window.pSavedStats.con += 1;
        window.pSavedStats.int -= 1;
        window.pSavedStats.wis -= 1;
        hpBonus = 10;
        mpBonus = -10;
    } 
    else if (styleKey === 'MASTER') {
        // ・スペルマスター（HP-10、MP-10、初期魔法が4つ）
        hpBonus = -10;
        mpBonus = -10;
        
    } 
    else if (styleKey === 'ALCHEMIST') {
        // ・アルケミスト（HP-10、MP-10、戦闘終了時のアイテムドロップ＋1）
        hpBonus = -10;
        mpBonus = -10;
        // 🎒【既存ロジック完全保護】アルケミスト専用のカバン初期補給
        if (typeof window.itemInventory === 'object') {
            Object.keys(window.itemInventory).forEach(k => window.itemInventory[k] = 6);
        }
    }

    // 💖 最終的な最大限界値をZ逆算数理ルールで自動計算（互換性のために両方の変数に代入）
    window.pMaxHp = (window.pSavedStats.con * 7) + hpBonus;
    window.pMaxMp = (window.pSavedStats.int * 3 + window.pSavedStats.wis) + mpBonus;
    window.pSavedMaxHp = window.pMaxHp;
    window.pSavedMaxMp = window.pMaxMp;

    // 計算完了した最強の能力値で現在値を満タンに初期化！
    window.pLevel = 1;
    window.pSavedLevel = 1;
    window.pHp = window.pMaxHp;
    window.pMp = window.pMaxMp;

    // 聖力SEの再生（完全復元）
    if (typeof playSE === 'function') playSE(SOUND_FREEZE_DEAD || SOUND_HOLY); 

    // UIテキスト差し替え（完全復元）
    const pNameNode = document.getElementById('p-name');
    if (pNameNode && jobNames[styleKey]) {
        pNameNode.innerText = jobNames[styleKey];
    }

    // 🎬【画面遷移完全復元】：セッティング画面を消し、タイトル画面を表示してBGMを起動
    const setScreen = document.getElementById('scr-setting'); if (setScreen) setScreen.style.display = 'none';
    const startScreen = document.getElementById('scr-start'); if (startScreen) startScreen.style.display = 'block';
    if (typeof startBGM === 'function') startBGM("title");
    
    console.log(`✨ [Z仕様大開通] 職業: ${window.pStyleName} 確定。HP:${window.pHp} / MP:${window.pMp}`);
};


// ==========================================
// 📦  【４】主人公ステータス基本構成
// ==========================================
// 🔮 【Developer Z設計】モダン・カードデザイン案A：ステータス画面インジェクション回路
(function() {

    // 🔮 【Developer Z設計】ウィザード特化型・初期能力値のデータバンク開通
window.pSavedStats = {
    str: 8,   // 筋力（杖の打撃）
    dex: 12,  // 敏捷（回避・物理防御）
    con: 12,  // 耐久（最大HPの基準：12×5＝60）
    int: 18,  // 知力（最大MPの基準＆魔法威力補正：1.8倍）
    wis: 14,  // 判断（最大MPへの加算ボーナス）
    cha: 10   // 魅力
};

// 💖耐久(CON)と知力(INT)から、ゲーム開幕時の最大HP・最大MPを自動計算して配線
window.pMaxHp = window.pSavedStats.con * 10;        // ➔ 60
window.pMaxMp = window.pSavedStats.int * 3 + window.pSavedStats.wis; // ➔ 68

// 現在値も満タンでスタート
window.pHp = window.pMaxHp;
window.pMp = window.pMaxMp;

// 1. 【新・自動一括配線】特定の呪文コストを個別定義（ここへ自由に追記・変更できます）
    const customMpConfig = {
        fire: 2,  // 初級はMP 2に抑える
        ice: 2,
        scis: 2,
        wasp: 2,
        
        mete: 5,  // 超上級は重くMP 5に設定
        come: 5,
        ulti: 5,
        holy: 5   // 🌟 ホーリーも特別にMP 5に指定！
    };

    // 2. 全24以上の呪文名簿（SPELLS）を全スキャンし、一括コスト注入
    if (typeof SPELLS !== 'undefined') {
        for (let key in SPELLS) {
            if (customMpConfig[key] !== undefined) {
                // 上の customMpConfig に名前がある呪文は、その指定数値をセット
                SPELLS[key].mp = customMpConfig[key];
            } else {
                // 🌟 それ以外の呪文（例: flod, quak, scre, drai, bio, dead, wasp2等）は
                // 1文字も手動で書く必要なく、全自動で一律「消費MP: 3」を直撃注入！
                SPELLS[key].mp = 3;
            }
        }
    }

    // 2. プレイヤーの初期呪文カバンを「ファイア、アイス、スクリーム」で強制開通
    // （既存の配列がない、または1Fリセット時に呼び出されます）
    window.initPlayerDefaultSpells = function() {
        window.playerSpells = ['fire'];
    };

    // 起動テスト：もし現在カバンが空っぽなら、その場で初期呪文を支給
    if (!window.playerSpells || window.playerSpells.length === 0) {
        window.initPlayerDefaultSpells();
    }
})();
// =============================================================================
// 📦 【５】新・経験値テーブル ＆ レベルアップ駆動データバンク（ランダムダイス成長システム）
// =============================================================================
window.pExp = 0; // 🎮 開幕時の累積経験値

/**
 * 現在のレベルに応じた「次のレベルまでに必要なEXP」を逆算するマイルド数理回路
 */
window.getRequiredExpForNextLevel = function(currentLevel) {
    return 50 + (currentLevel * 25); // Lv1なら75、Lv2なら100、Lv3なら125...
};
window.growCoreStatsRandomly = function() {
    if (!window.playerStats) return { text: "", gains: { str:0, dex:0, con:0, int:0, wis:0, cha:0 } };

    // 🎲 成長ポイント（0〜2P）をランダムに獲得
    const totalPoints = Math.floor(Math.random() * 3); 
    const gains = { str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0 };

    if (totalPoints > 0) {
        // 🧙‍♂️ 魔術師特権：INとWISはチケット15枚（他の1.5倍、50%高い確率）
        const pool = [
            { key: 'str', tickets: 6 }, { key: 'dex', tickets: 6 }, { key: 'con', tickets: 8 },
            { key: 'int', tickets: 25 }, { key: 'wis', tickets: 20 }, { key: 'cha', tickets: 8 }
        ];

        let totalTickets = pool.reduce((sum, item) => sum + item.tickets, 0);

        for (let p = 0; p < totalPoints; p++) {
            let roll = Math.floor(Math.random() * totalTickets);
            let currentSum = 0;
            
            for (let i = 0; i < pool.length; i++) {
                currentSum += pool[i].tickets;
                if (roll < currentSum) {
                    const selectedKey = pool[i].key;
                    // ⚠️ 2P獲得できるのは int と wis のみという絶対制約
                    if ((selectedKey !== 'int' && selectedKey !== 'wis') && gains[selectedKey] >= 1) {
                        const rescueKey = Math.random() < 0.5 ? 'int' : 'wis';
                        gains[rescueKey]++;
                    } else {
                        gains[selectedKey]++;
                    }
                    break;
                }
            }
        }
    }

    // 能力値金庫へ直撃加算 ＆ 永久セーブ同期
    window.playerStats.str += gains.str;
    window.playerStats.dex += gains.dex;
    window.playerStats.con += gains.con;
    window.playerStats.int += gains.int;
    window.playerStats.wis += gains.wis;
    window.playerStats.cha += gains.cha;
    window.pSavedStats = { ...window.playerStats };

    // ログテキスト構築
    let logParts = [];
    if (gains.int > 0) logParts.push(`知力(INT)＋${gains.int}`);
    if (gains.wis > 0) logParts.push(`判断(WIS)＋${gains.wis}`);
    if (gains.con > 0) logParts.push(`耐久(CON)＋${gains.con}`);
    if (gains.str > 0) logParts.push(`筋力(STR)＋${gains.str}`);
    if (gains.dex > 0) logParts.push(`敏捷(DEX)＋${gains.dex}`);
    if (gains.cha > 0) logParts.push(`魅力(CHA)＋${gains.cha}`);
    
    const reportText = logParts.length 
        ? `<br><span style="color:#10b981; font-size:0.8rem;">📊 能力値上昇(計${totalPoints}P)：${logParts.join(' | ')}</span>`
        : `<br><span style="color:#94a3b8; font-size:0.8rem;">📊 能力値上昇：成長Pなし（0P）</span>`;

    return { text: reportText, gains: gains };
};
// 🟢 ここまで貼り付け


// =============================================================================
// 🌟 【６】状態異常・環境変化 一元管理マスターデータベース（28種完全統合）
// =============================================================================
window.STATUS_EFFECT_MASTER = {
    // --- 1. 回復阻害系 ---
    pain: { name: "激痛", icon: "💥", bg: "linear-gradient(135deg, #7f1d1d, #b91c1c)", type: "回復阻害" },
    chain: { name: "呪縛", icon: "⛓️", bg: "linear-gradient(135deg, #1e1b4b, #4338ca)", type: "回復阻害" },

    // --- 2. アイコン・行動阻害系 ---
    curse: { name: "呪い", icon: "🔒", bg: "#4b5563", type: "アイコン阻害" },
    mute: { name: "封印", icon: "🔕", bg: "#7c3aed", type: "アイコン阻害" },
    corrode: { name: "溶解", icon: "💦", bg: "#eab308", type: "防御ダウン" },

    // --- 3. 攻撃・バフ系 ---
    enemyMana: { name: "強化", icon: "⚡", bg: "#dc2626", type: "攻撃アップ" },
    mana: { name: "集中", icon: "✨", bg: "#06b6d4", type: "攻撃アップ" },

    // --- 4. スリップダメージ系 ---
    burn: { name: "火傷", icon: "🔥", bg: "#f97316", type: "スリップダメージ" },
    poison: { name: "猛毒", icon: "🧪", bg: "#16a34a", type: "スリップダメージ" },

    // --- 5. 行動不能（麻痺）系 ---
    paralyze: { name: "麻痺", icon: "🔆", bg: "#eab308", type: "麻痺" },
    freeze: { name: "凍結", icon: "❄️", bg: "#2563eb", type: "麻痺" },
    petrify: { name: "石化", icon: "🧱", bg: "#6b7280", type: "麻痺" },
    sleep: { name: "睡眠", icon: "💤", bg: "#4f46e5", type: "麻痺" },
    white: { name: "氷結", icon: "❄️", bg: "#0ea5e9", type: "麻痺" },

    // --- 6. 行動順・タイムライン系 ---
    slow: { name: "遅延", icon: "🌀", bg: "#0284c7", type: "麻痺の亜種" },
    haste: { name: "加速", icon: "🏹", bg: "#10b981", type: "麻痺の亜種" },

    // --- 7. 防御・バフ系 ---
    shield: { name: "防御盾", icon: "🛡️", bg: "#2563eb", type: "防御" },
    giddy: { name: "眩暈", icon: "🌀", bg: "#64748b", type: "防御" },
    ironShield: { name: "鉄壁", icon: "🧱", bg: "#1e293b", type: "防御" },
    amulet: { name: "加護", icon: "🔰", bg: "#15803d", type: "防御" },

    // --- 8. 特殊・ユニーク環境系 ---
    blind: { name: "盲目", icon: "🕶️", bg: "#374151", type: "盲目" },
    mist: { name: "濃霧", icon: "🌫️", bg: "#94a3b8", type: "空間・回避" },
    confuse: { name: "混乱", icon: "🔄", bg: "#b45309", type: "精神異常" },
    oiled: { name: "油化", icon: "🛢️", bg: "#78350f", type: "属性・行動" },
    reflect: { name: "反射", icon: "🪞", bg: "#0891b2", type: "カウンター" },
    doom: { name: "宣告", icon: "⬛", bg: "#0f172a", type: "カウントデス" },
    parasite: { name: "寄生", icon: "🪱", bg: "#a21caf", type: "麻痺＋スリップ" },
    grudge: { name: "怨恨", icon: "🪦", bg: "#4a044e", type: "特殊カウンター" },
    storm: { name: "嵐環境", icon: "⛈️", bg: "linear-gradient(135deg, #334155, #1e293b)", type: "天候異常" }
};

// =============================================================================
// 🔄 【移籍】共通システム：ステータス初期化回路
// =============================================================================
window.playerStatus = {};
window.enemyStatus = {};

window.clearAllStatusTurns = function() {
    Object.keys(window.STATUS_EFFECT_MASTER).forEach(id => {
        window.playerStatus[id + "Turns"] = 0;
        window.enemyStatus[id + "Turns"] = 0;
    });
};
window.clearAllStatusTurns(); // 初回起動時に一度実行して器を空にする

// =============================================================================
// 🔮 【７】デバッグ機能
// =============================================================================
// =============================================================================
// 🔮 【案2移籍】時空跳躍デバッグ：潜入階層選択モーダル生成
// =============================================================================
window.triggerDebugWarpSelect = function() {
    let oldMenu = document.getElementById('debug-warp-modal'); if (oldMenu) oldMenu.remove();
    if (typeof playSE === 'function') playSE(SOUND_HOLY);

    let modal = document.createElement('div'); modal.id = 'debug-warp-modal';
    modal.style.cssText = "position:absolute; top:10%; left:5%; width:90%; height:80%; background:#0f172a; border:3px double #8b5cf6; border-radius:12px; z-index:100010; padding:15px; box-sizing:border-box; display:flex; flex-direction:column; font-family:monospace; color:#fff;";
    
    let buttonsHtml = "";
    for (let i = 1; i <= 40; i++) {
        let stageData = window.STAGES[i - 1]; 
        let enemyName = (stageData && stageData.name) ? stageData.name : "未知の敵";
        
        buttonsHtml += `<button onclick="window.executeDebugJump(${i})" style="background:#1e1b4b; border:1px solid #4338ca; color:#fff; padding:8px 4px; border-radius:4px; font-weight:bold; cursor:pointer; font-size:0.75rem; text-align:center; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">F${i}<br><span style="color:#a7f3d0; font-size:0.65rem;">${enemyName}</span></button>`;
    }

    modal.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; border-bottom:1px dashed #8b5cf6; padding-bottom:6px; font-family:monospace;">
            <span style="color:#c084fc; font-weight:bold; font-size:0.95rem;">🔮 時空跳躍デバッグ：潜入階層選択</span>
            <button onclick="document.getElementById('debug-warp-modal').remove()" style="background:#ef4444; color:#fff; border:none; padding:3px 8px; border-radius:4px; cursor:pointer; font-weight:bold; font-size:0.8rem;">閉じる</button>
        </div>
        <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:6px; overflow-y:auto; flex:1; padding-right:2px; font-family:monospace;">
            ${buttonsHtml}
        </div>
    `;
    document.body.appendChild(modal);
};

// =============================================================================
// 🔮 【案2移籍】デバッグ用ジャンプ実行回路
// =============================================================================
window.executeDebugJump = function(floorNum) {
    let menu = document.getElementById('debug-warp-modal'); if (menu) menu.remove();
    window.curIdx = floorNum - 2; // nextStage内で++されるため-2で調整
    window.isBusy = false; window.battleStepState = 'NONE';
    if (typeof playSE === 'function') playSE(SOUND_FREEZE_DEAD); 
    if (typeof window.nextStage === 'function') window.nextStage();
};

// =============================================================================
// 🔮 【案2移籍】デバッグ用フル装備補給（24魔法・20アイテム一括注入）
// =============================================================================
window.triggerDebugFullEquip = function() {
    // 📜 1. 魔法呪文を全種類一斉に永久記憶
    if (typeof SPELLS !== 'undefined') window.playerSpells = Object.keys(SPELLS); 
    
    // 🧪 2. カバンの中身をフルセット（全アイテム9個）に補充
    Object.keys(window.itemInventory).forEach(k => window.itemInventory[k] = 9); 
    
    // 📊 3. 【ディレクター仕様】HPもMPも、最大上限と現在値を同時に8000に大覚醒！
    window.pMaxHp = 8000;
    window.pSavedMaxHp = 8000;
    window.pHp = 8000; // 💖 HPを8000にチャージ！
    
    window.pMaxMp = 8000;
    window.pSavedMaxMp = 8000;
    window.pMp = 8000; // 🔷 MPを8000にチャージ！

    if (typeof playSE === 'function') playSE(SOUND_HOLY);
    
    const box = document.getElementById('battle-log') || document.getElementById('inter-result-box');
    if (box) box.innerHTML = "⚡ 【デバッグ特権】全魔法・全アイテムを補給し、HP・MPともに【8000 / 8000】へフルブーストしました！";
    
    // 🧼 画面上のステータス文字やバーを即座に最新状態（分母8000）に描き直す！
    if (typeof window.updateStatusBadgesUI === 'function') window.updateStatusBadgesUI();
    if (typeof updateHpUI === 'function') updateHpUI();
};

// =============================================================================
// 🔮 【案2移籍】デバッグ用・羊皮紙強制解析回路
// =============================================================================
window.triggerDebugReadScroll = function() {
    if (window.curIdx < 0 || !window.STAGES[window.curIdx]) return;
    const data = window.STAGES[window.curIdx]; 
    if (typeof playSE === 'function') playSE(SOUND_HOLY);
    const box = document.getElementById('battle-log') || document.getElementById('inter-result-box');
    if (box) box.innerHTML = `📜 【デバッグ・羊皮紙解析】敵の生データ解説:「${data.txt}」`;
};
