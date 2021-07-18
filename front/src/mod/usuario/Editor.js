import React from 'react';
import {connect} from 'react-redux';
// import moment from 'moment';
import TextField from '@material-ui/core/TextField';
import ListErrors from '../../components/ListErrors';
import usuarioAgent from './agent';
import {fields_new, t} from './modconf';
import {
    ADD_TAGUSUARIO,
    EDITOR_PAGE_LOADEDUSUARIO,
    EDITOR_PAGE_UNLOADEDUSUARIO,
    REMOVE_TAGUSUARIO,
    UPDATE_FIELD_EDITORUSUARIO,
    USUARIO_SUBMITTED
} from './actionTypes';
import {Link,withRouter} from 'react-router-dom';


class Editor extends React.Component {
    constructor() {
        super();

        const updateFieldEvent =
            key => ev => this.props.onUpdateField(key, ev.target.value);

        this.criacampos = () => {
            let fr = [];
            for (let f in fields_new) {
                if (fields_new[f]['hidden'])
                    continue;
                fr = [...fr,
                    this.criacampo(fields_new[f])];
            }
            return fr;
        };

        this.cc = (f = {}, add = {}) => {
            var f1 = {};
            if (f)
                f1 = fields_new[f];
            return this.criacampo({...f1, ...add});
        };

        this.criacampo = (f) => {
            switch (f.tipo) {
                case 'dt':
                    return React.createElement('fieldset', {className: 'form-group', style: {float: 'left'}},
                        React.createElement(
                            TextField, {
                                //className: "form-control form-control-lg",
                                style: {width: '16em',},
                                type: "datetime-local",
                                value: this.props[f.prop],
                                onChange: updateFieldEvent(f.prop),
                                label: f.texto,
                                InputLabelProps: {shrink: true},
                                variant: "outlined",
                                ...f.inpp
                            }
                        ));
                default:
                    return React.createElement('fieldset', {className: 'form-group', style: f.fstyle,},
                        React.createElement(
                            TextField, {
                                className: "form-control form-control-lg",
                                type: "text",
                                style: f.istyle,
                                value: this.props[f.prop],
                                onChange: updateFieldEvent(f.prop),
                                InputLabelProps: {shrink: true},
                                label: f.texto,
                                variant: "outlined",
                                ...f.inpp
                            }
                        ));
            }
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
            var usuario = {};
            for (let key in this.fields) {
                usuario[key] = this.props[this.fields[key].prop?this.fields[key].prop:key];
            }
            const username = {username: this.props.username};
            const promise = this.props.username ?
                usuarioAgent.Usuarios.update(Object.assign(usuario, username)) :
                usuarioAgent.Usuarios.create(usuario);

            this.props.onSubmit(promise);
        };
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (this.props.match.params.username !== nextProps.match.params.username) {
            if (nextProps.match.params.username) {
                this.props.onUnload();
                return this.props.onLoad(usuarioAgent.Usuarios.get(this.props.match.params.username));
            }
            this.props.onLoad(null);
        }
    }

    UNSAFE_componentWillMount() {
        if (this.props.match.params.username) {
            return this.props.onLoad(usuarioAgent.Usuarios.get(this.props.match.params.username));
        }
        this.props.onLoad(null);
    }

    UNSAFE_componentWillUnmount() {
        this.props.onUnload();
    }

    render() {
        return (
            <div className="editor-page">
                <div className="container page">
                    <div className="row">
                        <div className="col-md-10 offset-md-1 col-xs-12">
                            <ListErrors errors={this.props.errors}></ListErrors>
                            <form>
                                <fieldset>
                                    <fieldset>
                                        {this.cc('osnumber', {
                                            istyle: {width: '11em'},
                                            fstyle: {float: 'left'},
                                        })}
                                        {this.cc('equip', {
                                            istyle: {width: '11em'},
                                            fstyle: {float: 'left'},
                                        })}
                                        {['dt_para', 'dt_reini',].map(
                                            f => this.cc(f))}
                                    </fieldset>
                                    <fieldset>
                                        {['dt_abr', 'dt_rec', 'dt_exe', 'dt_ok'].map(
                                            f => this.cc(f))}
                                    </fieldset>
                                    <fieldset>
                                        {['usr_abr', 'usr_rec', 'usr_exe', 'usr_ok'].map(
                                            f => this.cc(f, {
                                                istyle: {width: '11em'},
                                                fstyle: {float: 'left'},
                                            }))}
                                    </fieldset>
                                    {['solicita', 'executado', 'partlist', 'observ'].map(
                                        f => this.cc(f, {inpp: {multiline: true}}))}
                                    <button
                                        className="btn btn-lg pull-xs-right btn-primary"
                                        style={{
                                            margin: 0,
                                            top: 'auto',
                                            right: 20,
                                            bottom: 20,
                                            left: 'auto',
                                            position: 'fixed'
                                        }}
                                        type="button"
                                        disabled={this.props.inProgress}
                                        onClick={this.submitForm}>
                                        {(this.props.title ? t.vmsavemai : t.vmnewmai) + ' OS'}
                                    </button>
                                </fieldset>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const expd = connect(
    state => ({
        ...state.usuario
    }),
    dispatch => ({
        onAddTag: () =>
            dispatch({type: ADD_TAGUSUARIO}),
        onLoad: payload =>
            dispatch({type: EDITOR_PAGE_LOADEDUSUARIO, payload}),
        onRemoveTag: tag =>
            dispatch({type: REMOVE_TAGUSUARIO, tag}),
        onSubmit: payload =>
            dispatch({type: USUARIO_SUBMITTED, payload}),
        onUnload: payload =>
            dispatch({type: EDITOR_PAGE_UNLOADEDUSUARIO}),
        onUpdateField: (key, value) =>
            dispatch({type: UPDATE_FIELD_EDITORUSUARIO, key, value})
    }))(withRouter( Editor));

export default expd;