import {useEffect} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

import './App.css';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import AllRoutes from './components/routes/AllRoutes';

//state redux
import setAuthToken from './utils/setAuthToken';
import {checkUser} from './actions/auth';
import {Provider} from 'react-redux';
import store from './store';

//attach the token to every axios request
if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  //
  useEffect(() => {
    store.dispatch(checkUser());
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Navbar />
        <Switch>
          <Route path='/' exact component={Landing} />
          <Route component={AllRoutes} />
        </Switch>
      </Router>
    </Provider>
  );
};

export default App;
