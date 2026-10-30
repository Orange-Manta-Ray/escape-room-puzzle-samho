const cases = {
  '1': {
    title: '기본단서', intro: '확보된 신상정보에서 다음 기록으로 이어지는 단서를 찾으세요.',
    evidence: [['basic-clue.png', '기본단서 · 안내자 신상정보']],
    stages: [{ question: '주소보다 먼저, 이름보다 나중에 있는...', answer: 'park92', results: [['directory-1.png', '인명부 1'], ['directory-2.png', '인명부 2']] }]
  },
  '2': {
    title: '불출대장', intro: '불출대장 기록에 남겨진 숫자를 찾아 잠금을 차례로 해제하세요.', evidence: [],
    stages: [
      { question: '홍도연 김희원 불출사유', answer: '0910', digits: 4, results: [['diary.png', '확보된 기록 · 홍도연 다이어리']] },
      { question: '다이어리에 숨겨진 네 자리 숫자를 입력하세요.', answer: '4151', digits: 4, results: [['photo-1.png', '확보된 사진']] },
      { question: '예전 목원과 등산도 같이 갔엇구나! 근데 이 친구 생일이 언제였지? 어디에 쓰여져 있었는데...', answer: '100105', digits: 6, additional: true, results: [['photo-2.png', '추가 확보 사진']] }
    ]
  },
  '3': { title: '홍도연 인스타그램', intro: '사진과 기록 속에 남은 단서를 살펴보세요.', evidence: [['instagram.png', '홍도연 인스타그램']], stages: [] },
  '4': { title: '교회 다녀온 하루의 기록', intro: '하루의 기록을 살펴보세요.', evidence: [['church-day.png', '교회 다녀온 하루의 기록']], stages: [] }
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
  const question = document.createElement('p'); question.className = 'question'; question.textContent = stage.question;
  section.append(head, question);
  if (stage.digits) {
    const lock = document.createElement('div'); lock.className = 'lock';
    const image = document.createElement('img'); image.src = `assets/lock-${stage.digits}.svg`; image.alt = `${stage.digits}자리 숫자 자물쇠`;
    lock.append(image); section.append(lock);
  }
  const form = document.createElement('form'); form.className = 'stage-form';
  const label = document.createElement('label'); label.htmlFor = `input-${index}`; label.textContent = '정답 입력';
  const row = document.createElement('div'); row.className = 'answer-row';
  const input = document.createElement('input'); input.id = label.htmlFor; input.autocomplete = 'off';
  input.placeholder = stage.digits ? `${stage.digits}자리 숫자` : '정답을 입력하세요';
  if (stage.digits) {
    input.inputMode = 'numeric'; input.maxLength = stage.digits; input.pattern = '[0-9]*';
    input.addEventListener('input', () => { input.value = input.value.replace(/[^0-9]/g, ''); });
  } else { input.autocapitalize = 'none'; input.spellcheck = false; }
  const button = document.createElement('button'); button.type = 'submit'; button.textContent = '확인 →';
  const message = document.createElement('p'); message.id = `message-${index}`; message.className = 'stage-message'; message.setAttribute('role', 'status'); message.setAttribute('aria-live', 'polite');
  message.textContent = '정답을 입력하고 확인을 눌러주세요.';
  input.setAttribute('aria-describedby', message.id);
  row.append(input, button); form.append(label, row, message); section.append(form);
  $('#stages').append(section);
  let solved = false;
  form.addEventListener('submit', (event) => {
    event.preventDefault(); if (solved) return;
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
    $('#stages').append(result); addStage(index + 1);
    result.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}
if (!data) {
  $('#title').textContent = '사건 자료를 찾을 수 없습니다';
  $('#intro').textContent = '전달받은 QR 코드를 다시 스캔해 주세요.';
  $('#evidence-title').parentElement.parentElement.hidden = true;
} else {
  document.title = `${data.title} · 홍도연 사건 기록`;
  $('#case-number').textContent = id.padStart(2, '0');
  $('#title').textContent = data.title; $('#intro').textContent = data.intro;
  data.evidence.forEach((item) => addEvidence($('#evidence'), item));
  if (!data.evidence.length) $('#evidence-title').parentElement.parentElement.hidden = true;
  addStage(0);
}
