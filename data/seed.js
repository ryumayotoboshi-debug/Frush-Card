"use strict";

import { load, save } from "./storage.js";
import { createFolder, createWord } from "./models.js";

export function seed() {
  const data = load();

  // 既にデータがあれば何もしない
  if (data.folders.length > 0) return;

  // フォルダ作成
  const root = createFolder("英単語");
  const sub = createFolder("基礎", root.id);

  // 単語
  const words = [
    createWord("apple", "りんご", "果物の一種", sub.id),
    createWord("book", "本", "読むもの", sub.id),
    createWord("run", "走る", "移動する動作", sub.id),
    createWord("blue", "青", "色の一種", sub.id)
  ];

  save({
    folders: [root, sub],
    words
  });
}