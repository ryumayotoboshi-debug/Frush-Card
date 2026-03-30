"use strict";

import { getFolders } from "../features/folders.js";
import { addFolder, touchFolder } from "../features/folders.js";
import { getWords, addWord } from "../features/words.js";
import { load } from "../data/storage.js";

let currentFolderId = null;

export function draw() {
  const container = document.getElementById("folderList");
  container.innerHTML = "";

  const data = load();
  const currentFolder = data.folders.find(f => f.id === currentFolderId);

  // 🔙 戻る
  if (currentFolderId !== null) {
    const backBtn = document.createElement("button");
    backBtn.textContent = "← 戻る";
    backBtn.onclick = () => {
      currentFolderId = currentFolder?.parentId || null;
      draw();
    };
    container.appendChild(backBtn);
  }

  // 📂 フォルダ一覧
  const folders = getFolders(currentFolderId);

  folders
    .sort((a, b) => (b.lastStudied || 0) - (a.lastStudied || 0))
    .forEach(folder => {
      const item = document.createElement("div");
      item.textContent = folder.name;

      item.style.background = "#222";
      item.style.color = "#00ffcc";
      item.style.margin = "8px 0";
      item.style.padding = "10px";

      item.onclick = () => {
        currentFolderId = folder.id;
        draw();
      };

      container.appendChild(item);
    });

  // 📚 フォルダ内なら単語表示
  if (currentFolderId !== null) {

    const words = getWords(currentFolderId);

    // 🔤 単語リスト
    words.forEach(w => {
      const card = document.createElement("div");

      card.style.border = "1px solid #00ffcc";
      card.style.margin = "10px 0";
      card.style.padding = "10px";

      card.innerHTML = `
        <div><strong>${w.word}</strong></div>
        <div>${w.meaning}</div>
        <div style="opacity:0.7">${w.note || ""}</div>
      `;

      container.appendChild(card);
    });

    // ✏️ 単語追加フォーム
    const wordInput = document.createElement("input");
    wordInput.placeholder = "単語";

    const meaningInput = document.createElement("input");
    meaningInput.placeholder = "意味";

    const noteInput = document.createElement("input");
    noteInput.placeholder = "説明（任意）";

    const addBtn = document.createElement("button");
    addBtn.textContent = "単語を追加";

    addBtn.onclick = () => {
      if (!wordInput.value || !meaningInput.value) {
        alert("単語と意味は必須です");
        return;
      }

      addWord(
        wordInput.value,
        meaningInput.value,
        noteInput.value,
        currentFolderId
      );

      // 🧠 勉強扱い
      touchFolder(currentFolderId);

      draw();
    };

    container.appendChild(wordInput);
    container.appendChild(meaningInput);
    container.appendChild(noteInput);
    container.appendChild(addBtn);

    // 🎮 クイズボタン
    const quizBtn = document.createElement("button");
    quizBtn.textContent = "クイズ開始";

    quizBtn.onclick = () => {
      if (words.length === 0) {
        alert("単語がありません");
        return;
      }

      const q = words[Math.floor(Math.random() * words.length)];
      const answer = prompt(`${q.word} の意味は？`);

      if (answer === q.meaning) {
        alert("正解！");
      } else {
        alert(`不正解！正解は ${q.meaning}`);
      }

      // 🧠 勉強扱い
      touchFolder(currentFolderId);
    };

    container.appendChild(quizBtn);
  }

  // 📁 フォルダ追加
  const input = document.getElementById("folderNameInput");
  const btn = document.getElementById("addFolderBtn");

  btn.onclick = () => {
    if (!input.value) return;

    addFolder(input.value, currentFolderId);
    input.value = "";
    draw();
  };
}