var router = require('express').Router();
var mongoose = require('mongoose');
var Upload = mongoose.model('Upload');
var Uplink = mongoose.model('Uplink');
var User = mongoose.model('User');
var auth = require('../../routes/auth');
var fs = require('fs');
var path = require('path');
const Papa = require('papaparse');
const formidable = require('formidable');
const sharp = require('sharp');


const thumbmaker = (filename, thumbfilename) => {
    sharp(filename).resize(200, 200).toFile(thumbfilename,
        (err, resizeImage) => {
            if (err) {
                console.log(err);
                return;
            } else {
                console.log(resizeImage);
            }
        });
};

router.post('/up', (req, res, next) => {
    const form = formidable({
        keepExtensions: true, maxFieldsSize: 2 ** 24, hash: 'md5',
        uploadDir: path.join(process.cwd(), '../upload')
    });

    form.parse(req, (err, fields, files) => {
        if (err) {
            next(err);
            return res.json({erro: '2'});
        }
        formdata = {...fields, ...files};

        if (formdata.file && formdata.file.path) {
            formdata.filename = formdata.file.path.replace(/^.*[\\\/]/, '');
            if (formdata.file.type && formdata.file.type.match(/^image*./)) {
                formdata.thumb = formdata.file.path.replace(formdata.filename, '_' + formdata.filename);
                thumbmaker(formdata.file.path, formdata.thumb);
            }
            formdata.attachType = formdata.filename.replace(/^.*\./, '');
        }
        Upload.collection.insert({
                formdata,
                slug: formdata.filename || (Math.random() * Math.pow(36, 8) | 0).toString(36)
            }
            // ,{forceServerObjectId: true}
        );
        return res.json({
            thumb: '_' + formdata.filename,
            attach: formdata.filename,
            attachType: formdata.attachType,
        });
    });
});

//
// router.get('/form', (req, res) => {
//     res.send(`
//     <h2>With <code>"express"</code> npm package</h2>
//     <form action="/api/uploads/up" enctype="multipart/form-data" method="post">
//       <div>Text field title: <input type="text" name="title" /></div>
//       <div>File: <input type="file" name="someExpressFiles" multiple="multiple" /></div>
//       <input type="submit" value="Upload" />
//     </form>
//   `);
// });
// // Importação de planilha CVS
// router.get('/importCSV', auth.optional, function (req, res, next) {
//     const file = fs.createReadStream('./os.csv');
//     Papa.parse(file, {
//         header: true,
//         step: function (result) {
//             var upload = new Upload({
//                 ...result.data,
//                 osn: Number.parseInt(result.data.numero),
//                 title: result.data.numero
//             });
//             upload.save().then(function () {
//                 //console.log('ok ');
//             }).catch(e => console.log(e));
//             // console.log([ Number.parseInt(result.data["'osn'"]), result.data.osn]);
//             // console.log(result.data);
//         },
//         complete: function (results, file) {
//             console.log('Complete records.');
//         }
//     });
//     return res.send("ok");
// });
// // Preload upload objects on routes with ':upload'
// router.param('upload', function (req, res, next, slug) {
//     Upload.findOne({slug: slug})
//         .populate('author')
//         .then(function (upload) {
//             if (!upload) {
//                 return res.sendStatus(404);
//             }
//
//             req.upload = upload;
//
//             return next();
//         }).catch(next);
// });
//
// router.param('uplink', function (req, res, next, id) {
//     Uplink.findById(id).then(function (uplink) {
//         if (!uplink) {
//             return res.sendStatus(404);
//         }
//
//         req.uplink = uplink;
//
//         return next();
//     }).catch(next);
// });
//
// router.get('/', auth.optional, function (req, res, next) {
//     var query = { $or : [{"__del" : null}, {"__del" : ""}, {"__del" : 0}] };
//     var limit = 20;
//     var offset = 0;
//
//     if (typeof req.query.limit !== 'undefined') {
//         limit = req.query.limit;
//     }
//
//     if (typeof req.query.offset !== 'undefined') {
//         offset = req.query.offset;
//     }
//
//     if (typeof req.query.tag !== 'undefined') {
//         query.tagList = {"$in": [req.query.tag]};
//     }
//
//     Promise.all([
//         req.query.author ? User.findOne({username: req.query.author}) : null,
//         req.query.favorited ? User.findOne({username: req.query.favorited}) : null
//     ]).then(function (results) {
//         var author = results[0];
//         var favoriter = results[1];
//
//         if (author) {
//             query.author = author._id;
//         }
//
//         if (favoriter) {
//             query._id = {$in: favoriter.favorites};
//         } else if (req.query.favorited) {
//             query._id = {$in: []};
//         }
//
//         return Promise.all([
//             Upload.find(query)
//                 .limit(Number(limit))
//                 .skip(Number(offset))
//                 .sort({createdAt: 'desc'})
//                 .populate('author')
//                 .exec(),
//             Upload.count(query).exec(),
//             req.payload ? User.findById(req.payload.id) : null,
//         ]).then(function (results) {
//             var uploads = results[0];
//             var uploadsCount = results[1];
//             var user = results[2];
//
//             return res.json({
//                 uploads: uploads.map(function (upload) {
//                     return upload.toJSONFor(user);
//                 }),
//                 uploadsCount: uploadsCount
//             });
//         });
//     }).catch(next);
// });
//
//
// router.get('/serveract', auth.required, function (req, res, next) {
//
//     var act = '';
//     var slug = '';
//
//     if (typeof req.query.act !== 'undefined') {
//         act = req.query.act;
//     }
//
//     if (typeof req.query.slug !== 'undefined') {
//         slug = req.query.slug;
//     }
//     switch (act) {
//         case 'delos':
//             return Upload.findOne({slug}).then(function (upload) {
//                 upload.__del = 1;
//                 upload.save().then(function (upload2) {
//                     return res.json({act,slug});
//                 }).catch(next);
//             }).catch(next);
//         default:
//             return next();
//     }
// });
//
// // return a list of tags
// router.get('/tags', auth.optional, function (req, res, next) {
//     Upload.find().distinct('tagList').then(function (tags) {
//         return res.json({tags: tags});
//     }).catch(next);
// });
//
// router.get('/feed', auth.required, function (req, res, next) {
//     var limit = 20;
//     var offset = 0;
//
//     if (typeof req.query.limit !== 'undefined') {
//         limit = req.query.limit;
//     }
//
//     if (typeof req.query.offset !== 'undefined') {
//         offset = req.query.offset;
//     }
//
//     User.findById(req.payload.id).then(function (user) {
//         if (!user) {
//             return res.sendStatus(401);
//         }
//
//         Promise.all([
//             Upload.find({author: {$in: user.following}})
//                 .limit(Number(limit))
//                 .skip(Number(offset))
//                 .populate('author')
//                 .exec(),
//             Upload.count({author: {$in: user.following}})
//         ]).then(function (results) {
//             var uploads = results[0];
//             var uploadsCount = results[1];
//
//             return res.json({
//                 uploads: uploads.map(function (upload) {
//                     return upload.toJSONFor(user);
//                 }),
//                 uploadsCount: uploadsCount
//             });
//         }).catch(next);
//     });
// });
//
// router.post('/', auth.required, function (req, res, next) {
//     User.findById(req.payload.id).then(function (user) {
//         if (!user) {
//             return res.sendStatus(401);
//         }
//
//         var upload = new Upload(req.body.upload);
//
//         upload.author = user;
//
//         return upload.save().then(function () {
//             return res.json({upload: upload.toJSONFor(user)});
//         });
//     }).catch(next);
// });
//
// // return a upload
// router.get('/:upload', auth.optional, function (req, res, next) {
//     Promise.all([
//         req.payload ? User.findById(req.payload.id) : null,
//         req.upload.populate('author').execPopulate()
//     ]).then(function (results) {
//         var user = results[0];
//
//         return res.json({upload: req.upload.toJSONFor(user)});
//     }).catch(next);
// });
//
// // update upload
// router.put('/:upload', auth.required, function (req, res, next) {
//     User.findById(req.payload.id).then(function (user) {
//         if (req.upload.author._id.toString() === req.payload.id.toString()) {
//             for (let key in req.body.upload) {
//                 if (typeof req.body.upload[key] !== 'undefined') {
//                     req.upload[key] = req.body.upload[key];
//                 }
//             }
//             req.upload.save().then(function (upload) {
//                 return res.json({upload: upload.toJSONFor(user)});
//             }).catch(next);
//         } else {
//             return res.sendStatus(403);
//         }
//     });
// });
//
// // delete upload
// router.delete('/:upload', auth.required, function (req, res, next) {
//     User.findById(req.payload.id).then(function (user) {
//         if (!user) {
//             return res.sendStatus(401);
//         }
//
//         if (req.upload.author._id.toString() === req.payload.id.toString()) {
//             return req.upload.remove().then(function () {
//                 return res.sendStatus(204);
//             });
//         } else {
//             return res.sendStatus(403);
//         }
//     }).catch(next);
// });
//
// // Favorite an upload
// router.post('/:upload/favorite', auth.required, function (req, res, next) {
//     var uploadId = req.upload._id;
//
//     User.findById(req.payload.id).then(function (user) {
//         if (!user) {
//             return res.sendStatus(401);
//         }
//
//         return user.favorite(uploadId).then(function () {
//             return req.upload.updateFavoriteCount().then(function (upload) {
//                 return res.json({upload: upload.toJSONFor(user)});
//             });
//         });
//     }).catch(next);
// });
//
// // Unfavorite an upload
// router.delete('/:upload/favorite', auth.required, function (req, res, next) {
//     var uploadId = req.upload._id;
//
//     User.findById(req.payload.id).then(function (user) {
//         if (!user) {
//             return res.sendStatus(401);
//         }
//
//         return user.unfavorite(uploadId).then(function () {
//             return req.upload.updateFavoriteCount().then(function (upload) {
//                 return res.json({upload: upload.toJSONFor(user)});
//             });
//         });
//     }).catch(next);
// });
//
// // return an upload's uplinks
// router.get('/:upload/uplinks', auth.optional, function (req, res, next) {
//     Promise.resolve(req.payload ? User.findById(req.payload.id) : null).then(function (user) {
//         return req.upload.populate({
//             path: 'uplinks',
//             populate: {
//                 path: 'author'
//             },
//             options: {
//                 sort: {
//                     createdAt: 'desc'
//                 }
//             }
//         }).execPopulate().then(function (upload) {
//             return res.json({
//                 uplinks: req.upload.uplinks.map(function (uplink) {
//                     return uplink.toJSONFor(user);
//                 })
//             });
//         });
//     }).catch(next);
// });
//
// // create a new uplink
// router.post('/:upload/uplinks', auth.required, function (req, res, next) {
//     User.findById(req.payload.id).then(function (user) {
//         if (!user) {
//             return res.sendStatus(401);
//         }
//
//         var uplink = new Uplink(req.body.uplink);
//         uplink.upload = req.upload;
//         uplink.author = user;
//
//         return uplink.save().then(function () {
//             req.upload.uplinks.push(uplink);
//
//             return req.upload.save().then(function (upload) {
//                 res.json({uplink: uplink.toJSONFor(user)});
//             });
//         });
//     }).catch(next);
// });
//
// router.delete('/:upload/uplinks/:uplink', auth.required, function (req, res, next) {
//     if (req.uplink.author.toString() === req.payload.id.toString()) {
//         req.upload.uplinks.remove(req.uplink._id);
//         req.upload.save()
//             .then(Uplink.find({_id: req.uplink._id}).remove().exec())
//             .then(function () {
//                 res.sendStatus(204);
//             });
//     } else {
//         res.sendStatus(403);
//     }
// });


module.exports = router;
  