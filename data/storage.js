"use strict";

const KEY = "wordAppData";

export function load() {
  let data;

  try {
    data = JSON.parse(localStorage.getItem(KEY));
  } catch {
    data = null;
  }

  // 🧠 データが存在しない場合のみ初期化
  if (!data) {
    const initial = createInitialData();
    save(initial);
    return initial;
  }

  // 🧠 欠損データを補完（リセットしない）
  if (!Array.isArray(data.folders)) {
    data.folders = [];
  }

  if (!Array.isArray(data.words)) {
    data.words = [];
  }

  // 🔥 ここ重要：空でもOKにする（リセット禁止）
  // data.folders.length === 0 は削除

  return data;
}

export function save(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

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