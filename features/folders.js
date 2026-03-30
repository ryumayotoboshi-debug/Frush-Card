"use strict";
import { load, save } from "../data/storage.js";
import { createFolder } from "../data/models.js";

export function getFolders() {
  return load().folders;
}

export function addFolder(name, parentId = null) {
  const data = load();
  const folder = createFolder(name, parentId);
  data.folders.push(folder);
  save(data);
}

export function renameFolder(id, newName) {
  const data = load();
  const f = data.folders.find(x => x.id === id);
  if (f) f.name = newName;
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

  return build(null);
}