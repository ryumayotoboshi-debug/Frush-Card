// ★変更箇所のみ抜粋（それ以外はそのまま）

words.forEach(w=>{
  const div=document.createElement("div");
  div.className="word-item neon-box";

  // ★本文
  const text = document.createElement("div");
  text.textContent = `${w.front} → ${w.back} : ${w.note||"未設定"}`;
  div.appendChild(text);

  // ★タグ（右上に配置する用）
  const tagDiv=document.createElement("div");
  tagDiv.className="tag-container";

  ["完璧","要復習","苦手"].forEach(tag=>{
    const b=document.createElement("button");
    b.textContent=tag;
    b.className="mini-btn cyber-btn";

    if(w.tags.includes(tag)){
      b.classList.add("active-tag");
    }

    b.onclick=()=>{
      updateWordTags(w.id,tag);

      if(b.classList.contains("active-tag")){
        b.classList.remove("active-tag");
      }else{
        b.classList.add("active-tag");
      }

      drawWordScreen(subFolderId, parentFolderId);
    };

    tagDiv.appendChild(b);
  });

  div.appendChild(tagDiv);

  // ★削除ボタン（右下）
  const deleteBtn=document.createElement("button");
  deleteBtn.textContent="🗑";
  deleteBtn.className="mini-btn cyber-btn delete-btn";
  deleteBtn.onclick=()=>{
    deleteWord(w.id);
    drawWordScreen(subFolderId, parentFolderId);
  };

  div.appendChild(deleteBtn);

  list.appendChild(div);
});