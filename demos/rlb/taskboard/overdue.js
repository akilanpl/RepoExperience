import { filterTasks } from './tasks.js';

export function filterBoard(tasks, view, today) {
  if (view !== 'overdue') return filterTasks(tasks, view);
  return filterTasks(tasks, 'open').filter(task => task.due && task.due < today);
}
