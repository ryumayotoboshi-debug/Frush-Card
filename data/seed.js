import { getAllCards, saveCards } from "./storage.js";

export function seed() {
  if (getAllCards().length > 0) return;

  const sample = [
    {
      word: "apple",
      answer: "りんご",
      explanation: "果物",
      tags: []
    },
    {
      word: "dog",
      answer: "犬",
      explanation: "動物",
      tags: []
    },
    {
      word: "blue",
      answer: "青",
      explanation: "色",
      tags: []
    },
    {
      word: "car",
      answer: "車",
      explanation: "乗り物",
      tags: []
    }
  ];

  saveCards(sample);
}