"use strict";

import { getFolderTree, addFolder, renameFolder, deleteFolder } from "../features/folders.js";
import { getWords, addWord, deleteWord, updateWordTags } from "../features/cards.js";
import { startQuiz } from "../features/quiz.js";

let currentFolderId = null;

export function drawFolderScreen() {
  const app = document.getElementById("app");
  if (!app) return alert("appが見つかりません");

  // 最近勉強した順にソート
  const folders = getFolderTree().sort((a,b)=> (b.lastStudied||0)-(a.lastStudied||0));

  app.innerHTML = `
    <h2>📁 フォルダ一覧</h2>
    <div id="list"></div>
    <input id="newName" placeholder="新しいフォルダ">
    <button id="addBtn">追加</button>
  `;

  const list = app.querySelector("#list");

  function renderTree(nodes, depth=0){
    return nodes.map(f=>{
      const div = document.createElement("div");
      div.style.marginLeft = `${depth*20}px`;
      div.style.display = "flex";
      div.style.alignItems = "center";
      div.style.justifyContent = "space-between";

      const nameBtn = document.createElement("span");
      nameBtn.textContent = f.name;
      nameBtn.style.cursor="pointer";
      nameBtn.onclick = ()=> drawWordScreen(f.id);

      const actions = document.createElement("span");

      const addSubBtn = document.createElement("button");
      addSubBtn.textContent = "+";
      addSubBtn.onclick = ()=>{
        const subName = prompt("サブフォルダ名");
        if(subName) { addFolder(subName, f.id); drawFolderScreen(); }
      };

      const renameBtn = document.createElement("button");
      renameBtn.textContent = "✎";
      renameBtn.onclick = ()=>{
        const newName = prompt("新しい名前", f.name);
        if(newName){ renameFolder(f.id,newName); drawFolderScreen(); }
      };

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "🗑";
      deleteBtn.onclick = ()=>{
        if(confirm("削除しますか？")){ deleteFolder(f.id); drawFolderScreen(); }
      };

      actions.appendChild(addSubBtn);
      actions.appendChild(renameBtn);
      actions.appendChild(deleteBtn);

      div.appendChild(nameBtn);
      div.appendChild(actions);

      list.appendChild(div);

      if(f.children) renderTree(f.children, depth+1);
    });
  }

  renderTree(folders);

  app.querySelector("#addBtn").onclick = ()=>{
    const name = app.querySelector("#newName").value.trim();
    if(!name){ alert("名前を入力してください"); return; }
    addFolder(name, currentFolderId);
    app.querySelector("#newName").value="";
    drawFolderScreen();
  };
}

function drawWordScreen(folderId){
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
    div.style.marginBottom="8px";
    div.textContent = `${w.front} → ${w.back} : ${w.note || "未設定"}`;

    // 削除ボタン
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent="🗑";
    deleteBtn.onclick=()=>{ deleteWord(w.id); drawWordScreen(folderId); };
    div.appendChild(deleteBtn);

    // タグボタン
    const tagDiv = document.createElement("div");
    ["完璧","要復習","苦手"].forEach(tag=>{
      const b=document.createElement("button");
      b.textContent=tag;
      b.onclick=()=>{
        updateWordTags(w.id,tag);
        drawWordScreen(folderId);
      };
      tagDiv.appendChild(b);
    });
    div.appendChild(tagDiv);
    list.appendChild(div);
  });

  app.querySelector("#backBtn").onclick = ()=> drawFolderScreen();

  app.querySelector("#addWordBtn").onclick = ()=>{
    const front = app.querySelector("#wordInput").value.trim();
    const back = app.querySelector("#answerInput").value.trim();
    const note = app.querySelector("#explanationInput").value.trim();
    if(!front||!back){ alert("単語と意味は必須"); return; }
    addWord({front,back,note,folderId});
    drawWordScreen(folderId);
  };

  app.querySelector("#startQuizBtn").onclick = ()=> startQuiz(folderId);
}