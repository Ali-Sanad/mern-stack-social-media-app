import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {addPost} from '../../actions/post';

const PostForm = ({addPost}) => {
  const [text, setText] = useState('');

  const onChange = (e) => {
    setText(e.target.value);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    addPost({text});
    setText('');
  };
  return (
    <div className='post-form' style={{width: '60vw', margin: 'auto'}}>
      <div className='bg-primary p' style={{borderRadius: '5px'}}>
        <h3>Create post</h3>
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
        <input type='submit' className='btn btn-dark my-1' value='Post' />
        <input type='file' name='image' accept='image/png, image/jpeg' />
      </form>
    </div>
  );
};

PostForm.propTypes = {
  addPost: PropTypes.func.isRequired,
};

export default connect(null, {addPost})(PostForm);
