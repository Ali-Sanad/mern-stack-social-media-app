import {useEffect} from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';

import './App.css';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import AllRoutes from './components/routes/AllRoutes';
import {LOGOUT} from './actions/types';
//state redux
import {Provider} from 'react-redux';
import store from './store';
import setAuthToken from './utils/setAuthToken';
import {loadUser} from './actions/auth';

const App = () => {
  //
  useEffect(() => {
    //attach the token to every axios request
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }

    store.dispatch(loadUser());

    //logout user from all tabes if he logged out from one tabe
    window.addEventListener('storage', () => {
      if (!localStorage.token) store.dispatch({type: LOGOUT});
    });
  }, []);

  return (
    <Provider store={store}>
      <BrowserRouter>
        <Navbar />
        <Switch>
          <Route path='/' exact component={Landing} />
          <Route component={AllRoutes} />
        </Switch>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
