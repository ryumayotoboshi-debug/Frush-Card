"use strict";

import { getFolders, addFolder } from "./features/folders.js";

let currentFolderId = null;

export function draw() {
  const container = document.getElementById("app");
  container.innerHTML = "";

  const folders = getFolders(currentFolderId);

  // 📦 フォルダ表示
  const list = document.createElement("div");

  folders.forEach(folder => {
    const item = document.createElement("div");
    item.textContent = folder.name;
    item.style.padding = "10px";
    item.style.borderBottom = "1px solid #ccc";
    item.style.cursor = "pointer";

    item.onclick = () => {
      currentFolderId = folder.id;
      draw();
    };

    list.appendChild(item);
  });

  container.appendChild(list);

  // 🆕 新規作成エリア
  const input = document.createElement("input");
  input.id = "newName";
  input.placeholder = "フォルダ名";
  input.style.display = "block";
  input.style.marginTop = "10px";

  const btn = document.createElement("button");
  btn.id = "createBtn";
  btn.textContent = "新規作成";
  btn.style.marginTop = "5px";

  btn.onclick = () => {
    const name = input.value.trim();
    if (!name) return;

    addFolder(name);

    // 🔍 保存確認ログ
    console.log(
      "保存確認:",
      JSON.parse(localStorage.getItem("wordAppData"))
    );

    input.value = "";

    // 🔥 再描画（これが重要）
    draw();
  };

  container.appendChild(input);
  container.appendChild(btn);
}