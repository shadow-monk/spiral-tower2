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
window.currentAudioBgm = null;

// ==========================================
// 🔊 4. オーディオシステム制御ロジック
// ==========================================
function triggerFirstAudio() { 
    // ユーザーがボタンをクリックしたこの瞬間にBGMを開始することで、ブラウザの音制限を完全回避
    startBGM("title"); 
}

// ⚡ 【メモリリーク対策】音楽・効果音プレイヤーの「固定の器」を最上部に開通（オブジェクトの使い回し）
if (!window._globalSePlayer)  window._globalSePlayer = new Audio();
if (!window._globalBgmPlayer) window._globalBgmPlayer = new Audio();

function playSE(url) {
    if (isMuted) return;
    try { 
        // 毎回新しく作らず、用意された器の中身(src)だけを入れ替えることでゴミデータを出さない
        window._globalSePlayer.src = url; 
        window._globalSePlayer.volume = 0.5; 
        window._globalSePlayer.play().catch(e => console.log("SE blocked/deferred:", e)); 
    } catch(e){}
}

function startBGM(mode) {
    stopBGM(); 
    if (isMuted) return;
    
    let url = "";
    if (mode === "title") url = BGM_BATTLE_PLAYLIST[4]; 
    else if (mode === "grand_end") url = BGM_PEACE_GRAND_END;   
    else if (mode === "battle") {
        const randIdx = Math.floor(Math.random() * BGM_BATTLE_PLAYLIST.length);
        url = BGM_BATTLE_PLAYLIST[randIdx];
    }
    
    if (url) {
        try { 
            // BGMプレイヤーの器も破棄せず再利用
            window._globalBgmPlayer.src = url;
            window._globalBgmPlayer.loop = (mode !== "grand_end"); 
            window._globalBgmPlayer.volume = 0.33; 
            window._globalBgmPlayer.play().catch(e => console.log("BGM blocked/deferred:", e)); 
        } catch(e){}
    }
}

function stopBGM() { 
    try { 
        window._globalBgmPlayer.pause(); 
    } catch(e){}
}
