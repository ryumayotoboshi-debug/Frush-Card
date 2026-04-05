"use strict";
import { load, save } from "../data/storage.js";

export function getWords(folderId){
  return load().words.filter(w=>w.folderId===folderId);
}

export function addWord({front,back,note,folderId}){
  const data=load();
  data.words.push({
    id:crypto.randomUUID(),
    front,
    back,
    note,
    folderId,
    tags:[],
    stats:{correct:0,wrong:0}
  });
  const f = data.folders.find(f=>f.id===folderId);
  if(f) f.lastStudied = Date.now();
  save(data);
}

export function deleteWord(id){
  const data=load();
  data.words = data.words.filter(w=>w.id!==id);
  save(data);
}

// ★トグル仕様に変更
export function updateWordTags(wordId, tag){
  const data = load();

  const w = data.words.find(w => w.id === wordId);
  if(!w) return;

  if(!Array.isArray(w.tags)) w.tags = [];

  if(w.tags.includes(tag)){
    w.tags = w.tags.filter(t => t !== tag);
  } else {
    w.tags.push(tag);
  }

  save(data);
}