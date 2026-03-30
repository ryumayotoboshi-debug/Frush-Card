import { startQuiz, skipQuestion, nextQuestion } from "../features/quiz.js";

export function setupUI() {
  const startBtn = document.getElementById("startQuizBtn");
  const skipBtn = document.getElementById("skipBtn");
  const nextBtn = document.getElementById("nextBtn");

  // ★ nullチェック（これがないと静かに死ぬ）
  if (!startBtn) {
    console.error("startQuizBtnが見つかりません");
    return;
  }

  startBtn.addEventListener("click", startQuiz);
  skipBtn.addEventListener("click", skipQuestion);
  nextBtn.addEventListener("click", nextQuestion);
}

export function renderQuestion(card, onSelect) {
  const q = document.getElementById("question");
  const c = document.getElementById("choices");

  q.textContent = card.word;
  c.innerHTML = "";

  card.choices.forEach(choice => {
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

    if (card.tags && card.tags.includes(tag)) {
      btn.classList.add("active");
    }

    btn.onclick = () => onToggle(card, tag);
    container.appendChild(btn);
  });
}