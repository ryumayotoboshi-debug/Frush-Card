"use strict";

import { seed } from "./data/seed.js";
import { drawFolderScreen } from "./ui/render.js";

// iPhoneのみでも必ず初期データをセット
localStorage.removeItem("wordAppData");
seed();

// フォルダ画面描画
drawFolderScreen();