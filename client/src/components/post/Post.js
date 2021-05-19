import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import {getPost} from '../../actions/post';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import Spinner from '../layout/Spinner';
import PostItem from '../posts/PostItem';
import CommentForm from './CommentForm';
import CommentItem from './CommentItem';

const Post = ({getPost, post: {post, loading}, match}) => {
  useEffect(() => {
    getPost(match.params.id);
  }, [getPost, match.params.id]);
  return loading || post === null ? (
    <Spinner />
  ) : (
    <>
      <Link to='/posts' style={{marginLeft: '18%'}}>
        Back To Posts
      </Link>
      <PostItem showActions={false} post={post} />
      <CommentForm postId={post._id} />
      <div className='comments'>
        {post.comments.map((comment) => (
          <CommentItem key={comment._id} postId={post._id} comment={comment} />
        ))}
      </div>
    </>
  );
};

Post.propTypes = {
  getPost: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    post: state.post,
  };
};
export default connect(mapStateToProps, {getPost})(Post);
