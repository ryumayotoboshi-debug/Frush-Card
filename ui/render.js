import { startQuiz, skipQuestion, nextQuestion } from "../features/quiz.js";
import { addCard } from "../data/storage.js";
import { seed } from "../data/seed.js";

export function setupUI() {
  seed();

  document.getElementById("startQuizBtn").onclick = startQuiz;
  document.getElementById("skipBtn").onclick = skipQuestion;
  document.getElementById("nextBtn").onclick = nextQuestion;

  document.getElementById("addBtn").onclick = () => {
    const word = document.getElementById("wordInput").value;
    const answer = document.getElementById("answerInput").value;
    const explanation = document.getElementById("explanationInput").value;

    const card = {
      word,
      answer,
      explanation,
      tags: []
    };

    addCard(card);
    alert("登録しました");
  };
}

// ★ 全カードから選択肢を自動生成
export function renderQuestion(card, onSelect) {
  const q = document.getElementById("question");
  const c = document.getElementById("choices");

  q.textContent = card.word;
  c.innerHTML = "";

  const all = JSON.parse(localStorage.getItem("cards")) || [];

  const wrongs = all
    .filter(c => c.answer !== card.answer)
    .map(c => c.answer);

  const shuffled = shuffle([card.answer, ...wrongs.slice(0, 3)]);

  shuffled.forEach(choice => {
    const btn = document.createElement("button");
    btn.textContent = choice;
    btn.onclick = () => onSelect(choice);
    c.appendChild(btn);
  });
}

export function renderTags(tags) {
  const el = document.getElementById("tagStatus");
  el.innerHTML = "";

  tags.forEach(tag => {
    const span = document.createElement("span");
    span.textContent = tag;
    span.className = "tag-label";
    el.appendChild(span);
  });
}

export function renderTagButtons(card, onToggle) {
  const tags = ["苦手", "要復習", "完璧"];
  const container = document.getElementById("tagButtons");

  container.innerHTML = "";

  tags.forEach(tag => {
    const btn = document.createElement("button");
    btn.textContent = tag;

    if (card.tags?.includes(tag)) {
      btn.classList.add("active");
    }

    btn.onclick = () => onToggle(card, tag);
    container.appendChild(btn);
  });
}

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}