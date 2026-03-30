"use strict";
import { getFolderTree, addFolder, renameFolder } from "../features/folders.js";

export function renderFolderView(container, onSelect) {
  container.innerHTML = `
    <h2>📁 フォルダ選択</h2>

    <button id="createBtn">新規作成</button>
    <div id="createArea" style="display:none; margin-top:10px;">
      <input id="newFolderName" placeholder="フォルダ名">
      <button id="createExec">作成</button>
    </div>

    <div id="folderList"></div>
  `;

  const list = container.querySelector("#folderList");
  const createArea = container.querySelector("#createArea");

  function renderTree(tree, depth = 0) {
    return tree.map(f => `
      <div style="margin-left:${depth * 20}px;">
        <span class="folder" data-id="${f.id}">${f.name}</span>
        <button data-add="${f.id}">＋</button>
        <button data-rename="${f.id}">✎</button>
      </div>
      ${renderTree(f.children, depth + 1)}
    `).join("");
  }

  function refresh() {
    list.innerHTML = renderTree(getFolderTree());
  }

  refresh();

  // フォルダ選択
  list.addEventListener("click", e => {
    if (e.target.classList.contains("folder")) {
      onSelect(e.target.dataset.id);
    }
  });

  // 新規作成UI表示
  container.querySelector("#createBtn").onclick = () => {
    createArea.style.display = "block";
  };

  // 作成実行
  container.querySelector("#createExec").onclick = () => {
    const name = container.querySelector("#newFolderName").value.trim();
    if (!name) return;

    addFolder(name);
    container.querySelector("#newFolderName").value = "";
    createArea.style.display = "none";

    refresh();
  };

  // サブフォルダ追加
  list.addEventListener("click", e => {
    if (e.target.dataset.add) {
      const name = prompt("サブフォルダ名");
      if (name) {
        addFolder(name, e.target.dataset.add);
        refresh();
      }
    }
  });

  // リネーム
  list.addEventListener("click", e => {
    if (e.target.dataset.rename) {
      const name = prompt("新しい名前");
      if (name) {
        renameFolder(e.target.dataset.rename, name);
        refresh();
      }
    }
  });
}