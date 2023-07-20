/* eslint-disable linebreak-style */
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import Contents from './Contents.jsx';
import { NavLink } from 'react-router-dom';

function NavBar() {
  return (
    <nav>
     <NavLink exact to="/">Home</NavLink>
      {' | '}
      <NavLink to="/issues">Issue List</NavLink>
      {' | '}
      <NavLink to="/report">Report</NavLink>
    </nav>
  );
}
export default function Page() {
  return (
    <div>
      <NavBar />
      <Contents />
    </div>
  );
}
