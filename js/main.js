// ==========================================
// 🔧 1. 開発者コンソール・デバッグ制御ロジック
// ==========================================
console.log("%c🔄 [MAIN SYSTEMS] Ver 7.35: デスコードラグ・2重ワープ・全回復誤配線を完全修復しました。", "color: #10b981; font-weight: bold;");

/**
 * 開発者コンソールの入力パスワード（1192）を検証し、デバッグ機能を解放する関数
 */
function checkDevPassword() {
    const inputField = document.getElementById("dev-password-input");
    const badge = document.getElementById("dev-status-badge");
    const consoleWindow = document.getElementById("dev-console-window");
    
    if (!inputField) return;

    // パスワード「1192」でロック解除
    if (inputField.value === "1192") { 
        if (badge) {
            badge.innerText = "UNLOCKED"; 
            badge.style.color = '#10b981';
        }
        window.isDebugUnlocked = true;
        
        // 特典の上書き反映
        window.pMaxHp = 8000; 
        window.pHp = 8000; 
        if (typeof updateHpUI === 'function') updateHpUI();

        if (typeof startBGM === 'function') {
            startBGM("title"); 
        }

        // 🛡️【デバッグ有線回路の大リフォーム】
        // ラグる敵ターンへの割り込みや、関数の2重実行（2歩ワープ）の不純物をすべて引き算し、最強の直結配線へ修正！
        setTimeout(() => {
            if (consoleWindow) {
                consoleWindow.innerHTML = `
                    <div style="font-size:0.9rem; font-weight:800; color:#10b981; margin-bottom:10px;">⚡ デバッグ権限が有効化されました</div>
                    <div style="display:grid; grid-template-columns: repeat(2, 1fr); gap: 8px;">
                        
                        <button onclick="window.isBusy=false; if(typeof window.turn==='function') window.turn('debug_death');" style="background:#ef4444; color:white; border:none; border-radius:8px; padding:12px; font-size:0.9rem; font-weight:bold; cursor:pointer;">☠️ 敵瞬殺 (デス)</button>
                        
                        <button onclick="window.pMaxHp=8000; window.pHp=8000; if(typeof updateHpUI==='function')updateHpUI();" style="background:#10b981; color:white; border:none; border-radius:8px; padding:12px; font-size:0.9rem; font-weight:bold; cursor:pointer;">❤️ HP全回復</button>
                        
                        <button onclick="window.mana=2.5; const bg=document.getElementById('charge-badge'); if(bg)bg.style.display='block';" style="background:#3b82f6; color:white; border:none; border-radius:8px; padding:12px; font-size:0.9rem; font-weight:bold; cursor:pointer;">⚡ 魔力満タン</button>
                        
                        <button onclick="if(typeof window.nextStage==='function') window.nextStage();" style="background:#8b5cf6; color:white; border:none; border-radius:8px; padding:12px; font-size:0.9rem; font-weight:bold; cursor:pointer;">🔮 階層ワープ</button>
                    
                    </div>
                `;
            }
        }, 1);
    } 
    else { 
        if (badge) {
            badge.innerText = "LOCKED"; 
            badge.style.color = '#ef4444';
        }
        window.isDebugUnlocked = false;
    }
}

// ==========================================
// 📦 2. 起動時一括通信ラグ撲滅システム（GitHub Pages対応版プリロード）
// ==========================================
(function() {
    function preloadAllEnemyAssets() {
        console.log("main.js: GitHub Pages上でのアセット一括プリロードを開始します...");
        
        if (typeof MASTER_ANIM_MAP === 'undefined') {
            console.warn("main.js: MASTER_ANIM_MAP がまだ読み込まれていないため、0.1秒後に再試行します。");
            setTimeout(preloadAllEnemyAssets, 100);
            return;
        }

        let loadedCount = 0;
        let totalCount = 0;
        
        const playerUrl = 'spiral-tower2/assets/enemies/player/player_wizard.png';
        const urlsToLoad = [playerUrl];

        for (let key in MASTER_ANIM_MAP) {
            if (Array.isArray(MASTER_ANIM_MAP[key])) {
                MASTER_ANIM_MAP[key].forEach(url => {
                    let correctedUrl = url;
                    if (!url.startsWith('spiral-tower2/') && !url.startsWith('http')) {
                        let cleanUrl = url.replace(/^\.\//, '').replace(/^\//, '');
                        correctedUrl = 'spiral-tower2/' + cleanUrl;
                    }
                    urlsToLoad.push(correctedUrl);
                });
            }
        }

        totalCount = urlsToLoad.length;

        urlsToLoad.forEach(url => {
            const img = new Image();
            img.onload = () => {
                loadedCount++;
                if (loadedCount === totalCount) {
                    console.log(`%cmain.js: 成功！GitHub Pages上の全 ${totalCount} 枚（プレイヤー＆魔物）が完全ホールドされました！`, "color: #10b981; font-weight: bold;");
                }
            };
            img.onerror = () => {
                console.error(`main.js: 画像の仕入れに失敗しました: ${url}`);
            };
            img.src = window.location.origin + '/' + url;
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', preloadAllEnemyAssets);
    } else {
        preloadAllEnemyAssets();
    }
})();
