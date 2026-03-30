import { getCards, updateCard } from "../data/storage.js";
import { renderQuestion, renderTags, renderTagButtons } from "../ui/render.js";

let current;
let currentFolderId;
let isAnswered = false;

export function startQuiz(folderId) {
  currentFolderId = folderId;
  nextQuestion();
}

export function nextQuestion() {
  const cards = getCards().filter(c => c.folderId === currentFolderId);
  if (cards.length === 0) {
    alert("単語がありません");
    return;
  }

  isAnswered = false;
  current = cards[Math.floor(Math.random() * cards.length)];

  document.getElementById("result").textContent = "";
  document.getElementById("explanation").textContent = "";
  document.getElementById("skipBtn").style.display = "inline-block";

  renderQuestion(current, selectAnswer);
  renderTags(current.tags || []);
  renderTagButtons(current, toggleTag);
}

export function selectAnswer(choice) {
  if (isAnswered) return;
  isAnswered = true;

  document.getElementById("result").textContent =
    choice === current.answer ? "正解" : "不正解";

  document.getElementById("explanation").textContent = current.explanation;

  document.getElementById("choices").innerHTML = "";
  document.getElementById("skipBtn").style.display = "none";
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

  updateCard(card);
  renderTags(card.tags);
}