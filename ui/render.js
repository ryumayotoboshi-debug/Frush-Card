"use strict";
import { getFolderTree, addFolder, renameFolder } from "../features/folders.js";

export function renderFolderView(container, onSelect) {
  container.innerHTML = `
    <h2>📁 フォルダ選択</h2>
    <button id="addRoot">＋ フォルダ追加</button>
    <div id="folderList"></div>
  `;

  const list = container.querySelector("#folderList");

  function renderTree(tree, depth = 0) {
    return tree.map(f => `
      <div style="margin-left:${depth * 20}px;">
        <span class="folder-name" data-id="${f.id}">${f.name}</span>
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
    if (e.target.classList.contains("folder-name")) {
      onSelect(e.target.dataset.id);
    }
  });

  // 追加
  container.querySelector("#addRoot").onclick = () => {
    const name = prompt("フォルダ名");
    if (name) {
      addFolder(name);
      refresh();
    }
  };

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