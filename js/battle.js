//【0】目次
//【１】🌟状態異常・環境変化 一元管理マスターデータベース（28種完全統合）
//【２】🔄共通システム：ステータス初期化回路
// 🧼 【次戦持ち越し完全粉砕回路】
//【３】⚔️ グローバル戦闘ステータス管理変数の窓口開通
// 🕹️ ローグライト回路
// 🧪 敵側の状態異常永続カウンターの一括設置
// その他（プロローグデータ定義、タイマーID、バッグ初期化）
//【４】【コマンド窓空白タップ対応】どこでもクリック進行最適化（完全大開通版）
//【５】🏰 5大職業・3ステップ選択式セッティングUI
//【６】効果ラベル表示：全28種類の新・一元管理IDを戦闘画面最上部に配置させるUI制御回路
// 🎨 睡眠、毒、凍結などの特殊効果のCSSビジュアル更新処理
//【７】モンスターの色彩制御
//【８】🚀 . ステージ・戦闘遷移
//【９】🎒 大容量アイテム使用（全20大アイテムロジック完全復活！）
//【10】🧙‍♂️ プレイヤー魔導アクション【全24魔法の計算＆固有テキスト完全復旧】
//【11】👹エネミーターン固有特殊技・完全大蘇生有線回路
//【12】🔊 【完全バグ粉砕】新・大技SE音響個別管理回路 & 一元管理ID同期化
//【13】👹 全15体型・絶対個別判定式モンスター大技配線
//【14】📉 ダメージ処理＆ログ転送
//【15】🎰 3連魔導スクロール回転スロットカードドラフト演出実装
//【16】その他
// 🎰 スペルドラフト処理を完全バイパスし、昔のシンプルな直結進級ルートへリフォーム
// 🎰 クリアエンディング＆敗北リトライ遷移制御
// 🛡️ 🏆 【描画衝突バグガードレール】
// 🔮 リセットゲーム
//【17】ステータス画面
//=============================================================================
// 【１】🌟状態異常・環境変化 一元管理マスターデータベース（28種完全統合）　MAINJSに移植済
// =============================================================================



// =============================================================================
// 【２】🔄共通システム：ステータス初期化回路
// =============================================================================
// プレイヤーと敵のステータス内に、28種すべての「〇〇Turns」の器を自動で一発設営します！MAINJSに移植済


// ==========================================
// 【３】⚔️ グローバル戦闘ステータス管理変数の窓口開通
// ==========================================
/// ==========================================
// 🕹️ ローグライト回路 ＆ コア能力値データバンク（Zチューニング統合）
// ==========================================
console.log("%c🔄 [BATTLE SYSTEMS] Ver 27.00: 24魔法・20アイテム完全サルベージ復元＆最新ローグライト・デバッグ仕様マージ完全版神コード。", "color: #00ffff; font-weight: bold;");

// 🪦 【ローグライト隔離セーブメモリ】：死んでも永久に引き継がれる強さの記憶
if (window.pSavedLevel === undefined) {
    window.pSavedLevel = 1;
    // 💡【新規追加】：レベルアップしても消えない「基礎能力値」の記憶スロット
    window.pSavedStats = { str: 8, dex: 12, con: 12, int: 18, wis: 14, cha: 10 };
    window.pSavedMaxHp = 80; // CON(12) × 5 +20= 80
    window.pSavedMaxMp = 44; // ウィザード初期MP
    window.pSavedSpells = ['fire','scre','wasp2','scis','def']; // 初期魔法
}

// ==================================================================
// 🎮 4. 【テストプレイ専用】初期アイテム数ロック回路
// ==================================================================
// ゲーム開始時に、全20アイテムの所持数をテスト用のガチ数値で固定します。
window.itemInventory = {
    'potion': 3,   // 🧪 回復薬は3個からスタート！
    'mana': 0,  
    'bomb': 1,   
    'potion': 3,   // 🧪 回復薬は3個からスタート！
    'hour': 0,
    'wing': 0,
    'bone': 1,

    // 🛑 残りのアイテムは全部「0個」にして、テストプレイ用にロック！
    'elix': 0, 'cure': 0, 'whet': 0, 'mirr': 0, 
    'scro': 0, 'smok': 0, 'web': 0,  
    'ston': 0, 'cand': 0, 'jewe': 0, 'hone': 0, 'spor': 0, 'scal': 0
};

console.log("%c🎒 [TEST PLAY] 初期アイテムをテスト用に制限しました。回復薬(3)、お守り(1)、他は0個です。", "color: #ffaa00; font-weight: bold;");



// 🛠️ 【フリーズ原因完全粉砕】：プロローグ管理用インデックスを確実に窓口定義
window.prologueIdx = 0;

// ==========================================
// 管理変数の窓口開通（コアステータス数理連動版）
// ==========================================
window.curIdx = -1;
window.pLevel = window.pSavedLevel;

// 💡【新規追加】：隔離メモリから現在の6大能力値を引き継ぎロード
window.playerStats = { ...window.pSavedStats };

// 💡【新規追加】：中間作品用・装備品3スロットのデータ定義
window.playerEquipment = {
    weapon: { name: "ブロンズロッド", atk: 2, matk: 10, bonusInt: 1 },
    armor: { name: "魔術師のローブ", def: 4, mdef: 8, bonusWis: 1 },
    accessory: { name: "水晶の指輪", bonusInt: 2 } // INT+2
};

// 💡【新規追加】：6大能力値と装備から「戦闘ステータス」をガチッと逆算する数理回路
window.recalculateCoreStats = function() {
    // 装備のボーナスを含めた、実質的なINT（知力）とWIS（判断力）を計算
    let totalInt = window.playerStats.int + window.playerEquipment.weapon.bonusInt + window.playerEquipment.accessory.bonusInt;
    let totalWis = window.playerStats.wis + window.playerEquipment.armor.bonusWis;

    // 設計図通りの計算式をプログラムに直撃
    window.pMaxHp = (window.playerStats.con * 10) + 20;
    window.pMaxMp = (totalInt * 3) + totalWis;      // 最大MP ＝ (INT×3) ＋ WIS
    
    window.pAtk = window.playerStats.str + window.playerEquipment.weapon.atk;   // 物理攻撃 ＝ STR ＋ 武器
    window.pMatk = totalInt + window.playerEquipment.weapon.matk;               // 魔法攻撃 ＝ INT ＋ 武器
    window.pDef = window.playerStats.dex + window.playerEquipment.armor.def;     // 物理防御 ＝ DEX ＋ 防具
    window.pMdef = totalWis + window.playerEquipment.armor.mdef;                // 魔法防御 ＝ WIS ＋ 防具
};

// 💡【新規追加】：立ち上げ時に上の計算式を1回トントンと叩いて、全ステータスを自動計算させる
window.recalculateCoreStats();

// 💡【既存との同期】：計算された最大値を、バトルの現在値（HP/MP）にカチッとハメ込む
window.pHp = window.pMaxHp;
window.pMp = window.pMaxMp;

// 💡【既存変数の復旧】：ここから下は、既存のバトルロジックが愛用している変数たちを無傷で再開
window.playerSpells = [...window.pSavedSpells];
window.pStyle = "WIZARD";
window.eHp = 100;
window.eMaxHp = 100;
window.mana = 1.0;
window.isBusy = false;

window.enemyMana = 1.0;
window.isEnemyShieldActive = false;
window.isIronIronShieldActive = false; // 🛡️ アイアンゴーレム専用：被ダメ1固定化フラグ

// ==================================================================
// 🧪 敵側の状態異常永続カウンターの一括設置
// ==================================================================
window.enemyBurnTurns = 0;     // 🔥火傷カウンター
window.enemyfreezeTurns = 0;   // ❄️凍結カウンター
window.enemySleepTurns = 0;    // 💤睡眠カウンター
window.enemyParalyzeTurns = 0; // ⚡麻痺カウンター
window.enemyBlindTurns = 0;    // ✨暗闇カウンター
window.enemyPoisonTurns = 0;   // 🧪猛毒カウンター
window.enemywhiteTurns = 0;    // ❄️氷結カウンター
// 🩸 【マスター指定】デバフ状態管理カウンター
window.playerNoHealTurns = 0;   // 激痛：0なら通常、1以上でHP回復不可
window.playerNoManaTurns = 0;   // 呪縛：0なら通常、1以上でMP回復不可 👈★新しく追加！
// アイテムバッグ初期化
window.itemInventory = { 
    potion: 3, amulet: 0, elix: 0, bomb: 1, cure: 0, hour: 0, whet: 0, mirr: 0, mana: 0, scro: 0, smok: 0,
    wing: 0, web: 0, bone: 1, ston: 0, cand: 0, jewe: 0, hone: 0, spor: 0, scal: 0
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
window._freezeAnimationTimeout = null; 

// ==================================================================
// プロローグ
// ==================================================================
const PROLOGUE_STORY = [
    "かつて、この果て無き大地の中央に、天を貫く『螺旋のタワー』が聳え立っていた……。",
    "タワーの深層より溢れ出た古代の魔力は、大人しい魔物たちを凶暴な狂気へと染め上げていく。",
    "事態を重く見た若き一人の魔導士は、世界に平穏を取り戻すため、単身タワーの潜入を決意する。",
    "しかし、最上階には破滅の災厄『暗黒竜』が、あらゆる侵入者を焼き尽くさんと待ち受けていた──。"
];

// ==========================================
// 🕹️ 【４】【コマンド窓空白タップ対応】どこでもクリック進行最適化（完全大開通版）
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    // 🎯 反応させたいターゲット（ボード、コマンドパネル、ログウィンドウ、ページ全体）
    const fullClickTargets = ['#sq-board', '#cmd-panel', '#battle-log', 'body'];
    
    fullClickTargets.forEach(selector => {
        const element = document.getElementById(selector.replace('#','')) || document.querySelector(selector);
        if (element) {
            element.addEventListener("click", (e) => {
                // 🔄 ターンが完了状態（PLAYER_DONE や ENEMY_DONE）のときは、進行待ち（▶）画面です。
                if (window.battleStepState !== 'NONE') {
                    // 🌟 【マスター指定・ボタン貫通スキップパッチ】
                    // 進行待ちの時は、たとえコマンドボタン（A面）が押されたとしても、
                    // ボタン本来のイベント（ターン2重実行のバグなど）を完全に停止させ、テキストスキップを最優先でキックする！
                    e.preventDefault();
                    e.stopPropagation();
                    
                    window.advanceBattleStep();
                    return; // 進行を完了したのでここで即座に脱出
                }
            });
        }
    });

    // 🌟 【マスター指定：テキストウィンドウ内の子要素（文字や▶）のクリック判定の奪い合いを完全解決！】
    const battleLog = document.getElementById('battle-log');
    if (battleLog) {
        battleLog.addEventListener("click", (e) => {
            // テキストウィンドウ自身、または中の文字（spanや文字ノード）がクリックされた場合
            if (window.battleStepState !== 'NONE') {
                e.preventDefault();
                e.stopPropagation(); 
                window.advanceBattleStep();
            }
        });
    }
    
    window.injectStatusHeaderContainers();
    window.buildPrologueAndSettingUI(); 
});

window.injectStatusHeaderContainers = function() {
    const effScr = document.getElementById('eff-scr');
    if (effScr && !document.getElementById('status-badge-header')) {
        const header = document.createElement('div');
        header.id = 'status-badge-header';
        // 🧱 【中央空白死守】左右に完全分離し、真ん中のVS領土を絶対に侵害させないフレックス配置
        header.style.cssText = "position:absolute; top:5px; left:0; width:100%; padding:0 10px; box-sizing:border-box; display:flex; justify-content:space-between; z-index:999; pointer-events:none;";
        
        // 🧱 【自動2段改行】プレイヤー側：最大4列まで横に並び、5個目から自動で2段目に回るグリッド
        const pRow = document.createElement('div');
        pRow.id = 'player-status-row';
        pRow.style.cssText = "display:grid; grid-template-columns: repeat(4, auto); gap: 4px; justify-items: start; max-width: 42%;";
        
        // 🧱 【自動2段改行】敵側：最大4列まで横に並び、5個目から自動で2段目に回るグリッド（右詰め仕様）
        const eRow = document.createElement('div');
        eRow.id = 'enemy-status-row';
        eRow.style.cssText = "display:grid; grid-template-columns: repeat(4, auto); gap: 4px; justify-items: end; max-width: 42%; text-align: right;";
        
        header.appendChild(pRow);
        header.appendChild(eRow);
        effScr.appendChild(header);
    }
};


// ==========================================
// 🕹️ 【５】🏰 職業選択式セッティングUI
// ==========================================

window.buildPrologueAndSettingUI = function() {
    const mainWrapper = document.body; if (!mainWrapper) return;
    const proDiv = document.createElement('div'); proDiv.id = 'scr-prologue';
    proDiv.innerHTML = `
        <div style="max-width: 500px; margin: 40px auto; text-align: center; font-family: monospace;">
            <div id="prologue-text-box" style="text-align: left; min-height: 250px; white-space: pre-wrap; line-height:2;"></div>
            <div style="color: #64748b; font-size: 0.9rem; margin-top: 40px; animation: pulse 1.5s infinite; cursor:pointer;">【 画面をクリックして進む 】</div>
        </div>
    `;
    mainWrapper.appendChild(proDiv);

    const setDiv = document.createElement('div'); setDiv.id = 'scr-setting';
    setDiv.innerHTML = `
        <div style="max-width: 480px; margin: 0 auto; font-family: monospace; height:100%; overflow-y:auto; padding-bottom:30px;">
            <div class="setting-title">🔮 魔導士の職業クラス選択セッティング</div>
            <div id="class-select-zone">
                <div class="class-card" onclick="window.selectPlayerStyle('WIZARD', 100, 100)">
                    <div class="class-name" style="color: #cbd5e1;">🧙‍♂️ ウィザード (正統派バランス)</div>
                    <div class="class-desc">初期HP:普通 / 初期MP:普通 <br>多くの呪文・道具をバランスよく発動できる初心者向けスタイル。</div>
                </div>
                <div class="class-card" onclick="window.selectPlayerStyle('SORCERER', 90, 160)">
                    <div class="class-name" style="color: #3b82f6;">🔮 ソーサラー (魔力強化)</div>
                    <div class="class-desc">初期HP:少し弱め / 初期MP:強め <br>勉強量が多く優れた魔力量を誇る。魔法の使い方や知識に長けている。</div>
                </div>
                <div class="class-card" onclick="window.selectPlayerStyle('WARMAGE', 80, 80)">
                    <div class="class-name" style="color: #ef4444;">⚔️ ウォーメイジ (魔剣攻撃特化)</div>
                    <div class="class-desc">初期HP:強め / 初期MP:少し弱め　<br>魔法修練の傍ら、筋トレや肉体強化もしている。生存能力が少し高い。</div>
                </div>
                <div class="class-card" onclick="window.selectPlayerStyle('MASTER', 70, 110)">
                    <div class="class-name" style="color: #a855f7;">👑 スペルマスター (呪文探究家)</div>
                    <div class="class-desc">初期HP:少し弱め / 初期MP:少し弱め <br>呪文書や魔法歴史学への造詣が深く、呪文構造への理解が早い。</div>
                </div>
                <div class="class-card" onclick="window.selectPlayerStyle('ALCHEMIST', 130, 60)">
                    <div class="class-name" style="color: #10b981;">🎒 アルケミスト (錬金術士)</div>
                    <div class="class-desc">初期HP:少し弱め / 初期MP:少し弱め <br>魔法素材や魔道科学に詳しい。アイテムドロップ獲得数が＋1。</div>
                </div>

<div style="display: none;">
                <div class="class-card" onclick="window.selectPlayerStyle('MAGICIAN', 95, 95)">
                    <div class="class-name" style="color: #eab308;">🃏 マジシャン (奇術のデバフ)</div>
                    <div class="class-desc">初期HP:95 / 初期MP:95 <br>搦め手の天才。火傷や麻痺、凍結や猛毒などの状態異常持続ターンが常に「+1ターン」延長。</div>
                </div>

                <div class="class-card" onclick="window.selectPlayerStyle('BREAKER', 100, 100)">
                    <div class="class-name" style="color: #6366f1;">🛡️ スペルブレイカー (魔封の盾)</div>
                    <div class="class-desc">初期HP:100 / 初期MP:100 <br>敵から受ける嫌な状態異常（麻痺・封印・溶解・呪い・鈍足）の持続を常に「-1ターン軽減（最低0）」防壁。</div>
                </div>
                <div class="class-card" onclick="window.selectPlayerStyle('NECRO', 85, 105)">
                    <div class="class-name" style="color: #ec4899;">🦇 ネクロマンサー (暗黒吸血)</div>
                    <div class="class-desc">初期HP:85 / 初期MP:105 <br>闇の契約者。ドレインのHP吸収効率が「2倍（味方HP40回復）」になり、デスの成功率も30%上乗せ。</div>
                </div>
            </div>
        </div>
    `;
    mainWrapper.appendChild(setDiv);
    window.startPrologueFlow();
};

window.startPrologueFlow = function() {
    // 初期化時にすべての画面（戦闘画面含む）を一度正しく非表示にロック
    const screens = ['scr-start', 'scr-intro', 'scr-battle', 'scr-result', 'scr-setting', 'scr-intermission']; 
    screens.forEach(id => { const el = document.getElementById(id); if (el) el.style.display = 'none'; }); 
    
    const proScreen = document.getElementById('scr-prologue'); if (proScreen) proScreen.style.display = 'block'; 
    window.prologueIdx = 0;
    window.nextPrologueLine();

    proScreen.onclick = function() {
        window.prologueIdx++;
        if (window.prologueIdx < PROLOGUE_STORY.length) { window.nextPrologueLine(); } 
        else {
            proScreen.style.display = 'none';
            // 職業選択セッティング画面を起動
            const setScreen = document.getElementById('scr-setting'); if (setScreen) setScreen.style.display = 'block'; 
        }
    };
};

window.nextPrologueLine = function() {
    const box = document.getElementById('prologue-text-box');
    if (box) {
        if (window.prologueIdx === 0) box.innerHTML = "";
        box.innerHTML += `<div class="prologue-line">${PROLOGUE_STORY[window.prologueIdx]}</div>`;
        if (typeof playSE === 'function') playSE(SOUND_HOLY); 
    }
};
// 魔道職業セッティングはMainJSに引っ越し済

// ==========================================
// 🕹️ 【６】効果ラベル表示：全28種類の新・一元管理IDを戦闘画面最上部に配置させるUI制御回路
// ==========================================
/**dokonian
* 🏆
 */
window.updateStatusBadgesUI = function() {

    window.injectStatusHeaderContainers(); 
    const pRow = document.getElementById('player-status-row');
    const eRow = document.getElementById('enemy-status-row');
    
    if (pRow) {
        pRow.innerHTML = ""; 
        // 🔄 【大開通】古い○×フラグを見張るのをやめ、新IDの残りターン（Turns > 0）をハキハキ監視！
        if (window.playerStatus.paralyzeTurns > 0) pRow.innerHTML += `<span class="retro-status-tag" style="background:#eab308; color:#000;">🔆 麻痺:${window.playerStatus.paralyzeTurns}T</span>`;
        if (window.playerStatus.whiteTurns > 0)    pRow.innerHTML += `<span class="retro-status-tag" style="background:#2563eb; color:#fff; box-shadow:0 0 10px #88a8ec;">❄️ 氷結:${window.playerStatus.whiteTurns}T</span>`;
        if (window.playerStatus.muteTurns > 0)     pRow.innerHTML += `<span class="retro-status-tag" style="background:#7c3aed; color:#fff;">🔕 封印:${window.playerStatus.muteTurns}T</span>`;
        if (window.playerStatus.corrodeTurns > 0)  pRow.innerHTML += `<span class="retro-status-tag" style="background:#38ca70; color:#000;">💦 溶解:${window.playerStatus.corrodeTurns}T</span>`;
        if (window.playerStatus.curseTurns > 0)    pRow.innerHTML += `<span class="retro-status-tag" style="background:#4b5563; color:#fff;">🔒 呪い:${window.playerStatus.curseTurns}T</span>`;
        
        // 💥 回復阻害・環境変化も新IDへ完全同期
        if (window.playerStatus.painTurns > 0)   pRow.innerHTML += `<span class="retro-status-tag" style="background:linear-gradient(135deg, #7f1d1d, #b91c1c); color:#fff; box-shadow:0 0 8px #ef4444;">💥 激痛:${window.playerStatus.painTurns}T</span>`;
        if (window.playerStatus.chainTurns > 0)  pRow.innerHTML += `<span class="retro-status-tag" style="background:linear-gradient(135deg, #1e1b4b, #38ca70); color:#fff; box-shadow:0 0 8px #6366f1;">⛓️ 呪縛:${window.playerStatus.chainTurns}T</span>`;
        if (window.playerStatus.giddyTurns > 0)  pRow.innerHTML += `<span class="retro-status-tag" style="background:#64748b; color:#fff;">🌀 眩暈:${window.playerStatus.giddyTurns}T</span>`;
        if (window.playerStatus.doomTurns > 0)   pRow.innerHTML += `<span class="retro-status-tag" style="background:#0f172a; color:#fff;">⬛ 宣告:${window.playerStatus.doomTurns}T</span>`;
        if (window.playerStatus.shieldTurns > 0) {pRow.innerHTML += `<span class="retro-status-tag" style="background:#10b981; color:#fff; box-shadow:0 0 10px #34d399; font-weight:bold;">🛡️ 防御:${window.playerStatus.shieldTurns}T</span>`;
}
        if (window.isAmuletActive > 0) pRow.innerHTML += `<span class="retro-status-tag" style="background:#10b981; color:#fff;">🛡️ お守り:${window.isAmuletActive}T</span>`;


// 🌟【ネオン明滅完全大開通パッチ】
        if (window.mana > 1.0) {
            // 🎬 画面にまだ明滅の台本（CSS）がなければ、その場で強制設営！
            if (!document.getElementById("retro-pulse-badge-style")) {
                const style = document.createElement("style");
                style.id = "retro-pulse-badge-style";
                style.innerHTML = `
                    @keyframes retroBadgePulse {
                        0% { opacity: 0.3; box-shadow: 0 0 4px #06b6d4; }
                        50% { opacity: 1.0; box-shadow: 0 0 16px #0ea5e9; }
                        100% { opacity: 0.3; box-shadow: 0 0 4px #06b6d4; }
                    }
                `;
                document.head.appendChild(style);
            }
            pRow.innerHTML += `<span class="retro-status-tag" style="background:#06b6d4; color:#fff; box-shadow:0 0 12px #06b6d4; font-weight:900; animation: pulse 1.5s infinite;">✨ 集中:2.5倍</span>`;
        }
    }
    
    if (eRow) {
        eRow.innerHTML = "";
        // 🔄 敵側のデバフラベルもすべて新一元管理IDへ配線を一本化！
        if (window.enemyStatus.burnTurns > 0)     eRow.innerHTML += `<span class="retro-status-tag" style="background:#f97316; color:#fff;">🔥 火傷:${window.enemyStatus.burnTurns}T</span>`;
        if (window.enemyStatus.poisonTurns > 0)   eRow.innerHTML += `<span class="retro-status-tag" style="background:#16a34a; color:#fff; box-shadow:0 0 10px #16a34a;">🧪 猛毒:${window.enemyStatus.poisonTurns}T</span>`;
        if (window.enemyStatus.freezeTurns > 0)   eRow.innerHTML += `<span class="retro-status-tag" style="background:#2563eb; color:#fff; box-shadow:0 0 10px #a6eb25;">❄️ 凍結:${window.enemyStatus.freezeTurns}T</span>`;
        if (window.enemyStatus.sleepTurns > 0)    eRow.innerHTML += `<span class="retro-status-tag" style="background:#4f46e5; color:#fff;">💤 睡眠:${window.enemyStatus.sleepTurns}T</span>`;
        if (window.enemyStatus.paralyzeTurns > 0) eRow.innerHTML += `<span class="retro-status-tag" style="background:#eab308; color:#000;">🔆 麻痺:${window.enemyStatus.paralyzeTurns}T</span>`;
        if (window.enemyStatus.whiteTurns > 0)    eRow.innerHTML += `<span class="retro-status-tag" style="background:#2563eb; color:#fff; box-shadow:0 0 10px #88a8ec;">❄️ 氷結:${window.enemyStatus.whiteTurns}T</span>`;
        if (window.enemyStatus.blindTurns > 0)    eRow.innerHTML += `<span class="retro-status-tag" style="background:#374151; color:#fff;">🕶️ 盲目:${window.enemyStatus.blindTurns}T</span>`;
        if (window.enemyStatus.slowTurns > 0)     eRow.innerHTML += `<span class="retro-status-tag" style="background:#0284c7; color:#fff;">🌀 遅延:${window.enemyStatus.slowTurns}T</span>`;
        if (window.enemyStatus.shieldTurns > 0)   eRow.innerHTML += `<span class="retro-status-tag" style="background:#2563eb; color:#fff;">🛡️ 防御盾:${window.enemyStatus.shieldTurns}T</span>`;
        if (window.enemyStatus.chargeTurns > 0)   eRow.innerHTML += `<span class="retro-status-tag" style="background:#dc2626; color:#fff;">⚡ 強化:${window.enemyStatus.chargeTurns}T</span>`;
    }


    // 🎨 睡眠、毒、凍結などの特殊効果のCSSビジュアル更新処理
    const eContainer = document.getElementById('e-sprite-container');
    const eSpriteGraphic = document.getElementById('e-sprite-graphic');
    const data = window.STAGES[window.curIdx];

if (eContainer && eSpriteGraphic && window.curIdx >= 0) {
        eContainer.style.removeProperty("filter");
        eContainer.style.animationPlayState = "running";
        eSpriteGraphic.style.removeProperty("animation");

        // 🌟【大開通】ラベル描画と同じ新一元管理ID（enemyStatus.〇〇）へ完全に配線を直結！
        if (window.enemyfreezeTurns > 0 ) {
            eContainer.style.animationPlayState = "paused";
            eSpriteGraphic.style.animationPlayState = "paused";
            
            // 全身をセピアにしてから色相を青白に固定し、明るく輝かせて背後に影を大噴射！
            eContainer.style.setProperty(
                "filter",
                "brightness(2) saturate(0.2) drop-shadow(0 0 25px #e90ea0)",
                "important"
            );
        }




        else if (window.enemyStatus.sleepTurns > 0) {
            // 💤 睡眠：トーンダウン（マスターこだわりのふわふわグレーオーラ処理へ安全に直撃）
            eContainer.style.setProperty("filter", "brightness(0.7) drop-shadow(0 0 15px #3b82f6)", "important");
            eContainer.style.animationPlayState = "paused";
            
            // 🌟 🏆【大改造：四角枠を引き算し、楕円形のグラデーションオーラを纏わせる】
            // 四角い背景（background-color）をやめ、中心から外側へ溶けて消えるグレーの煙幕を敷きます。
            eContainer.style.background = "radial-gradient(circle, rgba(90,90,90,0.6) 0%, rgba(60,60,60,0.2) 50%, rgba(0,0,0,0) 70%)";
            
            // さらに、オーラ自体が生きているようにフワフワ揺らめく、渋いグレーの影を重ねます
            eContainer.style.boxShadow = "0 0 30px 10px rgba(80, 80, 80, 0.5)";
            eContainer.style.borderRadius = "50%"; // 四角を完全に廃止し、綺麗な円形・オーラ型にカット
            
            // 🔓 文字が箱の外（上空）へ突き抜けられる設定はそのままキープ
            eContainer.style.overflow = "visible"; 
            eContainer.style.clipPath = "none";
            // 🎬 【ステップ1】「右上へ消える」アニメーションの台本を登録（1回だけ）
            if (!document.getElementById("retro-zzz-style")) {
                const style = document.createElement("style");
                style.id = "retro-zzz-style";
                style.innerHTML = `
                    @keyframes zzzRisePop {
                        0% { transform: translate(0, 0) scale(0.6); opacity: 0; }
                        10% { opacity: 1; }
                        70% { opacity: 0.8; transform: translate(25px, -50px) scale(1.2); }
                        100% { transform: translate(35px, -70px) scale(0.5); opacity: 0; }
                    }
                    .retro-zzz-char {
                        position: absolute;
                        font-weight: 900;
                        color: #a5b4fc;
                        text-shadow: 2px 2px 0 #000;
                        font-family: monospace;
                        z-index: 10002;
                        pointer-events: none;
                        opacity: 0;
                        animation: zzzRisePop 1.8s infinite linear;
                    }
                `;
                document.head.appendChild(style);
            }

            // 🎬 【ステップ2】画面にまだ「Zの箱」がなければ設置する（上書きリセット防止）
            if (!document.getElementById("zzz-container")) {
                const zzzBox = document.createElement("div");
                zzzBox.id = "zzz-container";
                zzzBox.style.cssText = "position:absolute; top:10%; left:50%; width:0; height:0; pointer-events:none; z-index:10001;";
                
                zzzBox.innerHTML = `
                    <div class="retro-zzz-char" style="font-size:1.5rem; animation-delay: 0s;">Z</div>
                    <div class="retro-zzz-char" style="font-size:2.0rem; animation-delay: 0.5s; left:5px; top:-5px;">Z</div>
                    <div class="retro-zzz-char" style="font-size:2.6rem; animation-delay: 1.0s; left:10px; top:-10px;">Z</div>
                `;
                eContainer.appendChild(zzzBox);
            }
        }
else if (window.enemyParalyzeTurns > 0 || (window.enemyStatus && window.enemyStatus.paralyzeTurns > 0)) {
            console.log("⚡[麻痺描画ロックオン] 通過中！ 旧:", window.enemyParalyzeTurns, "新:", window.enemyStatus.paralyzeTurns);
            eContainer.style.animationPlayState = "paused";
// 全身をセピアにしてから色相を黄色（45deg）に固定し、明るく輝かせて背後に黄色い影を大噴射！
eContainer.style.setProperty("filter", "sepia(1) hue-rotate(45deg) saturate(4) brightness(1.3) drop-shadow(0 0 25px #eab308)", "important");
            
            if (!document.getElementById('retro-shake-style')) {
                const style = document.createElement('style');
                style.id = 'retro-shake-style';
                style.innerHTML = `
                    @keyframes retroVibe {
                        0% { transform: translate(1px, 1px) rotate(0deg); }
                        10% { transform: translate(-1px, -1px) rotate(-1deg); }
                        20% { transform: translate(-2px, 0px) rotate(1deg); }
                        30% { transform: translate(1px, 2px) rotate(0deg); }
                        40% { transform: translate(-1px, -1px) rotate(1deg); }
                        50% { transform: translate(2px, 1px) rotate(-1deg); }
                        100% { transform: translate(1px, -1px) rotate(1deg); }
                    }
                `;
                document.head.appendChild(style);
            }
            eSpriteGraphic.style.animation = "retroVibe 0.1s infinite";
        } 

 else if (window.enemywhiteTurns > 0 || (window.enemyStatus && window.enemyStatus.whiteTurns > 0)) {
            console.log("⚡[麻痺描画ロックオン] 通過中！ 旧:", window.enemywhiteTurns, "新:", window.enemyStatus.whiteTurns);
            eContainer.style.animationPlayState = "paused";
            eSpriteGraphic.style.animationPlayState = "paused";
            console.log(
  "STOP TEST",
  eContainer,
  getComputedStyle(eContainer).animationPlayState
);
// 全身をセピアにしてから色相を青白に固定し、明るく輝かせて背後に影を大噴射！
eContainer.style.setProperty(
  "filter",
  "brightness(2) saturate(0.2) drop-shadow(0 0 25px #0e86e9)",
  "important");
            if (!document.getElementById('retro-shake-style')) {
                const style = document.createElement('style');
                style.id = 'retro-shake-style';
                style.innerHTML = `
                    @keyframes retroVibe {
                        0% { transform: translate(1px, 1px) rotate(0deg); }
                        10% { transform: translate(-1px, -1px) rotate(-1deg); }
                        20% { transform: translate(-2px, 0px) rotate(1deg); }
                        30% { transform: translate(1px, 2px) rotate(0deg); }
                        40% { transform: translate(-1px, -1px) rotate(1deg); }
                        50% { transform: translate(2px, 1px) rotate(-1deg); }
                        100% { transform: translate(1px, -1px) rotate(1deg); }
                    }
                `;
                document.head.appendChild(style);
            }
           
        } 

else if (window.enemyPoisonTurns > 0) {
            // 🧪 猛毒：【究極融合パッチ】プルプル振動 ＋ 背後緑 ＋ ぼたぼた紫滴 ＋ 足元泥だまり
            eContainer.style.setProperty("filter", "drop-shadow(0 0 25px #22c55e) brightness(0.85)", "important");
            eContainer.style.animationPlayState = "paused"; 
            eContainer.style.overflow = "visible"; 
            eContainer.style.clipPath = "none";

            const oldZzz = document.getElementById("zzz-container"); if (oldZzz) oldZzz.remove();

            if (!document.getElementById("retro-poison-fusion-style")) {
                const style = document.createElement("style");
                style.id = "retro-poison-fusion-style";
                style.innerHTML = `
                    @keyframes poisonVibe {
                        0% { transform: translate(1px, 1px) rotate(0deg); }
                        10% { transform: translate(-1px, -1px) rotate(-1deg); }
                        20% { transform: translate(-1px, 0px) rotate(1deg); }
                        30% { transform: translate(1px, 1px) rotate(0deg); }
                        40% { transform: translate(-1px, -1px) rotate(1deg); }
                        50% { transform: translate(1px, 1px) rotate(-1deg); }
                        100% { transform: translate(1px, -1px) rotate(1deg); }
                    }
                    @keyframes poisonDrop {
                        0% { transform: translate(-50%, -20px) scaleY(0.5); opacity: 0; }
                        20% { opacity: 1; transform: translate(-50%, -10px) scaleY(1.4); }
                        60% { opacity: 1; transform: translate(-30%, 40px) scaleY(1); }
                        80% { opacity: 0.8; transform: translate(-20%, 90px) scaleY(0.8); }
                        100% { transform: translate(-20%, 120px) scale(0); opacity: 0; }
                    }
                    @keyframes poisonPuddle {
                        0%, 100% { transform: translateX(-50%) scale(1); opacity: 0.7; }
                        50% { transform: translateX(-50%) scale(1.2); opacity: 1; }
                    }
                    .poison-drip-char {
                        position: absolute;
                        left: 50%;
                        top: 40%;
                        width: 12px;
                        height: 26px;
                        background: radial-gradient(circle, #d8b4fe 10%, #7e22ce 60%, #4c1d95 90%);
                        border-radius: 50% 50% 35% 35%;
                        z-index: 10002;
                        pointer-events: none;
                        opacity: 0;
                        animation: poisonDrop 1.8s infinite cubic-bezier(0.45, 0.05, 0.55, 0.95);
                    }
                    .poison-puddle {
                        position: absolute;
                        left: 50%;
                        bottom: -15px; 
                        width: 120px;
                        height: 20px;
                        background: radial-gradient(ellipse at center, rgba(107,33,168,0.85) 0%, rgba(76,29,149,0.45) 55%, rgba(0,0,0,0) 75%);
                        border-radius: 50%;
                        z-index: 10000; 
                        pointer-events: none;
                        animation: poisonPuddle 1.8s infinite ease-in-out;
                    }
                `;
                document.head.appendChild(style);
            }

            eSpriteGraphic.style.animation = "poisonVibe 0.12s infinite";

            if (!document.getElementById("poison-container")) {
                const poisonBox = document.createElement("div");
                poisonBox.id = "poison-container";
                poisonBox.style.cssText = "position:absolute; top:0; left:0; width:100%; height:100%; pointer-events:none; z-index:10001;";
                poisonBox.innerHTML = `
                    <div class="poison-puddle"></div>
                    <div class="poison-drip-char" style="animation-delay: 0s; left: 42%;"></div>
                    <div class="poison-drip-char" style="animation-delay: 0.5s; left: 58%; top: 46%; height: 18px; width: 10px;"></div>
                    <div class="poison-drip-char" style="animation-delay: 1.1s; left: 48%; top: 32%; width: 14px; height: 30px;"></div>
                `;
                eContainer.appendChild(poisonBox);
            }
        }

else {
    
            // ✨ 平時のお掃除（睡眠や猛毒のグラフィック残像を次の敵へ遺伝させない完全クリーニング）
            const oldZzz = document.getElementById("zzz-container"); if (oldZzz) oldZzz.remove();
            const oldPoison = document.getElementById("poison-container"); if (oldPoison) oldPoison.remove();
            
            // 🧼 【大本命】スリープ時に付与したグラデーションと影、丸みを跡形もなく完全消去！
            eContainer.style.removeProperty("background");      // 円形グラデーションをリセット
            eContainer.style.removeProperty("box-shadow");      // フワフワの影をリセット
            eContainer.style.removeProperty("border-radius");    // 丸みカットをリセット
            eContainer.style.removeProperty("overflow");
            eContainer.style.removeProperty("clip-path");
            eContainer.style.removeProperty("animation");       // 毒で止めていた浮遊アニメをリセット


// ==========================================
// 🕹️ 【７】モンスターの色彩制御
// ==========================================
// 🌟【プロローグ保護ガード】：まだ戦闘が始まっていない（curIdxが-1）ときは色変えを完全にスルーする
            if (window.curIdx < 0) {
                eContainer.style.removeProperty("filter");
                
            }

            // 🪨 【5階】：ロックゴーレム（★体自体をドッシリとした岩石の茶色に染める！）
            else if (data && data.name.includes("ロックゴーレム")) {
                // 🎨 セピア化してから色相をオレンジブラウン（0deg）に固定し、明るさを落として泥と岩の茶色に！
                eContainer.style.setProperty("filter", "sepia(1) hue-rotate(0deg) saturate(2) brightness(0.6) ", "important");
            }
            // 🍮 【14階】：オーカーゼリー（★体自体をねっとり輝く黄色に染める！）
            else if (data && data.name.includes("オーカー")) {
                // 🎨 セピア化してから色相をイエロー（40deg）へ回転させ、鮮やかに発光させて酸性ゼリーに！
                eContainer.style.setProperty("filter", "sepia(1) hue-rotate(40deg) saturate(4) brightness(1.2) drop-shadow(0 0 20px #eab308)", "important");
            }
            // 💎 【32階】：オブシニアン
            else if  (data && data.name.includes("オブシニアン")) {
                // 🎨 【体：輝く宝石紫】：セピア化してからアメジストパープル（240deg）へひねり、明るさ1.3倍で内側から輝かせ、背後にマゼンタゴールドのキラキラオーラ！
                eContainer.style.setProperty("filter", "sepia(1) hue-rotate(240deg) saturate(3) brightness(1.3) drop-shadow(0 0 30px #dfa5ff)", "important");
            }
           // ⚙️ 【マスター指定】第39階層（curIdx === 38）：アイアンゴーレム
            else if (data && data.name.includes("アイアンゴーレム")) {
                // 🎨 【新・金属化のからくり】
                // 1. saturate(0) で生き物の血の通った色味を完全にシャットアウトして無機物に。
                // 2. contrast(2.6) をかけることで、光の当たるエッジを「キラーンと輝く鋼鉄の白」に、
                //    影の部分を「ズシリと重い漆黒」に引き離し、鈍い金属特有のギラついた質感を表現！
                // 3. brightness(0.65) で全体のトーンを鉄の塊らしくズッシリと引き締めます。
                eContainer.style.setProperty("filter", "saturate(0) contrast(2.6) brightness(0.65) drop-shadow(0 0 20px #64748b)", "important");
            }
           // 🩸【マスター指定】：ブラッディボーン（第22階層）
            // 元画像の「服の青み」を完全に焼き尽くし、骨も服もすべてドロドロの赤黒さに染め上げます！
            else if (data && data.name.includes("ブラッディボーン")) {
                // 🎨 【新・からくり】色相回転（hue-rotate）だけに頼ると服の青が変な色に化けるため、
                // 先にsaturate(8.0)で赤・青すべての色味を限界まで「超ド派手」に暴走させます。
                // そこへhue-rotate(140deg)を掛け合わせることで、暴走した服の青を「灼熱の赤」へと完全に反転！
                // 仕上げにbrightness(0.35)でドス黒い血液の塊にし、背後から絶望的な鮮血オーラ（#dc2626）を大噴射します。
                eContainer.style.setProperty("filter", "saturate(8.0) hue-rotate(140deg) brightness(0.35) drop-shadow(0 0 25px #dc2626)", "important");
            }

// 🕷️【マスター指定】：ブラックウィドウ（第26階層）を暗黒色×極彩色のネオン蜘蛛にする！
            else if (data && data.name.includes("ブラックウィドウ")) {
                // 🎨 【からくり】明るさをガッと下げて体を「暗黒色（0.4）」にしつつ、
                // コントラストを極限（4.5）まで引き上げることで、ドット絵の輪郭や模様だけがギラギラした「極彩色」に覚醒！
                // 仕上げに、背後から怪しいネオンマゼンタ（#f43f5e）の影を大放射します。
                eContainer.style.setProperty("filter", "brightness(0.4) contrast(4.5) saturate(2.5) hue-rotate(120deg) drop-shadow(0 0 25px #f43f5e)", "important");
            }

            // ❄️【マスター指定】：26階（curIdxが25）のアイスファングを美しい青白色にする
            else if (data && data.name.includes("アイスファング")) {
                eContainer.style.setProperty("filter", "brightness(1.4) saturate(0.3) drop-shadow(0 0 20px #0ea5e9)", "important");
            }
            // 🍄 【マスター指定】第35階層（curIdx === 34）：スポアロード（幻覚毒キノコ極彩色仕様）
            else if  (data && data.name.includes("スポアロード")) {
                // 🎨 【大復活のからくり】
                // hue-rotate(220deg)で色相を狂わせ、saturate(6.5)で彩度を限界突破させてドットのRGBをバグらせることで、
                // キノコの傘やカサの裏に、危険なネオンカラーのマダラ斑点（ノイズ）をギラギラと強制発現させます！
                // 仕上げに、吸い込まれそうなシアンブルー（#38bdf8）の特大幻覚オーラを大放射！
                eContainer.style.setProperty("filter", "hue-rotate(220deg) saturate(6.5) contrast(2.0) brightness(1.3) drop-shadow(0 0 35px #38bdf8)", "important");
            }
// 🐉 【マスター指定】第40階層（curIdx === 39）：ブルードラゴン
            else if  (data && data.name.includes("ブルードラゴン")) {
                // 🎨 【新・ブルー＆白銀の翼のからくり】
                // 1. セピア(1)を最初にかけることで、金色の色味を一度ニュートラルな茶色ベースに統一。
                // 2. 色相回転(hue-rotate(200deg))で、その茶色を一気に鮮やかな「ブルー」へと強制変異させます。
                // 3. コントラスト(1.3)と明るさ(1.1)で、翼のハイライトを「白銀」のように輝かせ、
                //    身體の青みを「濃いロイヤルブルー」へと完璧に引き締めます。
                // 4. 仕上げに、神々しいシアンブルーのオーラを大爆発させます！
                eContainer.style.setProperty("filter", "sepia(1) hue-rotate(200deg) saturate(2) contrast(1.3) brightness(1.1) drop-shadow(0 0 35px #38bdf8)", "important");
            }
                 else {
// 色構成
                // 🟢【1〜13階の原色ガードレール】
                // 階数が 1階以上、かつ 13階以下のモンスターは、フィルターを引き算して100%原色にする！
                if (data && data.floor >= 1 && data.floor <= 13) {
                    eContainer.style.removeProperty("filter");
                } 
 
                        // 🎲【その他強化版】：それ以外の階層は自動でネオンカラーを回す
            else {
                let hueRotateDeg = (window.curIdx * 53) % 360;
                eContainer.style.setProperty("filter", `hue-rotate(${hueRotateDeg}deg) saturate(2) brightness(1.15)`, "important");
            }
        }
    }
    }

    const pBarContainer = document.querySelector('.player-zone') || document.getElementById('p-hp-bar')?.parentNode?.parentNode;
    if (pBarContainer) {
        let mpNode = document.getElementById('p-mp-text');
        if (!mpNode) { mpNode = document.createElement('div'); mpNode.id = 'p-mp-text'; pBarContainer.appendChild(mpNode); }
        mpNode.innerHTML = `MP: ${window.pMp} / ${window.pMaxMp}`;
    }
    if (typeof updateHpUI === 'function') updateHpUI();
// 🌟【戦闘中プレイヤーLV常時同期化】：毎ターンのUI更新時に、現在のLVを確実に同期させる！
    const pNameEl = document.getElementById('p-name');
    if (pNameEl) pNameEl.innerText = `🧙‍♂️ ${window.pStyle} (LV.${window.pLevel})`;
};

window.advanceBattleStep = function() {
    if (window.battleStepState === 'PLAYER_DONE') {
        window.battleStepState = 'NONE';
        if (!window.checkBattleEnd()) { window.enemyTurnAction(); }
    } else if (window.battleStepState === 'ENEMY_DONE') {
        window.battleStepState = 'NONE';
        if (!window.checkBattleEnd()) {
            window.isBusy = false;
            const battleLog = document.getElementById('battle-log');
            if (battleLog) battleLog.innerHTML = "コマンドを選択せよ。";
            const effScr = document.getElementById('eff-scr');
            if (effScr) effScr.style.pointerEvents = "none";
            if (typeof window.iceLock === 'number' && window.iceLock > 0) { window.iceLock--; }
            window.updateStatusBadgesUI();
        }
    }
};

// ==========================================
// 【８】🚀 . ステージ・戦闘遷移 
// ==========================================
window.nextStage = function() {
    if (typeof closeMagicBag === 'function') closeMagicBag();
    if (typeof closeItemBag === 'function') closeItemBag();
    window.curIdx++;

    if (window.curIdx >= window.STAGES.length) {
        window.pSavedLevel = 1; window.pSavedMaxHp = 100; window.pSavedMaxMp = 100; window.pSavedSpells = ['fire','ice','holy'];
        window.resetGame();
        showScreen('scr-start');
        const floorIndicator = document.getElementById('floor-indicator');
        if (floorIndicator) floorIndicator.style.visibility = 'hidden';
        startBGM("title");
        return;
    }

    window.buildIntermissionScreen(); 

    // 🛡️【時空の歪み・二重表示の完全無害化】
    // まだキャンプ場にいる段階での戦闘画面(scr-battle)のフライング暴走点灯を安全に完全撤去。
    // これにより、後方で作られたキャンプ画面のボタン判定が戦闘画面に遮られる現象を根絶します。
};

window.buildIntermissionScreen = function() {
    const data = window.STAGES[window.curIdx];
    let interDiv = document.getElementById('scr-intermission');
    if (!interDiv) {
        interDiv = document.createElement('div'); interDiv.id = 'scr-intermission';
        // 🛡️【サイズ崩れ完全粉砕パッチ】position固定を廃止し、スタートや戦闘画面と平等のサイズで白いボードに内包させます。
        interDiv.style.cssText = "display:none; padding:20px 10px; width:100%; box-sizing:border-box; background:#020617; color:#fff; font-family:monospace; border-radius:24px; min-height:440px;";
        
        const board = document.getElementById('sq-board');
        if (board) { board.appendChild(interDiv); } else { document.body.appendChild(interDiv); }
    }
    
    // 🛡️【98点デッドロック完全回避回路】
    // ui.jsのshowScreenは、未定義のIDを渡すと全画面を隠してしまうため、個別に安全な表示・非表示を実行します。
    ['scr-start', 'scr-intro', 'scr-battle', 'scr-result'].forEach(id => {
        const el = document.getElementById(id); if (el) el.style.display = 'none';
    });
    
    // キャンプ画面の電力をONにし、最前面に綺麗に引きずり出します。
    interDiv.style.display = 'block';
    
    interDiv.innerHTML = `
        <div style="text-align:center; color:#eab308; font-size:1.3rem; font-weight:bold; margin-bottom:15px; border-bottom:2px dashed #eab308; padding-bottom:8px;">🏰 螺旋の塔 第 ${data.floor} 階層 入場前広場</div>
<div style="background:#0f172a; padding:10px; border-radius:8px; font-size:0.9rem; border:1px solid #1e293b; margin-bottom:15px; font-family:monospace; line-height:1.6;">
            👤 現在のステータス: LEVEL ${window.pLevel} | 職業: ${window.pStyle} <br> 
            ❤️ HP: ${window.pHp}/${window.pMaxHp} | 🔮 MP: ${window.pMp}/${window.pMaxMp} | <span style="color:#a7f3d0; font-weight:bold;">🟢 EXP: <span style="color:#fff;">${window.pExp}</span> / ${window.getRequiredExpForNextLevel(window.pLevel)}</span>
        </div>
        <div style="display:grid; grid-template-columns:1fr; gap:10px; margin-bottom:15px;">
            <button onclick="window.interAction('status')" style="background:#1e293b; color:#fff; border:1px solid #475569; padding:12px; border-radius:6px; font-weight:bold; cursor:pointer;">📋 ステータス・習得呪文確認</button>
            <button onclick="window.interAction('camp_item')" style="background:#2d1e10; color:#ffedd5; border:1px solid #c2410c; padding:12px; border-radius:6px; font-weight:bold; cursor:pointer;">🎒 カバン内道具の事前キャンプ使用</button>
            <button onclick="window.interAction('scroll')" style="background:#1e1b4b; color:#c7d2fe; border:1px solid #4338ca; padding:12px; border-radius:6px; font-weight:bold; cursor:pointer;">📜 遺された羊皮紙の朗読（フロア攻略法）</button>
        </div>
        <div id="inter-result-box" style="background:#020617; border:1px solid #334155; padding:12px; min-height:80px; font-size:0.9rem; color:#cbd5e1; border-radius:6px; margin-bottom:15px; line-height:1.6;">コマンドを選択してください。</div>
        <button onclick="window.triggerEnterBattle()" style="width:100%; background:linear-gradient(135deg, #059669, #047857); color:#fff; font-size:1.1rem; font-weight:bold; padding:14px; border:2px solid #34d399; border-radius:8px; cursor:pointer; box-shadow:0 0 15px rgba(5,150,105,0.4);">⚔️ 第 ${data.floor} 階層 潜入開始</button>
    `;
};

window.interAction = function(mode) {
    const box = document.getElementById('inter-result-box'); if (!box) return;
    const data = window.STAGES[window.curIdx];
    if (typeof playSE === 'function') playSE(SOUND_HOLY); 

if (mode === 'status') {
        // 🔮 【Developer Z設計】モダン・カードデザイン案A：紫ネオン・ステータスインジェクション
        const hpPct = Math.min(100, Math.max(0, (window.pHp / window.pMaxHp) * 100));
        const mpPct = Math.min(100, Math.max(0, (window.pMp / window.pMaxMp) * 100));
        const coreStats = window.pSavedStats || { str: 8, dex: 12, con: 12, int: 18, wis: 14, cha: 10 };

        box.innerHTML = `
            <div style="color: #cbd5e1; display: flex; flex-direction: column; gap: 10px; text-align: left;">
                <div style="background: rgba(15, 23, 42, 0.85); border: 2px solid #7c3aed; border-radius: 10px; padding: 10px; box-shadow: 0 0 10px rgba(124, 58, 237, 0.3);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                        <span style="font-weight: bold; color: #a855f7;">👤 PLAYER [ LV. ${window.pLevel} ]</span>
                        <span style="background: #7c3aed; color: #fff; padding: 1px 6px; border-radius: 4px; font-size: 0.8em;">${window.pStyle}</span>
                    </div>
                    <div style="margin-bottom: 4px;">
                        <div style="display: flex; justify-content: space-between; font-size: 0.8em; margin-bottom: 1px;">
                            <span style="color: #f43f5e;">💖 HP</span><span>${window.pHp} / ${window.pMaxHp}</span>
                        </div>
                        <div style="background: #1e293b; border-radius: 999px; height: 8px; overflow: hidden; border: 1px solid #334155;">
                            <div style="background: linear-gradient(90deg, #f43f5e, #fda4af); width: ${hpPct}%; height: 100%;"></div>
                        </div>
                    </div>
                    <div>
                        <div style="display: flex; justify-content: space-between; font-size: 0.8em; margin-bottom: 1px;">
                            <span style="color: #3b82f6;">🔷 MP</span><span>${window.pMp} / ${window.pMaxMp}</span>
                        </div>
                        <div style="background: #1e293b; border-radius: 999px; height: 8px; overflow: hidden; border: 1px solid #334155;">
                            <div style="background: linear-gradient(90deg, #3b82f6, #93c5fd); width: ${mpPct}%; height: 100%;"></div>
                        </div>
                    </div>
                </div>

                <div style="background: rgba(15, 23, 42, 0.85); border: 1px solid #334155; border-radius: 10px; padding: 10px;">
                    <div style="font-weight: bold; color: #eab308; margin-bottom: 6px; font-size: 0.85em; border-bottom: 1px dashed #334155; padding-bottom: 2px;">📊 CORE STATS (基礎能力値)</div>
                    <div style="display: flex; flex-direction: column; gap: 4px; font-size: 0.8em;">
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: #ef4444;">⚔️ STR (筋力): <b>${coreStats.str}</b></span>
                            <span style="color: #3b82f6;">🔮 INT (知力): <b>${coreStats.int}</b></span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: #10b981;">🎯 DEX (敏捷): <b>${coreStats.dex}</b></span>
                            <span style="color: #6366f1;">📜 WIS (判断): <b>${coreStats.wis}</b></span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: #f97316;">🛡️ CON (耐久): <b>${coreStats.con}</b></span>
                            <span style="color: #a855f7;">👑 CHA (魅力): <b>${coreStats.cha}</b></span>
                        </div>
                    </div>
                </div>

                <div style="background: rgba(15, 23, 42, 0.85); border: 1px solid #334155; border-radius: 10px; padding: 10px;">
                    <div style="font-weight: bold; color: #10b981; margin-bottom: 4px; font-size: 0.85em; border-bottom: 1px dashed #334155; padding-bottom: 2px;">🎒 CURRENT EQUIP (初期装備セット)</div>
                    <div style="display: flex; flex-direction: column; gap: 2px; font-size: 0.75em; color: #94a3b8;">
                        <div>⚔️ <span style="color:#fff; font-weight:bold;">武器: ブロンズロッド</span> <span style="color:#06b6d4;">[青銅の魔法杖]</span></div>
                        <div>🛡️ <span style="color:#fff; font-weight:bold;">防具: 魔術師のローブ</span> <span style="color:#10b981;">[紫のローブ]</span></div>
                        <div>💍 <span style="color:#fff; font-weight:bold;">装飾: 水晶の指輪</span> <span style="color:#eab308;">[美しく輝く指輪]</span></div>
                    </div>
                </div>

                <div style="background: rgba(15, 23, 42, 0.85); border: 1px solid #334155; border-radius: 10px; padding: 10px;">
                    <div style="font-weight: bold; color: #06b6d4; margin-bottom: 4px; font-size: 0.85em; border-bottom: 1px dashed #334155; padding-bottom: 2px;">📜 MY SPELLS (永久記憶呪文)</div>
<div style="display: flex; flex-wrap: wrap; gap: 4px;">
    ${window.playerSpells.length ? window.playerSpells.map(k => `<span style="background: #1e1b4b; border: 1px solid #3b82f6; color: #93c5fd; padding: 1px 4px; border-radius: 4px; font-size: 0.75em;">${SPELLS[k]?.name || k}</span>`).join('') : '<span style="color:#94a3b8; font-size:0.75em;">なし</span>'}
</div>
                </div>
            </div>
        `;
    } else if (mode === 'camp_item') {
        // 🎒 キャンプ中に使えるアイテムのリストと、その効果テキスト・ボタン色の設定
        const campUsableItems = [
            { id: 'potion', name: "回復薬", icon: "🧪", desc: "HPを50回復", bg: "#10b981" },
            { id: 'mana',   name: "魔力の雫", icon: "🔷", desc: "MPを30回復", bg: "#3b82f6" },
            { id: 'cure',   name: "万能薬", icon: "🧪", desc: "HP10回復＆状態異常予防", bg: "#8b5cf6" },
            { id: 'elix',   name: "エリクサー", icon: "🧪", desc: "HP・MPを全回復", bg: "#ec4899" }
        ];

        let html = `<div style="font-family:monospace;"><strong style="color:#fb923c;">🎒 【事前キャンプ・アイテム使用バッグ】</strong><br>`;
        let hasAnyItem = false;

        // 所持しているアイテムだけを、綺麗なボタンとして自動で並べるループ処理
        campUsableItems.forEach(item => {
            let count = window.itemInventory[item.id] || 0;
            if (count > 0) {
                hasAnyItem = true;
                html += `
                    <div style="display:flex; justify-content:space-between; align-items:center; background:#1e293b; padding:6px 10px; border-radius:6px; margin-top:6px; border:1px solid #334155;">
                        <span>${item.icon} <b>${item.name}</b> (所持: ${count}個)</span>
                        <button onclick="window.executeCampItemUse('${item.id}')" style="background:${item.bg}; color:#fff; border:none; padding:5px 10px; border-radius:4px; font-weight:bold; cursor:pointer; font-size:0.8rem; box-shadow:0 2px #000;">使用 (${item.desc})</button>
                    </div>`;
            }
        });

        if (!hasAnyItem) {
            html += `<div style="color:#ef4444; margin-top:10px; font-size:0.85rem;">カバンの中に、キャンプで使用可能な回復・治療系アイテムがありません。敵を倒して補給してください。</div>`;
        }

        html += `</div>`;
        box.innerHTML = html;
    }
 
        else if (mode === 'scroll') {
        box.innerHTML = `<strong>【古びた羊皮紙の記述】</strong><br>「${data.txt}」 <br><span style="color:#eab308;">★攻略ヒント: 敵のLvは [ ${data.lv} ]。弱点は [ ${(data.weak.length ? data.weak.join(',').toUpperCase() : "なし")} ]、耐性は [ ${(data.resist.length ? data.resist.join(',').toUpperCase() : "なし")} ] である。</span>`; 
    }
};

window.executeCampHeal = function() {
    if ((window.itemInventory['potion'] || 0) <= 0) return; 
    window.itemInventory['potion']--; window.pHp = Math.min(window.pMaxHp, window.pHp + 50); 
    if (typeof playSE === 'function') playSE(SOUND_HOLY); window.interAction('camp_item'); 
};
// =============================================================================
// 🧪 キャンプ専用：マルチアイテム消費＆ステータス画面即時完全同期回路
// =============================================================================
window.executeCampItemUse = function(itemId) {
    if ((window.itemInventory[itemId] || 0) <= 0) return;

    // アイテムをカバンから1個引き算
    window.itemInventory[itemId]--;

    // 各アイテムごとの回復ロジックへ安全に配線
    if (itemId === 'potion') {
        window.pHp = Math.min(window.pMaxHp, window.pHp + 50);
    } 
    else if (itemId === 'mana') {
        window.pMp = Math.min(window.pMaxMp, window.pMp + 30);
    } 

    // 🔊 回復の聖力SEをハキハキ再生
    if (typeof playSE === 'function') playSE(SOUND_HOLY);

    // 🧼 【重要】回復した数値をキャンプ画面（入場前広場）の全体UIへ即座に逆インジェクション！
    window.buildIntermissionScreen(); 
    window.interAction('camp_item'); 
};
// =============================================================================
// 🧪 キャンプ専用・HP回復＆画面即時完全同期回路
// =============================================================================
window.executeCampHeal = function() {
    if ((window.itemInventory['potion'] || 0) <= 0) return; 
    
    window.itemInventory['potion']--; 
    window.pHp = Math.min(window.pMaxHp, window.pHp + 50); 
    
    if (typeof playSE === 'function') playSE(SOUND_HOLY); 
    
    window.buildIntermissionScreen(); 
    window.interAction('camp_item'); 
}; // 🔏 ここで回復の部屋が完璧に閉じます

// =============================================================================
// ⚔️ 潜入開始ボタンの電線窓口（エラーの原因はここの断線でした）
// =============================================================================
window.triggerEnterBattle = function() {
    const interDiv = document.getElementById('scr-intermission'); 
    if (interDiv) interDiv.style.display = 'none'; 
    window.actualStartBattle();
}; // 🔏 ここで潜入開始の部屋が完璧に閉じます

window.actualStartBattle = function() {
    // キャンプ画面から戦闘画面へ切り替わる瞬間に、戦闘画面エリアを表示する
    const bScr = document.getElementById('scr-battle'); if (bScr) bScr.style.display = 'block';
// 🏰 【フロア看板の強制ハキハキ表示パッチ】
    const floorIndicator = document.getElementById('floor-indicator');
    if (floorIndicator && window.STAGES[window.curIdx]) {
        floorIndicator.innerText = `🏰 螺旋の塔 第 ${window.STAGES[window.curIdx].floor} 階層`;
        floorIndicator.style.visibility = 'visible';
        floorIndicator.style.display = 'block';     // 確実に画面に引きずり出す
        floorIndicator.style.color = '#eab308';      // 高級感のあるレトロゴールド色
        floorIndicator.style.textAlign = 'center';   // ど真ん中に配置
        floorIndicator.style.fontWeight = 'bold';    // 太字
        floorIndicator.style.fontSize = '1.2rem';    // 見やすい大きさ
        floorIndicator.style.marginBottom = '10px';  // バトル枠とのすき間
    }
    const data = window.STAGES[window.curIdx];

    // 🛡️ 🏆 【エネミー空間閉じ込めバグ完全粉砕】
    // 潜入開始時に、ロジックが参照する敵のステータスデータを新しいモンスターの生データへ完全同期ロードする！
    if (data) {
        window.eMaxHp = data.hp;
        window.eHp = data.hp;
        window.eAtk = data.atk;
        window.eLv = data.lv;
        window.eWeak = data.weak || [];
        window.eResist = data.resist || [];
    }
    
window.isBusy = false;
    window.battleStepState = 'NONE';
    
    // 🧼 【完全大開通】新しい戦闘の開始時に、全28種の新IDデータを強制的に一斉お掃除！
    if (typeof window.clearAllStatusTurns === 'function') window.clearAllStatusTurns();
    // 🧼 データを0にした直後にUIを強制更新し、画面上のゾンビラベルを完全消滅させる！
    window.updateStatusBadgesUI();

    window.isPlayerStunned = false;
    window.isPlayerCorroded = false;
    window.isHarpySpeedActive = false;
    window.isPlayerMuted = false;
    window.isItemBlocked = false;
    // 🩸 【マスター指定】回復不可状態管理カウンター（0なら通常、1以上なら回復が無効化される）
window.playerNoHealTurns = 0;
    window.enemyBurnTurns = 0;
    window.enemyfreezeTurns = 0;
    window.enemySleepTurns = 0;
    window.enemyParalyzeTurns = 0;
    window.enemyBlindTurns = 0;
    window.enemyPoisonTurns = 0; 
　　window.enemywhiteTurns = 0;
    window.isAmuletActive = 0;
    window.enemyMana = 1.0;
    window.isEnemyShieldActive = false;
    window.isIronIronShieldActive = false;
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
        
        // 🛡️【深層アニメのぎこちなさ完全粉砕パッチ】
        // 11階以降でガタガタと不自然に震えていた前任者の超高速上書きを完全撤去。
        // 全階層のモンスター共通で、enemies.jsのパラパラ漫画とシンクロする美しい滑らかな浮遊（2.2s）に統一します。
        eContainer.style.animation = "floatE 2.2s infinite alternate ease-in-out"; 
    }
    if (eSpriteGraphic) {
        eSpriteGraphic.style.removeProperty("filter");
        eSpriteGraphic.style.removeProperty("animation-play-state"); 
        eSpriteGraphic.style.removeProperty("animation");
    }

 const pGraphic = document.getElementById('p-sprite-graphic');
    if (pGraphic) { pGraphic.src = window.getCleanAssetPath("assets/enemies/player/player_wizard.png"); }

    // 🛡️ 🏆 【エネミー空間閉じ込めバグ完全粉砕】
    // 画像だけでなく、戦闘ロジックが参照する敵ステータスを次のモンスターの生データへ完全同期ロードする
    if (data) {
        window.eMaxHp = data.hp;
        window.eHp = data.hp;
        window.eAtk = data.atk;
        window.eLv = data.lv;
        window.eWeak = data.weak || [];
        window.eResist = data.resist || [];
    }

    const eName = document.getElementById('e-name');
    const effScr = document.getElementById('eff-scr');
    const cutin = document.getElementById('cutin-bar');

    if (cutin) cutin.style.display = "none";
    if (eName) eName.innerText = `${data.name}`;

    // 🎨 【4アクションコマンド完全復活復元！】HTML側の古い3ボタンスロットをハック上書き
    const mainPanel = document.getElementById('panel-main-mode');
    if (mainPanel) {
        mainPanel.style.display = 'block'; 
        mainPanel.innerHTML = `
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; padding: 6px; box-sizing: border-box; width: 100%; font-family: monospace;">
                <button onclick="window.turn('atk')" style="background: linear-gradient(135deg, #4b5563, #1f2937); color: white; border: 2px solid #6b7280; border-radius: 8px; padding: 14px; font-size: 1.05rem; font-weight: bold; cursor: pointer; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">🗡️ 通常戦闘</button>
                <button onclick="window.openMagicBag()" style="background: linear-gradient(135deg, #6366f1, #4338ca); color: white; border: 2px solid #818cf8; border-radius: 8px; padding: 14px; font-size: 1.05rem; font-weight: bold; cursor: pointer; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">🔮 魔法呪文</button>
                <button onclick="window.turn('chg')" style="background: linear-gradient(135deg, #a855f7, #6b21a8); color: white; border: 2px solid #c084fc; border-radius: 8px; padding: 14px; font-size: 1.05rem; font-weight: bold; cursor: pointer; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">⚡ 魔力集中</button>
                <button onclick="window.openItemBag()" style="background: linear-gradient(135deg, #ea580c, #9a3412); color: white; border: 2px solid #fb923c; border-radius: 8px; padding: 14px; font-size: 1.05rem; font-weight: bold; cursor: pointer; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">🎒 アイテム</button>
            </div>
        `;
    }

    window.updateStatusBadgesUI(); 

    if (typeof startCustomAnimation === 'function') { startCustomAnimation(data.type); }
    if (typeof updateHpUI === 'function') { updateHpUI(); }

    if (effScr) {
        effScr.style.pointerEvents = "none";
        effScr.className = "";
        const oldWasp = document.getElementById('wasp-swarm-box'); if (oldWasp) oldWasp.remove();
        const oldMmis = document.getElementById('mmis-swarm-box'); if (oldMmis) oldMmis.remove();
        const oldScis = document.getElementById('scis-effect-box'); if (oldScis) oldScis.remove();
    }

    startBGM("battle");

    const battleLog = document.getElementById('battle-log');
    if (battleLog) {
        // 🚨 【引き算修正】変異体プレフィックスをカットし、ピュアに定義名を表示！
        battleLog.innerHTML = `${data.name} (LV:${data.lv}) が出現した！`;
    }
};

window.startBattle = window.actualStartBattle;

// ==========================================
// 【９】🎒 大容量アイテム使用（全20大アイテムロジック完全復活！）
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
    const data = window.STAGES[window.curIdx];

    if (effScr) { 
        const bBox = document.getElementById('wasp-swarm-box'); if (bBox) bBox.remove(); 
        const mBox = document.getElementById('mmis-swarm-box'); if (mBox) mBox.remove();
        const sBox = document.getElementById('scis-effect-box'); if (sBox) sBox.remove();
    }

if (itemType === 'potion') {
        // 🌟 【マスター指定：毒血の呪い検知】
        if (window.playerNoHealTurns > 0) {
            playSE(SOUND_ICE); // 呪いで不発に終わるカキィン音
            battleLog.innerHTML = "🧪 回復薬を飲んだが、体にまとわりつく赤い毒血の呪縛が激しく拒絶し、HPが【0】しか回復しない！！ <span>▶</span>";
} else {
            window.pHp = Math.min(window.pMaxHp, window.pHp + 50);
            playSE(SOUND_HOLY);
            
            // 🌟【主人公ダイレクト・ネオン発光パッチ】
            // 座標計算を一切やめ、主人公のドット絵（pGraphic）そのものを直接1秒間だけ美しく緑色に明滅させます！
            const pGraphic = document.getElementById('p-sprite-graphic');
            if (pGraphic) {
                // 🎬 主人公をレトロRPG風に輝かせるアニメーションを最速登録
                if (!document.getElementById("retro-player-heal-glow")) {
                    const style = document.createElement("style");
                    style.id = "retro-player-heal-glow";
                    style.innerHTML = `
                        @keyframes playerGreenGlow {
                            0% { filter: brightness(1); }
                            30% { filter: sepia(1) hue-rotate(80deg) saturate(5) brightness(1.8) drop-shadow(0 0 20px #34d399); }
                            70% { filter: sepia(1) hue-rotate(80deg) saturate(5) brightness(1.8) drop-shadow(0 0 20px #34d399); }
                            100% { filter: brightness(1); }
                        }
                    `;
                    document.head.appendChild(style);
                }
                // 💡 主人公の体にアニメーションをガチッと着火！
                pGraphic.style.animation = "playerGreenGlow 0.7s ease-in-out forwards";
                
                // 次の行動のために、終わったらアニメーションの指定を綺麗にお掃除
                setTimeout(() => { pGraphic.style.animation = "none"; }, 700);
            }
            
            battleLog.innerHTML = "🧪 回復薬を取り出して一気に飲み干した！傷口が光の粒子で塞がり、HPが50回復する！ <span>▶</span>";}
          } 
          
          else if (itemType === 'mana') {
        // 🔷 【マスター指定：魔力の雫 MP30回復 ＆ 青色ネオン発光回路】
        const mpRecoveryAmount = 30;
        window.pMp = Math.min(window.pMaxMp, window.pMp + mpRecoveryAmount);
        
        // 1. 魔法用の回復音（SOUND_HOLY や SOUND_HEAL）を再生
        if (typeof playSE === 'function') playSE(SOUND_HOLY);
        
        // 🌟【主人公ダイレクト・青色ネオン発光パッチ】
        // 主人公のドット絵（pGraphic）そのものを直接0.7秒間だけ美しく「青色」に明滅させます！
        const pGraphic = document.getElementById('p-sprite-graphic');
        if (pGraphic) {
            // 🎬 主人公を魔力回復風に輝かせるアニメーションを最速登録
            if (!document.getElementById("retro-player-mana-glow")) {
                const style = document.createElement("style");
                style.id = "retro-player-mana-glow";
                style.innerHTML = `
                    @keyframes playerBlueGlow {
                        0% { filter: brightness(1); }
                        30% { filter: sepia(1) hue-rotate(190deg) saturate(5) brightness(1.8) drop-shadow(0 0 20px #38bdf8); }
                        70% { filter: sepia(1) hue-rotate(190deg) saturate(5) brightness(1.8) drop-shadow(0 0 20px #38bdf8); }
                        100% { filter: brightness(1); }
                    }
                `;
                document.head.appendChild(style);
            }
            // 💡 主人公の体に青色アニメーションをガチッと着火！
            pGraphic.style.animation = "playerBlueGlow 0.7s ease-in-out forwards";
            
            // 終わったらアニメーションの指定を綺麗にお掃除
            setTimeout(() => { pGraphic.style.animation = "none"; }, 700);
        }
        
        // 安全なスタイル名取得によるエラー回避ガードレール
        const activeName = window.pStyleName || 'プレイヤー';
        battleLog.innerHTML = `🔷 ${activeName} は「魔力の雫」を口に含んだ！澄み渡る魔力が全身を駆け巡り、MPが ${mpRecoveryAmount} 回復する！ <span>▶</span>`;
    } 
          
     else if (itemType === 'bomb') {
        window.eHp = Math.max(0, window.eHp - 30);
        
        // 💥 【追加】ダメージの数値を画面にハキハキポップアップさせる！
        createDmgPop(30, false); 
        if (typeof updateHpUI === 'function') updateHpUI();

        playSE(SOUND_FIRE);
        if (effScr) { 
            effScr.className = "anim-player-fire"; 
            setTimeout(() => { effScr.className = ""; }, 600); 
        }
        battleLog.innerHTML = "💣 魔導手榴弾のピンを抜いて投げつけた！敵の懐で大爆発を起こし、固定30ダメージ！ <span>▶</span>";

        // 🔏 【追加】もしこの爆弾でトドメを刺したら、即座に勝利リザルトへ安全着地させる！
        if (window.eHp <= 0) { 
            window.battleStepState = 'NONE'; 
            setTimeout(() => { window.checkBattleEnd(); }, 600); 
            return; 
        }
    } 
    
          
          else if (itemType === 'amulet') {
// （中略：amuletはそのまま）
    } else if (itemType === 'elix') {
        // 🌟 【マスター指定：至高薬すら無効化する毒血縛り】
        if (window.playerNoHealTurns > 0) {
            playSE(SOUND_ICE);
            window.isPlayerMuted = false; window.isPlayerStunned = false; // 状態異常は治るがHPは0！
            battleLog.innerHTML = "🧪 至高薬エリクサーを注いだが、ドス赤黒い毒血の呪いが生命の光を相殺した！デバフは解けたがHP・MPは【0】も回復しなかった！ <span>▶</span>";
        } else {
            window.pHp = window.pMaxHp; window.pMp = window.pMaxMp;
            window.isPlayerMuted = false; window.isPlayerStunned = false;
            playSE(SOUND_HOLY);
            if (effScr) { effScr.className = "anim-player-chg"; setTimeout(() => { effScr.className = ""; }, 1100); }
            battleLog.innerHTML = "🧪 伝説の至高薬エリクサーの雫を垂らした！まばゆいオーラが脈動し、HP・MPと全ての呪いが全回復した！ <span>▶</span>";
        }

     } else if (itemType === 'wing') {
        window.eHp = Math.max(0, window.eHp - 20);
        playSE(SOUND_WIND);
        if (effScr) { effScr.className = "anim-player-aero"; setTimeout(() => { effScr.className = ""; }, 600); }
        battleLog.innerHTML = "🪶 ハーピーの羽根を投げた。鋭い風切り羽が相手の肉体に突き刺さる！ <span>▶</span>";
    } else if (itemType === 'bone') {
        playSE(SOUND_KICK);
        battleLog.innerHTML = "🦴 骸骨の骨を地面に放り投げた。……特に何も起きない。 <span>▶</span>";
    } else if (itemType === 'hour') {
        window.enemyParalyzeTurns = 2; // 時を止め2ターン行動不能化
        playSE(SOUND_ICE);
        if (effScr) { effScr.className = "anim-player-slow"; setTimeout(() => { effScr.className = ""; }, 600); }
        battleLog.innerHTML = "⏳ 時の砂時計を静かにひっくり返した！流れる砂が因果を遅らせ、敵の行動を2ターン分遅延させる！ <span>▶</span>";
           } else if (itemType === 'jewe') {
        window.isPlayerMuted = false; window.mana = 2.5;
        playSE(SOUND_HOLY);
        battleLog.innerHTML = "💎 目玉の宝石を掲げた！邪眼の魔力が反転し、己の魔力を暴発させる！ <span>▶</span>";
 
    }else if (itemType === 'hone') {
        window.isPlayerCorroded = false; window.pHp = Math.min(window.pMaxHp, window.pHp + 30);
        playSE(SOUND_HOLY);
        battleLog.innerHTML = "🍯 黄金の蜜を飲み干した！体表の溶解液が綺麗に洗い流され、HPが30回復する！ <span>▶</span>";
    } else if (itemType === 'spor') {
        window.enemySleepTurns = 2; 
        playSE(SOUND_POISON);
        battleLog.innerHTML = "🍄 幻覚胞子をばら撒いた！妖しい粉煙が敵の脳神経を狂わせ、2ターンの間、昏睡させる！ <span>▶</span>";





    
    } else if (itemType === 'cure') {
        window.isPlayerCorroded = false; window.isPlayerStunned = false; window.pHp = Math.min(window.pMaxHp, window.pHp + 10);
        playSE(SOUND_HOLY);
        battleLog.innerHTML = "🧪 七色の薬草を調合した万能薬を服用した！身体の毒や麻痺が瞬時に消滅していく！ <span>▶</span>";

    } else if (itemType === 'whet') {
        playSE(SOUND_KICK);
        battleLog.innerHTML = "🗡️ 無骨な研ぎ石で魔導杖の先端を鋭く研ぎ澄ました！2ターンの間、物理・素材系攻撃の威力1.5倍！ <span>▶</span>";
    } else if (itemType === 'mirr') {
        playSE(SOUND_HOLY);
        if (effScr) { effScr.className = "anim-player-refl"; setTimeout(() => { effScr.className = ""; }, 1100); }
        battleLog.innerHTML = "🪞 魔力を帯びた鏡の破片を前に突き出した！1ターンの間、敵の状態異常魔法を100%反射！ <span>▶</span>";

    } else if (itemType === 'scro') {
        playSE(SOUND_HOLY);
        if (effScr) { effScr.className = "anim-player-anal"; setTimeout(() => { effScr.className = ""; }, 600); }
        battleLog.innerHTML = `📜 賢者の巻物を解読した！アナライズが走り、敵の正確な残りHPは [ ${window.eHp} ] だ！ <span>▶</span>`;
    } else if (itemType === 'smok') {
        playSE(SOUND_ICE);
        battleLog.innerHTML = "🌀 足元へ煙幕弾を叩きつけた！次の敵の攻撃を100%ミス（MISS）にする！ <span>▶</span>";

    } else if (itemType === 'web') {
        window.enemyParalyzeTurns = 1; 
        playSE(SOUND_ICE);
        if (effScr) { effScr.className = "anim-player-slow"; setTimeout(() => { effScr.className = ""; }, 600); }
        battleLog.innerHTML = "🕸️ 蜘蛛の糸を投げつけた！強靭な粘着糸が敵の足元を絡め、1ターンの間【麻痺】させる！ <span>▶</span>";
    } else if (itemType === 'ston') {
        window.isEnemyShieldActive = false; window.eHp = Math.max(0, window.eHp - 25);
        playSE(SOUND_KICK);
        if (effScr) { effScr.className = "anim-player-quak"; setTimeout(() => { effScr.className = ""; }, 600); }
        battleLog.innerHTML = "🪨 ゴーレムの石を投げつけた！敵の張っている骨盾を結界ごと粉砕！ <span>▶</span>";
    } else if (itemType === 'cand') {
        window.isPlayerStunned = false; window.isPlayerMuted = false;
        playSE(SOUND_HOLY);
        battleLog.innerHTML = "🕯️ 霊体の蝋燭を点した。我が身にかかった状態異常を焼き尽くす！ <span>▶</span>";

 
    } else if (itemType === 'scal') {
        window.eHp = Math.max(0, window.eHp - 50);
        playSE(SOUND_DRAGON_CRY);
        if (effScr) { effScr.className = "anim-player-mete"; setTimeout(() => { effScr.className = ""; }, 600); }
        battleLog.innerHTML = "🐉 竜の逆鱗を激昂させた！怒りの爆炎が戦場全てを焼き尽くす！ <span>▶</span>";
    }

    if (typeof updateHpUI === 'function') updateHpUI();
    
    window.updateStatusBadgesUI();
// 🌟【バトルJS単体完結：電撃絶縁ホールドパッチ】
    // 爆弾などのアイテムを使い終わったこの一瞬、ボタンを押した指のクリック電流が
    // 背景の【４】（どこでも進行最適化）に連鎖して自動スキップさせるのを完璧にブロックします！
    window.battleStepState = 'PLAYER_DONE';
    
    if (window.event) {
        window.event.stopPropagation();
        window.event.preventDefault();
    }
}; //
// ==========================================
// 【10】🧙‍♂️ プレイヤー魔導アクション【全24魔法の計算＆固有テキスト完全復旧】
// ==========================================
window.turn = function(playerMove) {
    if (playerMove === 'debug_death') {
        window.isBusy = false; window.eHp = 0;
        if (typeof updateHpUI === 'function') updateHpUI();
        window.checkBattleEnd(); return;
    }

    if (window.isBusy || window.pHp <= 0 || window.eHp <= 0) return;

    // 24種類の上位全登録魔法の一括封印バリデーションチェック
    if (window.isPlayerMuted && ['fire','ice','holy','wasp','scre','refl','wisp','mmis','scis','flas','drai','slow','flod','bio','quak','slee','dead','mete','aero','come','grav','anal','ulti','ele'].includes(playerMove)) {
        const battleLog = document.getElementById('battle-log');
        if (battleLog) battleLog.innerHTML = "🚨 魔力封印により、呪文が唱えられない！ <span>▶</span>";
        if (typeof closeMagicBag === 'function') closeMagicBag(); return;
    }

    window.isBusy = true;
    if (typeof closeMagicBag === 'function') closeMagicBag(); 
    window.isBusy = true;
    
    // 🔮 【Developer Z設計】魔法発動時・消費MPリアルタイム引き算回路
    if (playerMove !== 'atk' && playerMove !== 'chg' && typeof SPELLS !== 'undefined' && SPELLS[playerMove]) {
        const mpCost = SPELLS[playerMove].mp || 0;
        window.pMp = Math.max(0, window.pMp - mpCost);
        if (typeof updateStatusBadgesUI === 'function') updateStatusBadgesUI(); // 画面最上部のMP数値を即座に更新
    }

    if (typeof closeMagicBag === 'function') closeMagicBag();

    if (window._activeMagicTimeout) { clearTimeout(window._activeMagicTimeout); }

    if (window.isPlayerStunned) {
        window.isPlayerStunned = false; const battleLog = document.getElementById('battle-log');
        if (battleLog) battleLog.innerHTML = "🚨 麻痺して動けない！ <span>▶</span>";
        window.battleStepState = 'PLAYER_DONE'; return;
    }

    const data = window.STAGES[window.curIdx];
    const enemyResistances = data.resist || [];

    // 🎲 【ディレクター仕様】全攻撃にプラスマイナス20%の乱数ブレ(80%〜120%)を乗せる共通回路
    function applyDamageBlur(baseDmg) {
        const blurFactor = 0.8 + Math.random() * 0.4;
        return Math.floor(baseDmg * blurFactor);
    }

    function getRandomTurns() { return Math.floor(Math.random() * 2) + 1; }

    let basePower = 15; let spellLabel = "魔導魔法"; let magicClass = "anim-player-fire"; let currentSE = SOUND_FIRE;

    const spellSpecs = {

chg:  { pow: 0,  label: "魔力集中", se: SOUND_HOLY, cls: "anim-player-chg" }, 
        atk:  { pow: 3,  label: "杖でたたいた", se: SOUND_KICK, cls: "" }, 
        fire: { pow: 15, label: "ファイア", se: SOUND_FIRE, cls: "anim-player-fire" },
        ice:  { pow: 15, label: "アイス", se: SOUND_ICE, cls: "anim-player-ice" },
        holy: { pow: 35, label: "ホーリー", se: SOUND_HOLY, cls: "anim-player-holy" },
        wasp: { pow: 24, label: "ワスプ", se: SOUND_FIRE, cls: "anim-player-wasp" },
        wasp2: { pow: 10, label: "フリーズ", se: SOUND_ICE, cls: "anim-player-wasp" },
        scre: { pow: 1,  label: "スクリーム", se: SOUND_ICE, cls: "anim-player-scre" },
        refl: { pow: 0,  label: "リフレク", se: SOUND_HOLY, cls: "anim-player-refl" },
        wisp: { pow: 20, label: "ウィスプ", se: SOUND_HOLY, cls: "anim-player-wisp" },
        mmis: { pow: 20, label: "マジックミサイル", se: SOUND_ICE, cls: "anim-player-mmis" },
        scis: { pow: 19, label: "シザース", se: SOUND_SLASH, cls: "anim-player-scis" },
        flas: { pow: 0,  label: "フラッシュ", se: SOUND_HOLY, cls: "anim-player-flas" },
        drai: { pow: 20, label: "ドレイン", se: SOUND_TENTACLE, cls: "anim-player-drai" },
        slow: { pow: 10, label: "スロウ", se: SOUND_ICE, cls: "anim-player-slow" },
        flod: { pow: 22, label: "フラッド", se: SOUND_FIRE, cls: "anim-player-flod" },
        bio:  { pow: 14, label: "バイオ", se: SOUND_POISON, cls: "anim-player-bio" },
        quak: { pow: 30, label: "クエイク", se: SOUND_EARTHQUAKE, cls: "anim-player-quak" },
        slee: { pow: 0,  label: "スリープ", se: SOUND_ICE, cls: "anim-player-slee" },
        dead: { pow: 5,  label: "デス", se: SOUND_SLASH, cls: "anim-player-dead" },
        mete: { pow: 55, label: "メテオ", se: SOUND_FIRE, cls: "anim-player-mete" },
        aero: { pow: 18, label: "エアロ", se: SOUND_WIND, cls: "anim-player-aero" },
        come: { pow: Math.floor(Math.random() * 51) + 10, label: "コメット", se: SOUND_HOLY, cls: "anim-player-come" },
        grav: { pow: 25, label: "グラビデ", se: SOUND_EARTHQUAKE, cls: "anim-player-grav" },
        anal: { pow: 0,  label: "アナライズ", se: SOUND_HOLY, cls: "anim-player-anal" },
        ulti: { pow: 50, label: "アルテマ", se: SOUND_THUNDER, cls: "anim-player-ulti" },
        ele:  { pow: 17, label: "ライトニング", se: SOUND_THUNDER, cls: "anim-player-ele" },
        def:  { pow: 0, label: "シールド", se: SOUND_HOLY, cls: "anim-player-def" }
    };

    if (spellSpecs[playerMove]) {
        basePower = spellSpecs[playerMove].pow; spellLabel = spellSpecs[playerMove].label;
        currentSE = spellSpecs[playerMove].se; magicClass = spellSpecs[playerMove].cls;
    }

    let spellAttr = (SPELLS[playerMove]) ? SPELLS[playerMove].attr : null;
    let isWeak = (spellAttr && Array.isArray(data.weak)) ? data.weak.includes(spellAttr) : false;
    let isResist = (spellAttr && Array.isArray(data.resist)) ? data.resist.includes(spellAttr) : false;

// 🔮 【Developer Z設計】知力(INT)・腕力(STR)のダメージ実効配線回路（C案：ログ減衰型）
    const coreStats = window.pSavedStats || { str: 8, dex: 12, con: 12, int: 18, wis: 14, cha: 10 };
    
    let bluredPower = 0;
    if (playerMove === 'atk') {
        // 物理攻撃は従来の腕力比例（基準値10）
        const statMultiplier = coreStats.str / 10;
        bluredPower = applyDamageBlur(basePower * statMultiplier);
  } else {
// 🔮 魔法攻撃：C案（初期値18を基準に1倍化するログ減衰仕様）
        // 知力18のとき ➔ 1 + Math.log10(18 / 18) = 1.0倍（加点なし・スパイダーに16前後）
        const intBonus = 1 + Math.log10(coreStats.int / 18);
        bluredPower = applyDamageBlur(basePower * intBonus);
    }
    
    let baseDmg = Math.floor(bluredPower * (isWeak ? 2.2 : 1) * window.mana);
    
    // クラスパッシブ
    if (window.pStyle === 'WARMAGE' && playerMove !== 'atk' && basePower > 0) { baseDmg = Math.floor(baseDmg * 1.25); }
    if (window.isEnemyShieldActive && playerMove !== 'mmis' && playerMove !== 'aero' && playerMove !== 'ele') { baseDmg = Math.floor(baseDmg * 0.25); }
    if (window.isIronIronShieldActive && basePower > 0) { baseDmg = 1; } // アイアン防壁化
    window.isEnemyShieldActive = false;

    if (isResist && playerMove !== 'atk') { baseDmg = 0; }

    let isAttackSpell = (basePower > 0);
    let criticalChance = (playerMove === 'ele') ? 0.35 : 0.25;
    let isLuckRoll = (isAttackSpell && !isResist && Math.random() < criticalChance);                 
    let isOverkillRoll = (isAttackSpell && !isResist && isWeak && baseDmg >= window.eHp);   
   // 基本威力が0（スリープやチャージ等）なら、会心判定を強制的にfalse（ナシ）にする！
let isCriticalHit = (basePower > 0) && (isLuckRoll || isOverkillRoll);      
    let finalDmg = isCriticalHit ? Math.floor(baseDmg * 1.6) : baseDmg; 

    // クリティカルカットイン演出の完全復元
    if (isCriticalHit) {
        const cutin = document.getElementById('cutin-bar'); const cutinText = cutin ? cutin.querySelector('.cutin-text') : null; const board = document.getElementById('sq-board'); 
        if (cutinText) cutinText.innerText = "💥クリティカルヒット！！💥";
        if (cutin) { cutin.style.display = "flex"; setTimeout(() => { cutin.style.display = "none"; }, 1000); }
        if (board) { board.classList.add("screen-shake-flash"); setTimeout(() => { board.classList.remove("screen-shake-flash"); }, 450); }
    }

    const effScr = document.getElementById('eff-scr');
    if (effScr) {
        const existingWasp = document.getElementById('wasp-swarm-box'); if (existingWasp) existingWasp.remove();
        const existingMmis = document.getElementById('mmis-swarm-box'); if (existingMmis) existingMmis.remove();
        const existingScis = document.getElementById('scis-effect-box'); if (existingScis) existingScis.remove();
        effScr.className = ""; 
    }
    // カオティックな既存のワスプ＆追尾ミサイル＆細ハサミコア演出を100%保護
    if (playerMove === 'wasp') {
        if (effScr) {
            const waspBox = document.createElement('div'); waspBox.id = 'wasp-swarm-box'; waspBox.style.cssText = "position:absolute; top:0; left:0; width:100%; height:100%; pointer-events:none; z-index:1000;"; effScr.appendChild(waspBox);
            for (let i = 0; i < 4; i++) {
                const bee = document.createElement('div'); bee.innerText = "🐝";
                bee.style.cssText = `position: absolute; left: 10%; top: ${42 + (i * 8)}%; font-size: 2.2rem; z-index: 9999; pointer-events: none; animation: beeWaveAttack 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; animation-delay: ${i * 0.13}s;`;
                waspBox.appendChild(bee);
            }
            if (!document.getElementById('wasp-temp-style')) {
                const style = document.createElement('style'); style.id = 'wasp-temp-style';
                style.innerHTML = `@keyframes beeWaveAttack { 0% { transform: translateX(0) translateY(0) scale(0.5); opacity: 0; } 20% { opacity: 1; transform: translateX(10vw) translateY(-40px) scale(1.2); } 50% { transform: translateX(35vw) translateY(50px) scale(1.0); } 80% { transform: translateX(60vw) translateY(-30px) scale(1.3); } 100% { transform: translateX(72vw) translateY(10px) scale(0.8); opacity: 0; } }`;
                document.head.appendChild(style);
            }
        }
} else if (playerMove === 'wasp2') {
    if (effScr) {
        // 演出全体のコンテナを作成
        const iceBox = document.createElement('div');
        iceBox.id = 'ice-burst-box';
        iceBox.style.cssText = "position:absolute; top:0; left:0; width:100%; height:100%; pointer-events:none; z-index:1000;";
        effScr.appendChild(iceBox);

        // 1. 大きな氷の結晶を複数炸裂させる (今回は3個)
        // 相手の位置を想定して、画面右側（left: 70%付近）を中心に少し散らして配置
        const targetPositions = [
            { left: '70%', top: '45%', size: '3.5rem', delay: 0 },
            { left: '73%', top: '38%', size: '2.5rem', delay: 0.15 },
            { left: '68%', top: '52%', size: '2.8rem', delay: 0.25 }
        ];

        targetPositions.forEach((pos) => {
            const crystal = document.createElement('div');
            crystal.innerText = "❄️";
            crystal.style.cssText = `
                position: absolute;
                left: ${pos.left};
                top: ${pos.top};
                font-size: ${pos.size};
                z-index: 9999;
                pointer-events: none;
                transform: translate(-50%, -50%) scale(0);
                animation: iceCrystalBurst 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
                animation-delay: ${pos.delay}s;
            `;
            iceBox.appendChild(crystal);
        });

        // 2. 白い冷気（煙）を噴き出す (12個のパーティクルでモコモコ感を演出)
        for (let i = 0; i < 12; i++) {
            const mist = document.createElement('div');
            // 白い冷気の塊（CSSで丸くしてボカす）
            mist.style.cssText = `
                position: absolute;
                left: ${70 + (Math.random() * 10 - 5)}%; /* 70%を中心にランダムに散らす */
                top: ${45 + (Math.random() * 14 - 7)}%;  /* 45%を中心にランダムに散らす */
                width: ${40 + Math.random() * 40}px;     /* 大きさをランダムに */
                height: ${40 + Math.random() * 40}px;
                background: rgba(240, 248, 255, 0.8);    /* アリスブルー（薄い青白） */
                border-radius: 50%;
                filter: blur(8px);                       /* ボカして霧っぽくする */
                z-index: 9998;
                pointer-events: none;
                transform: scale(0);
                animation: coldMistSpread 0.8s ease-out forwards;
                animation-delay: ${0.2 + (Math.random() * 0.2)}s; /* 結晶が炸裂した後に噴き出す */
            `;
            iceBox.appendChild(mist);
        }

        // アニメーション用のCSSスタイルを追加
        if (!document.getElementById('ice-burst-style')) {
            const style = document.createElement('style');
            style.id = 'ice-burst-style';
            style.innerHTML = `
                /* 氷の結晶が鋭く巨大化して、パッと砕け散る（消える） */
                @keyframes iceCrystalBurst {
                    0% { transform: translate(-50%, -50%) scale(0) rotate(0deg); opacity: 0; }
                    30% { opacity: 1; }
                    70% { transform: translate(-50%, -50%) scale(1.3) rotate(45deg); opacity: 1; filter: drop-shadow(0 0 10px #fff); }
                    100% { transform: translate(-50%, -50%) scale(1.5) rotate(60deg); opacity: 0; filter: blur(4px); }
                }
                /* 白い冷気が周囲に広がりながら、フワッと消えていく */
                @keyframes coldMistSpread {
                    0% { transform: scale(0.2) translateY(0); opacity: 0; }
                    20% { opacity: 0.7; }
                    50% { opacity: 0.8; }
                    100% { transform: scale(2.5) translateY(-20px); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }

        // 演出が終わったらDOMから自動削除（メモリ対策）
        setTimeout(() => {
            iceBox.remove();
        }, 1500);
    }

    } else if (playerMove === 'mmis') {
        if (effScr) {
            const mmisBox = document.createElement('div'); mmisBox.id = 'mmis-swarm-box'; mmisBox.style.cssText = "position:absolute; top:0; left:0; width:100%; height:100%; pointer-events:none; z-index:1000;"; effScr.appendChild(mmisBox);
            for (let i = 0; i < 3; i++) {
                const arrow = document.createElement('div'); arrow.innerText = "➶";
                arrow.style.cssText = `position: absolute; left: 10%; top: 45%; z-index: 9999; pointer-events: none; animation: missileDash 0.5s ease-out forwards; animation-delay: ${i * 0.12}s;`;
                mmisBox.appendChild(arrow);
            }
        }
    } else if (playerMove === 'scis') {
        if (effScr) {
            const scisBox = document.createElement('div'); scisBox.id = 'scis-effect-box'; scisBox.style.cssText = "position:absolute; top:0; left:0; width:100%; height:100%; pointer-events:none; z-index:1001;"; effScr.appendChild(scisBox);
            const scissorsNode = document.createElement('div'); scissorsNode.innerText = "✂️";
            scissorsNode.style.cssText = `position: absolute; left: 20%; top: 35%; z-index: 9999; pointer-events: none; animation: scisBladeSlash 0.38s ease-out forwards;`;
            scisBox.appendChild(scissorsNode); if (magicClass) effScr.className = magicClass; 
             window.enemyMana = 0.9; 
        }
    } else {
        if (effScr && magicClass) effScr.className = magicClass; 
    }

    window._activeMagicTimeout = setTimeout(() => {
        playSE(currentSE);
  // ⭕ 修正後（chgのときはダメージポップを出さない！）
window.eHp = Math.max(0, window.eHp - finalDmg);
if (typeof updateHpUI === 'function') updateHpUI();
// 🌟【配列一括ガードパッチ】この4つの補助魔法のときは、ダメージポップアップを絶対に作らない！
        if (!['chg', 'slee', 'anal', 'flas', 'def'].includes(playerMove)) {
            createDmgPop(finalDmg, false); 
        }
        let statusLog = ""; let flavorTxt = `『${spellLabel}』を詠唱！`; let coreTxt = "";

        if (isResist && playerMove !== 'atk') {
            coreTxt = `🚨【耐性】${data.name}に${spellLabel}は全く効かなかった！（${finalDmg}ダメージ）`;
        } else {
            if (playerMove === 'atk') {
                flavorTxt = "魔導杖を両手構え、渾身の力で相手をぶったたいた！";
                coreTxt = `🗡️ 通常戦闘：${flavorTxt} 敵に ${finalDmg} の物理ダメージ！`;
            }
// 🌟【大開通】ファイア部屋の直前にチャージ専用部屋を設置し、暴発を完全シャットアウト！
if (playerMove === 'chg') {
    window.mana = 2.5; // 次の呪文威力を確定2.5倍フラグへチャージ！
    flavorTxt = "静かに目を閉じ、全神経を集中させて周囲の魔力を練り上げた！";
    statusLog = " (⚡次回の呪文威力が【2.5倍】に極限ブーストされた！)";
    coreTxt = `⚡ 魔力集中：${flavorTxt}${statusLog}`;
}
else if (playerMove === 'fire') { 
                // 🟢 1. 【追加ダメージだけをその場で計算】（2〜5のランダム）
                const extraBurnDmg = 2 + Math.floor(Math.random() * 4);
                
                // 🟢 2. 【追加分だけをHPから引き算】
                // 本体のダメージ（画像でいう24）は、この下の共通レールで自動的に引き算されるので、
                // ここでは火傷のプチダメージ（2〜5）の分だけをそっと引き算しておきます。
                window.eHp = Math.max(0, window.eHp - extraBurnDmg); 

                // 🟢 3. ログのパーツを確定
                // flavorTxtは空っぽにして、前任者の大元の文章（会心の一撃！など）を活かします。
                flavorTxt = "燃え盛る火炎が命中"; 
                statusLog = ` さらに＋【${extraBurnDmg}】の追加燃焼ダメージ！！`; 
            }

else if (playerMove === 'ice') { 
    flavorTxt = "無数の氷の結晶が相手を包み込む！！"; 
                const freezeTurns = getRandomTurns() + (window.pStyle === 'MAGICIAN' ? 1 : 0); 
                window.enemyStatus.freezeTurns = freezeTurns; 

                window.enemyfreezeTurns = freezeTurns; 
                
                statusLog = ` (❄️相手の体は青白く凍結した！[${freezeTurns}ターン])`; 


            }
            else if (playerMove === 'slee') {
                if (enemyResistances.includes(ATTR.MIND)) { flavorTxt = "催眠ガスが相手の精神に放たれた！"; statusLog = ` (💀効かない！${data.name}は眠りを持たない！)`; } 
                else {
                    const sleepTurns = getRandomTurns() + (window.pStyle === 'MAGICIAN' ? 1 : 0); window.enemySleepTurns = sleepTurns;
                    flavorTxt = "睡眠ガスが相手の精神に入り込み、強い眠気を生み出す……！"; statusLog = ` (💤相手は深い眠りに落ち、${sleepTurns}ターンの間完全行動不能になった！)`;
                }
            }
            else if (playerMove === 'scre') { 
                if (enemyResistances.includes(ATTR.MIND)) { flavorTxt = "激しい音波の衝撃波が敵の全身を襲う！"; statusLog = ` (💀効かない！${data.name}には音波系ショックが通用しない！)`; } 
                else {
                    const paralyzeTurns = getRandomTurns() +1+ (window.pStyle === 'MAGICIAN' ? 1 : 0); window.enemyParalyzeTurns = paralyzeTurns;
                    flavorTxt = "激しい音波の衝撃波が敵の全身に命中！"; statusLog = ` (⚡強烈な【麻痺】が走り、敵の身体が${paralyzeTurns}ターン激しく震え出した！)`; 
                }
            }
            else if (playerMove === 'holy') { window.enemyBlindTurns = 2; flavorTxt = "天から降り注ぐ神聖な聖光波が炸裂！"; statusLog = " (✨激しい光が敵の目を潰し暗闇にした！)"; }
else if (playerMove === 'wasp') { 
    flavorTxt = "召喚された無数の蜂の群れが獰猛に獲物を襲撃！";
    
    // 1. まず確率（60%）の抽選を行う
    if (Math.random() < 0.6) { 
        // 2. 確率が成功しても、敵に耐性（MIND）があれば不発（ミス）にする
        if (enemyResistances.includes(ATTR.MIND)) { 
            statusLog = " (💀麻痺毒を撃ち込んだが、敵の耐性に弾かれ効果はミス！)"; 
        } 
        // 3. 確率成功・耐性なしの場合のみ、正常に麻痺を付与する
        else { 
            const paralyzeTurns = 2; 
            window.enemyParalyzeTurns = paralyzeTurns; 
            window.enemyStatus.paralyzeTurns = paralyzeTurns; // ラベル同期
            statusLog = ` (🐝蜂毒が回り、痛みと痙攣で動けない！[${paralyzeTurns}ターン])`; 
        }
    } 
    // 4. 最初の確率（40%の確率）で外れた場合も、必ずここを通ってテキストを出す
    else { 
        statusLog = " (追加麻痺効果はミス！)"; 
    }
}

            // ↓本家ワスプの部屋の下に、完全に独立した部屋として新設！フリーズ
            else if (playerMove === 'wasp2') { 
                flavorTxt = "空気中の冷気が結晶となり相手に突き刺さる！";
                if (Math.random() < 0.85) { 
                    if (enemyResistances.includes(ATTR.ICE)) { statusLog = " (❄️冷気の結晶を撃ち込んだが、敵の耐性に弾かれた！)"; } 
                    else { const whiteTurns = 2; window.enemywhiteTurns = whiteTurns; 
                        window.enemyStatus.whiteTurns = whiteTurns;

                        
                        statusLog = ` (❄️氷に包まれ青白く凍結！動けない！[${whiteTurns}ターン])`; }
                } else { statusLog = " (冷気による凍結効果はミス！)"; }
            }


// =============================================================================
// 🛡️ 【1部屋完結型】シールド防衛システム・完全一本道パッチ回路
// =============================================================================
else if (playerMove === 'def') { 
    // 🎨 【自由テキスト領域】ここを好きな文章にいつでも書き換え可能です！
    flavorTxt = "🛡️ 魔力粒子が集まり、魔法の防御盾を形成！敵の攻撃をガードする！";
    
    // 100%確実に発動する確定ルート（ワスプ2の確率判定と構造を完全同期）
    if (Math.random() < 1.0) { 
        // 1. 寿命カウンターを2ターンにセット
        const shieldTurns = 2; 
        window.playerShieldTurns = shieldTurns; 
         window.enemyMana = 0.3;
        // 2. ラベル描画システム（バッジ）に残りターン数を通知
        window.playerStatus.shieldTurns = shieldTurns; 
        
        // 3. 補足ログをドッキング
        statusLog = ` (🛡️シールドが衝撃ダメージを減少！[${shieldTurns}ターン])`; 
    } else { 
        // 100%成功するのでここは通りませんが、ワスプ2の構文の美しさを保つためのダミー
        statusLog = " (シールド展開ミス！)"; 
    }
}
 

            else if (playerMove === 'refl') { flavorTxt = "自身の前に光り輝くミラーシールドを設置した！"; }
            else if (playerMove === 'wisp') { flavorTxt = "精霊の怪しい燐光が敵の足元から湧き上がる！"; }
            else if (playerMove === 'mmis') { flavorTxt = "魔力の誘導ミサイルが放たれ、空を切り裂き連続命中！"; }
            else if (playerMove === 'scis') { flavorTxt = "巨大な空間断裂のハサミが敵のド真ん中を鋭く交差！"; }
            else if (playerMove === 'flas') { flavorTxt = "戦場全体を真っ白な閃光が包み込み、敵の視界を奪う！"; }
            else if (playerMove === 'drai') { 
                let abs = (window.pStyle === 'NECRO') ? 40 : 20; window.pHp = Math.min(window.pMaxHp, window.pHp + abs); 
                flavorTxt = "敵の生命エネルギーを強引に吸い上げる！"; statusLog = ` (🩸吸い上げた血で味方のHPが${abs}ドレイン回復！)`; 
            }
            else if (playerMove === 'slow') { flavorTxt = "敵の周囲の時間軸を歪ませ、動きを極限まで鈍化させる！"; }
            else if (playerMove === 'flod') { flavorTxt = "画面全体を飲み込む大津波がステージを激しく押し流す！"; }
else if (playerMove === 'bio') { 
                const poisonTurns = Math.floor(Math.random() * 3) + 3; 
                // 🔄 新・絶対IDへ同期！
                window.enemyStatus.poisonTurns = poisonTurns; 
                flavorTxt = "ドロドロとした有害なバイオバブルが敵の体表で弾ける！"; statusLog = ` (🧪猛毒の細菌が肉体を蝕み、スリップダメージ開始！[${poisonTurns}ターン])`; 
            }
            else if (playerMove === 'quak') { flavorTxt = "大地が激しく隆起し、戦場全体を大地震が襲う！"; }
            else if (playerMove === 'dead') { flavorTxt = "死神の巨大な鎌が空間ごと敵の魂を刈り取る……！"; }
            else if (playerMove === 'mete') { flavorTxt = "燃え盛る巨大な巨大隕石が超高速で大気圏を突破し激突！"; }
            else if (playerMove === 'aero') { flavorTxt = "真空の刃が竜巻きを起こし、敵の防壁ごと切り裂く！"; }
            else if (playerMove === 'come') { flavorTxt = "夜空から無数の星屑の雨が不規則に降り注ぐ！"; }
            else if (playerMove === 'grav') { flavorTxt = "空間を歪ませ超重力球が出現！相手の中心にて収縮吸収！"; }
            else if (playerMove === 'ulti') { flavorTxt = "高次元の破壊エネルギー粒子が集結！弾けて爆発！"; }
            else if (playerMove === 'ele') { flavorTxt = "ライトニングボルト！電撃が相手を貫き感電させる！"; statusLog = " (⚡防御を貫く雷撃が命中！)"; }

            if (playerMove !== 'atk') {
                let tagPrefix = isWeak ? "【弱点！】" : "";
// 🔮 補助魔法（chg, slee, anal, flas）なら、ダメージ文字を完全に引き算！
                if (['chg', 'slee', 'anal', 'flas', 'def'].includes(playerMove)) {
                    coreTxt = `${tagPrefix}${flavorTxt}${statusLog}`;
                } 
                // 🔥 攻撃魔法なら、いつも通りダメージの数値をハキハキ書く！
                else {
                    coreTxt = isCriticalHit ? `💥 会心の一撃！${tagPrefix}${flavorTxt} ${finalDmg} の必殺ダメージ！！${statusLog}` : `${tagPrefix}${flavorTxt} ${finalDmg} ダメージ！${statusLog}`;
                }
            }
        }

        if (playerMove === 'anal') {
            let currentWeak = (spellAttr && Array.isArray(data.weak)) ? data.weak.map(a => a.toUpperCase()).join(', ') : "なし";
            if (window.curIdx >= 10) currentWeak = "シークレット（裏変異層：全属性を検証せよ）";
            coreTxt = `🔮 【アナライズ】成功！敵の深層データをスキャン！ 残力HP: ${window.eHp}/${window.eMaxHp} | 弱点属性は [ ${currentWeak || "なし"} ] だ！`;
        }

        const battleLog = document.getElementById('battle-log');
        if (battleLog) { battleLog.innerHTML = `${coreTxt} <span>▶</span>`; }

// 🌟【フライング粉砕パッチ】魔力集中(chg)の時は、次のターンまで2.5倍の倍率（mana）をリセットせず大事にキープする！
        if (playerMove !== 'chg') {
            window.mana = 1.0;
        }
        window._activeMagicTimeout = null; 
        window.updateStatusBadgesUI();
        
        setTimeout(() => {
            if (effScr) effScr.className = "";
            if (window.eHp <= 0) { window.battleStepState = 'NONE'; window.checkBattleEnd(); } 
            else { window.battleStepState = 'PLAYER_DONE'; }
        }, 600);
    }, 600);
};

// ==========================================
// 【１１】👹エネミーターン固有特殊技
// ==========================================
window.enemyTurnAction = function() {
    let isPlayerDefending = window.nextTurnIsEnemySpecial; window.nextTurnIsEnemySpecial = false;

    if (window.eHp <= 0 || window.pHp <= 0) { window.battleStepState = 'ENEMY_DONE'; window.advanceBattleStep(); return; }
    const data = window.STAGES[window.curIdx]; const battleLog = document.getElementById('battle-log');

    // 🌟【大開通パッチ：変数スコープ定義】
    // エネミーターンの部屋に入った瞬間に、敵の画像コンテナの身元を100%確実に確保する！
    const eContainer = document.getElementById('e-sprite-container');
    const eSpriteGraphic = document.getElementById('e-sprite-graphic');

    // 🏠【大元・行動不能グループ枠
    // 消去されてしまうタンスではなく、絶対不滅の金庫 最速ホールドの門番にする！
    const iswhite = window.enemywhiteTurns > 0; // 🌟【追加！】新フリーズの線
    const isfreeze = window.enemyfreezeTurns > 0; 
    const isSleep = window.enemySleepTurns > 0;
    const isParalyze = window.enemyParalyzeTurns > 0;

// 🌟条件式に `iswhite` も追加して、アニメ一時停止の網に引っかける！
    if (iswhite || isfreeze || isSleep || isParalyze) {
        if (eContainer) {
            // 🛑 【共通ルール】敵のパラパラ漫画アニメをカチッと一時停止！
            eContainer.style.animationPlayState = "paused";
        }

        // 🚪【個別の味付け（個室の分岐）】
        if (isfreeze) {
            // ❄️ 凍結個室：青白フィルターをかけ、専用ログを投影！
            if (eContainer) eContainer.style.setProperty("filter", "brightness(2) saturate(0.2) drop-shadow(0 0 25px #0ea5e9)", "important");
            if (battleLog) battleLog.innerHTML = `❄️ ${data.name}は冷気で凍りついていてまともに動けない！行動スキップ！ <span>▶</span>`;
        } 
        else if (isSleep) {
            if (battleLog) battleLog.innerHTML = `💤 ${data.name}は心地よさそうに深く眠っている！行動スキップ！ <span>▶</span>`;
        } 
        else if (isParalyze) {
            if (battleLog) battleLog.innerHTML = `⚡ ${data.name}は身体が激しく痺れていて動けない！行動スキップ！ <span>▶</span>`;
        }
　　    else if (iswhite) {
            if (battleLog) battleLog.innerHTML = `❄️ ${data.name}は氷結！凍り付いて動けない！行動スキップ！ <span>▶</span>`;
        }

        // 🛑 【共通ルール】デッドロックを粉砕し、進行ボタン（▶）を出して生還させるチケット発行！
        window.battleStepState = 'ENEMY_DONE'; 
        // 🕵️‍♂️ 【真犯人追跡ログ】この1行を書き足す
        console.log("【麻痺判定チェック】", "旧:", window.enemyParalyzeTurns, "新:", window.enemyStatus.paralyzeTurns, "再生状態:", eContainer ? eContainer.style.animationPlayState : "なし");
        
        
        // 🛠️ 【ステップ②：追加事項】スキップ脱出の直前に、新旧両方の麻痺ターン数を同時に1減らす！
        if (window.enemyParalyzeTurns > 0) {
            window.enemyParalyzeTurns--;          // 元のアニメ停止・スキップ判定用の数値を消費
            window.enemyStatus.paralyzeTurns--;   // 画面最上部のバッジ「🔆 麻痺:X T」の表示を更新
              }
    　  if (window.enemywhiteTurns > 0) {
            window.enemywhiteTurns--;          // 元のアニメ停止・スキップ判定用の数値を消費
            window.enemyStatus.whiteTurns--;   // 画面最上部のバッジ「❄️ 氷結:X T」の表示を更新
              }
       if (window.enemyfreezeTurns > 0) {
            window.enemyfreezeTurns--;          // 元のアニメ停止・スキップ判定用の数値を消費
            window.enemyStatus.freezeTurns--;   // 画面最上部のバッジ「❄️ 凍結:X T」の表示を更新
              }     
        



        return; // ⚔️ 大技や通常攻撃の部屋への進入を100%完全遮断して引き返す！
    } 
    else {
        // ✨【自動お掃除コード】アイスロックが 0 になった瞬間に自動発動！
        if (eContainer) {
            // 凍結が解けたら、一時停止（paused）の呪いを解除して通常のパラパラ漫画へ美しく自動復帰！
            eContainer.style.animationPlayState = "running";
        }
        
        // 🧼 猛毒など、行動不能以外の見た目連動はここに完全無傷で格納
        if (eContainer && window.enemyStatus.poisonTurns > 0) {
            eContainer.style.setProperty("filter", "drop-shadow(0 0 25px #22c55e) brightness(0.85)", "important");
            if (eSpriteGraphic) eSpriteGraphic.style.animation = "poisonVibe 0.12s infinite";
        }
    }

    function applyDotBlur(baseDmg) { return Math.floor(baseDmg * (0.8 + Math.random() * 0.4)); }

// 🔥 【1. 火傷（かしょう）の処理】 --------------------------------------------
    // 👥 敵側の火傷（一番安全な初期の形にリセットします）
    if (window.enemyStatus.burnTurns > 0) {
        const burnDmg = applyDotBlur(15); 
        window.eHp = Math.max(0, window.eHp - burnDmg); 
        window.enemyStatus.burnTurns--;
        
        createDmgPop(burnDmg, false); 
        if (typeof updateHpUI === 'function') updateHpUI();
        
        if (battleLog) {
            battleLog.innerHTML = `🔥 火傷の業火が体表を焼き焦がす！${data.name}に【${burnDmg}】のダメージ！<span>▶</span>`;
        }
        
// 🟢 2. 【最重要：進行一時差し止め安全タイマー】
        // 画面に文字が出たこの瞬間から、ゲーム全体の進行を【1.5秒間（1500ms）】だけピタッとフリーズさせます！
        // これにより、下にある「通常攻撃の部屋」の文字に一瞬で上書きされるのを100%完全に防壁ブロックします！
        window.isBusy = true; // 1.5秒間、あらゆる自動進行やクリックをガチッとロック
        
        setTimeout(() => {
            // ⏱️ 1.5秒経ったら、優しく安全ロックを解除！
            window.isBusy = false;
            // 🚀 ここで初めて、下にある「敵の本番攻撃（通常攻撃 or 大技）」へ電気がスムーズに流れていきます！
        }, 1500); 
    }

else if (window.enemyStatus.poisonTurns > 0) {
            // 🧪 猛毒：【究極融合パッチ】プルプル振動 ＋ 背後緑 ＋ ぼたぼた紫滴 ＋ 足元泥だまり
        const poisonDmg = applyDotBlur(10); window.eHp = Math.max(0, window.eHp - poisonDmg); window.enemyStatus.poisonTurns--;
        createDmgPop(poisonDmg, false); if (typeof updateHpUI === 'function') updateHpUI();
        if (battleLog) battleLog.innerHTML = `🧪 有害な猛毒スリップが体内で弾け飛ぶ！${data.name}に【${poisonDmg}】のダメージ！ <span>▶</span>`;
        if (window.eHp <= 0) { window.battleStepState = 'NONE'; setTimeout(() => { window.checkBattleEnd(); }, 600); return; }
    }


else if (window.enemyStatus.sleepTurns > 0) {
// （中略：マスターの美しい睡眠オーラ処理を1文字も変えずに完全保護）
        }



    let isSpecial = (Math.random() < 0.45); 
    if (window.isPlayerCorroded && isPlayerDefending) { isPlayerDefending = false; }
if (window.playerStatus && window.playerStatus.shieldTurns > 0) {
       window.enemyMana = 0.3; // ⏳ 寿命がある限り、お片付けされてもここで強制的に0.3倍に引き戻す！
   }
   let dmg = isPlayerDefending ? Math.max(1, Math.floor(data.atk * 0.15)) : data.atk;
    dmg = Math.floor(dmg * window.enemyMana); window.enemyMana = 1.0;

    // 🎲 【新規増設】：敵の通常攻撃にプラスマイナス10%（0.9 〜 1.1倍）の乱数を乗せる回路
    // Math.random() は 0.0〜1.0 未満の数字が出るので、0.2 をかけると 0.0〜0.2 未満になります。
    // そこに 0.9 を足すことで、最終的に「0.90 〜 1.10 未満」の倍率がハキハキ完成します！
    if (!isSpecial) { 
        dmg = Math.floor(dmg * (0.8 + Math.random() * 0.25)); 
    }

    if (window.isAmuletActive > 0 && !isPlayerDefending) { dmg = Math.floor(dmg * 0.5); }

    if (window.enemyBlindTurns > 0 && !isSpecial) {
        window.enemyBlindTurns--;
        if (Math.random() < 0.5) {
            if (battleLog) battleLog.innerHTML = `✨ 暗闇の目潰し効果！ 視界を失った${data.name}の猛撃は虚しく空を切った（MISS）！ <span>▶</span>`;
            window.battleStepState = 'ENEMY_DONE'; return;
        }
    } else if (window.enemyBlindTurns > 0) { window.enemyBlindTurns--; }

    window.isPlayerMuted = false; window.isItemBlocked = false; window.isPlayerCorroded = false;


// 🌟 【今回の安全ピンポイント追加！】大技の部屋に入る前に、エフェクト画面の箱を最速で捕まえておきます！
    const effScr = document.getElementById('eff-scr');
    // =============================================================================
    // 【１２】🔊 【完全バグ粉砕】新・大技SE音響個別管理回路 & 一元管理ID同期化
    // =============================================================================

if (isSpecial) {
        let isDoubleAbilityActive = (window.curIdx >= 10 && isSpecial);
let logTxt = "";
    let activeAudio = null;

    // 1. 効果音の個別狙い撃ち
    if (data.type === 'skeleton' || data.type === 'skelton') {
        if (typeof playSE === 'function') activeAudio = playSE(SOUND_FREEZE_DEAD);
    } else if (data.type === 'harpy') {
        if (typeof playSE === 'function') activeAudio = playSE(SOUND_WIND);
    } else if (data.type === 'slime' || data.type === 'maiconid' || data.type === 'mush') {
        if (typeof playSE === 'function') {
            if (typeof SOUND_POISON !== 'undefined') { playSE(SOUND_POISON); }
            else if (typeof SOUND_WIND !== 'undefined') { playSE(SOUND_WIND); }
        }
    } else if (data.type === 'dragon') {
        if (typeof playSE === 'function') activeAudio = playSE(SOUND_DRAGON_CRY);
    } else {
        if (typeof playSE === 'function') activeAudio = playSE(SOUND_ICE);
    }

    if (effScr) effScr.style.pointerEvents = "auto";

    const result = window.executeEnemySpecial(data, dmg, logTxt, effScr, isSpecial); dmg = result.dmg; logTxt = result.logTxt;

    // =============================================================================
    // 【１３】👹 全15体型・絶対個別判定式モンスター大技配線 enemi-JSに引っ越し
    // =============================================================================
    

    // =============================================================================
    // 【１４】📉 ダメージ処理＆ログ転送
    // =============================================================================
    battleLog.innerHTML = `${logTxt} <span>▶</span>`; window.pHp = Math.max(0, window.pHp - dmg);
    if (typeof updateHpUI === 'function') updateHpUI(); createDmgPop(dmg, true);
    
    setTimeout(() => { 
        if (effScr) effScr.className = ""; 
        if (window.pHp <= 0) { window.battleStepState = 'NONE'; window.checkBattleEnd(); } 
        else { window.battleStepState = 'ENEMY_DONE'; }
    }, 1100);
}
 else {
        const eContainer = document.getElementById('e-sprite-container');
        if (eContainer) {
  // 💥【ピンポイント体当たり復旧】敵の画像コンテナを左（プレイヤー方向）へ一瞬ガタッと突き出す
// 💥【大迫力・体当たり完全復旧】元の設計通り -140px プレイヤーの目前まで音速突進させる
            eContainer.style.transition = "transform 0.1s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
            eContainer.style.transform = "translateX(-200px) scale(1.1)"; // プレイヤーの目の前まで激しく突進
            setTimeout(() => {
                eContainer.style.transition = "transform 0.25s ease-in-out";
                eContainer.style.transform = "translateX(0) scale(1)"; // フワッと元の位置に戻る
            }, 180);
        }

        setTimeout(() => { playSE(SOUND_KICK); }, 200);

        setTimeout(() => { 
            if (eContainer) {
                // 🌟【大元共通出口パッチ】アイス・麻痺・睡眠すべての行動不能デバフをここで一斉検知！
                if ((window.enemyfreezeTurns > 0 || window.enemySleepTurns > 0 || window.enemyParalyzeTurns > 0|| window.enemywhiteTurns > 0)) {
                                       
                    eContainer.style.animationPlayState = "paused"; // アニメーション一時停止を維持
                    window.battleStepState = 'ENEMY_DONE'; // 進行待ち（▶）チケットをガチッと発行
                    window.updateStatusBadgesUI();        // UIを強制更新して進行ボタンを表示！
                    return; // ⚔️直下のダメージ計算やHP引き算を100%スキップして安全に引き返す！
                }
            // 🛡️【98点文法トラップ・完全包囲パッチ】
                // 11階以降のガタガタ震えを根絶し、かつ前任者がこの直下へ未完結のまま繋いでいた「胃袋のネスト」を破壊しないよう、
                // 構文木(SyntaxTree)の整合性を寸分狂わず維持したまま、美しい浮遊待機(2.2s)へ安全着地させます。
                eContainer.style.animation = "floatE 2.2s infinite alternate ease-in-out";
            }

            const physicalAttackTexts = [ `${data.name}の激しい突撃！`, `${data.name}の強烈な体当たり！`, `${data.name}の凄まじい肉弾突進！` ];
            const chosenText = physicalAttackTexts[Math.floor(Math.random() * physicalAttackTexts.length)];
            if (battleLog) battleLog.innerHTML = `${chosenText}【${dmg}】の物理ダメージを喰らった！ <span>▶</span>`;

            window.pHp = Math.max(0, window.pHp - dmg); if (typeof updateHpUI === 'function') updateHpUI(); createDmgPop(dmg, true);

if (window.pHp <= 0) { window.battleStepState = 'NONE'; window.checkBattleEnd(); } 
            else { window.battleStepState = 'ENEMY_DONE'; }
            
            
            // 🧼 敵の通常行動が終わった瞬間にバッジ表示を最新状態に更新！
            window.updateStatusBadgesUI();
        }, 460);
    }
// =============================================================================
    // 🛡️ 【大本命：ここへ差し込み！】タイマーの「外」なので、毎ターン100%確実に電気を通します
    // =============================================================================
    if (window.playerStatus && window.playerStatus.shieldTurns > 0) {
        window.playerStatus.shieldTurns--;
    }
    // 💥 【一元管理引き算回路】1ターン終了時に、新IDの残りターン数をここでハキハキ消化！
    // プレイヤー側デバフ
    if (window.playerStatus.paralyzeTurns > 0) window.playerStatus.paralyzeTurns--; 
    if (window.playerStatus.painTurns > 0)     window.playerStatus.painTurns--; 
    if (window.playerStatus.chainTurns > 0)    window.playerStatus.chainTurns--; 
    if (window.playerStatus.giddyTurns > 0)    window.playerStatus.giddyTurns--;
    if (window.playerStatus.doomTurns > 0)     window.playerStatus.doomTurns--;
    if (window.playerStatus.corrodeTurns > 0)  window.playerStatus.corrodeTurns--; 
    
    // 敵側デバフ（★ここを新規追加することで、ファイアやバイオのバッジが毎ターン自動で減ります！）
    if (window.enemyStatus.burnTurns > 0)     window.enemyStatus.burnTurns--;
    if (window.enemyStatus.freezeTurns > 0)   window.enemyStatus.freezeTurns--;
    if (window.enemyStatus.sleepTurns > 0)    window.enemyStatus.sleepTurns--;
    if (window.enemyStatus.paralyzeTurns > 0) window.enemyStatus.paralyzeTurns--;
    if (window.enemyStatus.poisonTurns > 0)   window.enemyStatus.poisonTurns--;
　　if (window.enemyStatus.whiteTurns > 0)    window.enemyStatus.whiteTurns--;
    if (window.isAmuletActive > 0) { window.isAmuletActive--; }
    
    // 🧼 引き算が終わった最新の数字を、即座に画面最上部ヘッダーへ再投影！
    window.updateStatusBadgesUI();
};

window.checkBattleEnd = function() {
    if (window.pHp <= 0 || window.eHp <= 0) {
        stopBGM(); if (typeof stopSlimeAnimation === 'function') stopSlimeAnimation();
        if (window._logResetTimeout) { clearTimeout(window._logResetTimeout); window._logResetTimeout = null; }
        if (window._freezeAnimationTimeout) { clearTimeout(window._freezeAnimationTimeout); window._freezeAnimationTimeout = null; }

        const effScr = document.getElementById('eff-scr'); if (effScr) effScr.style.pointerEvents = "none";

        if (window.eHp <= 0) {
            playSE(SOUND_FREEZE_DEAD);
            const eContainer = document.getElementById('e-sprite-container'); const board = document.getElementById('sq-board');
            
            if (board) board.classList.add("screen-shake-flash");
            
            // 🌟【最終決戦仕様：大質量ドット粒子バースト＆衝撃波リング回路】
            if (eContainer) {
                // 🎬 1. 飛び散る巨体破片と衝撃波のハイパーCSS台本を最速登録
                if (!document.getElementById("retro-mega-pixel-burst-style")) {
                    const style = document.createElement("style");
                    style.id = "retro-mega-pixel-burst-style";
                    style.innerHTML = `
                        @keyframes megaPixelFly {
                            0% { transform: translate(0, 0) rotate(0deg) scale(1.5); opacity: 1; }
                            20% { opacity: 1; }
                            100% { transform: translate(var(--mx), var(--my)) rotate(var(--mr)) scale(0); opacity: 0; }
                        }
                        @keyframes shockwaveExpand {
                            0% { transform: translate(-50%, -50%) scale(0.1); border-width: 30px; opacity: 1; filter: blur(0px); }
                            50% { opacity: 1; filter: blur(2px); }
                            100% { transform: translate(-50%, -50%) scale(2.8); border-width: 1px; opacity: 0; filter: blur(8px); }
                        }
                        /* 🔲 敵の体がドット状に崩壊して引き裂かれる予兆アニメ */
                        @keyframes bodyGlitchCollapse {
                            0% { filter: brightness(5) contrast(3); transform: scale(1) skewX(0deg); }
                            30% { filter: brightness(3) contrast(8); transform: scaleX(1.4) scaleY(0.6) skewX(-20deg); image-rendering: pixelated; }
                            70% { filter: brightness(4) contrast(10); transform: scaleX(0.5) scaleY(1.5) skewX(20deg); image-rendering: pixelated; }
                            100% { filter: brightness(8) blur(10px); transform: scale(0); opacity: 0; }
                        }
                    `;
                    document.head.appendChild(style);
                }

                // 2. 敵の体そのものを、消える寸前に「ドットのモザイクノイズ」としてガガガッと激しく崩壊させる！
                eContainer.style.transition = "none";
                eContainer.style.animation = "bodyGlitchCollapse 0.2s steps(4) forwards";

                const targetScr = effScr || document.getElementById('sq-board');
                if (targetScr) {
                    // 3. 💥 【超弩級・衝撃波リング】爆発の中心からネオンの輪をドンッ！！と大拡散させる
                    const wave = document.createElement("div");
                    wave.style.cssText = `
                        position: absolute; left: 75%; top: 45%; width: 150px; height: 150px;
                        border: 15px solid #34d399; border-radius: 50%; pointer-events: none; z-index: 100008;
                        box-shadow: 0 0 30px #06b6d4, inset 0 0 30px #a855f7;
                        animation: shockwaveExpand 0.6s cubic-bezier(0.1, 0.8, 0.3, 1) forwards;
                    `;
                    targetScr.appendChild(wave);
                    setTimeout(() => { wave.remove(); }, 600);

                    // 4. 🔥 【破片80個の超大増量】大中小の不揃いなドット塊を四方八方へ超強烈に弾き飛ばす！
                    for (let i = 0; i < 80; i++) {
                        const p = document.createElement("div");
                        
                        // サイバー感あふれる極彩色（白、緑、シアン、ネオンピンク、ゴールド）
                        const colors = ["#ffffff", "#34d399", "#06b6d4", "#f43f5e", "#eab308"];
                        const chosenColor = colors[Math.floor(Math.random() * colors.length)];
                        
                        // 📐 4pxの極小粒から、18pxのド派手なドット破片（塊）までランダムミックス
                        const size = Math.floor(Math.random() * 15) + 4;
                        
                        // 🚀 爆発の威力を3倍に！画面の外まで突き抜けるほどの広範囲な飛散距離を計算
                        const angle = Math.random() * Math.PI * 2;
                        const distance = Math.floor(Math.random() * 280) + 80; // 飛散半径を大幅拡張！
                        const mx = Math.cos(angle) * distance + "px";
                        const my = Math.sin(angle) * distance - Math.floor(Math.random() * 100) + "px"; // 爆風で上空へ舞い上がる
                        const mr = Math.floor(Math.random() * 720) - 360 + "deg"; // 破片自体も激しく回転
                        
                        p.style.cssText = `
                            position: absolute; left: 75%; top: 45%;
                            width: ${size}px; height: ${size}px;
                            background: ${chosenColor}; box-shadow: 0 0 12px ${chosenColor};
                            pointer-events: none; z-index: 100010;
                            image-rendering: pixelated;
                            --mx: ${mx}; --my: ${my}; --mr: ${mr};
                            animation: megaPixelFly ${0.5 + Math.random() * 0.7}s cubic-bezier(0.05, 0.85, 0.2, 1) forwards;
                        `;
                        
                        targetScr.appendChild(p);
                        setTimeout(() => { p.remove(); }, 1200);
                    }
                }
            }

            setTimeout(() => { 
                if (board) board.classList.remove("screen-shake-flash");
                window.pSavedLevel++; window.pSavedMaxHp += 15; window.pSavedMaxMp += 10; // 永久的な最大限界値上昇
                
                // 🛡️ 🏆 【ドラフト全破棄＆スライムループ完全粉砕パッチ】
                // バグの原因だったドラフト呼び出しを完全撤去！
                // 古い戦闘画面を確実に隠し、そのままストレートに突破リザルト画面を完全開通させる！
                if (document.getElementById('scr-battle')) document.getElementById('scr-battle').style.display = 'none';
                window.transitionToResult();
            }, 1400);
        } else {
            showScreen('scr-result'); window.transitionToResult();
        }
        return true;
    }
    return false;
};

// ==========================================
// 【１５】🎰 3連魔導スクロール回転スロットカードドラフト演出実装
// ==========================================
window.triggerCardDraft = function() {
    let draftDiv = document.getElementById('scr-draft-box');
    if (!draftDiv) {
        draftDiv = document.createElement('div'); draftDiv.id = 'scr-draft-box';
        draftDiv.style.cssText = "position:absolute; top:0; left:0; width:100%; height:100%; background:rgba(2,6,23,0.98); color:#fff; font-family:monospace; padding:30px 20px; box-sizing:border-box; z-index:100005; display:flex; flex-direction:column; align-items:center; justify-content:center;";
        document.body.appendChild(draftDiv);
    }
    draftDiv.style.display = 'flex';
    if (typeof playSE === 'function') playSE(SOUND_EARTHQUAKE); // 地震前兆SE連動

// 🌟 ドラフトに絶対出していい「11大選抜メンバー」の確定ホワイトリスト
    const allowedDraftSpells = ['fire', 'wasp2', 'scis', 'scre', 'wasp', 'flod', 'quak', 'drai', 'mete', 'come', 'ulti'];

    // 11大選抜の中から、プレイヤーが「まだ覚えていないもの」だけを抽出
    let unlearned = allowedDraftSpells.filter(k => !window.playerSpells.includes(k));

    // 🔒【設定が一番楽な②：10階層ロック】
    // 10階（curIdxが9）未満の時は、コメット・メテオ・アルテマを抽選箱から強制排除！
    if (window.curIdx < 9) {
        const forbiddenSpells = ['come', 'mete', 'ulti'];
        unlearned = unlearned.filter(k => !forbiddenSpells.includes(k));
    }

    // 残り少なくなった時の安全弁（10階未満ならクエイクなどを保証）
    if (unlearned.length < 3) {
        unlearned = window.curIdx < 9 ? ['scis', 'scre', 'quak'] : ['quak', 'come', 'ulti'];
    }
    
    let shuffled = unlearned.sort(() => 0.5 - Math.random()); //
    let pick3 = [shuffled[0], shuffled[1], shuffled[2]]; //

   // 🎨 【インデックスアイコン完全同期配線】
    // index.html のボタン絵文字と100%シンクロさせる特大マッピング
    function getSpellIconHuge(key) {
        // 1. 呪文の識別キー（fire, scre等）で直接ピンポイントに絵文字を仕分け！
        if (key === 'fire')   return "🔥"; // ファイア
        if (key === 'ice')    return "❄️"; // アイス
        if (key === 'scre')   return "🔊"; // スクリーム
        if (key === 'wasp')   return "🐝"; // ワスプ
        if (key === 'wasp2')  return "❄️"; // フリーズ
        if (key === 'scis')   return "✂️"; // シザーズ
        if (key === 'flod')   return "🌊"; // フラッド
        if (key === 'quak')   return "🪨"; // クエイク
        if (key === 'drai')   return "🦇"; // ドレイン
        if (key === 'mete')   return "☄️"; // メテオ
        if (key === 'come')   return "🌠"; // コメット
        if (key === 'ulti')   return "🌌"; // アルテマ

        // 2. もし上記にない新しい呪文が追加された場合は、大元の属性(attr)から自動判定
        const spellAttr = SPELLS[key]?.attr;
        if (spellAttr === 'fire')   return "🔥";
        if (spellAttr === 'ice')    return "❄️";
        if (spellAttr === 'ele')    return "⚡";
        if (spellAttr === 'holy')   return "✨";
        if (spellAttr === 'dark')   return "💀";
        if (spellAttr === 'aero')   return "🌪️";
        if (spellAttr === 'poison') return "🧪";
        if (spellAttr === 'earth')  return "🪨";
        return "🔮"; // すべての外れ値は魔導水晶
    }

    const icon0 = getSpellIconHuge(pick3[0]);
    const icon1 = getSpellIconHuge(pick3[1]);
    const icon2 = getSpellIconHuge(pick3[2]);

    draftDiv.innerHTML = `
        <div style="font-size:1.6rem; font-weight:bold; color:#eab308; margin-bottom:10px; text-shadow:0 0 10px #eab308; font-family:monospace;">🌟 LEVEL UP! (LV:${window.pLevel} ➔ ${window.pLevel+1})</div>
        <div style="color:#94a3b8; font-size:0.85rem; margin-bottom:25px; text-align:center; font-family:monospace;">最大HP・最大MP 限界突破！<br>魔導スクロールが高速リール回転中……掴み取れ！</div>
        
        <div style="display:flex; gap:20px; margin-bottom:30px; width:100%; justify-content:center; max-width:500px; font-family:monospace;">
            <div id="reel-0" style="flex:1; background:#0f172a; border:3px solid #334155; border-radius:8px; height:150px; display:flex; flex-direction:column; align-items:center; justify-content:center; font-size:1rem; font-weight:bold; color:#a5b4fc; text-align:center; padding:10px; box-sizing:border-box; transition: border-color 0.2s;">🌀</div>
            <div id="reel-1" style="flex:1; background:#0f172a; border:3px solid #334155; border-radius:8px; height:150px; display:flex; flex-direction:column; align-items:center; justify-content:center; font-size:1rem; font-weight:bold; color:#a5b4fc; text-align:center; padding:10px; box-sizing:border-box; transition: border-color 0.2s;">🌀</div>
            <div id="reel-2" style="flex:1; background:#0f172a; border:3px solid #334155; border-radius:8px; height:150px; display:flex; flex-direction:column; align-items:center; justify-content:center; font-size:1rem; font-weight:bold; color:#a5b4fc; text-align:center; padding:10px; box-sizing:border-box; transition: border-color 0.2s;">🌀</div>
        </div>
        
        <div id="draft-btn-zone" style="display:grid; grid-template-columns:1fr; gap:12px; width:100%; max-width:400px; opacity:0; pointer-events:none; transition:opacity 0.3s; font-family:monospace;">
            <button onclick="window.selectDraftSpell('${pick3[0]}')" style="background: linear-gradient(135deg, #1e1b4b, #312e81); border:2px solid #6366f1; color:#fff; padding:12px; border-radius:8px; font-weight:bold; cursor:pointer; box-shadow: 0 4px 10px rgba(99,102,241,0.3); font-size:1rem;">🔮 『${SPELLS[pick3[0]].name}』を永久記憶</button>
            <button onclick="window.selectDraftSpell('${pick3[1]}')" style="background: linear-gradient(135deg, #1e1b4b, #312e81); border:2px solid #6366f1; color:#fff; padding:12px; border-radius:8px; font-weight:bold; cursor:pointer; box-shadow: 0 4px 10px rgba(99,102,241,0.3); font-size:1rem;">🔮 『${SPELLS[pick3[1]].name}』を永久記憶</button>
            <button onclick="window.selectDraftSpell('${pick3[2]}')" style="background: linear-gradient(135deg, #1e1b4b, #312e81); border:2px solid #6366f1; color:#fff; padding:12px; border-radius:8px; font-weight:bold; cursor:pointer; box-shadow: 0 4px 10px rgba(99,102,241,0.3); font-size:1rem;">🔮 『${SPELLS[pick3[2]].name}』を永久記憶</button>
        </div>
    `;

    if (typeof playSE === 'function') setTimeout(() => { playSE(SOUND_WIND); }, 150); //

    // ⏳ 0.6s, 1.0s, 1.4s の時間差でリールが停止し、特大アイコンが出現する演出
    setTimeout(() => { 
        const r=document.getElementById('reel-0'); 
        if(r){ r.innerHTML=`<div style="font-size:3rem; margin-bottom:5px; filter:drop-shadow(0 0 8px #818cf8);">${icon0}</div><div style="color:#fff;">${SPELLS[pick3[0]].name}</div>`; r.style.borderColor='#818cf8'; if (typeof playSE === 'function') playSE(SOUND_ICE); } //
    }, 600);
    
    setTimeout(() => { 
        const r=document.getElementById('reel-1'); 
        if(r){ r.innerHTML=`<div style="font-size:3rem; margin-bottom:5px; filter:drop-shadow(0 0 8px #818cf8);">${icon1}</div><div style="color:#fff;">${SPELLS[pick3[1]].name}</div>`; r.style.borderColor='#818cf8'; if (typeof playSE === 'function') playSE(SOUND_ICE); } //
    }, 1000);
    
    setTimeout(() => { 
        const r=document.getElementById('reel-2'); 
        if(r){ r.innerHTML=`<div style="font-size:3rem; margin-bottom:5px; filter:drop-shadow(0 0 8px #818cf8);">${icon2}</div><div style="color:#fff;">${SPELLS[pick3[2]].name}</div>`; r.style.borderColor='#818cf8'; if (typeof playSE === 'function') playSE(SOUND_ICE); } //
        if (typeof playSE === 'function') playSE(SOUND_HOLY); //
        const zone = document.getElementById('draft-btn-zone'); if(zone){ zone.style.opacity='1'; zone.style.pointerEvents='auto'; } //
    }, 1400);
};
// ==========================================
// 【１６】その他
// ==========================================
window.selectDraftSpell = function(spellKey) {
    // 🌟 選んだ呪文をカバンと金庫にガチッと追加！
    if (spellKey && !window.playerSpells.includes(spellKey)) {
        window.playerSpells.push(spellKey);
        window.pSavedSpells = [...window.playerSpells];
    }

    // 🎰 スペルドラフト処理を完全バイパスし、昔のシンプルな直結進級ルートへリフォーム
    window.pLevel++; window.pSavedLevel = window.pLevel;
    window.pMaxHp = window.pSavedMaxHp; window.pMaxMp = window.pSavedMaxMp;
    window.pHp = window.pMaxHp; window.pMp = window.pMaxMp; 

    // ドラフト箱と戦闘画面の残像を一斉消灯し、余計な再呼び出しを挟まずに次ステージへ直撃
    const draftDiv = document.getElementById('scr-draft-box'); if (draftDiv) draftDiv.style.display = 'none';
    if (document.getElementById('scr-battle')) document.getElementById('scr-battle').style.display = 'none';
    
    // 🛡️【98点バグ・幽霊ロック完全粉砕安全弁】
    // 次の階層のキャンプ処理へバトンタッチするその瞬間に、ボタンを硬直させている鍵を強制解除します。
    window.isBusy = false; 
    window.battleStepState = 'NONE';

    // 🛡️ 🏆 【スライム無限ループバグ完全粉砕】
    // リザルト関数を二重に走らせる無限ループの原因を完全撤去し、そのまま上の階層へまっすぐ上がる！
    window.nextStage();
};

window.transitionToResult = function() {

    // ── 📊 経験値＆報酬計算エリア ───────────────────────────────────────
    window.currentBattleRewardLog = ""; 
    
    // ⭕ プレイヤーが【勝利】したときのみ、この大部屋に入ります
    if (window.eHp <= 0) { 
    
        // =====================================================================
        // 🎰 【完全勝利限定】10階ボス（暗黒竜）撃破時のみ、即エンディング制御へ！
        // =====================================================================
        if (window.curIdx === 9) {
            if (typeof stopBGM === 'function') stopBGM();
            startBGM("grand_end"); 

            showScreen('scr-result');
            const rTitle = document.getElementById('res-title'); 
            const rText = document.getElementById('res-text'); 
            const rBtn = document.getElementById('res-btn');

            // 👑 【新規追加】髑髏を完全に引き算し、タワー制覇の王冠をハキハキ強制インジェクション！
            const resIcon = document.getElementById('res-icon');
            if (resIcon) resIcon.innerText = "👑";
            if (rTitle) rTitle.innerText = "GRAND END";
            if (rText) rText.innerText = "暗黒竜を討伐し、世界に永遠の平穏が訪れた！螺旋のタワー完全制覇、おめでとうございます！";
            if (rBtn) rBtn.innerText = "タイトルへ戻る"; 
            
if (rBtn) { 
                // 🔄 「タイトルへ戻る」を押した瞬間にページを再読み込みし、全てのバグを完全消滅させる！
                rBtn.onclick = function() { 
                    window.location.reload(); 
                }; 
            }
            window.isBusy = false; 
            window.battleStepState = 'NONE';
            return; // 🛑 エンディングなのでここで処理終了
        }

        const _data = window.STAGES[window.curIdx];
        let _gainedExp = Math.floor(((window.curIdx + 1) * 4) * (0.9 + Math.random() * 0.2)) + 5;
        let _bonusTexts = [];

        if (window.pHp === window.pMaxHp) { _gainedExp += 10; _bonusTexts.push("【無傷の勝利(+10)】"); }
        if (window.mana > 1.0) { _gainedExp += 15; _bonusTexts.push("【魔導の極み(+15)】"); }
        
        let _lastAttr = (typeof playerMove !== 'undefined' && SPELLS[playerMove]) ? SPELLS[playerMove].attr : null;
        let _isHitWeak = (_lastAttr && _data && Array.isArray(_data.weak)) ? _data.weak.includes(_lastAttr) : false;
        if (_isHitWeak) { _gainedExp += 10; _bonusTexts.push("【弱点看破(+10)】"); }
        if (window.pHp <= window.pMaxHp * 0.2) { _gainedExp += 20; _bonusTexts.push("【九死に一生(+20)】"); }

        window.pExp += _gainedExp;
        let _reqExp = window.getRequiredExpForNextLevel(window.pLevel);
        let _isLvUp = false;
        let _statReport = ""; 

 while (window.pExp >= _reqExp) {
            window.pExp -= _reqExp;
            
            // ⭕ 偽物の pLevel ではなく、本物の window.pLv をプラスする！
            window.pLv++; 
            window.pSavedLevel = window.pLv;
            
            let hpGain = 0; let mpGain = 0;
            if (typeof window.growCoreStatsRandomly === 'function') {
                const result = window.growCoreStatsRandomly();
                _statReport += result.text;
                hpGain = (Math.floor(Math.random() * 4) + 3) + result.gains.con;
                mpGain = (Math.floor(Math.random() * 4) + 3) + (result.gains.int * 3) + result.gains.wis; 
            } else { hpGain = 5; mpGain = 5; }

            window.pMaxHp += hpGain; window.pMaxMp += mpGain;
            window.pSavedMaxHp = window.pMaxHp; window.pSavedMaxMp = window.pMaxMp;
            _statReport += `<br><span style="color:#38bdf8; font-size:0.8rem;">❤️ 最大HP＋${hpGain} | 🔷 最大MP＋${mpGain}</span>`;
            _isLvUp = true;
            
            // ⭕ ここも本物の window.pLv を渡して、次のレベルの重い必要経験値を正しく計算させる！
            _reqExp = window.getRequiredExpForNextLevel(window.pLv);
        }

        if (_isLvUp) { 
            window.pHp = window.pMaxHp; window.pMp = window.pMaxMp; window.isPlayerLevelUpPending = true; 
        } else { window.isPlayerLevelUpPending = false; }

        let _bonusReport = _bonusTexts.length ? `<br><span style="color:#38bdf8; font-size:0.8rem;">✨ 評価ボーナス: ${_bonusTexts.join(' ')}</span>` : "";
        
        window.currentBattleRewardLog = `獲得経験値: ＋${_gainedExp} EXP ${_bonusReport}${_statReport}`;
if (_isLvUp) { window.currentBattleRewardLog += `<br><span style="color:#eab308; font-weight:bold;">🆙 LEVEL UP! [ LV.${window.pLevel + 1} ] 到達！HP・MP【全回復】！</span>`; }
    }

    // ── 🔄 画面切り替えと勝利・敗北の完全ルート分離 ───────────────────────────
    showScreen('scr-result');
    const rTitle = document.getElementById('res-title'); 
    const rText = document.getElementById('res-text'); 
    const rBtn = document.getElementById('res-btn');
    const resIcon = document.getElementById('res-icon');
    
    const battleLog = document.getElementById('battle-log'); 
    if (battleLog) battleLog.innerHTML = "コマンドを選択せよ。";

    // ⭕ 勝利ルート（敵のHPが0になったとき）
    if (window.eHp <= 0) {
        if (resIcon) resIcon.innerText = "🏆";
        if (rTitle) { rTitle.innerText = "VICTORY"; rTitle.style.color = "#0f172a"; }    
        if (typeof stopBGM === 'function') stopBGM();
        if (typeof playSE === 'function') playSE("assets/se/se_fanfare.mp3");

// ── 🎲 【ディレクター仕様】確率傾斜型・ランダムドロップ＆特大ポップアップ完全大開通回路 ──
        // 📥 1. アイテムごとのドロップ率（重み付け）
        const lootTable = [
            { id: 'potion', weight: 60, name: "回復薬", icon: "🧪" },
            { id: 'mana',   weight: 30, name: "魔力の雫", icon: "🔷" },
            { id: 'bomb',   weight: 10, name: "魔導手榴弾", icon: "💣" }
        ];

        // 📊 確率の重みからアイテムを1つ抽選するサイコロ
        function rollWeightedLoot() {
            const totalWeight = lootTable.reduce((sum, item) => sum + item.weight, 0);
            let randomRoll = Math.random() * totalWeight;
            for (const item of lootTable) {
                if (randomRoll < item.weight) return item;
                randomRoll -= item.weight;
            }
            return lootTable[0];
        }

        // 🎲 2. 獲得個数の抽選（0個＝30%、1個＝50%、2個＝20%）
        let lootNum = 0;
        if (window.pStyle === 'ALCHEMIST') {
            lootNum = Math.random() < 0.4 ? 2 : 1; 
        } else {
            let countRoll = Math.random();
            if (countRoll < 0.30) { lootNum = 0; }      
            else if (countRoll < 0.80) { lootNum = 1; } 
            else { lootNum = 2; }                      
        }

        // 3. 抽選結果のデータ組み立て ＆ データのカバン加算
        let hugeIcon = "";
        let hugeName = "";
        let currentDisplayLootText = "";

        if (lootNum === 2) {
            let item1 = rollWeightedLoot();
            let item2 = rollWeightedLoot();
            hugeIcon = item1.icon + item2.icon;
            hugeName = `${item1.name} ＆ ${item2.name}`;
            currentDisplayLootText = `「${item1.name}」と「${item2.name}」を戦利品として獲得！`;
            
            window.itemInventory[item1.id] = (window.itemInventory[item1.id] || 0) + 1;
            window.itemInventory[item2.id] = (window.itemInventory[item2.id] || 0) + 1;
        } 
        else if (lootNum === 1) {
            let item1 = rollWeightedLoot();
            hugeIcon = item1.icon;
            hugeName = item1.id === 'potion' ? "回復薬" : item1.name; 
            currentDisplayLootText = `「${item1.name}」を戦利品として獲得！`;
            
            window.itemInventory[item1.id] = (window.itemInventory[item1.id] || 0) + 1;
        } 
        else {
            hugeIcon = "💨";
            hugeName = "なにもなし";
            currentDisplayLootText = "今回の戦闘では戦利品が見つからなかった……。";
        }

        // 🎬 4. 【特大アイコン獲得ポップアップ演出の完全復旧！】
        // 0個の時は空振り感を出すためにポップアップを出さず、1個以上獲得した時だけドンッと表示します
        if (lootNum > 0) {
            // 画面にまだ演出用の台本（CSS）がなければ最速設営
            if (!document.getElementById("retro-loot-popup-style")) {
                const style = document.createElement("style");
                style.id = "retro-loot-popup-style";
                style.innerHTML = `
                    @keyframes lootPopIn {
                        0% { transform: translate(-50%, -50%) scale(0) rotate(-20deg); opacity: 0; }
                        50% { transform: translate(-50%, -50%) scale(1.4) rotate(10deg); opacity: 1; }
                        70% { transform: translate(-50%, -50%) scale(0.9) rotate(-5deg); }
                        100% { transform: translate(-50%, -50%) scale(1) rotate(0deg); }
                    }
                    @keyframes lootFadeOut {
                        0% { opacity: 1; }
                        100% { opacity: 0; transform: translate(-50%, -80%) scale(0.8); }
                    }
                    .loot-overlay {
                        position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                        background: rgba(0, 0, 0, 0.6); z-index: 99999; border-radius: 24px;
                    }
                    .loot-box-huge {
                        position: absolute; top: 45%; left: 50%;
                        display: flex; flex-direction: column; align-items: center; justify-content: center;
                        z-index: 100000; pointer-events: none; text-align: center;
                        font-family: monospace; animation: lootPopIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
                    }
                    .loot-icon-huge {
                        font-size: 5.5rem; 
                        filter: drop-shadow(0 0 20px #eab308);
                        margin-bottom: 10px;
                    }
                    .loot-text-huge {
                        color: #fff; background: #1e1b4b; border: 2px solid #818cf8;
                        padding: 6px 16px; border-radius: 20px; font-weight: bold; font-size: 1rem;
                        box-shadow: 0 0 15px rgba(129, 140, 248, 0.5);
                    }
                `;
                document.head.appendChild(style);
            }

            // スクエアボード（sq-board）の中にレイヤーをごそっと動的生成
            const board = document.getElementById('sq-board');
            if (board) {
                const overlay = document.createElement("div");
                overlay.className = "loot-overlay";
                overlay.style.cursor = "pointer";
                
                const lootBox = document.createElement("div");
                lootBox.className = "loot-box-huge";
                lootBox.innerHTML = `
                    <div class="loot-icon-huge">${hugeIcon}</div>
                    <div class="loot-text-huge">GET: ${hugeName} !!</div>
                `;
                
                board.appendChild(overlay);
                board.appendChild(lootBox);
                
                // クリックされたら、フワッと消して、次なるレベルアップチェックへ繋ぐ手動突破回路
                overlay.addEventListener("click", function() {
                    overlay.style.transition = "opacity 0.3s ease";
                    overlay.style.opacity = "0";
                    lootBox.style.animation = "lootFadeOut 0.3s forwards";
                    
                    setTimeout(() => {
                        overlay.remove();
                        lootBox.remove();

                        // 🆙 【レベルアップ画面への直結配線】
                        if (window.isPlayerLevelUpPending) {
                            if (typeof playSE === 'function') playSE("assets/se/se_levelup.mp3");
                            const lvOverlay = document.createElement("div");
                            lvOverlay.className = "loot-overlay";
                            lvOverlay.style.cursor = "pointer";
                            
                            if (!document.getElementById("retro-lvup-css")) {
                                const lvStyle = document.createElement("style");
                                lvStyle.id = "retro-lvup-css";
                                lvStyle.innerHTML = `
                                    .lvup-box { position: absolute; top: 45%; left: 50%; display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 100000; text-align: center; font-family: monospace; animation: lootPopIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
                                    .lvup-title { color: #eab308; font-size: 1.8rem; font-weight: 900; margin-bottom: 15px; text-shadow: 0 0 10px #eab308; }
                                    .lvup-row { color: #38bdf8; font-size: 1.1rem; font-weight: bold; margin: 4px 0; }
                                `;
                                document.head.appendChild(lvStyle);
                            }

const lvBox = document.createElement("div");
lvBox.className = "lvup-box";
lvBox.innerHTML = `
    <div class="lvup-title">🌟 LEVEL UP (LV.${window.pLevel + 1}) 🌟</div>
                                <div class="lvup-row">❤️ 最大HP・最大MP 限界突破！</div>
                                <div class="lvup-row" style="color:#10b981;">📊 基礎能力値ダイスロール完了！</div>
                                <div style="color: #64748b; font-size: 0.8rem; margin-top: 20px; animation: pulse 1s infinite;">【 画面をクリックして呪文獲得へ 】</div>
                            `;

                            board.appendChild(lvOverlay);
                            board.appendChild(lvBox);

                            lvOverlay.addEventListener("click", function() {
                                lvOverlay.remove();
                                lvBox.remove();
                                const rBtn = document.getElementById('res-btn');
                                if (rBtn) {
                                    rBtn.innerText = "呪文ドラフトへ進む ➔";
                                    rBtn.onclick = function() {
                                        rBtn.onclick = function() { window.nextStage(); };
                                        if (typeof window.triggerCardDraft === 'function') window.triggerCardDraft();
                                    };
                                }
                            });
                        }
                    }, 300);
                });
            }
        }

if (rText) {
            rText.innerHTML = `第 ${window.STAGES[window.curIdx].floor} 階層突破！ ${currentDisplayLootText}<br><div style="margin-top:10px; border-top:1px dashed #334155; padding-top:8px; text-align:left; font-family:monospace; line-height:1.6; color:#38bdf8;">${window.currentBattleRewardLog || "経験値精算完了"}</div>`;
        }
        
        if (rBtn) {
            // 🟢 ボタンが表示された時点の初期文字を設定
            rBtn.innerText = window.isPlayerLevelUpPending ? "呪文ドラフトへ進む ➔" : "次へ進む";
            
            // 🟢 ボタンがクリックされた時に毎回中身を判定する正しい配線
            rBtn.onclick = function() {
                if (window.isPlayerLevelUpPending) {
                    window.isPlayerLevelUpPending = false; // フラグを消化
                    if (typeof window.triggerCardDraft === 'function') {
                        window.triggerCardDraft(); // ドラフト画面へ突入！
                    }
                } else {
                    window.nextStage(); // レベルアップしてなければ次の階へ
                }
            };
        }
    } // 🔒 

    // 💀 敗北ルート（主人公のHPが0になったとき）
    else {
        if (resIcon) resIcon.innerText = "💀";
        if (rTitle) { rTitle.innerText = "DEFEATED"; rTitle.style.color = '#f43f5e'; }
        if (rText) {
            rText.innerText = `目の前が真っ暗になった……だが魂の記憶は限界突破して受け継がれる！(前回の遺志を引き継いだ現在Lv: ${window.pSavedLevel})`;
        }
        if (rBtn) {
            rBtn.innerText = "能力を引き継いで再挑戦";
            rBtn.onclick = function() { 
                window.pHp = window.pMaxHp; 
                window.pMp = window.pMaxMp; 
                window.curIdx = -1; // 進捗を最初に戻してリトライ
                window.nextStage(); 
            };
        }
    }
    
    // 🛡️ 🏆 【描画衝突バグガードレール】
    window.isBusy = false; 
    window.battleStepState = 'NONE'; 
    if (window.curIdx >= 0 && window.curIdx < window.STAGES.length) {
        window.updateStatusBadgesUI();
    }
};


// 🔮 リセットゲーム
window.resetGame = function() {
    window.isBusy = false; window.battleStepState = 'NONE';
    
    window.pLevel = window.pSavedLevel; window.pMaxHp = window.pSavedMaxHp; window.pMaxMp = window.pSavedMaxMp;
    window.pHp = window.pMaxHp; window.pMp = window.pMaxMp; window.playerSpells = [...window.pSavedSpells]; window.curIdx = -1;
    
    Object.keys(window.itemInventory).forEach(k => window.itemInventory[k] = 9);
    window.isAmuletActive = 0;
    window.enemyBurnTurns = 0; window.enemyfreezeTurns = 0; window.enemySleepTurns = 0; window.enemyParalyzeTurns = 0; window.enemyBlindTurns = 0; window.enemywhiteTurns = 0; window.enemyPoisonTurns = 0;

    const cleanContainer = document.getElementById('e-sprite-container');
    if (cleanContainer) { 
        cleanContainer.style.background = "none"; cleanContainer.style.removeProperty("filter");
        cleanContainer.style.opacity = "1"; cleanContainer.style.transform = "scale(1)"; cleanContainer.style.removeProperty("animation-play-state");
        cleanContainer.style.animation = "floatE 2.2s infinite alternate ease-in-out";
    }

    const effScr = document.getElementById('eff-scr'); if (effScr) { effScr.className = ""; effScr.style.pointerEvents = "none"; effScr.innerHTML = ""; }

    if (window._logResetTimeout) { clearTimeout(window._logResetTimeout); window._logResetTimeout = null; }
    if (window._freezeAnimationTimeout) { clearTimeout(window._freezeAnimationTimeout); window._freezeAnimationTimeout = null; }
    const battleLog = document.getElementById('battle-log'); if (battleLog) battleLog.innerHTML = "コマンドを選択せよ。";

    stopBGM(); if (typeof stopSlimeAnimation === 'function') stopSlimeAnimation(); window.updateStatusBadgesUI();
};
// ==========================================
// 【１７】ステータス画面
// ==========================================


window.showModernStatusCardA = function() {
    const resBox = document.getElementById('inter-result-box');
    if (!resBox) return;

    // 基礎データの安全な取得
    const curLevel = window.pLevel || 1;
    const styleName = window.pStyleName || "ウィザード";
    const coreStats = window.pSavedStats || { str: 8, dex: 12, con: 12, int: 18, wis: 14, cha: 10 };
    
    // 計算ロジック
    const maxHp = coreStats.con * 6;
    const maxMp = coreStats.int * 3 + coreStats.wis;
    const currentHp = window.pHp !== undefined ? window.pHp : maxHp;
    const currentMp = window.pMp !== undefined ? window.pMp : maxMp;

    // 割合計算
    const hpPercent = Math.min(100, Math.max(0, (currentHp / maxHp) * 100));
    const mpPercent = Math.min(100, Math.max(0, (currentMp / maxMp) * 100));

    // 構文エラーを絶対に起こさない、完全に閉じられたHTML構造
    resBox.innerHTML = `
        <div style="font-family: monospace; color: #cbd5e1; padding: 4px; display: flex; flex-direction: column; gap: 12px; height: 100%; overflow-y: auto;">
            
            <div style="background: rgba(15, 23, 42, 0.75); border: 2px solid #7c3aed; border-radius: 12px; padding: 12px; box-shadow: 0 0 12px rgba(124, 58, 237, 0.3);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <span style="font-weight: bold; color: #a855f7; font-size: 1.1em;">👤 PLAYER [ LV. ${curLevel} ]</span>
                    <span style="background: #7c3aed; color: #fff; padding: 2px 8px; border-radius: 6px; font-size: 0.85em;">${styleName}</span>
                </div>
                <div style="margin-bottom: 6px;">
                    <div style="display: flex; justify-content: space-between; font-size: 0.85em; margin-bottom: 2px;">
                        <span style="color: #f43f5e;">💖 HP</span>
                        <span>${currentHp} / ${maxHp}</span>
                    </div>
                    <div style="background: #1e293b; border-radius: 999px; height: 10px; overflow: hidden; border: 1px solid #334155;">
                        <div style="background: linear-gradient(90deg, #f43f5e, #fda4af); width: ${hpPercent}%; height: 100%;"></div>
                    </div>
                </div>
                <div>
                    <div style="display: flex; justify-content: space-between; font-size: 0.85em; margin-bottom: 2px;">
                        <span style="color: #3b82f6;">🔷 MP</span>
                        <span>${currentMp} / ${maxMp}</span>
                    </div>
                    <div style="background: #1e293b; border-radius: 999px; height: 10px; overflow: hidden; border: 1px solid #334155;">
                        <div style="background: linear-gradient(90deg, #3b82f6, #93c5fd); width: ${mpPercent}%; height: 100%;"></div>
                    </div>
                </div>
            </div>

            <div style="background: rgba(15, 23, 42, 0.75); border: 1px solid #334155; border-radius: 12px; padding: 12px;">
                <div style="font-weight: bold; color: #eab308; margin-bottom: 8px; font-size: 0.95em; border-bottom: 1px dashed #334155; padding-bottom: 4px;">📊 CORE STATS (基礎能力値)</div>
                <div style="display: flex; flex-direction: column; gap: 6px; font-size: 0.85em;">
                    <div style="display: flex; justify-content: space-between;">
                        <span style="color: #ef4444;">⚔️ STR (筋力): <b>${coreStats.str}</b></span>
                        <span style="color: #3b82f6;">🔮 INT (知力): <b>${coreStats.int}</b></span>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span style="color: #10b981;">🎯 DEX (敏捷): <b>${coreStats.dex}</b></span>
                        <span style="color: #6366f1;">📜 WIS (判断): <b>${coreStats.wis}</b></span>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span style="color: #f97316;">🛡️ CON (耐久): <b>${coreStats.con}</b></span>
                        <span style="color: #a855f7;">👑 CHA (魅力): <b>${coreStats.cha}</b></span>
                    </div>
                </div>
            </div>

            <div style="background: rgba(15, 23, 42, 0.75); border: 1px solid #334155; border-radius: 12px; padding: 12px;">
                <div style="font-weight: bold; color: #10b981; margin-bottom: 6px; font-size: 0.95em; border-bottom: 1px dashed #334155; padding-bottom: 4px;">🎒 CURRENT EQUIP (装備品)</div>
                <div style="display: flex; flex-direction: column; gap: 4px; font-size: 0.8em; color: #94a3b8;">
                    <div>⚔️ <span style="color:#fff; font-weight:bold;">武器: ブロンズロッド</span> <span style="color:#06b6d4;">[MATK+10 INT+1]</span></div>
                    <div>🛡️ <span style="color:#fff; font-weight:bold;">防具: 魔術師のローブ</span> <span style="color:#10b981;">[DEF+4 WIS+1]</span></div>
                    <div>💍 <span style="color:#fff; font-weight:bold;">装飾: 水晶の指輪</span> <span style="color:#eab308;">[INT+2 消費-5%]</span></div>
                </div>
            </div>

            <div style="background: rgba(15, 23, 42, 0.75); border: 1px solid #334155; border-radius: 12px; padding: 12px;">
                <div style="font-weight: bold; color: #06b6d4; margin-bottom: 6px; font-size: 0.95em; border-bottom: 1px dashed #334155; padding-bottom: 4px;">📜 MY SPELLS (永久記憶呪文)</div>
                <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                    <span style="background: #1e1b4b; border: 1px solid #3b82f6; color: #93c5fd; padding: 2px 6px; border-radius: 4px; font-size: 0.8em;">✨ ファイア</span>
                    <span style="background: #1e1b4b; border: 1px solid #3b82f6; color: #93c5fd; padding: 2px 6px; border-radius: 4px; font-size: 0.8em;">❄️ アイス</span>
                    <span style="background: #1e1b4b; border: 1px solid #3b82f6; color: #93c5fd; padding: 2px 6px; border-radius: 4px; font-size: 0.8em;">⚡ サンダー</span>
                </div>
            </div>

        </div>
    `;
};