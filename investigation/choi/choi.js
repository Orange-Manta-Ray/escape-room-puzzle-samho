const cases = {
  "1": {
    "title": "체크리스트의 단서",
    "intro": "그림 속 단서를 해독해 다음 기록을 열어보세요.",
    "evidence": [
      [
        "question-1.png",
        "문제 1 · 그림 퀴즈"
      ]
    ],
    "stages": [
      {
        "question": "그림의 제목은 무엇일까요?",
        "answer": "해리포터",
        "results": [
          [
            "checklist.png",
            "최혜민 체크리스트"
          ]
        ]
      }
    ]
  },
  "2": {
    "title": "최혜민 메모",
    "intro": "두 메모에 남겨진 기록을 자세히 살펴보세요.",
    "evidence": [
      [
        "memo-1.png",
        "최혜민 메모 1"
      ],
      [
        "memo-2.png",
        "최혜민 메모 2"
      ]
    ],
    "stages": []
  },
  "3": {
    "title": "대화 기록의 단서",
    "intro": "그림 속 단어를 찾아 대화 기록을 확인하세요.",
    "evidence": [
      [
        "question-3.png",
        "문제 3 · 그림 퀴즈"
      ]
    ],
    "stages": [
      {
        "question": "그림이 가리키는 정답을 입력하세요.",
        "answer": "세일러문",
        "results": [
          [
            "chat.png",
            "회준 · 혜민 카톡"
          ]
        ]
      }
    ]
  },
  "4": {
    "title": "미로 속 위치",
    "intro": "미로에서 현재 위치를 찾아보세요.",
    "evidence": [
      ["maze-question.png", "문제 · 미로", "단서를 얻으려면 이 문제를 풀어서 좌표를 입력하세요."]
    ],
    "stages": [
      {
        "question": "지금 내가 서 있는곳이 어디지.? 아까 A1로 들어왔던거 같은데…",
        "pendingAnswer": true,
        "results": [],
        "resultText": "그녀의 인스타 아이디는 abigaile_0524 이다."
      }
    ]
  }
};
const $ = (s) => document.querySelector(s);
const id = new URLSearchParams(location.search).get('case');
const data = cases[id];
function addEvidence(container, [filename, caption, heading]) {
  if (heading) { const text = document.createElement('p'); text.className = 'evidence-instruction'; text.textContent = heading; container.append(text); }
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
  head.append(code);
  if (stage.additional) { const title = document.createElement('h2'); title.textContent = '추가퀴즈'; head.append(title); }
  const question = document.createElement('p'); question.className = 'question'; question.textContent = stage.question;
  section.append(head, question);
  const form = document.createElement('form'); form.className = 'stage-form';
  const label = document.createElement('label'); label.htmlFor = `input-${index}`; label.textContent = '정답 입력';
  const row = document.createElement('div'); row.className = 'answer-row';
  const input = document.createElement('input'); input.id = label.htmlFor; input.autocomplete = 'off';
  input.placeholder = '정답을 입력하세요';
  input.autocapitalize = 'none'; input.spellcheck = false;
  const button = document.createElement('button'); button.type = 'submit'; button.textContent = '확인 →';
  const message = document.createElement('p'); message.id = `message-${index}`; message.className = 'stage-message'; message.setAttribute('role', 'status'); message.setAttribute('aria-live', 'polite');
  message.textContent = '정답을 입력하고 확인을 눌러주세요.';
  input.setAttribute('aria-describedby', message.id);
  if (stage.pendingAnswer) { input.disabled = true; button.disabled = true; message.textContent = '정답 확인 후 열립니다.'; }
  row.append(input, button); form.append(label, row, message); section.append(form);
  $('#stages').append(section);
  let solved = false;
  form.addEventListener('submit', (event) => {
    event.preventDefault(); if (solved || stage.pendingAnswer) return;
    const value = input.value.normalize('NFC').replace(/\s+/g, '');
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
  document.title = `${data.title} · 최혜민 사건 기록`;
  $('#case-number').textContent = id.padStart(2, '0');
  $('#title').textContent = data.title; $('#intro').textContent = data.intro;
  data.evidence.forEach((item) => addEvidence($('#evidence'), item));
  if (!data.evidence.length) $('#evidence-title').parentElement.parentElement.hidden = true;
  addStage(0);
}
