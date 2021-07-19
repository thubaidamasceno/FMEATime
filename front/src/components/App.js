import agent from '../agent';
import Header from './Header';
import LeftMenu, {styles} from './LeftMenu';
import React from 'react';
import {connect} from 'react-redux';
import {APP_LOAD, LOGOUT, REDIRECT, APP_MENU} from '../constants/actionTypes';
import {Link, Route, Switch, withRouter, Redirect} from 'react-router-dom';
import Login from '../components/Login';
import Profile from '../components/Profile';
import Register from '../components/Register';
import Settings from '../components/Settings';
import {push} from 'connected-react-router';

import clsx from 'clsx';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import CssBaseline from '@material-ui/core/CssBaseline';
import {withStyles} from "@material-ui/core";

import Fmea2ModApp from "../mod/fmea2/ModApp";
import Home from "./Home";

import {Iconlist} from '../icons';

import {approutes} from '../modules';


const mapStateToProps = state => {
    return {
        appLoaded: state.common.appLoaded,
        appName: state.common.appName,
        inProgress: state.common.inProgress,
        currentUser: state.common.currentUser,
        role: state.common.role,
        redirectTo: state.common.redirectTo,
        //menuLeftOpen: state.common.menuLeftOpen,
    }
};

const mapDispatchToProps = dispatch => ({
    onClickLogout: () => dispatch({type: LOGOUT}),
    onLoad: (payload, token) =>
        dispatch({type: APP_LOAD, payload, token, skipTracking: true}),
    onRedirect: () => dispatch({type: REDIRECT}),
    onPreRedirect: (o) => dispatch(o),
});

class App extends React.Component {

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.redirectTo) {
            //this.context.router.replace(nextProps.redirectTo);
            this.props.onPreRedirect(push(nextProps.redirectTo));
            this.props.onRedirect();
        }
    }

    UNSAFE_componentWillMount() {
        const token = window.localStorage.getItem('jwt');
        if (token) {
            agent.setToken(token);
        }
        if (!this.props.inProgress)
            this.props.onLoad(token ? agent.Auth.current() : null, token);
    }

    render() {
        const {classes} = this.props;

        if (this.props.appLoaded && this.props.currentUser) {

            return (
                <div
                    // className={classes.root}
                    style={{
                        display: 'flex',
                    }}
                >
                    <LeftMenu/>
                    <main
                        className={clsx(classes.content, {
                            [classes.contentShift]: this.props.menuLeftOpen,
                        })}

                        style={{}}
                    >
                        <div
                            className={classes.drawerHeader}

                            style={{}}

                        />
                        <Switch>
                            <Route exact path="/" key={window.keygen()}
                                   component={() => (<Home/>)}/>,
                            <Route exact path="/fmeas" key={window.keygen()}
                                   component={() => (<Fmea2ModApp/>)}/>,

                            <Route path="/Iconlist" component={() => (<Iconlist/>)}/>
                            <Route path="/register/:tipo" component={() => (<Register/>)}/>
                            <Redirect from="/login" to="/"/>
                            <Route path="/settings" component={() => (<Settings/>)}/>
                            <Route path="/@:username" component={() => (<Profile/>)}/>
                            {approutes}
                        </Switch>
                    </main>
                </div>
            );
        }
        return (
            <div className={classes.root}>
                <CssBaseline/>
                <AppBar
                    position="fixed"
                    className={clsx(classes.appBar, {
                        [classes.appBarShift]: this.props.menuLeftOpen,
                    })}
                    style={{}}
                >
                    <Toolbar
                        // className={classes.toolbar}
                        style={{
                            textAlign: "center",
                            height: 48,
                            minHeight: 24,
                        }}
                    >
                        <Header
                            appName={this.props.appName}
                            currentUser={this.props.currentUser}/>
                    </Toolbar>
                </AppBar>
                <main
                    className={clsx(classes.content, {
                        [classes.contentShift]: this.props.menuLeftOpen,
                    })}

                    style={{}}
                >
                    <div className={classes.drawerHeader}/>
                    <Switch>
                        <Route exact path="/" component={() => (<Login/>)}/>
                        <Route exact path="/sobre" component={() => (<Home/>)}/>
                        <Route path="/login" component={() => (<Login/>)}/>
                        <Route path="/register/:tipo" component={() => (<Register/>)}/>
                        <Route exact path="/register" component={() => (<Register/>)}/>
                        <Route path="/" component={() => (<Login/>)}/>
                    </Switch>
                </main>
            </div>

        );
    }
}

const expd = connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, {withTheme: true})(withRouter(App)));
export default expd;


// WEBPACK FOOTER //
// src/components/App.js