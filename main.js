"use strict";

import { renderFolderView } from "./ui/render.js";

// 🔥 正しいコンテナを指定
const app = document.getElementById("folderList");

if (!app) {
  console.error("folderListが見つかりません");
}

// フォルダUI描画
renderFolderView(app, (folderId) => {
  console.log("選択フォルダ:", folderId);
});