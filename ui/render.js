"use strict";
import { getFolderTree, addFolder, renameFolder, deleteFolder } from "../features/folders.js";
import { getWords, addWord, deleteWord, updateTags } from "../features/cards.js";

let currentFolderId = null;

export function draw() {
  const app = document.getElementById("app");
  if (!app) return;

  app.innerHTML = "";

  // フォルダ未選択時 → フォルダ一覧
  if (!currentFolderId) {
    const folders = getFolderTree();

    const container = document.createElement("div");
    container.innerHTML = "<h2>📁 フォルダ一覧</h2>";

    function renderTree(nodes, depth = 0) {
      return nodes.map(n => {
        return `
          <div style="margin-left:${depth * 20}px;">
            <span class="folder" data-id="${n.id}">${n.name}</span>
            <button data-add="${n.id}">＋</button>
            <button data-rename="${n.id}">✎</button>
            <button data-delete="${n.id}">🗑</button>
          </div>
          ${renderTree(n.children, depth + 1).join("")}
        `;
      });
    }

    const div = document.createElement("div");
    div.innerHTML = renderTree(folders).join("");
    container.appendChild(div);

    // 新規フォルダ
    const input = document.createElement("input");
    input.placeholder = "新規フォルダ";
    const btn = document.createElement("button");
    btn.textContent = "作成";

    btn.onclick = () => {
      const name = input.value.trim();
      if (!name) return;
      addFolder(name);
      draw();
    };

    container.appendChild(input);
    container.appendChild(btn);

    // イベント（フォルダ操作）
    container.onclick = (e) => {
      const id = e.target.dataset.id;
      if (id) {
        currentFolderId = id;
        draw();
      }
      if (e.target.dataset.rename) {
        const name = prompt("新しい名前");
        if (name) renameFolder(e.target.dataset.rename, name);
        draw();
      }
      if (e.target.dataset.add) {
        const name = prompt("サブフォルダ名");
        if (name) addFolder(name, e.target.dataset.add);
        draw();
      }
      if (e.target.dataset.delete) {
        if (confirm("本当に削除しますか？")) deleteFolder(e.target.dataset.delete);
        draw();
      }
    };

    app.appendChild(container);
    return;
  }

  // フォルダ選択時 → 単語一覧
  const words = getWords(currentFolderId);

  const container = document.createElement("div");
  container.innerHTML = `<button id="backFolder">← フォルダに戻る</button><h2>単語一覧</h2>`;
  container.querySelector("#backFolder").onclick = () => {
    currentFolderId = null;
    draw();
  };

  // 単語テーブル
  const table = document.createElement("table");
  table.style.width = "100%";
  table.style.borderCollapse = "collapse";
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
        <button data-tag="${w.id}" data-value="完璧" ${w.tags.includes("完璧")?"style='background:#0f0'":""}>完璧</button>
        <button data-tag="${w.id}" data-value="要復習" ${w.tags.includes("要復習")?"style='background:#ff0'":""}>要復習</button>
        <button data-tag="${w.id}" data-value="苦手" ${w.tags.includes("苦手")?"style='background:#f00'":""}>苦手</button>
      </td>
      <td><button data-delete="${w.id}">削除</button></td>
    `;
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  container.appendChild(table);

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
    addWord(currentFolderId, inputWord.value.trim(), inputBack.value.trim(), inputNote.value.trim());
    draw();
  };

  container.appendChild(inputWord);
  container.appendChild(inputBack);
  container.appendChild(inputNote);
  container.appendChild(addBtn);

  // クイズ開始
  const quizBtn = document.createElement("button");
  quizBtn.textContent = "クイズ開始";
  quizBtn.onclick = () => {
    renderQuiz(currentFolderId);
  };
  container.appendChild(quizBtn);

  // タグ付け・単語削除イベント
  container.onclick = (e) => {
    if (e.target.dataset.tag) {
      const wordId = e.target.dataset.tag;
      const value = e.target.dataset.value;
      const word = words.find(w => w.id === wordId);
      if (!word) return;
      const tags = new Set(word.tags);
      if (tags.has(value)) tags.delete(value);
      else tags.add(value);
      updateTags(wordId, Array.from(tags));
      draw();
    }
    if (e.target.dataset.delete) {
      deleteWord(e.target.dataset.delete);
      draw();
    }
  };

  app.appendChild(container);
}

// ⚡ クイズ画面
function renderQuiz(folderId) {
  const words = getWords(folderId);
  if (words.length === 0) return alert("単語がありません");

  const app = document.getElementById("app");
  app.innerHTML = `<button id="backCard">← 単語一覧に戻る</button><h2>クイズ</h2>`;

  const backBtn = app.querySelector("#backCard");
  backBtn.onclick = () => draw();

  // 単語をランダム化
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
        const tag = btn.dataset.tag;
        updateTags(w.id, Array.from(new Set([...w.tags, tag])));
        showQuestion();
      };
    });
  }

  showQuestion();
}