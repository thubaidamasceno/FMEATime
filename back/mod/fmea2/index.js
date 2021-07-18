const router = require('express').Router();
//var mongoose = require('mongoose');
const mods = require('./modfmea');
const parallel = require('async/parallel');
const streamWorker = require('stream-worker');
const Promise = require('bluebird');


//

const View = require('./View');
View(router, mods);

router.param('fmeadoc', function (req, res, next, fmea) {
    req.id = fmea;
    return next();
});
router.get('/fmeaPrint/:fmeadoc', async function (req, res, next) {
    try {
        let retorno = [];
        for (const q in mods.modelsexports) {
            await mods.modelsexports[q].find({"path_": {$regex: RegExp(`^fmeadocs:${req.id}.*`)}}).then(docs => {
                retorno = [...retorno, ...docs];
            }, err => {
            });
        }
        return res.json({list: retorno});
    } catch (e) {
        next();
        //(e) => { return res.sendStatus(404).json(e); }
    }
});
//


router.param('tipo', function (req, res, next, tipo) {
    req.tipo = tipo;
    if (!Object.keys(mods).includes(tipo))
        return res.sendStatus(400);
    req.orm = mods[tipo];
    req.parentOrm = mods[mods._meta_.modelList[tipo.toLowerCase()].parent];
    return next();
});
router.param('id', function (req, res, next, id) {
    req.id = id;
    const {tipo} = req.params;
    if (!Object.keys(mods).includes(tipo))
        return res.sendStatus(400);
    return mods[tipo].findById(id).then((obj) => {
        req.obj = obj;
        req.orm = mods[tipo];
        return next();
    }).catch(
        () => next()
        //(e) => { return res.sendStatus(404).json(e); }
    );
});

router.patch('/reparent/:tipo', function (req, res, next) {
    // console.log(req.body);
    // console.log(mods);
    let type = req.body.type;
    let dragId = req.body.dragId;
    let dropId = req.body.dropId;

    return Promise.all([
        // 1: obtém obj
        mods[type].findById(dragId).exec(),
        // 2: obtém novo_pai
        mods[type].findById(dropId).exec(),
    ]).then(function (results) {
        let [dragObj, dropObj] = results;
        let dragPath = dragObj.path ? dragObj.path + '' : '';
        // let dragParent_ = dragPath.replace(/^(.*)([#]?[^#]{24})$/, "$1");
        let dropPath = dropObj.path ? dropObj.path + '' : '';
        let newDragPath = dropPath + '#' + dragId;
        console.log({dropPath, newDragPath});
        // 3: valida filiação
        if (dropPath.match(`^${dragPath}`))
            throw ('Um item não pode ser movido para nenhum de seus decendentes');
        // 4: atualiza a classe
        dragObj.parent = dropId;
        // // Abordagem com fastq
        // // const worker = function (arg, cb) {
        // //     arg.then((data) => cb(undefined, data), (err) => cb(err)).catch((err) => cb(err));
        // // };
        // // var queue = require('fastq')(worker, 10);
        // // const cb = function(err,data){};
        // // queue.push(dragObj.save(),cb);
        return dragObj.save().then(() => {
            // 5: atualiza todas as classes
            let tasklist = [];
            for (let k in mods.modelsexports) {
                if ((mods.modelsexports[k]) &&
                    mods.modelsexports[k].collection &&
                    typeof mods.modelsexports[k] === 'function') {
                    tasklist.push((terminou) => updateChildPaths(
                        dragPath, newDragPath, mods.modelsexports[k], terminou));
                }
            }
            parallel(tasklist, (err, results) => {
                return list(req, res, next);
            });
        });
    });
});

// parametros adicionais são passados após '?'
router.all('/:tipo', async function (req, res, next) {
    const {tipo, orm, parentOrm} = req;
    switch (req.method) {
        case 'POST': // independente, 201
            // return parentOrm.findById(req.body.parent).then((parent)=>{
            let objBody = req.body;
            if (!objBody.parent_)
                objBody.parent_ = undefined;
            let obj = new orm(objBody);
            // parent.children.push(obj);
            return obj.save().then(async () => {
                //console.log(obj);
                if (tipo === 'fmeaDocs') {
                    await criaTemplate(obj);
                }
                return res.status(201).json(obj.toJSON());
            }).catch(next);
        // }).catch(next);
        case 'GET': // independente 200
            return list(req, res, next);
        //case 'HEAD':// voltado para consultas pode
        default:
            return res.status(400).json({tipo, method: req.method});
    }
});

const criaTemplate = async (fmeadoc) => {
    let template = [
        {
            name: 'Ocorrência', children: [
                {name: "1", nome: "remota", descr: "uma peça em 1500000 produzidas"},
                {name: "2", nome: "muito baixa", descr: "uma peça em 150000 produzidas"},
                {name: "3", nome: "baixa", descr: "uma peça em 150000 produzidas"},
                {name: "4", nome: "baixa-moderada", descr: "uma peça em 2000 produzidas"},
                {name: "5", nome: "moderada", descr: "uma peça em 400 produzidas"},
                {name: "6", nome: "moderada", descr: "uma peça em 80 produzidas"},
                {name: "7", nome: "média-alta", descr: "uma peça em 20 produzidas"},
                {name: "8", nome: "alta", descr: "uma peça em 8 produzidas"},
                {name: "9", nome: "muito alta", descr: "uma peça em 3 produzidas"},
                {name: "10", nome: "extremamente alta", descr: "uma peça em 2 produzidas"},
            ]
        },
        {
            name: 'Severidade', children: [
                {name: "1", nome: "remota", descr: "Efeito imperceptível sobre o produto/processo"},
                {
                    name: "2",
                    nome: "muito baixa",
                    descr: "Cliente exigente pode perceber a falha mas não dará muita importância"
                },
                {
                    name: "3",
                    nome: "baixa",
                    descr: "Esta falha provocará pequena insatisfação no cliente. Retrabalho em menos de 100% das peças"
                },
                {
                    name: "4",
                    nome: "baixa-moderada",
                    descr: "Pode haver necessidade de seleção e retrabalho em 100% das peças"
                },
                {
                    name: "5",
                    nome: "moderada",
                    descr: "Cliente experimenta alguma insatisfação, nível reduzido no desempenho do produto, 100% de retrabalho"
                },
                {
                    name: "6",
                    nome: "moderada",
                    descr: "Cliente insatisfeito, possível desconforto, provável sucateamento de algumas peças"
                },
                {
                    name: "7",
                    nome: "média-alta",
                    descr: "Cliente insatisfeito, desconforto, desempenho sensivelmente reduzido, provável sucateamento de várias peças"
                },
                {
                    name: "8",
                    nome: "alta",
                    descr: "Grande insatisfação do cliente, pode levar à inoperância, sucateamento quase 100%, segurança ainda não afetada"
                },
                {
                    name: "9",
                    nome: "muito alta",
                    descr: "Falha afeta segurança ou infringe a lei, provoca danos pessoais ou a bens, falha ocorre com advertência"
                },
                {
                    name: "10",
                    nome: "extremamente alta",
                    descr: "Afeta segurança ou infringe a lei, provoca danos pessoais ou a bens, falha ocorre sem advertência"
                },
            ]
        },
        {
            name: 'Detecção', children: [
                {name: "1", nome: "quase certa", descr: "detecção em 95-100% dos casos"},
                {name: "2", nome: "muito alta", descr: "detecção em 85-94% dos casos"},
                {name: "3", nome: "alta", descr: "detecção em 75-84% dos casos"},
                {name: "4", nome: "moderadamente alta", descr: "detecção em 65-74% dos casos"},
                {name: "5", nome: "moderada", descr: "detecção em 55-64% dos casos"},
                {name: "6", nome: "moderada", descr: "detecção em 45-54% dos casos"},
                {name: "7", nome: "média-alta", descr: "detecção em 35-44% dos casos"},
                {name: "8", nome: "alta", descr: "detecção em 25-34% dos casos"},
                {name: "9", nome: "muito alta", descr: "detecção em 15-24% dos casos"},
                {name: "10", nome: "extremament alta", descr: "detecção em 0-14% dos casos"},
            ]
        },
        {
            name: 'RPN', children: [
                {name: "até 20", nome: "Muito Baixo", descr: "Muito Baixo"},
                {name: "até 50", nome: "Baixo", descr: "Baixo"},
                {name: "até 100", nome: "Médio", descr: "Médio"},
                {name: "até 250", nome: "Alto", descr: "Alto"},
                {name: "até 500", nome: "Muito Alto", descr: "Muito Alto"},
                {name: "> 500", nome: "Extremamente Alto", descr: "Extremamente Alto"},
            ]
        },
    ];
    //let add1 = await mods.modelsexports.fmeaindexes.insertMany([]);
    Promise.map(template, async (it) => {
        let ixs = new mods.fmeaIndexexs({name: it.name, parent_: fmeadoc._id});
        await ixs.save();
        
    }).then(r => r);

};

router.all('/:tipo/:id', function (req, res, next) {
    const {tipo, id, obj, orm} = req;
    switch (req.method) {
        case 'PUT'://200/201
            if (obj) {
                let _obj = new orm(req.body);
                return _obj.save().then(() => {
                    return res.status(201).json(_obj.toJSON());
                }).catch(next);
            } else {
                return obj.update(req.body).then((_obj) => {
                    return res.json(_obj.toJSON());
                }).catch(next);
            }
        case 'DELETE'://204
            if (obj) {
                let tasklist = [];
                for (let k in mods.modelsexports) {
                    if ((mods.modelsexports[k]) &&
                        mods.modelsexports[k].collection &&
                        typeof mods.modelsexports[k] === 'function') {
                        tasklist.push((terminou) => deleteChildPaths(
                            obj.path__, mods.modelsexports[k], terminou));
                    }
                }
                parallel(tasklist, (err, results) => {
                    return res.json({...ret, ok: 'removido'});
                });
            } else
                return res.json({...ret, err: 'obj inexistente'});
        case 'PATCH':
            return itemPatch(req, res, next);
        case 'GET': // recurso deve existir ou não, 200
            if (obj)
                return res.json(obj.toJSON());
        // case 'HEAD':// voltado para consultas rápidas
        default:
            return res.status(obj ? 400 : 404).json({
                tipo, id,
                method: req.method,
                obj: obj ? obj.toJSON() : null
            });
    }
});


const updateChildPaths = (pathToReplace, replacementPath, typeMod, callBack) => {
    const childConditions = {
        path__: {$regex: RegExp(`${pathToReplace}.+`)},
    };

    const childStream = typeMod.collection.find(childConditions).stream();

    const onStreamData = (childDoc, done) => {
        const newChildPath =
            childDoc.path__.replace(pathToReplace, replacementPath);

        typeMod.collection
            .updateMany({_id: childDoc._id}, {$set: {path__: newChildPath}})
            .then(() => done());
    };

    const streamWorkerOptions = {
        promises: false,
        concurrency: 5,
    };

    streamWorker(
        childStream,
        onStreamData,
        streamWorkerOptions,
        callBack, // callBack(err)
    );
};

const deleteChildPaths = (pathToReplace, typeMod, callBack) => {
    const childConditions = {
        path__: {$regex: RegExp(`^${pathToReplace}`)},
    };
    typeMod.collection.remove(childConditions)
        .then(() => callBack(), () => {
        });
};
const itemPatch = async (req, res, next) => {
    return orm.updateOne({_id: id}, {$set: req.body}).then((r) => {
        // if (op.get(req, 'body.severityValue') || op.get(req, 'body.occurrenceValue') || op.get(req, 'body.detectionValue')) {
        //     switch (req.tipo) {
        //         case 'fmeaFailModes':
        //             if (op.get(req, 'body.occurrenceValue')) {
        //
        //             }
        //         case 'fmeaFailEffects':
        //             if (op.get(req, 'body.severityValue')) {
        //
        //             }
        //         case 'fmeaFailCauses':
        //             if (op.get(req, 'body.detectionValue')) {
        //
        //             }
        //         default:
        //
        //     }
        // }
        return res.json(r);
    });
};


const list = (req, res, next) => {
    const {tipo, id, obj, orm} = req;
    var query = {$or: [{"__del": null}, {"__del": ""}, {"__del": 0}]};
    if (req.query.parent_)
        query = {
            $and: [query,
                {"parent_": req.query.parent_}]
        };
    return Promise.all([
        orm.find(query)
            .limit(Number(req.query.limit || 200))
            .skip(Number(req.query.offset || 0))
            // .populate('author')
            .exec(),
        orm.count(query)
    ]).then(function (results) {
        return res.json({
            parent: req.query.parent_,
            list: results[0].map((obj) => {
                return obj.toJSON();
            }),
            count: results[1]
        });
    }).catch(next);
};


module.exports = router;