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

// ================= モーダル共通 =================
function createModal(innerHTML){
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";

  const box = document.createElement("div");
  box.className = "modal-box";
  box.innerHTML = innerHTML;

  overlay.appendChild(box);

  overlay.onclick = ()=> overlay.remove();
  box.onclick = e=> e.stopPropagation();

  document.body.appendChild(overlay);
}

// フォルダ追加モーダル
function showFolderModal(parentId){
  createModal(`
    <h2>フォルダ追加</h2>
    <input id="modalInput" placeholder="フォルダ名">
    <button id="okBtn" class="cyber-btn big-btn">確定</button>
    <button id="cancelBtn" class="cyber-btn big-btn">キャンセル</button>
  `);

  document.getElementById("okBtn").onclick = ()=>{
    const name = document.getElementById("modalInput").value.trim();
    if(!name) return alert("入力してください");
    addFolder(name,parentId);
    document.querySelector(".modal-overlay").remove();
    drawFolderScreen(parentId);
  };

  document.getElementById("cancelBtn").onclick = ()=>{
    document.querySelector(".modal-overlay").remove();
  };
}

// 単語追加モーダル
function showWordModal(folderId, parentFolderId){
  createModal(`
    <h2>単語追加</h2>
    <input id="w1" placeholder="単語">
    <input id="w2" placeholder="意味">
    <input id="w3" placeholder="説明">
    <button id="okBtn" class="cyber-btn big-btn">確定</button>
    <button id="cancelBtn" class="cyber-btn big-btn">キャンセル</button>
  `);

  document.getElementById("okBtn").onclick = ()=>{
    const front = document.getElementById("w1").value.trim();
    const back = document.getElementById("w2").value.trim();
    const note = document.getElementById("w3").value.trim();
    if(!front || !back) return alert("単語と意味は必須");
    addWord({front, back, note, folderId});
    document.querySelector(".modal-overlay").remove();
    drawWordScreen(folderId, parentFolderId);
  };

  document.getElementById("cancelBtn").onclick = ()=>{
    document.querySelector(".modal-overlay").remove();
  };
}

// ================= フォルダ画面 =================
export function drawFolderScreen(parentId=null){
  document.body.className = "no-scroll";
  currentFolderId = parentId;
  const app = document.getElementById("app");
  if(!app) return;

  setTitle(parentId===null?"単語帳":"フォルダ一覧");

  const folders = getFolderTree(parentId).sort((a,b)=> (b.lastStudied||0)-(a.lastStudied||0));

  app.innerHTML = `
    <div class="panel">
      ${parentId!==null?'<button id="backBtn" class="cyber-btn back-btn">← 戻る</button>':''}
      <div id="list"></div>
      <button id="addBtn" class="cyber-btn big-btn">＋ 追加</button>
    </div>
  `;

  const list = app.querySelector("#list");
  folders.forEach(f=>{
    const div=document.createElement("div");
    div.className="folder-item neon-box";
    div.onclick = ()=> parentId===null? drawFolderScreen(f.id) : drawWordScreen(f.id,parentId);

    const name = document.createElement("div");
    name.textContent=f.name;
    name.className="folder-name";

    const actions=document.createElement("div");
    actions.className="folder-actions";

    const renameBtn=document.createElement("button");
    renameBtn.textContent="✎";
    renameBtn.className="mini-btn cyber-btn";
    renameBtn.onclick = e=> { e.stopPropagation(); const newName=prompt("新しい名前",f.name); if(newName){ renameFolder(f.id,newName); drawFolderScreen(parentId); }};

    const deleteBtn=document.createElement("button");
    deleteBtn.textContent="🗑";
    deleteBtn.className="mini-btn cyber-btn";
    deleteBtn.onclick = e=> { e.stopPropagation(); if(confirm("削除しますか？")){ deleteFolder(f.id); drawFolderScreen(parentId); }};

    actions.appendChild(renameBtn);
    actions.appendChild(deleteBtn);

    div.appendChild(name);
    div.appendChild(actions);
    list.appendChild(div);
  });

  app.querySelector("#addBtn").onclick = ()=> showFolderModal(parentId);
  app.querySelector("#backBtn")?.onclick = ()=> drawFolderScreen(null);
}

// ================= 単語画面 =================
export function drawWordScreen(subFolderId,parentFolderId){
  document.body.className="word-screen";
  currentFolderId=subFolderId;

  const app=document.getElementById("app");
  const words=getWords(subFolderId);

  setTitle("単語一覧");

  app.innerHTML=`
    <div class="panel">
      <button id="backBtn" class="cyber-btn back-btn">← 戻る</button>
      <div id="wordList"></div>
      <button id="addWordBtn" class="cyber-btn big-btn floating-add">＋ 単語追加</button>
      <button id="startQuizBtn" class="cyber-btn big-btn floating-quiz">クイズ開始</button>
    </div>
  `;

  const list = app.querySelector("#wordList");
  words.forEach(w=>{
    const div=document.createElement("div");
    div.className="word-item neon-box";

    // 単語
    const frontDiv=document.createElement("div");
    frontDiv.textContent=w.front;
    frontDiv.className="word-front";
    div.appendChild(frontDiv);

    // 下線
    const hr=document.createElement("hr");
    div.appendChild(hr);

    // 意味
    const backDiv=document.createElement("div");
    backDiv.textContent=w.back;
    backDiv.className="word-back";
    div.appendChild(backDiv);

    // 説明文
    const noteDiv=document.createElement("div");
    noteDiv.textContent=w.note||"";
    noteDiv.className="word-note";
    div.appendChild(noteDiv);

    // タグ
    const tagDiv=document.createElement("div");
    tagDiv.className="tag-container";
    ["完璧","要復習","苦手"].forEach(tag=>{
      const b=document.createElement("button");
      b.textContent=tag;
      b.className="mini-btn cyber-btn";
      if(w.tags.includes(tag)) b.classList.add("active-tag");
      b.onclick=()=> { updateWordTags(w.id,tag); drawWordScreen(subFolderId,parentFolderId); };
      tagDiv.appendChild(b);
    });
    div.appendChild(tagDiv);

    // 削除ボタン
    const deleteBtn=document.createElement("button");
    deleteBtn.textContent="🗑";
    deleteBtn.className="mini-btn cyber-btn delete-btn";
    deleteBtn.onclick=()=>{
      if(confirm("削除しますか？")){
        deleteWord(w.id);
        drawWordScreen(subFolderId,parentFolderId);
      }
    };
    div.appendChild(deleteBtn);

    list.appendChild(div);
  });

  app.querySelector("#backBtn").onclick = ()=> drawFolderScreen(parentFolderId);
  app.querySelector("#addWordBtn").onclick = ()=> showWordModal(subFolderId,parentFolderId);
  app.querySelector("#startQuizBtn").onclick = ()=> startQuiz(subFolderId);
}