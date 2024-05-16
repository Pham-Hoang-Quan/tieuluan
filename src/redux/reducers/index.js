// redux/reducers/index.js
import { combineReducers } from 'redux';
import transReducer from './transReducer';

const rootReducer = combineReducers({
  trans: transReducer,
});

export default rootReducer;
