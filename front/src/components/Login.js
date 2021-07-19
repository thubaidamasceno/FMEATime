import { Link ,withRouter} from 'react-router-dom';
import ListErrors from './ListErrors';
import React from 'react';
import agent from '../agent';
import { connect } from 'react-redux';
import {
  UPDATE_FIELD_AUTH,
  LOGIN,
  LOGIN_PAGE_UNLOADED
} from '../constants/actionTypes';

const mapStateToProps = state => ({ ...state.auth });

const mapDispatchToProps = dispatch => ({
  onChangeUsername: value =>
    dispatch({ type: UPDATE_FIELD_AUTH, key: 'username', value }),
  onChangePassword: value =>
    dispatch({ type: UPDATE_FIELD_AUTH, key: 'password', value }),
  onSubmit: (username, password) =>
    dispatch({ type: LOGIN, payload: agent.Auth.login(username, password) }),
  onUnload: () =>
    dispatch({ type: LOGIN_PAGE_UNLOADED })
});

class Login extends React.Component {
  constructor() {
    super();
    this.changeUsername = ev => this.props.onChangeUsername(ev.target.value);
    this.changePassword = ev => this.props.onChangePassword(ev.target.value);
    this.submitForm = (username, password) => ev => {
      ev.preventDefault();
      this.props.onSubmit(username, password);
    };
  }

  UNSAFE_componentWillUnmount() {
    this.props.onUnload();
  }

  render() {
    const username = this.props.username||'';
    const password = this.props.password||'';
    return (
      <div className="auth-page">
        <div className="container page">
          <div className="row">

            <div className="col-md-6 offset-md-3 col-xs-12">
              <h1 className="text-xs-center">Entrar no FMEATime</h1>

              <ListErrors errors={this.props.errors} />


              <form onSubmit={this.submitForm(username, password)}>
                <fieldset>

                  <fieldset className="form-group">
                    <input
                      className="form-control form-control-lg"
                      type="text"
                      placeholder="Login"
                      value={username}
                      onChange={this.changeUsername} />
                  </fieldset>

                  <fieldset className="form-group">
                    <input
                      className="form-control form-control-lg"
                      type="password"
                      placeholder="Senha"
                      value={password}
                      onChange={this.changePassword} />
                  </fieldset>

                  <button
                    className="btn btn-lg btn-primary pull-xs-right"
                    type="submit"
                    disabled={this.props.inProgress}>
                    Entrar
                  </button>
                  <p className="text-xs-center">
                    <Link to="/register/register">
                      Cadatastrar-se
                    </Link>
                  </p>
                  <p className="text-xs-center">
                    <Link to="/register/recover">
                      Recuperar Senha
                    </Link>
                  </p>

                </fieldset>
              </form>
            </div>

          </div>
        </div>
      </div>
    );
  }
}

const expd = connect(mapStateToProps, mapDispatchToProps)(withRouter(Login));

export default expd;