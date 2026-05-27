// ==========================================
// 📺 1. 画面表示切り替え・UI制御ロジック
// ==========================================
console.log("%c🎨 [UI SYSTEMS] Ver 7.55: 最新インデックスとID・トグル変形配線が100%完全同調した確定版全コードです。", "color: #00ffff; font-weight: bold;");

/**
 * スタート・導入・バトル・リザルトの各画面（div）を表示制御する関数
 */
function showScreen(screenId) {
    ['scr-start', 'scr-intro', 'scr-battle', 'scr-result'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = (id === screenId) ? 'block' : 'none';
    });
}

/**
 * プレイヤーと敵のHPバーおよび文字表記を最新値に更新する関数
 */
function updateHpUI() {
    if (curIdx < 0) return;
    let pPct = Math.max(0, (pHp / pMaxHp) * 100); 
    let ePct = Math.max(0, (eHp / eMaxHp) * 100);
    
    const pBar = document.getElementById('p-hp-bar');
    const eBar = document.getElementById('e-hp-bar');
    if (pBar) pBar.style.width = `${pPct}%`; 
    if (eBar) eBar.style.width = `${ePct}%`;
    
    const pTxt = document.getElementById('p-hp-txt');
    const eTxt = document.getElementById('e-hp-txt');
    if (pTxt) pTxt.innerText = `HP: ${pHp} / ${pMaxHp}`; 
    if (eTxt) eTxt.innerText = `HP: ${eHp} / ${eMaxHp}`;
}

/**
 * 🎯【超シンプル・ダメージポップアップ有線回路】
 * 看板の残骸が最前面に残ってクリックを泥棒するバグを、
 * pointerEvents = "none" の絶対結界で完全遮断・永久完治する回路。
 */
function createDmgPop(dmg, isPlayer) {
    const pContainer = document.getElementById("p-sprite-container");
    const eContainer = document.getElementById("e-sprite-container");
    
    const targetContainer = isPlayer ? pContainer : eContainer;
    const timeoutKey = isPlayer ? "_pPopTimeout" : "_ePopTimeout";
    const layerKey = isPlayer ? "_pDmgLabel" : "_eDmgLabel";

    if (!targetContainer) return;

    targetContainer.style.position = "relative";

    if (!window[layerKey]) {
        window[layerKey] = document.createElement("div");
        window[layerKey].style.position = "absolute";
        window[layerKey].style.fontWeight = "900";
        window[layerKey].style.textShadow = "3px 3px 0 #000";
        window[layerKey].style.zIndex = "999";
        
        // 🛡️ 看板要素自体に、クリックを100%下層へ透過させる絶対命令を刻印！
        window[layerKey].style.pointerEvents = "none";
        
        window[layerKey].style.width = "100%";
        window[layerKey].style.textAlign = "center";
        window[layerKey].style.left = "0";
        window[layerKey].style.top = "-40px"; 
        
        targetContainer.appendChild(window[layerKey]);
    }

    const currentLayer = window[layerKey];

    if (window[timeoutKey]) clearTimeout(window[timeoutKey]);

    currentLayer.innerText = isPlayer ? `-${dmg}` : dmg; 
    currentLayer.style.fontSize = isPlayer ? "3.2rem" : "3.6rem"; 
    currentLayer.style.color = isPlayer ? "#ef4444" : "#ffffff"; 
    currentLayer.style.opacity = "1";
    currentLayer.style.display = "block";

    window[timeoutKey] = setTimeout(() => {
        currentLayer.style.opacity = "0";
        currentLayer.style.display = "none";
    }, 800);
}


// ==========================================
// 🔮 2. 呪文スロット（メイン下トグル変形）制御ロジック
// ==========================================

/**
 * 🔮 呪文ボタンエリアを展開（A面メインを隠し、B面呪文をハキハキ点灯！）
 */
function openMagicBag() {
    if (window.isBusy || pHp <= 0 || eHp <= 0) return;

    const mainPanel = document.getElementById('panel-main-mode');
    const magicPanel = document.getElementById('panel-magic-mode');
    
    if (mainPanel) mainPanel.style.display = 'none';
    if (magicPanel) magicPanel.style.display = 'block';
}

/**
 * ↩️ 呪文ボタンエリアを閉じて元の行動選択へ（B面呪文を隠し、A面メインを大復活！）
 */
function closeMagicBag() {
    const mainPanel = document.getElementById('panel-main-mode');
    const magicPanel = document.getElementById('panel-magic-mode');
    
    if (magicPanel) magicPanel.style.display = 'none';
    if (mainPanel) mainPanel.style.display = 'block';
}


// ==========================================
// 🎒 3. アイテムバッグUI制御ロジック
// ==========================================

/**
 * 所持数を反映させたうえでアイテムバッグパネルを開く関数
 */
function openItemBag() { 
    if (window.isBusy || pHp <= 0 || eHp <= 0) return;

    const slotPotion = document.getElementById('item-slot-potion');
    const slotAmulet = document.getElementById('item-slot-amulet');
    const bagPanel = document.getElementById('item-bag-panel');
    
    if (slotPotion) slotPotion.innerText = `🧪 回復薬 (${itemInventory.potion})`; 
    if (slotAmulet) slotAmulet.innerText = `🧿 お守り (${itemInventory.amulet})`; 
    if (bagPanel) bagPanel.style.display = 'flex'; 
}

/**
 * アイテムバッグパネルを閉じる関数
 */
function closeItemBag() { 
    const bagPanel = document.getElementById('item-bag-panel');
    if (bagPanel) bagPanel.style.display = 'none'; 
}
