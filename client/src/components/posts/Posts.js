import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {getPosts} from '../../actions/post';
import Spinner from '../layout/Spinner';
import PostItem from './PostItem';
import PostForm from './PostForm';

const Posts = ({getPosts, auth: {isAuthenticated}, post: {posts, loading}}) => {
  useEffect(() => {
    getPosts();
  }, [getPosts]);

  return loading ? (
    <Spinner />
  ) : (
    <>
      <div style={{marginLeft: '10%'}}>
        <h1 className='large text-primary'>Posts</h1>
        <p className='lead'>
          <i className='fas fa-blog'></i> Welcome to the community
        </p>
      </div>
      {isAuthenticated && <PostForm />}
      <div className='posts'>
        {posts.map((post) => (
          <PostItem key={post._id} post={post} />
        ))}
      </div>
    </>
  );
};

Posts.propTypes = {
  getPosts: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    post: state.post,
    auth: state.auth,
  };
};
export default connect(mapStateToProps, {getPosts})(Posts);
