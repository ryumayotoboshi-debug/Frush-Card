"use strict";

import { getFolderTree, addFolder, renameFolder, deleteFolder } from "../features/folders.js";
import { getWords, addWord, deleteWord, updateWordTags } from "../features/cards.js";
import { startQuiz } from "../features/quiz.js";

let currentFolderId = null;

// タイトル制御
function setTitle(text){
  const title = document.getElementById("mainTitle");
  if(title) title.textContent = text;
}

// ---------------- フォルダ画面 ----------------
export function drawFolderScreen(parentId = null) {
  document.body.className = "no-scroll";

  const app = document.getElementById("app");
  if (!app) return alert("appが見つかりません");

  currentFolderId = parentId;

  // ★ タイトル切り替え
  setTitle("フォルダ一覧");

  const folders = getFolderTree(parentId)
    .sort((a,b)=> (b.lastStudied||0)-(a.lastStudied||0));

  app.innerHTML = `
    <div style="padding:0 10px">
      <div id="list"></div>
      <input id="newName" placeholder="新しいフォルダ">
      <button id="addBtn">追加</button>
      ${parentId !== null ? '<button id="backBtn">← 戻る</button>' : ''}
    </div>
  `;

  const list = app.querySelector("#list");

  folders.forEach(f=>{
    const div = document.createElement("div");
    div.className = "folder-item";

    const nameBtn = document.createElement("button");
    nameBtn.textContent = f.name;
    nameBtn.className = "folder-name";

    nameBtn.onclick = ()=>{
      if(parentId === null){
        drawFolderScreen(f.id);
      } else {
        drawWordScreen(f.id, parentId);
      }
    };

    const actions = document.createElement("div");
    actions.className = "folder-actions";

    // ★ サブフォルダ追加は親フォルダのみ許可
    if(parentId !== null){
      const addSubBtn = document.createElement("button");
      addSubBtn.textContent = "+";
      addSubBtn.className = "mini-btn";
      addSubBtn.onclick = ()=>{
        const subName = prompt("サブフォルダ名");
        if(subName){ addFolder(subName,f.id); drawFolderScreen(parentId); }
      };
      actions.appendChild(addSubBtn);
    }

    const renameBtn = document.createElement("button");
    renameBtn.textContent = "✎";
    renameBtn.className = "mini-btn";
    renameBtn.onclick = ()=>{
      const newName = prompt("新しい名前", f.name);
      if(newName){ renameFolder(f.id,newName); drawFolderScreen(parentId); }
    };

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "🗑";
    deleteBtn.className = "mini-btn";
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

  // ★ タイトル切り替え
  setTitle("単語一覧");

  currentFolderId = subFolderId;
  const app = document.getElementById("app");
  const words = getWords(subFolderId);

  app.innerHTML=`
    <div style="padding:0 10px">
      <button id="backBtn">← 戻る</button>
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
    div.className="word-item";

    const text = document.createElement("div");
    text.textContent = `${w.front} → ${w.back} : ${w.note||"未設定"}`;
    div.appendChild(text);

    const tagDisplay = document.createElement("div");
    tagDisplay.className="tag-display";
    tagDisplay.textContent = w.tags.length ? `タグ: ${w.tags.join(", ")}` : "タグ: なし";
    div.appendChild(tagDisplay);

    const deleteBtn=document.createElement("button");
    deleteBtn.textContent="🗑";
    deleteBtn.className="mini-btn";
    deleteBtn.onclick=()=>{ deleteWord(w.id); drawWordScreen(subFolderId, parentFolderId); };
    div.appendChild(deleteBtn);

    const tagDiv=document.createElement("div");

    ["完璧","要復習","苦手"].forEach(tag=>{
      const b=document.createElement("button");
      b.textContent=tag;

      if(w.tags.includes(tag)){
        b.classList.add("active-tag");
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