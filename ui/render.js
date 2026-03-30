"use strict";

import { getFolderTree, addFolder, renameFolder } from "../features/folders.js";
import { getWords, addWord, updateWordTags } from "../features/cards.js";
import { startQuiz } from "../features/quiz.js";

let currentFolderId = null;

export function drawFolderScreen() {
  const app = document.getElementById("app");
  if (!app) return alert("appが見つかりません");

  const folders = getFolderTree().sort((a,b)=> (b.lastStudied||0)-(a.lastStudied||0));

  app.innerHTML = `
    <h2>📁 フォルダ一覧</h2>
    <div id="list"></div>
    <input id="newName" placeholder="新しいフォルダ">
    <button id="addBtn">追加</button>
  `;

  const list = app.querySelector("#list");
  folders.forEach(f => {
    const div = document.createElement("div");
    div.textContent = f.name;
    div.style.cursor = "pointer";
    div.style.margin = "4px 0";
    div.onclick = () => drawWordScreen(f.id);
    list.appendChild(div);
  });

  app.querySelector("#addBtn").onclick = () => {
    const name = app.querySelector("#newName").value.trim();
    if (!name) return alert("名前を入力してください");
    addFolder(name, currentFolderId);
    app.querySelector("#newName").value = "";
    drawFolderScreen();
  };
}

function drawWordScreen(folderId) {
  currentFolderId = folderId;
  const app = document.getElementById("app");
  const words = getWords(folderId);

  app.innerHTML = `
    <button id="backBtn">← フォルダへ戻る</button>
    <h2>単語一覧</h2>
    <div id="wordList"></div>
    <input id="wordInput" placeholder="単語">
    <input id="answerInput" placeholder="意味">
    <input id="explanationInput" placeholder="説明">
    <button id="addWordBtn">追加</button>
    <button id="startQuizBtn">クイズ開始</button>
  `;

  const list = app.querySelector("#wordList");
  words.forEach(w=>{
    const div = document.createElement("div");
    div.textContent = `${w.front} → ${w.back} : ${w.note}`;
    const tagDiv = document.createElement("div");
    ["完璧","要復習","苦手"].forEach(tag=>{
      const b = document.createElement("button");
      b.textContent = tag;
      b.onclick = ()=>{
        updateWordTags(w.id, tag);
        drawWordScreen(folderId);
      };
      tagDiv.appendChild(b);
    });
    div.appendChild(tagDiv);
    list.appendChild(div);
  });

  app.querySelector("#backBtn").onclick = () => drawFolderScreen();

  app.querySelector("#addWordBtn").onclick = () => {
    const front = app.querySelector("#wordInput").value.trim();
    const back = app.querySelector("#answerInput").value.trim();
    const note = app.querySelector("#explanationInput").value.trim();
    if(!front||!back){ alert("単語と意味は必須"); return; }
    addWord({front,back,note,folderId});
    drawWordScreen(folderId);
  };

  app.querySelector("#startQuizBtn").onclick = () => startQuiz(folderId);
}