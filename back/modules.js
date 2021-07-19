

var models = [];
var api = [
     //['/misc','misc']
];

//§§§_begin_modulos_modules


//¬¬¬_begin_fmea2
models=[...models,'./mod/fmea2/modfmea',];
api=[...api,
    ['/fmeas2/v1','fmea2'],
    ['/fmeas2/v2','fmea2/v2'],
];
//¬¬¬_end_fmea2

//¬¬¬_begin_usuario
models=[...models,'./mod/usuario/pai1','./mod/usuario/filho1']; 
api=[...api,
    ['/usuarios','usuario'],
];
//¬¬¬_end_usuario

//¬¬¬_begin_upload
models=[...models,'./mod/upload/pai1','./mod/upload/filho1'];
api=[...api,['/uploads','upload']];
//¬¬¬_end_upload

//§§§_end_modulos_modules

// console.log("api: ",api);
module.exports = {api, models};