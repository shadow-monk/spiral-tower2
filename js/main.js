// ==========================================
// 🔧 1. 開発者コンソール・デバッグ制御ロジック
// ==========================================

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

        // トリックの核心：ブラウザのセキュリティ制限（ジェスチャー制限）を突破するため、
        // ユーザーが文字を入力した「まさにその瞬間」のイベントのど真ん中でBGMをキックします。
        if (typeof startBGM === 'function') {
            startBGM("title"); 
        }

        // 1ミリ秒の超高速タイマーで裏画面へデバッグコマンドを安全に流し込む
        setTimeout(() => {
            if (consoleWindow) {
                consoleWindow.innerHTML = `
                    <div style="font-size:0.9rem; font-weight:800; color:#10b981; margin-bottom:10px;">⚡ デバッグ権限が有効化されました</div>
                    <div style="display:grid; grid-template-columns: repeat(2, 1fr); gap: 8px;">
                        <button onclick="window.eHp=0; if(typeof window.enemyTurnAction==='function') window.enemyTurnAction('die');" style="background:#ef4444; color:white; border:none; border-radius:8px; padding:12px; font-size:0.9rem; font-weight:bold; cursor:pointer;">☠️ 敵瞬殺 (デス)</button>
                        <button onclick="window.pMaxHp=8000; window.pHp=8000; if(typeof updateHpUI==='function')updateHpUI();" style="background:#10b981; color:white; border:none; border-radius:8px; padding:12px; font-size:0.9rem; font-weight:bold; cursor:pointer;">❤️ HP全回復</button>
                        <button onclick="window.mana=2.5; const bg=document.getElementById('charge-badge'); if(bg)bg.style.display='block';" style="background:#3b82f6; color:white; border:none; border-radius:8px; padding:12px; font-size:0.9rem; font-weight:bold; cursor:pointer;">⚡ 魔力満タン</button>
                        <button onclick="window.curIdx++; if(typeof nextStage==='function')nextStage();" style="background:#8b5cf6; color:white; border:none; border-radius:8px; padding:12px; font-size:0.9rem; font-weight:bold; cursor:pointer;">🔮 階層ワープ</button>
                    </div>
                `;
            }
        }, 1);
    } 
    // 入力途中や間違っている、または空欄なら即時ロック
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
    /**
     * ゲーム起動時に、裏メモリ上でプレイヤーと全魔物画像を強制先行ロードさせる関数
     */
    function preloadAllEnemyAssets() {
        console.log("main.js: GitHub Pages上でのアセット一括プリロードを開始します...");
        
        if (typeof MASTER_ANIM_MAP === 'undefined') {
            console.warn("main.js: MASTER_ANIM_MAP がまだ読み込まれていないため、0.1秒後に再試行します。");
            setTimeout(preloadAllEnemyAssets, 100);
            return;
        }

        let loadedCount = 0;
        let totalCount = 0;
        
        // 🧙‍♂️ GitHub Pagesのルート問題を突破する絶対的相対パス
        const playerUrl = 'spiral-tower2/assets/enemies/player/player_wizard.png';
        const urlsToLoad = [playerUrl];

        // 魔物たちの全URL（105枚）をリストにすべて合流させる
        for (let key in MASTER_ANIM_MAP) {
            if (Array.isArray(MASTER_ANIM_MAP[key])) {
                MASTER_ANIM_MAP[key].forEach(url => {
                    // もしURLにリポジトリ名が含まれていない裸の状態なら、先頭に付与して補正
                    let correctedUrl = url;
                    if (!url.startsWith('spiral-tower2/') && !url.startsWith('http')) {
                        // 先頭の ./ や / を綺麗に掃除してリポジトリ名を結合
                        let cleanUrl = url.replace(/^\.\//, '').replace(/^\//, '');
                        correctedUrl = 'spiral-tower2/' + cleanUrl;
                    }
                    urlsToLoad.push(correctedUrl);
                });
            }
        }

        totalCount = urlsToLoad.length;

        // 集約した全106枚のリストを一気に裏メモリに流し込む
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

            // ドメイン直下にすっ飛ぶのを防ぐため、GitHub Pages専用の絶対相対パスで確定ロード
            img.src = window.location.origin + '/' + url;
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', preloadAllEnemyAssets);
    } else {
        preloadAllEnemyAssets();
    }
})();
