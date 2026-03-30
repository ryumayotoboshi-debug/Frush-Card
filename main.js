"use strict";

import { renderFolderView } from "./ui/render.js";

import { draw } from "./render.js";

draw();

const app = document.getElementById("app");

renderFolderView(app, (folderId) => {
  console.log("選択フォルダ:", folderId);

  // ※ここで既存の renderApp を呼ぶ構造にしてください
});