/* eslint-disable linebreak-style */
/* eslint-disable import/extensions */
/* eslint-disable import/no-extraneous-dependencies */
import 'babel-polyfill';
import 'whatwg-fetch';
import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router } from 'react-router-dom';
import Page from './Page.jsx';


const element = (
  <Router>
    <Page />
  </Router>
);
ReactDOM.render(element, document.getElementById('root'));

if (module.hot) {
  module.hot.accept();
}
// In order to accept the changes to a module
// its parent needs to accept it using the
// HotModuleReplacementPlugin’s accept() method.
