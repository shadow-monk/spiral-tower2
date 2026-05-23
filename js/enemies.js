// ==========================================
// 👾 1. モンスターアニメーションデータベース（安全な自動ループ生成）
// ==========================================
const ANIMS_SLIME = Array.from({length: 16}, (_, i) => getAssetPath('enemy_slime_new', `monster_slime_${String(i + 1).padStart(2, '0')}.${(i===3)?'PNG':'png'}`));
const ANIMS_SPIDER = Array.from({length: 7}, (_, i) => getAssetPath('enemy_legacy', `spider/spider%20(${i + 1}).png`));
const ANIMS_SKELTON = Array.from({length: 9}, (_, i) => getAssetPath('enemy_legacy', `monster2/skeleton/skeleton%20(${i + 1}).png`));
const ANIMS_HARPY = Array.from({length: 4}, (_, i) => getAssetPath('enemy_legacy', `happy/happy%20(${i + 1}).png`));
const ANIMS_GOLEM = Array.from({length: 4}, (_, i) => getAssetPath('enemy_legacy', `golem/Golem%20(${i + 1}).png`));
const ANIMS_PHANTOM = Array.from({length: 11}, (_, i) => getAssetPath('enemy_phantom_new', `monster_phantom_${String(i + 1).padStart(2, '0')}.png`));
const ANIMS_DRAGON = Array.from({length: 3}, (_, i) => getAssetPath('enemy_legacy', `doragon/A_dragon%20(${i + 1}).png`));

const ANIMS_EYES = Array.from({length: 6}, (_, i) => getAssetPath('enemy_new', `eyes/eyes_0${i + 1}.png`));
const ANIMS_GARGOIL = Array.from({length: 9}, (_, i) => getAssetPath('enemy_new', `gargoyle/gargoyle_0${i + 1}.png`));
const ANIMS_MAICONID = Array.from({length: 10}, (_, i) => getAssetPath('enemy_new', `maiconid/maiconid_${(i+1)<10?'0'+(i+1):(i+1)}.png`));

// 全階層のキー名マッピングマスター
const MASTER_ANIM_MAP = { 
    slime: ANIMS_SLIME, spider: ANIMS_SPIDER, skelton: ANIMS_SKELTON, 
    harpy: ANIMS_HARPY, golem: ANIMS_GOLEM, gargoil: ANIMS_GARGOIL, 
    mush: ANIMS_MAICONID, phantom: ANIMS_PHANTOM, eyes: ANIMS_EYES, dragon: ANIMS_DRAGON 
};

// グローバル状態管理変数（エネミーアニメーション用）
let animeTimeout = null; 
let currentFrameIdx = 0;

// ==========================================
// ⚙️ 2. モンスターアニメーション制御マシン
// ==========================================
/**
 * 対象モンスターの連番アニメーションループを開始する関数
 */
function startCustomAnimation(type) {
    stopSlimeAnimation();
    const graphicEl = document.getElementById("e-sprite-graphic"); 
    if (!graphicEl) return;
    
    function step() {
        if (curIdx < 0 || !STAGES[curIdx]) return;
        let cType = STAGES[curIdx].type;
        let dynamicArr = MASTER_ANIM_MAP[cType] || ANIMS_SLIME;
        
        currentFrameIdx = (currentFrameIdx + 1) % dynamicArr.length;
        graphicEl.src = dynamicArr[currentFrameIdx];
        
        // 16枚スライムや11枚ファントムのコマ数増量に合わせて描画フレーム速度(ms)を個別最適化
        let fps = (cType === 'slime') ? 130 : (cType === 'phantom' ? 160 : 140);
        animeTimeout = setTimeout(step, fps); 
    }
    step();
}

/**
 * モンスターのアニメーションループを完全に停止・クリアする関数
 */
function stopSlimeAnimation() { 
    if (animeTimeout) { 
        clearTimeout(animeTimeout); 
        animeTimeout = null; 
    } 
}
