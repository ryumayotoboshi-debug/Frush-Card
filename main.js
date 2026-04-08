"use strict";

import { seed } from "./data/seed.js";
import { drawFolderScreen } from "./ui/render.js";

console.log("🔥 main.js 読み込み");

document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ DOM 準備完了");

  seed(); // ← データ生成（重要）

  drawFolderScreen(); // ← 描画
});