//localStorage操作をまとめる、データ保存の窓口
"use strict";

const KEY = "wordAppCards";

export function saveCards(cards) {
  localStorage.setItem(KEY, JSON.stringify(cards));
}

export function loadCards() {
  const data = localStorage.getItem(KEY);
  return data ? JSON.parse(data) : [];
}