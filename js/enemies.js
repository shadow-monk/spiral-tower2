// ==========================================
// 👾 1. モンスターアニメーションデータベース（新倉庫・完全リネーム同期版）
// ==========================================

// 📂 各フォルダ内の実際の枚数に合わせて {length: X} を完全バインド
const ANIMS_SLIME    = Array.from({length: 16}, (_, i) => getAssetPath('assets/enemies', `slime/monster_slime_${String(i + 1).padStart(2, '0')}.png`));
const ANIMS_SPIDER   = Array.from({length: 8},  (_, i) => getAssetPath('assets/enemies', `spider/monster_spider_${String(i + 1).padStart(2, '0')}.png`));
const ANIMS_SKELTON  = Array.from({length: 10}, (_, i) => getAssetPath('assets/enemies', `skeleton/monster_skeleton_${String(i + 1).padStart(2, '0')}.png`));
const ANIMS_HARPY    = Array.from({length: 8},  (_, i) => getAssetPath('assets/enemies', `harpy/monster_harpy_${String(i + 1).padStart(2, '0')}.png`));
const ANIMS_GOLEM    = Array.from({length: 11}, (_, i) => getAssetPath('assets/enemies', `golem/monster_golem_${String(i + 1).padStart(2, '0')}.png`));
const ANIMS_EYES     = Array.from({length: 13}, (_, i) => getAssetPath('assets/enemies', `eyes/monster_eyes_${String(i + 1).padStart(2, '0')}.png`));
const ANIMS_DRAGON   = Array.from({length: 8},  (_, i) => getAssetPath('assets/enemies', `dragon/monster_dragon_${String(i + 1).padStart(2, '0')}.png`));

// ⚠️ 残りの旧倉庫特殊枠（マイコニド、ファントム、ガーゴイル）は現状の旧定義を維持
const ANIMS_PHANTOM  = Array.from({length: 11}, (_, i) => getAssetPath('enemy_phantom_new', `monster_phantom_${String(i + 1).padStart(2, '0')}.png`));
const ANIMS_MAICONID = Array.from({length: 10}, (_, i) => getAssetPath('enemy_new', `maiconid/maiconid_${(i+1)<10?'0'+(i+1):(i+1)}.png`));
const ANIMS_GARGOIL  = Array.from({length: 9},  (_, i) => getAssetPath('enemy_new', `gargoyle/gargoyle_0${i + 1}.png`));

// 全階層のキー名マッピングマスター
const MASTER_ANIM_MAP = { 
    slime: ANIMS_SLIME, spider: ANIMS_SPIDER, skelton: ANIMS_SKELTON, 
    harpy: ANIMS_HARPY, golem: ANIMS_GOLEM, gargoil: ANIMS_GARGOIL, 
    mush: ANIMS_MAICONID, phantom: ANIMS_PHANTOM, eyes: ANIMS_EYES, dragon: ANIMS_DRAGON 
};

// グローバル状態管理変数
let animeTimeout = null; 
let currentFrameIdx = 0;

// ==========================================
// ⚙️ 2. モンスターアニメーション制御マシン
// ==========================================
function startCustomAnimation(type) {
    stopSlimeAnimation();
    const graphicEl = document.getElementById("e-sprite-graphic"); 
    if (!graphicEl) return;
    
    function step() {
        if (window.curIdx < 0 || !STAGES[window.curIdx]) return;
        let cType = STAGES[window.curIdx].type;
        let dynamicArr = MASTER_ANIM_MAP[cType] || ANIMS_SLIME;
        
        currentFrameIdx = (currentFrameIdx + 1) % dynamicArr.length;
        graphicEl.src = dynamicArr[currentFrameIdx];
        
        // モンスターごとの個性を引き出すアニメーション速度(ms)設定
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
