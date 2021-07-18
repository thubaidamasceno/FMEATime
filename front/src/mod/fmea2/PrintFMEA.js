import cn from "classnames";
import {connect} from "react-redux";
import clsx from "clsx";
import {REDIRECT} from "../../constants/actionTypes";
import {push, goBack} from 'connected-react-router';
import {AutoSizer, CellMeasurer, CellMeasurerCache, List, WindowScroller} from "react-virtualized";
import styles from './styles.css';
import Dexie from 'dexie';
import {Link, useParams, withRouter} from 'react-router-dom';
import {at, atc, Act, modelList, pathfier} from "./modconf";
import * as op from "object-path";
import {apiActs} from "./reducers";
import React, {useState, useEffect, useRef} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import ReactJson from 'react-json-view';
import moment from 'moment';
import abl, {ablmk} from "../../ability";


export const PrintFMEA = (props) => {
    let {id} = useParams();
// idx = idx ? idx.toUpperCase() : idx;
    const fmea = useSelector(state => op.get(state, `fmea2.data.fmeadocs.${id}`));
    const role = useSelector(state => op.get(state, `common.role`));
    const dispatch = useDispatch();

    useEffect(() => {
        let p = {
            type: Act.printFMEA,
            id,
            payload: apiActs.fmeaPrint({id}),
        };
        dispatch(p);
    }, [dispatch, id]);
// const logdata = op.get(pedido, 'logdata', []);

    const renderParts = (partObj, level = 0, parent = '') => {
        let ret = [];
        for (let k in partObj) {
            ret.push(
                <div
                    key={partObj[k]._id}
                    className='fmeaPrint-parts-header fmeaPrint-header'
                >
                    <div
                        className='fmeaPrint-parts-cnt fmeaPrint-cnt'>
                        {(<span className='fmeaPrint-parts-parentname'>{parent ? `${parent} >> ` : ''
                        }<span className='fmeaPrint-parts-name'>{partObj[k].name}</span></span>)}
                    </div>
                    <div
                        className='fmeaPrint-parts-sub fmeaPrint-sub'>
                        {renderFuncs(partObj[k].fmeafuncs)}</div>
                </div>
            );
            ret = [
                ...ret,
                ...renderParts(partObj[k].childs, level + 1, `${parent ? `${parent} >> ` : ''}${partObj[k].name}`)
            ]
        }

        return ret.length || level ? ret : [(<div key={window.keygen()}
                                                  className='fmeaPrint-parts-header fmeaPrint-header'><></>
        </div>)];
    };
    const renderFuncs = (partObj) => {
        let ret = [];
        for (let k in partObj) {
            ret.push(
                <div
                    key={partObj[k]._id}
                    className='fmeaPrint-funcs-header fmeaPrint-header'>
                    <div
                        className='fmeaPrint-funcs-cnt fmeaPrint-cnt'>
                        {partObj[k].name}</div>
                    <div
                        className='fmeaPrint-funcs-sub fmeaPrint-sub'>
                        {renderFailMode(partObj[k].fmeafailmodes)}</div>
                </div>
            );
        }
        return ret.length ? ret : [(<div key={window.keygen()} className='fmeaPrint-funcs-header fmeaPrint-header'>
            <div
                className='fmeaPrint-funcs-cnt fmeaPrint-cnt'><></>
            </div>
            <div
                className='fmeaPrint-funcs-sub fmeaPrint-sub'>
                {renderFailMode([])}</div>
        </div>)];
    };
    const renderFailMode = (partObj) => {
        let ret = [];
        for (let k in partObj) {
            let maxSeverity = 0;
            for (let l in partObj[k].fmeafaileffects) {
                let sv = op.get(partObj[k].fmeafaileffects[l], 'severityValue', 0);
                if (sv > maxSeverity) {
                    maxSeverity = sv;
                }
            }

            ret.push(
                <div
                    key={partObj[k]._id}
                    className='fmeaPrint-fail-header fmeaPrint-header'
                >
                    <div
                        className='fmeaPrint-fail-cnt fmeaPrint-cnt'>
                        <div className='fmeaPrint-fail-h1 fmeaPrint-fail-h'> {partObj[k].name}</div>
                        <div className='fmeaPrint-fail-h2 fmeaPrint-fail-h'>{partObj[k].occurrenceValue}</div>
                    </div>
                    <div
                        className='fmeaPrint-fail-cntb fmeaPrint-cntb'>
                        {renderFailEffects(partObj[k].fmeafaileffects)}
                    </div>
                    <div className='fmeaPrint-fail-header fmeaPrint-header'>
                        <div
                            className='fmeaPrint-fail-sub fmeaPrint-sub'>
                            {renderFailCauses(partObj[k].fmeafailcauses, 0,
                                {maxSeverity, ocurrence: partObj[k].occurrenceValue || 0})}</div>
                    </div>
                </div>
            );
        }
        return ret.length ? ret : [(<div
            key={window.keygen()}
            className='fmeaPrint-fail-header fmeaPrint-header'
        >
            <div
                className='fmeaPrint-fail-cnt fmeaPrint-cnt'>
            </div>
            <div
                className='fmeaPrint-fail-sub fmeaPrint-sub'>
                {renderFailEffects([])}</div>
            <div
                className='fmeaPrint-fail-sub fmeaPrint-sub'>
                {renderFailCauses([])}</div>
        </div>)];
    };
    const renderFailEffects = (partObj) => {
        let ret = [];
        for (let k in partObj) {
            ret.push(<div
                    key={partObj[k]._id}
                    className='fmeaPrint-fail-header fmeaPrint-header'
                >
                    <div
                        className='fmeaPrint-fail-cnt fmeaPrint-cnt'>
                        <div className='fmeaPrint-fail-h1 fmeaPrint-fail-h'> {partObj[k].name}</div>
                        <div className='fmeaPrint-fail-h2 fmeaPrint-fail-h'>{partObj[k].severityValue}</div>
                    </div>
                </div>
            );
        }
        return ret.length ? ret : [(<div
            key={window.keygen()}
            className='fmeaPrint-fail-header fmeaPrint-header'
        >
            <div className='fmeaPrint-fail-cnt fmeaPrint-cnt'></div>
        </div>)];
    };

    const perc2color = (perc, min, max) => {
        var base = (max - min);

        if (base === 0) {
            perc = 100;
        } else {
            perc = (perc - min) / base * 100;
        }
        var r, g, b = 0;
        if (perc < 50) {
            r = 255;
            g = Math.round(5.1 * perc);
        } else {
            g = 255;
            r = Math.round(510 - 5.10 * perc);
        }
        var h = r * 0x10000 + g * 0x100 + b * 0x1;
        return '#' + ('000000' + h.toString(16)).slice(-6);
    };

    const renderFailCauses = (partObj, level = 0, rpnData) => {
        let ret = [];
        for (let k in partObj) {
            let rpn =
                (partObj[k].detectionValue || 0) * (rpnData.maxSeverity || 0) * (rpnData.ocurrence || 0);
            ret.push(
                <div
                    key={partObj[k]._id}
                    className='fmeaPrint-cause-header fmeaPrint-header'
                >
                    <div
                        className='fmeaPrint-fail-cnt fmeaPrint-cnt'>
                        <div className='fmeaPrint-fail-h1 fmeaPrint-fail-h'>{partObj[k].name}</div>
                        <div className='fmeaPrint-fail-h2 fmeaPrint-fail-h'>{partObj[k].detectionValue}</div>
                    </div>
                    <div
                        className='fmeaPrint-cause-header fmeaPrint-header'>
                        <div
                            className='fmeaPrint-cause-cnt fmeaPrint-cnt fmeaPrint-rpn'>
                            <svg //height="100%" width="100%"
                                height="30px" width="30px"
                            >
                                <circle cx="15" cy="15" r="10" stroke="black" strokeWidth="1" fill={
                                    perc2color(1001 - rpn, 1, 1000)
                                    // percentageToColor((1000-rpn)/1000)
                                }/>
                            </svg>
                            {rpn ? rpn : ''}</div>
                        <div
                            className='fmeaPrint-cause-sub fmeaPrint-sub'>
                            {renderFailControl(partObj[k].fmeafailcontrols)}</div>
                        <div
                            className='fmeaPrint-cause-header fmeaPrint-header'>
                            <div
                                className='fmeaPrint-cause-sub fmeaPrint-sub'>
                                {renderFailControlNew(partObj[k].fmeafailcontrolnews)}</div>
                        </div>
                    </div>
                </div>
            );
            ret = [
                ...ret,
                ...renderFailCauses(partObj[k].childs, level + 1)
            ]
        }
        return ret.length || level ? ret : [(<div
            key={window.keygen()}
            className='fmeaPrint-cause-header fmeaPrint-header'
        >
            <div className='fmeaPrint-cause-cnt fmeaPrint-cnt'><></>
            </div>
            <div
                className='fmeaPrint-cause-header fmeaPrint-header'>
                <div
                    className='fmeaPrint-cause-cnt fmeaPrint-cnt'></div>
                <div
                    className='fmeaPrint-cause-sub fmeaPrint-sub'>
                    {renderFailControl([])}</div>
                <div
                    className='fmeaPrint-cause-header fmeaPrint-header'>
                    <div
                        className='fmeaPrint-cause-sub fmeaPrint-sub'>
                        {renderFailControlNew([])}</div>
                </div>
            </div>
        </div>)];
    };
    const renderFailControl = (partObj) => {
        let ret = [];
        for (let k in partObj) {
            ret.push(
                <div
                    key={partObj[k]._id}
                    className='fmeaPrint-control-cnt fmeaPrint-cnt'
                >
                    {partObj[k].name}</div>
            );
        }
        return ret.length ? ret : [<div key='' className='fmeaPrint-control-cnt fmeaPrint-cnt'></div>];
    };
    const renderFailControlNew = (partObj) => {
        let ret = [];
        for (let k in partObj) {
            ret.push(
                <div
                    key={partObj[k]._id}
                    className='fmeaPrint-control-cnt fmeaPrint-cnt'>
                    {partObj[k].name}</div>
            )
            ;
        }
        return ret.length ? ret : [<div key='' className='fmeaPrint-control-cnt fmeaPrint-cnt'></div>];
    };

    // if (!pedido || pedido.idx != idx)
    //     return (<></>);
    return (<div
        className='fmeaPrint-cntm'>
        <div
            className='fmeaPrint-fmeaname'> {op.get(fmea, 'name', '')}</div>
        <br/>
        {/*<div className='pedido-view-title'> Pedido {idx}</div>*/}
        {/*Cliente: {pedido.cliente || ''}<br/>*/}
        <div className='fmeaPrint-box'>
            <div className='fmeaPrint-parts-header fmeaPrint-header-head'>
                <div className='fmeaPrint-parts-cnt fmeaPrint-cntx'> Equipamento/Peça</div>
                <div className='fmeaPrint-parts-sub fmeaPrint-sub'>
                    <div className='fmeaPrint-funcs-header fmeaPrint-header-head'>
                        <div className='fmeaPrint-funcs-cnt fmeaPrint-cntx'>Função</div>
                        <div className='fmeaPrint-funcs-sub fmeaPrint-sub'>
                            <div className='fmeaPrint-fail-header fmeaPrint-header-head'>
                                <div className='fmeaPrint-fail-cnt fmeaPrint-cntx'>
                                    <div className='fmeaPrint-fail-h1 fmeaPrint-fail-h'>Modo de Falha</div>
                                    <div className='fmeaPrint-fail-h2 fmeaPrint-fail-hh2 fmeaPrint-fail-h'>Ocorrência
                                    </div>
                                </div>
                                <div className='fmeaPrint-fail-cnt fmeaPrint-cntx'>
                                    <div className='fmeaPrint-fail-h1 fmeaPrint-fail-h'>Efeitos</div>
                                    <div className='fmeaPrint-fail-h2 fmeaPrint-fail-hh2 fmeaPrint-fail-h'>Severidade
                                    </div>
                                </div>
                                <div className='fmeaPrint-fail-header fmeaPrint-header-head'>
                                    <div className='fmeaPrint-fail-cnt fmeaPrint-cntx'>
                                        <div className='fmeaPrint-fail-h1 fmeaPrint-fail-h'>Causa</div>
                                        <div className='fmeaPrint-fail-h2 fmeaPrint-fail-hh2 fmeaPrint-fail-h'>Detecção
                                        </div>
                                    </div>
                                    <div className='fmeaPrint-cause-sub fmeaPrint-sub'>
                                        <div className='fmeaPrint-control-header fmeaPrint-header-head'>
                                            <div className='fmeaPrint-control-cntx fmeaPrint-cntx'>RPN
                                            </div>
                                            <div className='fmeaPrint-control-cntx fmeaPrint-cntx'>Controle Atual
                                            </div>
                                            <div className='fmeaPrint-control-cntx fmeaPrint-cntx'>Controle
                                                Recomendado
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {renderParts(op.get(fmea, 'fmeaparts'))}</div>

        {/*{abl(role, 'open', 'debug') &&*/}
        {/* <ReactJson src={fmea}/>}*/}
    </div>);
};

export default PrintFMEA;