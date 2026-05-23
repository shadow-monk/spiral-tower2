// ==========================================
// 👾 js/enemies.js（完全独立型・データ＆制御統合決定版）
// ==========================================
console.log("enemies.js: 他ファイルに依存しない独立型アセットデータのロードを開始します。");

// 📂 1. 新倉庫アセットデータベース（getAssetPathを使用せず、純粋な文字列としてURLを直接生成）
// これにより、ファイルの読み込み順序に左右されず、src属性が空っぽになる現象を100%回避します。
const ANIMS_SLIME    = Array.from({length: 16}, (_, i) => `assets/enemies/slime/monster_slime_${String(i + 1).padStart(2, '0')}.png`);
const ANIMS_SPIDER   = Array.from({length: 8},  (_, i) => `assets/enemies/spider/monster_spider_${String(i + 1).padStart(2, '0')}.png`);
const ANIMS_SKELTON  = Array.from({length: 10}, (_, i) => `assets/enemies/skeleton/monster_skeleton_${String(i + 1).padStart(2, '0')}.png`);
const ANIMS_HARPY    = Array.from({length: 8},  (_, i) => `assets/enemies/harpy/monster_harpy_${String(i + 1).padStart(2, '0')}.png`);
const ANIMS_GOLEM    = Array.from({length: 11}, (_, i) => `assets/enemies/golem/monster_golem_${String(i + 1).padStart(2, '0')}.png`);
const ANIMS_EYES     = Array.from({length: 13}, (_, i) => `assets/enemies/eyes/monster_eyes_${String(i + 1).padStart(2, '0')}.png`);
const ANIMS_PHANTOM  = Array.from({length: 11}, (_, i) => `assets/enemies/phantom/monster_phantom_${String(i + 1).padStart(2, '0')}.png`);
const ANIMS_DRAGON   = Array.from({length: 8},  (_, i) => `assets/enemies/dragon/monster_dragon_${String(i + 1).padStart(2, '0')}.png`);
const ANIMS_MAICONID = Array.from({length: 10}, (_, i) => `assets/enemies/maiconid/monster_maiconid_${String(i + 1).padStart(2, '0')}.png`);
const ANIMS_GARGOIL  = Array.from({length: 10}, (_, i) => `assets/enemies/gargoyle/monster_gargoyle_${String(i + 1).padStart(2, '0')}.png`);

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
        
        // 🛠️ キャッシュ対策：画像URLの末尾に常にバージョンスタンプを付与し、ブラウザの読み込みサボりを強制打破
        graphicEl.src = `${dynamicArr[currentFrameIdx]}?v=6.55`;
        
        // モンスターの重量感・世界観に合わせた最適なスピード（FPS）設定
        let fps = (cType === 'slime') ? 130 : (cType === 'phantom' ? 160 : (cType === 'dragon' ? 120 : 140));
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

console.log("enemies.js: 独立型アセットデータ＆アニメーション制御の完全統合版が正常に起動しました。");
