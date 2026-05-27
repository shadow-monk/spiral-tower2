// ==========================================
// 📺 1. 画面表示切り替え・UI制御ロジック（シンプル超軽量版）
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
 * 🎯【超シンプル・ダメージポップアップ有線回路】
 * 外部DOMをいじらず、受けたキャラクターの画像枠（コンテナ）の真上に
 * 専用の使い回し看板をピンポイント配置し、点灯・消灯させるバグゼロ設計
 */
function createDmgPop(dmg, isPlayer) {
    // 1. 各キャラクターを包むHTML側の「本物のコンテナ箱」を直撃取得
    const pContainer = document.getElementById("p-sprite-container");
    const eContainer = document.getElementById("e-sprite-container");
    
    // 2. 主人公被弾か敵被弾かによって、処理する親コンテナを完全に分離
    // ※battle.jsの定義：isPlayer=true(主人公被弾) / isPlayer=false(敵被弾)
    const targetContainer = isPlayer ? pContainer : eContainer;
    const timeoutKey = isPlayer ? "_pPopTimeout" : "_ePopTimeout";
    const layerKey = isPlayer ? "_pDmgLabel" : "_eDmgLabel";

    if (!targetContainer) return;

    // 3. そのキャラクター専用の文字入れ看板がコンテナ内に無ければ、初回のみ1個だけ固定設置（使い回し型）
    if (!window[layerKey]) {
        window[layerKey] = document.createElement("div");
        window[layerKey].style.position = "absolute";
        window[layerKey].style.fontWeight = "900";
        window[layerKey].style.textShadow = "3px 3px 0 #000";
        window[layerKey].style.zIndex = "999";
        window[layerKey].style.pointerEvents = "none";
        
        // 複雑なトランスフォーム移動を廃止し、キャラクターの頭上中央にシンプル配置
        window[layerKey].style.width = "100%";
        window[layerKey].style.textAlign = "center";
        window[layerKey].style.top = isPlayer ? "-30px" : "-10px"; // 主人公と敵のサイズ感に合わせた高さ調整
        
        targetContainer.appendChild(window[layerKey]);
    }

    const currentLayer = window[layerKey];

    // 4. 連打やカウンター時のタイマー衝突を防ぐため、そのキャラクターの古い消去タイマーを即座にリセット
    if (window[timeoutKey]) clearTimeout(window[timeoutKey]);

    // 5. 看板に数字と色を流し込み、一瞬で最優先点灯
    currentLayer.innerText = isPlayer ? `-${dmg}` : dmg; // 主人公は引き算表記、敵はそのまま表記
    currentLayer.style.fontSize = isPlayer ? "3.2rem" : "3.6rem"; // 敵側をやや大きくして視認性アップ
    currentLayer.style.color = isPlayer ? "#ef4444" : "#ffffff"; // 主人公は赤、敵は白
    currentLayer.style.opacity = "1";
    currentLayer.style.display = "block";

    // 6. じっくり800ミリ秒（0.8秒）表示させたあと、パッと消灯するタイマーをセット
    window[timeoutKey] = setTimeout(() => {
        currentLayer.style.opacity = "0";
        currentLayer.style.display = "none";
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
