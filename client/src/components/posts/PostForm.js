import React, {useRef, useState} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {addPost} from '../../actions/post';

const PostForm = ({addPost}) => {
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);

  const onChange = (e) => {
    setText(e.target.value);
  };

  const onImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData();
    if (image !== null) {
      fd.append('image', image, image.name);
    }
    fd.append('text', text);

    addPost(fd);
    setImage(null);
    setText('');
  };

  const fileInput = useRef(null);

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

        <input
          type='file'
          name='image'
          accept='image/png, image/jpeg'
          onChange={(e) => onImageChange(e)}
          style={{display: 'none'}}
          ref={fileInput}
        />

        <button
          onClick={() => fileInput.current.click()}
          className='btn btn-primary'
        >
          Image <i className='fas fa-upload text-dark'></i>
        </button>
        <span>{}</span>
      </form>
    </div>
  );
};

PostForm.propTypes = {
  addPost: PropTypes.func.isRequired,
};

export default connect(null, {addPost})(PostForm);
