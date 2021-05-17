import {useEffect} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import {Provider} from 'react-redux';

import './App.css';
import store from './store';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Alert from './components/layout/Alert';
import Dashboard from './components/dashboard/Dashboard';
import setAuthToken from './utils/setAuthToken';
import {checkUser} from './actions/auth';
import PrivateRoute from './components/routes/PrivateRoute';
import CreateProfile from './components/profile-forms/CreateProfile';
import EditProfile from './components/profile-forms/Editprofile';
import AddExperience from './components/profile-forms/AddExperience';
import AddEducation from './components/profile-forms/AddEducation';
import Profiles from './components/profiles/Profiles';
import Profile from './components/profile/Profile';

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
        <Route path='/' exact component={Landing} />
        <section className='container'>
          <Alert />
          <Switch>
            <Route path='/register' exact component={Register} />
            <Route path='/login' exact component={Login} />
            <Route path='/profiles' exact component={Profiles} />
            <Route path='/profile/:id' exact component={Profile} />
            <PrivateRoute path='/dashboard' exact component={Dashboard} />
            <PrivateRoute
              path='/create-profile'
              exact
              component={CreateProfile}
            />
            <PrivateRoute path='/edit-profile' exact component={EditProfile} />
            <PrivateRoute
              path='/add-experience'
              exact
              component={AddExperience}
            />
            <PrivateRoute
              path='/add-education'
              exact
              component={AddEducation}
            />
          </Switch>
        </section>
      </Router>
    </Provider>
  );
};

export default App;
