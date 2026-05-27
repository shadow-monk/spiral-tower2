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
 * 戦闘画面内にダメージの数字（ポップアップ）をDOMを作成せず、
 * 既存のレイヤーの文字入れ替えとCSSアニメーションだけで超軽量に表現する関数
 */
function createDmgPop(dmg, isPlayer) {
    const dmgLayer = document.getElementById("dmg-layer");
    if (!dmgLayer) return;

    // 既存の古いタイマー（残像消去用ウェイト）があれば即座にクリアして競合を完全防止
    if (window._dmgPopTimeout) clearTimeout(window._dmgPopTimeout);

    // 💡【軽量化の核心】HTMLを新しく製造(createElement)せず、既存の看板の文字だけを置換
    dmgLayer.innerText = dmg;
    dmgLayer.style.position = "absolute";
    dmgLayer.style.fontSize = "3.2rem";
    dmgLayer.style.fontWeight = "900";
    dmgLayer.style.textShadow = "3px 3px 0 #000";
    dmgLayer.style.left = isPlayer ? "80px" : "340px";
    dmgLayer.style.top = "120px";
    dmgLayer.style.color = isPlayer ? "#ef4444" : "#ffffff";
    dmgLayer.style.zIndex = "99";
    dmgLayer.style.opacity = "1";
    dmgLayer.style.transition = "none";
    dmgLayer.style.transform = "scale(0.5) translateY(20px)";

    // ブラウザに一瞬だけ描画のリフレッシュをかけ、バウンドアニメーションをなめらかに起動
    requestAnimationFrame(() => {
        dmgLayer.style.transition = "transform 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.5s ease-in 0.3s";
        dmgLayer.style.transform = "scale(1.1) translateY(-10px)";
    });

    // 400ms後に文字を非表示（透明化）にするタイマーをセット
    window._dmgPopTimeout = setTimeout(() => {
        dmgLayer.style.opacity = "0";
        dmgLayer.style.transform = "scale(0.8) translateY(-30px)";
    }, 400);
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
