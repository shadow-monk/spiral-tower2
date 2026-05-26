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
    const consoleWindow = document.getElementById("dev-console-window");\r
    const oldDebugBtn = document.getElementById("btn-debug-death"); // コマンド側の旧デスボタン\r
    \r
    // パスワード「1192」でロック解除\r
    if (inputField && inputField.value === "1192") { \r
        if (badge) {\r
            badge.innerText = "UNLOCKED"; \r
            badge.style.color = '#10b981';\r
        }\r
        window.isDebugUnlocked = true;\r
        \r
        // コマンドエリア側の古いデスボタンを強制非表示にして、画面のダブりを完全に防ぐ\r
        if (oldDebugBtn) oldDebugBtn.style.setProperty("display", "none", "important");\r
        \r
        // 【核心】HTML側のコンソール窓内部を、4連ボタンのHTMLコードへ丸ごと動的に上書き・置換する\r
        if (consoleWindow) {\r
            consoleWindow.innerHTML = `\r
                <div style="font-size:0.9rem; font-weight:800; color:#94a3b8; margin-bottom:10px; display:flex; justify-content:space-between;">\r
                    <span>🔧 開発者コンソール (PW「1192」)</span>\r
                    <span id="dev-status-badge" style="color:#10b981; font-weight:900;">UNLOCKED</span>\r
                </div>\r
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; width: 100%; margin-top: 5px;">\r
                    <button onclick="turn('debug_death')" style="background:#ef4444; color:white; border:none; border-radius:8px; padding:12px; font-size:0.9rem; font-weight:bold; cursor:pointer;">☠️ 敵瞬殺 (デス)</button>\r
                    <button onclick="window.pMaxHp=8000; window.pHp=8000; if(typeof updateHpUI==='function')updateHpUI();" style="background:#10b981; color:white; border:none; border-radius:8px; padding:12px; font-size:0.9rem; font-weight:bold; cursor:pointer;">❤️ HP全回復</button>\r
                    <button onclick="window.mana=2.5; const bg=document.getElementById('charge-badge'); if(bg)bg.style.display='block';" style="background:#3b82f6; color:white; border:none; border-radius:8px; padding:12px; font-size:0.9rem; font-weight:bold; cursor:pointer;">⚡ 魔力満タン</button>\r
                    <button onclick="window.curIdx++; if(typeof nextStage==='function')nextStage();" style="background:#8b5cf6; color:white; border:none; border-radius:8px; padding:12px; font-size:0.9rem; font-weight:bold; cursor:pointer;">🔮 階層ワープ</button>\r
                </div>\r
            `;\r
        }\r
        \r
        // 初期HP特典の上書き反映\r
        window.pMaxHp = 8000; \r
        window.pHp = 8000; \r
        if (typeof updateHpUI === 'function') updateHpUI();\r
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
