import ReactDOM from 'react-dom';
import app from './app';
import history from './routerHistory';
import store from './store';

// Initialize translator
import './translator';

ReactDOM.render(
  app(store, history),
  document.getElementById('app'),
);
