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
        
        // 各モンスターの重量感・世界観に合わせた最適なスピード（FPS）設定
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
