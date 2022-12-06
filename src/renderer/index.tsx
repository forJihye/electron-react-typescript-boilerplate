import  './scss/index.scss';
import  './scss/reset.scss';

import React from 'react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('app') as HTMLDivElement);
const main = async () => { try {
  console.log('hello');
  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  )
  console.log('bye');
} catch (e) {
  console.error(e)
}}

export default main;