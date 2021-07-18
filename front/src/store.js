import {createLogger} from 'redux-logger'
import {composeWithDevTools} from 'redux-devtools-extension/developmentOnly';
import {promiseMiddleware, localStorageMiddleware} from './middleware';
import {createBrowserHistory} from "history";
import {applyMiddleware, compose, createStore} from "redux";
import {routerMiddleware} from "connected-react-router";
import createRootReducer from "./reducer";

export const history = createBrowserHistory({basename: '/'});

export function configureStore(preloadedState) {
    const composeEnhancer = compose || window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ;
    const store = createStore(
        createRootReducer(history),
        preloadedState,
        composeEnhancer(
            applyMiddleware(...[
                    routerMiddleware(history),
                    promiseMiddleware,
                    localStorageMiddleware,
                    ...(process.env.NODE_ENV !== 'production' ? [createLogger()] : []),
                ]
            ),
        ),
    );
    // Hot reloading
    if (module.hot) {
        // Enable Webpack hot module replacement for reducers
        module.hot.accept("./reducer", () => {
            store.replaceReducer(createRootReducer(history));
        });
    }
    return store;
}

const store = configureStore();
export default store;