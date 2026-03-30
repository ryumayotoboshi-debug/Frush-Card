//DOM生成専用、画面描画の専用担当
"use strict";

import { getCards } from "../features/cards.js";
import { generateQuiz, checkAnswer, skipQuiz } from "../features/quiz.js";
import { setMode, getMode } from "../features/quiz.js";
import { toggleTag } from "../features/cards.js";
import { startQuiz } from "../features/quiz.js";

export function setupUI() {
  document
    .getElementById("startQuizBtn")
    .addEventListener("click", startQuiz);
}

export function renderQuiz() {
  const container = document.getElementById("quiz");
  container.innerHTML = "";

  const quiz = generateQuiz();

  if (!quiz) {
    container.innerHTML = "カードが足りません（4枚以上必要）";
    return;
  }

  // 問題
  const question = document.createElement("h2");
  question.textContent = quiz.question;
  container.appendChild(question);

  // 回答エリア
  const choiceArea = document.createElement("div");
  container.appendChild(choiceArea);

  // 結果エリア
  const resultArea = document.createElement("div");
  container.appendChild(resultArea);

  // タグエリア
  const tagArea = document.createElement("div");
  tagArea.className = "tag-area";
  container.appendChild(tagArea);

  // 操作エリア
  const controlArea = document.createElement("div");
  controlArea.className = "control-area";
  container.appendChild(controlArea);

  let answered = false;

  // 選択肢
  quiz.choices.forEach(choice => {
    const btn = document.createElement("button");
    btn.textContent = choice;

    btn.addEventListener("click", () => {
      if (answered) return;
      answered = true;

      const isCorrect = checkAnswer(choice);

      // 選択肢を消す
      choiceArea.innerHTML = "";

      // 結果表示
      resultArea.innerHTML = `
        <p>${isCorrect ? "正解！" : "不正解"}</p>
        <p>${quiz.description || ""}</p>
      `;

      // タグボタン生成
      ["苦手", "要復習", "完璧"].forEach(tag => {
        const tagBtn = document.createElement("button");
        tagBtn.textContent = tag;

        tagBtn.addEventListener("click", () => {
          toggleTag(quiz.cardId, tag);
        });

        tagArea.appendChild(tagBtn);
      });

      // 次へボタン
      const nextBtn = document.createElement("button");
      nextBtn.textContent = "次へ";

      nextBtn.addEventListener("click", renderQuiz);
      controlArea.appendChild(nextBtn);
    });

    choiceArea.appendChild(btn);
  });

  // スキップ（常に表示）
  const skipBtn = document.createElement("button");
  skipBtn.textContent = "スキップ";
  skipBtn.addEventListener("click", renderQuiz);
  controlArea.appendChild(skipBtn);
}


export function renderCards() {
  const container = document.getElementById("cardList");
  container.innerHTML = "";

  const cards = getCards();

  cards.forEach(card => {
    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <div class="front">${card.word}</div>
      <div class="back hidden">
        ${card.meaning}<br>
        <small>${card.description}</small>
      </div>
    `;

    div.addEventListener("click", () => {
      div.querySelector(".front").classList.toggle("hidden");
      div.querySelector(".back").classList.toggle("hidden");
    });

    container.appendChild(div);
  });
}
