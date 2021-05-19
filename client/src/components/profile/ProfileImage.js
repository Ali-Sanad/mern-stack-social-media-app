import React, {useRef, useState} from 'react';
import PropTypes from 'prop-types';
import {userImageUpload} from '../../actions/auth';
import {connect} from 'react-redux';

const ProfileTop = ({
  profile: {
    status,
    company,
    location,
    website,
    social: {facebook, twitter, instagram, youtube, linkedin},
    user: {name, avatar},
  },
}) => {
  const [image, setImage] = useState(null);
  const onImageChange = (e) => {
    setImage(e.target.files[0]);
  };
  const fileInput = useRef(null);

  const upload = () => {
    const fd = new FormData();
    if (image !== null) {
      fd.append('avatar', image, image.name);
    }
    userImageUpload(fd);
    console.log(fd);
    setImage(null);
  };
  return (
    <>
      <div
        className='profile-top p-2 bg-primary'
        style={{borderRadius: '10px', height: '70vh'}}
      >
        <img
          className='round-img '
          src={
            avatar === '' || !avatar
              ? 'https://img.icons8.com/bubbles/2x/fa314a/user-male.png'
              : `http://localhost:5000/image/user/${avatar}`
          }
          alt=''
          style={{
            height: '200px',
            width: '200px',
            objectFit: 'cover',
            cursor: 'pointer',
          }}
          onClick={() => fileInput.current.click()}
        />

        <input
          type='file'
          name='avatar'
          accept='image/png, image/jpeg'
          onChange={(e) => onImageChange(e)}
          style={{display: 'none'}}
          ref={fileInput}
        />
        <button className='btn btn-dark' onClick={() => upload()}>
          upload
        </button>

        <h1 className='large'>{name}</h1>
        <p className='lead'>
          {status} {company && <span>at {company}</span>}{' '}
        </p>
        <p>
          {location && (
            <span>
              <i className='fas fa-map-marker-alt'></i> {location}
            </span>
          )}
        </p>
        <div className='icons my-1'>
          {website && (
            <a href={website} target='_blank' rel='noopener noreferrer'>
              <i className='fas fa-globe fa-2x'></i>
            </a>
          )}
          {twitter && (
            <a href={twitter} target='_blank' rel='noopener noreferrer'>
              <i className='fab fa-twitter fa-2x'></i>
            </a>
          )}

          {facebook && (
            <a href={facebook} target='_blank' rel='noopener noreferrer'>
              <i className='fab fa-facebook fa-2x'></i>
            </a>
          )}
          {linkedin && (
            <a href={linkedin} target='_blank' rel='noopener noreferrer'>
              <i className='fab fa-linkedin fa-2x'></i>
            </a>
          )}
          {youtube && (
            <a href={youtube} target='_blank' rel='noopener noreferrer'>
              <i className='fab fa-youtube fa-2x'></i>
            </a>
          )}
          {instagram && (
            <a href={instagram} target='_blank' rel='noopener noreferrer'>
              <i className='fab fa-instagram fa-2x'></i>
            </a>
          )}
        </div>
      </div>
    </>
  );
};

ProfileTop.propTypes = {
  profile: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  userImageUpload: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
  };
};

export default connect(mapStateToProps, {userImageUpload})(ProfileTop);
