import { getAllCards } from "../data/storage.js";
import { renderQuestion, renderTags, renderTagButtons } from "../ui/render.js";

let current;
let isAnswered = false;

export function startQuiz() {
  document.getElementById("quizScreen").style.display = "block";
  nextQuestion();
}

export function nextQuestion() {
  const cards = getAllCards();
  if (cards.length === 0) return;

  isAnswered = false;
  current = cards[Math.floor(Math.random() * cards.length)];

  document.getElementById("result").textContent = "";
  document.getElementById("explanation").textContent = "";
  document.getElementById("nextBtn").style.display = "none";
  document.getElementById("skipBtn").style.display = "inline-block";

  renderQuestion(current, selectAnswer);
  renderTags(current.tags || []);
  renderTagButtons(current, toggleTag);
}

export function selectAnswer(choice) {
  if (isAnswered) return;

  isAnswered = true;

  document.getElementById("result").textContent =
    choice === current.answer ? "正解！" : "不正解";

  document.getElementById("explanation").textContent = current.explanation;

  document.getElementById("choices").innerHTML = "";

  // ★ここ重要
  document.getElementById("skipBtn").style.display = "none";
  document.getElementById("nextBtn").style.display = "inline-block";
}

export function skipQuestion() {
  if (isAnswered) return;
  nextQuestion();
}

function toggleTag(card, tag) {
  if (!card.tags) card.tags = [];

  if (card.tags.includes(tag)) {
    card.tags = card.tags.filter(t => t !== tag);
  } else {
    card.tags.push(tag);
  }

  renderTags(card.tags);
}