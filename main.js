"use strict";

import { draw } from "./ui/render.js";

// 🔥 実行確認ログ
console.log("main.js 読み込み成功");

// 初期描画
window.addEventListener("DOMContentLoaded", () => {
  console.log("DOM読み込み完了");
  draw();
});