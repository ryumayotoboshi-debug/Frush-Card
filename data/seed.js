"use strict";

import { save, exists } from "./storage.js";

export function seed() {
  console.log("🌱 seed実行");

  // 既にデータがあるなら何もしない
  if (exists("folders")) {
    console.log("📦 既存データあり → スキップ");
    return;
  }

  const folders = [
    { id: "1", name: "英語", parentId: null },
    { id: "2", name: "数学", parentId: null },
    { id: "3", name: "プログラミング", parentId: null }
  ];

  save("folders", folders);

  console.log("✅ 初期データ保存完了");
}