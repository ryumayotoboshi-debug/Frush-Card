"use strict";
import { getFolderTree, addFolder, renameFolder } from "../features/folders.js";

export function renderFolderView(container, onSelect) {

  function draw() {
    const tree = getFolderTree();

    container.innerHTML = `
      <h2>📁 フォルダ選択</h2>

      <button id="newBtn">新規作成</button>

      <div id="newArea" style="display:none;">
        <input id="newName" placeholder="フォルダ名">
        <button id="createBtn">作成</button>
      </div>

      <div id="list"></div>
    `;

    const list = container.querySelector("#list");

    function renderTree(nodes, depth = 0) {
      return nodes.map(n => `
        <div style="margin-left:${depth * 20}px;">
          <span class="folder" data-id="${n.id}">${n.name}</span>
          <button data-add="${n.id}">＋</button>
          <button data-rename="${n.id}">✎</button>
        </div>
        ${renderTree(n.children, depth + 1)}
      `).join("");
    }

    list.innerHTML = renderTree(tree);

    // ===== イベント（毎回付け直す） =====

    container.querySelector("#newBtn").onclick = () => {
      container.querySelector("#newArea").style.display = "block";
    };

    container.querySelector("#createBtn").onclick = () => {
      const input = container.querySelector("#newName");
      const name = input.value.trim();

      if (!name) return;

      addFolder(name);
      input.value = "";

      draw(); // ★ 再描画（これが重要）
    };

    list.onclick = (e) => {

      // フォルダ選択
      if (e.target.classList.contains("folder")) {
        onSelect(e.target.dataset.id);
        return;
      }

      // サブフォルダ
      if (e.target.dataset.add) {
        const name = prompt("サブフォルダ名");
        if (name) {
          addFolder(name, e.target.dataset.add);
          draw();
        }
      }

      // リネーム
      if (e.target.dataset.rename) {
        const name = prompt("新しい名前");
        if (name) {
          renameFolder(e.target.dataset.rename, name);
          draw();
        }
      }
    };
  }

  draw();
}