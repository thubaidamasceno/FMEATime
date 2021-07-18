// deve ser importado tanto pelo frontend quanto pelo backend
const g = {
    m: (m, f) => m,
    f: (m, f) => f,
};
const n = {
    s: (s, p) => s,
    p: (s, p) => p,
};
const c = {
    n: (n, c) => n,
    c: (n, c) => c,
    cam: (s) => s[0].toUpperCase() + s.substr(1),
    nor: (s) => s
};

const txt = {
    g, n, c,
    _: undefined,
    //
    _fmea: {gen: g.f},
    FMEA: (num = n.s, cas = c.n, gen = g.f) =>
        `FMEA${num('', 's')}`,
    //
    _part: {gen: g.f},
    part: (num = n.s, cas = c.n, gen = g.f) =>
        `${cas('p', 'P')}eça${num('', 's')}`,
    //
    _prop: {gen: g.f},
    prop: (num = n.s, cas = c.n, gen = g.f) =>
        `${cas('p', 'P')}ropriedade${num('', 's')}`,
    //
    _func: {gen: g.f},
    func: (num = n.s, cas = c.n, gen = g.f) =>
        `${cas('f', 'F')}unç${num('ão', 'ões')}`,
    //
    _failmode: {gen: g.m},
    failmode: (num = n.s, cas = c.n, gen = g.m) =>
        `${cas('m', 'M')}odo${num('', 's')} de ${cas('f', 'F')}alha`,
    //
    _effect: {gen: g.m},
    effect: (num = n.s, cas = c.n, gen = g.m) =>
        `${cas('e', 'E')}feito${num('', 's')}`,
    //
    _cause: {gen: g.f},
    cause: (num = n.s, cas = c.n, gen = g.m) =>
        `${cas('c', 'C')}ausa${num('', 's')}`,
    //
    _control: {gen: g.m},
    control: (num = n.s, cas = c.n, gen = g.m) =>
        `${cas('c', 'C')}ontrole${num('', 's')} ${cas('a', 'A')}tua${num('l', 'is')}`,
    //
    _controlnew: {gen: g.m},
    controlnew: (num = n.s, cas = c.n, gen = g.m) =>
        `${cas('c', 'C')}ontrole${num('', 's')} ${cas('r', 'R')}ecomendado${num('', 's')}`,
    //
    oa: (num = n.s, cas = c.n, gen = g.m) =>
        cas(c.nor, c.cam)(`${gen('o', 'a')}${num('', 's')}`)
};

const modelTree = {
    fmeaDoc: {
        title: txt.FMEA,
        _expand: true,
        _print: true,
        _: {
            fmeaProp: {
                title: txt.prop,
                _f: {value: {type: String, label: "Valor"}},
                _ref: 'props',
            },
            fmeaPart: {
                title: txt.part,
                _isTree: 1,
                _expand: true,
                _: {
                    fmeaPartProp: {
                        title: txt.prop,
                        _f: {value: {type: String, label: "Valor"}},
                        _ref: 'props',
                    },
                    fmeaFunc: {
                        title: txt.func,
                        _ref: 'funcs',
                        _expand: true,
                        _: {
                            fmeaFailMode: {
                                _ref: 'failModes',
                                title: txt.failmode,
                                _f: {
                                    occurrenceValue: {type: Number, label: "Ocorrência", editable: true},
                                    maxSeverityValue: {type: Number, label: "Máxima Severidade", editable: false}
                                },
                                _expand: true,
                                _: {
                                    fmeaFailEffect: {
                                        title: txt.effect,
                                        _f: {severityValue: {type: Number, label: "Severidade", editable: true}},
                                    },
                                    fmeaFailCause: {
                                        title: txt.cause,
                                        _isTree: false, _f: {
                                            detectionValue: {type: Number, label: "Detecção", editable: true},
                                            RPNValue: {type: Number, label: "RPN", editable: false}
                                        },
                                        _expand: true,
                                        _: {
                                            fmeaFailControl: {
                                                title: txt.control,
                                                _f: {newDetectionValue: {type: String, label: "Descrição"}},
                                            },

                                            fmeaFailControlNew: {
                                                title: txt.controlnew,
                                                _f: {newDetectionValue: {type: String, label: "Descrição"}},
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            fmeaIndexex: {
                title: ()=>'Categoria de Índices',
                canAdd: false,
                canDelete: false,
                _ref: 'indexes',
                _isTree: false,
                _expand: true,
                _: {
                    fmeaIndex: {
                        title: ()=>'Índices',
                        _f: {nome: {type: String, label: ""},descr: {type: String, label: "Descrição"}},
                        _ref: 'props',
                    },
                },
            }
        }
    }
};
const expand = (leaf, Parent = '') => {
    let _mlist = {};
    let ordem = 0;
    for (let k in leaf) {
        let clean = {
            ...leaf[k],
            Parent,
            parent: (Parent ? Parent.toLowerCase() + 's' : ''),
            name: k,
            name_: k.toLowerCase() + 's'
        };
        //delete clean._;
        clean._ = (leaf[k]._) ? Object.keys(leaf[k]._) : [];
        clean._order = ordem++;
        _mlist = {..._mlist, [k.toLowerCase() + 's']: clean};
        if (leaf[k] && leaf[k]._) {
            _mlist = {..._mlist, ...expand(leaf[k]._, k)};
        }
    }
    return _mlist;
};
const modelList = expand(modelTree);
// Regras:
// IDs não podem ser alterados
// path_ é composto pelos ID dos pais
// path_ é alterado em cascata na mudança de pai
// path__ é composto pelos path_ dos pais
// path__ é alterado em cascata na mudança de pai

var act = {
    printFMEA: '',
};
for (let k in act)
    act[k] = k;
const Act = act;

var at = {};
[
    'FMEA2_ACT',
    'REDIRECT_TO',
    'FMEA2_UPDATEFIELD',
    'FMEA2_WAITING',
    'FMEA2_LOADED',
    'FMEA2_UNLOADED',
    'FMEA2_CHANGETREE',
    'FMEA2_NODECLICK',
    'FMEA2_ACT_FUNCS',
].map(v => at[v] = v);

const pathfier = (v) => {
    return v.replace(/#/g, '.childs.').split(/[.:\/#]/)
};

module.exports = {modelTree, modelList, at, txt, pathfier, Act};