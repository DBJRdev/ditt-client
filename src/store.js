import { apiMiddleware } from 'redux-api-middleware';
import { composeWithDevTools } from 'redux-devtools-extension';
import {
  applyMiddleware,
  createStore,
} from 'redux';
import thunkMiddleware from 'redux-thunk';
import reducer from './reducer';
import jwtInjectorMiddleware from './middlewares/jwtInjector';
import apiErrorHandlerMiddleware from './middlewares/apiErrorHandler';

const middlewares = [
  thunkMiddleware,
  jwtInjectorMiddleware,
  apiMiddleware,
  apiErrorHandlerMiddleware,
];
export default createStore(reducer, composeWithDevTools(applyMiddleware(...middlewares)));
