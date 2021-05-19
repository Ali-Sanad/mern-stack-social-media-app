import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import {logout} from '../../actions/auth';
const Navbar = ({logout, auth, isAuthenticated, loading, profile}) => {
  const authLinks = (
    <ul>
      <li>
        <Link to='/profiles'>People</Link>
      </li>

      <li>
        <Link to='/posts'>Posts</Link>
      </li>

      {isAuthenticated && auth.user._id && (
        <li>
          <Link to={`/profile/${auth.user._id}`}>
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
      <>{!loading && isAuthenticated ? authLinks : guestLinks}</>
    </nav>
  );
};

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
  loading: PropTypes.bool.isRequired,
  profile: PropTypes.object,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    loading: state.auth.loading,
    profile: state.profile.profile,
    auth: state.auth,
  };
};

export default connect(mapStateToProps, {logout})(Navbar);
