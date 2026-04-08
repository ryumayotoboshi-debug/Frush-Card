"use strict";

import { load, save } from "../data/storage.js";

export function drawFolderScreen() {
  const app = document.getElementById("app");

  if (!app) return;

  const folders = load("folders") || [];

  app.innerHTML = `
    <h2>フォルダ一覧</h2>

    <ul>
      ${folders.map(f => `<li>${f.name}</li>`).join("")}
    </ul>

    <hr>

    <h3>フォルダ追加</h3>
    <input type="text" id="folderInput" placeholder="フォルダ名を入力">
    <button id="addBtn">追加</button>
  `;

  // 追加処理
  document.getElementById("addBtn").addEventListener("click", () => {
    const input = document.getElementById("folderInput");
    const name = input.value.trim();

    if (!name) {
      alert("フォルダ名を入力してください");
      return;
    }

    const newFolder = {
      id: crypto.randomUUID(),
      name,
      parentId: null
    };

    folders.push(newFolder);
    save("folders", folders);

    drawFolderScreen(); // ← 再描画（超重要）
  });
}