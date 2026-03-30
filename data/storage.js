const KEY = "cards";

export function getAllCards() {
  return JSON.parse(localStorage.getItem(KEY)) || [];
}

export function saveCards(cards) {
  localStorage.setItem(KEY, JSON.stringify(cards));
}

export function addCard(card) {
  const cards = getAllCards();
  cards.push(card);
  saveCards(cards);
}