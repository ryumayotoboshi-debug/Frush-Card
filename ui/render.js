"use strict";

import { getFolders, addFolder } from "../features/folders.js";

let currentFolderId = null;

export function draw() {
  console.log("draw() 実行");

  // 🔥 修正ポイント
  const container = document.getElementById("folderList");

  if (!container) {
    alert("folderListが見つかりません");
    return;
  }

  container.innerHTML = "";

  const folders = getFolders(currentFolderId);

  // 📦 フォルダ一覧
  folders.forEach(folder => {
    const item = document.createElement("div");

    item.textContent = folder.name;

    item.style.background = "#222";
    item.style.color = "#00ffcc";
    item.style.padding = "12px";
    item.style.marginBottom = "8px";
    item.style.borderRadius = "6px";
    item.style.border = "1px solid #00ffcc";

    item.onclick = () => {
      currentFolderId = folder.id;
      draw();
    };

    container.appendChild(item);
  });

  // 🆕 入力欄（既存HTMLを使う）
  const input = document.getElementById("folderNameInput");
  const btn = document.getElementById("addFolderBtn");

  if (btn) {
    btn.onclick = () => {
      const name = input.value.trim();

      if (!name) {
        alert("フォルダ名を入力してください");
        return;
      }

      addFolder(name, currentFolderId);

      input.value = "";

      draw();
    };
  }
}