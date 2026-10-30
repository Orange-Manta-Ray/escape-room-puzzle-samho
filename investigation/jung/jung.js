const cases = {
  "1": {
    "title": "삼호교회 보안 로그",
    "intro": "문서실 주변에서 확보된 CCTV 기록 다섯 장을 살펴보세요.",
    "evidence": [
      [
        "cctv-1.png",
        "CCTV 기록 01"
      ],
      [
        "cctv-2.png",
        "CCTV 기록 02"
      ],
      [
        "cctv-3.png",
        "CCTV 기록 03"
      ],
      [
        "cctv-4.png",
        "CCTV 기록 04"
      ],
      [
        "cctv-5.png",
        "CCTV 기록 05"
      ]
    ],
    "stages": []
  },
  "5": {
    "title": "낙서에 남겨진 단서",
    "intro": "질문에 답하고 숨겨진 기록을 확인하세요.",
    "evidence": [],
    "stages": [
      {
        "question": "우리교회 담임목사님의 강아지 이름은?",
        "hint": "찬양대...",
        "answer": "아코",
        "results": [
          [
            "note-1.png",
            "낙서 1"
          ]
        ]
      },
      {
        "question": "룬",
        "answer": "423",
        "digits": 3,
        "results": [
          [
            "note-2.png",
            "낙서 2"
          ]
        ]
      }
    ]
  },
  "6": {
    "title": "등록 기록의 단서",
    "intro": "이미지 속 인물과 기록을 연결해 보세요.",
    "evidence": [
      [
        "question-6.png",
        "문제 6 · 인물 단서"
      ]
    ],
    "stages": [
      {
        "question": "이 사람이 언제 등록했을까?",
        "answer": "20300217",
        "digits": 8,
        "results": [
          [
            "chat.png",
            "최은호와 김서진의 채팅 화면"
          ]
        ]
      }
    ]
  },
  "7": {
    "title": "윤철의 편지",
    "intro": "편지에 남겨진 내용을 살펴보세요.",
    "evidence": [
      [
        "letter.png",
        "윤철 편지"
      ]
    ],
    "stages": [
      {
        "question": "동시에 재생되는 세 찬양의 제목을 각각 입력하세요.",
        "audio": "praise-mix-v3.mp3",
        "answers": ["지금은 엘리야 때처럼", "아 하나님의 은혜로", "밀알"],
        "results": [
          [
            "dashboard.png",
            "시스템 로그 대시보드"
          ]
        ]
      }
    ]
  },
  "2": {
    "title": "정회준 메모 1",
    "intro": "메모에 남겨진 단서를 살펴보세요.",
    "evidence": [
      [
        "memo-1.png",
        "정회준 메모 1"
      ]
    ],
    "stages": []
  },
  "3": {
    "title": "정회준 메모 2",
    "intro": "메모에 남겨진 단서를 살펴보세요.",
    "evidence": [
      [
        "memo-2.png",
        "정회준 메모 2"
      ]
    ],
    "stages": []
  },
  "4": {
    "title": "정회준 메모 3",
    "intro": "메모에 남겨진 단서를 살펴보세요.",
    "evidence": [
      [
        "memo-3.png",
        "정회준 메모 3"
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
function normalizeTitle(value) {
  return value.normalize('NFC').toLowerCase().replace(/[^가-힣a-z0-9]/g, '');
}
function editDistance(a, b) {
  let previous = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const current = [i];
    for (let j = 1; j <= b.length; j++) current[j] = Math.min(current[j - 1] + 1, previous[j] + 1, previous[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    previous = current;
  }
  return previous[b.length];
}
function matchSongTitles(values, titles) {
  const normalized = values.map(normalizeTitle);
  if (normalized.some((value) => !value)) return false;
  const targets = titles.map(normalizeTitle);
  function match(index, remaining) {
    if (index === normalized.length) return true;
    return remaining.some((target, i) => {
      if (target === '아하나님의은혜로' && !normalized[index].startsWith('아')) return false;
      const limit = target.length <= 2 ? 1 : target.length <= 6 ? 1 : 2;
      if (normalized[index].length < Math.max(2, target.length - limit)) return false;
      return editDistance(normalized[index], target) <= limit && match(index + 1, remaining.filter((_, j) => i !== j));
    });
  }
  return match(0, targets);
}
function addStage(index) {
  const stage = data.stages[index];
  if (!stage) return;
  const section = document.createElement('section');
  section.className = 'answer'; section.id = `stage-${index}`;
  const head = document.createElement('div'); head.className = 'section-head';
  const code = document.createElement('span'); code.textContent = `INVESTIGATION / ${String(index + 1).padStart(2, '0')}`;
  head.append(code);
  if (stage.additional) { const title = document.createElement('h2'); title.textContent = '추가퀴즈'; head.append(title); }
  const question = document.createElement('p'); question.className = 'question'; question.textContent = stage.question;
  section.append(head, question);
  if (stage.audio) { const audio = document.createElement('audio'); audio.controls = true; audio.preload = 'metadata'; audio.src = `assets/${stage.audio}`; audio.setAttribute('aria-label', '세 찬양 동시 재생'); audio.className = 'praise-audio'; section.append(audio); }
  if (stage.hint) {
    const hint = document.createElement('p'); hint.className = 'clue-hint'; hint.textContent = `힌트: ${stage.hint}`; section.append(hint);
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
  const button = document.createElement('button'); button.type = 'submit'; button.textContent = '확인 →';
  const message = document.createElement('p'); message.id = `message-${index}`; message.className = 'stage-message'; message.setAttribute('role', 'status'); message.setAttribute('aria-live', 'polite');
  message.textContent = '정답을 입력하고 확인을 눌러주세요.';
  input.setAttribute('aria-describedby', message.id);
  const inputs = [input];
  if (stage.answers) {
    input.placeholder = '찬양 제목 1'; label.textContent = '찬양 제목 입력';
    const fields = document.createElement('div'); fields.className = 'praise-fields'; fields.append(input);
    for (let i = 1; i < stage.answers.length; i++) { const field = document.createElement('input'); field.autocomplete = 'off'; field.placeholder = `찬양 제목 ${i + 1}`; field.setAttribute('aria-label', `찬양 제목 ${i + 1}`); field.setAttribute('aria-describedby', message.id); inputs.push(field); fields.append(field); }
    form.append(label, fields, row, message); row.append(button);
  } else { row.append(input, button); form.append(label, row, message); }
  section.append(form);
  $('#stages').append(section);
  let solved = false;
  form.addEventListener('submit', (event) => {
    event.preventDefault(); if (solved) return;
    const value = input.value.normalize('NFC').replace(/\s+/g, '');
    const correct = stage.answers ? matchSongTitles(inputs.map((field) => field.value), stage.answers) : value === stage.answer;
    if (!correct) {
      message.textContent = inputs.some((field) => field.value.trim()) ? '정답이 아닙니다. 다시 확인해 주세요.' : '정답을 먼저 입력해 주세요.';
      message.classList.add('error'); return;
    }
    solved = true; inputs.forEach((field) => { field.disabled = true; }); button.disabled = true;
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
  document.title = `${data.title} · 정회준 사건 기록`;
  $('#case-number').textContent = id.padStart(2, '0');
  $('#title').textContent = data.title; $('#intro').textContent = data.intro;
  data.evidence.forEach((item) => addEvidence($('#evidence'), item));
  if (!data.evidence.length) $('#evidence-title').parentElement.parentElement.hidden = true;
  addStage(0);
}
