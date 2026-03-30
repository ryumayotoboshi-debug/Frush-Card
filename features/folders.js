"use strict";

import { load, save } from "../data/storage.js";

/**
 * フォルダ追加
 */
export function addFolder(name, parentId = null) {
  const data = load();

  const newFolder = {
    id: crypto.randomUUID(),
    name,
    parentId,
    lastStudiedAt: 0 // 初期値
  };

  data.folders.push(newFolder);

  save(data);
}

/**
 * フォルダ一覧取得（並び替え付き）
 */
export function getFolders(parentId = null) {
  const data = load();

  return data.folders
    .filter(f => f.parentId === parentId)
    .sort((a, b) => (b.lastStudiedAt || 0) - (a.lastStudiedAt || 0));
}

/**
 * 🔥 学習更新
 */
export function updateFolderStudyTime(folderId) {
  const data = load();

  const folder = data.folders.find(f => f.id === folderId);

  if (folder) {
    folder.lastStudiedAt = Date.now();
    save(data);
  }
}