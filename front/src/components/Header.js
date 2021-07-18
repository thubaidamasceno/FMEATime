import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux'
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";
import cn from "classnames";
//import BrowserHistory from 'react-router/lib/BrowserHistory';
import SearchIcon from "@material-ui/icons/Search";
import {push, goBack} from 'connected-react-router';
import {REDIRECT, SET_SEARCHTXT, SET_PRESEARCHTXT} from "../constants/actionTypes";
import * as op from "object-path";
import classNamesPrefix from "classnames-prefix";

const LoggedOutView = (props) => {
    if (!props.currentUser) {
        return (
            <ul className="nav navbar-nav pull-xs-right">
                {/*<li className="nav-item">*/}
                {/*    <Link to="/login" className="nav-link">*/}
                {/*        Entrar*/}
                {/*    </Link>*/}
                {/*</li>*/}

                {/*<li className="nav-item">*/}
                {/*    <Link to="/register/register" className="nav-link">*/}
                {/*        Cadastrar-se*/}
                {/*    </Link>*/}
                {/*</li>*/}
            </ul>
        );
    }
    return null;
};

const LoggedInView = connect(
    (state) => ({}),
    (dispatch) => ({
        onRedirect: () => dispatch({type: REDIRECT}),
        onPreRedirect: (o) => dispatch(o),
    }))((props) => {
    if (props.currentUser) {
        return (
            <ul className="nav navbar-nav pull-xs-right">
                <li className="nav-item">
                    {/*<Link to="/settings" className="nav-link">*/}
                    {/*    <div className="nav-link-box">*/}
                    {/*        <AccountCircleIcon className="nav-link-icon"/>*/}
                    {/*        <div className="nav-link-txt"> Perfil</div>*/}
                    {/*    </div>*/}
                    {/*</Link>*/}
                    <div
                        //onClick={goodGoBack}
                        className="nav-link">
                        <div className="nav-link-box">
                            <a
                                href="#"
                                onClick={(e) => {
                                    props.onPreRedirect(goBack());
                                }}>
                                <KeyboardBackspaceIcon className="nav-link-icon"/>
                            </a>
                        </div>
                    </div>
                </li>
            </ul>
        );
    }
    return null;
});

// const at = {HEADER_ACT: "HEADER_ACT"};

const Expd = () => {
        const header = useSelector(state => op.get(state, `common.header`)) || {};
        const searchTxt = useSelector(state => op.get(state, `common.searchTxt`)) || '';
        const txt = useSelector(state => op.get(state, `common.preSearchTxt`)) || '';
        const currentUser = useSelector(state => op.get(state, `common.header`));
        const dispatch = useDispatch();

        return (
            <header className="headerbar">
                <div className="nav-link-title">
                    <Link to="/"> FMEATime</Link>
                </div>
                {header.showOmniBox && (
                    <div className="nav-link-omnibox">
                        <input
                            className={cn(
                                "nav-link-omnibox",
                                (txt !== searchTxt && !(typeof searchTxt !== 'string' && txt === ''))
                                && "nav-link-omnibox-dirty"
                            )}
                            width="60%"
                            value={txt}
                            onKeyUp={ev => {
                                if (ev.keyCode === 13) {
                                    ev.preventDefault();
                                    dispatch({
                                        type: SET_SEARCHTXT,
                                        txt: ev.target.value,
                                    })
                                }
                            }}
                            onChange={ev => dispatch({
                                type: SET_PRESEARCHTXT,
                                txt: ev.target.value,
                            })}
                        />
                        <SearchIcon
                            onClick={() => {
                                dispatch({
                                    type: SET_SEARCHTXT,
                                    txt,
                                })
                            }}
                        />
                    </div>)}

                <Link to="/" className="navbar-brand">
                    <div>
                        <ul className="nav navbar-nav navbar-naver">
                            <li className="nav-item">
                                <img
                                    className="logoimg"
                                    src="/android_asset/www/logo.png"
                                    alt=""
                                />
                            </li>
                            {/*<li className="nav-item">*/}
                            {/*    <ul className="nobullet">*/}
                            {/*        <li className="li1">*/}
                            {/*            <img*/}
                            {/*                className="fmeatimelogo"*/}
                            {/*                src="/android_asset/www/logo_aramita.jpg"*/}
                            {/*                alt="FMEATime"*/}
                            {/*            />*/}
                            {/*        </li>*/}
                            {/*    </ul>*/}
                            {/*</li>*/}
                        </ul>
                    </div>
                </Link>
                <div className="headerbar2">
                    <nav className="navbar navbar-light">
                        <div className="container">
                            <LoggedOutView currentUser={currentUser}/>
                            <LoggedInView currentUser={currentUser}/>
                        </div>
                    </nav>
                </div>
            </header>
        );
    }
// })
;

export default Expd;