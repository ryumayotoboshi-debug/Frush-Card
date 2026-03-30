"use strict";

import { getFolderTree, addFolder, renameFolder, deleteFolder } from "../features/folders.js";
import { getWords, addWord, deleteWord, updateWordTags } from "../features/cards.js";
import { getQuizWords } from "../features/quiz.js";

let currentFolderId = null; // 現在開いているフォルダID

// ---------------- フォルダ画面 ----------------
export function drawFolderScreen(parentId = null) {
  const app = document.getElementById("app");
  if (!app) return alert("appが見つかりません");

  currentFolderId = null; 
  const folders = getFolderTree(parentId).sort((a,b)=> (b.lastStudied||0)-(a.lastStudied||0));

  app.innerHTML = `
    <div style="padding:0 10px">
      <h2>📁 フォルダ一覧</h2>
      <div id="list"></div>
      ${parentId === null ? '<input id="newName" placeholder="新しいフォルダ"><button id="addBtn">追加</button>' : ''}
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
        drawWordScreen(f.id);
      }
    };

    const actions = document.createElement("span");

    if(parentId === null){
      const addSubBtn = document.createElement("button");
      addSubBtn.textContent = "+";
      addSubBtn.onclick = ()=>{
        const subName = prompt("サブフォルダ名");
        if(subName){ addFolder(subName,f.id); drawFolderScreen(f.id); }
      };
      actions.appendChild(addSubBtn);
    }

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

  if(parentId === null){
    app.querySelector("#addBtn")?.addEventListener("click",()=>{
      const name = app.querySelector("#newName").value.trim();
      if(!name){ alert("名前を入力してください"); return; }
      addFolder(name,null);
      app.querySelector("#newName").value="";
      drawFolderScreen();
    });
  } else {
    app.querySelector("#backBtn")?.addEventListener("click",()=>{
      drawFolderScreen(null);
    });
  }
}

// ---------------- 単語画面 ----------------
export function drawWordScreen(subFolderId){
  currentFolderId = subFolderId;
  const app = document.getElementById("app");
  const words = getWords(subFolderId);

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
    deleteBtn.onclick=()=>{ deleteWord(w.id); drawWordScreen(subFolderId); };
    div.appendChild(deleteBtn);

    const tagDiv=document.createElement("div");
    ["完璧","要復習","苦手"].forEach(tag=>{
      const b=document.createElement("button");
      b.textContent=tag;
      b.onclick=()=>{
        updateWordTags(w.id,tag);
        drawWordScreen(subFolderId);
      };
      tagDiv.appendChild(b);
    });
    div.appendChild(tagDiv);
    list.appendChild(div);
  });

  app.querySelector("#backBtn").onclick = ()=> drawFolderScreen(null);

  app.querySelector("#addWordBtn").onclick = ()=>{
    const front = app.querySelector("#wordInput").value.trim();
    const back = app.querySelector("#answerInput").value.trim();
    const note = app.querySelector("#explanationInput").value.trim();
    if(!front||!back){ alert("単語と意味は必須"); return; }
    addWord({front,back,note,folderId:subFolderId});
    drawWordScreen(subFolderId);
  };

  app.querySelector("#startQuizBtn").onclick = ()=> drawQuizScreen(subFolderId);
}

// ---------------- クイズ画面 ----------------
function drawQuizScreen(folderId){
  const app = document.getElementById("app");
  const words = getQuizWords(folderId);
  if(words.length===0){ alert("単語がありません"); return; }

  let index = 0;
  let score = 0;

  function renderQuestion(){
    app.innerHTML=`
      <div style="padding:0 10px">
        <h2>クイズ</h2>
        <div id="question"></div>
        <div id="choices"></div>
        <div id="result"></div>
        <button id="backBtn">← 単語画面へ戻る</button>
      </div>
    `;

    const q = words[index];
    app.querySelector("#question").textContent = `Q${index+1}: ${q.front}`;

    const choicesDiv = app.querySelector("#choices");

    // 正解とランダムな不正解を混ぜる
    let options = [q.back];
    while(options.length<4 && words.length>1){
      const w = words[Math.floor(Math.random()*words.length)];
      if(w.back!==q.back && !options.includes(w.back)) options.push(w.back);
    }
    // シャッフル
    options = options.sort(()=>Math.random()-0.5);

    options.forEach(opt=>{
      const btn = document.createElement("button");
      btn.textContent = opt;
      btn.style.display="block";
      btn.style.marginBottom="6px";
      btn.onclick = ()=>{
        const resultDiv = app.querySelector("#result");
        if(opt===q.back){
          resultDiv.textContent = "✅ 正解";
          score++;
        } else {
          resultDiv.textContent = `❌ 不正解 正解: ${q.back}`;
        }

        index++;
        setTimeout(()=>{ 
          if(index<words.length) renderQuestion(); 
          else alert(`終了！ 正答数 ${score}/${words.length}`); 
        }, 800);
      };
      choicesDiv.appendChild(btn);
    });

    app.querySelector("#backBtn").onclick = ()=> drawWordScreen(folderId);
  }

  renderQuestion();
}