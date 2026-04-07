"use strict";

import { seed } from "./data/seed.js";
import { drawFolderScreen } from "./ui/render.js";

document.addEventListener("DOMContentLoaded", () => {

  console.log("① DOM読み込み");

  try {
    localStorage.removeItem("wordAppData");
    seed();
    console.log("② seed成功");
  } catch(e){
    console.error("❌ seed失敗", e);
  }

  try {
    console.log("DATA:", localStorage.getItem("wordAppData"));
  } catch(e){
    console.error("❌ storage失敗", e);
  }

  try {
    drawFolderScreen(null);
    console.log("③ render呼び出し成功");
  } catch(e){
    console.error("❌ render失敗", e);
  }

});