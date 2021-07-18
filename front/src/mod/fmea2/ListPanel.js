import React, {Component} from 'react';
// import icons, {_icons} from '../../icons';
// import PropGrid from "./PropGrid";
// import Accordion from '@material-ui/core/Accordion';
// import AccordionSummary from '@material-ui/core/AccordionSummary';
// import AccordionDetails from '@material-ui/core/AccordionDetails';
import {connect} from "react-redux";
import {REDIRECT} from "../../constants/actionTypes";
import {push, goBack} from 'connected-react-router';
// import {CompFuncsViewer} from "./CompFuncs";
import {at, modelList, pathfier} from "./modconf";
// import ModPanel from "./ModPanel";
// import * as rv from 'react-virtualized';
import cn from 'classnames';
import * as op from 'object-path';
// import {forceUpdateReactVirtualizedComponent} from "react-virtualized/dist/commonjs/InfiniteLoader/InfiniteLoader";
import {_icons} from "../../icons";
import {apiActs} from "../fmea2/reducers";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails/AccordionDetails";
import Accordion from "@material-ui/core/Accordion/Accordion";
import clsx from 'clsx';

import NumericInput from 'react-numeric-input';

export default connect(
    (state, ownProps) => {
        // console.log(`key: ${ownProps.modKey}`)
        return {
            ...state.fmea2,
            // qual o id ativo:
            active: op.get(state, pathfier(`fmea2.modviews.${ownProps.viewKey}.active`), ''),
            active__: op.get(state, pathfier(`fmea2.modviews.${ownProps.viewKey}.active__`), ''
            ),
        }
            ;
    },
    (dispatch, ownProps) => ({
        onAct: (p, payload) =>
            dispatch({type: at.FMEA2_ACT, p, payload}),
        onUpdateField: (key, value) =>
            dispatch({type: at.FMEA2_UPDATEFIELD, key, value}),
        onLoad: (p) => {
            //console.log(ownProps);
            return dispatch({type: at.FMEA2_LOADED, payload: apiActs.list(p)});
        },
        dispatch: (o) => dispatch(o),
    })
)(class extends React.Component {
    componentDidMount() {
        this.props.onLoad({
            type: this.props.modKey,
            parent_: this.props.parent_,
        });
    }

    render(props = this.props) {
        const expanded = props.modKey || props.expanded;

        const handleChange = (panel) => {
            if (props.handleChange)
                props.handleChange(panel, true);
        };

        const ch = (act, ev, prp) => {
            let p = {act};
            switch (act) {
                case 'view':
                    p = {
                        ...p,
                        ...prp,
                    };
                    return props.onAct(
                        p,
                        //apiActs.list(p)
                    );
                case 'create':
                    p = {
                        ...p,
                        type: prp.type,
                        body: {
                            name: prp.renameText,
                            parent_: prp.parent_,
                        },
                    };
                    return props.onAct(p, apiActs.create(p));
                case 'rename':
                    p = {
                        ...p,
                        id: prp.id,
                        type: prp.type,
                        path__: prp.path__,
                        body: {name: prp.renameText},
                    };
                    return props.onAct(p, apiActs.patch(p));
                case 'print':
                    props.dispatch(push(`/fmea2/print/@${prp.id}`));
                    return;
                case 'delete':
                    p = {
                        ...p,
                        id: prp.id,
                        type: prp.type,
                        path__: prp.path__,
                        body: {name: prp.renameText},
                    };
                    return props.onAct(p, apiActs.delete(p));
                default:
                    console.log(`ação não encontrada:` + act);
                    return props.onAct(p);
            }
        };

        const onClick = (ev, p) => {
            ev.stopPropagation();
            props.onAct(p);
        };

        const onFocus = (ev) => {
            //ev.stopPropagation();
        };

        const _itemlist = () => {

            let items = [];
            let path = pathfier(`data.${props.parent__ ? props.parent__ + '.' : ''}${props.modKey}`);
            let list = op.get(props, path, {});
            for (let k in list) {
                let data = op.get(props, pathfier(`data.${props.parent__ ? props.parent__ + '.' : ''}${props.modKey}.${k}`), {});
                items.push(<li className='fmea2-listitem' key={data._id}>
                    <div className={cn('fmea2-itemlist', {ativo: props.active === data._id})}
                         onClick={ev => onClick(ev, {
                             act: 'select',
                             viewKey: props.viewKey,
                             type: props.modKey,
                             id: data._id,
                             path__: data.path__,
                         })}>
                        <div className='fmea2-listitem-row'>
                            <span className='fmea2-listitem-title'>{data.name}</span>
                            <div className='fmea2-listitem-extrafields-a'>{extrafields(data)}</div>
                        </div>
                        {(1 || props.active === data._id) && (<div className='fmea2-itemlist toolbar'>
                            <button className='fmea2-listitem btn'
                                    onFocus={onFocus}
                                    onClick={ev => onClick(ev,
                                        {
                                            act: 'dlgRename',
                                            type: props.modKey,
                                            id: data._id,
                                            path__: data.path__,
                                            clickYes: (remoteProps, ev) => ch('rename', ev, remoteProps)
                                        })}>
                                <_icons.EditIcon/>
                            </button>
                            <button className='fmea2-listitem btn' onFocus={onFocus}
                                    onClick={ev => onClick(ev,
                                        {
                                            act: 'dlgDelete',
                                            type: props.modKey,
                                            id: data._id,
                                            path__: data.path__,
                                            clickYes: (remoteProps, ev) => ch('delete', ev, remoteProps)
                                        })}>
                                <_icons.DeleteIcon/>
                            </button>
                            {modelList[props.modKey]._expand && <button className='fmea2-listitem btn' onFocus={onFocus}
                                                                        onClick={ev => ch('view', ev,
                                                                            {
                                                                                type: props.modKey,
                                                                                viewKey: props.modKey,
                                                                                parent_: data._id,
                                                                                parent__: data.path__,
                                                                            })}>
                                <_icons.VisibilityIcon/>
                            </button>}
                            {modelList[props.modKey]._print && <button className='fmea2-listitem btn' onFocus={onFocus}
                                                                       onClick={ev => ch('print', ev,
                                                                           {
                                                                               type: props.modKey,
                                                                               viewKey: props.modKey,
                                                                               id: data._id,
                                                                               parent_: data._id,
                                                                               parent__: data.path__,
                                                                           })}>
                                <_icons.PrintIcon/>
                            </button>}
                        </div>)}
                    </div>
                </li>);
            }
            return (<ul className='fmea2-lista'>{items}</ul>);
        };

        const onChangeInput = (local) => (ev) => {
            let p = {
                local,
                value: op.get(ev, 'target.value', null),
            };
            props.onAct({...p, act: 'inlineEdit'});
        };
        const onChangeNumberInput = (local) => (value) => {
            if (1 <= value && value <= 10) {
                let p = {
                    local,
                    value,
                };
                props.onAct({...p, act: 'inlineEdit'});
                return true;
            } else
                return false;
        };

        const onKeyUp = (local) => (ev) => {
            let p = {
                local,
            };
            switch (ev.keyCode) {
                case 13:
                    inlineSave(p);
                    return;
                case 27   :
                    inlineReset(p);
                    return;
            }
        };
        const inlineSave = (p) => {
            props.onAct({...p, act: 'inlineSave'}, apiActs.patch({
                ...p,
                type: p.local.type,
                id: p.local._id,
                body: {[p.local.field]: p.local.oldvalue}
            }));
        };
        const inlineReset = (p) => {
            props.onAct
            ({
                ...p,
                act: 'inlineReset',
            });
        };

        const extrafields = (data) => {
            let ef = [], keyidx = 0;
            for (let k in modelList[props.modKey]._f) {
                let hasChanged = op.get(props.data_haschanged, pathfier(op.get(data, 'path__') + '.' + k), false);
                let oldvalue = op.get(data, k, '');
                let local = {
                    type: props.modKey,
                    field: k,
                    _id: op.get(data, '_id'),
                    path__: op.get(data, 'path__', '') + '.' + k,
                    oldvalue
                };
                ef.push(<div className='fmea2-listitem-extrafields-b' key={keyidx++}>
                    {!!modelList[props.modKey]._f[k].editable && (<>
                        <span
                            className='fmea2-listitem-extrafields-c'>{modelList[props.modKey]._f[k].label}</span>{(modelList[props.modKey]._f[k].type === Number) ? (
                        <NumericInput
                            className={clsx('fmea2-listitem-extrafields-input',
                                {'fmea2-listitem-extrafields-changed': hasChanged})}
                            min={1} max={10} value={oldvalue}
                            onKeyUp={onKeyUp(local)}
                            onChange={onChangeNumberInput(local)}
                            strict={true}
                        />) : (<input
                        className={clsx('fmea2-listitem-extrafields-input',
                            {'fmea2-listitem-extrafields-changed': hasChanged})}
                        value={oldvalue}
                        onKeyUp={onKeyUp(local)}
                        onChange={onChangeInput(local)}
                    />)}</>)}
                    {
                        hasChanged && (<div className='fmea2-listitem-extrafields-btns'>
                            <button className='fmea2-listitem btn'
                                    onFocus={onFocus}
                                    onClick={ev => inlineReset({local})}>
                                <_icons.UndoIcon/>
                            </button>
                            <button className='fmea2-listitem btn'
                                    onFocus={onFocus}
                                    onClick={ev => inlineSave({local})}>
                                <_icons.SaveIcon/>
                            </button>
                        </div>)
                    }
                </div>);
            }
            return ef;
        };

        const inVisible = () => (<div style={{display: 'none'}}></div>);

        const visible = () => (
            <Accordion expanded={expanded === props.modKey} onChange={() => handleChange(props.modKey)}>
                <AccordionSummary id="panel2a-header">
                    <span className='fmea2-editortree-heading'>   {props.modTitle}</span>
                    {(expanded === props.modKey) && (<button
                        className='fmea2-expandable-button'
                        onFocus={onFocus}
                        onClick={ev => onClick(ev,
                            {
                                act: 'dlgCreate',
                                type: props.modKey,
                                parent_: props.parent_,
                                // parentPath__: props.path__,
                                clickYes: (remoteProps, ev) => ch('create', ev, remoteProps)
                            })}>
                        <_icons.AddBoxIcon/>
                    </button>)}
                </AccordionSummary>
                <AccordionDetails>
                    {/*<h5>{props.modTitle}</h5>*/}
                    {/*<button className='fmea2-modpanel btn'>*/}
                    {/*    <_icons.AddBoxIcon*/}
                    {/*        //onFocus={onFocus}*/}
                    {/*        onClick={ev => onClick(ev,*/}
                    {/*            {*/}
                    {/*                act: 'dlgCreate',*/}
                    {/*                type: props.modKey,*/}
                    {/*                parentId: props._id,*/}
                    {/*                parentPath__: props.path__,*/}
                    {/*                clickYes: (remoteProps, ev) => ch('create', ev, remoteProps)*/}
                    {/*            })}/>*/}
                    {/*</button>*/}
                    <div className={cn('fmea2-modpanel-cont')}>
                        {_itemlist()}
                    </div>
                </AccordionDetails>
            </Accordion>

        );

// const _rowRenderer = ({index, isScrolling, key, style}) => {
//     const {showScrollingPlaceholder, useDynamicRowHeight} = this.state;
//
//     if (showScrollingPlaceholder && isScrolling) {
//         return (
//             <div
//                 className={clsx(styles.row, styles.isScrollingPlaceholder)}
//                 key={key}
//                 style={style}>
//                 Scrolling...
//             </div>
//         );
//     }
//
//     const datum = this._getDatum(index);
//
//     let additionalContent;
//
//     if (useDynamicRowHeight) {
//         switch (datum.size) {
//             case 75:
//                 additionalContent = <div>It is medium-sized.</div>;
//                 break;
//             case 100:
//                 additionalContent = (
//                     <div>
//                         It is large-sized.
//                         <br/>
//                         It has a 3rd row.
//                     </div>
//                 );
//                 break;
//         }
//     }
//
//     return (
//         <div className={styles.row} key={key} style={style}>
//             <div
//                 className={styles.letter}
//                 style={{
//                     backgroundColor: datum.color,
//                 }}>
//                 {datum.name.charAt(0)}
//             </div>
//             <div>
//                 <div className={styles.name}>{datum.name}</div>
//                 <div className={styles.index}>This is row {index}</div>
//                 {additionalContent}
//             </div>
//             {useDynamicRowHeight && (
//                 <span className={styles.height}>{datum.size}px</span>
//             )}
//         </div>
//     );
// };
// const visible = () => (
//     <rv.List/>
// );
        return visible();
// return (props.app.activeView === props.viewKey) ? visible() : inVisible();
    }
})
;