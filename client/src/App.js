import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import {Provider} from 'react-redux';

import './App.css';
import store from './store';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Navbar />
        <Route path='/' exact component={Landing} />
        <section className='container'>
          <Switch>
            <Route path='/register' exact component={Register} />
            <Route path='/login' exact component={Login} />
          </Switch>
        </section>
      </Router>
    </Provider>
  );
};

export default App;
