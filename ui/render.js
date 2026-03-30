"use strict";

console.log("render.js 読み込み成功");

import { getFolders, addFolder } from "./features/folders.js";

let currentFolderId = null;

export function draw() {
  const container = document.getElementById("app");
  container.innerHTML = "";

  const folders = getFolders(currentFolderId);

  // 🧪 デバッグ：取得確認
  console.log("表示フォルダ:", folders);

  // 📦 フォルダ一覧
  const list = document.createElement("div");
  list.style.marginTop = "10px";

  folders.forEach(folder => {
    const item = document.createElement("div");

    item.textContent = folder.name;

    // 🔥 強制的に見えるスタイル
    item.style.background = "#222";
    item.style.color = "#00ffcc";
    item.style.padding = "12px";
    item.style.marginBottom = "8px";
    item.style.borderRadius = "6px";
    item.style.border = "1px solid #00ffcc";
    item.style.fontSize = "16px";

    item.style.cursor = "pointer";

    item.onclick = () => {
      currentFolderId = folder.id;
      draw();
    };

    list.appendChild(item);
  });

  container.appendChild(list);

  // 🆕 入力欄
  const input = document.createElement("input");
  input.id = "newName";
  input.placeholder = "フォルダ名";

  input.style.display = "block";
  input.style.marginTop = "20px";
  input.style.padding = "10px";
  input.style.width = "100%";
  input.style.background = "#111";
  input.style.color = "#fff";
  input.style.border = "1px solid #555";

  // 🆕 ボタン
  const btn = document.createElement("button");
  btn.textContent = "追加";

  btn.style.marginTop = "10px";
  btn.style.padding = "10px";
  btn.style.width = "100%";
  btn.style.background = "#00ffcc";
  btn.style.color = "#000";
  btn.style.border = "none";
  btn.style.fontWeight = "bold";

  btn.onclick = () => {
    const name = input.value.trim();

    console.log("入力値:", name);

    if (!name) {
      alert("フォルダ名を入力してください");
      return;
    }

    addFolder(name, currentFolderId);

    // 🔥 保存確認
    console.log(
      "保存後:",
      JSON.parse(localStorage.getItem("wordAppData"))
    );

    input.value = "";

    draw();
  };

  container.appendChild(input);
  container.appendChild(btn);
}