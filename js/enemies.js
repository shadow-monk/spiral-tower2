// 【０】目次
// 【１】👾 js/enemies.js（アセット環境追従型・敵画像）
// 【２】
// 【３】=
// 【４】版）
// ==
// ==========================================
// 【１】👾 js/enemies.js（アセット環境追従型・行動不能完全静止対応版）
// ==========================================
console.log("enemies.js: パス自動解析・行動不能完全静止対応データのロードを開始します。");

/**
 * 🌍 【環境追従型インテリジェント・パス解析ガードレール】
 * Live Server (127.0.0.1:5500 直結) と 本番環境 (spiral-tower2 フォルダ配下) の
 * パスのズレをアドレスバーのURLからリアルタイムに自動計算し、大量の 404 エラーを完全根絶します。
 */
window.getCleanAssetPath = function(rawPath) {
    if (!rawPath) return "";
    let clean = rawPath.replace(/^\.\//, '').replace(/^\//, '');
    clean = clean.replace(/^spiral-tower2\//, '');
    
    // 現在のブラウザのアドレスバーの階層を自動スキャン
    const pathName = window.location.pathname;
    if (pathName.includes('/spiral-tower2/')) {
        return window.location.origin + "/spiral-tower2/" + clean;
    }
    return window.location.origin + "/" + clean;
};

// 📂 1. 新倉庫アセットデータベース（丁寧な手書き手動配列形式を100%完全保護！）
const ANIMS_SLIME = [
    "assets/enemies/slime/monster_slime_01.png", "assets/enemies/slime/monster_slime_02.png",
    "assets/enemies/slime/monster_slime_03.png", "assets/enemies/slime/monster_slime_04.png",
    "assets/enemies/slime/monster_slime_05.png", "assets/enemies/slime/monster_slime_06.png",
    "assets/enemies/slime/monster_slime_07.png", "assets/enemies/slime/monster_slime_08.png",
    "assets/enemies/slime/monster_slime_09.png", "assets/enemies/slime/monster_slime_10.png",
    "assets/enemies/slime/monster_slime_11.png" 
];

const ANIMS_SPIDER = [
    "assets/enemies/spider/monster_spider_01.png", "assets/enemies/spider/monster_spider_02.png",
    "assets/enemies/spider/monster_spider_03.png", "assets/enemies/spider/monster_spider_04.png",
    "assets/enemies/spider/monster_spider_05.png", "assets/enemies/spider/monster_spider_06.png",
    "assets/enemies/spider/monster_spider_07.png", "assets/enemies/spider/monster_spider_08.png"
];

const ANIMS_SKELTON = [
    "assets/enemies/skeleton/monster_skeleton_01.png", "assets/enemies/skeleton/monster_skeleton_02.png",
    "assets/enemies/skeleton/monster_skeleton_03.png", "assets/enemies/skeleton/monster_skeleton_04.png",
    "assets/enemies/skeleton/monster_skeleton_05.png", "assets/enemies/skeleton/monster_skeleton_06.png",
    "assets/enemies/skeleton/monster_skeleton_07.png", "assets/enemies/skeleton/monster_skeleton_08.png",
    "assets/enemies/skeleton/monster_skeleton_09.png", "assets/enemies/skeleton/monster_skeleton_10.png"
];

const ANIMS_HARPY = [
    "assets/enemies/harpy/monster_harpy_01.png", "assets/enemies/harpy/monster_harpy_02.png",
    "assets/enemies/harpy/monster_harpy_03.png", "assets/enemies/harpy/monster_harpy_04.png",
    "assets/enemies/harpy/monster_harpy_05.png", "assets/enemies/harpy/monster_harpy_06.png",
    "assets/enemies/harpy/monster_harpy_07.png", "assets/enemies/harpy/monster_harpy_08.png"
];

const ANIMS_GOLEM = [
    "assets/enemies/golem/monster_golem_01.png", "assets/enemies/golem/monster_golem_02.png",
    "assets/enemies/golem/monster_golem_03.png", "assets/enemies/golem/monster_golem_04.png",
    "assets/enemies/golem/monster_golem_05.png", "assets/enemies/golem/monster_golem_06.png",
    "assets/enemies/golem/monster_golem_07.png", "assets/enemies/golem/monster_golem_08.png",
    "assets/enemies/golem/monster_golem_09.png", "assets/enemies/golem/monster_golem_10.png",
    "assets/enemies/golem/monster_golem_11.png"
];

const ANIMS_EYES = [
    "assets/enemies/eyes/monster_eyes_01.png", "assets/enemies/eyes/monster_eyes_02.png",
    "assets/enemies/eyes/monster_eyes_03.png", "assets/enemies/eyes/monster_eyes_04.png",
    "assets/enemies/eyes/monster_eyes_05.png", "assets/enemies/eyes/monster_eyes_06.png",
    "assets/enemies/eyes/monster_eyes_07.png", "assets/enemies/eyes/monster_eyes_08.png",
    "assets/enemies/eyes/monster_eyes_09.png", "assets/enemies/eyes/monster_eyes_10.png",
    "assets/enemies/eyes/monster_eyes_11.png", "assets/enemies/eyes/monster_eyes_12.png",
    "assets/enemies/eyes/monster_eyes_13.png"
];

const ANIMS_PHANTOM = [
    "assets/enemies/phantom/monster_phantom_01.png", "assets/enemies/phantom/monster_phantom_02.png",
    "assets/enemies/phantom/monster_phantom_03.png", "assets/enemies/phantom/monster_phantom_04.png",
    "assets/enemies/phantom/monster_phantom_05.png", "assets/enemies/phantom/monster_phantom_06.png",
    "assets/enemies/phantom/monster_phantom_07.png", "assets/enemies/phantom/monster_phantom_08.png",
    "assets/enemies/phantom/monster_phantom_09.png", "assets/enemies/phantom/monster_phantom_10.png",
    "assets/enemies/phantom/monster_phantom_11.png"
];

const ANIMS_DRAGON = [
    "assets/enemies/dragon/monster_dragon_01.png", "assets/enemies/dragon/monster_dragon_02.png",
    "assets/enemies/dragon/monster_dragon_03.png", "assets/enemies/dragon/monster_dragon_04.png",
    "assets/enemies/dragon/monster_dragon_05.png", "assets/enemies/dragon/monster_dragon_06.png",
    "assets/enemies/dragon/monster_dragon_07.png", "assets/enemies/dragon/monster_dragon_08.png"
];

const ANIMS_MAICONID = [
    "assets/enemies/maiconid/monster_maiconid_01.png", "assets/enemies/maiconid/monster_maiconid_02.png",
    "assets/enemies/maiconid/monster_maiconid_03.png", "assets/enemies/maiconid/monster_maiconid_04.png",
    "assets/enemies/maiconid/monster_maiconid_05.png", "assets/enemies/maiconid/monster_maiconid_06.png",
    "assets/enemies/maiconid/monster_maiconid_07.png", "assets/enemies/maiconid/monster_maiconid_08.png",
    "assets/enemies/maiconid/monster_maiconid_09.png", "assets/enemies/maiconid/monster_maiconid_10.png"
];

const ANIMS_GARGOIL = [
    "assets/enemies/gargoyle/monster_gargoyle_01.png", "assets/enemies/gargoyle/monster_gargoyle_02.png",
    "assets/enemies/gargoyle/monster_gargoyle_03.png", "assets/enemies/gargoyle/monster_gargoyle_04.png",
    "assets/enemies/gargoyle/monster_gargoyle_05.png", "assets/enemies/gargoyle/monster_gargoyle_06.png",
    "assets/enemies/gargoyle/monster_gargoyle_07.png", "assets/enemies/gargoyle/monster_gargoyle_08.png",
    "assets/enemies/gargoyle/monster_gargoyle_09.png", "assets/enemies/gargoyle/monster_gargoyle_10.png"
];

const ANIMS_LIVINGSWORD = [
    "assets/enemies/livingsword/monster_livingsword_01.png", "assets/enemies/livingsword/monster_livingsword_02.png",
    "assets/enemies/livingsword/monster_livingsword_03.png", "assets/enemies/livingsword/monster_livingsword_04.png",
    "assets/enemies/livingsword/monster_livingsword_05.png", "assets/enemies/livingsword/monster_livingsword_06.png",
    "assets/enemies/livingsword/monster_livingsword_07.png", "assets/enemies/livingsword/monster_livingsword_08.png",
    "assets/enemies/livingsword/monster_livingsword_09.png", "assets/enemies/livingsword/monster_livingsword_10.png",
    "assets/enemies/livingsword/monster_livingsword_11.png"
];

const ANIMS_WAREWOLF = [
    "assets/enemies/warewolf/monster_werewolf_01.png", "assets/enemies/warewolf/monster_werewolf_02.png",
    "assets/enemies/warewolf/monster_werewolf_03.png", "assets/enemies/warewolf/monster_werewolf_04.png",
    "assets/enemies/warewolf/monster_werewolf_05.png", "assets/enemies/warewolf/monster_werewolf_06.png",
    "assets/enemies/warewolf/monster_werewolf_07.png", "assets/enemies/warewolf/monster_werewolf_08.png",
    "assets/enemies/warewolf/monster_werewolf_09.png", "assets/enemies/warewolf/monster_werewolf_10.png",
    "assets/enemies/warewolf/monster_werewolf_11.png"
];

const ANIMS_BOOK = [
    "assets/enemies/book/monster_book_01.png", "assets/enemies/book/monster_book_02.png",
    "assets/enemies/book/monster_book_03.png", "assets/enemies/book/monster_book_04.png",
    "assets/enemies/book/monster_book_05.png", "assets/enemies/book/monster_book_06.png",
    "assets/enemies/book/monster_book_07.png", "assets/enemies/book/monster_book_08.png",
    "assets/enemies/book/monster_book_09.png", "assets/enemies/book/monster_book_10.png"
];
    const ANIMS_goblin = [
    "assets/enemies/goblin/monster_goblin_01.png", "assets/enemies/goblin/monster_goblin_02.png",
    "assets/enemies/goblin/monster_goblin_03.png", "assets/enemies/goblin/monster_goblin_04.png",

    
];

// 🔄 2. 全階層のキー名マッピングマスター（新モンス独立登録で画像ズレを100%全廃）
const MASTER_ANIM_MAP = { 
    slime: ANIMS_SLIME, spider: ANIMS_SPIDER, skelton: ANIMS_SKELTON, skeleton: ANIMS_SKELTON,
    harpy: ANIMS_HARPY, golem: ANIMS_GOLEM, gargoil: ANIMS_GARGOIL, gargoyle: ANIMS_GARGOIL,
    mush: ANIMS_MAICONID, maiconid: ANIMS_MAICONID, phantom: ANIMS_PHANTOM, eyes: ANIMS_EYES, dragon: ANIMS_DRAGON,
    livingsword: ANIMS_LIVINGSWORD, warewolf: ANIMS_WAREWOLF, book: ANIMS_BOOK, goblin: ANIMS_goblin,
   
};
window.MASTER_ANIM_MAP = MASTER_ANIM_MAP;

// ⚙️ 3. グローバル状態管理変数
let animeTimeout = null; 
let currentFrameIdx = 0;

// 🚀 4. モンスターアニメーション制御マシン
function startCustomAnimation(type) {
    stopSlimeAnimation();
    const graphicEl = document.getElementById("e-sprite-graphic"); 
    if (!graphicEl) return;
    
    function step() {
        // 🛠️ 【フリーズバグ完全根絶】：未定義エラーを噴いていた箇所を、一元化された window.STAGES へ綺麗にブリッジ配線！
        if (window.curIdx < 0 || !window.STAGES || !window.STAGES[window.curIdx]) return;
        let cType = window.STAGES[window.curIdx].type;
        let dynamicArr = MASTER_ANIM_MAP[cType] || ANIMS_SLIME;
        
        let fps = (cType === 'slime') ? 250 : (cType === 'phantom' ? 300 : (cType === 'dragon' ? 220 : 250));

        // ❄️💤⚡ 【ディレクター仕様：完全静止回路】行動不能中ならパラパラ画像の更新を強制遮断
        if (window.enemyFreezeTurns > 0 || window.enemywhiteTurns > 0 ||window.enemySleepTurns > 0 || window.enemyParalyzeTurns > 0) {
            animeTimeout = setTimeout(step, fps);
            return; 
        }

        currentFrameIdx = (currentFrameIdx + 1) % dynamicArr.length;
        
        // 🌍 自動的に解析されたエラーのない絶対URLを代入して404を根絶
        graphicEl.src = window.getCleanAssetPath(dynamicArr[currentFrameIdx]);
        
        animeTimeout = setTimeout(step, fps); 
    }
    step();
}

function stopSlimeAnimation() { 
    if (animeTimeout) { 
        clearTimeout(animeTimeout); 
        animeTimeout = null; 
    } 
}

console.log("enemies.js: パス自動解析・行動不能完全静止対応版が正常に起動しました。");


  // =============================================================================
    // 【１２】🔊 【完全バグ粉砕】新・大技SE音響個別管理回路 & 一元管理ID同期化
    // =============================================================================
window.executeEnemySpecial = function(data, dmg, logTxt, effScr, isSpecial) { // 👈これを書き足す！
 
        let isDoubleAbilityActive = (window.curIdx >= 10 && isSpecial);


  

    // =============================================================================
    // 【１３】👹 全15体型・絶対個別判定式モンスター大技配線
    // =============================================================================
    
    // --- ① スライム・ゼリー系統 ---
    if (data.name.includes("オーカー")) {
        window.enemyStatus.poisonTurns = 4; 
        let healAmount = Math.floor(window.eMaxHp * 0.40);
        window.eHp = Math.min(window.eMaxHp, window.eHp + healAmount); 
        logTxt += `🚨 ${data.name}の『分裂増殖ポイズンバブル』！左右に分裂して最大HPの40％【+${healAmount}P】を急速クローン再生！さらに足元が毒沼に変わり、味方は【猛毒】に侵された！`;
        if (effScr) effScr.className = "jelly-split-multiply";
        const eContainer = document.getElementById('e-sprite-container');
        if (eContainer) { eContainer.style.removeProperty("filter"); eContainer.className = "jelly-split-multiply"; }
        dmg = Math.floor(dmg * 0.5); 
    } 
else if (data.type === 'slime') {
        // 🟢 1. すれ違っていた偽物の配線を完全粉砕！主人公の防御を崩す本物の溶解フラグを着火！
        window.isPlayerCorroded = true; 
        window.playerStatus.corrodeTurns = 3; // 画面最上部の「💦 溶解」バッジ用
        
        let totalDmg = dmg*1.4; 
        logTxt += `💦 ${data.name}のドロッとした溶解液放射！【${totalDmg}】の強酸ダメージ！`;
        
        // 🟢 2. 【後半演出・画面融解100%大開通ガードレール】
        if (effScr) {
            effScr.className = "shoot-acid"; 
            
            // 【14】のガバタイマー（460ms）にクラス名（スイッチ）を途中で引っこ抜かれないよう、
            // 演出が完全に終わる0.9秒後（900ms）まで「shoot-acid」をガチッと力技でホールド固定します！
            const slimeHoldTimer = setInterval(() => {
                if (effScr.className !== "shoot-acid" && window.battleStepState === 'NONE') {
                    effScr.className = "shoot-acid";
                }
            }, 50);

            // 0.9秒経って、画面が綺麗に元に戻りきった最高のタイミングでタイマーを安全に自爆お掃除します
            setTimeout(() => {
                clearInterval(slimeHoldTimer);
                effScr.className = ""; 
            }, 900);
        }
        
        dmg = totalDmg;
    }
    
    // --- ② ゴブリン系統 ---
    else if (data.name.includes("ゴブリン")) {
        let totalDmg = dmg*0; 
        logTxt += `🔆 ${data.name}は逃げようとしたが、つまずいてよろけた。【${totalDmg}】のダメージ！なんとか体勢を立て直した！`;
       dmg = totalDmg;
    } 
    

    // --- ② クモ系統 ---
    else if (data.name.includes("ウィドウ")) {
        window.playerStatus.paralyzeTurns = 1; 
        window.pMp = Math.max(0, window.pMp - 20); 
        logTxt += `🔆 ${data.name}の『スパイダーニードル』！クモの巣を挟まず、2本の巨大な毒針が音速飛来！【${dmg}】の直撃を受け、次回【完全麻痺】＆魔力を【-20P】もぎ取られた！`;
        if (effScr) effScr.className = "spider-needle";
    } 
// --- ② クモ系統 ---
    else if (data.type === 'spider') {
        // 🟢 1. 主人公をガチでフリーズさせる本物の麻痺フラグを着火！
        window.isPlayerStunned = true; 
        
        // 🟢 2. 【バグ完全大粉砕パッチ】
        // 【14】の直下にあるお掃除回路が、この直後に自動で「-1」引き算してしまう仕様を逆手に取り、
        // 最初から【 2 】をカチ込んでおきます。これによって直後に1引かれて、計算が終わった瞬間に
        // ピッタリ「1」になり、画面上部に「🔆 麻痺:1T」のラベルが100%確実に確定点灯します！！
        window.playerStatus.paralyzeTurns = 2; 

        logTxt += `🔆 ${data.name}の不気味な粘着麻痺毒糸！【${dmg}】ダメ！(蜘蛛糸が動きを邪魔する)`;
        if (effScr) effScr.className = "spider-web-shoot";
    }
    
    // --- ③ スケルトン系統（★ここがバグの原因でした！確実に捕まえます！） ---
    else if (data.name.includes("ブラッディボーン")) {
        window.enemyStatus.poisonTurns = 3; 
        window.playerStatus.painTurns = 3; 
        logTxt += `💥 ${data.name}の『毒血縛り』！口から吐き出されたドス赤黒い毒血ブレスを浴びた！【${dmg}】ダメージとともに【猛毒】に侵され、さらに3ターンの間【一切のHP回復が完全無効(0回復)】の呪縛にかかった！`;
        if (effScr) effScr.className = "blood-poison-breath";
    } 

// --- ③ スケルトン系統 ---
    else if (data.type === 'skeleton' || data.type === 'skelton') {
        // 🛡️ 本物の防御スイッチをON！
        window.isEnemyShieldActive = true; 
        window.enemyStatus.shieldTurns = 1; 
        let totalDmg = dmg*0; 
        logTxt += `🛡️ ${data.name}は魔力の骨盾をガチッと構えた！次のプレイヤーからの被ダメージを75%大幅カット！`;
        if (effScr) effScr.className = "anim-skelton-shield";
dmg = totalDmg;
        // 🟢【技の部屋限定・完全自己完結2回カウント消滅パッチ】
        const board = document.getElementById('sq-board') || document.body;
        if (board) {
            let clickCount = 0; // 💡 最初に「0回」と数えるカウンターをその場で用意！

            board.addEventListener('click', function cleanupShield() {
                clickCount++; // 画面がクリックされるたびに1ずつ足し算（カウント）する

                // 🎯【ここが2回目の行動タイミング】
                // 1回目（魔法を撃つためのボタン押し）はスルーし、
                // 2回目（魔法が直撃して「▶」が進む瞬間）にガチッと発動します！
                if (clickCount >= 2) {
                    // ダメージ計算をガッチリ守り抜いたので、ここで盾を引き算（消去）する！
                    window.isEnemyShieldActive = false;
                    window.enemyStatus.shieldTurns = 0;
                    window.updateStatusBadgesUI(); // 画面最上部の「🛡️ 防御盾」ラベルもハキハキ消灯！
                    
                    // 用が済んだので、このイベントリスナー（見張り番）自体を完全に消滅させる！
                    board.removeEventListener('click', cleanupShield);
                }
            });
        }
    }
    
    // --- ④ ハーピー系統 ---
// --- ④ ハーピー系統 ---
    else if (data.name.includes("バード") || data.name.includes("レディ")) {
        let tornadoDmg = Math.floor(dmg * 1.5); 
        logTxt += `🌪️ ${data.name}の『ウィングトルネード』が炸裂！！巨大な暴風に包まれ、空高く巻き上げられ、きりもみ回転で叩き落とされた！！【${tornadoDmg}】の致命的大ダメージ！！`;
        
        // 🎯 バードレディ専用の服を着せる！
        if (effScr) effScr.className = "wing-tornado-bg"; 
        
        // ⚡ 【共通コード防衛ガードレール】
        // 共通タイマー（1.1秒）が途中で服を脱がしにくるのをインターセプト（阻止）し、
        // 2.7秒経つまで「wing-tornado-bg」のクラス名をガチッとホールドし続けます！
        const ladyHoldTimer = setInterval(() => {
            if (effScr && effScr.className !== "wing-tornado-bg" && window.battleStepState === 'NONE') {
                effScr.className = "wing-tornado-bg";
            }
        }, 50);

        // 🎬 2.7秒経って、真っ逆さまの落下バウンドまで完全に見届けたら、タイマーを爆破してお掃除！
        setTimeout(() => {
            clearInterval(ladyHoldTimer);
            if (effScr) effScr.className = ""; 
        }, 1500);

        dmg = tornadoDmg;
    }
      else if (data.type === 'harpy') {
        // 🟢 修正後：主人公の魔力を強制デバフ！次ターンの攻撃威力を【3割引き算（0.7倍）】にロック！
        window.mana = 0.7; 
                let totalDmg = dmg + 8; 
        logTxt += `🌀 ${data.name}の耳を裂く金切り声！【${totalDmg}】の神経ダメージ！超音波によって攻撃力減衰！`;
        if (effScr) effScr.className = "anim-harpy-storm"; 
        dmg = totalDmg;
    }

// --- ⑤ ゴーレム系統 ---
    else if (data.type === 'golem') {
        let tackleDmg = Math.floor(dmg * 2.0); 

        // 🎬 【大迫力・超弩級ゴーレム体当たり完全大開通】
        const eContainer = document.getElementById('e-sprite-container');
        if (eContainer) {
            // 🚀 1. プレイヤーの目前（-320px）まで1.7倍に巨大化しながら0.12秒の音速で大突進！！
            eContainer.style.transition = "transform 0.12s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
            eContainer.style.transform = "translateX(-320px) scale(1.7) rotate(-10deg)";

            // 💥 2. 激突の瞬間（0.12秒後＝120ミリ秒後）にスクエアボードを物理的に激震させる！
            setTimeout(() => {
                const board = document.getElementById('sq-board');
                if (board) {
                    board.style.transition = "none";
                    board.style.transform = "translate(-10px, 8px) scale(1.02)";
                    
                    // 地震の余震を表現して一瞬で元の位置に戻すお掃除
                    setTimeout(() => { 
                        board.style.transition = "transform 0.15s ease-out";
                        board.style.transform = "translate(0, 0) scale(1)"; 
                    }, 80);
                }
            }, 120);

            // 🧼 3. 激突して大ダメージを与えた後、フワッと元の定位置（0）へ無事に帰還させる
            setTimeout(() => {
                eContainer.style.transition = "transform 0.3s ease-in-out";
                eContainer.style.transform = "translateX(0) scale(1) rotate(0deg)";
            }, 220); // 突進と衝撃波が終わった絶妙なタイミングで帰還
        }

        logTxt += `💥 ${data.name}の『チャージタックル』！！！重量感のある巨体が激しく激突！激突の衝撃で【${tackleDmg}】の圧倒的ダメージを喰らった！！！`;
        if (effScr) effScr.className = "stone-tackle-impact"; 
        dmg = tackleDmg;
    }

// --- ⑥ ガルゴイル系統 ---
    else if (data.type === 'gargoyle' || data.type === 'gargoil') {
        // 🟢 1. 完全に千切れていた「本物の攻撃力2倍フラグ」をここでガチッとONにする！
        window.enemyMana = 2.0; 
        window.enemyStatus.chargeTurns = 1; 
        
        logTxt += `⚡ ${data.name}はルーン式魔法陣を展開！魔力を吸収し次回の攻撃力を強化！`;
        if (effScr) effScr.className = "anim-gargoil-charge";
let totalDmg = dmg*0; 
dmg = totalDmg;
        // 🟢 2. 【技の部屋限定・完全自己完結2回カウント強化消滅パッチ】
        const board = document.getElementById('sq-board') || document.body;
        if (board) {
            let clickCount = 0; // カウンターを用意

            board.addEventListener('click', function cleanupCharge() {
                clickCount++;

                // 🎯【ここが2回目の行動タイミング＝ガルゴイルが次のターンに突撃し終わった瞬間】
                if (clickCount >= 2) {
                    // 2倍ダメージを味方にブチ込み終わったので、ここで強化バッジを引き算（消去）する！
                    window.enemyStatus.chargeTurns = 0;
                    window.updateStatusBadgesUI(); // 画面最上部の「⚡ 強化」ラベルをハキハキ消灯！
                    
                    // 用が済んだので、この見張り番自体を完全に消滅させる
                    board.removeEventListener('click', cleanupCharge);
                }
            });
        }
    }
// --- ⑦ マイコニド（キノコ）系統 ---
    else if (data.type === 'maiconid' || data.type === 'mush' || data.name.includes("マイコニド")) {
        // 🟢 1. 【魔力集中無力化パッチ】
        // プレイヤーが溜めていた魔力集中倍率（2.5倍など）を、胞子のガスで弱体化！
        window.mana = 0.3; 
        
        // 🟢 2. 【ダメージ上乗せ】
        // 基本の攻撃力に、毒胞子の激痛ダメージとして「+15」をその場でダイレクトにプラス！
        let totalDmg = dmg + 15; 

        logTxt += `🍄 ${data.name}の『幻惑胞子』！皮膚がただれ吐き気がする！追加の毒素によって【${totalDmg}】の激痛ダメージ！さらに体にまとわりつく胞子が、魔力をみだす！`;
        if (effScr) effScr.className = "anim-myconid-spore";
        
        // 最終的なダメージを確定
        dmg = totalDmg;
    }
    
    // --- ⑧ ファントム系統 ---
    else if (data.type === 'phantom') {
             let totalDmg = dmg + 15; window.eHp = Math.min(window.eMaxHp, window.eHp + 15); 
        logTxt += `🔒 ${data.name}のエナジードレイン！【${totalDmg}】ダメ！悪霊の触手が命を【15P】吸い取る！`;
        if (effScr) effScr.className = "anim-phantom-curse"; dmg = totalDmg;
    }
    
// --- ⑨ エビルアイ系統 ---
    else if (data.type === 'eyes') {
        // 🟢【マナジャミングパッチ】
        // 邪眼の光を浴びた瞬間、次ターンの魔法威力を強制的に【0.1倍（10分の1）】に激減ロック！
        // 通常攻撃を選んでも、アイテムを選んでも、あなたの次の1行動が終わった瞬間に自動でお掃除（1.0倍に復帰）されます！
        window.mana = 0.35; 

        logTxt += `🔕 ${data.name}の魔力を乱す邪眼光線！【${dmg}】ダメ！不気味な光線が脳神経を侵食し、魔法がうまく機能しない`;
        if (effScr) effScr.className = "anim-evileye-mute";
    }
    
    // --- ⑩ その他固有種（リビングソード・魔導書・ワーウルフ） ---
    else if (data.type === 'livingsword') {
        logTxt += `⚔️ ${data.name}の『断頭台のギロチンスラッシュ』！【${Math.floor(dmg * 1.9)}】の処刑ダメージ！！`; dmg = Math.floor(dmg * 1.9);
    }
    else if (data.type === 'book') {
        window.playerStatus.doomTurns = 3; 
        logTxt += `⬛ ${data.name}の『禁忌のデスノート暗黒朗読』！死のカウントダウンが戦場に木霊する！【${dmg}】ダメージ！`;
    }
    else if (data.type === 'warewolf') {
        window.enemyStatus.chargeTurns = 1; 
      let totalDmg = Math.floor(dmg * 1.9); 
        logTxt += `🐺 ${data.name}は咆哮した。連続攻撃！牙【${Math.floor(dmg * 1.3)}】!爪【${Math.floor(dmg * 1.2)}】回し蹴り【${Math.floor(dmg * 1.4)}】！ 合計【${totalDmg}】の連続ダメージ)`; 
          dmg = totalDmg;
    }
    if  (data.name.includes("カリスドラゴン")) { 
        window.playerStatus.BurnTurns = 3; 
        let totalDmg = Math.floor(dmg * 1.5); 
        logTxt = `ダークフレア！灼熱の暗黒粒子が細胞を焼き焦がす！【${totalDmg}】の暗黒エネルギーダメージ！！`; 
   if (effScr) effScr.className = "anim-dragon-breath";
dmg = totalDmg;
    }

    // --- 🏰 ボス専用・究極特殊防壁の一元管理同期 ---
    if (data.name.includes("アイアン")) {
        window.enemyStatus.ironShieldTurns = 1; 
        logTxt = `🧱 アイアンゴーレムが『絶対無敵の鉄血防御形態』を展開！次のターンプレイヤーからの全魔法・被ダメを「1ポイント」に固定制限！`; dmg = 0; 
    }
    if  (data.name.includes("ブルードラゴン")) { 
        window.playerStatus.paralyzeTurns = 1; 
        logTxt = `⛈️ ブルードラゴンの壊滅的超高圧『電撃ブレス』が炸裂！！【${dmg}】の天災ダメージを受け次回強制【完全麻痺スタン】！！`; 
    }


    return { dmg: dmg, logTxt: logTxt }; // 👈これを書き足す！
};