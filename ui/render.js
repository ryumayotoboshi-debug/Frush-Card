"use strict";

import { getFolderTree, addFolder, renameFolder, deleteFolder } from "../features/folders.js";
import { getWords, addWord, deleteWord, updateWordTags } from "../features/cards.js";
import { startQuiz } from "../features/quiz.js";

let currentFolderId = null;

// ---------------- フォルダ画面 ----------------
export function drawFolderScreen() {
  const app = document.getElementById("app");
  if (!app) return alert("appが見つかりません");

  const folders = getFolderTree(currentFolderId).sort((a,b)=> (b.lastStudied||0)-(a.lastStudied||0));

  app.innerHTML = `
    <div style="padding:0 10px">
      <h2>📁 フォルダ一覧</h2>
      <div id="list"></div>
      <input id="newName" placeholder="新しいフォルダ">
      <button id="addBtn">追加</button>
      ${currentFolderId ? '<button id="backBtn">← 戻る</button>' : ''}
    </div>
  `;

  const list = app.querySelector("#list");

  folders.forEach(f=>{
    const div = document.createElement("div");
    div.style.display = "flex";
    div.style.justifyContent = "space-between";
    div.style.alignItems = "center";
    div.style.marginBottom = "8px";

    const nameBtn = document.createElement("button");
    nameBtn.textContent = f.name;
    nameBtn.style.flex="1";
    // ★ここで単語画面に遷移
    nameBtn.onclick = ()=> drawWordScreen(f.id);

    const actions = document.createElement("span");

    const addSubBtn = document.createElement("button");
    addSubBtn.textContent = "+";
    addSubBtn.onclick = ()=>{
      const subName = prompt("サブフォルダ名");
      if(subName){ addFolder(subName,f.id); drawFolderScreen(); }
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
  });

  app.querySelector("#addBtn").onclick = ()=>{
    const name = app.querySelector("#newName").value.trim();
    if(!name){ alert("名前を入力してください"); return; }
    addFolder(name,currentFolderId);
    app.querySelector("#newName").value="";
    drawFolderScreen();
  };

  if(currentFolderId){
    app.querySelector("#backBtn").onclick = ()=> {
      currentFolderId = null;
      drawFolderScreen();
    };
  }
}

// ---------------- 単語画面 ----------------
export function drawWordScreen(folderId){
  currentFolderId = folderId;
  const app = document.getElementById("app");
  const words = getWords(folderId);

  app.innerHTML=`
    <div style="padding:0 10px">
      <button id="backBtn">← フォルダへ戻る</button>
      <h2>単語一覧</h2>
      <div id="wordList"></div>
      <input id="wordInput" placeholder="単語">
      <input id="answerInput" placeholder="意味">
      <input id="explanationInput" placeholder="説明">
      <button id="addWordBtn">追加</button>
      <button id="startQuizBtn">クイズ開始</button>
    </div>
  `;

  const list = app.querySelector("#wordList");
  words.forEach(w=>{
    const div=document.createElement("div");
    div.style.marginBottom="8px";
    div.textContent=`${w.front} → ${w.back} : ${w.note||"未設定"}`;

    const deleteBtn=document.createElement("button");
    deleteBtn.textContent="🗑";
    deleteBtn.onclick=()=>{ deleteWord(w.id); drawWordScreen(folderId); };
    div.appendChild(deleteBtn);

    const tagDiv=document.createElement("div");
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