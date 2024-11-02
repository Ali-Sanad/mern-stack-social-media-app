import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Moment from 'react-moment'
import { Link } from 'react-router-dom'
import { addLike, removeLike, deletPost } from '../../actions/post'

const PostItem = ({
  auth,
  post: {
    _id,
    text,
    user,
    name,
    user_image_url,
    post_image_url,
    likes,
    comments,
    date
  },
  addLike,
  removeLike,
  deletPost,
  showActions
}) => {
  return (
    <>
      <div className='post bg-white p-1 my-1'>
        <div>
          <div className='user-post'>
            <Link
              to={`/profile/${user}`}
              style={{ display: 'flex', alignItems: 'center' }}
            >
              <img
                className='user-img-post'
                src={
                  user_image_url === '' || !user_image_url
                    ? 'https://img.icons8.com/bubbles/2x/fa314a/user-male.png'
                    : user_image_url
                }
                alt=''
              />
              <h4 style={{ display: 'inline-block', margin: '0 1rem' }}>
                {name}
              </h4>
            </Link>
          </div>

          <p className='my-1'>{text}</p>
          {post_image_url === '' || !post_image_url ? (
            <p></p>
          ) : (
            <img // post_image_url for post
              style={{ height: '50vh', objectFit: 'cover' }}
              className='post-img'
              src={post_image_url}
              alt=''
            />
          )}
          <p className='post-date date-align my-1'>
            Posted on <Moment format='DD-MM-YYYY  hh:mm:ss'>{date}</Moment>
          </p>

          {showActions && (
            <div className='community my-1'>
              <button
                type='button'
                className='btn btn-light'
                onClick={() =>
                  auth.user &&
                  auth.isAuthenticated &&
                  (likes.filter(like => like.user === auth.user._id)
                    .length > 0
                    ? removeLike(_id)
                    : addLike(_id))
                }
              >
                <i
                  className={`fas fa-thumbs-up ${
                    auth.user &&
                    auth.isAuthenticated &&
                    (likes.filter(like => like.user === auth.user._id)
                      .length > 0
                      ? 'text-primary'
                      : 'text-light')
                  }`}
                ></i>{' '}
                {likes.length > 0 && <span>{likes.length}</span>}
              </button>

              <Link to={`/posts/${_id}`} className='btn btn-primary'>
                Comments{' '}
                {comments.length > 0 && (
                  <span className='comment-count'>{comments.length}</span>
                )}
              </Link>

              {auth.user && !auth.loading && auth.isAuthenticated && (
                <>
                  {user === auth.user._id && (
                    <button
                      type='button'
                      className='btn btn-danger'
                      onClick={() => deletPost(_id)}
                    >
                      <i className='fas fa-times'></i>
                    </button>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

PostItem.defaultProps = {
  showActions: true
}

PostItem.propTypes = {
  post: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  addLike: PropTypes.func.isRequired,
  removeLike: PropTypes.func.isRequired,
  deletPost: PropTypes.func.isRequired
}
const mapStateToProps = state => {
  return {
    auth: state.auth
  }
}

export default connect(mapStateToProps, {
  addLike,
  removeLike,
  deletPost
})(PostItem)
