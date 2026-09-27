const form = document.querySelector("#answer-form");
const input = document.querySelector("#answer-input");
const inputRow = document.querySelector(".input-row");
const message = document.querySelector("#result-message");
const successPanel = document.querySelector("#success-panel");
const clueForm = document.querySelector("#clue-form");
const clueInput = document.querySelector("#clue-input");
const clueInputRow = document.querySelector(".clue-input-row");
const clueMessage = document.querySelector("#clue-message");
const finalPanel = document.querySelector("#final-panel");

const CORRECT_ANSWER = "6";
const CORRECT_CLUE = "정답입니다";

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const answer = input.value.trim();

  if (answer === CORRECT_ANSWER) {
    showSuccess();
    return;
  }

  showError(answer.length === 0 ? "먼저 답을 입력해주세요." : "잠금이 풀리지 않았습니다. 다시 생각해보세요.");
});

input.addEventListener("input", () => {
  input.value = input.value.replace(/\D/g, "");
  inputRow.classList.remove("is-error");
  message.classList.remove("is-error");
  message.textContent = "숫자를 입력한 뒤 확인을 눌러주세요.";
});

clueForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const clue = clueInput.value.normalize("NFC").replace(/\s+/g, "");

  if (clue === CORRECT_CLUE) {
    showFinalAnswer();
    return;
  }

  clueInputRow.classList.remove("is-error");
  void clueInputRow.offsetWidth;
  clueInputRow.classList.add("is-error");
  clueMessage.classList.add("is-error");
  clueMessage.textContent = clue.length === 0 ? "사진 속 글씨를 입력해주세요." : "글씨를 다시 한번 자세히 확인해보세요.";
  clueInput.select();

  if (navigator.vibrate) {
    navigator.vibrate([45, 35, 45]);
  }
});

clueInput.addEventListener("input", () => {
  clueInputRow.classList.remove("is-error");
  clueMessage.classList.remove("is-error");
  clueMessage.textContent = "띄어쓰기는 채점에 영향을 주지 않습니다.";
});

function showError(text) {
  inputRow.classList.remove("is-error");
  void inputRow.offsetWidth;
  inputRow.classList.add("is-error");
  message.classList.add("is-error");
  message.textContent = text;
  input.select();

  if (navigator.vibrate) {
    navigator.vibrate([45, 35, 45]);
  }
}

function showSuccess() {
  form.querySelector("button").disabled = true;
  input.disabled = true;
  message.classList.remove("is-error");
  message.textContent = "인증 완료";
  successPanel.hidden = false;
  successPanel.classList.add("is-visible");

  if (navigator.vibrate) {
    navigator.vibrate([60, 45, 120]);
  }

  window.setTimeout(() => {
    successPanel.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 180);
}

function showFinalAnswer() {
  clueForm.querySelector("button").disabled = true;
  clueInput.disabled = true;
  clueMessage.classList.remove("is-error");
  clueMessage.textContent = "두 번째 잠금 해제 완료";
  finalPanel.hidden = false;
  finalPanel.classList.add("is-visible");

  if (navigator.vibrate) {
    navigator.vibrate([60, 45, 60, 45, 140]);
  }

  window.setTimeout(() => {
    finalPanel.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 180);
}
