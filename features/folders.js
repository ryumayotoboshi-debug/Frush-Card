"use strict";
import { load, save } from "../data/storage.js";

export function getFolders(){ return load().folders; }

export function addFolder(name, parentId=null){
  const data=load();
  const folder={id:crypto.randomUUID(),name,parentId,lastStudied:0};
  data.folders.push(folder);
  save(data);
}

export function renameFolder(id,newName){
  const data=load();
  const f = data.folders.find(f=>f.id===id);
  if(f){ f.name=newName; save(data);}
}

export function deleteFolder(id){
  const data=load();
  // 子フォルダも削除
  const removeChildren = (fid)=>{
    data.folders.filter(f=>f.parentId===fid).forEach(f=>removeChildren(f.id));
    data.folders = data.folders.filter(f=>f.id!==fid);
    data.words = data.words.filter(w=>w.folderId!==fid);
  };
  removeChildren(id);
  save(data);
}

export function getFolderTree(parentId=null){
  const folders=getFolders();
  return folders.filter(f=>f.parentId===parentId)
                .map(f=>({...f,children:getFolderTree(f.id)}));
}