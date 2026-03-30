"use strict";
import { getWords } from "./cards.js";
import { drawFolderScreen } from "../ui/render.js";

export function startQuiz(folderId){
  const words = getWords(folderId);
  if(words.length < 1){ alert("単語がありません"); return; }

  const app = document.getElementById("app");
  let index = 0;

  function shuffle(arr){
    return arr.sort(()=>Math.random()-0.5);
  }

  function getChoices(correctWord){
    // 他の単語から誤答を取得
    const others = words.filter(w => w.id !== correctWord.id);
    const wrongs = shuffle(others).slice(0,3).map(w=>w.back);

    // 正解を含めてシャッフル
    return shuffle([correctWord.back, ...wrongs]);
  }

  function showQuestion(){
    if(index >= words.length){
      alert("終了");
      drawFolderScreen();
      return;
    }

    const w = words[index];
    const choices = getChoices(w);

    app.innerHTML = `
      <div style="padding:0 10px">
        <h2>単語クイズ</h2>
        <div style="margin-bottom:16px">${w.front}</div>
        <div id="choices"></div>
        <button id="backBtn">戻る</button>
      </div>
    `;

    const choicesDiv = app.querySelector("#choices");

    choices.forEach(choice=>{
      const btn = document.createElement("button");
      btn.textContent = choice;
      btn.style.display = "block";
      btn.style.marginBottom = "8px";
      btn.style.width = "100%";

      btn.onclick = ()=>{
        if(choice === w.back){
          w.stats.correct++;
          alert("正解");
        } else {
          w.stats.wrong++;
          alert(`不正解\n正解: ${w.back}`);
        }
        index++;
        showQuestion();
      };

      choicesDiv.appendChild(btn);
    });

    app.querySelector("#backBtn").onclick = ()=> drawFolderScreen();
  }

  showQuestion();
}