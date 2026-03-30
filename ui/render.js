import { startQuiz, skipQuestion, nextQuestion } from "../features/quiz.js";
import { addCard } from "../data/storage.js";
import { seed } from "../data/seed.js";

export function setupUI() {
  seed();

  // クイズ操作
  document.getElementById("startQuizBtn").onclick = startQuiz;
  document.getElementById("skipBtn").onclick = skipQuestion;
  document.getElementById("nextBtn").onclick = nextQuestion;

  // 登録
  document.getElementById("addBtn").onclick = () => {
    const card = {
      word: document.getElementById("wordInput").value,
      answer: document.getElementById("answerInput").value,
      choices: [
        document.getElementById("choice1").value,
        document.getElementById("choice2").value,
        document.getElementById("choice3").value,
        document.getElementById("choice4").value
      ],
      explanation: document.getElementById("explanationInput").value,
      tags: []
    };

    addCard(card);
    alert("登録しました");
  };
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

    if (card.tags?.includes(tag)) {
      btn.classList.add("active");
    }

    btn.onclick = () => onToggle(card, tag);
    container.appendChild(btn);
  });
}