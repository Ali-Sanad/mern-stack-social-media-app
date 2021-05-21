import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
const ProfileSection = ({
  profile: {
    user: {_id, name, user_image_url},
    status,
    company,
    location,
    skills,
  },
}) => {
  return (
    <div className='profile bg-light'>
      <img
        src={
          user_image_url === '' || !user_image_url
            ? 'https://img.icons8.com/bubbles/2x/fa314a/user-male.png'
            : user_image_url
        }
        alt=''
        className='round-img'
        style={{width: '100px', height: '100px'}}
      />
      <div>
        <h2 className='text-primary'>{name}</h2>
        <p>
          {status} {company && <span>at {company}</span>}
        </p>
        <p className='my-1'>{location && <span>{location}</span>}</p>
        <Link to={`/profile/${_id}`} className='btn btn-primary'>
          Visit Profile
        </Link>
      </div>
      <ul>
        {skills.slice(0, 4).map((skill, index) => (
          <li key={index} className='text-primary'>
            <i className='fas fa-check'></i> {skill}
          </li>
        ))}
      </ul>
    </div>
  );
};

ProfileSection.propTypes = {
  profile: PropTypes.object.isRequired,
};

export default ProfileSection;
