"use strict";

import { getCards, shuffleCards } from "./cards.js";
import { saveCards } from "../data/storage.js";
import { getWeightedRandomCard } from "./cards.js";

let currentQuiz = null;
let currentCard = null;
let mode = "wordToMeaning"; // ←追加
let isAnswered = false;

export function startQuiz() {
  document.getElementById("homeScreen").style.display = "none";
  document.getElementById("quizScreen").style.display = "block";

  nextQuestion();
}

export function setMode(newMode) {
  mode = newMode;
}

export function getMode() {
  return mode;
}

function showQuestion(q) {
  isAnswered = false;

  document.getElementById("result").textContent = "";
  document.getElementById("nextBtn").style.display = "none";
  document.getElementById("skipBtn").style.display = "inline-block";

  renderQuestion(q);
}

export function generateQuiz() {
  const cards = shuffleCards();
  if (cards.length < 4) return null;

  const correctCard = getWeightedRandomCard();
  currentCard = correctCard;

  let question, correctAnswer;

  if (mode === "wordToMeaning") {
    question = correctCard.word;
    correctAnswer = correctCard.meaning;
  } else {
    question = correctCard.meaning;
    correctAnswer = correctCard.word;
  }

  const choices = [correctAnswer];

  for (let i = 1; i < cards.length; i++) {
    if (choices.length >= 4) break;

    const value =
      mode === "wordToMeaning"
        ? cards[i].meaning
        : cards[i].word;

    if (!choices.includes(value)) {
      choices.push(value);
    }
  }

  const shuffledChoices = choices.sort(() => Math.random() - 0.5);

  currentQuiz = {
  question,
  correctAnswer,
  choices,
  description: correctCard.description,
  cardId: correctCard.id
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

  saveCards(getCards());
  return isCorrect;
}

export function selectAnswer(choice) {
  if (isAnswered) return;

  isAnswered = true;

  const resultEl = document.getElementById("result");

  if (choice === currentQuestion.answer) {
    resultEl.textContent = "正解！";
  } else {
    resultEl.textContent = "不正解";
  }

  // ★ スキップボタンを消す
  document.getElementById("skipBtn").style.display = "none";

  // ★ 次へボタンを表示
  document.getElementById("nextBtn").style.display = "inline-block";

  // ★ 選択肢を消す
  document.getElementById("choices").innerHTML = "";
}

export function skipQuiz() {
  return generateQuiz();
}

export function skipQuestion() {
  if (isAnswered) return; // 念のため

  nextQuestion();
}