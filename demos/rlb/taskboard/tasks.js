export function filterTasks(tasks, view) {
  return view === 'all' ? tasks : tasks.filter(task => task.status === view);
}
