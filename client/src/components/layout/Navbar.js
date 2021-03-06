import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import {logout} from '../../actions/auth';
const Navbar = ({logout, auth: {isAuthenticated, loading, user}}) => {
  const authLinks = (
    <ul>
      <li>
        <Link to='/profiles'>People</Link>
      </li>

      <li>
        <Link to='/posts'>Posts</Link>
      </li>

      {user && !loading && isAuthenticated && (
        <li>
          <Link to={`/profile/${user._id}`}>
            <i className='fas fa-user'></i>{' '}
            <span className='hide-sm'>Profile</span>
          </Link>
        </li>
      )}

      <li>
        <Link to='/dashboard'>
          <i className='fas fa-user-edit'></i>{' '}
          <span className='hide-sm'>Dashboard</span>
        </Link>
      </li>

      <li>
        <Link to='/' onClick={logout}>
          <i className='fas fa-sign-out-alt'></i>{' '}
          <span className='hide-sm'>Log out</span>
        </Link>
      </li>
    </ul>
  );

  const guestLinks = (
    <ul>
      <li>
        <Link to='/profiles'>People</Link>
      </li>
      <li>
        <Link to='/posts'>Posts</Link>
      </li>
      <li>
        <Link to='/register'>Register</Link>
      </li>
      <li>
        <Link to='/login'>Log in</Link>
      </li>
    </ul>
  );

  return (
    <nav className='navbar bg-dark'>
      <h1>
        <Link to='/'>
          <i className='fas fa-blog'></i> Social Network
        </Link>
      </h1>
      <>{user && !loading && isAuthenticated ? authLinks : guestLinks}</>
    </nav>
  );
};

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object,
};

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
  };
};

export default connect(mapStateToProps, {logout})(Navbar);
