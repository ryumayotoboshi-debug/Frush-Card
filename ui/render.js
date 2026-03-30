"use strict";

import { getFolderTree, addFolder } from "../features/folders.js";

let currentFolderId = null;

export function drawFolderScreen() {
  const app = document.getElementById("app");
  if (!app) return alert("appが見つかりません");

  const folders = getFolderTree();

  app.innerHTML = `
    <h2>📁 フォルダ一覧</h2>
    <div id="list"></div>
    <input id="newName" placeholder="新しいフォルダ">
    <button id="addBtn">追加</button>
  `;

  const list = app.querySelector("#list");
  list.innerHTML = folders.map(f => `<div>${f.name}</div>`).join("");

  app.querySelector("#addBtn").onclick = () => {
    const name = app.querySelector("#newName").value.trim();
    if (!name) return alert("名前を入力してください");
    addFolder(name);
    app.querySelector("#newName").value = "";
    drawFolderScreen();
  };
}