import React from 'react';
import {connect} from "react-redux";
import {at, modelList, txt} from "./modconf";
import ListPanel from "./ListPanel";
import * as op from "object-path";
import * as im from 'object-path-immutable';
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
            crumbs: op.get(state, 'fmea2.app.crumbs', {}),
            crumbList: op.get(state, 'fmea2.app.crumbList', []),
        };
    },
    dispatch => ({
        onAct: (p, payload) =>
            dispatch({type: at.FMEA2_ACT, p, payload}),
    })
)(class extends React.Component {
    render(props = this.props) {
        const inVisible = () => (<div style={{display: 'none'}}>.</div>);
        const visible = () => {
            let list = props.crumbList.map(k => {
                return (<button
                    key={k}
                    className='fmea2-crumbs-item'
                    onClick={() => props.onAct({
                        act: 'restoreCrumb',
                        viewKey: k,
                    })}>{op.get(props, `crumbs.${k}.title`,k)}</button>);
            });
            return (<div className="fmea2-crumbs-panel">{list}</div>);
        };

        return visible();//: inVisible();
    }
});