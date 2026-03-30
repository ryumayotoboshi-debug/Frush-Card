"use strict";

const KEY = "wordAppData";

export function load() {
  const data = JSON.parse(localStorage.getItem(KEY));

  // ★ 初回起動時のみ初期データ生成
  if (!data) {
    const initial = createInitialData();
    localStorage.setItem(KEY, JSON.stringify(initial));
    return initial;
  }

  return data;
}

export function save(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

// ★ ここで初期データを確実に生成
function createInitialData() {
  const rootId = crypto.randomUUID();
  const subId = crypto.randomUUID();

  return {
    folders: [
      { id: rootId, name: "英単語", parentId: null },
      { id: subId, name: "基礎", parentId: rootId }
    ],
    words: [
      {
        id: crypto.randomUUID(),
        front: "apple",
        back: "りんご",
        note: "果物",
        folderId: subId,
        tags: [],
        stats: { correct: 0, wrong: 0 }
      },
      {
        id: crypto.randomUUID(),
        front: "book",
        back: "本",
        note: "読むもの",
        folderId: subId,
        tags: [],
        stats: { correct: 0, wrong: 0 }
      },
      {
        id: crypto.randomUUID(),
        front: "run",
        back: "走る",
        note: "動作",
        folderId: subId,
        tags: [],
        stats: { correct: 0, wrong: 0 }
      },
      {
        id: crypto.randomUUID(),
        front: "blue",
        back: "青",
        note: "色",
        folderId: subId,
        tags: [],
        stats: { correct: 0, wrong: 0 }
      }
    ]
  };
}