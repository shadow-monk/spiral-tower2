// ================================================================
// 🔊 【audio.js 構造・機能メモ】
// ================================================================
// * 【３】サウンドアセットマッピング
//   - 効果音 (SE)：属性魔法、キック、未定義だった毒や斬撃など全12種を定義。
//   - 背景音楽 (BGM)：全6曲の戦闘プレイリストとエンディング曲を格納。
//   - 再生機器：SE用・BGM用の独立したグローバルプレイヤーの初期化。
// * 【４】オーディオ制御コアロジック
//   - toggleMute：消音開通。戦闘中の解除時は停止位置から再生をその場で再開。
//   - playSE：404エラーを自動回避するパス解析を挟み、音量0.5で再生。
//   - startBGM / stopBGM：タイトル、ED、ランダム戦闘曲の選曲とループ・音量制御。
// ================================================================

// ==========================================================================================================
// 🔊 3. サウンドアセットマッピング (過去コードGG・最高峰完全有線版・バグ修正完了版)
// ==========================================
const SOUND_FIRE = getAssetPath('se_clean', 'se_fire_hit.mp3'); 
const SOUND_ICE = getAssetPath('se_clean', 'se_ice_hit.mp3');   
const SOUND_HOLY = getAssetPath('se_clean', 'se_holy_hit.mp3'); 
const SOUND_FREEZE_DEAD = getAssetPath('se_clean', 'se_freeze_hit.mp3'); 

// 🎯【体当たり専用SE登録：絶対アドレス直書きを廃止し、正規関数へ有線直結！】
const SOUND_KICK = getAssetPath('se_clean', 'se_lightkick.mp3');

// 🛠️【大修復：battle.jsで参照される未定義SE変数をすべて開通定義！】
const SOUND_POISON = getAssetPath('se_clean', 'se_poison01.mp3'); 
const SOUND_EARTHQUAKE = getAssetPath('se_clean', 'se_earthquake.mp3'); 
const SOUND_SLASH = getAssetPath('se_clean', 'se_sword01.mp3'); 
const SOUND_WIND = getAssetPath('se_clean', 'se_wind01.mp3'); 
const SOUND_THUNDER = getAssetPath('se_clean', 'se_lightning01.mp3'); 
const SOUND_DRAGON_CRY = getAssetPath('se_clean', 'se_ptrano_voice.mp3'); 
const SOUND_TENTACLE = getAssetPath('se_clean', 'se_tentacls.mp3'); 

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

// ⚡ 音楽プレイヤーの固定の器を用意
if (!window._globalSePlayer)  window._globalSePlayer = new Audio();
if (!window._globalBgmPlayer) window._globalBgmPlayer = new Audio();

// ==========================================
// 🔊 4. オーディオ制御コアロジック
// ==========================================

function toggleMute() {
    isMuted = !isMuted;
    const btn = document.getElementById("btn-mute");
    if (btn) btn.innerText = isMuted ? "🔇 音声: OFF" : "🔊 音声: ON";
    
    if (isMuted) {
        if (window._globalBgmPlayer) window._globalBgmPlayer.pause();
        if (window._globalSePlayer) window._globalSePlayer.pause();
    } else {
        // 🌟【大開通】まだ戦闘前ならタイトル曲を、戦闘中なら一時停止していた曲をその場で再生再開！
        if (window.curIdx === -1) {
            startBGM("title");
        } else if (window._globalBgmPlayer) {
            window._globalBgmPlayer.play().catch(e => console.log("BGM resume blocked:", e));
        }
    }
}
       

function playSE(url) {
    if (isMuted) return; // ミュート中は絶対に鳴らさない
    try { 
        // 🌍 【環境追従型・音源404エラー完全自動回避の足し算有線】
        let targetUrl = url;
        if (typeof window.getCleanAssetPath === 'function' && url && !url.startsWith('http')) {
            targetUrl = window.getCleanAssetPath(url);
        }
        
        window._globalSePlayer.src = targetUrl; 
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
            // 🌍 BGM側にも安全のため自動パス解析ガードレールを100%足し算直結
            let targetUrl = url;
            if (typeof window.getCleanAssetPath === 'function' && url && !url.startsWith('http')) {
                targetUrl = window.getCleanAssetPath(url);
            }

            window._globalBgmPlayer.src = targetUrl;
            window._globalBgmPlayer.loop = (mode !== "grand_end"); // 過去コードGG仕様の美しいエンディング安全弁
            window._globalBgmPlayer.volume = 0.33; 
            window._globalBgmPlayer.play().catch(e => console.log("BGM deferred:", e)); 
        } catch(e){}
    }
}

function stopBGM() {
    try {
        if (window._globalBgmPlayer) window._globalBgmPlayer.pause();
    } catch(e){}
}