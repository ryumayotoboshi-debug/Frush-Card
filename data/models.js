//データの型定義、データの“設計図”をまとめる
"use strict";

export function createCard({
  id,
  word,
  meaning,
  description = "",
  tags = [],
  folderId = null,
  correct = 0,
  wrong = 0
}) {
  return {
    id,
    word,
    meaning,
    description,
    tags,
    folderId,
    correct,
    wrong,
    createdAt: Date.now()
  };
}