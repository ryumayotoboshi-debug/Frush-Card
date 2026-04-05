"use strict";

import { getFolderTree, addFolder, renameFolder, deleteFolder } from "../features/folders.js";
import { getWords, addWord, deleteWord, updateWordTags } from "../features/cards.js";
import { startQuiz } from "../features/quiz.js";

let currentFolderId = null;

function setTitle(text){
  const title = document.getElementById("mainTitle");
  if(!title) return;
  title.style.display = "block";
  title.textContent = text;
}

// ---------------- フォルダ画面 ----------------
export function drawFolderScreen(parentId = null) {
  document.body.className = "no-scroll";

  const app = document.getElementById("app");
  if (!app) return;

  currentFolderId = parentId;
  setTitle(parentId === null ? "単語帳" : "フォルダ一覧");

  const folders = (getFolderTree(parentId) || [])
    .sort((a,b)=> (b.lastStudied||0)-(a.lastStudied||0));

  app.innerHTML = `
    <div class="panel">
      ${parentId !== null ? '<button id="backBtn" class="cyber-btn back-btn">← 戻る</button>' : ''}

      <button id="showAddFolder" class="mini-btn cyber-btn" style="position:fixed; top:110px; right:10px;">＋</button>

      <div id="addFolderForm" style="display:none;">
        <input id="newFolderName" placeholder="フォルダ名">
        <button id="createFolderBtn" class="cyber-btn">追加</button>
      </div>

      <div id="list"></div>
    </div>
  `;

  const list = app.querySelector("#list");

  folders.forEach(f=>{
    const div = document.createElement("div");
    div.className = "folder-item neon-box";

    div.onclick = ()=>{
      if(parentId === null){
        drawFolderScreen(f.id);
      } else {
        drawWordScreen(f.id, parentId);
      }
    };

    const nameBtn = document.createElement("button");
    nameBtn.textContent = f.name;
    nameBtn.className = "folder-name";

    const actions = document.createElement("div");
    actions.className = "folder-actions";

    const renameBtn = document.createElement("button");
    renameBtn.textContent = "✎";
    renameBtn.className = "mini-btn cyber-btn";
    renameBtn.onclick = (e)=>{
      e.stopPropagation();
      const newName = prompt("新しい名前", f.name);
      if(newName){
        renameFolder(f.id,newName);
        setTimeout(()=>drawFolderScreen(parentId),0);
      }
    };

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "🗑";
    deleteBtn.className = "mini-btn cyber-btn";
    deleteBtn.onclick = (e)=>{
      e.stopPropagation();
      if(confirm("削除しますか？")){
        deleteFolder(f.id);
        setTimeout(()=>drawFolderScreen(parentId),0);
      }
    };

    actions.appendChild(renameBtn);
    actions.appendChild(deleteBtn);

    div.appendChild(nameBtn);
    div.appendChild(actions);
    list.appendChild(div);
  });

  // ★追加ボタン（安全化）
  const showBtn = app.querySelector("#showAddFolder");
  const form = app.querySelector("#addFolderForm");

  if(showBtn && form){
    showBtn.onclick = ()=>{
      form.style.display = "block";
    };
  }

  const createBtn = app.querySelector("#createFolderBtn");
  const input = app.querySelector("#newFolderName");

  if(createBtn && input){
    createBtn.onclick = ()=>{
      const name = input.value.trim();
      if(!name) return alert("名前を入力してください");

      addFolder(name,parentId);
      setTimeout(()=>drawFolderScreen(parentId),0);
    };
  }

  app.querySelector("#backBtn")?.onclick = ()=>{
    drawFolderScreen(null);
  };
}

// ---------------- 単語画面 ----------------
export function drawWordScreen(subFolderId, parentFolderId){
  document.body.className = "word-screen";

  setTitle("単語一覧");

  currentFolderId = subFolderId;
  const app = document.getElementById("app");
  const words = getWords(subFolderId) || [];

  app.innerHTML=`
    <div class="panel">
      <button id="backBtn" class="cyber-btn back-btn">← 戻る</button>

      <button id="showAddWord" class="mini-btn cyber-btn" style="position:fixed; top:110px; right:10px;">＋</button>

      <div id="addWordForm" style="display:none;">
        <input id="wordInput" placeholder="単語">
        <input id="answerInput" placeholder="意味">
        <input id="explanationInput" placeholder="説明">
        <button id="createWordBtn" class="cyber-btn">追加</button>
      </div>

      <div id="wordList"></div>

      <button id="startQuizBtn" class="cyber-btn">クイズ開始</button>
    </div>
  `;

  const list = app.querySelector("#wordList");

  words.forEach(w=>{
    const div=document.createElement("div");
    div.className="word-item neon-box";

    const front = document.createElement("div");
    front.textContent = w.front;
    front.style.fontSize = "18px";
    front.style.borderBottom = "1px solid #0ff";

    const back = document.createElement("div");
    back.textContent = w.back;

    const note = document.createElement("div");
    note.textContent = w.note || "";

    div.appendChild(front);
    div.appendChild(back);
    div.appendChild(note);

    // ★タグ安全化
    const tagDiv=document.createElement("div");
    tagDiv.className="tag-container";

    const tags = w.tags || [];

    ["完璧","要復習","苦手"].forEach(tag=>{
      const b=document.createElement("button");
      b.textContent=tag;
      b.className="mini-btn cyber-btn";

      if(tags.includes(tag)){
        b.classList.add("active-tag");
      }

      b.onclick=()=>{
        updateWordTags(w.id,tag);
        setTimeout(()=>drawWordScreen(subFolderId, parentFolderId),0);
      };

      tagDiv.appendChild(b);
    });

    div.appendChild(tagDiv);

    const deleteBtn=document.createElement("button");
    deleteBtn.textContent="🗑";
    deleteBtn.className="mini-btn cyber-btn delete-btn";
    deleteBtn.onclick=()=>{
      if(confirm("削除しますか？")){
        deleteWord(w.id);
        setTimeout(()=>drawWordScreen(subFolderId, parentFolderId),0);
      }
    };

    div.appendChild(deleteBtn);

    list.appendChild(div);
  });

  app.querySelector("#backBtn").onclick = ()=> drawFolderScreen(parentFolderId);

  // ★追加UI（安全化）
  const showWordBtn = app.querySelector("#showAddWord");
  const wordForm = app.querySelector("#addWordForm");

  if(showWordBtn && wordForm){
    showWordBtn.onclick = ()=>{
      wordForm.style.display = "block";
    };
  }

  const createWordBtn = app.querySelector("#createWordBtn");
  const wordInput = app.querySelector("#wordInput");
  const answerInput = app.querySelector("#answerInput");
  const explanationInput = app.querySelector("#explanationInput");

  if(createWordBtn && wordInput && answerInput && explanationInput){
    createWordBtn.onclick = ()=>{
      const front = wordInput.value.trim();
      const back = answerInput.value.trim();
      const note = explanationInput.value.trim();

      if(!front||!back) return alert("単語と意味は必須");

      addWord({front,back,note,folderId:subFolderId});
      setTimeout(()=>drawWordScreen(subFolderId, parentFolderId),0);
    };
  }

  app.querySelector("#startQuizBtn").onclick = ()=> startQuiz(subFolderId);
}