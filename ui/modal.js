"use strict";

export function openModal({title, inputs, onSubmit}) {
  const root = document.getElementById("modalRoot");

  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";

  const box = document.createElement("div");
  box.className = "modal-box";

  const h = document.createElement("div");
  h.textContent = title;
  box.appendChild(h);

  const inputEls = inputs.map(ph=>{
    const i = document.createElement("input");
    i.placeholder = ph;
    box.appendChild(i);
    return i;
  });

  const ok = document.createElement("button");
  ok.textContent = "OK";
  ok.className = "cyber-btn";

  const cancel = document.createElement("button");
  cancel.textContent = "キャンセル";
  cancel.className = "cyber-btn";

  box.appendChild(ok);
  box.appendChild(cancel);
  overlay.appendChild(box);
  root.appendChild(overlay);

  // 閉じる
  function close(){
    overlay.remove();
  }

  cancel.onclick = close;

  ok.onclick = ()=>{
    const values = inputEls.map(i=>i.value.trim());
    onSubmit(values);
    close();
  };

  // 背景クリックで閉じる
  overlay.onclick = (e)=>{
    if(e.target === overlay) close();
  };

  // ★イベント暴発防止
  box.onclick = (e)=> e.stopPropagation();
}