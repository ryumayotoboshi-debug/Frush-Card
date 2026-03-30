"use strict";

import { load, save } from "../data/storage.js";

export function getFolders(parentId) {
  const data = load();
  return data.folders.filter(f => f.parentId === parentId);
}

export function addFolder(name, parentId) {
  const data = load();

  data.folders.push({
    id: Date.now().toString(),
    name,
    parentId,
    lastStudied: 0
  });

  save(data);
}

// ⭐ 追加：勉強した扱い
export function touchFolder(folderId) {
  const data = load();

  const folder = data.folders.find(f => f.id === folderId);
  if (folder) {
    folder.lastStudied = Date.now();
  }

  save(data);
}