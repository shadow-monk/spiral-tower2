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
    const oldDebugBtn = document.getElementById("btn-debug-death"); // コマンド側の旧デスボタン
    
    if (!inputField) return;

    // パスワード「1192」でロック解除
    if (inputField.value === "1192") { 
        if (badge) {
            badge.innerText = "UNLOCKED"; 
            badge.style.color = '#10b981';
        }
        window.isDebugUnlocked = true;
        
        // コマンドエリア側の古いデスボタンを強制非表示にして、画面のダブりを完全に防う
        if (oldDebugBtn) oldDebugBtn.style.setProperty("display", "none", "important");
        
        // 特典の上書き反映
        window.pMaxHp = 8000; 
        window.pHp = 8000; 
        if (typeof updateHpUI === 'function') updateHpUI();

        // 💥 トリックの核心：ブラウザの入力処理が終わるのを1ミリ秒待ってから、安全に中身を書き換える
        setTimeout(() => {
            if (consoleWindow) {
                consoleWindow.innerHTML = `
                    <div style="font-size:0.9rem; font-weight:800; color:#94a3b8; margin-bottom:10px; display:flex; justify-content:space-between;">
                        <span>🔧 開発者コンソール (PW「1192」)</span>
                        <span id="dev-status-badge" style="color:#10b981; font-weight:900;">UNLOCKED</span>
                    </div>
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; width: 100%; margin-top: 5px;">
                        <button onclick="turn('debug_death')" style="background:#ef4444; color:white; border:none; border-radius:8px; padding:12px; font-size:0.9rem; font-weight:bold; cursor:pointer;">☠️ 敵瞬殺 (デス)</button>
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
// 🚀 2. ゲームエントリーポイント（起動トリガー）
// ==========================================

/**
 * ブラウザがHTMLとすべての外部JSファイルを読み込み終えた瞬間に走る初期化イベント
 */
window.onload = function() { 
    console.log("Spiral Tower 2 - Audio & Battle Systems Standby."); 
};
