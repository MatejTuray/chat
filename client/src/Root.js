import React from 'react';
import { createStore } from "redux";
import { Provider } from "react-redux";
import rootReducer from './reducers/rootReducer';
import ReduxPromise from "redux-promise";
import thunk from "redux-thunk"
import { applyMiddleware } from "redux"
import { compose } from "redux"

const Root = ({ children, initialState = {} }) => {


    return (
        <Provider store={createStore(rootReducer, initialState, compose(applyMiddleware(ReduxPromise,thunk), window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() : f => f, ))}>
            {children}
        </Provider >

    )
}

export default Root
