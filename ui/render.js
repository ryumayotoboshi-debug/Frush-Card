"use strict";

import { load } from "../data/storage.js";

export function drawFolderScreen() {
  console.log("🔥 drawFolderScreen 実行");

  const app = document.getElementById("app");

  if (!app) {
    console.error("❌ #app が見つかりません");
    return;
  }

  const folders = load("folders");

  console.log("📂 folders:", folders);

  if (!folders || folders.length === 0) {
    app.innerHTML = "<p>フォルダがありません</p>";
    return;
  }

  app.innerHTML = `
    <h2>フォルダ一覧</h2>
    <ul>
      ${folders.map(f => `<li>${f.name}</li>`).join("")}
    </ul>
    <button id="addBtn">追加テスト</button>
  `;

  document.getElementById("addBtn").addEventListener("click", () => {
    alert("ここに追加機能を実装できます");
  });
}