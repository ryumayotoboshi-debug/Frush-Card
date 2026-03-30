"use strict";

const KEY = "wordAppData";

export function load() {
  return JSON.parse(localStorage.getItem(KEY)) || {
    folders: [],
    words: []
  };
}

export function save(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}