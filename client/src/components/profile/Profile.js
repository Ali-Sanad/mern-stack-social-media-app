import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import Spinner from '../layout/Spinner';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {getProfileById} from '../../actions/profile';
import ProfileTop from './ProfileTop';
import ProfileAbout from './ProfileAbout';
import ProfileExperience from './ProfileExperience';
import ProfileEducation from './ProfileEducation';
import ProfileGithub from './ProfileGithub';

const Profile = ({
  getProfileById,
  match,
  auth,
  profile: {profile, loading},
}) => {
  useEffect(() => {
    getProfileById(match.params.id);
  }, [getProfileById, match.params.id]);
  return (
    <>
      {profile === null || loading ? (
        <Spinner />
      ) : (
        <>
          <div style={{marginLeft: '4%', marginBottom: '2rem'}}>
            <Link to='/profiles' className='btn btn-light'>
              Back To People
            </Link>
            {auth.isAuthenticated &&
              auth.loading === false &&
              auth.user._id === profile.user._id && (
                <Link to='/edit-profile' className='btn btn-light'>
                  Edit Profile
                </Link>
              )}
          </div>
          <div
            className='profile-grid my-2'
            style={{width: '70vw', margin: 'auto'}}
          >
            <ProfileTop profile={profile} />
            <ProfileAbout profile={profile} />

            <div className='profile-exp p-2'>
              <h2 className='text-primary'>Experience</h2>
              {profile.experience.length > 0 ? (
                <>
                  {profile.experience.map((exp) => (
                    <ProfileExperience key={exp._id} experience={exp} />
                  ))}
                </>
              ) : (
                <h4>No experience added</h4>
              )}
            </div>

            <div className='profile-edu bg-white p-2'>
              <h2 className='text-primary'>Education</h2>
              {profile.education.length > 0 ? (
                <>
                  {profile.education.map((edu) => (
                    <ProfileEducation key={edu._id} education={edu} />
                  ))}
                </>
              ) : (
                <h4>No education added</h4>
              )}
            </div>
            {profile.githubusername && (
              <ProfileGithub username={profile.githubusername} />
            )}
          </div>
        </>
      )}
    </>
  );
};

Profile.propTypes = {
  getProfileById: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => {
  return {
    profile: state.profile,
    auth: state.auth,
  };
};

export default connect(mapStateToProps, {getProfileById})(Profile);
