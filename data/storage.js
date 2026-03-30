const CARD_KEY = "cards";
const FOLDER_KEY = "folders";

export function getCards() {
  return JSON.parse(localStorage.getItem(CARD_KEY)) || [];
}

export function saveCards(cards) {
  localStorage.setItem(CARD_KEY, JSON.stringify(cards));
}

export function addCard(card) {
  const cards = getCards();
  cards.push(card);
  saveCards(cards);
}

export function updateCard(updated) {
  const cards = getCards().map(c =>
    c.word === updated.word ? updated : c
  );
  saveCards(cards);
}

export function getFolders() {
  return JSON.parse(localStorage.getItem(FOLDER_KEY)) || [];
}

export function saveFolders(folders) {
  localStorage.setItem(FOLDER_KEY, JSON.stringify(folders));
}

export function addFolder(folder) {
  const folders = getFolders();
  folders.push(folder);
  saveFolders(folders);
}