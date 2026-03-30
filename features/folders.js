"use strict";
import { load, save } from "../data/storage.js";

export function getFolders() {
  return load().folders;
}

export function addFolder(name, parentId = null) {
  const data = load();
  data.folders.push({
    id: crypto.randomUUID(),
    name,
    parentId,
    lastStudied: null
  });
  save(data);
}

export function renameFolder(id, newName) {
  const data = load();
  const target = data.folders.find(f => f.id === id);
  if (target) {
    target.name = newName;
    save(data);
  }
}

export function deleteFolder(id) {
  const data = load();
  // フォルダとそのサブフォルダを削除
  function removeRecursive(folderId) {
    const children = data.folders.filter(f => f.parentId === folderId);
    children.forEach(c => removeRecursive(c.id));
    data.folders = data.folders.filter(f => f.id !== folderId);
    data.words = data.words.filter(w => w.folderId !== folderId);
  }
  removeRecursive(id);
  save(data);
}

export function getFolderTree() {
  const folders = getFolders();
  function build(parentId = null) {
    return folders
      .filter(f => f.parentId === parentId)
      .map(f => ({
        ...f,
        children: build(f.id)
      }));
  }
  return build();
}