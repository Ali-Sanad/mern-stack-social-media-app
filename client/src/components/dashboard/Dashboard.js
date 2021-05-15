import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {getCurrentProfile} from '../../actions/profile';
import Spinner from '../layout/Spinner';
import {Link} from 'react-router-dom';

const Dashboard = ({
  getCurrentProfile,
  auth: {user},
  profile: {profile, loading},
}) => {
  useEffect(() => {
    getCurrentProfile();
  }, []);

  return profile && loading === null ? (
    <Spinner />
  ) : (
    <>
      <h1 className='larg text-primary'>Dashboard</h1>
      <p className='lead'>
        <i className='fas fa-user'></i> Welcome, {user && user.name}
      </p>
      {profile !== null ? (
        <>has</>
      ) : (
        <>
          <p>You don't have a profile, create it now!! </p>
          <Link to='/create-profile' className='btn btn-primary my-2'>
            Create Profile
          </Link>
        </>
      )}
    </>
  );
};

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    profile: state.profile,
  };
};
export default connect(mapStateToProps, {getCurrentProfile})(Dashboard);
