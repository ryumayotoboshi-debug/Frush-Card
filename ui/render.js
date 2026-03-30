import { seed } from "../data/seed.js";
import { getFolders, addFolder, addCard } from "../data/storage.js";
import { startQuiz } from "../features/quiz.js";

let currentFolder = null;

export function initApp() {
  seed();
  renderFolders();

  document.getElementById("addFolderBtn").onclick = () => {
    const name = document.getElementById("folderNameInput").value;

    addFolder({
      id: Date.now().toString(),
      name,
      parentId: currentFolder
    });

    renderFolders();
  };

  document.getElementById("addBtn").onclick = () => {
    addCard({
      word: wordInput.value,
      answer: answerInput.value,
      explanation: explanationInput.value,
      folderId: currentFolder,
      tags: []
    });

    alert("登録完了");
  };

  document.getElementById("backBtn").onclick = showFolders;
  document.getElementById("backToFolders").onclick = showFolders;
}

function renderFolders(parentId = null) {
  const list = document.getElementById("folderList");
  list.innerHTML = "";

  const folders = getFolders().filter(f => f.parentId === parentId);

  folders.forEach(f => {
    const btn = document.createElement("button");
    btn.textContent = f.name;

    btn.onclick = () => {
      currentFolder = f.id;

      // サブフォルダがあるなら潜る
      const hasChild = getFolders().some(x => x.parentId === f.id);

      if (hasChild) {
        renderFolders(f.id);
      } else {
        showMenu();
      }
    };

    list.appendChild(btn);
  });
}

function showMenu() {
  document.getElementById("folderScreen").style.display = "none";
  document.getElementById("formScreen").style.display = "block";

  const startBtn = document.createElement("button");
  startBtn.textContent = "クイズ開始";

  startBtn.onclick = () => {
    document.getElementById("formScreen").style.display = "none";
    document.getElementById("quizScreen").style.display = "block";
    startQuiz(currentFolder);
  };

  document.getElementById("formScreen").appendChild(startBtn);
}

function showFolders() {
  document.getElementById("quizScreen").style.display = "none";
  document.getElementById("formScreen").style.display = "none";
  document.getElementById("folderScreen").style.display = "block";
  renderFolders();
}

export function renderQuestion(card, onSelect) {
  const q = document.getElementById("question");
  const c = document.getElementById("choices");

  q.textContent = card.word;
  c.innerHTML = "";

  const all = JSON.parse(localStorage.getItem("cards")) || [];

  const wrongs = all
    .filter(x => x.answer !== card.answer)
    .map(x => x.answer);

  const choices = shuffle([card.answer, ...wrongs.slice(0, 3)]);

  choices.forEach(choice => {
    const btn = document.createElement("button");
    btn.textContent = choice;
    btn.onclick = () => onSelect(choice);
    c.appendChild(btn);
  });
}

export function renderTags(tags) {
  const el = document.getElementById("tagStatus");
  el.innerHTML = tags.map(t => `<span class="tag">${t}</span>`).join("");
}

export function renderTagButtons(card, onToggle) {
  const tags = ["苦手", "要復習", "完璧"];
  const el = document.getElementById("tagButtons");

  el.innerHTML = "";

  tags.forEach(tag => {
    const btn = document.createElement("button");
    btn.textContent = tag;

    if (card.tags?.includes(tag)) btn.classList.add("active");

    btn.onclick = () => onToggle(card, tag);
    el.appendChild(btn);
  });
}

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}