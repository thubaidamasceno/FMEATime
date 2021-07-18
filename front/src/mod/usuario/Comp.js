import React from 'react';
import {connect} from 'react-redux';
import usuarioAgent from './agent';
import {Link,withRouter} from 'react-router-dom';
import moment from "moment";
import 'moment/locale/pt-br';
import {t} from './modconf';
import {ADD_USRUPDATE, DELETE_USUARIO, DELETE_USRUPDATE, USUARIO_PAGE_LOADED, USUARIO_PAGE_UNLOADED} from './actionTypes';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';


const mapStateToProps = state => ({
    ...state.usuario,
    currentUser: state.common.currentUser
});

const mapDispatchToProps = dispatch => ({
    onLoad: payload =>
        dispatch({type: USUARIO_PAGE_LOADED, payload}),
    onUnload: () =>
        dispatch({type: USUARIO_PAGE_UNLOADED})
});

const DeleteButton = connect(() => ({}), dispatch => ({
    onClick: (payload, usrupdateId) =>
        dispatch({type: DELETE_USRUPDATE, payload, usrupdateId})
}))(props => {
    const del = () => {
        const payload = usuarioAgent.Usrupdates.delete(props.username, props.usrupdateId);
        props.onClick(payload, props.usrupdateId);
    };

    if (props.show) {
        return (
            <span className="mod-options">
        <i className="ion-trash-a" onClick={del}></i>
      </span>
        );
    }
    return null;
});

class ChildInput extends React.Component {
    constructor() {
        super();
        this.state = {
            body: ''
        };

        this.setBody = ev => {
            this.setState({body: ev.target.value});
        };

        this.createUsrupdate = ev => {
            ev.preventDefault();
            const payload = usuarioAgent.Usrupdates.create(this.props.username,
                {body: this.state.body});
            this.setState({body: ''});
            this.props.onSubmit(payload);
        };
    }

    render() {
        return (
            <form className="card usrupdate-form" onSubmit={this.createUsrupdate}>
                <div className="card-block">
          <textarea className="form-control"
                    placeholder="Adicionar Registro"
                    value={this.state.body}
                    onChange={this.setBody}
                    rows="3">
          </textarea>
                    <button
                        className="btn btn-sm btn-primary"
                        type="submit">
                        Adicionar Registro
                    </button>
                </div>
                {/*<div className="card-footer">*/}
                {/*    /!*<img*!/*/}
                {/*    /!*    src={this.props.currentUser.image}*!/*/}
                {/*    /!*    className="usrupdate-author-img"*!/*/}
                {/*    /!*    alt={this.props.currentUser.username}/>*!/*/}
                {/*   */}
                {/*</div>*/}
            </form>
        );
    }
}

const UsrupdateInput = connect(() => ({}),
    dispatch => ({
        onSubmit: payload =>
            dispatch({type: ADD_USRUPDATE, payload})
    }))(ChildInput);


const Child = props => {
    const usrupdate = props.usrupdate;
    const show = props.currentUser &&
        props.currentUser.username === usrupdate.username;
    return (
        <div className="card">
            <div className="card-block">
                <p className="card-text">{usrupdate.body}</p>
            </div>
            <div className="card-footer">

                <span className="date-posted">
         &nbsp; {moment(usrupdate.createdAt).format(t.datetimefmt)}
        </span>
                <DeleteButton show={show} username={props.username} usrupdateId={usrupdate.id}/>
            </div>
        </div>
    );
};

const ChildList = props => {
    return (
        <div>
            {
                // props.usrupdates.map(usrupdate => {
                //     return (
                //         <Child
                //             usrupdate={usrupdate}
                //             currentUser={props.currentUser}
                //             username={props.username}
                //             key={usrupdate.id}/>
                //     );
                // })
            }
        </div>
    );
};

const ChildContainer = props => {
    if (props.currentUser) {
        return (
            <div className="col-xs-12 col-md-8 offset-md-2">
                <div>
                    <list-errors errors={props.errors}></list-errors>
                    <UsrupdateInput username={props.username} currentUser={props.currentUser}/>
                </div>

                <ChildList
                    usrupdates={props.usrupdates}
                    username={props.username}
                    currentUser={props.currentUser}/>
            </div>
        );
    } else {
        return (
            <div className="col-xs-12 col-md-8 offset-md-2">
                <p>
                    <Link to="/login">Entre no FMEATime</Link>
                    &nbsp;ou&nbsp;
                    <Link to="/register">cadastre-se</Link>
                    &nbsp;para adicionar registros à OS.
                </p>

                <ChildList
                    usrupdates={props.usrupdates}
                    username={props.username}
                    currentUser={props.currentUser}/>
            </div>
        );
    }
};

const UsuarioActions = connect(() => ({}),
    dispatch => ({
        onClickDelete: payload =>
            dispatch({type: DELETE_USUARIO, payload})
    })
)(props => {
    const usuario = props.usuario;
    const del = () => {
        props.onClickDelete(usuarioAgent.Usuarios.del(usuario.username))
    };
    if (props.canModify) {
        return (
            <span>

        <Link
            to={`/usuarioEditor/${usuario.username}`}
            className="btn btn-outline-secondary btn-sm">
          <i className="ion-edit"></i> Editar OS
        </Link>

        <button className="btn btn-outline-danger btn-sm" onClick={del}>
          <i className="ion-trash-a"></i> Excluir OS
        </button>

      </span>
        );
    }

    return (
        <span>
    </span>
    );
});

const Meta = props => {
    const usuario = props.usuario;
    return (
        <div className="usuario-meta">
            <div className="info">

                <span className="date">
         &nbsp; {moment(usuario.createdAt).format(t.datetimefmt)}
        </span>
            </div>

            <UsuarioActions canModify={props.canModify} usuario={usuario}/>
        </div>
    );
};

class Comp extends React.Component {
    UNSAFE_componentWillMount() {
        this.props.onLoad(Promise.all([
            usuarioAgent.Usuarios.get(this.props.match.params.id),
            //usuarioAgent.Usrupdates.foruser(this.props.match.params.id)
        ]));
    }

    UNSAFE_componentWillUnmount() {
        this.props.onUnload();
    }

    render() {
        if (!this.props.usuario) {
            return null;
        }
        const canModify = this.props.currentUser &&
            this.props.currentUser.username === this.props.usuario.username;
        return (
            <div className="usuario-page">

                <div className="banner">
                    <div className="container">

                        <h4>{this.props.usuario.title}</h4>
                        <Meta
                            usuario={this.props.usuario}
                            canModify={canModify}/>

                    </div>
                </div>

                <div className="container page">

                    <div className="row usuario-content">
                        <div className="col-xs-12">

                            {/*<div dangerouslySetInnerHTML={markup}></div>*/}

                            {/*<ul className="tag-list">*/}
                            {/*    {*/}
                            {/*        this.props.usuario.tagList.map(tag => {*/}
                            {/*            return (*/}
                            {/*                <li*/}
                            {/*                    className="tag-default tag-pill tag-outline"*/}
                            {/*                    key={tag}>*/}
                            {/*                    {tag}*/}
                            {/*                </li>*/}
                            {/*            );*/}
                            {/*        })*/}
                            {/*    }*/}
                            {/*</ul>*/}

                        </div>
                    </div>

                    <hr/>

                    <div className="usuario-actions">
                    </div>

                    <div className="row">
                        <ChildContainer
                            usrupdates={this.props.usrupdates || []}
                            errors={this.props.usrupdateErrors}
                            username={this.props.match.params.id}
                            currentUser={this.props.currentUser}/>
                    </div>
                </div>
            </div>
        );
    }
}


const expd = connect(mapStateToProps, mapDispatchToProps)(withRouter( Comp));
export default expd;