const mongoFieldList = (fields_new) => {
    var extrafields = {};
    for (key in fields_new) {
        switch (fields_new[key].tipo) {
            case 'obj':
                extrafields[fields_new[key].prop] = Object;
                break;
            case 'dt':
                extrafields[fields_new[key].prop] = Date;
                break;
            case 'num':
                extrafields[fields_new[key].prop] = Number;
                break;
            default:
                extrafields[fields_new[key].prop] = String;
        }
    }
    return extrafields;
};

const proplist = (obj, extrafields_) => {
    let r = {};
    for (let key in extrafields_) {
        //console.log(key);
        r[key] = obj[key];
    }
    return r;
}

// meio seguro de acessar subvariáveis
const coal = (obj, path = '', def = undefined) => {
    let _path = [],
        _obj = obj;
    try {
        _path = path.split('.')
    } catch {
        return def;
    }
    for (let i = 0; i < _path.length; i++) {
        if (_obj && typeof (_obj[_path[i]]) !== 'undefined')
            _obj = _obj[_path[i]];
        else {
            return def;
        }
    }
    return _obj;
};

module.exports = {mongoFieldList, proplist, coal};