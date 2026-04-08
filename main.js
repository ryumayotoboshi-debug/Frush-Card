"use strict";

import { drawFolderScreen } from "./ui/render.js";

console.log("🔥 main.js 読み込み");

document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ DOM 準備完了");

  drawFolderScreen();
});