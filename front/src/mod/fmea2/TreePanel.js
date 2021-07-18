// TODO: criar forma de mover subitem para a raíz da árvore
// TODO: atualizar ao modificar

import React, {Component} from 'react';
import {connect} from "react-redux";
import {at, modelList, pathfier} from "./modconf";
import cn from 'classnames';
import * as op from 'object-path';
import {_icons} from "../../icons";
import {apiActs} from "../fmea2/reducers";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails/AccordionDetails";
import Accordion from "@material-ui/core/Accordion/Accordion";
import Tree from 'rc-tree';
import 'rc-tree/assets/index.css';

export default connect(
    (state, ownProps) => {
        return {
            ...state.fmea2,
            //
            // qual o id ativo:
            data: op.get(state, pathfier(`fmea2.data.${ownProps.parent__}.${ownProps.modKey}`), ''),
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
        onLoad: (p, payload) => {
            //console.log(ownProps);
            return dispatch({type: at.FMEA2_LOADED, payload: apiActs.list(p)});
        }
    })
)(class extends React.Component {
    componentDidMount() {
        this.props.onLoad({
            type: this.props.modKey,
            parent_: this.props.parent_,
        });
    }


    constructor(props) {
        super(props);
        const {keys} = props;
        this.state = {
            defaultExpandedKeys: keys,
            defaultSelectedKeys: keys,
            defaultCheckedKeys: keys,
        };

        this.treeRef = React.createRef();
    }

    onSelect = (selectedKeys, info) => {
        console.log('selected', selectedKeys, info);
        this.selKey = info.node.props.eventKey;
    };

    onDragStart = info => {
        //console.log('start', info);
    };

    onDragEnter = info => {
        // console.log('enter', info);
        // this.setState({
        //     expandedKeys: info.expandedKeys,
        // });
    };

    onDrop = info => {
        const dragId = info.dragNode.key;
        const dragPath__ = info.dragNode.path__;
        const dropId = info.node.key;

        let p = {
            act: 'reparent',
            type: this.props.modKey,
            body: {
                type: this.props.modKey,
                dragId,
                dropId,
                dragPath__,
            },
        };
        this.props.onAct(p,
            apiActs.reparent(p));
    };

    render(props = this.props) {
        let expandedKeys=[];
        const processaTreeData = (leaf) => {
            let rt = [];
            for (let k in leaf) {
                rt.push({
                    ...leaf[k],
                    key: leaf[k]._id,
                    title: leaf[k].name,
                    children: processaTreeData(leaf[k].childs),
                });
                expandedKeys.push(leaf[k]._id);
            }
            return rt;
        };

        var treeData = processaTreeData(props.data)        ;
            //  [{
            //     key: '0-0',
            //     title: 'parent 1',
            //     children: [
            //         {key: '0-0-0', title: 'parent 1-1', children: [{key: '0-0-0-0', title: 'parent 1-1-0'}]},
            //         {
            //             key: '0-0-1',
            //             title: this.customLabel,
            //             children: [ ],
            //         },
            //     ],
            // }, ]
        //
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

        const item = (data) => {
            return (<span className='fmea2-listitem' key={data._id}>
                <div className='fmea2-listitem-title'>{data.title}</div>
                <div className={cn('fmea2-itemlist', {ativo: props.active === data._id})}
                     onClick={ev => onClick(ev, {
                         act: 'select',
                         viewKey: props.viewKey,
                         type: props.modKey,
                         id: data._id,
                         path__: data.path__,
                     })}>
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
                    </div>)}
                </div>
            </span>);
        };

        const tree = () => {
            return (<div>
                <Tree
                    showLine
                    showIcon={false}
                    //checkable
                    defaultExpandAll={true}
                    expandedKeys={expandedKeys}
                    // onExpand={this.onExpand}
                    autoExpandParent={true}
                    draggable
                    onDragStart={this.onDragStart}
                    onDragEnter={this.onDragEnter}
                    onDrop={this.onDrop}
                    //motion={motion}
                    titleRender={item}
                    treeData={treeData}
                />
            </div>);
        };
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
                                clickYes: (remoteProps, ev) => ch('create', ev, remoteProps)
                            })}>
                        <_icons.AddBoxIcon/>
                    </button>)}
                </AccordionSummary>
                <AccordionDetails>
                    <div className={cn('fmea2-modpanel-cont')}>
                        {tree()}
                    </div>
                </AccordionDetails>
            </Accordion>
        );
        return visible();
    }
});