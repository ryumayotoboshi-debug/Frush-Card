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

// ★ 追加：カード更新（タグ保存用）
export function updateCard(updatedCard) {
  const cards = getAllCards();

  const newCards = cards.map(card =>
    card.word === updatedCard.word ? updatedCard : card
  );

  saveCards(newCards);
}