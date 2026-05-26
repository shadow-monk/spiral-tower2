// ==========================================\r
// 🔧 1. 開発者コンソール・デバッグ制御ロジック\r
// ==========================================\r
\r
/**\r
 * 開発者コンソールの入力パスワード（1192）を検証し、デバッグ機能を解放する関数\r
 */\r
function checkDevPassword() {\r
    const inputField = document.getElementById("dev-password-input");\r
    const badge = document.getElementById("dev-status-badge");\r
    const oldDebugBtn = document.querySelector("#cmd-panel #btn-debug-death"); // コマンド側の旧デスボタン\r
    const customPanel = document.getElementById("btn-debug-death");           // コンソール側の新4連パネル\r
    \r
    // パスワード「1192」でロック解除\r
    if (inputField && inputField.value === "1192") { \r
        if (badge) {\r
            badge.innerText = "UNLOCKED"; \r
            badge.style.color = '#10b981';\r\n        }\r
        window.isDebugUnlocked = true;\r
        \r
        // コマンドエリアの旧デスボタンの暴発・重複を完全に隠蔽・消去する\r
        if (oldDebugBtn) oldDebugBtn.style.setProperty("display", "none", "important");\r
        \r
        // コンソール窓内の4連ボタンパネルを「gridレイアウト」で強制起動し、入力欄を消去する\r
        if (customPanel) {\r
            customPanel.style.setProperty("display", "grid", "important");\r
        }\r
        if (inputField) inputField.style.display = "none";\r
        \r
        // 初期HP特典の上書き反映\r
        window.pMaxHp = 8000; \r
        window.pHp = 8000; \r
        if (typeof updateHpUI === 'function') updateHpUI();\r
    } \r
    // 間違っている、または空欄なら即時ロック\r
    else { \r
        if (badge) {\r
            badge.innerText = "LOCKED"; \r
            badge.style.color = '#ef4444';\r
        }\r
        window.isDebugUnlocked = false;\r
        if (customPanel) customPanel.style.display = "none";\r
        if (inputField) inputField.style.display = "block";\r
    }\r
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
