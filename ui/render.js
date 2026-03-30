//DOM生成専用、画面描画の専用担当
"use strict";

import { getCards } from "../features/cards.js";
import { generateQuiz, checkAnswer, skipQuiz } from "../features/quiz.js";
import { setMode, getMode } from "../features/quiz.js";

export function renderQuiz() {
  const container = document.getElementById("quiz");
  container.innerHTML = "";

  // モード切替ボタン
  const modeBtn = document.createElement("button");
  modeBtn.textContent =
    getMode() === "wordToMeaning"
      ? "単語 → 意味"
      : "意味 → 単語";

  modeBtn.addEventListener("click", () => {
    setMode(
      getMode() === "wordToMeaning"
        ? "meaningToWord"
        : "wordToMeaning"
    );
    renderQuiz();
  });

  container.appendChild(modeBtn);

  const quiz = generateQuiz();

  if (!quiz) {
    container.innerHTML += "<p>カードが足りません（4枚以上必要）</p>";
    return;
  }

  const question = document.createElement("h2");
  question.textContent = quiz.question;
  container.appendChild(question);

  const resultText = document.createElement("p");
  container.appendChild(resultText);

  quiz.choices.forEach(choice => {
    const btn = document.createElement("button");
    btn.textContent = choice;

    btn.addEventListener("click", () => {
      const isCorrect = checkAnswer(choice);
      resultText.textContent = isCorrect ? "正解！" : "不正解";

      setTimeout(() => renderQuiz(), 500);
    });

    container.appendChild(btn);
  });

  const skipBtn = document.createElement("button");
  skipBtn.textContent = "スキップ";

  skipBtn.addEventListener("click", renderQuiz);
  container.appendChild(skipBtn);
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
