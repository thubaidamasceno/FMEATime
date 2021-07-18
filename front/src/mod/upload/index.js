import React from 'react';
import {Route} from 'react-router-dom';
// import AssignmentIcon from '@material-ui/icons/Assignment';
// import Add from '@material-ui/icons/Add';

import UploadComp from './Comp';
import UploadEditor from './Editor';
import UploadViewComp from './ViewComp';


export const routesupload = [
    <Route path="/upload/:id"  key={window.keygen()} component={()=>(<UploadComp/>)}/>,
    <Route path="/upload" key={window.keygen()}  component={()=>(<UploadViewComp/>)}/>,
    <Route path="/uploadEditor/:slug" key={window.keygen()}  component={()=>(<UploadEditor/>)}/>,
    <Route path="/uploadEditor" key={window.keygen()}  component={()=>(<UploadEditor/>)}/>,];

export const menuitemsupload = [
    //["Upload",<AssignmentIcon/>,'/upload'],["Criar upload",<Add/>,'/uploadEditor'],'divider'
];
