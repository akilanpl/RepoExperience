import { mountThinkingIndicator } from '../../thinking-indicator.js';

const mode = document.querySelector('#mode');
const desktop = document.querySelector('.desktop');
const film = document.querySelector('.film');
const dialog = desktop.querySelector('dialog');
const title = dialog.querySelector('#window-title');
const content = dialog.querySelector('.window-content');
const orb = desktop.querySelector('.thinking-orb');
const status = desktop.querySelector('.companion-status');
let pending;
let stopOrb;

function clearThinking() {
  clearTimeout(pending);
  pending = undefined;
  stopOrb?.();
  stopOrb = undefined;
  orb.hidden = true;
  status.textContent = 'Ready to help';
}

const commands = {
  calendar: {
    title: 'Calendar',
    body: `<p class="kicker">SATURDAY · 7 NOVEMBER</p><h2>Today’s schedule</h2>
      <ul class="entries">
        <li><time>10:30</time><div><strong>Meet Maya</strong><small>Design sync · Flatiron</small></div></li>
        <li><time>14:30</time><div><strong>Review RLB build</strong><small>Next task · 30 minutes</small></div></li>
        <li><time>17:00</time><div><strong>Send the prototype notes</strong><small>Personal reminder</small></div></li>
      </ul>`,
  },
  process: {
    title: 'Antigravity · Activity',
    body: `<p class="kicker">SAMPLE WORKSPACE</p><h2>RLB workspace</h2>
      <p><span class="pill">Running</span> Regression checks</p>
      <progress value="2" max="3" aria-label="Two of three stages complete"></progress>
      <ul class="entries">
        <li><span>✓</span><div><strong>Read repository</strong><small>Complete</small></div></li>
        <li><span>✓</span><div><strong>Apply filter change</strong><small>Complete</small></div></li>
        <li><span>›</span><div><strong>Run test suite</strong><small>In progress</small></div></li>
      </ul>`,
  },
  call: {
    title: 'Phone',
    body: `<p class="kicker">DEMO CONTACT</p><h2>Maya Chen</h2><p>Design teammate</p>
      <button type="button" class="window-action" data-action="call">Start demo call</button>
      <p class="call-status" role="status">Ready to call</p>`,
  },
  notifications: {
    title: 'Notification center',
    body: `<p class="kicker">RECENT · SAMPLE FEED</p><h2>Notifications</h2>
      <ul class="entries">
        <li><time>09:38</time><div><strong>RLB · Plan ready for review</strong><small>Taskboard workspace</small></div></li>
        <li><time>09:31</time><div><strong>Maya · See you at 10:30</strong><small>Messages</small></div></li>
        <li><time>09:14</time><div><strong>Calendar · Review RLB build</strong><small>Today at 14:30</small></div></li>
      </ul>`,
  },
};

mode.addEventListener('change', () => {
  const watching = mode.value === 'film';
  if (watching) clearThinking();
  desktop.hidden = watching;
  film.hidden = !watching;
  if (!watching) film.querySelector('video').pause();
  document.querySelector('.mode-caption').textContent = watching
    ? 'Watch the backpack companion concept.'
    : 'Try four commands with sample data.';
});

for (const button of desktop.querySelectorAll('[data-command]')) {
  button.addEventListener('click', () => {
    const command = commands[button.dataset.command];
    clearThinking();
    status.textContent = 'Thinking about ' + command.title + '…';
    orb.hidden = false;
    stopOrb = mountThinkingIndicator(orb);
    pending = setTimeout(() => {
      clearThinking();
      title.textContent = command.title;
      content.innerHTML = command.body;
      dialog.showModal();
    }, 1800);
  });
}

dialog.querySelector('.close').addEventListener('click', () => dialog.close());
content.addEventListener('click', event => {
  const button = event.target.closest('[data-action="call"]');
  if (!button) return;
  const calling = button.textContent === 'Start demo call';
  button.textContent = calling ? 'End demo call' : 'Start demo call';
  content.querySelector('.call-status').textContent = calling ? 'Demo call active · Maya Chen' : 'Demo call ended';
});

addEventListener('pagehide', clearThinking);
