"use strict";

import { seed } from "./data/seed.js";

// localStorage に古いデータがあれば削除して初期化
localStorage.removeItem("wordAppData");
seed();
import { drawFolderScreen } from "./ui/render.js";

// iPhoneのみでも必ず初期データをセット
localStorage.removeItem("wordAppData");
seed();

// フォルダ画面描画
drawFolderScreen();