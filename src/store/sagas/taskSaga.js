import { call, put, takeEvery } from 'redux-saga/effects';
import { setTasks, setLoading, setError } from '../actions/taskActions';
import { saveTasksToLocalStorage, getTasksFromLocalStorage } from '../../services/localStorage';

function* fetchTasksSaga() {
  try {
    yield put(setLoading(true));
    const tasks = yield call(getTasksFromLocalStorage);
    yield put(setTasks(tasks || []));
    yield put(setLoading(false));
  } catch (error) {
    yield put(setError(error.message));
    yield put(setLoading(false));
  }
}

function* addTaskSaga(action) {
  try {
    yield put(setLoading(true));
    const tasks = yield call(getTasksFromLocalStorage);
    const newTasks = [...(tasks || []), action.payload];
    yield call(saveTasksToLocalStorage, newTasks);
    yield put(setTasks(newTasks));
    yield put(setLoading(false));
  } catch (error) {
    yield put(setError(error.message));
    yield put(setLoading(false));
  }
}

function* deleteTaskSaga(action) {
  try {
    yield put(setLoading(true));
    const tasks = yield call(getTasksFromLocalStorage);
    const newTasks = tasks.filter(task => task.id !== action.payload);
    yield call(saveTasksToLocalStorage, newTasks);
    yield put(setTasks(newTasks));
    yield put(setLoading(false));
  } catch (error) {
    yield put(setError(error.message));
    yield put(setLoading(false));
  }
}

export function* watchTasks() {
  yield takeEvery('FETCH_TASKS', fetchTasksSaga);
  yield takeEvery('ADD_TASK', addTaskSaga);
  yield takeEvery('DELETE_TASK', deleteTaskSaga);
}