//入力UIの制御
"use strict";

import { addCard } from "../features/cards.js";
import { renderCards } from "./render.js";

export function setupForm() {
  const form = document.getElementById("cardForm");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const word = form.word.value;
    const meaning = form.meaning.value;
    const description = form.description.value;

    addCard(word, meaning, description);
    form.reset();

    renderCards();
  });
}
