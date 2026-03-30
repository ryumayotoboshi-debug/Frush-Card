"use strict";

import { setupForm } from "./ui/form.js";
import { renderQuiz } from "./ui/render.js";

window.addEventListener("DOMContentLoaded", () => {
  setupForm();
  renderQuiz();
});