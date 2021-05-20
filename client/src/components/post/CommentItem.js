import React from 'react';
import PropTypes from 'prop-types';
import {deleteComment} from '../../actions/post';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import Moment from 'react-moment';

const CommentItem = ({
  deleteComment,
  postId,
  comment: {_id, text, name, avatar, user, date},
  auth,
}) => {
  return (
    <div
      className='post bg-white p-1 my-1'
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
      }}
    >
      <div className='user-post'>
        <Link to={`/profile/${user}`}>
          <img
            className='user-img-post'
            src={
              avatar === '' || !avatar
                ? 'https://img.icons8.com/bubbles/2x/fa314a/user-male.png'
                : `http://localhost:5000/image/user/${avatar}`
            }
            alt=''
          />
          <h4>{name}</h4>
        </Link>
      </div>
      <div /* style={{margin: 'auto', textAlign: 'start', whiteSpace: 'pre-wrap'}} */
      >
        <p className='my-1' style={{textAlign: 'left'}}>
          {text}
        </p>
        <p className='post-date'>
          Posted on <Moment format='DD-MM-YYYY  hh:mm:ss'>{date}</Moment>
        </p>
      </div>
      {auth.isAuthenticated && user === auth.user._id && (
        <div style={{justifySelf: 'flex-end'}}>
          <button
            type='button'
            className='btn btn-danger'
            onClick={() => deleteComment(postId, _id)}
          >
            X
          </button>
        </div>
      )}
    </div>
  );
};

CommentItem.propTypes = {
  deleteComment: PropTypes.func.isRequired,
  postId: PropTypes.string.isRequired,
  comment: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};
const mapStateTopProps = (state) => {
  return {
    auth: state.auth,
  };
};

export default connect(mapStateTopProps, {deleteComment})(CommentItem);
