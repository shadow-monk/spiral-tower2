// ==========================================
// 📺 1. 画面表示切り替え・UI制御ロジック（白フリーズ・不透明度完全クリーンアップ版）
// ==========================================
console.log("%c🎨 [UI SYSTEMS] Ver 7.60: コマンドの真っ白遮断バグを完全粉砕し、23呪文＆20アイテムの所持数配線を全開通しました。", "color: #00ffff; font-weight: bold;");

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
 * 🎯【透過式・ダメージポップアップ回路】
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
        window[layerKey].style.pointerEvents = "none"; // クリック透過
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
 * 🔮 呪文ボタンエリアを展開（A面を隠し、B面スクロール呪文をblockでハキハキ点灯！）
 */
function openMagicBag() {
    if (window.isBusy || pHp <= 0 || eHp <= 0) return;

    const mainPanel = document.getElementById('panel-main-mode');
    const magicPanel = document.getElementById('panel-magic-mode');
    
    if (mainPanel) mainPanel.style.display = 'none';
    if (magicPanel) magicPanel.style.display = 'block';
}

/**
 * ↩️ 行動選択に戻る
 */
function closeMagicBag() {
    const mainPanel = document.getElementById('panel-main-mode');
    const magicPanel = document.getElementById('panel-magic-mode');
    
    if (magicPanel) magicPanel.style.display = 'none';
    if (mainPanel) mainPanel.style.display = 'block';
}

// ==========================================
// 🎒 3. 大容量アイテムバッグUI・全開通制御ロジック
// ==========================================

/**
 * 🎒 最強賢者モード（全20アイテム）のテキストに所持数(9)をハキハキ同期させて開く関数
 */
function openItemBag() { 
    if (window.isBusy || pHp <= 0 || eHp <= 0) return;

    // 最新のアイテムバッグに並ぶ、全20スロットの文字と個数を1撃で完全連動！
    // 賢者モードテストのため、未定義なら自動で9個（無限）としてハキハキ印字します
    const items = [
        { id: 'potion', name: '🧪 回復薬' }, { id: 'amulet', name: '🧿 お守り' },
        { id: 'elix', name: '🧪 エリクサー' }, { id: 'bomb', name: '💣 魔法の爆弾' },
        { id: 'cure', name: '🧪 万能薬' }, { id: 'hour', name: '⏳ 時の砂時計' },
        { id: 'whet', name: '🗡️ 研ぎ石' }, { id: 'mirr', name: '🪞 鏡の破片' },
        { id: 'mana', name: '🧪 魔力の雫' }, { id: 'scro', name: '📜 賢者の巻物' },
        { id: 'smok', name: '🌀 煙幕弾' }, { id: 'wing', name: '🪶 ハピの羽根' },
        { id: 'web', name: '🕸️ 蜘蛛の糸' }, { id: 'bone', name: '🦴 骸骨の骨' },
        { id: 'ston', name: '🪨 ゴレムの石' }, { id: 'cand', name: '🕯️ 霊体の蝋燭' },
        { id: 'jewe', name: '💎 目玉の宝石' }, { id: 'hone', name: '🍯 黄金の蜜' },
        { id: 'spor', name: '🍄 幻覚胞子' }, { id: 'scal', name: '🐉 竜の逆鱗' }
    ];

    items.forEach(item => {
        const el = document.getElementById(`item-slot-${item.id}`);
        if (el) {
            // グローバルインベントリにデータがあればそれを、無ければ初期テスト用に(9)を自動同期
            let count = (window.itemInventory && window.itemInventory[item.id] !== undefined) 
                        ? window.itemInventory[item.id] : 9;
            el.innerText = `${item.name} (${count})`;
        }
    });

    const mainPanel = document.getElementById('panel-main-mode');
    const bagPanel = document.getElementById('item-bag-panel');
    
    if (mainPanel) mainPanel.style.display = 'none';
    if (bagPanel) bagPanel.style.display = 'flex'; 
}

/**
 * ✕ アイテムバッグを閉じて行動選択に戻る
 */
function closeItemBag() { 
    const mainPanel = document.getElementById('panel-main-mode');
    const bagPanel = document.getElementById('item-bag-panel');
    
    if (bagPanel) bagPanel.style.display = 'none'; 
    if (mainPanel) mainPanel.style.display = 'block'; 
}
