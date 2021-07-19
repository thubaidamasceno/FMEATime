import ListErrors from "./ListErrors";
import React from "react";
import agent from "../agent";
import {connect} from "react-redux";
// import Camera from "./camera";
// import Camera from 'react-html5-camera-photo';
// import 'react-html5-camera-photo/build/css/index.css';
// import ImagePreview from './ImagePreview'; // source code : ./src/demo/AppWithImagePreview/ImagePreview
import {LOGOUT, SETTINGS_PAGE_UNLOADED, SETTINGS_SAVED,} from "../constants/actionTypes";
// import UpFile from "../mod/upload/UpFile";
// import UpPhoto from "../mod/upload/UpPhoto";


class SettingsForm extends React.Component {
    constructor() {
        super();

        this.state = {
            image: "",
            username: "",
            bio: "",
            email: "",
            password: "",
        };

        this.updateState = (field) => (ev) => {
            const state = this.state;
            let newState = Object.assign(
                {},
                state,
                {[field]: ev.target.value});

            newState.errors = {
                ...newState.errors,
                notmatch: (((newState.password || newState.cpassword) &&
                    newState.password !== newState.cpassword) ? "Senhas não conferem." : null)
            };
            newState.hasErrors = (() => {
                for (let k in newState.errors)
                    if (newState.errors[k])
                        return true;
                return false;
            })();
            this.setState(newState);
        };

        this
            .submitForm = (ev) => {
            ev.preventDefault();

            const user = Object.assign({}, this.state);
            if (!user.password) {
                delete user.password;
            }

            this.props.onSubmitForm(user);
        };
    }

    UNSAFE_componentWillMount() {
        if (this.props.currentUser) {
            Object.assign(this.state, {
                image: this.props.currentUser.image || "",
                username: this.props.currentUser.username,
                bio: this.props.currentUser.bio,
                email: this.props.currentUser.email,
            });
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.currentUser) {
            this.setState(
                Object.assign({}, this.state, {
                    image: nextProps.currentUser.image || "",
                    username: nextProps.currentUser.username,
                    bio: nextProps.currentUser.bio,
                    email: nextProps.currentUser.email,
                })
            );
        }
    }

    render() {
        return (
            <form onSubmit={this.submitForm}
                  autoComplete='off'>
                <input autoComplete='off' hidden={true}></input>
                <fieldset>
                    <fieldset className="form-group">
                        <div className="imgcambox">
                            <img className="imgcam" alt='imagem' src={this.state.image}></img>
                        </div>
                        {/*<UpFile/>*/}
                        {/*<UpPhoto/>*/}
                    </fieldset>

                    <fieldset className="form-group">
                        <input
                            className="form-control form-control-lg"
                            type="text"
                            placeholder="Nome"
                            value={this.state.username}
                            onChange={this.updateState("username")}
                            readOnly={true}
                        />
                    </fieldset>

                    <fieldset className="form-group">
                        <textarea
                            className="form-control form-control-lg"
                            rows="8"
                            placeholder="Descrição de sua capacitação"
                            value={this.state.bio}
                            onChange={this.updateState("bio")}>

                        </textarea>
                    </fieldset>

                    <fieldset className="form-group">
                        <input
                            className="form-control form-control-lg"
                            type="teste"
                            placeholder="Email"
                            value={this.state.email}
                            autoComplete='off'
                            onChange={this.updateState("email")}
                        />
                    </fieldset>

                    <fieldset className="form-group">
                        <input
                            className="form-control form-control-lg"
                            type="password"
                            placeholder="Nova Senha"
                            value={this.state.password}
                            autoComplete='new-password'
                            onChange={this.updateState("password")}
                        />
                    </fieldset>

                    <fieldset className="form-group">
                        <input
                            className="form-control form-control-lg"
                            type="password"
                            placeholder="Confirme a Nova Senha"
                            value={this.state.confirmpassword}
                            autoComplete='new-password'
                            onChange={this.updateState("cpassword")}
                        />
                    </fieldset>
                    <ListErrors errors={this.state.errors}></ListErrors>
                    <button
                        className="btn btn-lg btn-primary pull-xs-right"
                        type="submit"
                        disabled={this.state.inProgress || this.state.hasErrors}
                    >
                        Atualizar Perfil
                    </button>
                </fieldset>
            </form>
        );
    }
}

const mapStateToProps = (state) => ({
    ...state.settings,
    currentUser: state.common.currentUser,
});

const mapDispatchToProps = (dispatch) => ({
    onClickLogout: () => dispatch({type: LOGOUT}),
    onSubmitForm: (user) =>
        dispatch({type: SETTINGS_SAVED, payload: agent.Auth.save(user)}),
    onUnload: () => {

        dispatch({type: SETTINGS_PAGE_UNLOADED});
    },
});

class Settings extends React.Component {

    render() {
        return (
            <div className="settings-page">
                <div className="container page">
                    <div className="row">
                        <div className="col-md-6 offset-md-3 col-xs-12">
                            <h1 className="text-xs-center">Seu Perfil</h1>

                            <ListErrors errors={this.props.errors}></ListErrors>

                            <SettingsForm
                                currentUser={this.props.currentUser}
                                onSubmitForm={this.props.onSubmitForm}
                            />

                            <hr/>

                            <button
                                className="btn btn-outline-danger  pull-xs-right"
                                onClick={this.props.onClickLogout}
                            >
                                Sair do FMEATime
                            </button>
                            {/*<Imgtest/>*/}
                        </div>
                    </div>
                </div>
            </div>

        );
    }
}

const expd = connect(mapStateToProps, mapDispatchToProps)(Settings);
export default expd;
