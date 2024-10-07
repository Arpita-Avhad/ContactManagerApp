// src/components/Spinner/Spinner.jsx
import React from 'react';
import spinnerImg from '../../assets/img/Loading.gif';

const Spinner = () => {
  return (
    <React.Fragment>
      <img 
        src={spinnerImg} 
        alt="Loading..." 
        className="d-block m-auto" 
        style={{ width: '100px' }}
      />
    </React.Fragment>
  );
};

export default Spinner;
