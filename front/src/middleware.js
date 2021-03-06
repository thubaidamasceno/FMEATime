import agent from './agent';
import {
    ASYNC_START,
    ASYNC_END,
    LOGIN,
    LOGOUT,
    // REGISTER
} from './constants/actionTypes';

const promiseMiddleware = store => next => action => {
    if (isPromise(action.payload)) {
        store.dispatch({type: ASYNC_START, subtype: action.type, act: action.act});
        const _currentState = store.getState();
        const currentView = _currentState.viewChangeCounter;
        const skipTracking = action.skipTracking;

        action.payload.then(
            res => {
                // console.log('RESULT', res);
                const currentState = store.getState();
                if (!skipTracking && currentState.viewChangeCounter !== currentView) {
                    return
                }
                action.payload = res;
                store.dispatch({type: ASYNC_END, promise: action.payload});
                store.dispatch(action);
            },
            error => {
                // console.log('ERROR', error);
                const currentState = store.getState();
                if (!skipTracking && currentState.viewChangeCounter !== currentView) {
                    return
                }
                action.error = true;
                if (error.response)
                    action.payload = error.response.body;
                else {
                    //action.payload = error.stack;
                    delete action.payload;
                    action.connectionLost = true;
                }
                action.stack = error.stack;
                if (!action.skipTracking) {
                    store.dispatch({type: ASYNC_END, promise: action.payload});
                }
                //console.log(action);
                store.dispatch(action);
            }
        );

        return;
    }

    next(action);
};

const localStorageMiddleware = store => next => action => {
    if (action.type === LOGIN) {
        if (!action.error) {
            window.localStorage.setItem('jwt', action.payload.user.token);
            agent.setToken(action.payload.user.token);
        }
    } else if (action.type === LOGOUT) {
        window.localStorage.setItem('jwt', '');
        agent.setToken(null);
    }

    next(action);
};

function isPromise(v) {
    return v && typeof v.then === 'function';
}


export {promiseMiddleware, localStorageMiddleware}
