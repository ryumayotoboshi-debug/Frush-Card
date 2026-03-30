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
    parentId
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