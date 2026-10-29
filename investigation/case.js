const cases = {
  '1': { title: '지도에 남겨진 기록', intro: '흩어진 기록 속에서 다음 단서를 찾아보세요.', evidence: [['diary-1024.png', '문제 1-1 · 일기'], ['diary-0904.png', '문제 1-2 · 일기']], question: '일기는 날짜 순으로 봐야한다.', answer: '5122', numeric: true, result: ['navigation.png', '문제 1 정답 · 네비게이션 기록'] },
  '2': { title: '삼호 성도 리스트', intro: '성도 리스트를 살펴보고 질문에 답하세요.', evidence: [['people-question.jpg', '문제 2 · 삼호 성도 리스트']], question: '예수님이 가장 먼저 부르신 제자는 누구인가?', answer: '안드레', result: ['people-answer.png', '문제 2 정답 · 성도 리스트'] },
  '3': { title: '영수증 모음', intro: '현장에서 확보한 영수증을 자세히 살펴보세요.', evidence: [['receipts.png', '증거 자료 · 영수증 모음']] },
  '4': { title: '틀린 지도', intro: '아직 확인되지 않은 기록입니다.', evidence: [], question: '임시01', answer: '임시01', result: ['route.png', '확보된 자료 · 대피 경로'] },
  '5': { title: '의심과 회개의 기록', intro: '두 일기에 남겨진 내용을 살펴보세요.', evidence: [['suspicion.png', '증거 자료 · 의심 일기'], ['repentance.png', '증거 자료 · 회개 후 일기']] }
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
  data.evidence.forEach((item) => addEvidence($('#evidence'), item));
  if (!data.evidence.length) $('#evidence-title').parentElement.parentElement.hidden = true;
  if (data.answer) {
    $('#answer-section').hidden = false;
    $('#question').textContent = data.question;
    const input = $('#answer-input');
    input.placeholder = data.numeric ? '네 자리 숫자' : '정답을 입력하세요';
    if (data.numeric) { input.inputMode = 'numeric'; input.maxLength = 4; input.pattern = '[0-9]*'; input.addEventListener('input', () => { input.value = input.value.replace(/[^0-9]/g, ''); }); }
    $('#form').addEventListener('submit', (event) => {
      event.preventDefault();
      const value = input.value.normalize('NFC').replace(/\s+/g, '');
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
