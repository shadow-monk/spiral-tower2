// ==========================================
// 🧱 リポジトリベースパス（製品配布・ストリーミング専用）
// ==========================================
const BASE_ASSETS = {
    repo1: "https://raw.githubusercontent.com/shadow-monk/game1/main/assets/",
    repo2Pages: "https://shadow-monk.github.io/spiral-tower2/assets/"
};

function getAssetPath(category, filename) {
    try {
        if (category === 'hero') return `${BASE_ASSETS.repo1}hero/${filename}`;
        if (category === 'se_clean') return `${BASE_ASSETS.repo2Pages}se/${filename}`; 
        if (category === 'bgm_clean') return `${BASE_ASSETS.repo2Pages}bgm/${filename}`; 
        if (category === 'enemy_legacy') return `${BASE_ASSETS.repo1}${filename}`;
        if (category === 'enemy_slime_new') return `${BASE_ASSETS.repo2Pages}enemies/slime/${filename}`;
        if (category === 'enemy_phantom_new') return `${BASE_ASSETS.repo2Pages}enemies/phantom/${filename}`;
        if (category === 'enemy_new') return `${BASE_ASSETS.repo2Pages}enemies/${filename}`;
        if (category === 'effect') return `${BASE_ASSETS.repo1}effect/${filename}`;
        return "";
    } catch(e) { return ""; }
}

const ATTR = {
    FIRE: "fire", ICE: "ice", HOLY: "holy", AERO: "aero", ELE: "ele", 
    WATER: "water", EARTH: "earth", MAGIC: "magic", MIND: "mind", 
    DARK: "dark", LIGHT: "light", POISON: "poison", TIME: "time", 
    STAR: "star", GRAVITY: "gravity"
};

const SPELLS = {
    fire: { id: 1,  name: "ファイア",     attr: ATTR.FIRE },
  wasp2: { id: 2,  name: "フリーズ", attr: ATTR.ICE }, 
    holy: { id: 3,  name: "ホーリー",     attr: ATTR.HOLY },
    wasp: { id: 4,  name: "ワスプ",       attr: ATTR.MAGIC }, 
    scre: { id: 5,  name: "スクリーム",   attr: ATTR.MIND },
    refl: { id: 6,  name: "リフレク",     attr: ATTR.MAGIC },
    wisp: { id: 7,  name: "ウィスプ",     attr: ATTR.HOLY },
    mmis: { id: 8,  name: "マジックミサイル", attr: ATTR.MAGIC },
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
    ele:  { id: 24, name: "ライトニング", attr: ATTR.ELE } , 
    ice:  { id: 25,  name: "アイス",       attr: ATTR.ICE },
    def: { id: 26,  name: "シールド", attr: ATTR.DEF    }, 
};

// 📊 全40階層・Excel仕様書完全同期型モンスターマスターデータ
const STAGES = [
  // 1〜10階（LV1）
  { floor: 1,  name: "ゴブリン",   hp: 70,  atk: 5,  lv: 1, weak: [], resist: [], type: "goblin", txt: "1階【妖精族】野蛮で乱暴な戦闘民族。こん棒や斧をもって暴れまわる！" },
  { floor: 2,  name: "ブラッドスパイダー", hp: 80,  atk: 13,  lv: 1, weak: [], resist: [], type: "spider", txt: "2階【虫族】無数の足が蠢く巨大蜘蛛。蜘蛛の糸（1ターン麻痺）に警戒せよ！" },
  { floor: 3,  name: "スケルトンナイト",   hp: 100, atk: 16,  lv: 1, weak: [ATTR.FIRE, ATTR.HOLY], resist: [ATTR.MIND, ATTR.DARK], type: "skeleton", txt: "3階【アンデッド族】強固な骸骨騎士。火炎と聖力が大弱点！" },
  { floor: 4,  name: "ハーピィ",            hp: 125, atk: 19,  lv: 1, weak: [ATTR.AERO, ATTR.ELE], resist: [ATTR.EARTH], type: "harpy", txt: "4階【飛行族】大気を操る怪鳥。風と雷に脆いが、飛行しているため大地振動は無効！" },
  { floor: 5,  name: "ヘドロスライム",   hp: 165,  atk: 20,  lv: 1, weak: [ATTR.FIRE], resist: [ATTR.ICE, ATTR.MIND], type: "slime", txt: "5階【粘液族】通路を塞ぐ粘液質の魔物。火炎が有効だが、打撃・氷雪・精神魔法は一切効かない！" },
  { floor: 6,  name: "ロックゴーレム",      hp: 155, atk: 22,  lv: 1, weak: [ATTR.ICE, ATTR.WATER], resist: [ATTR.FIRE, ATTR.MIND], type: "golem", txt: "6階【人形族】岩石巨兵。氷雪・水に非常に弱い。" },
  { floor: 7,  name: "ガーゴイル",          hp: 190, atk: 26,  lv: 1, weak: [ATTR.AERO, ATTR.ELE], resist: [ATTR.MIND, ATTR.EARTH], type: "gargoyle", txt: "7階【魔族】守護霊獣。風と雷が直撃するが、精神魔法は効かない。" },
  { floor: 8,  name: "マイコニド",          hp: 230, atk: 26,  lv: 1, weak: [ATTR.FIRE], resist: [], type: "maiconid", txt: "8 階【植物族】歩行キノコ。火炎が焼き尽くす大弱点！" },
　{ floor: 9,  name: "イビルアイ",          hp: 120, atk: 30,  lv: 1, weak: [ATTR.AERO,ATTR.HOLY], resist: [ATTR.FIRE, ATTR.ICE,ATTR.MIND, ATTR.DARK, ATTR.EARTH], type: "eyes", txt: "9階【悪魔族】巨大魔眼。極大の聖力が弱点！冷気による凍結や精神催眠は受け付けない。" },
  { floor: 10, name: "カリスドラゴン",      hp: 350, atk: 32,  lv: 1, weak: [], resist: [ATTR.FIRE], type: "dragon", txt: "10階【竜族】最上階の最終暗黒竜。弱点属性なし、さらに火炎魔法を完全無効化する。" },
  
  // ⚔️ 11〜14階（新モンスター：画像フォルダ・タイプ完全一致仕様）
  { floor: 11, name: "リビングブレード",    hp: 620, atk: 58,  lv: 1, weak: [ATTR.ELE], resist: [ATTR.MIND, ATTR.DARK, ATTR.POISON], type: "livingsword", txt: "11階【武器族】自律行動する大剣。電撃のみが弱点であり、精神・即死・猛毒を完全遮断。" },
  { floor: 12, name: "ウェアウルフ",        hp: 680, atk: 64,  lv: 1, weak: [], resist: [], type: "warewolf", txt: "12階【獣人族】圧倒的な身体能力を持つ。弱点も耐性もないが、月夜の咆哮による超火力特攻に警戒。" },
  { floor: 13, name: "グリモワール",        hp: 740, atk: 70,  lv: 1, weak: [ATTR.FIRE], resist: [ATTR.MIND, ATTR.DARK, ATTR.POISON], type: "book", txt: "13階【書籍族】禁忌の魔導書。火炎に極めて脆いが、プレイヤーに死の宣告を紡ぐ。" },
  { floor: 14, name: "ファントム",          hp: 280, atk: 35,  lv: 1, weak: [ATTR.FIRE, ATTR.HOLY], resist: [ATTR.MIND, ATTR.DARK], type: "phantom", txt: "14階【アンデッド族】彷徨う亡霊。精神を揺さぶる催眠や即死は絶対無効。" },

  // 🎨 14〜20階：新Excel仕様書【前編】準拠（LV2〜3 変異強化ルート）
  { floor: 15, name: "オーカーゼリー",      hp: 840, atk: 78,  lv: 2, weak: [ATTR.ICE], resist: [ATTR.EARTH, ATTR.ELE, ATTR.MIND], type: "slime", txt: "14階【粘液族・LV2】不気味な黄土色に変異した強酸ゲル。氷雪のみを弱点とし、雷や精神を中和する。" },
  { floor: 16, name: "タロンバットム",      hp: 920, atk: 84,  lv: 2, weak: [ATTR.AERO, ATTR.ELE], resist: [ATTR.MIND, ATTR.EARTH, ATTR.DARK], type: "gargoyle", txt: "15階【魔族・LV2】腐食した青銅緑の翼を持つガルゴイル変異体。風と雷が弱点、大地の衝撃や即死を完全無効化。" },
  { floor: 17, name: "マッシュノイド",      hp: 1020, atk: 90,  lv: 2, weak: [ATTR.FIRE], resist: [ATTR.POISON], type: "maiconid", txt: "16階【植物族・LV2】胞子毒がより凶悪に変異した歩行菌類。火炎で一気に焼き尽くせ。" },
   { floor: 18, name: "ブラックウィドウ",    hp: 1250, atk: 106, lv: 2, weak: [], resist: [], type: "spider", txt: "18階【虫族・LV2】漆黒の甲殻を持つ巨大蜘蛛。強烈な麻痺の毒針を隠し持っている。" },
  { floor: 19, name: "ブロブ",              hp: 1400, atk: 115, lv: 3, weak: [], resist: [ATTR.EARTH, ATTR.ICE, ATTR.MIND, ATTR.FIRE], type: "slime", txt: "19階【粘液族・LV3】あらゆる魔法分子を体内で分解する超巨大アメーバ。なんと弱点属性なし！" },
  { floor: 20, name: "サイコパピル",        hp: 1650, atk: 125, lv: 2, weak: [ATTR.HOLY], resist: [ATTR.ICE, ATTR.MIND], type: "eyes", txt: "20階【悪魔族・LV2】精神崩壊を誘発する魔眼種。極大の聖光ホーリーのみがその防壁を抉じ開ける。" },

  // 🐉 21〜40階：新Excel仕様書【後編】準拠（LV2〜4 深層最凶ルート）
  { floor: 21, name: "ワーハウンド",        hp: 1800, atk: 132, lv: 2, weak: [], resist: [], type: "warewolf", txt: "21階【獣人族・LV2】ウェアウルフの狂暴化亜種。牙による3段蹴り物理連撃を繰り出してくる。" },
  { floor: 22, name: "ブラッディボーン",    hp: 1950, atk: 140, lv: 2, weak: [ATTR.FIRE, ATTR.HOLY], resist: [ATTR.MIND, ATTR.DARK], type: "skeleton", txt: "22階【アンデッド・LV2】血の魔力で再構成された骨騎士。恐るべき「毒血カウンター」を構える。" },
  { floor: 23, name: "バードレディ",        hp: 2100, atk: 148, lv: 2, weak: [ATTR.AERO, ATTR.ELE], resist: [ATTR.EARTH], type: "harpy", txt: "23階【飛行族・LV2】妖艶な漆黒とマゼンタを纏う鳥人。真空のかまいたちでプレイヤーを切り裂く。" },
  { floor: 24, name: "ストーンゴーレム",    hp: 2350, atk: 158, lv: 2, weak: [ATTR.ICE, ATTR.WATER], resist: [ATTR.POISON, ATTR.ELE, ATTR.MIND, ATTR.EARTH, ATTR.DARK], type: "golem", txt: "24階【人形族・LV2】高密度の魔結晶岩で造られた巨像。激しい大地震でチャージを粉砕する。" },
  { floor: 25, name: "ネクロブック",        hp: 2550, atk: 166, lv: 2, weak: [ATTR.FIRE], resist: [ATTR.MIND, ATTR.DARK, ATTR.POISON], type: "book", txt: "25階【書籍族・LV2】死霊術が綴られた黒魔導書。4ターン後にプレイヤーを強制死亡させる挿絵の男を詠唱。" },
  { floor: 26, name: "アイスファング",      hp: 2800, atk: 174, lv: 3, weak: [ATTR.FIRE], resist: [ATTR.ICE], type: "warewolf", txt: "26階【獣人族・LV3】絶対零度の凍気をまとう魔狼。コールドクローを喰らうと次回行動不能に！" },
  { floor: 27, name: "スパイドラ",          hp: 3000, atk: 182, lv: 3, weak: [], resist: [], type: "spider", txt: "27階【虫族・LV3】最深層の巣に潜む超巨大蜘蛛。強靭な「捕獲糸」でこちらの身動きを完全に止める。" },
  { floor: 28, name: "スライサー",          hp: 3250, atk: 192, lv: 2, weak: [ATTR.ELE], resist: [ATTR.MIND, ATTR.DARK, ATTR.POISON], type: "livingsword", txt: "28階【武器族・LV2】空間を切り刻む呪いの超大剣。即死級の威力を誇る「断頭台の一撃」を放つ。" },
  { floor: 29, name: "スカルソード",        hp: 3500, atk: 202, lv: 3, weak: [ATTR.FIRE, ATTR.HOLY], resist: [ATTR.MIND, ATTR.DARK], type: "skeleton", txt: "29階【アンデッド・LV3】無数の怨念が集結した巨大骨魔人。強力なカウンターシールドを展開。" },
  { floor: 30, name: "フレイムドラゴン",    hp: 4200, atk: 220, lv: 2, weak: [], resist: [ATTR.FIRE], type: "dragon", txt: "30階【深層中ボス・LV2】塔の中層を守護する灼熱の巨竜。全てを灰にする高火力の「フレイムブレス」を放つ。" },
  { floor: 31, name: "ハンターホーク",      hp: 4450, atk: 230, lv: 3, weak: [ATTR.AERO, ATTR.ELE], resist: [ATTR.EARTH], type: "harpy", txt: "31階【飛行族・LV3】必中の狙撃能力を持つ変異鳥獣。回避不能の「狙撃弓」を放ってくる。" },
  { floor: 32, name: "オブシニアン",        hp: 4700, atk: 242, lv: 3, weak: [], resist: [ATTR.POISON, ATTR.ELE, ATTR.MIND, ATTR.EARTH, ATTR.DARK], type: "golem", txt: "32階【人形族・LV3】黒曜石で構成された超重量ゴーレム。プレイヤーの全身を完全に結晶化させにくる。" },
  { floor: 33, name: "プレシオライト",      hp: 5000, atk: 254, lv: 3, weak: [ATTR.AERO, ATTR.ELE], resist: [ATTR.MIND, ATTR.EARTH, ATTR.DARK], type: "gargoyle", txt: "33階【魔族・LV3】結晶化した翼を持つ最深層ガルゴイル。「ニードルマシンガン」でハチの巣にする。" },
  { floor: 34, name: "タブーノート",        hp: 5300, atk: 266, lv: 3, weak: [ATTR.FIRE], resist: [ATTR.MIND, ATTR.DARK, ATTR.POISON], type: "book", txt: "34階【書籍族・LV3】神に禁じられた黙示録。強力な「ブックマーク」でこちらの全戦術を封印する。" },
  { floor: 35, name: "スポアロード",        hp: 5600, atk: 278, lv: 3, weak: [ATTR.FIRE], resist: [ATTR.POISON], type: "maiconid", txt: "35階【植物族・LV3】キノコ族の最高君主。吸い込むと魔法威力を激減させる「蛆虫の宴」を拡散。" },
  { floor: 36, name: "ゴーストヘッド",      hp: 5900, atk: 290, lv: 3, weak: [ATTR.FIRE, ATTR.HOLY], resist: [ATTR.MIND, ATTR.DARK, ATTR.POISON], type: "phantom", txt: "36階【亡霊族・LV3】宙を彷徨う巨大な怨霊の生首。狂気の発狂ガスを噴射し、道具カバンをロックする。" },
  { floor: 37, name: "オクトアイズ",        hp: 6300, atk: 305, lv: 3, weak: [ATTR.HOLY], resist: [ATTR.ICE,ATTR.MIND], type: "eyes", txt: "37階【悪魔族・LV3】八つの邪眼を持つ異形。全ての魔力を遮断する「オクトレーザー」を照射。" },
  { floor: 38, name: "ダンシングブレイド",  hp: 6800, atk: 320, lv: 3, weak: [ATTR.ELE], resist: [ATTR.MIND, ATTR.DARK, ATTR.POISON], type: "livingsword", txt: "38階【武器族・LV3】乱舞する無数の魔剣。見るものを幻惑する「処刑の舞」は回避が極めて困難。" },
   { floor: 39, name: "アイアンゴーレム",    hp: 7500, atk: 340, lv: 4, weak: [], resist: [ATTR.POISON, ATTR.ELE, ATTR.MIND, ATTR.EARTH, ATTR.DARK], type: "golem", txt: "39階【人形族・LV4】タワー最上階を守る鉄血の巨神。全ての被ダメージを確定「1ポイント」に軽減する無敵の防御形態を持つ。" },
  { floor: 40, name: "👑 最上階ボス：ブルードラゴン", hp: 9999, atk: 420, lv: 3, weak: [], resist: [ATTR.FIRE, ATTR.ICE,ATTR.wasp2], type: "dragon", txt: "40階【螺旋の塔・最終絶対支配者】天を割る咆哮を上げ、全てを灰にする壊滅的な超高圧「電撃ブレス」を放つ神話の青竜。" },
 { floor: 42, name: "ワイト",              hp: 1150, atk: 98,  lv: 2, weak: [ATTR.FIRE, ATTR.HOLY], resist: [ATTR.MIND, ATTR.DARK, ATTR.POISON], type: "phantom", txt: "17階【亡霊族・LV2】深層の冷気に適応した下級魔霊。火炎と聖力が大弱点。" },
 
];

window.STAGES = STAGES;