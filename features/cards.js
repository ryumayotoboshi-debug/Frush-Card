"use strict";
import { load, save } from "../data/storage.js";

export function getWords(folderId) {
  return load().words.filter(w => w.folderId === folderId);
}

export function addWord(folderId, front, back, note) {
  const data = load();
  data.words.push({
    id: crypto.randomUUID(),
    folderId,
    front,
    back,
    note,
    tags: [],
    stats: { correct: 0, wrong: 0 }
  });
  // フォルダのlastStudied更新
  const folder = data.folders.find(f => f.id === folderId);
  if (folder) folder.lastStudied = Date.now();
  save(data);
}

export function deleteWord(id) {
  const data = load();
  data.words = data.words.filter(w => w.id !== id);
  save(data);
}

export function updateTags(wordId, tags) {
  const data = load();
  const word = data.words.find(w => w.id === wordId);
  if (word) {
    word.tags = tags;
    save(data);
  }
}