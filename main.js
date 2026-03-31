"use strict";

// ======================================
// メインエントリーポイント
// ======================================

import { drawFolderScreen } from "./ui/render.js";
import { seed } from "./data/seed.js";

// ★ 初期データ投入
// 既にデータがあれば何もしない
seed();

// ★ 初期画面描画
drawFolderScreen();