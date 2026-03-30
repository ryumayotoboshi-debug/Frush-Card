"use strict";

import { getFolderTree, addFolder, renameFolder, deleteFolder } from "../features/folders.js";
import { getWords, addWord, deleteWord, updateTags } from "../features/cards.js";

let currentFolderId = null;

// 全体描画
export function draw() {
  if (!currentFolderId) renderFolderView();
  else renderWordView(currentFolderId);
}

// ---------------- フォルダ画面 ----------------
function renderFolderView() {
  const app = document.getElementById("app");
  if (!app) return;

  app.innerHTML = "<h2>📁 フォルダ一覧</h2>";

  const folders = getFolderTree();

  const div = document.createElement("div");
  function renderTree(nodes, depth = 0) {
    return nodes.map(n => `
      <div style="margin-left:${depth * 20}px;">
        <span class="folder" data-id="${n.id}">${n.name}</span>
        <button data-add="${n.id}">＋</button>
        <button data-rename="${n.id}">✎</button>
        <button data-delete="${n.id}">🗑</button>
      </div>
      ${renderTree(n.children, depth + 1).join("")}
    `);
  }
  div.innerHTML = renderTree(folders).join("");
  app.appendChild(div);

  // 新規作成
  const input = document.createElement("input");
  input.placeholder = "新規フォルダ";
  const btn = document.createElement("button");
  btn.textContent = "作成";
  btn.onclick = () => {
    if (!input.value.trim()) return;
    addFolder(input.value.trim());
    draw();
  };
  app.appendChild(input);
  app.appendChild(btn);

  // フォルダ選択
  div.querySelectorAll(".folder").forEach(el => {
    el.onclick = () => {
      currentFolderId = el.dataset.id;
      draw();
    };
  });

  // サブフォルダ追加
  div.querySelectorAll("button[data-add]").forEach(btn => {
    btn.onclick = () => {
      const name = prompt("サブフォルダ名");
      if (name) addFolder(name, btn.dataset.add);
      draw();
    };
  });

  // リネーム
  div.querySelectorAll("button[data-rename]").forEach(btn => {
    btn.onclick = () => {
      const name = prompt("新しい名前");
      if (name) renameFolder(btn.dataset.rename, name);
      draw();
    };
  });

  // 削除
  div.querySelectorAll("button[data-delete]").forEach(btn => {
    btn.onclick = () => {
      if (confirm("削除しますか？")) deleteFolder(btn.dataset.delete);
      draw();
    };
  });
}

// ---------------- 単語一覧画面 ----------------
function renderWordView(folderId) {
  const app = document.getElementById("app");
  if (!app) return;

  const words = getWords(folderId);

  app.innerHTML = `<button id="backFolder">← フォルダに戻る</button><h2>単語一覧</h2>`;

  app.querySelector("#backFolder").onclick = () => {
    currentFolderId = null;
    draw();
  };

  // 単語テーブル
  const table = document.createElement("table");
  table.style.width = "100%";
  const thead = document.createElement("thead");
  thead.innerHTML = "<tr><th>単語</th><th>意味</th><th>説明</th><th>タグ</th><th>操作</th></tr>";
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  words.forEach(w => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${w.front || "未設定"}</td>
      <td>${w.back || "未設定"}</td>
      <td>${w.note || ""}</td>
      <td>
        <button data-tag="${w.id}" data-value="完璧" ${w.tags.includes("完璧") ? "style='background:#0f0'" : ""}>完璧</button>
        <button data-tag="${w.id}" data-value="要復習" ${w.tags.includes("要復習") ? "style='background:#ff0'" : ""}>要復習</button>
        <button data-tag="${w.id}" data-value="苦手" ${w.tags.includes("苦手") ? "style='background:#f00'" : ""}>苦手</button>
      </td>
      <td><button data-delete="${w.id}">削除</button></td>
    `;
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  app.appendChild(table);

  // 単語追加
  const inputWord = document.createElement("input");
  inputWord.placeholder = "単語";
  const inputBack = document.createElement("input");
  inputBack.placeholder = "意味";
  const inputNote = document.createElement("input");
  inputNote.placeholder = "説明";
  const addBtn = document.createElement("button");
  addBtn.textContent = "追加";
  addBtn.onclick = () => {
    if (!inputWord.value.trim() || !inputBack.value.trim()) return;
    addWord(folderId, inputWord.value.trim(), inputBack.value.trim(), inputNote.value.trim());
    draw();
  };
  app.appendChild(inputWord);
  app.appendChild(inputBack);
  app.appendChild(inputNote);
  app.appendChild(addBtn);

  // タグ付け・単語削除
  tbody.querySelectorAll("button[data-tag]").forEach(btn => {
    btn.onclick = () => {
      const word = words.find(w => w.id === btn.dataset.tag);
      if (!word) return;
      const tags = new Set(word.tags);
      if (tags.has(btn.dataset.value)) tags.delete(btn.dataset.value);
      else tags.add(btn.dataset.value);
      updateTags(word.id, Array.from(tags));
      draw();
    };
  });
  tbody.querySelectorAll("button[data-delete]").forEach(btn => {
    btn.onclick = () => {
      deleteWord(btn.dataset.delete);
      draw();
    };
  });

  // クイズ開始ボタン
  const quizBtn = document.createElement("button");
  quizBtn.textContent = "クイズ開始";
  quizBtn.onclick = () => renderQuiz(folderId);
  app.appendChild(quizBtn);
}

// ---------------- クイズ画面 ----------------
function renderQuiz(folderId) {
  const words = getWords(folderId);
  if (!words.length) return alert("単語がありません");

  const app = document.getElementById("app");
  app.innerHTML = `<button id="backCard">← 単語一覧に戻る</button><h2>クイズ</h2>`;

  app.querySelector("#backCard").onclick = () => draw();

  const quizWords = [...words].sort(() => Math.random() - 0.5);
  let idx = 0;

  const qDiv = document.createElement("div");
  app.appendChild(qDiv);

  function showQuestion() {
    if (idx >= quizWords.length) return alert("終了！");
    const w = quizWords[idx];
    qDiv.innerHTML = `<p>単語: ${w.front}</p><p>${w.back}</p>
      <button data-tag="完璧">完璧</button>
      <button data-tag="要復習">要復習</button>
      <button data-tag="苦手">苦手</button>
      <button id="next">次へ</button>
    `;
    qDiv.querySelector("#next").onclick = () => {
      idx++;
      showQuestion();
    };
    qDiv.querySelectorAll("button[data-tag]").forEach(btn => {
      btn.onclick = () => {
        updateTags(w.id, Array.from(new Set([...w.tags, btn.dataset.tag])));
        showQuestion();
      };
    });
  }
  showQuestion();
}