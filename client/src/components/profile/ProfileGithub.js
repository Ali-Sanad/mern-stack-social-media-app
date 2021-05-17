import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {getGitHubRepos} from '../../actions/profile';
import Spinner from '../layout/Spinner';

const ProfileGithub = ({username, getGitHubRepos, repos}) => {
  useEffect(() => {
    getGitHubRepos(username);
  }, [getGitHubRepos, username]);

  return (
    <div className='profile-github'>
      {repos === null ? (
        <Spinner />
      ) : (
        <>
          <h2 className='text-primary my-1'>Github Repos</h2>
          {repos.map((repo) => (
            <div key={repo.id} className='repo bg-white my-1 p-1'>
              <div>
                <h4>
                  <a
                    href={repo.html_url}
                    target='_blank'
                    rel='noreferrer noopener'
                  >
                    {repo.name}
                  </a>
                </h4>
                <p>{repo.description}</p>
                <p>{repo.language && <span>language: {repo.language}</span>}</p>
              </div>
              <div>
                <ul>
                  <li className='badge badge-primary'>
                    Stars: {repo.stargazers_count}
                  </li>
                  <li className='badge badge-dark'>Stars: {repo.watchers}</li>
                  <li className='badge badge-light'>Forks: {repo.forks}</li>
                </ul>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

ProfileGithub.propTypes = {
  getGitHubRepos: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  repos: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => {
  return {
    repos: state.profile.repos,
  };
};

export default connect(mapStateToProps, {getGitHubRepos})(ProfileGithub);
