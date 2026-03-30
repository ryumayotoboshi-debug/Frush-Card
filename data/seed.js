import { getFolders, saveFolders } from "./storage.js";

export function seed() {
  if (getFolders().length > 0) return;

  saveFolders([
    { id: "1", name: "英語", parentId: null },
    { id: "2", name: "中学英語", parentId: "1" }
  ]);
}