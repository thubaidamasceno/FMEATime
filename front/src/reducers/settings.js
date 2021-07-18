import {
  SETTINGS_SAVED,
  SETTINGS_PAGE_UNLOADED,
  ASYNC_START, SETTINGS_FOTO
} from '../constants/actionTypes';

const expd = (state = {}, action) => {
  switch (action.type) {
    case SETTINGS_SAVED:
      return {
        ...state,
        inProgress: false,
        errors: action.error ? action.payload.errors : null
      };
    case SETTINGS_FOTO:
      return {
        ...state,
        dataUri: action.dataUri,
      };
    case SETTINGS_PAGE_UNLOADED:
      return {};
    case ASYNC_START:
      return {
        ...state,
        inProgress: true
      };
    default:
      return state;
  }
};

export default expd;