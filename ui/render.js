"use strict";

import { load, save } from "../data/storage.js";

let currentFolderId = null;
let currentParentId = null;
let quizWords = [];
let currentQuizIndex = 0;

// =======================
// ★ 再帰削除
// =======================
function deleteFolderRecursive(folderId) {
  const folders = load("folders") || [];
  const words = load("words") || [];

  const childFolders = folders.filter(f => f.parentId === folderId);

  childFolders.forEach(child => {
    deleteFolderRecursive(child.id);
  });

  save("folders", folders.filter(f => f.id !== folderId));
  save("words", words.filter(w => w.folderId !== folderId));
}

// =======================
// フォルダ一覧
// =======================
export function drawFolderScreen(parentId = null) {
  const app = document.getElementById("app");
  if (!app) return;

  currentParentId = parentId;

  const folders = load("folders") || [];
  const filtered = folders.filter(f => f.parentId === parentId);

  app.innerHTML = `
    ${parentId !== null ? `<button id="backBtn">← 戻る</button>` : ""}

    <h2>${parentId === null ? "フォルダ一覧" : "サブフォルダ一覧"}</h2>

    <ul>
      ${filtered.map(f => `
        <li>
          <span class="folderName" data-id="${f.id}" style="cursor:pointer;">
            ${f.name}
          </span>
          <button data-id="${f.id}" class="deleteBtn">削除</button>
        </li>
      `).join("")}
    </ul>

    <hr>

    <h3>${parentId === null ? "フォルダ追加" : "サブフォルダ追加"}</h3>
    <input id="folderInput" placeholder="名前を入力" style="font-size:16px;">
    <button id="addBtn">追加</button>
  `;

  document.getElementById("backBtn")?.onclick = () => {
    drawFolderScreen(null);
  };

  document.getElementById("addBtn").onclick = () => {
    const name = document.getElementById("folderInput").value.trim();
    if (!name) return alert("名前を入力してください");

    folders.push({
      id: crypto.randomUUID(),
      name,
      parentId: parentId
    });

    save("folders", folders);
    drawFolderScreen(parentId);
  };

  // ★削除（再帰版）
  document.querySelectorAll(".deleteBtn").forEach(btn => {
    btn.onclick = () => {
      if (!confirm("削除しますか？")) return;

      deleteFolderRecursive(btn.dataset.id);
      drawFolderScreen(parentId);
    };
  });

  document.querySelectorAll(".folderName").forEach(el => {
    el.onclick = () => {
      const id = el.dataset.id;

      if (parentId === null) {
        drawFolderScreen(id);
      } else {
        currentFolderId = id;
        drawWordScreen();
      }
    };
  });
}

// =======================
// 単語画面
// =======================
function drawWordScreen() {
  const app = document.getElementById("app");

  const folders = load("folders") || [];
  const words = load("words") || [];

  const folder = folders.find(f => f.id === currentFolderId);
  const filteredWords = words.filter(w => w.folderId === currentFolderId);

  app.innerHTML = `
    <button id="backBtn">← 戻る</button>
    <h2>${folder ? folder.name : ""}</h2>

    <button id="quizBtn">クイズ開始</button>

    <h3>単語一覧</h3>
    <ul>
      ${filteredWords.map(w => `
        <li>
          <strong>${w.front}</strong> - ${w.back}
          <button data-id="${w.id}" class="deleteWordBtn">削除</button>
        </li>
      `).join("")}
    </ul>

    <hr>

    <h3>単語追加</h3>
    <input id="frontInput" placeholder="表" style="font-size:16px;"><br>
    <input id="backInput" placeholder="裏" style="font-size:16px;"><br>
    <input id="noteInput" placeholder="メモ" style="font-size:16px;"><br>
    <button id="addWordBtn">追加</button>
  `;

  document.getElementById("backBtn").onclick = () => {
    drawFolderScreen(currentParentId);
  };

  document.getElementById("quizBtn").onclick = () => {
    if (filteredWords.length < 4) return alert("単語が不足しています");

    quizWords = [...filteredWords].sort(() => Math.random() - 0.5);
    currentQuizIndex = 0;
    drawQuizScreen();
  };

  document.getElementById("addWordBtn").onclick = () => {
    const front = document.getElementById("frontInput").value.trim();
    const back = document.getElementById("backInput").value.trim();
    const note = document.getElementById("noteInput").value.trim();

    if (!front || !back) return alert("必須項目です");

    words.push({
      id: crypto.randomUUID(),
      front,
      back,
      note,
      folderId: currentFolderId
    });

    save("words", words);
    drawWordScreen();
  };

  document.querySelectorAll(".deleteWordBtn").forEach(btn => {
    btn.onclick = () => {
      if (!confirm("削除しますか？")) return;

      const newWords = words.filter(w => w.id !== btn.dataset.id);
      save("words", newWords);
      drawWordScreen();
    };
  });
}

// =======================
// クイズ（変更なし）
// =======================
function drawQuizScreen() {
  const app = document.getElementById("app");

  if (currentQuizIndex >= quizWords.length) {
    app.innerHTML = `<h2>終了</h2><button id="backBtn">戻る</button>`;
    document.getElementById("backBtn").onclick = drawWordScreen;
    return;
  }

  const correct = quizWords[currentQuizIndex];
  const all = load("words") || [];

  const choices = [correct, ...all.filter(w => w.id !== correct.id)
    .sort(() => Math.random() - 0.5).slice(0, 3)]
    .sort(() => Math.random() - 0.5);

  app.innerHTML = `
    <h2>${correct.front}</h2>
    <div id="choices"></div>
  `;

  const div = document.getElementById("choices");

  choices.forEach(c => {
    const b = document.createElement("button");
    b.textContent = c.back;

    b.onclick = () => {
      alert(c.id === correct.id ? "正解" : `不正解: ${correct.back}`);
      currentQuizIndex++;
      drawQuizScreen();
    };

    div.appendChild(b);
  });
}