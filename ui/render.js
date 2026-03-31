"use strict";

import { getFolderTree, addFolder, renameFolder, deleteFolder } from "../features/folders.js";
import { getWords, addWord, deleteWord, updateWordTags } from "../features/cards.js";
import { startQuiz } from "../features/quiz.js";

let currentFolderId = null;

/* =================== タイトル設定 =================== */
function setTitle(text){
  const title = document.getElementById("mainTitle");
  if(!title) return;
  title.style.display = "block";
  title.textContent = text;
}

/* =================== モーダル共通 =================== */
function createModal(innerHTML){
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";

  const box = document.createElement("div");
  box.className = "modal-box";
  box.innerHTML = innerHTML;

  overlay.appendChild(box);

  // 外側クリックでは閉じない
  document.body.appendChild(overlay);

  return overlay;
}

/* =================== フォルダ追加モーダル =================== */
function showFolderModal(parentId){
  const modal = createModal(`
    <h2>フォルダ追加</h2>
    <input id="modalInput" placeholder="フォルダ名" style="font-size:16px;">
    <div style="margin-top:10px; display:flex; gap:10px;">
      <button id="okBtn" class="cyber-btn">追加</button>
      <button id="cancelBtn" class="cyber-btn">キャンセル</button>
    </div>
  `);

  modal.querySelector("#okBtn").onclick = ()=>{
    const name = modal.querySelector("#modalInput").value.trim();
    if(!name) return alert("入力してください");
    addFolder(name,parentId);
    modal.remove();
    drawFolderScreen(parentId);
  };

  modal.querySelector("#cancelBtn").onclick = ()=> modal.remove();
}

/* =================== 単語追加モーダル =================== */
function showWordModal(folderId, parentFolderId){
  const modal = createModal(`
    <h2>単語追加</h2>
    <input id="w1" placeholder="単語" style="font-size:16px;">
    <input id="w2" placeholder="意味" style="font-size:16px; margin-top:5px;">
    <input id="w3" placeholder="説明" style="font-size:16px; margin-top:5px;">
    <div style="margin-top:10px; display:flex; gap:10px;">
      <button id="okBtn" class="cyber-btn">追加</button>
      <button id="cancelBtn" class="cyber-btn">キャンセル</button>
    </div>
  `);

  modal.querySelector("#okBtn").onclick = ()=>{
    const front = modal.querySelector("#w1").value.trim();
    const back = modal.querySelector("#w2").value.trim();
    const note = modal.querySelector("#w3").value.trim();

    if(!front || !back) return alert("単語と意味は必須");

    addWord({front, back, note, folderId});
    modal.remove();
    drawWordScreen(folderId, parentFolderId);
  };

  modal.querySelector("#cancelBtn").onclick = ()=> modal.remove();
}

/* =================== フォルダ画面 =================== */
export function drawFolderScreen(parentId=null){
  document.body.className = "no-scroll";
  const app = document.getElementById("app");
  currentFolderId = parentId;
  setTitle(parentId===null ? "単語帳" : "フォルダ一覧");

  const folders = getFolderTree(parentId)
    .sort((a,b)=> (b.lastStudied||0)-(a.lastStudied||0));

  app.innerHTML = `
    <div class="panel">
      ${parentId!==null?'<button id="backBtn" class="cyber-btn back-btn">← 戻る</button>':''}
      <div id="list"></div>
      <button id="addBtn" class="cyber-btn big-btn">＋ フォルダ追加</button>
    </div>
  `;

  const list = app.querySelector("#list");

  folders.forEach(f=>{
    const div = document.createElement("div");
    div.className = "folder-item neon-box";

    div.onclick = ()=> parentId===null ? drawFolderScreen(f.id) : drawWordScreen(f.id,parentId);

    const name = document.createElement("div");
    name.textContent = f.name;
    name.className = "folder-name";

    const actions = document.createElement("div");
    actions.className = "folder-actions";

    if(parentId!==null){
      const addSub = document.createElement("button");
      addSub.textContent = "+";
      addSub.className="mini-btn cyber-btn";
      addSub.onclick = (e)=>{
        e.stopPropagation();
        const subName = prompt("サブフォルダ名");
        if(subName){ addFolder(subName,f.id); drawFolderScreen(parentId); }
      };
      actions.appendChild(addSub);
    }

    const renameBtn = document.createElement("button");
    renameBtn.textContent="✎";
    renameBtn.className="mini-btn cyber-btn";
    renameBtn.onclick = (e)=>{ e.stopPropagation(); const newName = prompt("新しい名前", f.name); if(newName){ renameFolder(f.id,newName); drawFolderScreen(parentId); } };

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent="🗑";
    deleteBtn.className="mini-btn cyber-btn";
    deleteBtn.onclick = (e)=>{ e.stopPropagation(); if(confirm("削除しますか？")){ deleteFolder(f.id); drawFolderScreen(parentId); } };

    actions.appendChild(renameBtn);
    actions.appendChild(deleteBtn);

    div.appendChild(name);
    div.appendChild(actions);
    list.appendChild(div);
  });

  app.querySelector("#addBtn").onclick = ()=> showFolderModal(parentId);
  app.querySelector("#backBtn")?.onclick = ()=> drawFolderScreen(null);
}

/* =================== 単語画面 =================== */
export function drawWordScreen(folderId, parentFolderId){
  document.body.className = "word-screen";
  setTitle("単語一覧");
  const app = document.getElementById("app");
  const words = getWords(folderId);

  app.innerHTML=`
    <div class="panel">
      <button id="backBtn" class="cyber-btn back-btn">← 戻る</button>
      <button id="addWordBtn" class="cyber-btn big-btn">＋ 単語追加</button>
      <button id="startQuizBtn" class="cyber-btn big-btn">クイズ開始</button>
      <div id="wordList" style="margin-top:15px;"></div>
    </div>
  `;

  const list = app.querySelector("#wordList");

  words.forEach(w=>{
    const div = document.createElement("div");
    div.className="word-item neon-box";

    const front = document.createElement("div");
    front.textContent = w.front;
    front.style.fontSize="18px";
    front.style.borderBottom="1px solid #0ff";
    div.appendChild(front);

    const back = document.createElement("div");
    back.textContent = w.back;
    back.style.fontSize="16px";
    back.style.marginTop="4px";
    div.appendChild(back);

    const note = document.createElement("div");
    note.textContent = w.note || "";
    note.style.fontSize="14px";
    note.style.marginTop="2px";
    div.appendChild(note);

    const tagDiv = document.createElement("div");
    tagDiv.className="tag-container";
    ["完璧","要復習","苦手"].forEach(tag=>{
      const b = document.createElement("button");
      b.textContent=tag;
      b.className="mini-btn cyber-btn";
      if(w.tags.includes(tag)) b.classList.add("active-tag");
      b.onclick=()=>{ updateWordTags(w.id,tag); drawWordScreen(folderId,parentFolderId); };
      tagDiv.appendChild(b);
    });
    div.appendChild(tagDiv);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent="🗑";
    deleteBtn.className="mini-btn cyber-btn delete-btn";
    deleteBtn.onclick = ()=>{ if(confirm("削除しますか？")){ deleteWord(w.id); drawWordScreen(folderId,parentFolderId); } };
    div.appendChild(deleteBtn);

    list.appendChild(div);
  });

  app.querySelector("#backBtn").onclick = ()=> drawFolderScreen(parentFolderId);
  app.querySelector("#addWordBtn").onclick = ()=> showWordModal(folderId,parentFolderId);
  app.querySelector("#startQuizBtn").onclick = ()=> startQuiz(folderId);
}