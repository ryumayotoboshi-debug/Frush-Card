import { renderQuestion, renderTags, renderTagButtons } from "../ui/render.js";

let cards = [
  {
    word: "apple",
    answer: "りんご",
    choices: ["りんご", "みかん", "ぶどう", "バナナ"],
    explanation: "果物の一種",
    tags: []
  },
  {
    word: "dog",
    answer: "犬",
    choices: ["猫", "犬", "鳥", "魚"],
    explanation: "人間の友達",
    tags: []
  }
];

let current = null;
let isAnswered = false;

export function startQuiz() {
  document.getElementById("homeScreen").style.display = "none";
  document.getElementById("quizScreen").style.display = "block";

  nextQuestion();
}

export function nextQuestion() {
  isAnswered = false;

  current = cards[Math.floor(Math.random() * cards.length)];

  document.getElementById("result").textContent = "";
  document.getElementById("explanation").textContent = "";
  document.getElementById("nextBtn").style.display = "none";
  document.getElementById("skipBtn").style.display = "inline-block";

  renderQuestion(current, selectAnswer);
  renderTags(current.tags);
  renderTagButtons(current, updateTags);
}

export function selectAnswer(choice) {
  if (isAnswered) return;

  isAnswered = true;

  const result = document.getElementById("result");
  const explanation = document.getElementById("explanation");

  if (choice === current.answer) {
    result.textContent = "正解！";
  } else {
    result.textContent = "不正解";
  }

  explanation.textContent = current.explanation;

  // ★ 選択肢消す
  document.getElementById("choices").innerHTML = "";

  // ★ スキップ消す
  document.getElementById("skipBtn").style.display = "none";

  // ★ 次へ表示
  document.getElementById("nextBtn").style.display = "inline-block";
}

export function skipQuestion() {
  if (isAnswered) return;
  nextQuestion();
}

function updateTags(card, tag) {
  if (!card.tags) card.tags = [];

  if (card.tags.includes(tag)) {
    card.tags = card.tags.filter(t => t !== tag);
  } else {
    card.tags.push(tag);
  }

  renderTags(card.tags);
}