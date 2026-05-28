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
// 🔮 1. 属性・系統IDマスター定義（最新画像ベース）
// ==========================================
const ATTR = {
    FIRE:    "fire",    // 🔥 火炎系
    ICE:     "ice",     // ❄️ 氷雪系
    HOLY:    "holy",    // ✨ 聖力系
    AERO:    "aero",    // 🌪️ 風系
    ELE:     "ele",     // ⚡ 雷系
    WATER:   "water",   // 🌊 水系
    EARTH:   "earth",   // 🪨 大地系
    MAGIC:   "magic",   // 🔮 魔力系
    MIND:    "mind",    // 🧠 精神系
    DARK:    "dark",    // 💀 暗黒系
    LIGHT:   "light",   // ☀️ 光系
    POISON:  "poison",  // 🧪 猛毒系
    TIME:    "time",    // ⏳ 時空系
    STAR:    "star",    // ☄️ 星系
    GRAVITY: "gravity"  // 🧬 重力系
};

// ==========================================
// 📜 2. 全24呪文（魔法）マスター仕様定義
// ==========================================
const SPELLS = {
    fire: { id: 1,  name: "ファイア",     attr: ATTR.FIRE },
    ice:  { id: 2,  name: "アイス",       attr: ATTR.ICE },
    holy: { id: 3,  name: "ホーリー",     attr: ATTR.HOLY },
    wasp: { id: 4,  name: "ワスプ",       attr: ATTR.MAGIC }, // ※画像シートの分類に同期
    scre: { id: 5,  name: "スクリーム",   attr: ATTR.MIND },
    refl: { id: 6,  name: "リフレク",     attr: ATTR.MAGIC },
    wisp: { id: 7,  name: "ウィスプ",     attr: ATTR.HOLY },
    mmis: { id: 8,  name: "Ｍミサイル",   attr: ATTR.MAGIC },
    scis: { id: 9,  name: "シザース",     attr: ATTR.MAGIC },
    flas: { id: 10, name: "フラッシュ",   attr: ATTR.LIGHT },
    drai: { id: 11, name: "ドレイン",     attr: ATTR.DARK },
    slow: { id: 12, name: "スロウ",       attr: ATTR.TIME },
    flod: { id: 13, name: "フラッド",     attr: ATTR.WATER },
    bio:  { id: 14, name: "バイオ",       attr: ATTR.POISON },
    quak: { id: 15, name: "クエイク",     attr: ATTR.EARTH },
    slee: { id: 16, name: "スリープ",     attr: ATTR.MIND },
    dead: { id: 17, name: "デス",         attr: ATTR.DARK },
    mete: { id: 18, name: "メテオ",       attr: ATTR.FIRE },
    aero: { id: 19, name: "エアロ",       attr: ATTR.AERO },
    come: { id: 20, name: "コメット",     attr: ATTR.STAR },
    grav: { id: 21, name: "グラビデ",     attr: ATTR.GRAVITY },
    anal: { id: 22, name: "アナライズ",   attr: ATTR.MAGIC },
    ulti: { id: 23, name: "アルテマ",     attr: ATTR.MAGIC },
    ele:  { id: 24, name: "ライトニング", attr: ATTR.ELE }   // ⚡24番目の新呪文
};

// ==========================================
// 📊 全10階層の敵ステータス・設定データ定義
// ==========================================
// ※全魔物の弱点・耐性をマスター属性定義（ATTR）へ完全有線ドッキング
const STAGES = [
  { 
    floor: 1,  
    name: "ヘドロスライム",   
    hp: 65,  
    atk: 10, 
    weak: [ATTR.FIRE], 
    resist: [ ATTR.ICE, ATTR.MIND], // 打撃・氷雪・精神を画像通りマッピング
    type: "slime",   
    glow: "rgba(34,197,94,0.4)",  
    txt: "1階【粘液族】通路を塞ぐ粘液質の魔物。火炎が有効だが、打撃・氷雪・精神魔法は一切効かない！" 
  },
  { 
    floor: 2,  
    name: "ブラッドスパイダー",   
    hp: 80,  
    atk: 13, 
    weak: [], 
    resist: [], 
    type: "spider",  
    glow: "rgba(239,68,68,0.4)",  
    txt: "2階【虫族】無数の足が蠢く巨大蜘蛛。弱点も耐性もないが、蜘蛛の糸（1ターン麻痺）に警戒せよ！" 
  },
  { 
    floor: 3,  
    name: "スケルトンナイト",     
    hp: 100, 
    atk: 16, 
    weak: [ATTR.FIRE, ATTR.HOLY], 
    resist: [ATTR.MIND, ATTR.DARK], // 精神・即死（暗黒）を完全遮断
    type: "skelton", 
    glow: "rgba(203,213,225,0.5)", 
    txt: "3階【アンデッド族】強固な骸骨騎士。火炎と聖力が大弱点！ただし精神魔法や即死鎌は完全に遮断される。" 
  },
  { 
    floor: 4,  
    name: "ハーピィ",              
    hp: 125, 
    atk: 19, 
    weak: [ATTR.AERO, ATTR.ELE], // 風・雷が2.2倍弱点
    resist: [ATTR.EARTH],        // 飛行中のため大地無効
    type: "harpy",   
    glow: "rgba(236,72,153,0.4)",  
    txt: "4階【獣族/飛行族】大気を操る怪鳥。風と雷に脆いが、飛行しているため大地振動（クエイク）は無効！" 
  },
  { 
    floor: 5,  
    name: "ゴーレム",              
    hp: 155, 
    atk: 22, 
    weak: [ATTR.ICE, ATTR.MIND, ATTR.WATER], // 氷雪・精神（スリープ）・水弱点
    resist: [ATTR.FIRE, ATTR.MAGIC],         // 火炎・魔力（麻痺等）をシャットアウト
    type: "golem",   
    glow: "rgba(245,158,11,0.5)",  
    txt: "5階【人形族】岩石巨兵。氷雪・水に非常に弱くスリープも通るが、火炎と精神デバフ（追加麻痺等）は無効！" 
  },
  { 
    floor: 6,  
    name: "ガーゴイル",            
    hp: 190, 
    atk: 26, 
    weak: [ATTR.AERO, ATTR.ELE], // 風・雷弱点
    resist: [ATTR.MIND, ATTR.EARTH], // 精神無効・飛行のため大地無効
    type: "gargoil", 
    glow: "rgba(100,116,139,0.5)", 
    txt: "6階【魔族/飛行族】守護霊獣。風と雷が直撃するが、精神魔法は効かず、滞空しているため大地属性も通らない。" 
  },
  { 
    floor: 7,  
    name: "マイコニド",            
    hp: 230, 
    atk: 30, 
    weak: [ATTR.FIRE], 
    resist: [], 
    type: "mush",    
    glow: "rgba(168,85,247,0.4)",  
    txt: "7階【植物族】歩行キノコ。火炎が焼き尽くす大弱点！胞子による腐食に注意せよ！" 
  },
  { 
    floor: 8,  
    name: "ファントム",            
    hp: 280, 
    atk: 35, 
    weak: [ATTR.FIRE, ATTR.HOLY], 
    resist: [ATTR.MIND, ATTR.DARK], 
    type: "phantom", 
    glow: "rgba(125,211,252,0.4)", 
    txt: "8階【アンデッド族】彷徨う狂気の亡霊。火炎と聖力で霧散するが、精神を揺さぶる催眠や即死は絶対無効。" 
  },
  { 
    floor: 9,  
    name: "イビルアイ",            
    hp: 360, 
    atk: 42, 
    weak: [ATTR.HOLY], 
    resist: [ATTR.ICE, ATTR.MIND], // 氷雪・精神無効
    type: "eyes",    
    glow: "rgba(219,39,119,0.5)",  
    txt: "9階【悪魔族】巨大魔眼。極大の聖力が弱点！しかし冷気による凍結や精神催眠は一切受け付けない。" 
  },
  { 
    floor: 10, 
    name: "カリスドラゴン",        
    hp: 550, 
    atk: 52, 
    weak: [], 
    resist: [ATTR.FIRE], // 火炎無効の絶望竜
    type: "dragon",  
    glow: "rgba(15,23,42,1)",      
    txt: "10階【竜族】最上階に君臨する最終暗黒竜。なんと弱点属性なし！さらに火炎魔法を完全に無効化する絶望の盾を持つ。" 
  }
];
