"use strict";

import { load, save } from "../data/storage.js";

let currentFolderId = null;

// =======================
// フォルダ一覧画面
// =======================
export function drawFolderScreen() {
  const app = document.getElementById("app");
  if (!app) return;

  const folders = load("folders") || [];

  app.innerHTML = `
    <h2>フォルダ一覧</h2>

    <ul>
      ${folders.map(f => `
        <li>
          <span class="folderName" data-id="${f.id}" style="cursor:pointer;">
            ${f.name}
          </span>
          <button data-id="${f.id}" class="deleteBtn">削除</button>
        </li>
      `).join("")}
    </ul>

    <hr>

    <h3>フォルダ追加</h3>
    <input 
      type="text" 
      id="folderInput" 
      placeholder="フォルダ名を入力"
      style="font-size:16px;"
    >
    <button id="addBtn">追加</button>
  `;

  // ===== 追加 =====
  document.getElementById("addBtn").addEventListener("click", () => {
    const input = document.getElementById("folderInput");
    const name = input.value.trim();

    if (!name) return alert("フォルダ名を入力してください");

    folders.push({
      id: crypto.randomUUID(),
      name,
      parentId: null
    });

    save("folders", folders);
    drawFolderScreen();
  });

  // ===== 削除（confirm追加）=====
  document.querySelectorAll(".deleteBtn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;

      if (!confirm("削除しますか？")) return;

      const newFolders = folders.filter(f => f.id !== id);
      save("folders", newFolders);

      drawFolderScreen();
    });
  });

  // ===== フォルダクリック → 遷移 =====
  document.querySelectorAll(".folderName").forEach(el => {
    el.addEventListener("click", () => {
      currentFolderId = el.dataset.id;
      drawWordScreen();
    });
  });
}

// =======================
// 単語画面（仮）
// =======================
function drawWordScreen() {
  const app = document.getElementById("app");

  const folders = load("folders") || [];
  const folder = folders.find(f => f.id === currentFolderId);

  app.innerHTML = `
    <button id="backBtn">← 戻る</button>

    <h2>${folder ? folder.name : "フォルダ"}</h2>

    <p>ここに単語一覧が表示されます</p>
  `;

  // 戻るボタン
  document.getElementById("backBtn").addEventListener("click", () => {
    currentFolderId = null;
    drawFolderScreen();
  });
}