export const addTask = (task) => ({
    type: 'ADD_TASK',
    payload: task
  });
  
  export const deleteTask = (id) => ({
    type: 'DELETE_TASK',
    payload: id
  });
  
  export const setTasks = (tasks) => ({
    type: 'SET_TASKS',
    payload: tasks
  });
  
  export const setLoading = (loading) => ({
    type: 'SET_LOADING',
    payload: loading
  });
  
  export const setError = (error) => ({
    type: 'SET_ERROR',
    payload: error
  });