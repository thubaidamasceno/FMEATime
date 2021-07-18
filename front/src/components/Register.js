import {Link, withRouter} from 'react-router-dom';
import ListErrors from './ListErrors';
import React from 'react';
import agent from '../agent';
import {connect} from 'react-redux';
import TextField from "@material-ui/core/TextField/TextField";
import {fields_new} from '../mod/usuario/modconf';
import {REGISTER, REGISTER_PAGE_UNLOADED, UPDATE_FIELD_AUTH} from '../constants/actionTypes';

const fn = fields_new;

class Register extends React.Component {
    constructor() {
        super();

        this.fields = fields_new;

        this.submitForm = ev => {
            ev.preventDefault();
            var dados = {};
            const tt = this;
            console.log(tt);
            for (let key in tt.fields) {
                dados[key] = tt.props[tt.fields[key].prop];
            }
            dados.tipo = tt.tipo;
            this.props.onSubmit(dados);
        };

        const updateFieldEvent =
            key => ev => this.props.onChange(key, ev.target.value);

        this.cc = (f = {}, add = {}) => {
            var f1 = {};
            if (typeof f == 'string')
                f1 = fields_new[f];
            else f1 = f;
            return this.criacampo({...f1, ...add});
        };

        this.criacampo = (f) => {
            return React.createElement('fieldset', {className: 'form-group', style: f.fstyle,},
                React.createElement(
                    TextField, {
                        className: "form-control form-control-lg",
                        type: "text",
                        onChange: updateFieldEvent(f.prop),
                        //InputLabelProps: {shrink: true},
                        variant: "outlined",
                        value: this.props[f.prop],
                        placeholder: f.texto,
                        //label: f.texto,
                        style: f.istyle,
                        ...f.inpp
                    }
                ));

        };

    }

    UNSAFE_componentWillUnmount() {
        this.props.onUnload();
    }

    render() {
        const ok = this.props.match.params.tipo;
        this.tipo = this.props.match.params.tipo;
        if (ok === 'ok')
            return (
                <div className="auth-page">
                    <div className="container page">
                        <div>
                            <div className="col-md-6 offset-md-3 col-xs-12">
                                <h1 className="text-xs-center">Solicitação aceita</h1>
                                <h6 className="text-xs-center">
                                    {(this.tipo === 'register') ? "Faça login" : "Verifique seu email"}</h6>
                            </div>
                            <ListErrors errors={this.props.errors}/>
                            <p/>
                            <p className="text-xs-center">
                                <Link to="/">
                                    Ok
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            );
        return (

            <div className="auth-page">
                <div className="container page">
                    <div className="row">

                        <div className="col-md-6 offset-md-3 col-xs-12">
                            <h1 className="text-xs-center">
                                {(this.tipo === 'register') ? "Cadastrar" : "Recuperar Senha"}
                            </h1>

                            {/*<h6 className="text-xs-center">O gerente do sistema vai analisar o seu pedido e entrar em*/}
                            {/*    contato.</h6>*/}

                            <ListErrors errors={this.props.errors}/>

                            <form autoComplete="off">
                                <fieldset>
                                    {this.cc(fn.email, {inpp: {type: 'email',
                                            // autocomplete: "off"
                                    }})}
                                    {this.cc(fn.password, {inpp: {type: 'password', autocomplete: "off"}})}
                                    {this.cc(fn.confirmation, {inpp: {type: 'password', autocomplete: "off"}})}
                                    <button
                                        className="btn btn-lg btn-primary pull-xs-right"
                                        type="submit"
                                        disabled={this.props.inProgress}
                                        onClick={this.submitForm}>
                                        {(this.tipo === 'register') ? "Cadastrar" : "Esqueci minha senha"}
                                    </button>

                                    <p className="text-xs-center">
                                        <Link to="/login">
                                            Já é Cadastrado?
                                        </Link>
                                        <br/>
                                        {(this.tipo === 'register') ?
                                            <Link to="/register/recover">
                                                Esqueceu sua senha?
                                            </Link> :
                                            <Link to="/register/register">
                                                Quer se Cadastrar?
                                            </Link>}
                                    </p>

                                </fieldset>
                            </form>
                        </div>

                    </div>
                </div>
            </div>
        )
            ;
    }
}

const expd = connect(
    state => ({...state.auth}),
    dispatch => ({
        onChange: (key, value) =>
            dispatch({type: UPDATE_FIELD_AUTH, key, value}),
        onSubmit: dados => {
            const payload = agent.Auth.register(dados);
            dispatch({type: REGISTER, payload})
        },
        onUnload: () =>
            dispatch({type: REGISTER_PAGE_UNLOADED})
    })
)(withRouter(Register));

export default expd;