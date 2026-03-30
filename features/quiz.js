"use strict";
import { getWords } from "./cards.js";
import { drawFolderScreen } from "../ui/render.js";

export function startQuiz(folderId){
  const words = getWords(folderId);
  if(!words.length){ alert("単語がありません"); return; }

  const app = document.getElementById("app");
  let index=0;

  function showQuestion(){
    if(index>=words.length){ alert("終了"); drawFolderScreen(); return; }
    const w=words[index];

    app.innerHTML=`
      <h2>単語クイズ</h2>
      <div>${w.front}</div>
      <div>
        <button id="okBtn">正解</button>
        <button id="ngBtn">不正解</button>
      </div>
      <button id="backBtn">戻る</button>
    `;

    app.querySelector("#okBtn").onclick = ()=>{
      w.stats.correct++;
      index++;
      showQuestion();
    };
    app.querySelector("#ngBtn").onclick = ()=>{
      w.stats.wrong++;
      index++;
      showQuestion();
    };
    app.querySelector("#backBtn").onclick = ()=>drawFolderScreen();
  }

  showQuestion();
}