import React from 'react';
import {connect} from 'react-redux';
// import moment from 'moment';
import TextField from '@material-ui/core/TextField';
import ListErrors from '../../components/ListErrors';
import uploadAgent from './agent';
import {fields_new, t} from './modconf';
import {Link} from 'react-router-dom';
import {
    ADD_TAGUPLOAD,
    EDITOR_PAGE_LOADEDUPLOAD,
    EDITOR_PAGE_UNLOADEDUPLOAD,
    UPLOAD_SUBMITTED,
    REMOVE_TAGUPLOAD,
    UPDATE_FIELD_EDITORUPLOAD
} from './actionTypes';


class Editor extends React.Component {
    constructor() {
        super();

        const updateFieldEvent =
            key => ev => this.props.onUpdateField(key, ev.target.value);

        this.criacampo = (f) => {
            let p = {};
            switch (f.tipo) {
                case 'dt':
                    p = {type: "datetime-local"};
                    break;
                default:
                    p = {type: 'text'};
            }
            return React.createElement('div', {
                    className: 'upload-form-group', ...f.fpar // insere parâmetros no div
                },
                React.createElement(
                    TextField, {
                        className: "upload-form-control",
                        InputLabelProps: {shrink: true},
                        variant: "outlined",
                        value: this.props[f.prop],
                        //diabled: true,
                        onChange: updateFieldEvent(f.prop),
                        label: f.texto,
                        ...p,
                        style: f.istyle,
                        ...f.inpp // insere parâmetros no input
                    }
                ));
        };
        this.cc = (f = {}, add = {}) => {
            var f1 = {};
            if (f)
                f1 = fields_new[f];
            return this.criacampo({...f1, ...add});
        };
        this.criacampos = () => {
            return (
                <form>
                    <div className="upload-form">
                        {this.cc('osnumber', {
                            inpp: {inputProps: {readOnly: this.props.editando}},
                        })}
                        {this.cc('equip', {
                            istyle: {},
                            fpar: {},
                        })}
                        {['dt_para', 'dt_reini',].map(
                            f => this.cc(f))}
                        <div className="upload-form-col">
                            {['dt_abr', 'usr_abr'].map(
                                f => this.cc(f, {inpp: {}, fpar: {className: 'upload-form-scol2'}}))}
                        </div>
                        <div className="upload-form-col">
                            {['dt_rec', 'usr_rec'].map(
                                f => this.cc(f, {inpp: {}, fpar: {className: 'upload-form-scol2'}}))}
                        </div>
                        <div className="upload-form-col">
                            {['dt_exe', 'usr_exe'].map(
                                f => this.cc(f, {inpp: {}, fpar: {className: 'upload-form-scol2'}}))}
                        </div>
                        <div className="upload-form-col">
                            {['dt_ok', 'usr_ok'].map(
                                f => this.cc(f, {inpp: {}, fpar: {className: 'upload-form-scol2'}}))}
                        </div>
                        {['solicita', 'executado', 'partlist', 'observ'].map(
                            f => this.cc(f, {inpp: {multiline: true}, fpar: {className: 'upload-form-rowf'}}))}
                    </div>
                    <div className="upload-editbutton">
                        <button
                            className="btn btn-lg btn-primary"
                            type="button"
                            disabled={this.props.inProgress}
                            onClick={this.submitForm}>
                            {(this.props.title ? t.vmsavemai : t.vmnewmai) + ' OS'}
                        </button>
                        <button
                            className="btn btn-lg btn-danger"
                            type="button"
                            onClick={window._history.goBack}
                            disabled={this.props.inProgress}>
                            {'Cancelar'}
                        </button>
                    </div>
                </form>);
        };

        this.watchForEnter = ev => {
            if (ev.keyCode === 13) {
                ev.preventDefault();
                this.props.onAddTag();
            }
        };

        this.removeTagHandler = tag => () => {
            this.props.onRemoveTag(tag);
        };

        this.fields = fields_new;
        this.submitForm = ev => {
            ev.preventDefault();
            var upload = {};
            for (let key in this.fields) {
                upload[key] = this.props[this.fields[key].prop ? this.fields[key].prop : key];
            }
            const slug = {slug: this.props.slug};
            const promise = this.props.slug ?
                uploadAgent.Uploads.update(Object.assign(upload, slug)) :
                uploadAgent.Uploads.create(upload);

            this.props.onSubmit(promise);
        };
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (this.props.match.params.slug !== nextProps.match.params.slug) {
            if (nextProps.match.params.slug) {
                this.props.onUnload();
                return this.props.onLoad(uploadAgent.Uploads.get(this.props.match.params.slug));
            }
            this.props.onLoad(null);
        }
    }

    UNSAFE_componentWillMount() {
        if (this.props.match.params.slug) {
            return this.props.onLoad(uploadAgent.Uploads.get(this.props.match.params.slug));
        }
        this.props.onLoad(null);
    }

    UNSAFE_componentWillUnmount() {
        this.props.onUnload();
    }

    render() {
        return (
            <div className="upload-editor-page">
                <div className="upload-container container">
                    <ListErrors errors={this.props.errors}></ListErrors>
                    {this.criacampos()}
                </div>
            </div>
        );
    }
}

const expd = connect(
    state => ({
        ...state.upload,
    }),
    dispatch => ({
        onAddTag: () =>
            dispatch({type: ADD_TAGUPLOAD}),
        onLoad: payload =>
            dispatch({type: EDITOR_PAGE_LOADEDUPLOAD, payload}),
        onRemoveTag: tag =>
            dispatch({type: REMOVE_TAGUPLOAD, tag}),
        onSubmit: payload =>
            dispatch({type: UPLOAD_SUBMITTED, payload}),
        onUnload: payload =>
            dispatch({type: EDITOR_PAGE_UNLOADEDUPLOAD}),
        onUpdateField: (key, value) =>
            dispatch({type: UPDATE_FIELD_EDITORUPLOAD, key, value})
    }))(Editor);

export default expd;