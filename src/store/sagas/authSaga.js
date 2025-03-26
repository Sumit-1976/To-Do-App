import { call, put, takeEvery } from 'redux-saga/effects';
import { loginRequest, loginSuccess, loginFailure } from '../actions/authActions';
import { saveAuthToLocalStorage, clearAuthFromLocalStorage } from '../../services/localStorage';

function* loginSaga(action) {
  try {
    yield put(loginRequest());
    yield call(() => new Promise(resolve => setTimeout(resolve, 1000)));
    
    const mockUser = {
      id: 1,
      username: action.payload.username
    };
    
    yield call(saveAuthToLocalStorage, mockUser);
    yield put(loginSuccess(mockUser));
  } catch (error) {
    yield put(loginFailure(error.message));
  }
}

function* logoutSaga() {
  yield call(clearAuthFromLocalStorage);
}

export function* watchAuth() {
  yield takeEvery('LOGIN', loginSaga);
  yield takeEvery('LOGOUT', logoutSaga);
}