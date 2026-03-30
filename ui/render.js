"use strict";

import { getFolderTree, addFolder, renameFolder, deleteFolder } from "../features/folders.js";
import { getWords, addWord, deleteWord, updateWordTags } from "../features/cards.js";
import { startQuiz } from "../features/quiz.js";

let currentFolderId = null;

// ---------------- フォルダ画面 ----------------
export function drawFolderScreen(parentId = null) {
  document.body.className = "no-scroll";

  const app = document.getElementById("app");
  if (!app) return alert("appが見つかりません");

  currentFolderId = parentId;

  const folders = getFolderTree(parentId)
    .sort((a,b)=> (b.lastStudied||0)-(a.lastStudied||0));

  app.innerHTML = `
    <div style="padding:0 10px">
      <h2>📁 フォルダ一覧</h2>
      <div id="list"></div>
      <input id="newName" placeholder="新しいフォルダ">
      <button id="addBtn">追加</button>
      ${parentId !== null ? '<button id="backBtn">← 戻る</button>' : ''}
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

    nameBtn.onclick = ()=>{
      if(parentId === null){
        drawFolderScreen(f.id);
      } else {
        // ★ 親フォルダIDを渡す
        drawWordScreen(f.id, parentId);
      }
    };

    const actions = document.createElement("span");

    const addSubBtn = document.createElement("button");
    addSubBtn.textContent = "+";
    addSubBtn.onclick = ()=>{
      const subName = prompt("サブフォルダ名");
      if(subName){ addFolder(subName,f.id); drawFolderScreen(parentId); }
    };
    actions.appendChild(addSubBtn);

    const renameBtn = document.createElement("button");
    renameBtn.textContent = "✎";
    renameBtn.onclick = ()=>{
      const newName = prompt("新しい名前", f.name);
      if(newName){ renameFolder(f.id,newName); drawFolderScreen(parentId); }
    };

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "🗑";
    deleteBtn.onclick = ()=>{
      if(confirm("削除しますか？")){ deleteFolder(f.id); drawFolderScreen(parentId); }
    };

    actions.appendChild(renameBtn);
    actions.appendChild(deleteBtn);

    div.appendChild(nameBtn);
    div.appendChild(actions);
    list.appendChild(div);
  });

  app.querySelector("#addBtn")?.addEventListener("click",()=>{
    const name = app.querySelector("#newName").value.trim();
    if(!name){ alert("名前を入力してください"); return; }
    addFolder(name,parentId);
    app.querySelector("#newName").value="";
    drawFolderScreen(parentId);
  });

  app.querySelector("#backBtn")?.addEventListener("click",()=>{
    drawFolderScreen(null);
  });
}

// ---------------- 単語画面 ----------------
export function drawWordScreen(subFolderId, parentFolderId){
  document.body.className = "word-screen";

  currentFolderId = subFolderId;
  const app = document.getElementById("app");
  const words = getWords(subFolderId);

  app.innerHTML=`
    <div style="padding:0 10px">
      <button id="backBtn">← 戻る</button>
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
    div.style.marginBottom="12px";

    const text = document.createElement("div");
    text.textContent = `${w.front} → ${w.back} : ${w.note||"未設定"}`;
    div.appendChild(text);

    const tagDisplay = document.createElement("div");
    tagDisplay.style.fontSize = "12px";
    tagDisplay.style.margin = "4px 0";
    tagDisplay.textContent = w.tags.length ? `タグ: ${w.tags.join(", ")}` : "タグ: なし";
    div.appendChild(tagDisplay);

    const deleteBtn=document.createElement("button");
    deleteBtn.textContent="🗑";
    deleteBtn.onclick=()=>{ deleteWord(w.id); drawWordScreen(subFolderId, parentFolderId); };
    div.appendChild(deleteBtn);

    const tagDiv=document.createElement("div");

    ["完璧","要復習","苦手"].forEach(tag=>{
      const b=document.createElement("button");
      b.textContent=tag;

      if(w.tags.includes(tag)){
        b.style.backgroundColor = "#ffd54f";
      }

      b.onclick=()=>{
        updateWordTags(w.id,tag);
        drawWordScreen(subFolderId, parentFolderId);
      };

      tagDiv.appendChild(b);
    });

    div.appendChild(tagDiv);
    list.appendChild(div);
  });

  // ★ 戻る先を親フォルダに変更
  app.querySelector("#backBtn").onclick = ()=> drawFolderScreen(parentFolderId);

  app.querySelector("#addWordBtn").onclick = ()=>{
    const front = app.querySelector("#wordInput").value.trim();
    const back = app.querySelector("#answerInput").value.trim();
    const note = app.querySelector("#explanationInput").value.trim();
    if(!front||!back){ alert("単語と意味は必須"); return; }
    addWord({front,back,note,folderId:subFolderId});
    drawWordScreen(subFolderId, parentFolderId);
  };

  app.querySelector("#startQuizBtn").onclick = ()=> startQuiz(subFolderId);
}