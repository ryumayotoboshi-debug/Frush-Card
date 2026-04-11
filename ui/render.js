"use strict";

import { load, save } from "../data/storage.js";

let currentFolderId = null;
let quizWords = [];
let currentQuizIndex = 0;

// =======================
// フォルダ一覧
// =======================
export function drawFolderScreen() {
  const app = document.getElementById("app");
  if (!app) return;

  const folders = load("folders") || [];

  app.innerHTML = `
    <h2>フォルダ一覧</h2>

    <ul>
      ${folders.map(f => `
        <li>
          <span class="folderName" data-id="${f.id}" style="cursor:pointer;">
            ${f.name}
          </span>
          <button data-id="${f.id}" class="deleteBtn">削除</button>
        </li>
      `).join("")}
    </ul>

    <hr>

    <h3>フォルダ追加</h3>
    <input type="text" id="folderInput" placeholder="フォルダ名を入力" style="font-size:16px;">
    <button id="addBtn">追加</button>
  `;

  // 追加
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

  // 削除（confirmあり）
  document.querySelectorAll(".deleteBtn").forEach(btn => {
    btn.addEventListener("click", () => {
      if (!confirm("削除しますか？")) return;

      const id = btn.dataset.id;
      const newFolders = folders.filter(f => f.id !== id);
      save("folders", newFolders);

      drawFolderScreen();
    });
  });

  // フォルダクリック
  document.querySelectorAll(".folderName").forEach(el => {
    el.addEventListener("click", () => {
      currentFolderId = el.dataset.id;
      drawWordScreen();
    });
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

  // 戻る
  document.getElementById("backBtn").addEventListener("click", () => {
    currentFolderId = null;
    drawFolderScreen();
  });

  // クイズ開始
  document.getElementById("quizBtn").addEventListener("click", () => {
    if (filteredWords.length < 4) {
      return alert("4択クイズには単語が4つ以上必要です");
    }

    quizWords = [...filteredWords].sort(() => Math.random() - 0.5);
    currentQuizIndex = 0;

    drawQuizScreen();
  });

  // 単語追加
  document.getElementById("addWordBtn").addEventListener("click", () => {
    const front = document.getElementById("frontInput").value.trim();
    const back = document.getElementById("backInput").value.trim();
    const note = document.getElementById("noteInput").value.trim();

    if (!front || !back) return alert("表と裏は必須です");

    const words = load("words") || [];

    words.push({
      id: crypto.randomUUID(),
      front,
      back,
      note,
      folderId: currentFolderId
    });

    save("words", words);
    drawWordScreen();
  });

  // 単語削除
  document.querySelectorAll(".deleteWordBtn").forEach(btn => {
    btn.addEventListener("click", () => {
      if (!confirm("削除しますか？")) return;

      const id = btn.dataset.id;
      const words = load("words") || [];
      const newWords = words.filter(w => w.id !== id);

      save("words", newWords);
      drawWordScreen();
    });
  });
}

// =======================
// クイズ画面（4択）
// =======================
function drawQuizScreen() {
  const app = document.getElementById("app");

  if (currentQuizIndex >= quizWords.length) {
    app.innerHTML = `
      <h2>終了！</h2>
      <button id="backBtn">戻る</button>
    `;
    document.getElementById("backBtn").addEventListener("click", drawWordScreen);
    return;
  }

  const correct = quizWords[currentQuizIndex];

  // ダミー選択肢生成
  const allWords = load("words") || [];
  const others = allWords.filter(w => w.id !== correct.id);

  const shuffled = others.sort(() => Math.random() - 0.5).slice(0, 3);
  const choices = [correct, ...shuffled].sort(() => Math.random() - 0.5);

  app.innerHTML = `
    <h2>クイズ (${currentQuizIndex + 1}/${quizWords.length})</h2>

    <p><strong>${correct.front}</strong></p>

    <div id="choices"></div>

    <p id="result"></p>
    <button id="nextBtn" style="display:none;">次へ</button>
  `;

  const choicesDiv = document.getElementById("choices");

  choices.forEach(choice => {
    const btn = document.createElement("button");
    btn.textContent = choice.back;

    btn.onclick = () => {
      const result = document.getElementById("result");

      if (choice.id === correct.id) {
        result.textContent = "✅ 正解！";
      } else {
        result.textContent = `❌ 不正解（正解: ${correct.back}）`;
      }

      document.getElementById("nextBtn").style.display = "inline";
    };

    choicesDiv.appendChild(btn);
  });

  document.getElementById("nextBtn").addEventListener("click", () => {
    currentQuizIndex++;
    drawQuizScreen();
  });
}