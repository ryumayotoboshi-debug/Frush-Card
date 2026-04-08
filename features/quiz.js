"use strict";

import { load } from "../data/storage.js";

let quizWords = [];
let currentIndex = 0;

export function startQuiz() {
  const data = load();

  if (!data.words || data.words.length < 4) {
    alert("単語が4つ以上必要です");
    return;
  }

  // シャッフルして使用
  quizWords = shuffle([...data.words]);
  currentIndex = 0;

  showQuestion();
}

function showQuestion() {
  const container = document.getElementById("quiz");
  container.innerHTML = "";

  if (currentIndex >= quizWords.length) {
    container.innerHTML = "<p>終了しました</p>";
    return;
  }

  const correct = quizWords[currentIndex];

  // ダミー選択肢を作る
  const choices = createChoices(correct);

  const question = document.createElement("h3");
  question.textContent = correct.front;

  container.appendChild(question);

  choices.forEach(choice => {
    const btn = document.createElement("button");
    btn.textContent = choice.back;

    btn.onclick = () => {
      if (choice.id === correct.id) {
        alert("正解！");
      } else {
        alert(`不正解… 正解は「${correct.back}」`);
      }
      currentIndex++;
      showQuestion();
    };

    container.appendChild(btn);
  });
}

function createChoices(correct) {
  const data = load();

  const others = data.words.filter(w => w.id !== correct.id);
  const shuffled = shuffle(others).slice(0, 3);

  const choices = shuffle([correct, ...shuffled]);

  return choices;
}

// Fisher-Yatesシャッフル
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}