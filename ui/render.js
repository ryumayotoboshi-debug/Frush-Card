"use strict";

import { getFolders } from "../features/folders.js";
import { addFolder } from "../features/folders.js";
import { load } from "../data/storage.js";

let currentFolderId = null;

export function draw() {
  const container = document.getElementById("folderList");

  if (!container) {
    alert("folderListが見つかりません");
    return;
  }

  container.innerHTML = "";

  const data = load();

  // 🧠 現在のフォルダ情報取得
  const currentFolder = data.folders.find(f => f.id === currentFolderId);

  // 🔙 戻るボタン（ルート以外で表示）
  if (currentFolderId !== null) {
    const backBtn = document.createElement("button");
    backBtn.textContent = "← 戻る";

    backBtn.style.marginBottom = "10px";
    backBtn.style.padding = "10px";
    backBtn.style.width = "100%";

    backBtn.onclick = () => {
      currentFolderId = currentFolder?.parentId || null;
      draw();
    };

    container.appendChild(backBtn);
  }

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

    item.style.cursor = "pointer";

    item.onclick = () => {
      currentFolderId = folder.id;
      draw();
    };

    container.appendChild(item);
  });

  // 🆕 入力欄
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