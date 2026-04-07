"use strict";

const KEY = "wordAppData";

export function load(){
  const raw = localStorage.getItem(KEY);

  if(!raw){
    return {
      folders: [],
      words: []
    };
  }

  try {
    const data = JSON.parse(raw);

    // 🔥 不完全データ対策
    return {
      folders: Array.isArray(data.folders) ? data.folders : [],
      words: Array.isArray(data.words) ? data.words : []
    };

  } catch(e){
    console.error("❌ JSON parse エラー", e);

    return {
      folders: [],
      words: []
    };
  }
}

export function save(data){
  localStorage.setItem(KEY, JSON.stringify(data));
}