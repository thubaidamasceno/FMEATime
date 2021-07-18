import React from "react";
import { Route } from "react-router-dom";
import AssignmentIcon from "@material-ui/icons/Assignment";
import Add from "@material-ui/icons/Add";
import { t } from "./modconf";

import UsuarioComp from "./Comp";
import UsuarioEditor from "./Editor";
import UsuarioViewComp from "./ViewComp";

export const routesusuario = [
  (<Route path="/usuarioEditor/:slug" key={window.keygen()} component={()=>(<UsuarioEditor/>)} />),
  (<Route path="/usuarioEditor" key={window.keygen()}  component={()=>(<UsuarioEditor/>)} />),
  (<Route path="/usuario/:id" key={window.keygen()}  component={()=>(<UsuarioComp/>)} />),
  (<Route path="/usuario" key={window.keygen()}  component={()=>(<UsuarioViewComp/>)} />),
];

export const menuitemsusuario = [
  [t.usuario(t.n.p, t.c.c), (<AssignmentIcon />), "/usuario"],
  "divider",
];
