// ==========================================
// 🔊 3. サウンドアセットマッピング
// ==========================================
const SOUND_FIRE = getAssetPath('se_clean', 'se_fire_hit.mp3'); 
const SOUND_ICE = getAssetPath('se_clean', 'se_ice_hit.mp3');   
const SOUND_HOLY = getAssetPath('se_clean', 'se_holy_hit.mp3'); 
const SOUND_FREEZE_DEAD = getAssetPath('se_clean', 'se_freeze_hit.mp3'); 

const BGM_BATTLE_PLAYLIST = [
    getAssetPath('bgm_clean', 'bgm_battle_arch03.mp3'),
    getAssetPath('bgm_clean', 'bgm_battle_piano11.mp3'),
    getAssetPath('bgm_clean', 'bgm_battle_run15.mp3'),
    getAssetPath('bgm_clean', 'bgm_battle_senritsu04.mp3'),
    getAssetPath('bgm_clean', 'bgm_battle_tactics12.mp3'),
    getAssetPath('bgm_clean', 'bgm_explore_dark09.mp3')
];
const BGM_PEACE_GRAND_END = getAssetPath('bgm_clean', 'bgm_peace_fantasy14.mp3');

window.isMuted = false;

// ⚡ 【メモリリーク対策】音楽プレイヤーの固定の器を最上部に用意（再利用型）
if (!window._globalSePlayer)  window._globalSePlayer = new Audio();
if (!window._globalBgmPlayer) window._globalBgmPlayer = new Audio();

// ==========================================
// 🔊 4. オーディオ制御コアロジック
// ==========================================

/**
 * ミュート（音声ON/OFF）を切り替えるグローバル有線回路
 * 他のJSファイルを一切いじらずにBGMとSEを完全コントロールします
 */
function toggleMute() {
    isMuted = !isMuted;
    
    const btn = document.getElementById("btn-mute");
    if (btn) {
        btn.innerText = isMuted ? "🔇 音声: OFF" : "🔊 音声: ON";
    }
    
    if (isMuted) {
        // 🔒【ミュートバグ根絶コア】
        // 他のファイルから流れている「すべての音源」をaudio.js側から強制的にねじ伏せ、無音化します。
        if (window._globalBgmPlayer) {
            window._globalBgmPlayer.pause();
        }
        if (window._globalSePlayer) {
            window._globalSePlayer.pause();
        }
    } else {
        // ミュート解除時はタイトル画面であればBGMを安全に復帰
        if (window.curIdx === -1) {
            startBGM("title");
        }
    }
}

function playSE(url) {
    if (isMuted) return; // ミュート中は絶対に鳴らさない
    try { 
        window._globalSePlayer.src = url; 
        window._globalSePlayer.volume = 0.5; 
        window._globalSePlayer.play().catch(e => console.log("SE blocked/deferred:", e)); 
    } catch(e){}
}

function startBGM(mode) {
    stopBGM(); 
    if (isMuted) return; // ミュート中は絶対に新しい再生をキックしない
    
    let url = "";
    if (mode === "title") url = BGM_BATTLE_PLAYLIST[4]; 
    else if (mode === "grand_end") url = BGM_PEACE_GRAND_END;   
    else if (mode === "battle") {
        const randIdx = Math.floor(Math.random() * BGM_BATTLE_PLAYLIST.length);
        url = BGM_BATTLE_PLAYLIST[randIdx];
    }
    
    if (url) {
        try { 
            window._globalBgmPlayer.src = url;
            window._globalBgmPlayer.loop = (mode !== "grand_end"); 
            window._globalBgmPlayer.volume = 0.33; 
            window._globalBgmPlayer.play().catch(e => console.log("BGM blocked/deferred:", e)); 
        } catch(e){}
    }
}

function stopBGM() { 
    try { 
        if (window._globalBgmPlayer) {
            window._globalBgmPlayer.pause(); 
        }
    } catch(e){}
}
