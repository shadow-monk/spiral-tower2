// ==========================================
// 🛡 FINAL FORCE PATCH
// battle.js の一番最後に追加
// ==========================================

console.log("🛡 FINAL FORCE PATCH 起動");

// ==========================================
// SE_MAGIC 強制生成
// ==========================================
window.SE_MAGIC = window.SE_MAGIC || {};

// ==========================================
// AudioContext共有
// ==========================================
window.audioCtx =
window.audioCtx ||
new (window.AudioContext || window.webkitAudioContext)();

// ==========================================
// playSE 完全上書き
// ==========================================
window.playSE = function(type){

    try{

        if(window.isMuted) return;

        const safeSE =
            window.SE_MAGIC || {};

        // ------------------------------
        // 音声ファイル
        // ------------------------------
        if(safeSE[type]){

            let audio = new Audio(
                safeSE[type]
            );

            audio.volume = 0.6;

            audio.play().catch(() => {});

            return;
        }

        // ------------------------------
        // フォールバック電子音
        // ------------------------------
        let ctx = window.audioCtx;

        if(!ctx) return;

        let now = ctx.currentTime;

        let osc = ctx.createOscillator();

        let gain = ctx.createGain();

        osc.connect(gain);

        gain.connect(ctx.destination);

        // 種類
        switch(type){

            case "click":

                osc.type = "square";
                osc.frequency.value = 440;

            break;

            case "boom":

                osc.type = "sawtooth";
                osc.frequency.value = 80;

            break;

            case "holy":

                osc.type = "sine";
                osc.frequency.value = 880;

            break;

            default:

                osc.type = "triangle";
                osc.frequency.value = 220;

        }

        gain.gain.setValueAtTime(
            0.04,
            now
        );

        gain.gain.linearRampToValueAtTime(
            0.001,
            now + 0.15
        );

        osc.start(now);

        osc.stop(now + 0.15);

    }catch(e){

        console.error(
            "playSE crash blocked",
            e
        );

    }

};

console.log("✅ FINAL FORCE PATCH 完了");
