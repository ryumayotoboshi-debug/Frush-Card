"use strict";

import { load, save } from "../data/storage.js";

export function drawFolderScreen() {
  const app = document.getElementById("app");
  if (!app) return;

  const folders = load("folders") || [];

  app.innerHTML = `
    <h2>フォルダ一覧</h2>

    <ul>
      ${folders.map(f => `
        <li>
          ${f.name}
          <button data-id="${f.id}" class="deleteBtn">削除</button>
        </li>
      `).join("")}
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

    if (!name) return alert("フォルダ名を入力してください");

    folders.push({
      id: crypto.randomUUID(),
      name,
      parentId: null
    });

    save("folders", folders);
    drawFolderScreen();
  });

  // 削除処理
  document.querySelectorAll(".deleteBtn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;

      const newFolders = folders.filter(f => f.id !== id);
      save("folders", newFolders);

      drawFolderScreen();
    });
  });
}