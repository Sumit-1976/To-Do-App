import { createStore, applyMiddleware, combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { all } from 'redux-saga/effects';
import authReducer from './reducers/authReducer';
import taskReducer from './reducers/taskReducer';
import weatherReducer from './reducers/weatherReducer';
import { watchAuth } from './sagas/authSaga';
import { watchTasks } from './sagas/taskSaga';
import { watchWeather } from './sagas/weatherSaga';

const rootReducer = combineReducers({
  auth: authReducer,
  tasks: taskReducer,
  weather: weatherReducer
});

function* rootSaga() {
  yield all([
    watchAuth(),
    watchTasks(),
    watchWeather()
  ]);
}

const sagaMiddleware = createSagaMiddleware();

const store = createStore(
  rootReducer,
  applyMiddleware(sagaMiddleware)
);

sagaMiddleware.run(rootSaga);

export default store;