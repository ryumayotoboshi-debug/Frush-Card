"use strict";

export function createFolder(name, parentId = null) {
  return {
    id: crypto.randomUUID(),
    name,
    parentId
  };
}

export function createWord(word, meaning, description, folderId) {
  return {
    id: crypto.randomUUID(),
    word,
    meaning,
    description,
    folderId,
    tags: [],
    correct: 0,
    wrong: 0
  };
}