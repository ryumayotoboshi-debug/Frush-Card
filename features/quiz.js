"use strict";

import { getCards, shuffleCards } from "./cards.js";
import { saveCards } from "../data/storage.js";

let currentQuiz = null;
let currentCard = null;

export function generateQuiz() {
  const cards = shuffleCards();

  if (cards.length < 4) return null;

  const correctCard = cards[0];
  currentCard = correctCard;

  const choices = [correctCard.meaning];

  for (let i = 1; i < cards.length; i++) {
    if (choices.length >= 4) break;

    if (!choices.includes(cards[i].meaning)) {
      choices.push(cards[i].meaning);
    }
  }

  const shuffledChoices = choices.sort(() => Math.random() - 0.5);

  currentQuiz = {
    question: correctCard.word,
    correctAnswer: correctCard.meaning,
    choices: shuffledChoices
  };

  return currentQuiz;
}

export function checkAnswer(answer) {
  if (!currentQuiz || !currentCard) return false;

  const isCorrect = answer === currentQuiz.correctAnswer;

  if (isCorrect) {
    currentCard.correct++;
  } else {
    currentCard.wrong++;
  }

  // 保存
  saveCards(getCards());

  return isCorrect;
}

export function skipQuiz() {
  return generateQuiz();
}