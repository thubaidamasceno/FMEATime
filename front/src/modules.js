import { Route } from "react-router";
import React from "react";
//§§§_begin_modulos_import

//¬¬¬_begin_usuario
import usuario, { usuarioCommon } from "./mod/usuario/reducers";
import { routesusuario, menuitemsusuario } from "./mod/usuario";
import UsuarioEditor from "./mod/usuario/Editor";
//¬¬¬_end_usuario

//¬¬¬_begin_fmea2
import {fmea2,  fmeacommon } from "./mod/fmea2/reducers";
import { routes as routesfmea, menuitems as menuitemsfmea  } from "./mod/fmea2";
//¬¬¬_end_fmea2

import upload, { uploadCommon } from "./mod/upload/reducers";
import { routesupload, menuitemsupload } from "./mod/upload";

//¬¬¬_end_upload

//§§§_end_modulos_import

const prefix = "";
var red = {};
let rot = [];
//rot = [...rot,(<Route path="/mapapp" component={()=>(<MyComponent/>)} />),];
let men = [];
let hea = [];
let rc = [];
let sty = [ "/pmodstyle.css"];

//§§§_begin_modulos_modules


//¬¬¬_begin_fmea2
red = { ...red, fmea2 };
rc = [...rc, fmeacommon];
rot = [...rot, ...routesfmea];
men = [...men, ...menuitemsfmea];
sty = [...sty, "/modfmea.css", "/modfmea2.css"];
//¬¬¬_end_fmea2

//¬¬¬_begin_usuario
red = { ...red, usuario };
rc = [...rc, usuarioCommon];
rot = [...rot, ...routesusuario];
men = [...men, ...menuitemsusuario];
//¬¬¬_end_usuario

//¬¬¬_begin_upload

red = { ...red, upload };
rc = [...rc, uploadCommon];
//sty = [...sty, "/upload/pmodstyle.css"];
rot = [...rot, ...routesupload];
men = [...men, ...menuitemsupload];

//¬¬¬_end_upload
//§§§_end_modulos_modules

sty.map((val) => {
  var link = document.createElement("link");
  link.rel = "stylesheet";
  link.type = "text/css";
  link.href = val;
  document.getElementsByTagName("HEAD")[0].appendChild(link);
  return null;
});

export const reducers = red;
export const approutes = rot;
export const menuitems = men;
export const headers = hea;
export const redcommon = rc;
