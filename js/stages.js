// ==========================================
// 🧱 リポジトリベースパス（製品配布・ストリーミング専用）
// ==========================================
const BASE_ASSETS = {
    repo1: "https://raw.githubusercontent.com/shadow-monk/game1/main/assets/",
    repo2Pages: "https://shadow-monk.github.io/spiral-tower2/assets/"
};

/**
 * 各種アセット（画像・音声）の正しいURLを返却する関数
 */
function getAssetPath(category, filename) {
    try {
        if (category === 'hero') return `${BASE_ASSETS.repo1}hero/${filename}`;
        if (category === 'se_clean') return `${BASE_ASSETS.repo2Pages}se/${filename}`; 
        if (category === 'bgm_clean') return `${BASE_ASSETS.repo2Pages}bgm/${filename}`; 
        if (category === 'enemy_legacy') return `${BASE_ASSETS.repo1}${filename}`;
        
        // 倉庫2（GitHub Pages）の正しいディレクトリ構造へのマッピング
        if (category === 'enemy_slime_new') return `${BASE_ASSETS.repo2Pages}enemies/slime/${filename}`;
        if (category === 'enemy_phantom_new') return `${BASE_ASSETS.repo2Pages}enemies/phantom/${filename}`;
        if (category === 'enemy_new') return `${BASE_ASSETS.repo2Pages}enemies/${filename}`;
        
        if (category === 'effect') return `${BASE_ASSETS.repo1}effect/${filename}`;
        return "";
    } catch(e) {
        console.error("Path Resolution Error:", e);
        return "";
    }
}

// ==========================================
// 📊 全10階層の敵ステータス・設定データ定義
// ==========================================
const STAGES = [
  { floor: 1,  name: "ヘドロスライム",       hp: 65,  atk: 10, weak: "fire", type: "slime",   glow: "rgba(34,197,94,0.4)",  txt: "1階。通路を塞ぐ粘液質の魔物。熱変化に弱く【ファイア】が有効！" },
  { floor: 2,  name: "ブラッドスパイダー",   hp: 80,  atk: 13, weak: "fire", type: "spider",  glow: "rgba(239,68,68,0.4)",  txt: "2階。無数の足が蠢く巨大蜘蛛。蜘蛛の糸（1ターン麻痺）に警戒せよ！" },
  { floor: 3,  name: "スケルトンナイト",     hp: 100, atk: 16, weak: "holy", type: "skelton", glow: "rgba(203,213,225,0.5)", txt: "3階。古の戦意を宿した強固な骸骨騎士。シールドに注意せよ！" },
  { floor: 4,  name: "ハーピィ",             hp: 125, atk: 19, weak: "ice",  type: "harpy",   glow: "rgba(236,72,153,0.4)",  txt: "4階。大気を操り鋭く羽ばたく怪鳥。【アイス】で完全氷結させろ！" },
  { floor: 5,  name: "ゴーレム",             hp: 155, atk: 22, weak: "fire", type: "golem",   glow: "rgba(245,158,11,0.5)",  txt: "5階。地響きを伴って駆動する岩石巨兵。強烈な岩石投げをいなせ！" },
  { floor: 6,  name: "ガーゴイル",           hp: 190, atk: 26, weak: "ice",  type: "gargoil", glow: "rgba(100,116,139,0.5)", txt: "6階。石像から解き放たれし守護霊獣。魔法陣チャージに警戒！" },
  { floor: 7,  name: "マイコニド",           hp: 230, atk: 30, weak: "fire", type: "mush",    glow: "rgba(168,85,247,0.4)",  txt: "7階。歩行キノコ。胞子による腐食に注意せよ！" },
  { floor: 8,  name: "ファントム",           hp: 280, atk: 35, weak: "holy", type: "phantom", glow: "rgba(125,211,252,0.4)", txt: "8階。霧のように形を変えて浮遊する亡霊。周囲のガスを突破せよ！" },
  { floor: 9,  name: "イビルアイ",           hp: 360, atk: 42, weak: "holy", type: "eyes",    glow: "rgba(219,39,119,0.5)",  txt: "9階。狂気に満ちた視線を放つ巨大魔眼。死の光をかわせ！" },
  { floor: 10, name: "カリスドラゴン",       hp: 550, atk: 52, weak: "holy", type: "dragon",  glow: "rgba(15,23,42,1)",      txt: "10階。螺旋の頂上に君臨する最終暗黒竜。最大級の【ホーリー】で挑め！" }
];
