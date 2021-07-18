const router = require('express').Router();
//var mongoose = require('mongoose');
const mods = require('./modfmea');
const parallel = require('async/parallel');
const streamWorker = require('stream-worker');


router.param('fmeadoc', function (req, res, next, fmea) {
    req.id = fmea;
   return next();
    // return mods.fmeadocs.findById(fmea).then((obj) => {
    //     req.obj = obj;
    // }).catch(
    //     () => next()
    // );
});
//

router.get('/fmeaPrint', function (req, res, next) {
    //req.id = fmeadoc;
    const {tipo} = 'fmeaDocs';
    if (!Object.keys(mods).includes(tipo))
        return res.sendStatus(400);
    return mods[tipo].findById(id).then((obj) => {
        req.obj = obj;
        // req.orm = mods[tipo];
        return res.json(req.obj.toJSON());
    }).catch(
        () => next()
        //(e) => { return res.sendStatus(404).json(e); }
    );
});
//

router.get('/fmeaPrint/:fmeadoc', function (req, res, next) {
    //req.id = fmeadoc;
    const {tipo} = 'fmeaDocs';
    if (!Object.keys(mods).includes(tipo))
        return res.sendStatus(400);
    return mods[tipo].findById(id).then((obj) => {
        req.obj = obj;
        // req.orm = mods[tipo];
        return res.json(req.obj.toJSON());
    }).catch(
        () => next()
        //(e) => { return res.sendStatus(404).json(e); }
    );
});
module.exports = router;