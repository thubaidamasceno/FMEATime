var mongoose = require('mongoose');
var MpathPlugin = require('mongoose-mpath');
var {modelTree} = require('./modconf');

// var uniqueValidator = require('mongoose-unique-validator');
// var slug = require('slug');
// // var User = mongoose.model('User');
// var  util = require('../../util');

const ObjectId = mongoose.Schema.Types.ObjectId;
const expand = (leaf, Parent = '') => {
    let _mlist = {};
    let ordem = 0;
    for (let k in leaf) {
        let filhos = {};
        if (leaf[k] && leaf[k]._) {
            _mlist = {..._mlist, ...expand(leaf[k]._, k)};
            for (let j in leaf[k]._) {
                filhos[j.toLowerCase() + 's'] = [{type: ObjectId, ref: j}];
            }
        }
        if (Parent)
            filhos['parent_'] = {type: ObjectId, ref: Parent};
        let clean = {
            ...leaf[k],
            Parent,
            parent: (Parent ? Parent.toLowerCase() + 's' : ''),
            name: k,
            name_: k.toLowerCase() + 's'
        };
        clean._f = {...(leaf[k]._f || {}), ...filhos};
        clean._ = (leaf[k]._) ? Object.keys(leaf[k]._) : [];
        clean._order = ordem++;
        _mlist = {..._mlist, [k.toLowerCase() + 's']: clean};
    }
    return _mlist;
};
const modelList = expand(modelTree);
//
const modelsExport = {_meta_: {modelList, modelTree}, ModelsExports: {}, modelsexports: {}};
//
for (let k in modelList) {
    let ml = modelList[k];
    let f = {
        name: String,
        path_: String,// por compatibilidade
        path__: String,// por compatibilidade
        parent_: {type: ObjectId},// por compatibilidade
        parent__: String,// por compatibilidade
    };
    if (ml._f)
        f = {...f, ...ml._f};
    let sch = new mongoose.Schema(f, {timestamps: true, usePushEach: true});
    if (ml._isTree)
        sch.plugin(MpathPlugin);
    sch.pre('save', function (next) {
            let doc = {_doc: this};
            // console.log('pre saving fmeaPartSchema');
            if (!doc._doc._id)
                doc._doc._id = ObjectId();
            let meta = modelList[this.__proto__.collection.name.toLowerCase()];

            let pathUpdateIsRequired = doc._doc.isNew || doc._doc.isModified('parent');
            if (meta && meta.Parent && pathUpdateIsRequired)//&& (!doc._doc.path_ || !doc._doc.path__))
            {
                let parentORM = modelsExport[meta.Parent + 's'];
                if (parentORM)
                    return parentORM.findById(doc._doc.parent_).then(function (p) {
                        doc._doc.path_ = p.path_ + '/' + k + ':' + doc._doc._id;
                        doc._doc.path__ = p.path__ + '/' + k + ':' + (doc._doc.path ? doc._doc.path : doc._doc.id);
                        //doc.save();e
                        next();
                    }).catch(function (e) {
                        doc._doc.path_ = '';
                        doc._doc.path__ = '';
                        next();
                    });
                else {
                    doc._doc.path_ = '';
                    doc._doc.path__ = '';
                }
            } else {
                if (!doc._doc.path_ || !doc._doc.path__) {
                    doc._doc.path_ = k + ':' + doc._doc._id;
                    doc._doc.path__ = k + ':' + (doc._doc.path ? doc._doc.path : doc._doc.id);
                }
            }
            next();
        }
    )
    ;
    const mdl = mongoose.model(ml.name, sch);
    modelsExport[ml.name + 's'] = mdl;
    modelsExport[ml.name_] = mdl;
    modelsExport.ModelsExports[ml.name + 's'] = mdl;
    modelsExport.modelsexports[ml.name_] = mdl;
}
module.exports = modelsExport;