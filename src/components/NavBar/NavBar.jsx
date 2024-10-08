// src/components/NavBar/NavBar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {
  return (
    <nav className='navbar navbar-dark bg-dark navbar-expand-sm'>
      <div className='container'>
        <Link to='/contacts/list' className='navbar-brand'>  {/* Update to point to the correct path */}
          <i className='fa fa-mobile text-warning' /> Contact <span className='text-warning'> Manager </span>
        </Link>
      </div>
    </nav>
  );
};

export default NavBar;
