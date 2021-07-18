import {ASYNC_START} from '../../constants/actionTypes';
import {fields_new}  from './modconf';
import {
    ADD_UPLINK,
    DELETE_UPLINK,
    UPLOAD_PAGE_LOADED,
    UPLOAD_PAGE_UNLOADED,
    ADD_TAGUPLOAD,
    EDITOR_PAGE_LOADEDUPLOAD,
    EDITOR_PAGE_UNLOADEDUPLOAD,
    REMOVE_TAGUPLOAD,
    UPDATE_FIELD_EDITORUPLOAD,
    UPLOAD_SUBMITTED,
    HOME_PAGE_LOADEDUPLOAD,
    HOME_PAGE_UNLOADEDUPLOAD,
    APPLY_TAG_FILTERUPLOAD,
    CHANGE_TABUPLOAD,
    PROFILE_FAVORITES_PAGE_LOADEDUPLOAD,
    PROFILE_FAVORITES_PAGE_UNLOADEDUPLOAD,
    PROFILE_PAGE_LOADEDUPLOAD,
    PROFILE_PAGE_UNLOADEDUPLOAD,
    SET_PAGEUPLOAD,
    UPLOAD_FAVORITED,
    UPLOAD_SERVEACTED,
    DELETE_UPLOAD
} from './actionTypes';

export const uploadCommon = (state = {}, action) => {
    switch (action.type) {
        case UPLOAD_SUBMITTED:
            var redirectUrl = `/upload/${action.payload.upload.slug}`;
            return {...state, redirectTo: redirectUrl};
        case DELETE_UPLOAD:
            return {...state, redirectTo: '/upload'};
        default:
            return null;
    }
};
const expd = (state = {}, action) => {
    switch (action.type) {
        case UPLOAD_FAVORITED:
        case UPLOAD_SERVEACTED:
            let r=[];
            let slg = action.payload.slug;
            for(let i=0;i<state.uploads.length;i++)
                if(state.uploads[i].slug!==slg)
                    r=[...r,state.uploads[i]];
            return {
                ...state,
                uploads: r,
            };
        case SET_PAGEUPLOAD:
            return {
                ...state,
                uploads: action.payload.uploads,
                uploadsCount: action.payload.uploadsCount,
                currentPage: action.page
            };
        case APPLY_TAG_FILTERUPLOAD:
            return {
                ...state,
                pager: action.pager,
                uploads: action.payload.uploads,
                uploadsCount: action.payload.uploadsCount,
                tab: null,
                tag: action.tag,
                currentPage: 0
            };
        case HOME_PAGE_LOADEDUPLOAD:
            return {
                ...state,
                pager: action.pager,
                tags: action.payload[0].tags,
                uploads: action.payload[1].uploads,
                uploadsCount: action.payload[1].uploadsCount,
                currentPage: 0,
                tab: action.tab
            };
        case HOME_PAGE_UNLOADEDUPLOAD:
            return {};
        case CHANGE_TABUPLOAD:
            return {
                ...state,
                pager: action.pager,
                uploads: action.payload.uploads,
                uploadsCount: action.payload.uploadsCount,
                tab: action.tab,
                currentPage: 0,
                tag: null
            };
        case PROFILE_PAGE_LOADEDUPLOAD:
        case PROFILE_FAVORITES_PAGE_LOADEDUPLOAD:
            return {
                ...state,
                pager: action.pager,
                uploads: action.payload[1].uploads,
                uploadsCount: action.payload[1].uploadsCount,
                currentPage: 0
            };
        case PROFILE_PAGE_UNLOADEDUPLOAD:
        case PROFILE_FAVORITES_PAGE_UNLOADEDUPLOAD:
            return {};
        case EDITOR_PAGE_LOADEDUPLOAD:
            let ldd={};
            for(let k in fields_new){
                let p = fields_new[k].prop;
                ldd[p]=action.payload ? action.payload.upload[p] : '';
            }

            let editando= action.payload?(action.payload.upload.title ? 1:0):0;
            let slug= action.payload?action.payload.upload.slug:'';
            if(action.payload){}else{}
            return {
                ...state,
                ...ldd,
                editando,
                slug,
                tagInput: '',
                tagList: action.payload ? action.payload.upload.tagList : []
            };
        case EDITOR_PAGE_UNLOADEDUPLOAD:
            return {};
        case UPLOAD_SUBMITTED:
            return {
                ...state,
                inProgress: null,
                errors: action.error ? action.payload.errors : null
            };
        case ADD_TAGUPLOAD:
            return {
                ...state,
                tagList: state.tagList.concat([state.tagInput]),
                tagInput: ''
            };
        case REMOVE_TAGUPLOAD:
            return {
                ...state,
                tagList: state.tagList.filter(tag => tag !== action.tag)
            };
        case UPDATE_FIELD_EDITORUPLOAD:
            return {...state, [action.key]: action.value};
        case UPLOAD_PAGE_LOADED:
            return {
                ...state,
                upload: action.payload[0].upload,
                uplinks: action.payload[1].uplinks
            };
        case UPLOAD_PAGE_UNLOADED:
            return {};
        case ADD_UPLINK:
            return {
                ...state,
                uplinkErrors: action.error ? action.payload.errors : null,
                uplinks: action.error ?
                    null :
                    (state.uplinks || []).concat([action.payload.uplink])
            };
        case DELETE_UPLINK:
            const uplinkId = action.uplinkId;
            return {
                ...state,
                uplinks: state.uplinks.filter(uplink => uplink.id !== uplinkId)
            };
        case ASYNC_START:
            if (action.subtype === UPLOAD_SUBMITTED) {
                return {...state, inProgress: true};
            }
            return state;
        default:
            return state;
    }
};


export default expd;