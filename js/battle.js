<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<title>スパイラルタワー - 三大属性オリジナルエフェクト完全解放版 -</title>
<style>
/* 演出用各種CSSアニメーション */
@keyframes floatP { 0% { transform: translateY(0px) scaleY(1); } 100% { transform: translateY(-12px) scaleY(1.02); } }
@keyframes floatE { 0% { transform: translateY(0px) scale(1); } 100% { transform: translateY(-10px) scale(1.03); } }
@keyframes pulse { 0% { transform: scale(1); opacity: 0.9; } 100% { transform: scale(1.05); opacity: 1; } }
@keyframes txtAlert { 0% { opacity: 0.3; } 100% { opacity: 1; } }
@keyframes crisisAlert { 0% { box-shadow: inset 0 0 10px rgba(239,68,68,0); } 50% { box-shadow: inset 0 0 35px rgba(239,68,68,0.8); } 100% { box-shadow: inset 0 0 10px rgba(239,68,68,0); } }
@keyframes enemyAssault { 0% { transform: translateX(0); } 20% { transform: translateX(30px); filter: drop-shadow(-20px 0 0 rgba(244,63,94,0.4)); } 45% { transform: translateX(-160px) scale(1.1); } 70% { transform: translateX(15px); } 100% { transform: translateX(0); } }

/* 🔥 ファイア専用：授かりし画像アセット用アニメーション */
@keyframes fireFly { 0% { transform: translate(-140px,40px) scale(0.4) rotate(0deg); opacity:0; } 15% { opacity:1; } 100% { transform: translate(110px,-20px) rotate(720deg) scale(1.4); opacity:0; } }
@keyframes fireBoomBlock { 0% { transform: scale(0) rotate(0deg); opacity:0; } 50% { transform: scale(1.8) rotate(45deg); opacity:1; filter: drop-shadow(0 0 20px #ef4444); } 100% { transform: scale(1.5) rotate(90deg); opacity:0; } }

/* ❄️ アイス専用：授かりし画像アセット用アニメーション */
@keyframes iceFly { 0% { transform: translate(-140px,20px) scale(0.3); opacity:0; } 15% { opacity:1; } 100% { transform: translate(110px,-15px) scale(1.2); opacity:0; } }
@keyframes iceSpike { 0% { transform: scale(0) translateY(-80px); opacity:0; } 35% { transform: scale(1.6) translateY(10px); opacity:1; filter: drop-shadow(0 0 20px #38bdf8); } 100% { transform: scale(1.3) translateY(0px); opacity:0; } }

/* ✨ ホーリー専用：授かりし画像アセット用アニメーション */
@keyframes holyGroupFly { 0% { transform: translate(-140px, 40px) scale(0.3) rotate(0deg); opacity: 0; } 20% { opacity: 1; } 100% { transform: translate(110px, -20px) scale(1.1) rotate(720deg); opacity: 0.2; } }
@keyframes grandCrossBoom { 0% { transform: translate(-50%, -50%) scale(0) rotate(0deg); opacity: 0; filter: brightness(2); } 40% { transform: translate(-50%, -50%) scale(1.6) rotate(90deg); opacity: 1; filter: brightness(1.2) drop-shadow(0 0 25px #facc15); } 100% { transform: translate(-50%, -50%) scale(2.0) rotate(180deg); opacity: 0; filter: brightness(1) blur(3px); } }

@style-pulseBoom { 0% { transform: translate(0,0) scale(1); opacity:1; } 100% { transform: translate(var(--tx), var(--ty)) scale(0.1); opacity:0; } }
@keyframes pulseBoom { 0% { transform: translate(0,0) scale(1); opacity:1; } 100% { transform: translate(var(--tx), var(--ty)) scale(0.1); opacity:0; } }

/* 🟢 ヘドロスライム激怒時の紅蓮オーラ効果 */
@keyframes angryAura { 0% { filter: drop-shadow(0 0 15px #ef4444) drop-shadow(0 0 5px #ff0000); } 100% { filter: drop-shadow(0 0 35px #f43f5e) brightness(1.25); } }

/* ホログラムハニカムシールド展開エフェクト */
@keyframes shieldDeploy {
  0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; filter: brightness(2); }
  30% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.9; }
  50% { transform: translate(-50%, -50%) scale(1.0); opacity: 0.8; }
  80% { transform: translate(-50%, -50%) scale(1.0); opacity: 0.8; }
  100% { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
}
</style>
</head>
<body style="margin:0; padding:0; background-color:#0f172a;">

<div id="sq-master-wrapper" style="position:relative; background-color:#0f172a; padding:20px 10px; display:flex; flex-direction:column; justify-content:center; align-items:center; min-height:1150px; width:100%; box-sizing:border-box; overflow:hidden;">
    <canvas id="brick-canvas" style="position:absolute; top:0; left:0; width:100%; height:100%; z-index:1; pointer-events:none;"></canvas>

    <div id="sq-container" style="position:relative; z-index:2; width:100%; max-width:640px; box-sizing:border-box; font-family:'Helvetica Neue',Arial,sans-serif; margin:0 auto;">
        <div style="background-color:#ffffff; border:6px solid #4f46e5; border-radius:30px; padding:25px 15px; text-align:center; box-shadow:0 40px 80px rgba(0,0,0,0.6); overflow:hidden; position:relative;" id="sq-board">
            
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; padding-bottom:10px; border-bottom:2px solid #e2e8f0;">
                <div id="floor-indicator" style="font-size:1.2rem; font-weight:900; color:#4f46e5; background:#eeebff; padding:4px 16px; border-radius:99px; visibility:hidden;">1階</div>
                <button onclick="toggleMute()" id="btn-mute" style="background:#1e293b; color:white; border:none; border-radius:8px; padding:8px 16px; font-size:1rem; font-weight:800; cursor:pointer;">🔊 音声: ON</button>
            </div>

            <div id="scr-start" style="display:block; padding:20px 5px;">
                <div style="color:#4f46e5; font-size:1.4rem; font-weight:800; letter-spacing:0.4em; margin-bottom:10px;">LEGENDARY RPG</div>
                <h1 style="color:#0f172a; font-size:4rem; margin:0 0 20px 0; font-weight:900; letter-spacing:-0.05em; line-height:1.1;">スパイラルタワー</h1>
                <div style="height:8px; background:linear-gradient(90deg,#4f46e5,#f43f5e); width:200px; margin:0 auto 25px auto; border-radius:99px;"></div>
                <div style="background:#f8fafc; border-radius:20px; padding:20px; border-left:10px solid #4f46e5; text-align:left; margin-bottom:20px;">
                    <p style="color:#1e293b; font-size:1.2rem; line-height:1.7; font-weight:700; margin:0;">
                        【三大アセット全解放】あなたが発掘したオリジナルアセット「fire.png」「ICE.png」「cross.png」群を全コマンドに完全実装！敵画像不具合の解消、BGMの完全復帰、そして生物的ランダム蠢きアニメーションを搭載した究極の完成版。
                    </p>
                </div>
                <button onclick="nextStage()" style="background:linear-gradient(135deg,#4f46e5,#6366f1); color:white; border:none; border-radius:16px; padding:25px 45px; font-size:1.8rem; font-weight:900; cursor:pointer; width:100%; box-shadow:0 10px 25px rgba(79,70,229,0.3);">迷宮へ侵入する</button>
            </div>

            <div id="scr-intro" style="display:none; padding:20px 10px;">
                <div id="intro-ch-num" style="color:#f43f5e; font-size:1.5rem; font-weight:900; margin-bottom:10px;">FLOOR 01</div>
                <h2 id="intro-ch-title" style="color:#0f172a; font-size:2.8rem; margin-bottom:30px; font-weight:900;">章のタイトル</h2>
                <div style="background:#f1f5f9; border-radius:20px; padding:30px; margin-bottom:40px;">
                    <p id="intro-text" style="color:#334155; font-size:1.5rem; font-weight:700; text-align:left;">状況説明テキスト</p>
                </div>
                <button onclick="startBattle()" style="background:#0f172a; color:white; border:none; border-radius:16px; padding:25px 45px; font-size:1.8rem; font-weight:900; cursor:pointer; width:100%;">魔物と対峙する</button>
            </div>

            <div id="scr-battle" style="display:none;">
                <div style="display:flex; justify-content:space-between; margin-bottom:15px; gap:10px;">
                    <div style="flex:1; text-align:left;">
                        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:4px;">
                            <div style="font-size:1.2rem; font-weight:900; color:#1e293b;">🧙‍♂️ ウィザード</div>
                            <div id="p-hp-alert-badge" style="display:none; background-color:#ef4444; color:#ffffff; font-size:0.78rem; font-weight:900; padding:2px 7px; border-radius:4px; animation: txtAlert 0.4s infinite alternate;">危険</div>
                        </div>
                        <div style="background:#e2e8f0; border-radius:99px; height:16px; width:100%; overflow:hidden;">
                            <div id="p-hp-bar" style="background:linear-gradient(90deg,#10b981,#34d399); height:100%; width:100%;"></div>
                        </div>
                        <div id="p-hp-txt" style="font-size:1rem; font-weight:900; color:#475569; text-align:right; margin-top:2px;">HP: 100/100</div>
                    </div>
                    <div style="font-size:1.4rem; font-weight:900; color:#e11d48; padding:5px 0; font-style:italic; line-height:2;">VS</div>
                    <div style="flex:1; text-align:right;">
                        <div id="e-name" style="font-size:1.2rem; font-weight:900; color:#1e293b; margin-bottom:4px;">敵の名前</div>
                        <div style="background:#e2e8f0; border-radius:99px; height:16px; width:100%; overflow:hidden;">
                            <div id="e-hp-bar" style="background:linear-gradient(90deg,#f43f5e,#fb7185); height:100%; width:100%;"></div>
                        </div>
                        <div id="e-hp-txt" style="font-size:1rem; font-weight:900; color:#475569; text-align:left; margin-top:2px;">HP: 100/100</div>
                    </div>
                </div>

                <div id="eff-scr" style="background-color:#0f172a; border:4px solid #334155; border-radius:24px 24px 0 0; height:350px; position:relative; overflow:hidden; box-sizing:border-box;">
                    <div id="p-aura-layer" style="position:absolute; width:130px; height:130px; top:110px; left:115px; border-radius:50%; background:radial-gradient(circle, rgba(168,85,247,0.7) 0%, rgba(79,70,229,0) 70%); display:none; z-index:2; animation: pulse 0.6s linear infinite;"></div>
                    <div id="spell-effect-layer" style="position:absolute; width:100%; height:100%; top:0; left:0; pointer-events:none; z-index:5;"></div>
                    
                    <div id="icon-stage" style="display:flex; justify-content:center; align-items:center; width:100%; height:100%; gap:40px; position:relative; z-index:3;">
                        
                        <div id="p-sprite-container" style="width:160px; height:160px; position:relative; display:flex; justify-content:center; align-items:center; animation: floatP 1.8s infinite alternate ease-in-out; transition:transform 0.15s;">
                            <img id="p-sprite-img" src="https://raw.githubusercontent.com/shadow-monk/game1/main/assets/hero/Wizard.png" style="width:140px; height:140px; object-fit:contain; image-rendering:pixelated; filter:drop-shadow(0 0 15px rgba(79,70,229,0.4));" alt="Wizard">
                            <div id="hologram-shield" style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%) scale(0); width:150px; height:150px; background-image:url('https://upload.wikimedia.org/wikipedia/commons/e/e0/Hexagonal_grid.svg'); background-size:30px 30px; background-repeat:repeat; opacity:0; pointer-events:none; z-index:10; border-radius:50%; box-shadow:inset 0 0 25px #06b6d4, 0 0 20px rgba(6,182,212,0.6); filter:hue-rotate(30deg);"></div>
                        </div>
                        
                        <div id="e-sprite-container" style="width:200px; height:200px; display:flex; justify-content:center; align-items:center; position:relative; animation: floatE 2.2s infinite alternate ease-in-out; transition:all 0.1s;">
                            <img id="e-sprite-graphic" style="width:200px !important; height:200px !important; object-fit:contain !important; image-rendering:pixelated !important; display:block !important;" alt="Enemy">
                        </div>
                    </div>
                    <div id="front-effect-layer" style="position:absolute; width:100%; height:100%; top:0; left:0; pointer-events:none; z-index:6;"></div>
                    <div id="dmg-layer" style="position:absolute; width:100%; height:100%; top:0; left:0; pointer-events:none; z-index:7;"></div>
                    <div id="charge-badge" style="position:absolute; top:15px; left:15px; background:linear-gradient(135deg,#e11d48,#4f46e5); color:#ffffff; font-size:1.1rem; font-weight:900; padding:6px 16px; border-radius:9999px; display:none; animation: pulse 0.5s infinite alternate; z-index:6;">魔力解放：威力2.5倍</div>
                </div>

                <div id="battle-log" style="background:rgba(15,23,42,0.98); color:#ffffff; font-size:1.25rem; font-weight:800; padding:18px; border-radius:0 0 24px 24px; line-height:1.6; border:4px solid #4f46e5; border-top:none; min-height:110px; box-sizing:border-box;">コマンドを選択せよ。</div>

                <div id="cmd-panel" style="margin-top:15px; padding:5px;">
                    <div style="display:flex; gap:8px; margin-bottom:8px;">
                        <button onclick="turn('fire')" style="flex:1; background:linear-gradient(135deg,#e11d48,#f43f5e); color:white; border:none; border-radius:12px; padding:15px 2px; font-size:1.1rem; font-weight:900; cursor:pointer;">🔥 ファイア</button>
                        <button onclick="turn('ice')" style="flex:1; background:linear-gradient(135deg,#0284c7,#38bdf8); color:white; border:none; border-radius:12px; padding:15px 2px; font-size:1.1rem; font-weight:900; cursor:pointer;">❄️ アイス</button>
                        <button onclick="turn('holy')" style="flex:1; background:linear-gradient(135deg,#ca8a04,#facc15); color:white; border:none; border-radius:12px; padding:15px 2px; font-size:1.1rem; font-weight:900; cursor:pointer;">✨ ホーリー</button>
                    </div>
                    <div style="display:flex; gap:8px;">
                        <button onclick="turn('def')" style="flex:1; background:linear-gradient(135deg,#059669,#10b981); color:white; border:none; border-radius:12px; padding:12px 5px; font-size:1.1rem; font-weight:900; cursor:pointer;">🛡️ シールド</button>
                        <button onclick="turn('chg')" style="flex:1; background:linear-gradient(135deg,#4f46e5,#6366f1); color:white; border:none; border-radius:12px; padding:12px 5px; font-size:1.1rem; font-weight:900; cursor:pointer;">⚡ チャージ</button>
                        <button id="btn-debug-death" onclick="turn('debug_death')" style="flex:1; display:none; background:linear-gradient(135deg,#475569,#0f172a); color:#f43f5e; border:2px solid #e11d48; border-radius:12px; padding:12px 5px; font-size:1.1rem; font-weight:900; cursor:pointer;">☠️ デス</button>
                    </div>
                </div>
            </div>

            <div id="scr-result" style="display:none; padding:40px 10px;">
                <div id="res-icon" style="font-size:110px; margin-bottom:20px;">🏆</div>
                <h2 id="res-title" style="color:#0f172a; font-size:3.5rem; font-weight:900; margin-bottom:20px;">VICTORY</h2>
                <p id="res-text" style="color:#475569; font-size:1.5rem; font-weight:700; line-height:1.7; margin-bottom:40px; text-align:center;">結果テキスト</p>
                <button id="res-btn" onclick="nextStage()" style="background:#0f172a; color:white; border:none; border-radius:16px; padding:25px 45px; font-size:1.8rem; font-weight:900; cursor:pointer; width:100%; box-shadow:0 15px 30px rgba(0,0,0,0.2);">次の階層へ進む</button>
            </div>
        </div>
    </div>
    
    <div id="dev-console-window" style="position:relative; z-index:3; margin-top:25px; width:100%; max-width:640px; background:#0b0f19; border:2px solid #334155; border-radius:16px; padding:15px; box-sizing:border-box; text-align:left; box-shadow:0 10px 30px rgba(0,0,0,0.5); margin-left:auto; margin-right:auto;">
        <div style="font-size:0.95rem; font-weight:800; color:#94a3b8; margin-bottom:10px; display:flex; justify-content:space-between; align-items:center;">
            <span>🔧 開発者コンソール (PW「1192」でデス呪文解放)</span>
            <span id="dev-status-badge" style="font-size:0.8rem; color:#ef4444; background:rgba(239,68,68,0.1); padding:2px 8px; border-radius:6px; font-weight:900;">LOCKED</span>
        </div>
        <div style="display:flex; gap:10px; align-items:center;">
            <input type="password" id="dev-password-input" oninput="checkDevPassword()" placeholder="PASSWORDを入力..." style="flex:1; background:#1e293b; color:#ffffff; border:1px solid #475569; border-radius:8px; padding:10px 12px; font-size:1rem; font-weight:800; outline:none;">
        </div>
    </div>
    
    <div style="width:100%; max-width:640px; display:flex; justify-content:space-between; color:#64748b; font-size:0.85rem; margin-top:25px; font-weight:bold; margin-left:auto; margin-right:auto; z-index:4; position:relative; text-shadow:1px 1px 2px #000;">
        <span>改訂 V3.20（三大オリジナルアセット魔法完全融合・生命体ランダム駆動・音響完全復元版）</span>
        <span style="font-size:0.78rem; color:#475569;">Update: 2026.05.22</span>
    </div>
</div>

<script>
function drawBricks() {
  const canvas = document.getElementById("brick-canvas"); if (!canvas) return;
  const ctx = canvas.getContext("2d"); const wrapper = document.getElementById("sq-master-wrapper");
  canvas.width = wrapper.offsetWidth || window.innerWidth; canvas.height = wrapper.offsetHeight || 1150;
  ctx.fillStyle = "#111827"; ctx.fillRect(0, 0, canvas.width, canvas.height);
  for (let r = 0; r < Math.ceil(canvas.height/40); r++) {
    let offsetX = (r % 2 === 0) ? 0 : -45;
    for (let c = 0; c < Math.ceil(canvas.width/90)+1; c++) {
      let x = c * 90 + offsetX; let y = r * 40;
      ctx.fillStyle = (r + c) % 3 === 0 ? "#1f2937" : (r + c) % 3 === 1 ? "#111827" : "#374151";
      ctx.fillRect(x, y, 84, 34); ctx.strokeStyle = "#030712"; ctx.lineWidth = 3; ctx.strokeRect(x, y, 84, 34);
    }
  }
}
setTimeout(drawBricks, 100);
window.addEventListener("resize", drawBricks);

function checkDevPassword() {
    const inputField = document.getElementById("dev-password-input"); if (!inputField) return;
    const badge = document.getElementById("dev-status-badge"); const debugBtn = document.getElementById("btn-debug-death");
    if (inputField.value === "1192") { 
        badge.innerText = "UNLOCKED"; badge.style.color = '#10b981';
        if (document.getElementById("scr-battle").style.display === "block" && debugBtn) debugBtn.style.setProperty('display', 'block', 'important'); 
    } else { badge.innerText = "LOCKED"; badge.style.color = '#ef4444'; if (debugBtn) debugBtn.style.setProperty('display', 'none', 'important'); }
}

// ==========================================
// 📦 ユーザー指定アセットデータベース (パス・全綴り完全同期完了)
// ==========================================

// 1階 通常ヘドロスライム (6枚)
const ANIMS_SLIME = [
  "https://raw.githubusercontent.com/shadow-monk/game1/main/assets/imagesX/Slime%20(1).png",
  "https://raw.githubusercontent.com/shadow-monk/game1/main/assets/imagesX/Slime%20(2).png",
  "https://raw.githubusercontent.com/shadow-monk/game1/main/assets/imagesX/Slime%20(3).png",
  "https://raw.githubusercontent.com/shadow-monk/game1/main/assets/imagesX/Slime%20(4).png",
  "https://raw.githubusercontent.com/shadow-monk/game1/main/assets/imagesX/Slime%20(5).png",
  "https://raw.githubusercontent.com/shadow-monk/game1/main/assets/imagesX/Slime%20(6).png"
];
// 1階 被弾激怒スライムA (9枚)
const ANIMS_SLIME_A = [
  "https://raw.githubusercontent.com/shadow-monk/game1/main/assets/imagesX/SlimeA%20(1).png",
  "https://raw.githubusercontent.com/shadow-monk/game1/main/assets/imagesX/SlimeA%20(2).png",
  "https://raw.githubusercontent.com/shadow-monk/game1/main/assets/imagesX/SlimeA%20(3).png",
  "https://raw.githubusercontent.com/shadow-monk/game1/main/assets/imagesX/SlimeA%20(4).png",
  "https://raw.githubusercontent.com/shadow-monk/game1/main/assets/imagesX/SlimeA%20(5).png",
  "https://raw.githubusercontent.com/shadow-monk/game1/main/assets/imagesX/SlimeA%20(6).png",
  "https://raw.githubusercontent.com/shadow-monk/game1/main/assets/imagesX/SlimeA%20(7).png",
  "https://raw.githubusercontent.com/shadow-monk/game1/main/assets/imagesX/SlimeA%20(10).png",
  "https://raw.githubusercontent.com/shadow-monk/game1/main/assets/imagesX/SlimeA%20(11).png"
];

// 2階 ブラッドスパイダー (7枚)
const ANIMS_SPIDER = [
  "https://raw.githubusercontent.com/shadow-monk/game1/main/assets/spider/spider%20(1).png",
  "https://raw.githubusercontent.com/shadow-monk/game1/main/assets/spider/spider%20(2).png",
  "https://raw.githubusercontent.com/shadow-monk/game1/main/assets/spider/spider%20(3).png",
  "https://raw.githubusercontent.com/shadow-monk/game1/main/assets/spider/spider%20(4).png",
  "https://raw.githubusercontent.com/shadow-monk/game1/main/assets/spider/spider%20(5).png",
  "https://raw.githubusercontent.com/shadow-monk/game1/main/assets/spider/spider%20(6).png",
  "https://raw.githubusercontent.com/shadow-monk/game1/main/assets/spider/spider%20(7).png"
];

// 3階 スケルトンナイト (修復：頭文字大文字 Skelton パスに完全一致)
const ANIMS_SKELTON = [
  "https://raw.githubusercontent.com/shadow-monk/game1/main/assets/Skelton/skeltonarmA%20(1).png",
  "https://raw.githubusercontent.com/shadow-monk/game1/main/assets/Skelton/skeltonarmA%20(2).png",
  "https://raw.githubusercontent.com/shadow-monk/game1/main/assets/Skelton/skeltonarmA%20(3).png",
  "https://raw.githubusercontent.com/shadow-monk/game1/main/assets/Skelton/skeltonarmA%20(4).png",
  "https://raw.githubusercontent.com/shadow-monk/game1/main/assets/Skelton/skeltonarmA%20(5).png",
  "https://raw.githubusercontent.com/shadow-monk/game1/main/assets/Skelton/skeltonarmA%20(6).png",
  "https://raw.githubusercontent.com/shadow-monk/game1/main/assets/Skelton/skeltonarmA%20(7).png",
  "https://raw.githubusercontent.com/shadow-monk/game1/main/assets/Skelton/skeltonarmA%20(8).png",
  "https://raw.githubusercontent.com/shadow-monk/game1/main/assets/Skelton/skeltonarmA%20(9).png"
];

// 4階 ハーピィ
const ANIMS_HARPY = [
  "https://raw.githubusercontent.com/shadow-monk/game1/main/assets/happy/happy%20(1).png",
  "https://raw.githubusercontent.com/shadow-monk/game1/main/assets/happy/happy%20(2).png",
  "https://raw.githubusercontent.com/shadow-monk/game1/main/assets/happy/happy%20(3).png",
  "https://raw.githubusercontent.com/shadow-monk/game1/main/assets/happy/happy%20(4).png",
  "https://raw.githubusercontent.com/shadow-monk/game1/main/assets/happy/happy%20(5).png",
  "https://raw.githubusercontent.com/shadow-monk/game1/main/assets/happy/happy%20(6).png",
  "https://raw.githubusercontent.com/shadow-monk/game1/main/assets/happy/happy%20(7).png",
  "https://raw.githubusercontent.com/shadow-monk/game1/main/assets/happy/happy%20(8).png"
];

// 5階 ゴーレム
const ANIMS_GOLEM = [
  "https://raw.githubusercontent.com/shadow-monk/game1/main/assets/golem/Golem%20(1).png",
  "https://raw.githubusercontent.com/shadow-monk/game1/main/assets/golem/Golem%20(2).png",
  "https://raw.githubusercontent.com/shadow-monk/game1/main/assets/golem/Golem%20(3).png",
  "https://raw.githubusercontent.com/shadow-monk/game1/main/assets/golem/Golem%20(4).png"
];

// 6階 ガーゴイル (修復：頭文字大文字 Gargoyle パスに完全一致)
const ANIMS_GARGOIL = [
  "https://raw.githubusercontent.com/shadow-monk/game1/main/assets/Gargoyle/gargoyle%20(1).png",
  "https://raw.githubusercontent.com/shadow-monk/game1/main/assets/Gargoyle/gargoyle%20(2).png",
  "https://raw.githubusercontent.com/shadow-monk/game1/main/assets/Gargoyle/gargoyle%20(3).png",
  "https://raw.githubusercontent.com/shadow-monk/game1/main/assets/Gargoyle/gargoyle%20(4).png",
  "https://raw.githubusercontent.com/shadow-monk/game1/main/assets/Gargoyle/gargoyle%20(5).png",
  "https://raw.githubusercontent.com/shadow-monk/game1/main/assets/Gargoyle/gargoyle%20(6).png",
  "https://raw.githubusercontent.com/shadow-monk/game1/main/assets/Gargoyle/gargoyle%20(7).png"
];

// 7階 マイコニド通常種 (修復：頭文字大文字 Maiconid パス完全一致)
const ANIMS_MUSH_NORMAL = [
  "https://raw.githubusercontent.com/shadow-monk/game1/main/assets/Maiconid/maiconid%20(1).png",
  "https://raw.githubusercontent.com/shadow-monk/game1/main/assets/Maiconid/maiconid%20(2).png",
  "https://raw.githubusercontent.com/shadow-monk/game1/main/assets/Maiconid/maiconid%20(3).png",
  "https://raw.githubusercontent.com/shadow-monk/game1/main/assets/Maiconid/maiconid%20(4).png",
  "https://raw.githubusercontent.com/shadow-monk/game1/main/assets/Maiconid/maiconid%20(5).png"
];
// 7階 マイコニド変異2段目コピー種 (全角ハイフン・スペース文字エンコード修復完了)
const ANIMS_MUSH_ALTER = [
  "https://raw.githubusercontent.com/shadow-monk/game1/main/assets/Maiconid/maiconid%20(1)%20%EF%BC%8D%20%E3%82%B3%E3%83%94%E3%83%BC.png",
  "https://raw.githubusercontent.com/shadow-monk/game1/main/assets/Maiconid/maiconid%20(2)%20%EF%BC%8D%20%E3%82%B3%E3%83%94%E3%83%BC.png",
  "https://raw.githubusercontent.com/shadow-monk/game1/main/assets/Maiconid/maiconid%20(3)%20%EF%BC%8D%20%E3%82%B3%E3%83%94%E3%83%BC.png",
  "https://raw.githubusercontent.com/shadow-monk/game1/main/assets/Maiconid/maiconid%20(4)%20%EF%BC%8D%20%E3%82%B3%E3%83%94%E3%83%BC.png",
  "https://raw.githubusercontent.com/shadow-monk/game1/main/assets/Maiconid/maiconid%20(5)%20%EF%BC%8D%20%E3%82%B3%E3%83%94%E3%83%BC.png"
];

// 8階 ファントム
const ANIMS_PHANTOM = [
  "https://raw.githubusercontent.com/shadow-monk/game1/main/assets/phantom/phantom%20(1).png",
  "https://raw.githubusercontent.com/shadow-monk/game1/main/assets/phantom/phantom%20(2).png",
  "https://raw.githubusercontent.com/shadow-monk/game1/main/assets/phantom/phantom%20(3).png",
  "https://raw.githubusercontent.com/shadow-monk/game1/main/assets/phantom/phantom%20(4)%20.png",
  "https://raw.githubusercontent.com/shadow-monk/game1/main/assets/phantom/phantom%20(5).png",
  "https://raw.githubusercontent.com/shadow-monk/game1/main/assets/phantom/phantom%20(6).png",
  "https://raw.githubusercontent.com/shadow-monk/game1/main/assets/phantom/phantom%20(7).png",
  "https://raw.githubusercontent.com/shadow-monk/game1/main/assets/phantom/phantom%20(8).png",
  "https://raw.githubusercontent.com/shadow-monk/game1/main/assets/phantom/phantom%20(9).png",
  "https://raw.githubusercontent.com/shadow-monk/game1/main/assets/phantom/phantom%20(10).png"
];

// 9階 イビルアイ 通常時 (修復：頭文字大文字 Eyes パスに完全一致)
const ANIMS_EYES_NORMAL = [
  "https://raw.githubusercontent.com/shadow-monk/game1/main/assets/Eyes/eyes%20(0).png",
  "https://raw.githubusercontent.com/shadow-monk/game1/main/assets/Eyes/eyes%20(1).png",
  "https://raw.githubusercontent.com/shadow-monk/game1/main/assets/Eyes/eyes%20(2).png",
  "https://raw.githubusercontent.com/shadow-monk/game1/main/assets/Eyes/eyes%20(3).png",
  "https://raw.githubusercontent.com/shadow-monk/game1/main/assets/Eyes/eyes%20(4).png",
  "https://raw.githubusercontent.com/shadow-monk/game1/main/assets/Eyes/eyes%20(5).png",
  "https://raw.githubusercontent.com/shadow-monk/game1/main/assets/Eyes/eyes%20(6).png"
];
// 9階 イビルアイ 被弾覚醒時
const ANIMS_EYES_BURST = [
  "https://raw.githubusercontent.com/shadow-monk/game1/main/assets/Eyes/eyes%20(0).png",
  "https://raw.githubusercontent.com/shadow-monk/game1/main/assets/Eyes/eyes%20(1).png",
  "https://raw.githubusercontent.com/shadow-monk/game1/main/assets/Eyes/eyes%20(2).png",
  "https://raw.githubusercontent.com/shadow-monk/game1/main/assets/Eyes/eyes%20(8).png",
  "https://raw.githubusercontent.com/shadow-monk/game1/main/assets/Eyes/eyes%20(9).png"
];

// 10階 カリスドラゴン
const ANIMS_DRAGON = [
  "https://raw.githubusercontent.com/shadow-monk/game1/main/assets/doragon/A_dragon%20(1).png",
  "https://raw.githubusercontent.com/shadow-monk/game1/main/assets/doragon/A_dragon%20(2).png",
  "https://raw.githubusercontent.com/shadow-monk/game1/main/assets/doragon/A_dragon%20(3).png",
  "https://raw.githubusercontent.com/shadow-monk/game1/main/assets/doragon/A_dragon%20(4).png",
  "https://raw.githubusercontent.com/shadow-monk/game1/main/assets/doragon/A_dragon%20(5).png",
  "https://raw.githubusercontent.com/shadow-monk/game1/main/assets/doragon/A_dragon%20(6).png",
  "https://raw.githubusercontent.com/shadow-monk/game1/main/assets/doragon/A_dragon%20(7).png",
  "https://raw.githubusercontent.com/shadow-monk/game1/main/assets/doragon/A_dragon%20(8).png"
];

// 全10階層統合データ構造
const STAGES = [
  { floor: 1,  name: "ヘドロスライム",       hp: 65,  atk: 10, weak: "fire", type: "slime",   glow: "rgba(34,197,94,0.4)",  txt: "1階。通路を塞ぐ粘液質の魔物。熱変化に弱く【ファイア】の猛火が有効！被弾すると激怒赤オーラを放つ。" },
  { floor: 2,  name: "ブラッドスパイダー",   hp: 80,  atk: 13, weak: "fire", type: "spider",  glow: "rgba(239,68,68,0.4)",  txt: "2階。無数の足が蠢く巨大蜘蛛。焼き払う【ファイア】の爆風が効果的！" },
  { floor: 3,  name: "スケルトンナイト",     hp: 100, atk: 16, weak: "holy", type: "skelton", glow: "rgba(203,213,225,0.5)", txt: "3階。古の戦意を宿した強固な骸骨騎士。【ホーリー】の聖なる光で浄化せよ！" },
  { floor: 4,  name: "ハーピィ",             hp: 125, atk: 19, weak: "ice",  type: "harpy",   glow: "rgba(236,72,153,0.4)",  txt: "4階。大気を操り鋭く羽ばたく怪鳥。自由な翼を【アイス】で完全氷結させろ！" },
  { floor: 5,  name: "ゴーレム",             hp: 155, atk: 22, weak: "fire", type: "golem",   glow: "rgba(245,158,11,0.5)",  txt: "5階。地響きを伴って駆動する岩石巨兵。【ファイア】による熱膨張が効く！" },
  { floor: 6,  name: "ガーゴイル",           hp: 190, atk: 26, weak: "ice",  type: "gargoil", glow: "rgba(100,116,139,0.5)", txt: "6階。石像から解き放たれし守護霊獣。脆い岩肌を凝固割断する【アイス】が天敵！" },
  { floor: 7,  name: "マイコニド",           hp: 230, atk: 30, weak: "fire", type: "mush",    glow: "rgba(168,85,247,0.4)",  txt: "7階。伸縮する歩行キノコ。HPが半分を切ると自動で【変異コピー種】へと2段階変形する！" },
  { floor: 8,  name: "ファントム",           hp: 280, atk: 35, weak: "holy", type: "phantom", glow: "rgba(125,211,252,0.4)", txt: "8階。霧のように形を変えて浮遊する亡霊。【ホーリー】の陣で消滅させろ！" },
  { floor: 9,  name: "イビルアイ",           hp: 360, atk: 42, weak: "holy", type: "eyes",    glow: "rgba(219,39,119,0.5)",  txt: "9階。狂気に満ちた視線を放つ巨大魔眼（左右反転配置版）。【ホーリー】の神光を注げ！" },
  { floor: 10, name: "カリスドラゴン",       hp: 550, atk: 52, weak: "holy", type: "dragon",  glow: "rgba(15,23,42,1)",      txt: "10階。螺旋の頂上に君臨する最終暗黒竜。全てを込めた最大級の【ホーリー】で挑め！" }
];

const MASTER_ANIM_MAP = { slime: ANIMS_SLIME, spider: ANIMS_SPIDER, skelton: ANIMS_SKELTON, harpy: ANIMS_HARPY, golem: ANIMS_GOLEM, gargoil: ANIMS_GARGOIL, mush: ANIMS_MUSH_NORMAL, phantom: ANIMS_PHANTOM, eyes: ANIMS_EYES_NORMAL, dragon: ANIMS_DRAGON };

// 🎵 音楽周波数配列
const SCALE = { castle: [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25], horror: [130.81, 138.59, 164.81, 174.61, 196.00, 207.65, 246.94, 261.63], boss: [110.00, 116.54, 130.81, 146.83, 164.81, 174.61, 196.00, 220.00] };

// 🔥❄️✨ ユーザー指定：三大魔法すべてオリジナル画像アセットを完全同期実装
const MISSILE_EFFECTS = {
  fire: '<img src="https://raw.githubusercontent.com/shadow-monk/game1/main/assets/effect/fire.png" style="position:absolute; width:65px; height:65px; left:220px; top:145px; animation:fireFly 0.38s ease-in forwards; image-rendering:pixelated;">',
  ice: '<img src="https://raw.githubusercontent.com/shadow-monk/game1/main/assets/effect/ICE.png" style="position:absolute; width:65px; height:65px; left:220px; top:145px; animation:iceFly 0.38s cubic-bezier(0.25, 1, 0.5, 1) forwards; image-rendering:pixelated;">',
  holy: '<img src="https://raw.githubusercontent.com/shadow-monk/game1/main/assets/effect/crosgroup.png" style="position:absolute; width:70px; height:70px; left:220px; top:140px; animation:holyGroupFly 0.4s ease-in-out forwards; image-rendering:pixelated;">'
};
const HIT_LAND_EFFECTS = {
  fire: '<img src="https://raw.githubusercontent.com/shadow-monk/game1/main/assets/effect/fire.png" style="position:absolute; width:120px; height:120px; z-index:9; animation:fireBoomBlock 0.3s ease-out forwards; image-rendering:pixelated;">',
  ice: '<img src="https://raw.githubusercontent.com/shadow-monk/game1/main/assets/effect/ICE.png" style="position:absolute; width:120px; height:120px; z-index:9; animation:iceSpike 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; image-rendering:pixelated;">',
  holy: '<img src="https://raw.githubusercontent.com/shadow-monk/game1/main/assets/effect/cross.png" style="position:absolute; width:120px; height:120px; z-index:9; animation:grandCrossBoom 0.45s ease-out forwards; image-rendering:pixelated;">'
};

let curIdx = -1; let pMaxHp = 100, pHp = 100, eHp = 100, eMaxHp = 100, mana = 1.0; let isBusy = false, isMuted = false;
let animeTimeout = null; let currentFrameIdx = 0; let isBursting = false;

// 🧬 生物的ランダムゆらぎ駆動アニメーション回路
function startCustomAnimation(type) {
    stopSlimeAnimation(); if (isBursting) return;
    const graphicEl = document.getElementById("e-sprite-graphic"); if (!graphicEl) return;
    
    let arr = MASTER_ANIM_MAP[type] || ANIMS_SLIME;
    if(type === "mush" && eHp <= eMaxHp / 2) { arr = ANIMS_MUSH_ALTER; }

    function step() {
        if(!STAGES[curIdx] || isBursting) return;
        if(type === "mush" && eHp <= eMaxHp / 2) { arr = ANIMS_MUSH_ALTER; }
        
        currentFrameIdx = (currentFrameIdx + 1) % arr.length;
        graphicEl.src = arr[currentFrameIdx];
        
        // 生命感を出すため、1コマ毎の速度を120ms〜350ms間で常時ランダム変化させる
        let randomSpeed = Math.floor(Math.random() * (350 - 120 + 1)) + 120;
        animeTimeout = setTimeout(step, randomSpeed);
    }
    
    currentFrameIdx = 0;
    graphicEl.src = arr[0];
    animeTimeout = setTimeout(step, 180);
}

function stopSlimeAnimation() { if(animeTimeout) { clearTimeout(animeTimeout); animeTimeout = null; } }

// 💥 被弾時アセット連動高速バースト
function burstSlimeAnimation() {
    if(STAGES[curIdx]) {
        stopSlimeAnimation(); isBursting = true; let bFrame = 0;
        const containerEl = document.getElementById('e-sprite-container');
        const graphicEl = document.getElementById("e-sprite-graphic");
        let arr = MASTER_ANIM_MAP[STAGES[curIdx].type] || ANIMS_SLIME;
        
        if(STAGES[curIdx].type === "slime") {
            arr = ANIMS_SLIME_A;
            if(containerEl) {
                containerEl.style.setProperty('animation', 'angryAura 0.3s infinite alternate ease-in-out', 'important');
            }
        }
        if(STAGES[curIdx].type === "mush" && eHp <= eMaxHp / 2) arr = ANIMS_MUSH_ALTER;
        if(STAGES[curIdx].type === "eyes") arr = ANIMS_EYES_BURST;
        
        let burstCount = 0;
        function runBurst() {
            if (burstCount > 6) {
                isBursting = false;
                if(document.getElementById("scr-battle").style.display === "block") {
                    startCustomAnimation(STAGES[curIdx].type);
                }
                return;
            }
            bFrame = (bFrame + 1) % arr.length;
            if (graphicEl) graphicEl.src = arr[bFrame];
            burstCount++;
            setTimeout(runBurst, 60);
        }
        runBurst();
    }
}

// 🎧 音響回路強制復活リスタートシステム
let audioCtx = null; let bgmTimer = null; let bgmStep = 0; let currentBgmType = "title";

function initAudio() { 
    if (!audioCtx) { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); }
    if (audioCtx && audioCtx.state === "suspended") { audioCtx.resume(); }
}

function playBgmNode() {
  if (isMuted || currentBgmType === "title") return;
  try {
    initAudio(); let now = audioCtx.currentTime; let osc = audioCtx.createOscillator(); let gain = audioCtx.createGain();
    osc.connect(gain); gain.connect(audioCtx.destination);
    let note = currentBgmType === "castle" ? SCALE.castle[bgmStep % 8] : (currentBgmType === "boss" ? SCALE.boss[bgmStep % 8] : SCALE.horror[bgmStep % 8]);
    osc.type = currentBgmType === "boss" ? "sawtooth" : "triangle"; osc.frequency.setValueAtTime(note, now);
    gain.gain.setValueAtTime(currentBgmType === "boss" ? 0.012 : 0.015, now); gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    osc.start(now); osc.stop(now + 0.3); bgmStep++;
  } catch(e){}
}

function startBGM(type) { 
    stopBGM(); currentBgmType = type; if (type === "title" || isMuted) return; 
    initAudio(); bgmStep = 0; 
    bgmTimer = setInterval(playBgmNode, type === "castle" ? 340 : (type === "boss" ? 160 : 220)); 
}

function stopBGM() { if (bgmTimer) { clearInterval(bgmTimer); bgmTimer = null; } }
function toggleMute() { isMuted = !isMuted; document.getElementById('btn-mute').innerText = isMuted ? "🔇 音声: OFF" : "🔊 音声: ON"; if (isMuted) stopBGM(); else startBGM(currentBgmType); }

function playSE(type) {
  if (isMuted) return;
  try {
    initAudio(); let now = audioCtx.currentTime; let osc = audioCtx.createOscillator(); let gain = audioCtx.createGain();
    osc.connect(gain); gain.connect(audioCtx.destination);
    if (type === 'fire') { osc.type = 'sawtooth'; osc.frequency.setValueAtTime(140, now); osc.frequency.linearRampToValueAtTime(30, now + 0.35); gain.gain.setValueAtTime(0.25, now); }
    else if (type === 'ice') { osc.type = 'square'; osc.frequency.setValueAtTime(1100, now); gain.gain.setValueAtTime(0.08, now); }
    else if (type === 'holy') { osc.type = 'sine'; osc.frequency.setValueAtTime(400, now); osc.frequency.exponentialRampToValueAtTime(1800, now + 0.4); gain.gain.setValueAtTime(0.25, now); }
    else if (type === 'click') { osc.type = 'sine'; osc.frequency.setValueAtTime(800, now); gain.gain.setValueAtTime(0.05, now); }
    else if (type === 'def') { osc.type = 'triangle'; osc.frequency.setValueAtTime(260, now); osc.frequency.linearRampToValueAtTime(580, now + 0.3); gain.gain.setValueAtTime(0.2, now); }
    else if (type === 'chg') { osc.type = 'sine'; osc.frequency.setValueAtTime(440, now); osc.frequency.linearRampToValueAtTime(880, now + 0.3); gain.gain.setValueAtTime(0.12, now); }
    else { osc.type = 'sawtooth'; osc.frequency.setValueAtTime(80, now); osc.frequency.linearRampToValueAtTime(10, now + 0.4); gain.gain.setValueAtTime(0.3, now); }
    gain.gain.linearRampToValueAtTime(0.001, now + 0.35); osc.start(now); osc.stop(now + 0.35);
  } catch(e){}
}

function createDmgPop(dmg, isWeak, isPlayer) {
    const layer = document.getElementById("dmg-layer"); if(!layer) return;
    const pop = document.createElement("div"); pop.style.position = "absolute";
    pop.style.fontSize = isWeak ? "3.2rem" : "2.4rem"; pop.style.fontWeight = "900"; pop.style.fontStyle = "italic"; pop.style.textShadow = "2px 2px 0px #000";
    if (isPlayer) { pop.style.left = "130px"; pop.style.top = "120px"; pop.style.color = "#ef4444"; pop.innerText = `-${dmg}`; }
    else { pop.style.right = "90px"; pop.style.top = "90px"; pop.style.color = isWeak ? "#facc15" : "#ffffff"; pop.innerText = isWeak ? `💥 ${dmg}` : dmg; }
    let yIdx = 0; let opacity = 1;
    const upTimer = setInterval(() => { yIdx -= 3; pop.style.transform = `translateY(${yIdx}px)`; opacity -= 0.04; pop.style.opacity = opacity; if(opacity <= 0) { clearInterval(upTimer); pop.remove(); } }, 20);
    layer.appendChild(pop);
}

function triggerShake(shakeType) {
  const stage = document.getElementById('icon-stage'); if(!stage) return;
  let count = 0, max = 16; let power = 14; if (shakeType === 'critical_shake') power = 26;
  const interval = setInterval(() => {
    if (count >= max) { stage.style.transform = 'none'; clearInterval(interval); return; }
    let x = Math.floor(Math.random() * power) - (power / 2); let y = Math.floor(Math.random() * power) - (power / 2);
    stage.style.transform = `translate3d(${x}px, ${y}px, 0px)`; count++;
  }, 16);
}

function triggerEnemyHitPulse() {
  const box = document.getElementById('e-sprite-graphic'); if(!box) return;
  let pCount = 0;
  const pulseTimer = setInterval(() => {
    if (pCount > 4) { box.style.transform = (STAGES[curIdx] && STAGES[curIdx].type === "eyes") ? "scaleX(-1)" : "none"; clearInterval(pulseTimer); return; }
    let flip = (STAGES[curIdx] && STAGES[curIdx].type === "eyes") ? "scaleX(-1)" : "";
    box.style.transform = `translate3d(${(pCount % 2 === 0 ? 8 : -8)}px, 0px, 0px) scale(0.95) ${flip}`; pCount++;
  }, 40);
}

function flashScreen(color) {
  const screen = document.getElementById('eff-scr'); if(!screen) return;
  screen.style.backgroundColor = color; setTimeout(() => { screen.style.backgroundColor = (pHp <= 30) ? 'rgba(239, 68, 68, 0.1)' : '#0f172a'; }, 130);
}

function flashCritical(color) {
  const screen = document.getElementById('eff-scr'); if(!screen) return;
  screen.style.backgroundColor = color;
  setTimeout(() => { screen.style.backgroundColor = '#0f172a';
    setTimeout(() => { screen.style.backgroundColor = color;
      setTimeout(() => { screen.style.backgroundColor = (pHp <= 30) ? 'rgba(239, 68, 68, 0.1)' : '#0f172a'; }, 65);
    }, 45);
  }, 65);
}

function createExplosionParticles(castType) {
  const parent = document.getElementById('eff-scr'); const container = document.getElementById('e-sprite-container'); if(!parent || !container) return;
  const rect = container.getBoundingClientRect(); const parentRect = parent.getBoundingClientRect();
  const startX = (rect.left - parentRect.left) + rect.width / 2; const startY = (rect.top - parentRect.top) + rect.height / 2;
  let color = castType === 'fire' ? '#ef4444' : (castType === 'ice' ? '#38bdf8' : '#facc15');
  for (let i = 0; i < 45; i++) {
    const p = document.createElement('div'); p.style.position = 'absolute'; p.style.width = '8px'; p.style.height = '8px'; p.style.backgroundColor = color;
    p.style.left = `${startX}px`; p.style.top = `${startY}px`; p.style.zIndex = '12'; p.style.pointerEvents = 'none';
    const tx = (Math.random() * 320 - 160); const ty = (Math.random() * -260 - 20); p.style.setProperty('--tx', `${tx}px`); p.style.setProperty('--ty', `${ty}px`);
    p.style.animation = 'pulseBoom 0.6s cubic-bezier(0.1, 0.8, 0.25, 1) forwards'; parent.appendChild(p); setTimeout(() => p.remove(), 600);
  }
}

function hideAll() { ['scr-start','scr-intro','scr-battle','scr-result'].forEach(id => { const el = document.getElementById(id); if (el) el.style.display = 'none'; }); }

function nextStage() {
    initAudio(); playSE('click'); curIdx++;
    if (curIdx >= STAGES.length) { resetGame(); hideAll(); document.getElementById('scr-start').style.display = 'block'; document.getElementById('floor-indicator').style.visibility = 'hidden'; startBGM("title"); return; }
    const data = STAGES[curIdx]; pHp = pMaxHp; hideAll(); stopSlimeAnimation();
    const fInd = document.getElementById('floor-indicator'); if (fInd) { fInd.style.visibility = 'visible'; fInd.innerText = `${data.floor}階`; }
    document.getElementById('scr-intro').style.display = 'block';
    document.getElementById('intro-ch-num').innerText = `FLOOR ${data.floor < 10 ? '0'+data.floor : data.floor}`;
    document.getElementById('intro-ch-title').innerText = data.name;
    document.getElementById('intro-text').innerText = data.txt;
    
    startBGM("castle");
}

function startBattle() {
  initAudio(); playSE('click'); const data = STAGES[curIdx]; eHp = eMaxHp = data.hp; hideAll(); isBusy = false; isBursting = false;
  
  const container = document.getElementById('e-sprite-container');
  if(container) {
    container.removeAttribute("style"); container.style.animation = 'floatE 2.2s infinite alternate ease-in-out';
    container.style.width = '200px'; container.style.height = '200px'; container.style.display = 'flex';
    container.style.justifyContent = 'center'; container.style.alignItems = 'center'; container.style.position = 'relative';
    container.style.filter = `drop-shadow(0 0 25px ${data.glow})`;
  }
  
  const graphicEl = document.getElementById('e-sprite-graphic');
  if(graphicEl) { 
      graphicEl.removeAttribute("style"); 
      graphicEl.style.width = "200px"; 
      graphicEl.style.height = "200px"; 
      graphicEl.style.display = "block"; 
      graphicEl.style.objectFit = "contain";
      graphicEl.style.imageRendering = "pixelated"; 
      
      if(data.type === "eyes") { graphicEl.style.transform = "scaleX(-1)"; }
  }
  
  document.getElementById('scr-battle').style.display = 'block';
  document.getElementById('e-name').innerText = data.name;
  
  startCustomAnimation(data.type);
  updateHpUI(); checkDevPassword();
  document.getElementById('eff-scr').style.borderColor = data.floor === 10 ? '#be123c' : '#334155';
  document.getElementById('battle-log').innerHTML = `戦闘領域展開。${data.name}を駆逐せよ。 <span style='color:#38bdf8;'>[弱点: ${data.weak.toUpperCase()}]</span>`;
  
  startBGM(data.floor === 10 ? "boss" : "horror");
}

function updateHpUI() {
  const scr = document.getElementById('eff-scr'); const alertBadge = document.getElementById('p-hp-alert-badge'); if(!scr) return;
  document.getElementById('p-hp-bar').style.width = `${pHp}%`; document.getElementById('e-hp-bar').style.width = `${(eHp/eMaxHp*100)}%`;
  document.getElementById('p-hp-txt').innerText = `HP: ${pHp} / 100`; document.getElementById('e-hp-txt').innerText = `HP: ${eHp} / ${eMaxHp}`;
  if (pHp <= 30) { scr.style.animation = 'crisisAlert 1.0s infinite alternate'; scr.style.borderColor = '#f43f5e'; if (alertBadge) alertBadge.style.display = "block"; } 
  else { scr.style.animation = 'none'; scr.style.borderColor = (STAGES[curIdx] && STAGES[curIdx].floor === 10) ? '#be123c' : '#334155'; if (alertBadge) alertBadge.style.display = "none"; }
}

function turn(playerMove) {
  if (isBusy || pHp <= 0 || eHp <= 0) return;
  isBusy = true; initAudio();
  
  const data = STAGES[curIdx]; const enemyMove = Math.random() > 0.43 ? "atk" : "def";
  let pDamage = 0, eDamage = 0; let log = ""; let isCritical = false;
  
  const containerEl = document.getElementById('e-sprite-container');
  const effectLayer = document.getElementById('spell-effect-layer');
  const frontLayer = document.getElementById('front-effect-layer');
  const pContainer = document.getElementById('p-sprite-container');
  const shieldEl = document.getElementById('hologram-shield');

  if (playerMove === 'debug_death') {
    playSE('boom'); eDamage = eHp; log = `☠️ デスコード認証。対象の存在確率をゼロに書き換えました。`;
    eHp = 0; updateHpUI(); document.getElementById('battle-log').innerHTML = log;
    setTimeout(() => { checkBattleEnd(); }, 400); return;
  }

  // 攻撃系魔法コマンド
  if (playerMove === 'fire' || playerMove === 'ice' || playerMove === 'holy') {
    if(effectLayer) effectLayer.innerHTML = MISSILE_EFFECTS[playerMove];
    if(pContainer) pContainer.style.transform = 'translateX(45px) scale(1.08)';
    setTimeout(() => { if(pContainer) pContainer.style.transform = 'none'; }, 350);

    let basePower = 16; let spellName = playerMove === 'fire' ? "ファイア" : (playerMove === 'ice' ? "アイス" : "ホーリー");
    let flashColor = playerMove === 'fire' ? "#e11d48" : (playerMove === 'ice' ? "#0284c7" : "#eab308");

    if (data.weak === playerMove) { isCritical = true; basePower = Math.floor(basePower * 2.3); }
    eDamage = Math.floor(basePower * mana);

    if (enemyMove === 'atk') {
      pDamage = data.atk;
      if(containerEl) {
          containerEl.style.transform = 'translateX(0)';
          containerEl.style.animation = 'none';
          void containerEl.offsetWidth;
          containerEl.style.animation = 'enemyAssault 0.45s forwards';
      }
      setTimeout(() => { if(containerEl) containerEl.style.animation = 'floatE 2.2s infinite alternate ease-in-out'; }, 460);
      
      let mushText = (data.type === "mush" && (eHp - eDamage) <= eMaxHp / 2) ? "【形態変異】" : "";
      log = isCritical ? `【CRITICAL】弱点適合！${mushText}『${spellName}』直撃！【${eDamage}】ダメージ！ 敵のカウンターで ${pDamage} 被弾！` : `『${spellName}』命中！敵に ${eDamage} ダメージ / あなたは ${pDamage} 被弾！`;
    } else { eDamage = Math.floor(eDamage * 0.33); log = `🛡️ 敵の防壁展開！『${spellName}』が減衰。敵に ${eDamage} ダメージ。`; }

    pHp = Math.max(0, pHp - pDamage); eHp = Math.max(0, eHp - eDamage);

    setTimeout(() => {
      playSE(playerMove); 
      burstSlimeAnimation(); 
      
      if(containerEl && frontLayer) {
        const parentRect = document.getElementById('eff-scr').getBoundingClientRect();
        const targetRect = containerEl.getBoundingClientRect();
        const relativeX = (targetRect.left - parentRect.left) + targetRect.width / 2;
        const relativeY = (targetRect.top - parentRect.top) + targetRect.height / 2;

        const hitBox = document.createElement('div');
        hitBox.style.position = 'absolute'; hitBox.style.left = `${relativeX}px`; hitBox.style.top = `${relativeY}px`; hitBox.style.pointerEvents = 'none';
        hitBox.innerHTML = HIT_LAND_EFFECTS[playerMove]; frontLayer.appendChild(hitBox);
        setTimeout(() => { hitBox.remove(); if(effectLayer) effectLayer.innerHTML = ""; }, 420);
      }

      triggerEnemyHitPulse(); triggerShake(isCritical ? 'critical_shake' : 'attack_success'); 
      createDmgPop(eDamage, isCritical, false); if (pDamage > 0) createDmgPop(pDamage, false, true);
      if (isCritical) { flashCritical(flashColor); } else { flashScreen(flashColor); }
      
      updateHpUI();
      document.getElementById('battle-log').innerHTML = log;
      setTimeout(() => { checkBattleEnd(); }, 460);
    }, 360);

    mana = 1.0; document.getElementById('p-aura-layer').style.display = "none";
    const chgB = document.getElementById('charge-badge'); if(chgB) chgB.style.display = "none";
  }
  // 防御・チャージコマンド
  else {
    if (playerMove === 'def') {
      playSE('def');
      if(pContainer) pContainer.style.transform = 'translateX(-20px)';
      if(shieldEl) {
        shieldEl.style.animation = 'none';
        void shieldEl.offsetWidth;
        shieldEl.style.animation = 'shieldDeploy 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards';
      }
      setTimeout(() => { if(pContainer) pContainer.style.transform = 'none'; }, 500);

      if (enemyMove === 'atk') { 
        pDamage = Math.max(1, Math.floor(data.atk * 0.12)); 
        log = `🛡️ ホログラムシールド展開！敵の突進を絶対防御壁が防ぎ、ダメージをわずか 【${pDamage}】 に遮断！`; 
      } else { 
        log = `🔮 絶対障壁を構えたが、エネミーは防御姿勢をとっている。`; 
      }
    } else {
      playSE('chg'); if (enemyMove === 'atk') { pDamage = Math.floor(data.atk * 1.6); log = `🚨 チャージの隙を突かれた！カウンターにより 【${pDamage}】 被弾！`; mana = 1.0; } else { mana = 2.5; log = `⚡ 魔力集束！次ターンの術式破壊力が 【2.5倍】 に跳ね上がる！`; document.getElementById('p-aura-layer').style.display = "block"; const chgB = document.getElementById('charge-badge'); if(chgB) chgB.style.display = "block"; }
    }
    flashScreen("#10b981"); if (pDamage > 0) createDmgPop(pDamage, false, true);
    pHp = Math.max(0, pHp - pDamage); updateHpUI(); document.getElementById('battle-log').innerHTML = log;
    setTimeout(() => { checkBattleEnd(); }, 460);
  }
}

function checkBattleEnd() {
  const containerEl = document.getElementById('e-sprite-container');
  if (pHp <= 0 || eHp <= 0) { 
    stopBGM(); stopSlimeAnimation(); 
    if (eHp <= 0) {
      playSE('boom'); triggerShake('critical_shake'); flashCritical('#ffffff'); createExplosionParticles(STAGES[curIdx].weak); 
      if(containerEl) { containerEl.style.opacity = '0'; containerEl.style.transform = 'scale(0.01)'; }
      setTimeout(() => { endBattle(); }, STAGES[curIdx].floor === 10 ? 1200 : 650);
    } else { endBattle(); }
  } else { isBusy = false; }
}

function endBattle() {
  hideAll(); stopSlimeAnimation(); document.getElementById('scr-result').style.display = 'block';
  const rTitle = document.getElementById('res-title'); const rText = document.getElementById('res-text');
  document.getElementById('p-aura-layer').style.display = "none"; document.getElementById('battle-log').innerHTML = "コマンドを選択せよ。";
  const chgB = document.getElementById('charge-badge'); if(chgB) chgB.style.display = "none";
  if (eHp <= 0) {
    rTitle.innerText = "VICTORY"; rTitle.style.color = '#10b981'; document.getElementById('res-icon').innerText = "🏆";
    if (curIdx === STAGES.length - 1) rText.innerText = "🎉 螺旋の塔・完全制覇！最終暗黒竜『カリスドラゴン』を討滅し、世界に光を取り戻した！";
    else rText.innerText = `激闘 of 激闘の末、立ちはだかる${STAGES[curIdx].name}を完全に粉砕した！`;
  } else {
    rTitle.innerText = "DEFEATED"; rTitle.style.color = '#f43f5e'; document.getElementById('res-icon').innerText = "💀";
    rText.innerText = `${STAGES[curIdx].name}の圧倒的猛攻の前に力尽きた...`; curIdx = -1;
  }
  isBusy = false;
}

function resetGame() { pHp = 100; mana = 1.0; curIdx = -1; isBusy = false; isBursting = false; document.getElementById('battle-log').innerHTML = "コマンドを選択せよ。"; stopBGM(); stopSlimeAnimation(); }
</script>
</body>
</html>
