"use strict";

import { renderFolderView } from "./ui/render.js";
import { renderApp } from "./ui/render.js"; // 既存のアプリ画面

const app = document.getElementById("app");

let currentFolderId = null;

function start() {
  renderFolderView(app, (folderId) => {
    currentFolderId = folderId;
    renderApp(app, currentFolderId);
  });
}

start();