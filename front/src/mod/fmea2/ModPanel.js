import React from 'react';
import {connect} from "react-redux";
import {at, modelList, txt} from "./modconf";
import ListPanel from "./ListPanel";
import * as op from "object-path";
import TreePanel from "./TreePanel";
// import icons, {_icons} from '../../icons';
// import PropGrid from "./PropGrid";
// import Accordion from '@material-ui/core/Accordion';
// import AccordionSummary from '@material-ui/core/AccordionSummary';
// import AccordionDetails from '@material-ui/core/AccordionDetails';
// import {CompFuncsViewer} from "./CompFuncs";

export default connect(
    (state, ownProps) => {
        // console.log(`key: ${ownProps.modKey}`)
        return {
            ...state.fmea2,
            //
            // qual o id ativo:
            active: op.get(state, `fmea2.modviews.${ownProps.viewKey}.active`, ''),
            active__: op.get(state, `fmea2.modviews.${ownProps.viewKey}.active__`, ''),
            // parent_: op.get(state, `fmea2.modviews.${ownProps.viewKey}.parent_`),
        };
    },
    dispatch => ({
        onAct: (p, payload) =>
            dispatch({type: at.FMEA2_ACT, p, payload}),
    })
)(class extends React.Component { render(props = this.props) {
        const [expanded, setExpanded] = [{},()=>{}];//React.useState('list');
        const handleChange = (panel) => (event, isExpanded = true) => {
            //setExpanded(isExpanded ? panel : 'list');
        };
        const onClick = (ev, p) => {
            ev.stopPropagation();
            props.onAct(p);
        };
        const onFocus = (ev) => {
            ev.stopPropagation();
        };
        const panels = () => {
            let pan = [];
            let childs = op.get(props.modviews, `${props.viewKey}._`);
            for (let i = 0; i < childs.length; i++) {
                let k = `${op.get(props.modviews, `${props.viewKey}._.${i}`)}s`.toLowerCase();
                pan.push(modelList[k]._isTree?
                    <TreePanel
                        expanded={expanded}
                        setExpanded={setExpanded}
                        handleChange={handleChange}
                        key={k}
                        modKey={k}
                        viewKey={k}
                        modTitle={typeof modelList[k].title == 'function' && modelList[k].title(txt.n.s, txt.c.c)}
                        modeType={modelList[k].name}
                        modeParent={modelList[k].Parent}
                        parent_={props.active}
                        parent__={props.active__}
                    />:
                    <ListPanel
                expanded={expanded}
                setExpanded={setExpanded}
                handleChange={handleChange}
                key={k}
                modKey={k}
                viewKey={k}
                modTitle={typeof modelList[k].title == 'function' && modelList[k].title(txt.n.s, txt.c.c)}
                modeType={modelList[k].name}
                modeParent={modelList[k].Parent}
                parent_={props.active}
                parent__={props.active__}
                />);
            }
            return pan;
        };
        const inVisible = () => (<div style={{display: 'none'}}></div>);
        const visible = () => (
            <div className='fmea2-modpanel-cont'>
                {props.modTitle && (<h5>{props.modTitle}</h5>)}
                {panels()}
            </div>
        );
        return (props.app.activeView === props.viewKey) ? visible() : inVisible();
    }});