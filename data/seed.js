"use strict";

import { createCard } from "./models.js";

export function getSeedCards() {
  return [
    createCard({
      id: crypto.randomUUID(),
      word: "apple",
      meaning: "りんご",
      description: "果物の一種"
    }),
    createCard({
      id: crypto.randomUUID(),
      word: "book",
      meaning: "本",
      description: "読むもの"
    }),
    createCard({
      id: crypto.randomUUID(),
      word: "run",
      meaning: "走る",
      description: "移動動作"
    }),
    createCard({
      id: crypto.randomUUID(),
      word: "blue",
      meaning: "青",
      description: "色"
    }),
    createCard({
      id: crypto.randomUUID(),
      word: "eat",
      meaning: "食べる",
      description: "食事動作"
    })
  ];
}