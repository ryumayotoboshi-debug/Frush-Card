/*全体の初期化、イベントの起点*/
"use strict";

import { setupForm } from "./ui/form.js";
import { renderCards, renderQuiz } from "./ui/render.js";

window.addEventListener("DOMContentLoaded", () => {
  setupForm();
  renderCards();
  renderQuiz(); // ←追加
});