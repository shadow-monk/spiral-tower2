// ==========================================
// 🔧 1. 開発者コンソール・デバッグ制御ロジック
// ==========================================

/**
 * 開発者コンソールの入力パスワード（1192）を検証し、デバッグ機能を解放する関数
 */
function checkDevPassword() {
    const inputField = document.getElementById("dev-password-input");
    const badge = document.getElementById("dev-status-badge");
    const debugBtn = document.getElementById("btn-debug-death");
    
    // パスワード「1192」でロック解除
    if (inputField && inputField.value === "1192") { 
        if (badge) {
            badge.innerText = "UNLOCKED"; 
            badge.style.color = '#10b981';
        }
        isDebugUnlocked = true;
        
        // デバッグ特典：HPを大幅に引き上げてワンパン・デスボタンを出現させる
        pMaxHp = 8000; 
        pHp = 8000; 
        updateHpUI();
        
        if (debugBtn) debugBtn.style.display = "block";
    } 
    // 間違っている、または空欄なら即時ロック
    else { 
        if (badge) {
            badge.innerText = "LOCKED"; 
            badge.style.color = '#ef4444';
        }
        isDebugUnlocked = false;
        if (debugBtn) debugBtn.style.display = "none";
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
