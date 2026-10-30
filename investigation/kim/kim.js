const cases = {
  "1": {
    "title": "통장의 비밀번호",
    "intro": "잠긴 기록을 열어 자금의 흐름을 확인하세요.",
    "evidence": [],
    "stages": [
      {
        "question": "희원이의 통장 비밀번호는 무엇일까? (희원이는 바보다 이히히~)",
        "answer": "1119",
        "digits": 4,
        "results": [
          [
            "bank.png",
            "통장 내역서"
          ]
        ]
      }
    ]
  },
  "2": {
    "title": "부잣집의 단서",
    "intro": "확보된 단서에서 네 글자의 답을 찾아보세요.",
    "evidence": [
      [
        "rich-clue.png",
        "부잣집 단서"
      ]
    ],
    "stages": [
      {
        "question": "네 글자의 답을 입력하세요.",
        "answer": "rich",
        "length": 4,
        "ignoreCase": true,
        "results": [
          [
            "debt.png",
            "빚 독촉"
          ]
        ]
      }
    ]
  },
  "3": {
    "title": "병원 영수증",
    "intro": "영수증에 남겨진 기록을 자세히 살펴보세요.",
    "evidence": [
      [
        "hospital.png",
        "병원 영수증"
      ]
    ],
    "stages": []
  },
  "4": {
    "title": "아버지의 생신",
    "intro": "기억 속 날짜로 잠긴 기록을 열어보세요.",
    "evidence": [],
    "stages": [
      {
        "question": "아버지 생신.. 챙겨드려야하는데..",
        "answer": "570412",
        "digits": 6,
        "lock": 6,
        "results": [
          [
            "father.png",
            "아버지와 연락 단서"
          ]
        ]
      }
    ]
  },
  "5": {
    "title": "청년부에 보관된 짐",
    "intro": "남겨진 물건 속에서 단서를 찾아보세요.",
    "evidence": [
      [
        "belongings.png",
        "청년부에 보관된 짐"
      ]
    ],
    "stages": []
  },
  "6": {
    "title": "숫자의 규칙",
    "intro": "숫자 사이의 규칙을 찾아 빈 네모의 값을 구하세요.",
    "evidence": [
      [
        "number-puzzle.svg?v=2",
        "문제 6 · 숫자 규칙"
      ]
    ],
    "stages": [
      {
        "question": "네모에 들어갈 값은?",
        "answer": "73",
        "digits": 2,
        "results": [
          [
            "email.png",
            "의문의 이메일"
          ]
        ]
      }
    ]
  },
  "7": {
    "title": "희원의 다이어리",
    "intro": "두 다이어리에 남겨진 내용을 살펴보세요.",
    "evidence": [
      [
        "diary-1.png",
        "희원의 다이어리"
      ],
      [
        "diary-2.png",
        "다이어리 2"
      ]
    ],
    "stages": []
  }
};
const $ = (s) => document.querySelector(s);
const id = new URLSearchParams(location.search).get('case');
const data = cases[id];
function addEvidence(container, [filename, caption]) {
  const figure = document.createElement('figure');
  const link = document.createElement('a');
  link.href = `assets/${filename}`;
  link.target = '_blank'; link.rel = 'noopener';
  link.setAttribute('aria-label', `${caption} 원본 크게 보기`);
  const image = document.createElement('img');
  image.src = link.href; image.alt = caption; image.decoding = 'async';
  link.append(image);
  const text = document.createElement('figcaption');
  text.textContent = `${caption} · 눌러서 크게 보기 ↗`;
  figure.append(link, text); container.append(figure);
}
function addStage(index) {
  const stage = data.stages[index];
  if (!stage) return;
  const section = document.createElement('section');
  section.className = 'answer'; section.id = `stage-${index}`;
  const head = document.createElement('div'); head.className = 'section-head';
  const code = document.createElement('span'); code.textContent = `INVESTIGATION / ${String(index + 1).padStart(2, '0')}`;
  const title = document.createElement('h2'); title.textContent = stage.additional ? '추가퀴즈' : '단서를 확인하세요';
  head.append(code, title);
  const question = document.createElement('p'); question.className = 'question'; question.textContent = stage.question;
  section.append(head, question);
  if (stage.hint) {
    const hint = document.createElement('p'); hint.className = 'clue-hint'; hint.textContent = `힌트: ${stage.hint}`; section.append(hint);
  }
  if (stage.lock) {
    const lock = document.createElement('div'); lock.className = 'lock';
    const image = document.createElement('img'); image.src = `assets/lock-${stage.lock}.svg`; image.alt = `${stage.lock}자리 숫자 자물쇠`;
    lock.append(image); section.append(lock);
  }
  const form = document.createElement('form'); form.className = 'stage-form';
  const label = document.createElement('label'); label.htmlFor = `input-${index}`; label.textContent = '정답 입력';
  const row = document.createElement('div'); row.className = 'answer-row';
  const input = document.createElement('input'); input.id = label.htmlFor; input.autocomplete = 'off';
  input.placeholder = '정답을 입력하세요';
  input.autocapitalize = 'none'; input.spellcheck = false;
  if (stage.digits) {
    input.inputMode = 'numeric'; input.maxLength = stage.digits; input.pattern = '[0-9]*'; input.placeholder = `${stage.digits}자리 숫자`;
    input.addEventListener('input', () => { input.value = input.value.replace(/[^0-9]/g, ''); });
  }
  if (stage.length) input.maxLength = stage.length;
  const button = document.createElement('button'); button.type = 'submit'; button.textContent = '확인 →';
  const message = document.createElement('p'); message.id = `message-${index}`; message.className = 'stage-message'; message.setAttribute('role', 'status'); message.setAttribute('aria-live', 'polite');
  message.textContent = '정답을 입력하고 확인을 눌러주세요.';
  input.setAttribute('aria-describedby', message.id);
  row.append(input, button); form.append(label, row, message); section.append(form);
  $('#stages').append(section);
  let solved = false;
  form.addEventListener('submit', (event) => {
    event.preventDefault(); if (solved) return;
    let value = input.value.normalize('NFC').replace(/\s+/g, '');
    if (stage.ignoreCase) value = value.toLowerCase();
    if (value !== stage.answer) {
      message.textContent = value ? '정답이 아닙니다. 다시 확인해 주세요.' : '정답을 먼저 입력해 주세요.';
      message.classList.add('error'); return;
    }
    solved = true; input.disabled = true; button.disabled = true;
    message.classList.remove('error'); message.textContent = '인증 완료. 아래 자료를 확인하세요.';
    const result = document.createElement('section'); result.className = 'result'; result.id = `result-${index}`;
    const header = document.createElement('div'); header.className = 'section-head';
    const stamp = document.createElement('span'); stamp.textContent = 'ACCESS GRANTED';
    const heading = document.createElement('h2'); heading.textContent = '새로운 자료를 확보했습니다';
    header.append(stamp, heading); result.append(header);
    stage.results.forEach((item) => addEvidence(result, item));
    if (stage.resultText) {
      const text = document.createElement('p'); text.className = 'revealed-text'; text.textContent = stage.resultText; result.append(text);
    }
    $('#stages').append(result); addStage(index + 1);
    result.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}
if (!data) {
  $('#title').textContent = '사건 자료를 찾을 수 없습니다';
  $('#intro').textContent = '전달받은 QR 코드를 다시 스캔해 주세요.';
  $('#evidence-title').parentElement.parentElement.hidden = true;
} else {
  document.title = `${data.title} · 김희원 사건 기록`;
  $('#case-number').textContent = id.padStart(2, '0');
  $('#title').textContent = data.title; $('#intro').textContent = data.intro;
  data.evidence.forEach((item) => addEvidence($('#evidence'), item));
  if (!data.evidence.length) $('#evidence-title').parentElement.parentElement.hidden = true;
  addStage(0);
}
