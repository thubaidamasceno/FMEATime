import produce from "immer"
import {ASYNC_START} from '../../constants/actionTypes';
import reduceReducers from 'reduce-reducers';
import 'object-path';
import _ from 'lodash';
import {rh, rt} from "../../agent";
import {
    Act, at, modelList, pathfier, txt
} from './modconf';
import * as im from 'object-path-immutable';
import * as op from 'object-path';

export const apiActs = {
    create: p => {
        if (modelList[p.type].name)
            return rt(rh('post', `/fmeas2/v1/${modelList[p.type].name + 's'}`, p.body));
        throw 'type is required';
    },
    update: p => {
        // const id = op.get(p, 'id');
        // return requests.get(`/fmeas/get${p.id ? '/' + p.id : ''}`);
    },
    delete: p => {
        if (modelList[p.type].name && p.id)
            return rt(rh('del', `/fmeas2/v1/${modelList[p.type].name + 's'}${p.id ? '/' + p.id : ''}`));
        throw 'ID and type is required';
    },
    list: p => {
        if (p.type)
            return rt(rh('get', `/fmeas2/v1/${modelList[p.type].name + 's'}`)
                .query({parent_: p.parent_}));
        throw 'type is required';
    },
    get: p => {
        if (p.type && p.id)
            return rt(rh('get', `/fmeas2/v1/${modelList[p.type].name + 's'}${p.id ? '/' + p.id : ''}`)
                .query({parent: p.parent}))
                .query({full: p.full || false});
        throw 'ID and type is required';
    },
    fmeaPrint: p => {
        if (p.id)
            return rt(rh('get', `/fmeas2/v1/fmeaPrint${p.id ? '/' + p.id : ''}`));
        throw 'ID is required';
    },
    patch: p => {
        if (modelList[p.type].name && p.id)
            return rt(rh('patch', `/fmeas2/v1/${modelList[p.type].name + 's'}${p.id ? '/' + p.id : ''}`, p.body));
        throw 'ID and type is required';
    },
    reparent: p => {
        if (p.body && p.body.type)
            return rt(rh('patch', `/fmeas2/v1/reparent/${modelList[p.body.type].name + 's'}`, p.body));
        throw 'type is required';
    },
};

export const fmeacommon = (state = {}, action) => {
    switch (action.type) {
        case at.FMEA2_WAITING:
            return {...state};
        default:
            return null;
    }
};

export const defaultState = (() => {
    let ds = {
        tree: [],
        dirty: false,
        edittree: false,
        edititem: false,
        switchdisabled: false,
        checked: false,
        deleting: false,
        renaming: false,
        itemchecked: false,
        itemswitchdisabled: false,
        funcs: {},
        //
        modviews: {
            ...modelList,
            root: {title: () => 'FMEAs', _: ['fmeaDoc']},
        },
        data: {
            fmeadocs_loaded: false,
            fmeadocs_dirty: false,
            fmeadocs: {},
        },
        databkp: {},
        app: {
            crumbs: {},
            crumbList: [],
            activeView: 'root',
            renameDialog: {
                renameText: '',
            },
        }
    };
    return ds;
})();


const reducerBase = (state = defaultState, action) => {
    switch (action.type) {
        // case at.FMEA2_LOADED:
        //     return {
        //         ...state,
        //         fmeas: action.payload || [],
        //     };
        case  at.FMEA2_UNLOADED  :
            return {};
        case  at.FMEA2_CHANGETREE  :
            return {
                ...state,
                dirty: true,
                tree: action.tree
            };
        case   at.FMEA2_ACT:
            let act = action.p ? action.p.act : '';
            let fmea, fmeas, value;
            switch (act) {
                case 'get':
                    fmea = action.payload ? action.payload : null;
                    let tree = fmea ? fmea.tree : [];
                    let name = fmea ? fmea.name : '';
                    value = {value: op.get(fmea, 'id'), label: op.get(fmea, 'name')};
                    return {
                        ...state,
                        fmea,
                        tree,
                        name,
                        id: op.get(fmea, 'id'),
                        value,
                        dirty: false,
                        hasData: fmea ? true : false,
                    };
                case 'new':
                    if (action.payload) {
                        value = {value: op.get(action.payload, 'id'), label: op.get(action.payload, 'name')};
                        return {
                            ...state,
                            isLoading: false,
                            dirty: false,
                            femeas: [...state.fmeas, value],
                            value,
                            id: op.get(value, 'id'),
                        }
                    } else return {
                        ...state,
                        dirty: false,
                        isLoading: false,
                    };
                // case 'rename':
                //     fmea = state.fmea;
                //     fmea.name = state.name;
                //     fmeas = action.payload ? action.payload : [];
                //     value = {value: op.get(state.value, 'value'), label: state.renameText};
                //     return {
                //         ...state,
                //         fmeas,
                //         fmea,
                //         value,
                //         dirty: false,
                //         renaming: false,
                //         invalidRename: true,
                //     };
                case 'save':
                    fmea = state.fmea;
                    fmea.tree = state.tree;
                    return {
                        ...state,
                        fmea,
                        dirty: false,
                    };
                case 'askRename':
                    return {
                        ...state,
                        renaming: true,
                        invalidRename: true,
                        renameText: state.name
                    };
                // case 'edittree':
                //     let checked = state.checked,
                //         _checked = op.get(action, 'p.checked');
                //     return {...state, checked,};
                case 'check':
                    let checked = state.checked,
                        _checked = op.get(action, 'p.checked');
                    checked = _checked;
                    return {...state, checked,};
                case 'itemcheck':
                    return {
                        ...state,
                        itemchecked: op.get(action, 'p.itemchecked',)
                    };

                case 'validRename':
                    return {
                        ...state,
                        invalidRename: !(action.payload && action.payload.isValid),
                    };
                case 'askDelete':
                    return {
                        ...state,
                        deleting: true,
                    };
                case 'itemChanged':
                    return {
                        ...state,
                        itemDirty: true,
                    };
                case 'list':
                case 'duplicate':
                case 'delete':
                    fmeas = action.payload ? action.payload : [];
                    return {
                        ...state,
                        fmeas,
                        deleting: false,
                        renaming: false,
                        renameText: '',
                        id: null,
                        value: null,
                        fmea: null,
                        tree: [],
                        name: '',
                        dirty: false,
                        hasData: false,
                    };
                case 'renameClose':
                    return {
                        ...state,
                        renaming: false,
                    };
                case 'deleteClose':
                    return {
                        ...state,
                        deleting: false,
                    };
                default:
                    return state;
            }
        case  ASYNC_START:
            if (action.subtype === at.FMEA2_WAITING) {
                return {...state, inProgress: true};
            }
            return state;
        case  at.FMEA2_NODECLICK:
            if (!state.itemDirty)
                return {
                    ...state,
                    edititem: !!action.treedata,
                    checked: !!action.treedata,
                    treedata: action.treedata,
                }; else return state;
        case  at.FMEA2_UPDATEFIELD:
        default:
            return state;
    }
};

const reducerPost = produce((stt, action) => {
    //
    stt.hasData = !!op.get(stt, 'id');
    stt.edittree = (stt.checked && !stt.edititem);
    stt.checked = stt.edittree;
    stt.edititem = (stt.itemchecked && !stt.edittree);
    stt.itemchecked = stt.edititem;
    stt.switchdisabled = (stt.dirty || !stt.hasData || stt.edititem);
    stt.itemswitchdisabled = (stt.dirty || stt.itemDirty || !stt.hasData || stt.edittree);
    //

    // switch (action.type) {
    //     case at.FMEA2_LOADED:
    //         // stt = im.merge(stt, 'xxx', im.get(action, 'payload.list'));
    //         stt.xxx = 'yyy';
    // }
    //
}, defaultState);

const replaceDataList = (draft, list, remove) => {
    if (remove)
        op.del(draft, remove);
    list.sort((a, b) => {
        if (a.path__.split(/[.:\/#]/).length < b.path__.split(/[.:\/#]/).length) {
            return -1;
        }
        if (a.path__.split(/[.:\/#]/).length > b.path__.split(/[.:\/#]/).length) {
            return 1;
        }
        return 0;
    });
    list.map(d => {
        let pathx = d.path__.split('#');
        let path__ = pathx[0];
        for (let i = 1; i < pathx.length; i++) {
            path__ = path__ + '.childs';
            let x = op.get(draft.data, path__.split(/[.:\/#]/));
            if (!x || x === [])
                op.set(draft.data, path__.split(/[.:\/#]/), {});
            path__ = path__ + '.' + pathx[i];
        }
        op.set(draft.data, path__.split(/[.:\/#]/), d);
    });
    return draft;
};
const importDataList = (draft, list) => {
    list.sort((a, b) => {
        if (a.path__.length < b.path__.length) {
            return -1;
        }
        if (a.path__.length > b.path__.length) {
            return 1;
        }
        return 0;
    });
    list.forEach(d => {
        let pathx = pathfier(d.path__);
        let path__ = pathx[0];
        for (let i = 1; i < pathx.length; i++) {
            let x = op.get(draft.data, path__.split(/[.:\/#]/), []);
            if (!x || x.length === 0)
                op.set(draft.data, path__.split(/[.:\/#]/), {});
            path__ = path__ + '.' + pathx[i];
        }
        op.set(draft.data, pathfier(d.path__), d);
    });
    return draft;
};
const immerReducers2 = produce((draft, action) => {
        switch (action.type) {
            case Act.printFMEA:
            case at.FMEA2_LOADED:
                return importDataList(draft, im.get(action, 'payload.list', []));
            case at.FMEA2_ACT:
                let act = action.p ? action.p.act : '', v = {};
                switch (act) {
                    case 'restoreCrumb':
                        v.viewKey = im.get(action, 'p.viewKey');
                        if (v.viewKey) {
                            op.set(draft, 'app.activeView', v.viewKey);
                            op.set(draft, 'app.crumbList',
                                im.get(draft, `app.crumbs.${v.viewKey}.restore`));
                        }
                        return;
                    case 'select':
                        draft.modviews[im.get(action, 'p.viewKey')].active = im.get(action, 'p.id');
                        draft.modviews[im.get(action, 'p.viewKey')].active__ = im.get(action, 'p.path__');
                        return;
                    case 'reparent':
                        return replaceDataList(draft, im.get(action, 'payload.list', []),
                            pathfier('data.' + im.get(action, 'p.body.dragPath__')));
                    case 'dlgRename':
                        let name = op.get(draft.data, (im.get(action, 'p.path__', '') + '/name').split(/[.:\/#]/));
                        draft = im.merge(draft, 'app.renameDialog', {
                            renaming: true,
                            //invalidRename: true,
                            renameText: name,
                            type: im.get(action, 'p.type'),
                            path__: im.get(action, 'p.path__'),
                            id: im.get(action, 'p.id'),
                            txt: `Renomear '${name}' como`,
                            clickYes: im.get(action, 'p.clickYes')
                        });
                        return draft;
                    case 'dlgDelete':
                        v.name = op.get(draft.data, (im.get(action, 'p.path__', '') + '/name').split(/[.:\/#]/));
                        draft = im.merge(draft, 'app.deleteDialog', {
                            deleting: true,
                            //invalidRename: true,
                            renameText: v.name,
                            type: im.get(action, 'p.type'),
                            path__: im.get(action, 'p.path__'),
                            id: im.get(action, 'p.id'),
                            txt: `Realmente deseja apagar '${v.name}'? Essa operação é irreversível!`,
                            clickYes: im.get(action, 'p.clickYes')
                        });
                        return draft;
                    case 'dlgCreate':
                        v.name = op.get(draft.data, (im.get(action, 'p.path__', '') + '/name').split(/[.:\/#]/));
                        draft = im.merge(draft, 'app.renameDialog', {
                            renaming: true,
                            //invalidRename: true,
                            renameText: v.name,
                            type: im.get(action, 'p.type'),
                            // parentPath__: im.get(action, 'p.parentPath__'),
                            // parentId: im.get(action, 'p.parentId'),
                            parent_: im.get(action, 'p.parent_'),
                            txt: `Digite o nome`,
                            clickYes: im.get(action, 'p.clickYes')
                        });
                        return draft;
                    case 'view':
                        v.name = im.get(action, 'p.type');
                        v.viewKey = im.get(action, 'p.viewKey ');
                        v.crumbKey = im.get(draft, 'app.activeView');
                        //
                        draft.app.crumbs[v.crumbKey] = {
                            title: modelList[v.name].title(txt.n.p, txt.c.c),
                            restore: [...draft.app.crumbList]
                        };
                        draft.app.crumbList.push(v.crumbKey);
                        //
                        if (v.name) {
                            op.set(draft, 'app.activeView', v.name);
                        }
                        if (v.viewKey)
                            op.set(draft, `modviews.${v.viewKey}.parent_`, im.get(action, 'p.parent_'));
                        return;//draft;
                    case 'renameClose':
                        op.set(draft, 'app.renameDialog.renaming', false);
                        return;//draft;
                    case 'deleteClose':
                        op.set(draft, 'app.deleteDialog.deleting', false);
                        return;//draft;
                    case 'changeRename':
                        op.set(draft, 'app.renameDialog.renameText',
                            im.get(action, 'p.name'));
                        return;//draft;
                    case 'rename':
                        if (im.get(action, 'payload.ok')) {
                            draft = im.merge(draft, ('data.' + im.get(action, 'p.path__')).split(/[.:\/#]/), im.get(action, 'p.body'));
                            draft = im.set(draft, 'app.renameDialog', {});
                        }
                        return draft;
                    case 'inlineEdit':
                        let hasbkp = op.get(draft, pathfier('data_hasbkp.' + im.get(action, 'p.local.path__', false)));
                        let newvalue = im.get(action, 'p.value', '');
                        let oldvalue = im.get(draft.data, pathfier(im.get(action, 'p.local.path__', '')), '');
                        if (!hasbkp) {
                            op.set(draft, pathfier('data_bkp.' + im.get(action, 'p.local.path__', '')),
                                oldvalue);
                            op.set(draft, pathfier('data_hasbkp.' + im.get(action, 'p.local.path__', '')), true);
                        } else {
                            oldvalue = op.get(draft, pathfier('data_bkp.' + im.get(action, 'p.local.path__', '')));
                        }
                        let hasChanged = (newvalue != oldvalue);
                        op.set(draft.data, pathfier(im.get(action, 'p.local.path__', '')),
                            newvalue);
                        op.set(draft, pathfier('data_haschanged.' + im.get(action, 'p.local.path__', '')),
                            hasChanged);
                        return;//draft;
                    case 'inlineReset':
                        let oldvalue2 = op.get(draft, pathfier('data_bkp.' + im.get(action, 'p.local.path__', '')));
                        op.set(draft, pathfier('data_bkp.' + im.get(action, 'p.local.path__', '')), undefined);
                        op.set(draft, pathfier('data_hasbkp.' + im.get(action, 'p.local.path__', '')), false);
                        op.set(draft.data, pathfier(im.get(action, 'p.local.path__', '')), oldvalue2);
                        op.set(draft, pathfier('data_haschanged.' + im.get(action, 'p.local.path__', '')), false);
                        return;//
                    case 'inlineSave':
                        op.set(draft, pathfier('data_bkp.' + im.get(action, 'p.local.path__', '')), undefined);
                        op.set(draft, pathfier('data_hasbkp.' + im.get(action, 'p.local.path__', '')), false);
                        op.set(draft, pathfier('data_haschanged.' + im.get(action, 'p.local.path__', '')), false);
                        return;//draft;
                    case 'create':
                        draft = importDataList(draft, [action.payload,]);
                        op.set(draft, 'app.renameDialog', {});
                        // draft = im.set(
                        //     draft, ('data.' + im.get(action, 'payload.path__')).split(/[.:\/#]/), action.payload);
                        return draft;
                    case 'delete':
                        draft = im.del(
                            draft, pathfier('data.' + im.get(action, 'p.path__')));
                        draft = im.set(draft, 'app.deleteDialog', {});
                        return draft;
                    default:
                        // window.alert(`ação desconhecida ${act}`);
                        return draft;
                }
        }
        return draft;
    },
    defaultState
    )
;

const Reducers1 = ((draft = defaultState, action) => {
    // console.log(draft);
    switch (action.type) {
        case at.FMEA2_LOADED:
            // draft = im.merge(draft, 'databkp', im.get(action, 'payload.list'));
            // draft.databkp.map(d=>{
            //     draft.data[d._id] = d;
            //     return null;
            // });
            return draft;
        default:
            return draft;
    }
});

export const fmea2 = reduceReducers(defaultState, (state = defaultState, action) => {
        let stt = reducerBase(state, action);
        // stt = reducerPost(stt, action);
        return stt;
    }
    , reducerPost
    , Reducers1
    , immerReducers2
);