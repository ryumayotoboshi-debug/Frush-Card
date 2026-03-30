"use strict";

import { getSeedCards } from "./seed.js";

const KEY = "wordAppCards";

export function saveCards(cards) {
  localStorage.setItem(KEY, JSON.stringify(cards));
}

export function loadCards() {
  const data = localStorage.getItem(KEY);

  if (!data) {
    const seed = getSeedCards();
    saveCards(seed);
    return seed;
  }

  return JSON.parse(data);
}