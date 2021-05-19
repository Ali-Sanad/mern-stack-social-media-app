import React from 'react';

const NotFound = (props) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '20%',
      }}
    >
      <h1 className='x-large '>
        <i className='fas fa-exclamation-triangle'></i> 404 - Page Not Found
      </h1>
    </div>
  );
};

export default NotFound;
