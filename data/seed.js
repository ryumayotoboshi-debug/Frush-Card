import { getAllCards, saveCards } from "./storage.js";

export function seed() {
  if (getAllCards().length > 0) return;

  const sample = [
    {
      word: "apple",
      answer: "りんご",
      choices: ["りんご", "みかん", "ぶどう", "バナナ"],
      explanation: "果物",
      tags: []
    },
    {
      word: "dog",
      answer: "犬",
      choices: ["猫", "犬", "鳥", "魚"],
      explanation: "動物",
      tags: []
    },
    {
      word: "blue",
      answer: "青",
      choices: ["赤", "青", "緑", "黄"],
      explanation: "色",
      tags: []
    },
    {
      word: "car",
      answer: "車",
      choices: ["電車", "車", "飛行機", "船"],
      explanation: "乗り物",
      tags: []
    }
  ];

  saveCards(sample);
}