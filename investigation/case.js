const cases = {
  '1': { gate: { image: ['route-real.png', '확보된 자료 · 대피 경로'], answer: 'confidential' }, title: '지도에 남겨진 기록', intro: '흩어진 기록 속에서 다음 단서를 찾아보세요.', evidence: [['diary-1024.png', '문제 1-1 · 일기'], ['diary-0904.png', '문제 1-2 · 일기']], question: '일기는 날짜 순으로 봐야한다.', answer: '5122', numeric: true, result: ['navigation.png', '문제 1 정답 · 네비게이션 기록'] },
  '2': { title: '확보된 사진', intro: '확보된 사진을 살펴보세요.', evidence: [['people-question.jpg', '확보된 사진']] },
  '3': { title: '10월 27일의 지출', intro: '확보한 영수증에서 금액을 찾아보세요.', evidence: [], question: '10월 27일 조창현이 지출한 총 지출한 금액이 얼마더라..?', pendingAnswer: true, digits: 5, result: ['people-answer.png', '삼호 성도 리스트'] },
  '4': { title: '알파벳의 규칙', intro: '빈칸에 들어갈 알파벳을 찾아보세요.', evidence: [], question: 'O T T F  □  S S E N T', answer: 'f', ignoreCase: true, result: ['route.png', '확보된 자료 · 대피 경로'] },
  '5': { title: '의심과 회개의 기록', intro: '두 일기에 남겨진 내용을 살펴보세요.', evidence: [['suspicion.png', '증거 자료 · 의심 일기'], ['repentance.png', '증거 자료 · 회개 후 일기']], question: '예수님이 가장 먼저 부르신 제자는 누구인가?', answer: '안드레', result: ['receipts.png', '영수증 모음'] }
};
const id = new URLSearchParams(location.search).get('case');
const data = cases[id];
const $ = (selector) => document.querySelector(selector);
function addEvidence(container, [filename, caption]) {
  const figure = document.createElement('figure');
  const link = document.createElement('a');
  link.href = `assets/${filename}`;
  link.target = '_blank';
  link.rel = 'noopener';
  link.setAttribute('aria-label', `${caption} 원본 크게 보기`);
  const image = document.createElement('img');
  image.src = link.href;
  image.alt = caption;
  image.decoding = 'async';
  link.append(image);
  const text = document.createElement('figcaption');
  text.textContent = caption + '  ·  눌러서 크게 보기 ↗';
  figure.append(link, text);
  container.append(figure);
}
if (!data) {
  $('#title').textContent = '사건 자료를 찾을 수 없습니다';
  $('#intro').textContent = '전달받은 QR 코드를 다시 스캔해 주세요.';
  $('#evidence-title').parentElement.parentElement.hidden = true;
} else {
  document.title = `${data.title} · 삼호 사건 기록`;
  $('#case-number').textContent = id.padStart(2, '0');
  $('#title').textContent = data.title;
  $('#intro').textContent = data.intro;
  if (data.gate) {
    $('#puzzle-section').hidden = true;
    $('#entry-section').hidden = false;
    addEvidence($('#entry-evidence'), data.gate.image);
    let unlocked = false;
    $('#entry-form').addEventListener('submit', (event) => {
      event.preventDefault();
      if (unlocked) return;
      const value = $('#entry-input').value.normalize('NFC').trim().toLowerCase();
      if (value !== data.gate.answer) {
        $('#entry-message').textContent = value ? '정답이 아닙니다. 다시 확인해 주세요.' : '정답을 먼저 입력해 주세요.';
        $('#entry-message').classList.add('error');
        return;
      }
      unlocked = true;
      $('#entry-input').disabled = true;
      $('#entry-form').querySelector('button').disabled = true;
      $('#entry-message').classList.remove('error');
      $('#entry-message').textContent = '인증 완료. 다음 기록을 확인하세요.';
      $('#puzzle-section').hidden = false;
      renderPuzzle();
      $('#puzzle-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  } else {
    renderPuzzle();
  }
}
function renderPuzzle() {
  data.evidence.forEach((item) => addEvidence($('#evidence'), item));
  if (!data.evidence.length) $('#evidence-title').parentElement.parentElement.hidden = true;
  if (data.answer || data.pendingAnswer) {
    $('#answer-section').hidden = false;
    $('#question').textContent = data.question;
    const input = $('#answer-input');
    const digits = data.digits || (data.numeric ? 4 : 0);
    input.placeholder = digits ? `${digits}자리 숫자` : '정답을 입력하세요';
    if (data.digits === 5) { const lock = document.createElement('div'); lock.className = 'lock'; const image = document.createElement('img'); image.src = 'assets/lock-5.svg'; image.alt = '5자리 숫자 자물쇠'; lock.append(image); $('#question').after(lock); }
    if (data.pendingAnswer) { input.disabled = true; $('#form').querySelector('button').disabled = true; $('#message').textContent = '정답 확인 후 열립니다.'; }
    if (digits) { input.inputMode = 'numeric'; input.maxLength = digits; input.pattern = '[0-9]*'; input.addEventListener('input', () => { input.value = input.value.replace(/[^0-9]/g, ''); }); }
    $('#form').addEventListener('submit', (event) => {
      event.preventDefault();
      let value = input.value.normalize('NFC').replace(/\s+/g, '');
      if (data.ignoreCase) value = value.toLowerCase();
      if (value === data.answer) {
        if ($('#result').hidden) addEvidence($('#result-evidence'), data.result);
        $('#result').hidden = false;
        $('#message').textContent = '인증 완료. 아래 자료를 확인하세요.';
        $('#message').classList.remove('error');
        $('#result').scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        $('#message').textContent = value ? '정답이 아닙니다. 다시 확인해 주세요.' : '정답을 먼저 입력해 주세요.';
        $('#message').classList.add('error');
      }
    });
  }
}
