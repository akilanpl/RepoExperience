import { trainClassifier } from './classifier.js';
import { filterBoard } from './taskboard/overdue.js';

const text = (tag, value) => {
  const node = document.createElement(tag);
  node.textContent = value;
  return node;
};

const check = (description, passed) => {
  if (!passed) throw new Error(description);
  return description;
};

const tasks = [
  { title: 'Send venue deposit', status: 'open', due: '2026-11-04' },
  { title: 'Review launch copy', status: 'open', due: '2026-11-07' },
  { title: 'Publish event page', status: 'open', due: '2026-11-10' },
  { title: 'Book photographer', status: 'done', due: '2026-11-03' },
  { title: 'Collect feedback', status: 'open' },
];
const today = '2026-11-07';

function renderClassifier(container, classify) {
  const form = document.createElement('form');
  const label = text('label', 'Support message');
  const input = document.createElement('input');
  input.required = true;
  input.maxLength = 300;
  input.value = 'I need a refund for an invoice I was charged twice for.';
  label.append(input);
  const button = text('button', 'Classify message');
  button.type = 'submit';
  const output = text('output', '');
  output.setAttribute('aria-live', 'polite');
  form.append(label, button, output);
  form.addEventListener('submit', event => {
    event.preventDefault();
    const prediction = classify(input.value);
    output.textContent = prediction
      ? prediction.label + ' · model score ' + prediction.modelScore + '%'
      : 'No clear match. Try a billing, account, or technical support message.';
  });
  container.append(form);
  form.requestSubmit();
}

function renderTaskboard(container) {
  const controls = document.createElement('div');
  controls.className = 'buttons';
  const list = document.createElement('ul');
  list.setAttribute('aria-live', 'polite');
  function select(view) {
    for (const button of controls.children) button.setAttribute('aria-pressed', String(button.dataset.filter === view));
    list.replaceChildren(...filterBoard(tasks, view, today).map(task =>
      text('li', task.title + ' · ' + (task.due ?? 'No due date'))));
  }
  for (const view of ['all', 'open', 'done', 'overdue']) {
    const button = text('button', view[0].toUpperCase() + view.slice(1));
    button.type = 'button';
    button.dataset.filter = view;
    button.addEventListener('click', () => select(view));
    controls.append(button);
  }
  container.append(text('p', 'Sample board · comparison date 7 Nov 2026'), controls, list);
  select('all');
}

export const examples = {
  classifier: {
    title: 'Build a support classifier',
    prompt: 'Build a small AI that routes support messages to Billing, Account, or Technical.',
    file: 'classifier.js',
    plan: [
      'Train a multinomial naïve Bayes classifier on 12 labeled messages, with four messages per category.',
      'Tokenize words, apply Laplace smoothing, and return an uncertain result for unknown words or a tie.',
      'Check three unseen messages and an unknown-input case. Open an editable message field so you can try it.',
    ],
    planning: 'Defining the labels, training examples and holdout checks…',
    coding: 'Training the classifier from its labeled examples…',
    testing: 'Checking unseen messages and the unknown-input path…',
    run() {
      const classify = trainClassifier();
      const checks = [
        check('Unseen billing message routes to Billing', classify('please refund this invoice')?.label === 'Billing'),
        check('Unseen login message routes to Account', classify('help reset my account password')?.label === 'Account'),
        check('Unseen crash message routes to Technical', classify('app freezes on desktop')?.label === 'Technical'),
        check('Unknown words return no prediction', classify('zebra kaleidoscope') === null),
      ];
      return { checks, render: container => renderClassifier(container, classify) };
    },
  },
  repository: {
    title: 'Add an Overdue filter to a repo',
    prompt: 'Repository: Taskboard sample. Add an Overdue filter while preserving All, Open, and Done.',
    file: 'taskboard/overdue.js',
    plan: [
      'Read README.md for the task shape and tasks.js for the existing status filters.',
      'Add overdue.js and delegate existing views to filterTasks. For Overdue, include open tasks with a due date strictly before the comparison date.',
      'Check legacy views, completed tasks, undated tasks, and the due-today boundary. Wire the filter into the working board preview.',
    ],
    planning: 'Reading the supplied repository README and filter implementation…',
    coding: 'Preparing the Overdue filter on top of the existing task API…',
    testing: 'Running regression checks against the sample repository…',
    async inspect() {
      const files = ['taskboard/README.md', 'taskboard/tasks.js'];
      return Promise.all(files.map(async file => {
        const response = await fetch(file);
        if (!response.ok) throw new Error('Could not read ' + file);
        return { file, body: await response.text() };
      }));
    },
    run() {
      const overdue = filterBoard(tasks, 'overdue', today);
      const checks = [
        check('All, Open, and Done preserve the existing results',
          ['all', 'open', 'done'].every(view => filterBoard(tasks, view, today).map(task => task.title).join() ===
            tasks.filter(task => view === 'all' || task.status === view).map(task => task.title).join())),
        check('Only the past-due open task appears in Overdue', overdue.length === 1 && overdue[0] === tasks[0]),
        check('Due today, future, completed, and undated tasks are excluded',
          filterBoard(tasks.slice(1), 'overdue', today).length === 0),
      ];
      return { checks, render: renderTaskboard };
    },
  },
};
