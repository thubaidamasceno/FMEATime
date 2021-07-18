import React, {Component} from 'react';
import {connect} from 'react-redux'
import {apiActs} from './reducers';
import {at} from './modconf';
import ModPanel from "./ModPanel";
import ListPanel from "./ListPanel";
import cn from "classnames";
import Dialog from "rc-dialog/es";
import "rc-dialog/assets/index.css";
import "rc-dialog/assets/bootstrap.css";
import * as im from 'object-path-immutable';
import * as op from 'object-path';
import Crumb from "./Crumb";
//
const {modelList, txt} = require('./modconf');

//


const DeleteDialog = connect(
    state => ({
        ...op.get(state, 'fmea2.app.deleteDialog'),
    }),
    dispatch => ({
        onAct: (p, payload) => dispatch({type: at.FMEA2_ACT, p, payload}),
    }))((props) => {
    return (
        <Dialog
            visible={props.visible || op.get(props, props.visibleP, false)}
            animation="zoom"
            maskAnimation="fade"
            onClose={props.onClose || (() => props.onAct({act: props.closeAct}))}
            destroyOnClose
            zIndex={2000}
        >
            <div className='dialog dialog-yesno'>
                <p>{props.txt}</p>
                <button onClick={(ev) => props.clickYes(props, ev) || (() => props.onAct({act: props.yesAct}))}>Sim
                </button>
                <button
                    onClick={props.clickNo ? (ev) => props.clickNo(props, ev) : (() => props.onAct({act: props.noAct}))}>Não
                </button>
            </div>
        </Dialog>
    );
});

const RenameDialog = connect(
    state => ({
        ...op.get(state, 'fmea2.app.renameDialog'),
    }),
    dispatch => ({
        onAct: (p, payload) => dispatch({type: at.FMEA2_ACT, p, payload}),
    }))((props) => {
        const onKeyUp = (ev) => {
            switch (ev.keyCode) {
                case 13:
                    return ((ev) => props.clickYes(props, ev) || (() => props.onAct({act: props.yesAct})))();
                case 27:
                    return (props.clickNo ? (ev) => props.clickNo(props, ev) : (() => props.onAct({act: props.noAct})))();
            }
        };
        const onChangeRename = (ev) => {
            let p = {
                // act: 'validRename',
                id: props.id,
                name: op.get(ev, 'target.value', null),
            };
            // this.props.onAct(p, apiActs.askRename(p));
            props.onAct({...p, act: 'changeRename'});

        };
        return (
            <Dialog
                visible={props.visible || op.get(props, props.visibleP, false)}
                animation="zoom"
                maskAnimation="fade"
                onClose={props.onClose || (() => props.onAct({act: props.closeAct}))}
                destroyOnClose
                zIndex={2000}
            >
                <div className='dialog dialog-input'>
                    <p>{props.txt}</p>
                    <input
                        autoFocus
                        onChange={props.onChange || onChangeRename}
                        value={props[props.inputP]}
                        onKeyUp={onKeyUp}
                    />
                    <button
                        disabled={props.yesDisabled || op.get(props, props.yesDisP, false)}
                        onClick={(ev) => props.clickYes(props, ev) || (() => props.onAct({act: props.yesAct}))}>Confirmar
                    </button>
                    <button
                        onClick={props.clickNo ? (ev) => props.clickNo(props, ev) : (() => props.onAct({act: props.noAct}))}>Cancelar
                    </button>
                </div>
            </Dialog>
        );
    }
);

export default connect(
    state => ({
        ...op.get(state, 'fmea2.app'),
    }),
    (dispatch, ownProps) => ({
        onAct: (p, payload) =>
            dispatch({type: at.FMEA2_ACT, p, payload}),
        onUpdateField: (key, value) =>
            dispatch({type: at.FMEA2_UPDATEFIELD, key, value}),
        onLoad: payload => {
            //console.log(ownProps);
            return dispatch({type: at.FMEA2_LOADED, payload: apiActs.list({type: 'fmeadocs'})});
        },
        onUnLoad: payload => {
            //console.log(ownProps);
            return dispatch({type: at.FMEA2_LOADED, payload: apiActs.list({type: 'fmeadocs'})});
        },
    })
)(class extends React.Component {
    _modlist = () => {
        return Object.keys(modelList).sort((a, b) => a.order - b.order).map(k =>
            (<ModPanel className={cn('fmea2-modpanel-cont')}
                       key={k}
                       viewKey={k}
                       modTitle={typeof modelList[k].title == 'function' && modelList[k].title(txt.n.s, txt.c.c)}
            />)
        );
    };

    render() {
        return (
            <div className="fmea2-app-page">
                <Crumb/>
                <div className="fmea2-panescont">
                    <ModPanel
                        key={'fmeadocs'}
                        modKey={'fmeadocs'}
                        viewKey='root'
                        modTitle={typeof modelList['fmeadocs'].title == 'function' && modelList['fmeadocs'].title(txt.n.p, txt.c.c)}
                        modeType={modelList['fmeadocs'].name}
                        modeParent={modelList['fmeadocs'].Parent}
                    />
                    {this._modlist()}
                </div>
                <RenameDialog
                    txt={`Renomear '${this.props.name}' como`}
                    visibleP='renaming'
                    yesDisP='invalidRename'
                    closeAct='renameClose'
                    noAct='renameClose'
                    inputP='renameText'
                    errorTxt='renameErrors'
                    // onChange={this.onChangeRename}
                    // clickYes={() => this.ch('rename') }
                />
                <DeleteDialog
                    txt={`Deseja realmente apagar '${this.props.name}'?`}
                    visibleP='deleting'
                    closeAct='deleteClose'
                    noAct='deleteClose'
                    // clickYes={() => this.ch('delete')}
                />
            </div>);
    }
});