import React from 'react';
import {Route, Switch} from 'react-router-dom';
import Register from '../auth/Register';
import Login from '../auth/Login';
import Alert from '../layout/Alert';
import Dashboard from '../dashboard/Dashboard';

import PrivateRoute from '../routes/PrivateRoute';
import CreateProfile from '../profile-forms/CreateProfile';
import EditProfile from '../profile-forms/Editprofile';
import AddExperience from '../profile-forms/AddExperience';
import AddEducation from '../profile-forms/AddEducation';
import Profiles from '../profiles/Profiles';
import Profile from '../profile/Profile';
import Posts from '../posts/Posts';
import Post from '../post/Post';
import NotFound from '../layout/NotFound';

const AllRoutes = () => {
  return (
    <section className='container'>
      <Alert />
      <Switch>
        <Route path='/register' exact component={Register} />
        <Route path='/login' exact component={Login} />
        <Route path='/profiles' exact component={Profiles} />
        <Route path='/profile/:id' exact component={Profile} />
        <Route path='/posts' exact component={Posts} />
        <Route path='/posts/:id' exact component={Post} />
        <PrivateRoute path='/dashboard' exact component={Dashboard} />
        <PrivateRoute path='/create-profile' exact component={CreateProfile} />
        <PrivateRoute path='/edit-profile' exact component={EditProfile} />
        <PrivateRoute path='/add-experience' exact component={AddExperience} />
        <PrivateRoute path='/add-education' exact component={AddEducation} />
        <Route component={NotFound} />
      </Switch>
    </section>
  );
};

export default AllRoutes;
