const TASKS_KEY = 'todo-app-tasks';
const AUTH_KEY = 'todo-app-auth';

export const getTasksFromLocalStorage = () => {
  const tasks = localStorage.getItem(TASKS_KEY);
  return tasks ? JSON.parse(tasks) : null;
};

export const saveTasksToLocalStorage = (tasks) => {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
};

export const saveAuthToLocalStorage = (user) => {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
};

export const getAuthFromLocalStorage = () => {
  const auth = localStorage.getItem(AUTH_KEY);
  return auth ? JSON.parse(auth) : null;
};

export const clearAuthFromLocalStorage = () => {
  localStorage.removeItem(AUTH_KEY);
};