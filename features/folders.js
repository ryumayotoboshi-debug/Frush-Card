"use strict";
import { load, save } from "../data/storage.js";
import { createFolder } from "../data/models.js";

export function getFolders() {
  return load().folders;
}

export function addFolder(name, parentId = null) {
  const data = load();
  data.folders.push(createFolder(name, parentId));
  save(data);
}

export function renameFolder(id, newName) {
  const data = load();
  const folder = data.folders.find(f => f.id === id);
  if (folder) folder.name = newName;
  save(data);
}

// 階層構造で取得
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

  return build(null);
}