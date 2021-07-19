var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var secret = require('../config').secret;


var fc = require('../../front/src/mod/usuario/modconf');
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


var UserSchema = new mongoose.Schema({
    ...extrafields_,
    username: {
        type: String,
        lowercase: true,
        unique: true,
        required: [true, "can't be blank"],
        match: [/^[a-zA-Z0-9\.@_]+$/, 'is invalid'],
        index: true
    },
    email: {type: String, lowercase: true, match: [/\S+@\S+\.\S+/, 'is invalid'], index: true},
    bio: String,
    image: String,
    favorites: [{type: mongoose.Schema.Types.ObjectId, ref: 'Article'}],
    following: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    hash: String,
    salt: String,
    roles: [{type: String}],
    role: {type: String, default: 'guest'},
    __del: {type: Number, default: 0},
}, {timestamps: true, usePushEach: true});

mongoose.plugin(UserSchema => {
    UserSchema.options.usePushEach = true
});

UserSchema.plugin(uniqueValidator, {message: 'is already taken.'});

UserSchema.methods.validPassword = function (password) {
    var hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
    return this.hash === hash;
};

UserSchema.methods.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

UserSchema.methods.generateJWT = function () {
    var today = new Date();
    var exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    return jwt.sign({
        id: this._id,
        username: this.username,
        exp: parseInt(exp.getTime() / 1000),
    }, secret);
};

UserSchema.methods.toAuthJSON = function () {
    return {
        username: this.username,
        email: this.email,
        token: this.generateJWT(),
        bio: this.bio,
        role: this.role,
        image: '/android_asset/www/default-user.svg' || this.image,
    };
};

UserSchema.methods.toProfileJSONFor = function (user) {
    let r = {
        username: this.username,
        bio: this.bio,
        roles: this.roles,
        role: this.role,
        image:
        //this.image ||
            '/android_asset/www/default-user.svg',
        //following: user ? user.isFollowing(this._id) : false
    };
    for (let key in extrafields_) {
        r[key] = this[key];
    }
    return r;
};

UserSchema.methods.favorite = function (id) {
    if (this.favorites.indexOf(id) === -1) {
        this.favorites.push(id);
    }

    return this.save();
};

UserSchema.methods.unfavorite = function (id) {
    this.favorites.remove(id);
    return this.save();
};

UserSchema.methods.isFavorite = function (id) {
    return this.favorites.some(function (favoriteId) {
        return favoriteId.toString() === id.toString();
    });
};

UserSchema.methods.follow = function (id) {
    if (this.following.indexOf(id) === -1) {
        this.following.push(id);
    }

    return this.save();
};

UserSchema.methods.unfollow = function (id) {
    this.following.remove(id);
    return this.save();
};

UserSchema.methods.isFollowing = function (id) {
    return this.following.some(function (followId) {
        return followId.toString() === id.toString();
    });
};

mongoose.model('User', UserSchema);
