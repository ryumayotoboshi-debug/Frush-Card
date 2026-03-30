"use strict";

import { load, save } from "../storage.js";

/**
 * フォルダ追加
 */
export function addFolder(name, parentId = null) {
  const data = load();

  const newFolder = {
    id: crypto.randomUUID(),
    name,
    parentId
  };

  data.folders.push(newFolder);

  save(data);

  // 🔍 デバッグ（保存確認）
  console.log("追加後データ:", load());
}

/**
 * フォルダ一覧取得
 */
export function getFolders(parentId = null) {
  const data = load();
  return data.folders.filter(f => f.parentId === parentId);
}

/**
 * フォルダリネーム
 */
export function renameFolder(id, newName) {
  const data = load();

  const folder = data.folders.find(f => f.id === id);
  if (folder) {
    folder.name = newName;
    save(data);
  }
}

/**
 * フォルダ削除
 */
export function deleteFolder(id) {
  const data = load();

  data.folders = data.folders.filter(f => f.id !== id);

  save(data);
}