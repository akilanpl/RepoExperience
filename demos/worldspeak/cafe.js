const scene = document.querySelector('.scene');
const video = scene.querySelector('video');
const motion = document.querySelector('.motion');
const sceneNote = document.querySelector('.scene-note');
const people = [...document.querySelectorAll('.person')];
const instruction = document.querySelector('.instruction');
const language = document.querySelector('select');
const actions = document.querySelector('.actions');
const actionButtons = [...actions.querySelectorAll('button')];
const review = document.querySelector('.review');
const sentence = document.querySelector('.sentence');
const speak = document.querySelector('.speak');
const status = document.querySelector('.status');
const reset = document.querySelector('.reset');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

// The help phrases are the repository's request-help.generic templates.
// Calling someone over uses a café-specific custom message.
const phrases = {
  en: { help: 'Please help me.', call: 'Could you come over here, please?' },
  ta: { help: 'தயவுசெய்து எனக்கு உதவுங்கள்.', call: 'தயவுசெய்து இங்கே வர முடியுமா?' },
};

const defaultInstruction = instruction.textContent;
let person;
let action;
let closeUp = false;
let currentSpeech;

function stopSpeech() {
  if (!currentSpeech) return;
  currentSpeech = undefined;
  window.speechSynthesis?.cancel();
}

function update() {
  const text = action ? phrases[language.value][action] : '';
  sentence.textContent = text;
  sentence.lang = language.value;
  actions.hidden = !person;
  review.hidden = !action;
  reset.hidden = !person;
  for (const button of people) {
    button.hidden = closeUp;
    button.setAttribute('aria-pressed', String(button === person));
  }
  for (const button of actionButtons) {
    button.setAttribute('aria-pressed', String(button.dataset.action === action));
  }
  scene.classList.toggle('is-close', closeUp);
  motion.hidden = closeUp;
  sceneNote.hidden = !closeUp;
  instruction.textContent = person ? person.textContent.trim().replace(/^\d+\s*/, '') + ' selected. Choose what you want to say.' : defaultInstruction;
}

function openCloseUp() {
  video.pause();
  const x = person.style.getPropertyValue('--x') || getComputedStyle(person).getPropertyValue('--x');
  const y = getComputedStyle(person).getPropertyValue('--y');
  scene.style.setProperty('--target-x', x);
  scene.style.setProperty('--target-y', y);
  closeUp = true;
  update();
}

function playBackground() {
  video.play().catch(() => { motion.textContent = 'Play background'; });
}

video.addEventListener('play', () => { motion.textContent = 'Pause background'; });
video.addEventListener('pause', () => { motion.textContent = 'Play background'; });
video.addEventListener('timeupdate', () => {
  const progress = Math.min(video.currentTime / 2.25, 1);
  people[0].style.setProperty('--x', `${24 - 6 * progress}%`);
  people[1].style.setProperty('--x', `${67 - 7 * progress}%`);
});
motion.addEventListener('click', () => {
  if (video.paused) playBackground();
  else video.pause();
});

for (const button of people) {
  button.addEventListener('click', () => {
    stopSpeech();
    video.pause();
    person = button;
    action = undefined;
    status.textContent = '';
    update();
    actionButtons[0].focus();
  });
}

for (const button of actionButtons) {
  button.addEventListener('click', () => {
    stopSpeech();
    action = button.dataset.action;
    closeUp = false;
    status.textContent = 'Review the message, then press Speak when you’re ready.';
    update();
    speak.focus();
  });
}

language.addEventListener('change', () => {
  stopSpeech();
  closeUp = false;
  status.textContent = action ? 'Review the updated message before speaking.' : '';
  update();
});

speak.addEventListener('click', () => {
  if (!person || !action) return;
  stopSpeech();
  const synth = window.speechSynthesis;
  const voice = synth?.getVoices().find(item => item.localService && item.lang.split('-')[0].toLowerCase() === language.value);
  if (voice && typeof SpeechSynthesisUtterance === 'function') {
    const utterance = new SpeechSynthesisUtterance(sentence.textContent);
    utterance.voice = voice;
    utterance.lang = voice.lang;
    currentSpeech = utterance;
    utterance.onend = utterance.onerror = event => {
      if (currentSpeech !== utterance) return;
      currentSpeech = undefined;
      if (event.type === 'error') status.textContent = 'Speech was unavailable. The exact message is still on screen.';
    };
    synth.speak(utterance);
    status.textContent = 'Speaking the exact message shown above.';
  } else {
    status.textContent = 'No matching device voice is available. The exact message is shown on screen.';
  }
  if (action === 'call') openCloseUp();
});

reset.addEventListener('click', () => {
  stopSpeech();
  person = action = undefined;
  closeUp = false;
  status.textContent = '';
  update();
  if (!reducedMotion.matches) playBackground();
  people[0].focus();
});

reducedMotion.addEventListener('change', event => {
  if (event.matches) video.pause();
});
addEventListener('pagehide', stopSpeech);
if (!reducedMotion.matches) playBackground();
