"use strict";

import { load, save } from "../data/storage.js";

// ------------------------
// 単語取得
// ------------------------
export function getWords(folderId){
  const data = load();

  // folderIdが一致する単語のみ返す
  return data.words.filter(w => w.folderId === folderId);
}


// ------------------------
// 単語追加
// ------------------------
export function addWord({ front, back, note, folderId }){
  const data = load();

  data.words.push({
    id: crypto.randomUUID(),
    front,
    back,
    note,
    folderId,
    tags: [],
    stats: {
      correct: 0,
      wrong: 0
    }
  });

  // 学習日時更新（任意だが元仕様に合わせる）
  const f = data.folders.find(f => f.id === folderId);
  if(f) f.lastStudied = Date.now();

  save(data);
}


// ------------------------
// 単語削除
// ------------------------
export function deleteWord(id){
  const data = load();

  data.words = data.words.filter(w => w.id !== id);

  save(data);
}