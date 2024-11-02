import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { addPost } from '../../actions/post'
import { setAlert } from '../../actions/alert'

const PostForm = ({ setAlert, addPost }) => {
  const [text, setText] = useState('')
  const [image, setImage] = useState(null)

  useEffect(() => {
    if (image) {
      setAlert(
        'Image Uploaded Successfully, finish the post to see it 😄',
        'success',
        4000
      )
    }
  }, [image, setAlert])

  const onChange = e => {
    setText(e.target.value)
  }

  const onImageChange = e => {
    setImage(e.target.files[0])
  }

  const onSubmit = e => {
    e.preventDefault()

    if (!image) {
      addPost({ text })
      setText('')
      setImage(null)
    } else {
      const reader = new FileReader()
      reader.readAsDataURL(image)
      reader.onloadend = () => {
        addPost({ data: reader.result, text: text })
      }
      reader.onerror = () => {
        console.error('Image upload failed')
      }

      setText('')
      setImage(null)
    }
  }

  const fileInput = useRef(null)

  return (
    <div className='post-form'>
      <div className='bg-primary p' style={{ borderRadius: '5px' }}>
        <h3>Create post</h3>
      </div>
      <form className='form my-1' onSubmit={e => onSubmit(e)}>
        <textarea
          name='text'
          cols='30'
          rows='5'
          placeholder={`What's in your mind ?`}
          value={text}
          onChange={e => onChange(e)}
          required
        ></textarea>
        <input type='submit' className='btn btn-dark my-1' value='Post' />

        <input
          type='file'
          name='image'
          accept='image/png, image/jpeg'
          onChange={e => onImageChange(e)}
          style={{ display: 'none' }}
          ref={fileInput}
        />

        <button
          onClick={() => fileInput.current.click()}
          className='btn btn-primary'
          type='button'
        >
          Image <i className='fas fa-upload text-dark'></i>
        </button>
        <span>{}</span>
      </form>
    </div>
  )
}

PostForm.propTypes = {
  addPost: PropTypes.func.isRequired,
  setAlert: PropTypes.func.isRequired
}

export default connect(null, { setAlert, addPost })(PostForm)
