var http = require('http'),
    path = require('path'),
    fs = require('fs'),
    methods = require('methods'),
    express = require('express'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    cors = require('cors'),
    passport = require('passport'),
    errorhandler = require('errorhandler'),
    mongoose = require('mongoose'),
    https = require('https'),
    execSync = require('child_process').execSync,
    modulos = require('./modules');

var isProduction = process.env.NODE_ENV === 'production';

// Create global app object
var app = express();

app.use(cors());

// Normal express config defaults
app.use(require('morgan')('dev'));


var bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));


app.use(require('method-override')());
//app.use(express.static(__dirname + '/public'));

var config = require('./config');

app.use(session({secret: config.secret, cookie: {maxAge: 60000}, resave: false, saveUninitialized: false}));

if (!isProduction) {
    app.use(errorhandler());
}

mongoose.connect(config.database);
if (isProduction) {
} else {
    mongoose.set('debug', true);
}

require('./models/User');
require('./config/passport');

modulos.models.map(val => {
    require(val);
});

var routerreload = require('express').Router();
var auth = require('./routes/auth');

// Preload oserv objects on routes with ':oserv'
routerreload.param('tipo', function (req, res, next, tipo) {
    req.tipo = tipo;
    return next();
});
routerreload.post('/log', auth.optional, function (req, res, next) {
    console.log(req.body);
    console.log('coletou');
    res.type('text/plain');
    res.send('ok');
    return req;
});
routerreload.get('/:tipo', auth.optional, function (req, res, next) {
    var output = 'vazia';
    var params = {
        //stdio: 'inherit',
        encoding: 'utf-8'
    };
    try {
        switch (req.tipo) {
            case 'log':
                console.log(req);
                console.log('coletou');
                res.type('text/plain');
                res.send('ok');
                return req;
                break;
            case "git":
                output = execSync(
                    'cd .. && sh gitupdate.sh ',
                    params);
                break
            case "yarn_back":
                output = execSync('yarn ', params);
                break;
            case "yarn_front":
                output = execSync('cd ../front && yarn', params);
                break;
            case "build_front":
                output = execSync('cd ../front && yarn buildc &&' +
                    'cp favicon.ico platforms/browser/platform_www &&' +
                    './node_modules/cordova/bin/cordova build browser', params);
                break;
            case "reload":
                setTimeout(reload, 1);
                output = "reload em 2s!";
                break;
            default:
                output = "( git |  yarn_back |  yarn_front |  build_front |  reload )"
            // output = execSync('sh ../reload.sh ', params);
            //fs.writeFileSync('../front/platforms/browser/www/reload.log', output, {encoding: 'utf-8'})
        }
    } catch
        (error) {
        output = output + '\n' + JSON.stringify(error)
    }
    fs.writeFileSync(`../upload/reload-${Date.now()}.log`, output, {encoding: 'utf-8'})

    console.log('Output was:\n', output);
    res.type('text/plain');
    res.send(output);
    return req;
});
app.use('/reload', routerreload);
var reload = async () => {
    process.exit("10");
};

// const { UI } = require('bull-board');
// app.use('/bullboard', UI);

app.use(require('./routes'));
app.use(express.static('../front/platforms/browser/www'));
app.use("/", express.static('../front/platforms/browser/www'));
app.use("/android_asset/www", express.static('../front/platforms/browser/www'));
app.use("/upload", express.static('../upload'));


/// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (!isProduction) {
    app.use(function (err, req, res, next) {
        console.log(err.stack);

        res.status(err.status || 500);

        res.json({
            'errors': {
                message: err.message,
                error: err
            }
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        'errors': {
            message: err.message,
            error: {}
        }
    });
});

// Starting both http & https servers
const httpServer = http.createServer(app);
httpServer.listen(process.env.PORT || 48754, () => {
    console.log('Listening on port ' + httpServer.address().port);
});
// try {
// // Let's Encrypt
//     execSync(
//         ` certbot -n --agree-tos --non-interactive -d aramita.fmeatime.com  -m thubaichaves@gmail.com` +
//         ` certonly --cert-name fmeatime --preferred-challenges http --http-01-port 8123 ` +
//         ` --webroot -w ../front/platforms/browser/www --keep-until-expiring --rsa-key-size 4096 ` +
//         ` --config-dir ../certs/ `, {encoding: 'utf-8'});
// } catch (e) {
//     console.log(e);
// }
try {
    const certpath = '../certs';
    const privateKey = fs.readFileSync(certpath + '/fmeatime.damasceno.pro.priv', 'utf8');
    const certificate = fs.readFileSync(certpath + '/fmeatime.damasceno.pro.cert', 'utf8');
    const ca = fs.readFileSync(certpath + '/fmeatime.damasceno.pro.full', 'utf8');

    const credentials = {
        key: privateKey,
        cert: certificate,
        ca: ca
    };

    const httpsServer = https.createServer(credentials, app);
    httpsServer.listen((process.env.PORT+1) || 48755, () => {
        console.log('Listening on port ' + httpsServer.address().port);
    });
} catch (e) {
    console.log(e);
}
