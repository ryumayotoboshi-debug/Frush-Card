"use strict";

import { getFolders, addFolder } from "../features/folders.js";
import { load, save } from "../data/storage.js";

let currentFolderId = null;
let currentQuiz = null;

// ====================
// 画面切り替え
// ====================
function show(screenId) {
  document.getElementById("folderScreen").style.display = "none";
  document.getElementById("formScreen").style.display = "none";
  document.getElementById("quizScreen").style.display = "none";

  document.getElementById(screenId).style.display = "block";
}

// ====================
// フォルダ画面
// ====================
export function draw() {
  show("folderScreen");

  const container = document.getElementById("folderList");
  container.innerHTML = "";

  const data = load();

  // 🔥 並び替え（最近勉強した順）
  const folders = getFolders(currentFolderId).sort((a, b) => {
    return (b.lastStudied || 0) - (a.lastStudied || 0);
  });

  // 🔙 戻る
  if (currentFolderId !== null) {
    const back = document.createElement("button");
    back.textContent = "← 戻る";
    back.onclick = () => {
      const current = data.folders.find(f => f.id === currentFolderId);
      currentFolderId = current?.parentId || null;
      draw();
    };
    container.appendChild(back);
  }

  // 📁 フォルダ表示
  folders.forEach(folder => {
    const div = document.createElement("div");
    div.textContent = folder.name;

    div.style.background = "#222";
    div.style.color = "#00ffcc";
    div.style.padding = "10px";
    div.style.margin = "5px 0";

    div.onclick = () => {
      currentFolderId = folder.id;
      draw();
    };

    container.appendChild(div);
  });

  // 🆕 フォルダ追加
  const input = document.getElementById("folderNameInput");
  const btn = document.getElementById("addFolderBtn");

  btn.onclick = () => {
    const name = input.value.trim();
    if (!name) return;

    addFolder(name, currentFolderId);
    input.value = "";
    draw();
  };

  // 📘 単語登録へ
  const goForm = document.createElement("button");
  goForm.textContent = "単語を追加";
  goForm.onclick = () => showForm();
  container.appendChild(goForm);

  // 🧠 クイズへ
  const goQuiz = document.createElement("button");
  goQuiz.textContent = "クイズ開始";
  goQuiz.onclick = () => startQuiz();
  container.appendChild(goQuiz);
}

// ====================
// 単語追加
// ====================
function showForm() {
  show("formScreen");

  const addBtn = document.getElementById("addBtn");
  const back = document.getElementById("backToFolders");

  addBtn.onclick = () => {
    const word = document.getElementById("wordInput").value;
    const answer = document.getElementById("answerInput").value;
    const note = document.getElementById("explanationInput").value;

    if (!word || !answer) return;

    const data = load();

    data.words.push({
      id: crypto.randomUUID(),
      front: word,
      back: answer,
      note,
      folderId: currentFolderId,
      tags: [],
      stats: { correct: 0, wrong: 0 }
    });

    // 🔥 学習扱い
    updateLastStudied(data);

    save(data);

    alert("登録しました");
  };

  back.onclick = () => draw();
}

// ====================
// クイズ
// ====================
function startQuiz() {
  const data = load();

  const words = data.words.filter(w => w.folderId === currentFolderId);

  if (words.length === 0) {
    alert("単語がありません");
    return;
  }

  currentQuiz = words[Math.floor(Math.random() * words.length)];

  show("quizScreen");

  document.getElementById("question").textContent = currentQuiz.front;

  const choicesDiv = document.getElementById("choices");
  choicesDiv.innerHTML = "";

  const choices = shuffle([
    currentQuiz.back,
    ...data.words
      .filter(w => w.id !== currentQuiz.id)
      .slice(0, 3)
      .map(w => w.back)
  ]);

  choices.forEach(choice => {
    const btn = document.createElement("button");
    btn.textContent = choice;

    btn.onclick = () => answer(choice);

    choicesDiv.appendChild(btn);
  });

  document.getElementById("nextBtn").onclick = () => startQuiz();
  document.getElementById("backBtn").onclick = () => draw();
}

// ====================
// 回答処理
// ====================
function answer(choice) {
  const data = load();

  const correct = choice === currentQuiz.back;

  document.getElementById("result").textContent =
    correct ? "正解！" : "不正解";

  document.getElementById("explanation").textContent = currentQuiz.note;

  const word = data.words.find(w => w.id === currentQuiz.id);

  if (correct) word.stats.correct++;
  else word.stats.wrong++;

  // 🔥 学習扱い
  updateLastStudied(data);

  save(data);
}

// ====================
// 最近勉強更新
// ====================
function updateLastStudied(data) {
  const folder = data.folders.find(f => f.id === currentFolderId);
  if (folder) {
    folder.lastStudied = Date.now();
  }
}

// ====================
// シャッフル
// ====================
function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}