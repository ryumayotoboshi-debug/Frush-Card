"use strict";

import { renderFolderView } from "./ui/render.js";

const app = document.getElementById("app");

renderFolderView(app, (folderId) => {
  console.log("選択フォルダ:", folderId);

  // ※ここで既存の renderApp を呼ぶ構造にしてください
});