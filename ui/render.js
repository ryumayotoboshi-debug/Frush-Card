import { startQuiz, skipQuestion, nextQuestion } from "../features/quiz.js";
import { addCard } from "../data/storage.js";

export function setupUI() {
  document.getElementById("startQuizBtn").addEventListener("click", startQuiz);
  document.getElementById("skipBtn").addEventListener("click", skipQuestion);
  document.getElementById("nextBtn").addEventListener("click", nextQuestion);

  // ★ ここだけ追加
  const addBtn = document.getElementById("addBtn");
  if (addBtn) {
    addBtn.addEventListener("click", () => {
      const word = document.getElementById("wordInput").value;
      const answer = document.getElementById("answerInput").value;
      const explanation = document.getElementById("explanationInput").value;

      if (!word || !answer) return;

      addCard({
        word,
        answer,
        explanation,
        tags: []
      });

      alert("登録しました");

      // 入力リセット
      document.getElementById("wordInput").value = "";
      document.getElementById("answerInput").value = "";
      document.getElementById("explanationInput").value = "";
    });
  }
}