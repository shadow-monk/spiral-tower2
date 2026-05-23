https://github.com/shadow-monk/spiral-tower/tree/main/js
// ==========================================
// 🔊 3. サウンドアセットマッピング（実名完全直結）
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

// グローバル状態管理変数（コアシステム用）
let isMuted = false;
let currentAudioBgm = null;

// ==========================================
// 🔊 4. オーディオシステム制御ロジック
// ==========================================
function triggerFirstAudio() { 
    startBGM("title"); 
}

function playSE(url) {
    if (isMuted) return;
    try { 
        const se = new Audio(url); 
        se.volume = 0.5; 
        se.play().catch(e => console.log("SE deferred:", e)); 
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
            currentAudioBgm = new Audio(url); 
            currentAudioBgm.loop = (mode !== "grand_end"); 
            currentAudioBgm.volume = 0.33; 
            currentAudioBgm.play().catch(e=>console.log("BGM deferred:", e)); 
        } catch(e){}
    }
}

function stopBGM() { 
    if (currentAudioBgm) { 
        try { currentAudioBgm.pause(); currentAudioBgm = null; } catch(e){} 
    } 
}

function toggleMute() { 
    isMuted = !isMuted; 
    const muteBtn = document.getElementById('btn-mute');
    if (muteBtn) muteBtn.innerText = isMuted ? "🔇 OFF" : "🔊 ON"; 
    
    if (isMuted) {
        stopBGM(); 
    } else {
        const isBattleScreen = (document.getElementById('scr-battle') && document.getElementById('scr-battle').style.display === 'block');
        startBGM(isBattleScreen ? 'battle' : 'title');
    }
}
