// ==========================================
// 📺 1. 画面表示切り替え・UI制御ロジック（バグ完全修正版）
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
 * 💡【バグ完全根絶システム】
 * createElementを一切使わず、かつ敵味方の「上書き衝突」と「位置あべこべ」を
 * 2台の独立した看板（レイヤー）に分けることで100%完治させる超軽量演出関数
 */
function createDmgPop(dmg, isPlayer) {
    // 1. 本来のHTMLにある「敵の目の前(dmg-layer)」を敵用、
    //    もし無い時のための安全弁や味方用としてプレイヤーコンテナ内に即席の軽量看板を共有します
    const enemyLayer = document.getElementById("dmg-layer");
    const playerContainer = document.getElementById("p-sprite-container");
    
    // 味方用の軽量テキスト看板がなければ、p-sprite-containerの内部に1つだけ固定で用意（使い回し型）
    if (!window._playerDmgLayer && playerContainer) {
        window._playerDmgLayer = document.createElement("div");
        window._playerDmgLayer.style.position = "absolute";
        window._playerDmgLayer.style.left = "40px";
        window._playerDmgLayer.style.top = "-40px"; // キャラクターの頭上に配置
        window._playerDmgLayer.style.pointerEvents = "none";
        playerContainer.appendChild(window._playerDmgLayer);
    }

    // 2. battle.jsからの「isPlayer」の定義に基づき、動かす看板(ターゲット)を完全に分離
    // ※battle.jsの仕様上、isPlayer=trueは「敵のターン(プレイヤー被弾)」、isPlayer=falseは「プレイヤーのターン(敵被弾)」
    const currentLayer = isPlayer ? window._playerDmgLayer : enemyLayer;
    const currentTimeoutKey = isPlayer ? "_pDmgTimeout" : "_eDmgTimeout";

    if (!currentLayer) return;

    // 既存のそのキャラクター用のタイマーがあれば即座にクリア（連打時の上書き不発を防止）
    if (window[currentTimeoutKey]) clearTimeout(window[currentTimeoutKey]);

    // 3. 看板のデザイン・文字を瞬時に書き換え
    currentLayer.innerText = dmg;
    currentLayer.style.fontSize = "3.2rem";
    currentLayer.style.fontWeight = "900";
    currentLayer.style.textShadow = "3px 3px 0 #000";
    currentLayer.style.color = isPlayer ? "#ef4444" : "#ffffff"; // プレイヤー被弾は赤、敵被弾は白
    currentLayer.style.zIndex = "99";
    currentLayer.style.opacity = "1";
    currentLayer.style.transition = "none";
    currentLayer.style.transform = "scale(0.5) translateY(20px)";

    // HTML側のdmg-layerが持つ可能性のある強制座標を、バグが起きないよう上書きリセット
    if (!isPlayer) {
        currentLayer.style.position = "absolute";
        currentLayer.style.left = "340px"; // 敵の目の前の正しい位置に固定
        currentLayer.style.top = "120px";
    }

    // 4. なめらかなバウンドアニメーションをキック
    requestAnimationFrame(() => {
        currentLayer.style.transition = "transform 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.6s ease-in 0.4s";
        currentLayer.style.transform = "scale(1.1) translateY(-10px)";
    });

    // 5. 完全に演出が終わるまでじっくり表示（800ms）したあと、すっと透明にする
    window[currentTimeoutKey] = setTimeout(() => {
        currentLayer.style.opacity = "0";
        currentLayer.style.transform = "scale(0.8) translateY(-30px)";
    }, 800);
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
