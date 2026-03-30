"use strict";

export function createFolder(name, parentId = null) {
  return {
    id: crypto.randomUUID(),
    name,
    parentId // ★追加（サブフォルダ対応）
  };
}

export function createWord(front, back, note, folderId) {
  return {
    id: crypto.randomUUID(),
    front,
    back,
    note,
    folderId,
    tags: [],
    stats: { correct: 0, wrong: 0 }
  };
}