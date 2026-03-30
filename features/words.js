"use strict";

import { load, save } from "../data/storage.js";

// 単語取得
export function getWords(folderId) {
  const data = load();
  return data.words.filter(w => w.folderId === folderId);
}

// 単語追加
export function addWord(word, meaning, note, folderId) {
  const data = load();

  data.words.push({
    id: Date.now().toString(),
    word,
    meaning,
    note,
    folderId,
    updatedAt: Date.now() // ← 後で使う
  });

  save(data);
}