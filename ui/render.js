//DOM生成専用、画面描画の専用担当
"use strict";

import { getCards } from "../features/cards.js";

export function renderCards() {
  const container = document.getElementById("cardList");
  container.innerHTML = "";

  const cards = getCards();

  cards.forEach(card => {
    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <div class="front">${card.word}</div>
      <div class="back hidden">
        ${card.meaning}<br>
        <small>${card.description}</small>
      </div>
    `;

    div.addEventListener("click", () => {
      div.querySelector(".front").classList.toggle("hidden");
      div.querySelector(".back").classList.toggle("hidden");
    });

    container.appendChild(div);
  });
}
