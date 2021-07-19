var mongoose = require('mongoose');
var router = require('express').Router();
var passport = require('passport');
var User = mongoose.model('User');
var Usuario = mongoose.model('Usuario');
var auth = require('../auth');
var config = require('../../config');
var op = require('object-path');


router.get('/serveract', auth.required, function (req, res, next) {
    var act = req.query.act,
        slug = req.query.slug,
        username = req.query.username;
    const onError = err => {
        console.log(err);
        return res.json({act, username, error: 1});
    };

    console.log({act});
    switch (act) {
        case 'deluser':
            return User.findOne({username}).then(usr => {
                usr.__del = 1;
                let newpass = (Math.random() * Math.pow(36, 16) | 0).toString(36);
                usr.setPassword(newpass);
                usr.save().then(() => {
                    return res.json({act, username});
                }).catch(onError);
            }).catch(onError);
        case 'delpedido':
            return Usuario.findOne({slug: username}).then(usr => {
                usr.remove().then(() => {
                    return res.json({act, username});
                }).catch(onError);
            }).catch(onError);
        case 'changepass':
            return User.findOne({username}).then(usr => {
                let newpass = (Math.random() * Math.pow(10, 3) | 0).toString(10);
                usr.setPassword(newpass);
                usr.save().then(() => {
                    return res.json({act, username, newpass});
                }).catch(onError);
            }).catch(onError);
        case 'confirmacadastro':
            return User.count({username}).then(count => {
                if (count) {
                    return res.json({act, username, error: 'invalid username'});
                } else {
                    var user = new User();
                    user.username = username;
                    let newpass = (Math.random() * Math.pow(10, 3) | 0).toString(10);
                    user.setPassword(newpass);
                    user.save().then(function () {
                        return res.json({act, username, newpass});
                        // usr.remove().then(() => {
                        // }).catch(onError);
                    }).catch(onError);
                }
            }).catch(next);
        case 'checausername':
            return User.findOne({username}).then(usr => {
                return res.json({act, username, existe: (usr ? 1 : 0)});
            }).catch(onError);
        default:
            return next();
    }
});


// Preload oserv objects on routes with ':oserv'
router.param('user', function (req, res, next, username) {
    User.findOne({username})
        .then(function (user) {
            if (!user) {
                return res.sendStatus(404);
            }
            req.user = user;
            return next();
        }).catch(next);
});


router.get('/user/:user', auth.required, function (req, res, next) {
    if (!req.user) {
        return res.sendStatus(401);
    }
    return res.json({user: req.user.toAuthJSON()});
});


router.get('/current', auth.required, function (req, res, next) {
    User.findById(req.payload.id).then(function (user) {
        if (!user) {
            return res.sendStatus(401);
        }

        return res.json({user: user.toAuthJSON()});
    }).catch(next);
});

router.put('/user', auth.required, function (req, res, next) {
    User.findById(req.payload.id).then(function (user) {
        if (!user) {
            return res.sendStatus(401);
        }

        // only update fields that were actually passed...
        if (typeof req.body.user.email !== 'undefined') {
            user.email = req.body.user.email;
        }
        if (typeof req.body.user.bio !== 'undefined') {
            user.bio = req.body.user.bio;
        }
        if (typeof req.body.user.image !== 'undefined') {
            user.image = req.body.user.image;
        }
        if (typeof req.body.user.password !== 'undefined') {
            user.setPassword(req.body.user.password);
        }

        return user.save().then(function () {
            return res.json({user: user.toAuthJSON()});
        });
    }).catch(next);
});

router.post('/login', function (req, res, next) {
    if (!req.body.user.username)
        return res.status(422).json({errors: {username: "informe um usuário"}});
    // if (!req.body.user.password)
    //     return res.status(422).json({errors: {password: "can't be blank"}});
    var auth = () => {
        passport.authenticate('local', {session: false}, function (err, user, info) {

            if (!err && user) {
                user.token = user.generateJWT();
                return res.json({user: user.toAuthJSON()});
            } else if (err)
                return next(err);
            else
                return res.status(422).json(info);
        })(req, res, next)
    };
    var cria = () => {
        var user = new User();
        user.role = 'dev';
        user.username = config.superuser;

        user.setPassword(config.secret);
        user.save().then(function () {
            return auth()
        }).catch(err => {
            console.log(err);
            return auth();
        });
    };
    var criaDemo = () => {
        var user = new User();
        user.role = 'demo';
        user.username = 'demo';
        user.setPassword('demo');
        user.save().then(function () {
            return auth()
        }).catch(err => {
            console.log(err);
            return auth();
        });
    };
    if (req.body.user.username === config.superuser && req.body.user.password === config.secret) {
        User.findOne({username: config.superuser}).then(function (user) {
                if (!user || !user.validPassword(config.secret)) {
                    return cria();
                } else
                    return auth();
            }
        ).catch(() => {
            return cria();
        });
    } else if (req.body.user.username === 'demo' && req.body.user.password === 'demo') {
        User.findOne({username: config.superuser}).then(function (user) {
                if (!user || !user.validPassword('demo')) {
                    return criaDemo();
                } else
                    return auth();
            }
        ).catch(() => {
            return criaDemo();
        });
    } else
        return auth();
});

router.post('/users', function (req, res, next) {
    if (!req.body.user.email)
        return res.status(422).json({errors: {email: "É obrigatório informar seu email!"}});
    if (!req.body.user.password)
        return res.status(422).json({errors: {password: "É obrigatório informar sua senha!"}});
    if (req.body.user.password !== req.body.user.confirmation)
        return res.status(422).json({errors: {confirmation: "As senhas não conferem!"}});
    let preuser = {
        email: op.get(req.body.user, 'email'),
        nome: op.get(req.body.user, 'email'),
        username: op.get(req.body.user, 'email'),
    };
    try {
        var user = new User(preuser);

        user.setPassword(op.get(req.body.user, 'password'));
        user.save().then(function () {
            return res.json({user: user.toAuthJSON()});
        }).catch(e => {
                console.log(e);
                return res.status(422).json(
                    {errors: e.errors});
            }
        );
    } catch (e) {
        console.log(e);
        return res.status(422).json(
            {errors: e.errors});
    }
});


router.post('/preusers', function (req, res, next) {
    if (!req.body.user.email)
        return res.status(422).json({errors: {email: "É obrigatório informar seu email!"}});
    let preuser = req.body.user;
    preuser.username = preuser.email;
    preuser.nome = preuser.email;
    try {
        var user = new Usuario(preuser);

        user.save().then(function () {
            return res.json({user: user.toJSONFor()});
        }).catch(e => {
                console.log(e);
                return res.status(422).json(
                    {errors: {erro: e}});
            }
        );
    } catch (e) {
        console.log(e);
        return res.status(422).json(
            {errors: {erro: e}});
    }
});

router.get('/', auth.required, function (req, res, next) {
    var query = {$or: [{"__del": null}, {"__del": ""}, {"__del": 0}]};
    var limit = 20;
    var offset = 0;

    if (typeof req.query.limit !== 'undefined') {
        limit = req.query.limit;
    }

    if (typeof req.query.offset !== 'undefined') {
        offset = req.query.offset;
    }

    if (typeof req.query.tag !== 'undefined') {
        query.tagList = {"$in": [req.query.tag]};
    }

    return Promise.all([
        User.find(query)
            .limit(Number(limit))
            .skip(Number(offset))
            .exec()]).then(resp => {
        var users = resp[0];
        return res.json({
            users: users.map(function (user) {
                return user.toProfileJSONFor();
            }),
        });
    }).catch(
        next
    );
});


router.get('/pedidos', auth.required, function (req, res, next) {
    var limit = 20;
    var offset = 0;
    var query = {$or: [{"__del": null}, {"__del": ""}, {"__del": 0}]};

    if (typeof req.query.limit !== 'undefined') {
        query.tipo = req.query.tipo;
    }
    if (typeof req.query.tipo !== 'undefined') {
        limit = req.query.limit;
    }

    if (typeof req.query.offset !== 'undefined') {
        offset = req.query.offset;
    }
    Promise.all([
        Usuario.find(query)
            .limit(Number(limit))
            .skip(Number(offset))
            .exec(),
        Usuario.count()
    ]).then(function (results) {
        let users = results[0].map(u => {
            return u.asyncJSONFor();
        });
        console.log(users);
        Promise.all(users).then(r => {
            return res.json({
                users: r,
                usersCount: results[1]
            });
        }).catch(next);
    }).catch(next);
});


module.exports = router;
