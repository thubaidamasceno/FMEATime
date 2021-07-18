import {ASYNC_START} from '../../constants/actionTypes';
import {fields_new} from './modconf';
import {
    ADD_TAGUSUARIO,
    ADD_USRUPDATE,
    APPLY_TAG_FILTERUSUARIO,
    CHANGE_TABUSUARIO,
    DELETE_USRUPDATE,
    DELETE_USUARIO,
    EDITOR_PAGE_LOADEDUSUARIO,
    EDITOR_PAGE_UNLOADEDUSUARIO,
    HOME_PAGE_LOADEDUSUARIO,
    HOME_PAGE_UNLOADEDUSUARIO,
    PROFILE_FAVORITES_PAGE_LOADEDUSUARIO,
    PROFILE_FAVORITES_PAGE_UNLOADEDUSUARIO,
    PROFILE_PAGE_LOADEDUSUARIO,
    PROFILE_PAGE_UNLOADEDUSUARIO,
    REMOVE_TAGUSUARIO,
    SET_PAGEUSUARIO,
    UPDATE_FIELD_EDITORUSUARIO,
    USUARIO_FAVORITED,
    USUARIO_PAGE_LOADED,
    USUARIO_PAGE_UNLOADED,
    USUARIO_SERVEACTED,
    USUARIO_SUBMITTED,
    USUARIO_UNFAVORITED
} from './actionTypes';

export const usuarioCommon = (state = {}, action) => {
    switch (action.type) {
        case USUARIO_SUBMITTED:
            const redirectUrl = `/usuario/${action.payload.user.username}`;
            return {...state, redirectTo: redirectUrl};
        case DELETE_USUARIO:
            return {...state, redirectTo: '/usuario'};
        default:
            return null;
    }
};
const expd = (state = {}, action) => {
    switch (action.type) {
        case USUARIO_FAVORITED:
        case USUARIO_SERVEACTED:
            if (action.payload)
                switch (action.payload.act) {
                    case 'confirmacadastro':
                        if (action.payload.error) {
                            window.alert(`Esse nome de usuário é inválido ${
                                action.payload.username}. Tente outro.`);

                            return {...state,};
                        } else {

                            let r = [];
                            let slg = action.payload.username;
                            for (let i = 0; i < state.usuarios.length; i++)
                                if (state.usuarios[i].username !== slg)
                                    r = [...r, state.usuarios[i]];
                            window.alert(`Por favor anote a nova senha de ${
                                action.payload.username}: ${action.payload.newpass}`);
                            return {
                                ...state,
                                usuarios: r,
                            };
                        }
                    case 'delpedido':
                    case 'deluser':
                        let r = [];
                        let slg = action.payload.username;
                        for (let i = 0; i < state.usuarios.length; i++)
                            if (state.usuarios[i].username !== slg)
                                r = [...r, state.usuarios[i]];
                        return {
                            ...state,
                            usuarios: r,
                        };
                    case 'changepass':
                        window.alert(`Por favor anote a nova senha de ${
                            action.payload.username}: ${action.payload.newpass}`);
                        return {...state,};
                    default:
                }
            return {...state,};
        case USUARIO_UNFAVORITED:
            return {
                ...state,
                usuarios: state.usuarios.map(usuario => {
                    if (usuario.username === action.payload.user.username) {
                        return {
                            ...usuario,
                            favorited: action.payload.user.favorited,
                            favoritesCount: action.payload.user.favoritesCount
                        };
                    }
                    return usuario;
                })
            };
        case SET_PAGEUSUARIO:
            if (action.payload)
                return {
                    ...state,
                    usuarios: action.payload.users,
                    usuariosCount: action.payload.usersCount,
                    currentPage: action.page
                };
            return {
                ...state,
                usuarios: [],
                usuariosCount: 0,
                currentPage: action.page
            };
        case APPLY_TAG_FILTERUSUARIO:
            return {
                ...state,
                pager: action.pager,
                usuarios: action.payload.users,
                usuariosCount: action.payload.usersCount,
                tab: null,
                tag: action.tag,
                currentPage: 0
            };
        case HOME_PAGE_LOADEDUSUARIO:
            return {
                ...state,
                pager: action.pager,
                tags: [],
                usuarios: action.payload[0].users,
                usuariosCount: action.payload[0].usersCount,
                currentPage: 0,
                tab: action.tab
            };
        case HOME_PAGE_UNLOADEDUSUARIO:
            return {};
        case CHANGE_TABUSUARIO:
            return {
                ...state,
                pager: action.pager,
                usuarios: (action.payload) ? action.payload.users : [],
                usuariosCount: (action.payload) ? action.payload.usersCount : 0,
                tab: action.tab,
                currentPage: 0,
                tag: null
            };
        case PROFILE_PAGE_LOADEDUSUARIO:
        case PROFILE_FAVORITES_PAGE_LOADEDUSUARIO:
            return {
                ...state,
                pager: action.pager,
                usuarios: action.payload[1].usuarios,
                usuariosCount: action.payload[1].usuariosCount,
                currentPage: 0
            };
        case PROFILE_PAGE_UNLOADEDUSUARIO:
        case PROFILE_FAVORITES_PAGE_UNLOADEDUSUARIO:
            return {};
        case EDITOR_PAGE_LOADEDUSUARIO:
            let ldd = {};
            for (let k in fields_new) {
                let p = fields_new[k].prop;
                ldd[p] = action.payload ? action.payload.user[p] : '';
            }
            if (action.payload) {
            } else {
            }
            return {
                ...state,
                ...ldd,
                tagInput: '',
                tagList: action.payload ? action.payload.user.tagList : []
            };
        case EDITOR_PAGE_UNLOADEDUSUARIO:
            return {};
        case USUARIO_SUBMITTED:
            const redirectUrl = `/usuario/${action.payload.user.username}`;
            return {
                ...state,
                inProgress: null,
                errors: action.error ? action.payload.errors : null, redirectTo: redirectUrl
            };
        case ADD_TAGUSUARIO:
            return {
                ...state,
                tagList: state.tagList.concat([state.tagInput]),
                tagInput: ''
            };
        case REMOVE_TAGUSUARIO:
            return {
                ...state,
                tagList: state.tagList.filter(tag => tag !== action.tag)
            };
        case UPDATE_FIELD_EDITORUSUARIO:
            return {...state, [action.key]: action.value};
        case USUARIO_PAGE_LOADED:
            return {
                ...state,
                usuario: action.payload[0].user,
                usrupdates: {}//action.payload[1].usrupdates
            };
        case USUARIO_PAGE_UNLOADED:
            return {};
        case ADD_USRUPDATE:
            return {
                ...state,
                usrupdateErrors: action.error ? action.payload.errors : null,
                usrupdates: action.error ?
                    null :
                    (state.usrupdates || []).concat([action.payload.usrupdate])
            };
        case DELETE_USRUPDATE:
            const usrupdateId = action.usrupdateId;
            return {
                ...state,
                usrupdates: state.usrupdates.filter(usrupdate => usrupdate.id !== usrupdateId)
            };
        case ASYNC_START:
            if (action.subtype === USUARIO_SUBMITTED) {
                return {...state, inProgress: true};
            }
            return state;
        default:
            return state;
    }
};

export default expd;