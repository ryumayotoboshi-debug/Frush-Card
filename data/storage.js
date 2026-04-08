"use strict";

// 保存
export function save(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// 取得
export function load(key) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
}

// 初期化チェック
export function exists(key) {
  return localStorage.getItem(key) !== null;
}