import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import LocalDatabase from './db/index'
import { createMuiTheme, ThemeProvider } from '@material-ui/core';

export const db = new LocalDatabase()

const theme = createMuiTheme({
  direction: 'rtl'
})

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App data={db.getTasks()} />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
