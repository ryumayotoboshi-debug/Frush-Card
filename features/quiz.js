"use strict";

import { load } from "../data/storage.js";

let currentQuiz = null;

export function generateQuiz() {
  const data = load();
  const words = data.words;

  if (words.length < 4) {
    alert("単語が4つ以上必要です");
    return null;
  }

  // 正解をランダム選択
  const correct = words[Math.floor(Math.random() * words.length)];

  // ダミー選択
  const others = words.filter(w => w.id !== correct.id);
  shuffle(others);

  const choices = [correct, ...others.slice(0, 3)];
  shuffle(choices);

  currentQuiz = {
    question: correct.front,
    answer: correct.back,
    choices: choices.map(c => c.back)
  };

  return currentQuiz;
}

export function checkAnswer(choice) {
  if (!currentQuiz) return false;
  return choice === currentQuiz.answer;
}

// シャッフル
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}