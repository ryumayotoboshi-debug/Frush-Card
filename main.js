"use strict";

import { seed } from "./data/seed.js";
import { drawFolderScreen } from "./ui/render.js";

document.addEventListener("DOMContentLoaded", () => {

  console.log("✅ main.js 起動");

  // 初回のみデータ生成
  if (!localStorage.getItem("wordAppData")) {
    console.log("🌱 初期データ生成");
    seed();
  }

  // 初期画面描画
  console.log("🎨 描画開始");
  drawFolderScreen(null);
});