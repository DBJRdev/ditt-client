import { apiMiddleware } from 'redux-api-middleware';
import { composeWithDevTools } from 'redux-devtools-extension';
import {
  applyMiddleware,
  createStore,
} from 'redux';
import thunkMiddleware from 'redux-thunk';
import reducer from './reducer';

const middlewares = [
  thunkMiddleware,
  apiMiddleware,
];
export default createStore(reducer, composeWithDevTools(applyMiddleware(...middlewares)));
