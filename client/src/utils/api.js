import axios from 'axios';
import store from '../store';
import {LOGOUT} from '../actions/types';

const api = axios.create({
  baseURL: '/api',
});

/**
 intercept any error responses from the api (axios instance) and check  
 if the token has expired or not to logout the user
**/

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response.status === 401) {
      store.dispatch({type: LOGOUT});
    }
    return Promise.reject(err);
  }
);

export default api;
