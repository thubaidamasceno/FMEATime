import auth from './reducers/auth';
import {combineReducers} from 'redux';
import common from './reducers/common';
import home from './reducers/home';
import profile from './reducers/profile';
import settings from './reducers/settings';
import {routerReducer} from 'react-router-redux';
import {reducers} from './modules';
//
import {connectRouter} from 'connected-react-router';

const rootReducer = (history) => {
  return combineReducers({
    ...reducers,
    auth,
    common,
    home,
    profile,
    settings,
    router: connectRouter(history),
  })
};

export default rootReducer;
