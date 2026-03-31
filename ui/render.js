"use strict";

import { getFolderTree, addFolder, deleteFolder, renameFolder } from "../features/folders.js";
import { getWords, addWord, deleteWord } from "../features/words.js";
import { openModal } from "./modal.js";

const app = document.getElementById("app");


// =====================
// フォルダ画面
// =====================
export function drawFolderScreen(parentId = null){

  const folders = getFolderTree(parentId);

  app.innerHTML = `
    <h1>単語帳</h1>

    <div>
      <button id="addBtn" class="cyber-btn">＋フォルダ追加</button>
    </div>

    <div id="list"></div>
  `;

  const list = app.querySelector("#list");

  folders.forEach(f=>{
    const div = document.createElement("div");
    div.className = "item";
    div.textContent = f.name;

    // フォルダクリック → 中へ
    div.onclick = ()=>{
      drawFolderScreen(f.id);
    };

    // --- 操作ボタン ---
    const renameBtn = document.createElement("button");
    renameBtn.textContent = "✏️";

    renameBtn.onclick = (e)=>{
      e.stopPropagation();

      openModal({
        title:"名前変更",
        inputs:[f.name],
        onSubmit:([name])=>{
          if(!name) return;

          renameFolder(f.id,name);
          setTimeout(()=>drawFolderScreen(parentId),0);
        }
      });
    };

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "🗑";

    deleteBtn.onclick = (e)=>{
      e.stopPropagation();

      openModal({
        title:"削除確認",
        inputs:[],
        onSubmit:()=>{
          deleteFolder(f.id);
          setTimeout(()=>drawFolderScreen(parentId),0);
        }
      });
    };

    const addSubBtn = document.createElement("button");
    addSubBtn.textContent = "＋";

    addSubBtn.onclick = (e)=>{
      e.stopPropagation();

      openModal({
        title:"サブフォルダ追加",
        inputs:["名前"],
        onSubmit:([name])=>{
          if(!name) return;

          addFolder(name,f.id);
          setTimeout(()=>drawFolderScreen(parentId),0);
        }
      });
    };

    const openWordsBtn = document.createElement("button");
    openWordsBtn.textContent = "📖";

    openWordsBtn.onclick = (e)=>{
      e.stopPropagation();
      drawWordScreen(f.id, parentId);
    };

    div.appendChild(renameBtn);
    div.appendChild(deleteBtn);
    div.appendChild(addSubBtn);
    div.appendChild(openWordsBtn);

    list.appendChild(div);
  });

  // フォルダ追加
  app.querySelector("#addBtn").onclick = ()=>{
    openModal({
      title:"フォルダ追加",
      inputs:["フォルダ名"],
      onSubmit:([name])=>{
        if(!name) return;

        addFolder(name,parentId);
        setTimeout(()=>drawFolderScreen(parentId),0);
      }
    });
  };
}


// =====================
// 単語画面
// =====================
export function drawWordScreen(subFolderId, parentFolderId){

  const words = getWords(subFolderId);

  app.innerHTML = `
    <h1>単語</h1>

    <div>
      <button id="backBtn" class="cyber-btn">戻る</button>
      <button id="addWordBtn" class="cyber-btn">＋単語追加</button>
    </div>

    <div id="list"></div>
  `;

  const list = app.querySelector("#list");

  words.forEach(w=>{
    const div = document.createElement("div");
    div.className = "item";
    div.textContent = w.front + " : " + w.back;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "🗑";

    deleteBtn.onclick = ()=>{
      openModal({
        title:"削除確認",
        inputs:[],
        onSubmit:()=>{
          deleteWord(w.id);
          setTimeout(()=>drawWordScreen(subFolderId, parentFolderId),0);
        }
      });
    };

    div.appendChild(deleteBtn);
    list.appendChild(div);
  });

  // 戻る
  app.querySelector("#backBtn").onclick = ()=>{
    drawFolderScreen(parentFolderId);
  };

  // 単語追加
  app.querySelector("#addWordBtn").onclick = ()=>{
    openModal({
      title:"単語追加",
      inputs:["単語","意味","説明"],
      onSubmit:([front,back,note])=>{
        if(!front || !back) return;

        addWord({front,back,note,folderId:subFolderId});
        setTimeout(()=>drawWordScreen(subFolderId, parentFolderId),0);
      }
    });
  };
}