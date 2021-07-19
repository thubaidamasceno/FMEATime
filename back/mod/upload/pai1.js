//import * as frontconfig from '../../../front/src/mod/upload/modconf';
var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var slug = require('slug');
var User = mongoose.model('User');
var fc = require('../../../front/src/mod/upload/modconf');


var extrafields = {};
for (key in fc.fields_new) {
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
var UploadSchema = new mongoose.Schema({
    slug: {type: String, lowercase: true, unique: true},
    title: String,
    osn: Number,
    description: String,
    body: String,
    favoritesCount: {type: Number, default: 0},
    uplinks: [{type: mongoose.Schema.Types.ObjectId, ref: 'Uplink'}],
    tagList: [{type: String}],
    author: {type: mongoose.Schema.Types.ObjectId, ref: 'User',},
    __del: {type: Number,default: 0},
    //
    ...extrafields
    //
}, {timestamps: true, usePushEach: true});

UploadSchema.plugin(uniqueValidator, {message: 'is already taken'});

mongoose.plugin(UploadSchema => {
    UploadSchema.options.usePushEach = true
});

UploadSchema.pre('validate', function (next) {
    var slugfy = (next) => {

        console.log(' \n\n\n>>>> \n\n\n', this.slug, this.title, this.osn);
        if (!this.slug)
            this.slug = slug(this.title) + '-' + (Math.random() * Math.pow(36, 6) | 0).toString(36);
        next();
    };
    if (!this.osn || !Number.isInteger(this.osn)) {
        this.osn = Number.parseInt(this.title);
        if (!this.osn || !Number.isInteger(this.osn)) {
            mongoose.model('Upload').findOne().sort([['osn', -1]]).exec((e, m) => {
                if (!e && m && Number.isInteger(m.osn))
                    this.osn = m.osn + 1;
                else
                    this.osn = 1000;
                this.title = '' + this.osn;
                slugfy(next);
            });
        } else
            slugfy(next);
    } else slugfy(next);
});

UploadSchema.methods.updateFavoriteCount = function () {
    var upload = this;

    return User.count({favorites: {$in: [upload._id]}}).then(function (count) {
        upload.favoritesCount = count;

        return upload.save();
    });
};

UploadSchema.methods.toJSONFor = function (user) {
    let r = {
        slug: this.slug,
        title: this.title,
        description: this.description,
        body: this.body,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
        tagList: this.tagList,
        favorited: user ? user.isFavorite(this._id) : false,
        favoritesCount: this.favoritesCount,
        author: this.author?this.author.toProfileJSONFor(user):{}
    };
    for (let key in extrafields_) {
        //console.log(key);
        r[key] = this[key];
    }
    return r;
};

mongoose.model('Upload', UploadSchema);
