"use strict";

import { renderFolderView } from "./ui/render.js";
import { renderApp } from "./ui/render.js";
import { seed } from "./data/seed.js";

const app = document.getElementById("app");

let currentFolderId = null;

// ★ 初期データ投入
seed();

function start() {
  renderFolderView(app, (folderId) => {
    currentFolderId = folderId;
    renderApp(app, currentFolderId);
  });
}

start();