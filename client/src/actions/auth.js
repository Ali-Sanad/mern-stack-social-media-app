import axios from 'axios';
import {setAlert} from './alert';
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_PROFILE,
  PROFILE_ERROR,
  USER_IMAGE,
} from './types';

import setAuthToken from '../utils/setAuthToken';

//check user
export const checkUser = () => async (dispatch) => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }
  try {
    const res = await axios.get('/api/auth');
    // console.log(res.data);

    dispatch({
      type: USER_LOADED,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
    });
  }
};

//register user
export const register = (formData) => async (dispatch) => {
  try {
    const res = await axios.post('/api/users', formData);
    localStorage.setItem('token', res.data.token);

    dispatch({
      type: REGISTER_SUCCESS,
    });
    dispatch(checkUser());
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }
    dispatch({
      type: REGISTER_FAIL,
    });
  }
};

//login user
export const login = (formData) => async (dispatch) => {
  try {
    const res = await axios.post('/api/auth', formData);
    localStorage.setItem('token', res.data.token);

    dispatch({
      type: LOGIN_SUCCESS,
    });
    dispatch(checkUser());
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }
    dispatch({
      type: LOGIN_FAIL,
    });
  }
};

//logout
export const logout = () => (dispatch) => {
  dispatch({
    type: CLEAR_PROFILE,
  });
  dispatch({
    type: LOGOUT,
  });
};

//update user info   //post => api/users/image
export const userImageUpload = (formData) => async (dispatch) => {
  try {
    const res = await axios.post(`/api/users/image`, formData);

    dispatch({
      type: USER_IMAGE,
      payload: res.data,
    });
    dispatch(setAlert('Image Uploaded', 'success'));
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: {msg: err.response.statusText, status: err.response.status},
    });
  }
};
