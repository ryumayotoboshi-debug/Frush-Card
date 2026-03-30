import { setupUI } from "./ui/render.js";

// ★ DOM読み込み後に確実に実行
document.addEventListener("DOMContentLoaded", () => {
  setupUI();
});