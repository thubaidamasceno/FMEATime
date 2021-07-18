//import * as frontconfig from '../../../front/src/mod/usuario/modconf';
var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var slug = require('slug');
var User = mongoose.model('User');
var fc = require('../../../front/src/mod/usuario/modconf');

function truncate(str, n, useWordBoundary = true) {
    srt = str ? str : '';
    if (str.length <= n)
        return str;
    const subString = str.substr(0, n - 1); // the original check
    return (useWordBoundary
        ? subString.substr(0, subString.lastIndexOf(" "))
        : subString);
};
var extrafields = {};
for (key in fc.fields_new) {
    if (fc.fields_new.db)
        extrafields[fc.fields_new[key].prop] = fc.fields_new.db;
    else
        switch (fc.fields_new[key].tipo) {
            case 'dt':
                extrafields[fc.fields_new[key].prop] = String;
                break;
            case 'num':
                extrafields[fc.fields_new[key].prop] = Number;
                break;
            default:
                extrafields[fc.fields_new[key].prop] = String;
        }
}
const extrafields_ = extrafields;

var UsuarioSchema = new mongoose.Schema({
    ...extrafields,
    slug: {type: String, lowercase: true, unique: true},
}, {timestamps: true, usePushEach: true});

UsuarioSchema.plugin(uniqueValidator, {message: 'já existe'});

mongoose.plugin(UsuarioSchema => {
    UsuarioSchema.options.usePushEach = true
});

UsuarioSchema.pre('validate', function (next) {
    if (!this.slug) {
        this.slugify();
    }
    next();
});

UsuarioSchema.methods.slugify = function () {
    this.slug = slug(truncate(this.nome, 8)).toLowerCase() + '-' + (Math.random() * Math.pow(36, 3) | 0).toString(36);
};
const checaUsername = username => {
    return User.findOne({username}).exec().then((r) => {
        if(r)
            return 1;
        else
            return 0;
        }
    ).catch(() => {
        return 0;
    })
};

UsuarioSchema.methods.toJSONFor = function () {
    let r = {};
    for (let key in extrafields_) {
        r[key] = this[key];
    }
    return r;
};

UsuarioSchema.methods.asyncJSONFor = async function ()  {
    let r = {};
    for (let key in extrafields_) {
        r[key] = this[key];
    }
    r.usernameInvalido = await checaUsername(this.username);
    return r;
};

mongoose.model('Usuario', UsuarioSchema);
