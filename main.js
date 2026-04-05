"use strict";

import { drawFolderScreen } from "./ui/render.js";
import { seed } from "./ui/data.js"; // ← seedの場所に合わせて調整

document.addEventListener("DOMContentLoaded", () => {

  // 初回のみデータ生成
  if (!localStorage.getItem("wordAppData")) {
    seed();
  }

  // 初期描画
  drawFolderScreen(null);
});