//カード表示、表裏切り替え
"use strict";

import { createCard } from "../data/models.js";
import { saveCards, loadCards } from "../data/storage.js";

let cards = loadCards();

export function getCards() {
  return cards;
}

export function addCard(word, meaning, description) {
  const newCard = createCard({
    id: crypto.randomUUID(),
    word,
    meaning,
    description
  });

  cards.push(newCard);
  saveCards(cards);
}

export function shuffleCards() {
  return [...cards].sort(() => Math.random() - 0.5);
}

export function getWeightedRandomCard() {
  const totalWeight = cards.reduce(
    (sum, card) => sum + (card.wrong + 1),
    0
  );

  let random = Math.random() * totalWeight;

  for (const card of cards) {
    random -= (card.wrong + 1);
    if (random <= 0) {
      return card;
    }
  }

  return cards[0];
}
