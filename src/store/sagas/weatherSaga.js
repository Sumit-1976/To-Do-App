import { call, put, takeEvery } from 'redux-saga/effects';
import { fetchWeatherRequest, fetchWeatherSuccess, fetchWeatherFailure } from '../actions/weatherActions';
import { fetchWeather } from '../../services/api';

function* fetchWeatherSaga(action) {
  try {
    yield put(fetchWeatherRequest());
    const response = yield call(fetchWeather, action.payload);
    yield put(fetchWeatherSuccess(response.data));
  } catch (error) {
    yield put(fetchWeatherFailure(error.message));
  }
}

export function* watchWeather() {
  yield takeEvery('FETCH_WEATHER', fetchWeatherSaga);
}