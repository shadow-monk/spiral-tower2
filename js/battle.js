// ==========================================
// 🛡 SAFE PATCH + SE_MAGIC FIX COMPLETE
// battle.js の最上部へ追加
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

console.log("🛡 SAFE PATCH 起動");

// ==========================================
// null安全取得
// ==========================================
function safeEl(id){
    return document.getElementById(id);
}

// ==========================================
// AudioContext共有
// ==========================================
window.audioCtx =
window.audioCtx ||
new (window.AudioContext || window.webkitAudioContext)();

// ==========================================
// SE_MAGIC 緊急保護
// ==========================================
window.SE_MAGIC = window.SE_MAGIC || {};

// ==========================================
// 安全HTML
// ==========================================
window.safeHTML = function(id, text){

    const el = safeEl(id);

    if(el){
        el.innerHTML = text;
    }

};

// ==========================================
// 安全表示
// ==========================================
window.safeDisplay = function(id, mode){

    const el = safeEl(id);

    if(el){
        el.style.display = mode;
    }

};

// ==========================================
// タイマー停止
// ==========================================
window.stopAllBattleTimers = function(){

    if(window.animeTimeout){

        clearTimeout(window.animeTimeout);

        window.animeTimeout = null;

    }

};

// ==========================================
// playSE 完全安全版
// ==========================================
window.playSE = function(type){

    if(window.isMuted) return;

    // ------------------------------
    // 安全SE取得
    // ------------------------------
    const safeSE =
        (typeof SE_MAGIC !== "undefined")
        ? SE_MAGIC
        : {};

    // ------------------------------
    // mp3/wav 再生
    // ------------------------------
    if(safeSE[type]){

        try{

            let mAudio = new Audio(safeSE[type]);

            mAudio.volume = 0.6;

            mAudio.play().catch(() => null);

            return;

        }catch(e){

            console.error("SE Audio Error", e);

        }

    }

    // ------------------------------
    // フォールバック電子音
    // ------------------------------
    try{

        let audioCtx = window.audioCtx;

        if(!audioCtx) return;

        let now = audioCtx.currentTime;

        let osc = audioCtx.createOscillator();

        let gain = audioCtx.createGain();

        osc.connect(gain);

        gain.connect(audioCtx.destination);

        // 音タイプ
        if(type === "click"){

            osc.type = "square";
            osc.frequency.setValueAtTime(440, now);

        }else if(type === "boom"){

            osc.type = "sawtooth";
            osc.frequency.setValueAtTime(90, now);

        }else{

            osc.type = "triangle";
            osc.frequency.setValueAtTime(220, now);

        }

        gain.gain.setValueAtTime(0.04, now);

        gain.gain.linearRampToValueAtTime(
            0.001,
            now + 0.12
        );

        osc.start(now);

        osc.stop(now + 0.12);

    }catch(e){

        console.error("Fallback SE Error", e);

    }

};

// ==========================================
// 遅延安全パッチ
// ==========================================
setTimeout(() => {

    // ==========================================
    // startCustomAnimation 安全化
    // ==========================================
    if(typeof startCustomAnimation === "function"){

        const oldAnim = startCustomAnimation;

        window.startCustomAnimation = function(type){

            stopAllBattleTimers();

            try{

                oldAnim(type);

            }catch(e){

                console.error(
                    "Animation Error",
                    e
                );

            }

        };

    }

    // ==========================================
    // startBattle 安全化
    // ==========================================
    if(typeof startBattle === "function"){

        const oldBattle = startBattle;

        window.startBattle = function(){

            try{

                const container =
                    safeEl(
                        "e-sprite-container"
                    );

                if(container){

                    container.style.animation =
                    "floatE 2.2s infinite alternate ease-in-out";

                }

                oldBattle();

            }catch(e){

                console.error(
                    "Battle Error",
                    e
                );

            }

        };

    }

    // ==========================================
    // updateHpUI 安全化
    // ==========================================
    if(typeof updateHpUI === "function"){

        const oldHp = updateHpUI;

        window.updateHpUI = function(){

            try{

                oldHp();

            }catch(e){

                console.error(
                    "HP UI Error",
                    e
                );

            }

        };

    }

    console.log("✅ SAFE PATCH 適用完了");

}, 500);

});
