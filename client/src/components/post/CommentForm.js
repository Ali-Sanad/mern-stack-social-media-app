import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {addComment} from '../../actions/post';
const CommentForm = ({addComment, postId, auth: {isAuthenticated}}) => {
  const [text, setText] = useState('');

  const onChange = (e) => {
    setText(e.target.value);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    addComment(postId, {text});
    setText('');
  };
  return (
    isAuthenticated && (
      <div className='post-form' style={{width: '60vw', margin: 'auto'}}>
        <div className='bg-primary p' style={{borderRadius: '5px'}}>
          <h3>Leave a comment</h3>
        </div>
        <form className='form my-1' onSubmit={(e) => onSubmit(e)}>
          <textarea
            name='text'
            cols='30'
            rows='5'
            placeholder={`What's in your mind ?`}
            value={text}
            onChange={(e) => onChange(e)}
            required
          ></textarea>
          <input type='submit' className='btn btn-dark my-1' value='Publish' />
        </form>
      </div>
    )
  );
};

CommentForm.propTypes = {
  addComment: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, {addComment})(CommentForm);
