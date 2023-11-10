import React from 'react';
import ReactDOM from 'react-dom';
import './app.scss';
import App from './app';
import reportWebVitals from './reportWebVitals';
import {dom} from '@fortawesome/fontawesome-svg-core'

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();


// Replace any existing <i> tags with <svg> and set up a MutationObserver to
// continue doing this as the DOM changes.
dom.watch()