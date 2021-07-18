// importa componentes da pasta, mas não permite ser importado por nenhum script da pasta
import React from 'react';
import {Route} from 'react-router-dom';

import icons ,{Iconlist} from '../../icons';

import ModApp from './ModApp';
import PrintFMEA from './PrintFMEA';
// import IndicesFMEA from './IndicesFMEA';
// import ModAppView from './Visualization/ViewPanel';

{/*<Route path="/fmea" component={ModApp}/>,*/}
export const routes = [
    (<Route path="/fmea2/print/@:id" key={window.keygen()} component={PrintFMEA}/>),
    // (<Route path="/fmea2/indices" key={window.keygen()} component={IndicesFMEA}/>),
    (<Route path="/fmea2" key={window.keygen()} component={ModApp}/>),
    // (<Route path="/fmea2View/:slug" key={window.keygen()} component={ModAppView}/>),
    // (<Route path="/fmea2View" key={window.keygen()} component={ModAppView}/>),
];

export const menuitems = [
     // ["Índices utilizados",icons.FormatListNumberedRtlIcon  ,'/fmea2'],
    // ["FMEA Visualizar",icons.CallSplitIcon  ,'/fmea2View'],
    // 'divider'
];
