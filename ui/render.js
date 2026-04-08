"use strict";

export function drawFolderScreen() {
  console.log("🔥 drawFolderScreen 実行");

  const app = document.getElementById("app");

  // 安全チェック
  if (!app) {
    console.error("❌ #app が見つかりません");
    return;
  }

  console.log("✅ #app取得成功");

  // ★まずは確実に表示される内容
  app.innerHTML = `
    <div>
      <h2>フォルダ一覧</h2>
      <p>ここにフォルダが表示されます</p>
      <button id="testBtn">テストボタン</button>
    </div>
  `;

  // イベント確認用
  document.getElementById("testBtn").addEventListener("click", () => {
    alert("ボタンは動いています");
  });
}