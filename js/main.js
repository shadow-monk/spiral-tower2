// ==========================================\
// 🔧 1. 開発者コンソール・デバッグ制御ロジック
// ==========================================\

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

        // 💥 トリックの核心：ブラウザのセキュリティ制限（ジェスチャー制限）を突破するため、
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
