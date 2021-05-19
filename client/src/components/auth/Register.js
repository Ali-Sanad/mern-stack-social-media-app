import React, {useState} from 'react';
import {Link, Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {setAlert} from '../../actions/alert';
import {register} from '../../actions/auth';

const Register = ({setAlert, register, isAuthenticated}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
  });

  const [passwordShown1, setPasswordShown1] = useState(false);
  const [passwordShown2, setPasswordShown2] = useState(false);

  const {name, email, password, password2} = formData;

  const togglePasswordVisiblity1 = () => {
    setPasswordShown1(!passwordShown1);
  };

  const togglePasswordVisiblity2 = () => {
    setPasswordShown2(!passwordShown2);
  };

  const onChange = (e) =>
    setFormData({...formData, [e.target.name]: e.target.value});

  const onSubmit = (e) => {
    e.preventDefault();
    if (password !== password2) {
      setAlert('Passwords do not match', 'danger', 4000);
    } else {
      register({name, email, password});
    }
  };

  if (isAuthenticated) {
    return <Redirect to='/' />;
  }

  const eye1 = (
    <i
      className={passwordShown1 ? 'fa fa-eye' : 'fa fa-eye-slash'}
      aria-hidden='true'
      style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        cursor: 'pointer',
      }}
      onClick={() => togglePasswordVisiblity1()}
    ></i>
  );

  const eye2 = (
    <i
      className={passwordShown2 ? 'fa fa-eye' : 'fa fa-eye-slash'}
      aria-hidden='true'
      style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        cursor: 'pointer',
      }}
      onClick={() => togglePasswordVisiblity2()}
    ></i>
  );
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <h4 className='large text-primary'>Sign Up</h4>
      <p className='lead'>
        <i className='fas fa-user'></i> Create Your Account
      </p>
      <form className='form' onSubmit={(e) => onSubmit(e)}>
        <div className='form-group'>
          <input
            type='text'
            placeholder='Name'
            name='name'
            value={name}
            onChange={(e) => onChange(e)}
            required
          />
        </div>
        <div className='form-group'>
          <input
            type='email'
            placeholder='Email Address'
            name='email'
            value={email}
            onChange={(e) => onChange(e)}
            required
          />
        </div>
        <div className='form-group' style={{position: 'relative'}}>
          <input
            type={passwordShown1 ? 'text' : 'password'}
            placeholder='Password'
            name='password'
            minLength='6'
            value={password}
            onChange={(e) => onChange(e)}
            required
          />
          {eye1}
        </div>
        <div className='form-group' style={{position: 'relative'}}>
          <input
            type={passwordShown2 ? 'text' : 'password'}
            placeholder='Confirm Password'
            name='password2'
            minLength='6'
            value={password2}
            onChange={(e) => onChange(e)}
            required
          />
          {eye2}
        </div>
        <input type='submit' className='btn btn-primary' value='Register' />
      </form>
      <p className='my-1'>
        Already have an account? <Link to='/login'>Sign In</Link>
      </p>
    </div>
  );
};

Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.isAuthenticated,
  };
};

export default connect(mapStateToProps, {setAlert, register})(Register);
