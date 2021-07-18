module.exports = (router, mods) => {

    router.param('fmea', function (req, res, next, fmea) {
        req.id = fmea;
        return mods.fmeadocs.findById(fmea).then((obj) => {
            req.obj = obj;
            return next();
        }).catch(
            () => next()
        );
    });

    router.get('/view', function (req, res, next) {
        res.json('ok1');
    });
    router.get('/view/:fmea', function (req, res, next) {
        res.json('ok2');
    });

};