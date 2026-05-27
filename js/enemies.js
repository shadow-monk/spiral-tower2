// ==========================================
// 👾 js/enemies.js（アセット整合性確保・ベタ書き超軽量化版）
// ==========================================
console.log("enemies.js: パス整合性を完全に確保したベタ書きデータ版のロードを開始します。");

// 📂 1. 新倉庫アセットデータベース（計算を排除し、URLを完全展開）
// ※ 開発環境とGitHub Pages環境のズレを吸収するため、パスの起点を統一しています。
const ANIMS_SLIME = [
    "assets/enemies/slime/monster_slime_01.png", "assets/enemies/slime/monster_slime_02.png",
    "assets/enemies/slime/monster_slime_03.png", "assets/enemies/slime/monster_slime_04.png",
    "assets/enemies/slime/monster_slime_05.png", "assets/enemies/slime/monster_slime_06.png",
    "assets/enemies/slime/monster_slime_07.png", "assets/enemies/slime/monster_slime_08.png",
    "assets/enemies/slime/monster_slime_09.png", "assets/enemies/slime/monster_slime_10.png",
    "assets/enemies/slime/monster_slime_11.png", "assets/enemies/slime/monster_slime_12.png",
    "assets/enemies/slime/monster_slime_13.png", "assets/enemies/slime/monster_slime_14.png",
    "assets/enemies/slime/monster_slime_15.png", "assets/enemies/slime/monster_slime_16.png"
];

const ANIMS_SPIDER = [
    "assets/enemies/spider/monster_spider_01.png", "assets/enemies/spider/monster_spider_02.png",
    "assets/enemies/spider/monster_spider_03.png", "assets/enemies/spider/monster_spider_04.png",
    "assets/enemies/spider/monster_spider_05.png", "assets/enemies/spider/monster_spider_06.png",
    "assets/enemies/spider/monster_spider_07.png", "assets/enemies/spider/monster_spider_08.png"
];

const ANIMS_SKELTON = [
    "assets/enemies/skeleton/monster_skeleton_01.png", "assets/enemies/skeleton/monster_skeleton_02.png",
    "assets/enemies/skeleton/monster_skeleton_03.png", "assets/enemies/skeleton/monster_skeleton_04.png",
    "assets/enemies/skeleton/monster_skeleton_05.png", "assets/enemies/skeleton/monster_skeleton_06.png",
    "assets/enemies/skeleton/monster_skeleton_07.png", "assets/enemies/skeleton/monster_skeleton_08.png",
    "assets/enemies/skeleton/monster_skeleton_09.png", "assets/enemies/skeleton/monster_skeleton_10.png"
];

const ANIMS_HARPY = [
    "assets/enemies/harpy/monster_harpy_01.png", "assets/enemies/harpy/monster_harpy_02.png",
    "assets/enemies/harpy/monster_harpy_03.png", "assets/enemies/harpy/monster_harpy_04.png",
    "assets/enemies/harpy/monster_harpy_05.png", "assets/enemies/harpy/monster_harpy_06.png",
    "assets/enemies/harpy/monster_harpy_07.png", "assets/enemies/harpy/monster_harpy_08.png"
];

const ANIMS_GOLEM = [
    "assets/enemies/golem/monster_golem_01.png", "assets/enemies/golem/monster_golem_02.png",
    "assets/enemies/golem/monster_golem_03.png", "assets/enemies/golem/monster_golem_04.png",
    "assets/enemies/golem/monster_golem_05.png", "assets/enemies/golem/monster_golem_06.png",
    "assets/enemies/golem/monster_golem_07.png", "assets/enemies/golem/monster_golem_08.png",
    "assets/enemies/golem/monster_golem_09.png", "assets/enemies/golem/monster_golem_10.png",
    "assets/enemies/golem/monster_golem_11.png"
];

const ANIMS_EYES = [
    "assets/enemies/eyes/monster_eyes_01.png", "assets/enemies/eyes/monster_eyes_02.png",
    "assets/enemies/eyes/monster_eyes_03.png", "assets/enemies/eyes/monster_eyes_04.png",
    "assets/enemies/eyes/monster_eyes_05.png", "assets/enemies/eyes/monster_eyes_06.png",
    "assets/enemies/eyes/monster_eyes_07.png", "assets/enemies/eyes/monster_eyes_08.png",
    "assets/enemies/eyes/monster_eyes_09.png", "assets/enemies/eyes/monster_eyes_10.png",
    "assets/enemies/eyes/monster_eyes_11.png", "assets/enemies/eyes/monster_eyes_12.png",
    "assets/enemies/eyes/monster_eyes_13.png"
];

const ANIMS_PHANTOM = [
    "assets/enemies/phantom/monster_phantom_01.png", "assets/enemies/phantom/monster_phantom_02.png",
    "assets/enemies/phantom/monster_phantom_03.png", "assets/enemies/phantom/monster_phantom_04.png",
    "assets/enemies/phantom/monster_phantom_05.png", "assets/enemies/phantom/monster_phantom_06.png",
    "assets/enemies/phantom/monster_phantom_07.png", "assets/enemies/phantom/monster_phantom_08.png",
    "assets/enemies/phantom/monster_phantom_09.png", "assets/enemies/phantom/monster_phantom_10.png",
    "assets/enemies/phantom/monster_phantom_11.png"
];

const ANIMS_DRAGON = [
    "assets/enemies/dragon/monster_dragon_01.png", "assets/enemies/dragon/monster_dragon_02.png",
    "assets/enemies/dragon/monster_dragon_03.png", "assets/enemies/dragon/monster_dragon_04.png",
    "assets/enemies/dragon/monster_dragon_05.png", "assets/enemies/dragon/monster_dragon_06.png",
    "assets/enemies/dragon/monster_dragon_07.png", "assets/enemies/dragon/monster_dragon_08.png"
];

const ANIMS_MAICONID = [
    "assets/enemies/maiconid/monster_maiconid_01.png", "assets/enemies/maiconid/monster_maiconid_02.png",
    "assets/enemies/maiconid/monster_maiconid_03.png", "assets/enemies/maiconid/monster_maiconid_04.png",
    "assets/enemies/maiconid/monster_maiconid_05.png", "assets/enemies/maiconid/monster_maiconid_06.png",
    "assets/enemies/maiconid/monster_maiconid_07.png", "assets/enemies/maiconid/monster_maiconid_08.png",
    "assets/enemies/maiconid/monster_maiconid_09.png", "assets/enemies/maiconid/monster_maiconid_10.png"
];

const ANIMS_GARGOIL = [
    "assets/enemies/gargoyle/monster_gargoyle_01.png", "assets/enemies/gargoyle/monster_gargoyle_02.png",
    "assets/enemies/gargoyle/monster_gargoyle_03.png", "assets/enemies/gargoyle/monster_gargoyle_04.png",
    "assets/enemies/gargoyle/monster_gargoyle_05.png", "assets/enemies/gargoyle/monster_gargoyle_06.png",
    "assets/enemies/gargoyle/monster_gargoyle_07.png", "assets/enemies/gargoyle/monster_gargoyle_08.png",
    "assets/enemies/gargoyle/monster_gargoyle_09.png", "assets/enemies/gargoyle/monster_gargoyle_10.png"
];

// 🔄 2. 全階層のキー名マッピングマスター
const MASTER_ANIM_MAP = { 
    slime: ANIMS_SLIME, spider: ANIMS_SPIDER, skelton: ANIMS_SKELTON, 
    harpy: ANIMS_HARPY, golem: ANIMS_GOLEM, gargoil: ANIMS_GARGOIL, 
    mush: ANIMS_MAICONID, phantom: ANIMS_PHANTOM, eyes: ANIMS_EYES, dragon: ANIMS_DRAGON 
};

// ⚙️ 3. グローバル状態管理変数
let animeTimeout = null; 
let currentFrameIdx = 0;

// 🚀 4. モンスターアニメーション制御マシン
function startCustomAnimation(type) {
    stopSlimeAnimation();
    const graphicEl = document.getElementById("e-sprite-graphic"); 
    if (!graphicEl) return;
    
    function step() {
        if (window.curIdx < 0 || !STAGES[window.curIdx]) return;
        let cType = STAGES[window.curIdx].type;
        let dynamicArr = MASTER_ANIM_MAP[cType] || ANIMS_SLIME;
        
        currentFrameIdx = (currentFrameIdx + 1) % dynamicArr.length;
        
        // 🛠️ パス解決とキャッシュの完全両立
        // getAssetPathが存在する場合はそれを使用し、存在しない場合も相対パスの原点を維持します。
        let basePath = dynamicArr[currentFrameIdx];
        if (typeof window.getAssetPath === 'function') {
            graphicEl.src = window.getAssetPath(basePath);
        } else {
            graphicEl.src = basePath;
        }
        
        // モンスターの重量感に合わせた速度設定（負荷を引き算するため前バージョンより少し間引いています）
        let fps = (cType === 'slime') ? 250 : (cType === 'phantom' ? 300 : (cType === 'dragon' ? 220 : 250));
        animeTimeout = setTimeout(step, fps); 
    }
    step();
}

function stopSlimeAnimation() { 
    if (animeTimeout) { 
        clearTimeout(animeTimeout); 
        animeTimeout = null; 
    } 
}

console.log("enemies.js: パス互換性を確保した独立型アセットデータ＆アニメーション制御統合版が正常に起動しました。");
