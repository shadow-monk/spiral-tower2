// ==========================================
// 📺 1. 画面表示切り替え・UI制御ロジック
// ==========================================

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
    
    // バーの横幅（%）を動的に反映
    const pBar = document.getElementById('p-hp-bar');
    const eBar = document.getElementById('e-hp-bar');
    if (pBar) pBar.style.width = `${pPct}%`; 
    if (eBar) eBar.style.width = `${ePct}%`;
    
    // HP数値テキストを反映
    const pTxt = document.getElementById('p-hp-txt');
    const eTxt = document.getElementById('e-hp-txt');
    if (pTxt) pTxt.innerText = `HP: ${pHp} / ${pMaxHp}`; 
    if (eTxt) eTxt.innerText = `HP: ${eHp} / ${eMaxHp}`;
}

/**
 * 戦闘画面内にダメージの数字（ポップアップ）を動的生成・アニメーションする関数
 */
function createDmgPop(dmg, isPlayer) {
    const pop = document.createElement("div"); 
    pop.style.position = "absolute"; 
    pop.style.fontSize = "2.5rem"; 
    pop.style.fontWeight = "900"; 
    pop.style.textShadow = "2px 2px #000";
    
    // 画面が横長に引き伸ばされないよう、絶対座標の最大値をスクエア枠内に制限（360px）
    pop.style.left = isPlayer ? "100px" : "360px"; 
    pop.style.top = "150px"; 
    pop.style.color = isPlayer ? "#ef4444" : "#fff"; 
    pop.innerText = dmg;
    
    const dmgLayer = document.getElementById("dmg-layer");
    if (dmgLayer) {
        dmgLayer.appendChild(pop); 
        setTimeout(() => pop.remove(), 800);
    }
}

// ==========================================
// 🎒 2. アイテムバッグUI制御ロジック
// ==========================================

/**
 * 所持数を反映させたうえでアイテムバッグパネルを開く関数
 */
function openItemBag() { 
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
