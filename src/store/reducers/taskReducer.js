const initialState = {
    tasks: [],
    loading: false,
    error: null
  };
  
  const taskReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'ADD_TASK':
        return {
          ...state,
          tasks: [...state.tasks, action.payload]
        };
      case 'DELETE_TASK':
        return {
          ...state,
          tasks: state.tasks.filter(task => task.id !== action.payload)
        };
      case 'SET_TASKS':
        return {
          ...state,
          tasks: action.payload
        };
      case 'SET_LOADING':
        return {
          ...state,
          loading: action.payload
        };
      case 'SET_ERROR':
        return {
          ...state,
          error: action.payload
        };
      default:
        return state;
    }
  };
  
  export default taskReducer;