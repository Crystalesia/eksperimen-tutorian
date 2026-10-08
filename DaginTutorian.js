const lessons = {
  matematika: { title: 'Mengenal pecahan', questions: [
    { text: 'Satu pizza dibagi menjadi 4 bagian sama besar. Kamu mengambil 1 bagian. Berapa bagian pizza yang kamu ambil?', options: ['1/2', '1/4', '3/4', '4/4'], correct: 1, explanation: 'Penyebut 4 menunjukkan jumlah seluruh bagian yang sama besar. Pembilang 1 menunjukkan bagian yang diambil. Jadi jawabannya 1/4.' },
    { text: 'Kamu mengambil 2 dari 4 bagian pizza yang sama besar. Pecahan mana yang nilainya sama dengan 2/4?', options: ['1/4', '3/4', '1/2', '2/3'], correct: 2, explanation: 'Dua dari empat bagian mengisi setengah pizza. Membagi pembilang dan penyebut 2/4 dengan 2 menghasilkan 1/2.' }
  ] },
  sains: { title: 'Air di sekitar kita', questions: [
    { text: 'Es batu diletakkan di meja pada suhu ruangan. Setelah beberapa saat, es menjadi air. Perubahan ini disebut apa?', options: ['Membeku', 'Menguap', 'Mencair', 'Mengembun'], correct: 2, explanation: 'Mencair adalah perubahan dari padat menjadi cair. Es menerima panas dari lingkungan lalu berubah menjadi air.' },
    { text: 'Bagian luar gelas berisi es terasa basah. Dari mana titik air di luar gelas itu berasal?', options: ['Es menembus gelas', 'Uap air di udara', 'Gelas membuat air', 'Air di dalam bocor'], correct: 1, explanation: 'Uap air di udara bersentuhan dengan permukaan gelas yang dingin lalu mengembun menjadi titik air. Air itu tidak menembus gelas.' }
  ] },
  bahasa: { title: 'Kata dalam konteks', questions: [
    { text: 'Lengkapi kalimat: “She ___ a book every evening.” Kata mana yang tepat?', options: ['read', 'reading', 'reads', 'to read'], correct: 2, explanation: 'Dalam simple present, subjek she menggunakan kata kerja dengan akhiran -s. Karena itu, kalimatnya adalah “She reads a book every evening.”' },
    { text: 'Apa arti kalimat “Could you help me, please?” dalam percakapan sehari-hari?', options: ['Aku akan membantumu', 'Bisakah kamu membantuku?', 'Kamu sudah membantuku', 'Aku tidak perlu bantuan'], correct: 1, explanation: 'Could you ... please? adalah bentuk permintaan yang sopan. Kalimat tersebut meminta bantuan kepada lawan bicara.' }
  ] }
};
let topic = 'matematika';
let questionIndex = 0;
let answered = false;
const question = document.querySelector('#question');
const answers = document.querySelector('#answers');
const feedback = document.querySelector('#feedback');
const nextButton = document.querySelector('#next-question');
const topicButtons = document.querySelectorAll('.topic-choices button');
function renderQuestion() {
  answered = false;
  const lesson = lessons[topic];
  const current = lesson.questions[questionIndex];
  document.querySelector('#lesson-topic').textContent = lesson.title;
  document.querySelector('#lesson-progress').textContent = `Soal ${questionIndex + 1} dari ${lesson.questions.length}`;
  question.textContent = current.text;
  answers.replaceChildren();
  current.options.forEach((option, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'answer';
    button.textContent = option;
    button.setAttribute('aria-pressed', 'false');
    button.addEventListener('click', () => checkAnswer(index, button));
    answers.append(button);
  });
  feedback.replaceChildren(Object.assign(document.createElement('p'), { textContent: 'Pilih jawaban yang menurutmu tepat.' }));
  nextButton.hidden = true;
  topicButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.topic === topic)));
}
function checkAnswer(index, selectedButton) {
  const current = lessons[topic].questions[questionIndex];
  answered = true;
  answers.querySelectorAll('button').forEach(button => button.setAttribute('aria-pressed', String(button === selectedButton)));
  const heading = document.createElement('strong');
  heading.textContent = index === current.correct ? 'Tepat, ini alasannya.' : `Belum tepat. Jawabannya: ${current.options[current.correct]}.`;
  const explanation = document.createElement('p');
  explanation.textContent = current.explanation;
  feedback.replaceChildren(heading, explanation);
  nextButton.textContent = questionIndex === lessons[topic].questions.length - 1 ? 'Ulangi materi ini' : 'Soal berikutnya';
  nextButton.hidden = false;
}
function selectTopic(selectedTopic) {
  if (!Object.hasOwn(lessons, selectedTopic)) throw new Error('Materi tidak ditemukan.');
  topic = selectedTopic;
  questionIndex = 0;
  document.querySelector('#latihan').open = true;
  renderQuestion();
}
document.querySelectorAll('[data-topic]').forEach(control => {
  control.addEventListener('click', () => {
    selectTopic(control.dataset.topic);
  });
});
nextButton.addEventListener('click', () => {
  if (!answered) return;
  questionIndex = (questionIndex + 1) % lessons[topic].questions.length;
  renderQuestion();
  answers.querySelector('button').focus({ preventScroll: true });
});
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigasi');
const desktop = window.matchMedia('(min-width:1200px)');
function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  navigation.hidden = !desktop.matches;
}
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  navigation.hidden = open;
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menuButton.focus();
  }
});
desktop.addEventListener('change', closeMenu);
closeMenu();
renderQuestion();
function revealLinkedLesson() {
  if (window.location.hash === '#latihan') document.querySelector('#latihan').open = true;
}
window.addEventListener('hashchange', revealLinkedLesson);
revealLinkedLesson();
const contactDialog = document.querySelector('#contact-dialog');
document.querySelectorAll('[data-contact]').forEach(link => {
  link.addEventListener('click', event => {
    if (typeof contactDialog.showModal !== 'function') return;
    event.preventDefault();
    document.querySelector('#contact-dialog-title').textContent = `${link.dataset.contact} contoh`;
    document.querySelector('#contact-dialog-copy').textContent = 'Informasi ini adalah data contoh untuk pratinjau Tutorian.id. Kanal resmi belum aktif dan belum dapat menerima pesan.';
    contactDialog.showModal();
  });
});
const registrationForm = document.querySelector('#registration-form');
const registrationResult = document.querySelector('#registration-result');
const studentName = document.querySelector('#student-name');
const studentAge = document.querySelector('#student-age');
const schoolLevel = document.querySelector('#school-level');
const phoneNumber = document.querySelector('#phone-number');
const studentNotes = document.querySelector('#student-notes');
let suggestedProgramNote = '';
document.querySelectorAll('[data-program]').forEach(link => {
  link.addEventListener('click', () => {
    if (!studentNotes.value.trim() || studentNotes.value === suggestedProgramNote) {
      suggestedProgramNote = `Program pilihan: ${link.dataset.program}.`;
      studentNotes.value = suggestedProgramNote;
    }
    registrationResult.hidden = true;
  });
});
registrationForm.addEventListener('input', () => {
  studentName.setCustomValidity('');
  phoneNumber.setCustomValidity('');
  registrationResult.hidden = true;
});
registrationForm.addEventListener('submit', event => {
  event.preventDefault();
  studentName.setCustomValidity(studentName.value.trim().length < 2 ? 'Tulis nama dengan sedikitnya dua karakter.' : '');
  const phoneDigits = phoneNumber.value.replace(/\D/g, '');
  const validPhone = /^[+\d\s()-]+$/.test(phoneNumber.value) && phoneDigits.length >= 8 && phoneDigits.length <= 15;
  phoneNumber.setCustomValidity(validPhone ? '' : 'Tulis nomor HP berisi 8–15 angka; awalan + dan pemisah boleh dipakai.');
  if (!registrationForm.reportValidity()) return;
  const heading = document.createElement('h4');
  heading.textContent = 'Pratinjau pendaftaran siap.';
  const notice = document.createElement('p');
  notice.textContent = 'Belum terkirim. Informasi ini hanya tampil di halaman ini dan hilang saat halaman dimuat ulang.';
  const summary = document.createElement('ul');
  const entries = [['Nama', studentName.value.trim()], ['Usia', `${studentAge.value} tahun`], ['Tingkat sekolah', schoolLevel.value], ['Nomor HP', phoneNumber.value.trim()], ['Catatan', studentNotes.value.trim() || 'Tidak ada catatan']];
  entries.forEach(([label, value]) => {
    const item = document.createElement('li');
    item.textContent = `${label}: ${value}`;
    summary.append(item);
  });
  registrationResult.replaceChildren(heading, notice, summary);
  registrationResult.hidden = false;
  registrationResult.focus({ preventScroll: true });
  registrationResult.scrollIntoView({ behavior: 'instant', block: 'nearest' });
});
document.querySelector('#registration-submit').disabled = false;
document.querySelector('#copyright-year').textContent = new Date().getFullYear();
const modelContext = document.modelContext;
if (modelContext?.registerTool) {
  const lifecycle = new AbortController();
  const tool = {
    name: 'start_learning_sample',
    title: 'Buka contoh materi Tutorian.id',
    description: 'Memilih salah satu materi contoh, mengembalikan latihan ke soal pertama, dan membuka bagian latihan. Tidak mengirim atau menyimpan jawaban.',
    inputSchema: { type: 'object', properties: { topic: { type: 'string', enum: Object.keys(lessons) } }, required: ['topic'], additionalProperties: false },
    annotations: { readOnlyHint: false, untrustedContentHint: false },
    execute(input) {
      if (!input || typeof input !== 'object' || Object.keys(input).length !== 1 || !Object.hasOwn(lessons, input.topic)) throw new Error('Pilih matematika, sains, atau bahasa.');
      selectTopic(input.topic);
      document.querySelector('#latihan').scrollIntoView({ behavior: 'instant' });
      return { topic, question: lessons[topic].questions[0].text, options: lessons[topic].questions[0].options };
    }
  };
  try {
    Promise.resolve(modelContext.registerTool(tool, { signal: lifecycle.signal })).catch(() => lifecycle.abort());
  } catch {
    lifecycle.abort();
  }
  window.addEventListener('pagehide', () => lifecycle.abort(), { once: true });
}