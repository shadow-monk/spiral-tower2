// ==========================================
// 🛡 SAFE PATCH FIX
// battle.js 最上部
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

console.log("🛡 SAFE PATCH 起動");

// ------------------------------
// null安全
// ------------------------------
function safeEl(id){
    return document.getElementById(id);
}

// ------------------------------
// AudioContext共有
// ------------------------------
window.audioCtx =
window.audioCtx ||
new (window.AudioContext || window.webkitAudioContext)();

// ------------------------------
// 安全HTML
// ------------------------------
window.safeHTML = function(id, text){
    const el = safeEl(id);
    if(el){
        el.innerHTML = text;
    }
};

// ------------------------------
// 安全表示
// ------------------------------
window.safeDisplay = function(id, mode){
    const el = safeEl(id);
    if(el){
        el.style.display = mode;
    }
};

// ------------------------------
// タイマー停止
// ------------------------------
window.stopAllBattleTimers = function(){

    if(window.animeTimeout){
        clearTimeout(window.animeTimeout);
        window.animeTimeout = null;
    }

};

// ==========================================
// 遅延安全パッチ
// 関数定義後に上書き
// ==========================================

setTimeout(() => {

    // ------------------------------
    // startCustomAnimation
    // ------------------------------
    if(typeof startCustomAnimation === "function"){

        const oldFunc = startCustomAnimation;

        window.startCustomAnimation = function(type){

            stopAllBattleTimers();

            try{
                oldFunc(type);
            }catch(e){
                console.error("Animation Error", e);
            }

        };

    }

    // ------------------------------
    // startBattle
    // ------------------------------
    if(typeof startBattle === "function"){

        const oldBattle = startBattle;

        window.startBattle = function(){

            try{

                const container =
                    safeEl("e-sprite-container");

                if(container){
                    container.style.animation =
                    "floatE 2.2s infinite alternate ease-in-out";
                }

                oldBattle();

            }catch(e){

                console.error("Battle Error", e);

            }

        };

    }

    // ------------------------------
    // updateHpUI
    // ------------------------------
    if(typeof updateHpUI === "function"){

        const oldHp = updateHpUI;

        window.updateHpUI = function(){

            try{
                oldHp();
            }catch(e){
                console.error("HP UI Error", e);
            }

        };

    }

    console.log("✅ SAFE PATCH 適用完了");

}, 500);

});
