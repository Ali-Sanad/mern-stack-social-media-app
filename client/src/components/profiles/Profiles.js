import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Spinner from '../../components/layout/Spinner';
import {getProfiles} from '../../actions/profile';
import ProfileSection from './ProfileSection';

const Profiles = ({getProfiles, profile: {profiles, loading}}) => {
  useEffect(() => {
    getProfiles();
  }, [getProfiles]);

  return (
    <>
      {loading ? (
        <>
          <Spinner />
        </>
      ) : (
        <>
          <div style={{marginLeft: '10%'}}>
            <h1 className='large text-primary'>People</h1>
            <p className='lead'>
              <i className='fas fa-link p-1'></i>Discover and connect with
              people
            </p>
          </div>
          <div className='profiles' style={{width: '60vw', margin: 'auto'}}>
            {profiles.length > 0 ? (
              profiles.map((profile) => {
                return <ProfileSection key={profile._id} profile={profile} />;
              })
            ) : (
              <>
                <h3 style={{marginLeft: '13%'}}> No profiles found...</h3>
                <Spinner />
              </>
            )}
          </div>
        </>
      )}
    </>
  );
};

Profiles.propTypes = {
  profile: PropTypes.object.isRequired,
  getProfiles: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return {
    profile: state.profile,
  };
};

export default connect(mapStateToProps, {getProfiles})(Profiles);
