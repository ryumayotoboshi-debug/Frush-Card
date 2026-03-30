//出題ロジック、正誤判定
"use strict";

import { getCards, shuffleCards } from "./cards.js";

let currentQuiz = null;

export function generateQuiz() {
  const cards = shuffleCards();

  if (cards.length < 4) {
    return null;
  }

  const correctCard = cards[0];

  const choices = [correctCard.meaning];

  // 間違い選択肢を追加
  for (let i = 1; i < cards.length; i++) {
    if (choices.length >= 4) break;

    if (!choices.includes(cards[i].meaning)) {
      choices.push(cards[i].meaning);
    }
    console.log("cards:", cards);
  }

  // シャッフル
  const shuffledChoices = choices.sort(() => Math.random() - 0.5);

  currentQuiz = {
    question: correctCard.word,
    correctAnswer: correctCard.meaning,
    choices: shuffledChoices
  };

  return currentQuiz;
}

export function checkAnswer(answer) {
  if (!currentQuiz) return false;

  return answer === currentQuiz.correctAnswer;
}

export function skipQuiz() {
  return generateQuiz();
}
