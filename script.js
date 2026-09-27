const form = document.querySelector("#answer-form");
const input = document.querySelector("#answer-input");
const inputRow = document.querySelector(".input-row");
const message = document.querySelector("#result-message");
const successPanel = document.querySelector("#success-panel");

const CORRECT_ANSWER = "6";

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
