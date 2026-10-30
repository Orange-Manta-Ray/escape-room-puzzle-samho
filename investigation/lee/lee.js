const cases = {
  "1": {
    "title": "남겨진 시간의 기록",
    "intro": "두 기록에 남겨진 단서를 살펴보세요.",
    "evidence": [
      [
        "dozing.png",
        "dozing 1am"
      ],
      [
        "cleaning.png",
        "교회 청소 6시"
      ]
    ],
    "stages": []
  },
  "2": {
    "title": "모든 것의 시작",
    "intro": "모든것은 시작이 있지..",
    "evidence": [
      [
        "question-2.png",
        "문제"
      ]
    ],
    "stages": [
      {
        "question": "정답을 입력하세요.",
        "answer": "창세기",
        "results": [
          [
            "letter.png",
            "따뜻한 감사의 손편지"
          ]
        ]
      }
    ]
  },
  "3": {
    "title": "십자가의 위치",
    "intro": "기회는 두 번.",
    "evidence": [
      [
        "church.png",
        "삼호침례교회 본관"
      ]
    ],
    "stages": [
      {
        "question": "삼호침례교회의 십자가는 본관 건물 어디에 있는가?\n오른쪽: 1\n왼쪽: 2\n가운데: 3\n본관에는 없고 입구에만 있다: 4\n기회는 2번입니다.",
        "answer": "1",
        "digits": 1,
        "attempts": 2,
        "results": [
          [
            "chat-1.jpeg",
            "목사님 카톡 내용"
          ],
          [
            "chat-2.png",
            "목사님 카톡 2"
          ]
        ]
      }
    ]
  },
  "4": {
    "title": "청년 해외 선교",
    "intro": "기록에서 선교 장소를 찾아보세요.",
    "evidence": [],
    "stages": [
      {
        "question": "청년 해외 선교 장소는?\n띄어쓰기는 한번만 하세요.",
        "answers": [
          "캄보디아 프놈펜",
          "캄보디아 프놈팬"
        ],
        "results": [
          [
            "newspaper.png",
            "신문기사 정민석 단서"
          ]
        ]
      },
      {
        "question": "이창렬의 폰 비번은 그가 가장 좋아하는 말씀이야.. 신문에서 단서를 찾아 네자리 숫자를 쓰세요. (성경책 활용)",
        "hint": "골로새서",
        "answer": "0124",
        "digits": 4,
        "results": [["call.png", "정민석 통화 내역"]]
      }
    ]
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
  head.append(code);
  if (stage.additional) { const title = document.createElement('h2'); title.textContent = '추가퀴즈'; head.append(title); }
  const question = document.createElement('p'); question.className = 'question'; question.style.whiteSpace = 'pre-line'; question.textContent = stage.question;
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
  const chanceKey = `samho-lee-case-${id}-stage-${index}`;
  const stored = stage.attempts ? localStorage.getItem(chanceKey) : null;
  let failures = stored === 'wrong' ? 1 : Number(stored || 0);
  if (stage.attempts && stored !== 'correct' && failures >= stage.attempts) { input.disabled = true; button.disabled = true; message.textContent = '기회 2번을 모두 사용했습니다.'; message.classList.add('error'); } else if (stage.attempts && failures === 1) { message.textContent = '남은 기회: 1번'; }
  form.addEventListener('submit', (event) => {
    event.preventDefault(); if (solved || (stage.attempts && failures >= stage.attempts)) return;
    let value = input.value.normalize('NFC').trim();
    if (!stage.answers) value = value.replace(/\s+/g, '');
    if (stage.ignoreCase) value = value.toLowerCase();
    if (!value) { message.textContent = '정답을 먼저 입력해 주세요.'; return; }
    if (!(stage.answers || [stage.answer]).includes(value)) {
      if (stage.attempts) { failures++; localStorage.setItem(chanceKey, String(failures)); message.classList.add('error'); if (failures >= stage.attempts) { input.disabled = true; button.disabled = true; message.textContent = '정답이 아닙니다. 기회 2번을 모두 사용했습니다.'; } else { message.textContent = '정답이 아닙니다. 남은 기회: 1번'; } return; }
      message.textContent = value ? '정답이 아닙니다. 다시 확인해 주세요.' : '정답을 먼저 입력해 주세요.';
      message.classList.add('error'); return;
    }
    solved = true; if (stage.attempts) localStorage.setItem(chanceKey, 'correct'); input.disabled = true; button.disabled = true;
    message.classList.remove('error'); message.textContent = stage.results.length || data.stages[index + 1] ? '인증 완료. 아래 자료를 확인하세요.' : '정답입니다.';
    if (!stage.results.length && !stage.resultText && !data.stages[index + 1]) return;
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
  if (stage.attempts && localStorage.getItem(chanceKey) === 'correct') { input.value = stage.answer; form.requestSubmit(); }
}
if (!data) {
  $('#title').textContent = '사건 자료를 찾을 수 없습니다';
  $('#intro').textContent = '전달받은 QR 코드를 다시 스캔해 주세요.';
  $('#evidence-title').parentElement.parentElement.hidden = true;
} else {
  document.title = `${data.title} · 이창렬 사건 기록`;
  $('#case-number').textContent = id.padStart(2, '0');
  $('#title').textContent = data.title; $('#intro').textContent = data.intro;
  data.evidence.forEach((item) => addEvidence($('#evidence'), item));
  if (!data.evidence.length) $('#evidence-title').parentElement.parentElement.hidden = true;
  addStage(0);
}
