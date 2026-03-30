"use strict";

import { getFolderTree, addFolder, renameFolder, deleteFolder } from "../features/folders.js";
import { getWords, addWord, updateWordTags } from "../features/cards.js";
import { startQuiz } from "../features/quiz.js";

let currentFolderId = null;

export function drawFolderScreen() {
  const app = document.getElementById("app");
  if (!app) return alert("appが見つかりません");

  const folders = getFolderTree();

  app.innerHTML = `
    <h2>📁 フォルダ選択</h2>
    <button id="backBtn" style="display:none;">戻る</button>
    <button id="newBtn">新規作成</button>
    <div id="newArea" style="display:none;">
      <input id="newName" placeholder="フォルダ名">
      <button id="createBtn">作成</button>
    </div>
    <div id="list"></div>
  `;

  const list = app.querySelector("#list");

  function renderTree(nodes, depth = 0) {
    return nodes.map(n => `
      <div style="margin-left:${depth*20}px; padding:4px; border:1px solid #00ffcc; border-radius:6px; margin-bottom:4px; background:#222; color:#0ff; cursor:pointer;">
        <span class="folder" data-id="${n.id}">${n.name}</span>
        <button data-add="${n.id}">＋</button>
        <button data-rename="${n.id}">✎</button>
        <button data-delete="${n.id}">🗑️</button>
      </div>
      ${renderTree(n.children, depth+1)}
    `).join("");
  }

  list.innerHTML = renderTree(folders);

  // 新規作成
  app.querySelector("#newBtn").onclick = () => {
    app.querySelector("#newArea").style.display = "block";
  };

  app.querySelector("#createBtn").onclick = () => {
    const name = app.querySelector("#newName").value.trim();
    if (!name) return alert("フォルダ名を入力してください");
    addFolder(name, currentFolderId);
    app.querySelector("#newName").value = "";
    drawFolderScreen();
  };

  // 戻るボタン
  const backBtn = app.querySelector("#backBtn");
  backBtn.onclick = () => {
    currentFolderId = null;
    drawFolderScreen();
  };
  backBtn.style.display = currentFolderId ? "inline-block" : "none";

  // フォルダ操作
  list.onclick = (e) => {
    const id = e.target.dataset.id || e.target.dataset.add || e.target.dataset.rename || e.target.dataset.delete;
    if (!id) return;

    // 選択
    if (e.target.classList.contains("folder")) {
      currentFolderId = id;
      drawWordScreen();
      return;
    }

    // サブフォルダ作成
    if (e.target.dataset.add) {
      const name = prompt("サブフォルダ名");
      if (name) {
        addFolder(name, e.target.dataset.add);
        drawFolderScreen();
      }
      return;
    }

    // リネーム
    if (e.target.dataset.rename) {
      const name = prompt("新しい名前");
      if (name) {
        renameFolder(id, name);
        drawFolderScreen();
      }
      return;
    }

    // 削除
    if (e.target.dataset.delete) {
      if (confirm("本当に削除しますか？")) {
        deleteFolder(id);
        drawFolderScreen();
      }
      return;
    }
  };
};

// 単語一覧画面
function drawWordScreen() {
  const app = document.getElementById("app");
  const words = getWords(currentFolderId);

  app.innerHTML = `
    <h2>📖 単語一覧</h2>
    <button id="backBtn">戻る</button>
    <div id="wordList"></div>
    <input id="wordInput" placeholder="単語">
    <input id="answerInput" placeholder="意味">
    <input id="explanationInput" placeholder="説明">
    <button id="addBtn">登録</button>
    <button id="quizStartBtn">クイズ開始</button>
  `;

  app.querySelector("#backBtn").onclick = () => drawFolderScreen();

  const list = app.querySelector("#wordList");
  list.innerHTML = words.map(w => `
    <div style="margin-bottom:4px; padding:4px; border:1px solid #0ff; border-radius:4px;">
      ${w.front || "未設定"} - ${w.back || "未設定"} - ${w.note || "未設定"}
      <button data-tag="${w.id}" data-value="perfect">完璧</button>
      <button data-tag="${w.id}" data-value="review">要復習</button>
      <button data-tag="${w.id}" data-value="bad">苦手</button>
    </div>
  `).join("");

  // タグ付け
  list.onclick = (e) => {
    if (e.target.dataset.tag) {
      updateWordTags(e.target.dataset.tag, e.target.dataset.value);
      drawWordScreen();
    }
  };

  // 単語追加
  app.querySelector("#addBtn").onclick = () => {
    const front = app.querySelector("#wordInput").value.trim();
    const back = app.querySelector("#answerInput").value.trim();
    const note = app.querySelector("#explanationInput").value.trim();
    if (!front || !back) return alert("単語と意味は必須です");
    addWord({ front, back, note, folderId: currentFolderId });
    drawWordScreen();
  };

  // クイズ開始
  app.querySelector("#quizStartBtn").onclick = () => {
    startQuiz(currentFolderId, () => drawWordScreen());
  };
}