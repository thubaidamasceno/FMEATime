import React from 'react';
import {connect} from 'react-redux';
import uploadAgent from './agent';
import {Link} from 'react-router-dom';
import moment from "moment";
import 'moment/locale/pt-br';
import {fields_new, t} from './modconf';
import {ADD_UPLINK, DELETE_UPLOAD, DELETE_UPLINK, UPLOAD_PAGE_LOADED, UPLOAD_PAGE_UNLOADED} from './actionTypes';
import SendRoundedIcon from '@material-ui/icons/SendRounded';
import TextField from "@material-ui/core/TextField";
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import EditIcon from '@material-ui/icons/Edit';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import CameraAltIcon from '@material-ui/icons/CameraAlt';

const DeleteButton = connect(() => ({}), dispatch => ({
    onClick: (payload, uplinkId) =>
        dispatch({type: DELETE_UPLINK, payload, uplinkId})
}))(props => {
    const del = () => {
        const payload = uploadAgent.Uplinks.delete(props.slug, props.uplinkId);
        props.onClick(payload, props.uplinkId);
    };

    if (props.show) {
        return (
            <span className="mod-options">
         <DeleteForeverIcon className="icon-button" onClick={del}/>
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

        this.createUplink = ev => {
            ev.preventDefault();
            const payload = uploadAgent.Uplinks.create(this.props.slug,
                {body: this.state.body});
            this.setState({body: ''});
            this.props.onSubmit(payload);
        };
    }

    render() {
        return (
            <form className="card uplink-form" onSubmit={this.createUplink}>
                <div className="card-block">
                    <button
                        className="btn btn-sm btn-secondary"
                        type="submit">
                        <CameraAltIcon/>
                    </button>
                    <button
                        className="btn btn-sm btn-secondary"
                        type="submit">
                        <AttachFileIcon/>
                    </button>
                    <textarea className="form-control"
                              placeholder="Adicionar Registro"
                              value={this.state.body}
                              onChange={this.setBody}
                              rows="3">
                    </textarea>
                    <button
                        className="btn btn-sm btn-primary"
                        type="submit">
                        <SendRoundedIcon/>
                    </button>
                </div>
            </form>
        );
    }
}


const UplinkInput = connect(() => ({}),
    dispatch => ({
        onSubmit: payload =>
            dispatch({type: ADD_UPLINK, payload})
    }))(ChildInput);


const Child = props => {
    const uplink = props.uplink;
    const show = props.currentUser &&
        props.currentUser.username === uplink.author.username;
    return (
        <div className="card">
            <div className="card-block">
                <p className="card-text">{uplink.body}</p>
            </div>
            <div className="card-footer">
                <span className="date-posted">
                {uplink.author.username}<br/>
                    &nbsp;
                    {moment(uplink.createdAt).format(t.datetimefmt)}
                </span>
                <DeleteButton show={show} slug={props.slug} uplinkId={uplink.id}/>
            </div>
        </div>
    );
};

const ChildList = props => {
    return (
        <div>
            {
                props.uplinks.map(uplink => {
                    return (
                        <Child
                            uplink={uplink}
                            currentUser={props.currentUser}
                            slug={props.slug}
                            key={uplink.id}/>
                    );
                })
            }
        </div>
    );
};


const SuperLabel = props => {
    return (
        <TextField disabled multiline label={props.title}
                   InputLabelProps={{shrink: true}}
                   variant="outlined"
                   defaultValue={props.content}
                   margin="dense"
                   className='upload-form-control'/>
    );
};

const ChildContainer = props => {
    if (props.currentUser) {
        return (
            <div>
                <div className="col-xs-12 col-md-8 offset-md-2">
                    <ChildList
                        uplinks={props.uplinks}
                        slug={props.slug}
                        currentUser={props.currentUser}/>

                </div>
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
                    uplinks={props.uplinks}
                    slug={props.slug}
                    // currentUser={props.currentUser}
                />
            </div>
        );
    }
};

const UploadActions = connect(() => ({}),
    dispatch => ({
        onClickDelete: payload =>
            dispatch({type: DELETE_UPLOAD, payload})
    })
)(props => {
    const upload = props.upload;
    const del = () => {
        props.onClickDelete(uploadAgent.Uploads.del(upload.slug))
    };
    if (props.canModify) {
        return (
            <span className='.btn-list'>

        <Link
            to={`/uploadEditor/${upload.slug}`}
            className="btn btn-outline-secondary btn-sm">
          <EditIcon/> Editar OS
        </Link>

        <button className="btn btn-outline-danger btn-sm" onClick={del}>
           <DeleteForeverIcon/> Excluir
        </button>

      </span>
        );
    }

    return (
        <span>
    </span>
    );
});

class Comp extends React.Component {
    constructor() {
        super();
        this.criacampo = (f) => {
            //upload-form-group
            return (
                <div className="upload-form-group">
                    <SuperLabel title={f.texto} content={this.props.upload[f.prop]}/>
                </div>
            );
        };
        this.cc = (f = {}, add = {}) => {
            var f1 = {};
            if (f)
                f1 = fields_new[f];
            return this.criacampo({...f1, ...add});
        };
        this.criacampos = () => {
            let upload = this.props.upload;
            return (
                <div className="upload-preview-cont">
                    <div className="upload-meta">
                        <div className="upload-meta-info">
                        <span className="date">
                        {(upload.dt_abr || upload.usr_abr) ? `Aberta` : ''} {
                            (upload.dt_abr) ? ` em ${moment(upload.dt_abr).format(t.datetimefmt)}` : ''} {
                            (upload.usr_abr) ? ` por ${upload.usr_abr}` : ''}       </span>
                            <br/>
                            <span className="date">
                        {(upload.dt_rec || upload.usr_rec) ? `Recebida` : ''} {
                                (upload.dt_rec) ? ` em ${moment(upload.dt_rec).format(t.datetimefmt)}` : ''} {
                                (upload.usr_rec) ? ` por ${upload.usr_rec}` : ''} </span>
                            <br/>
                            <span className="date">
                        {(upload.dt_exe || upload.usr_exe) ? `Executada` : ''}{
                                (upload.dt_exe) ? ` em ${moment(upload.dt_exe).format(t.datetimefmt)}` : ''}{
                                (upload.usr_exe) ? ` por ${upload.usr_exe}` : ''}     </span>
                            <br/>
                            <span className="date">
                        {(upload.dt_ok || upload.usr_ok) ? `Aceita` : ''}{
                                (upload.dt_ok) ? ` em ${moment(upload.dt_ok).format(t.datetimefmt)}` : ''}{
                                (upload.usr_ok) ? ` por ${upload.usr_ok}` : ''}</span>
                            {(upload.dt_para || upload.usr_reini) && (
                                <span className='date'><br/>Máquina {
                                    upload.dt_para && ` parada em ${moment(upload.dt_ok).format(t.datetimefmt)}`
                                }{upload.dt_para && upload.dt_reini && `, `
                                }{upload.dt_reini && `reiniciada em ${moment(upload.dt_reini).format(t.datetimefmt)}`
                                }</span>)}
                        </div>
                        <div className="upload-meta-info">
                        <span className="date">
                            {(upload.solicita) ? <span className="upload-negr">Solicitação: </span> : ''}
                            {(upload.solicita) ? upload.solicita : ''}   </span>
                            <br/>
                            <span className="date">
                            {(upload.executado) ? <span className="upload-negr">Execução: </span> : ''}
                                {(upload.executado) ? upload.executado : ''}   </span>
                            <br/>
                            <span className="date">
                            {(upload.observ) ? <span className="upload-negr">Observações: </span> : ''}
                                {(upload.observ) ? upload.solicita : ''}   </span>

                            {upload.partlist && (<span className='date'><br/> Lista de peças: {upload.partlist}</span>)}
                        </div>
                    </div>
                </div>
            );
        };

    }

    UNSAFE_componentWillMount() {
        this.props.onLoad(Promise.all([
            uploadAgent.Uploads.get(this.props.match.params.id),
            uploadAgent.Uplinks.forUpload(this.props.match.params.id)
        ]));
    }

    UNSAFE_componentWillUnmount() {
        this.props.onUnload();
    }

    render() {
        if (!this.props.upload) {
            return null;
        }
        const canModify = this.props.currentUser &&
            this.props.currentUser.username === this.props.upload.author.username;
        let upload = this.props.upload;
        return (
            <div className="upload-page">
                <div className="banner">
                    <div className="container">
                        <h4>OS
                            nº {this.props.upload.title}{this.props.upload.equip && ` - ${this.props.upload.equip}`}</h4>
                        <div className="upload-meta">
                            <div className="info">
                                <span className="date">
                                    inserida
                                    {(upload.author.username) ? ` por ${upload.author.username}` : ''}
                                    {` em ${moment(upload.createdAt).format(t.datetimefmt)}`}
                                </span>
                                <UploadActions canModify={this.props.canModify || true} upload={upload}/>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    {this.criacampos()}
                </div>
                <div className="upload-container">

                    {/*<div className="row upload-content">*/}
                    {/*    <div className="col-xs-12">*/}
                    {/*        /!*<div dangerouslySetInnerHTML={markup}></div>*!/*/}
                    {/*        <ul className="tag-list">*/}
                    {/*            {*/}
                    {/*                this.props.upload.tagList.map(tag => {*/}
                    {/*                    return (*/}
                    {/*                        <li*/}
                    {/*                            className="tag-default tag-pill tag-outline"*/}
                    {/*                            key={tag}>*/}
                    {/*                            {tag}*/}
                    {/*                        </li>*/}
                    {/*                    );*/}
                    {/*                })*/}
                    {/*            }*/}
                    {/*        </ul>*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                    {/*<hr/>*/}

                    <div className="upload-container-btn">
                        <ChildContainer
                            uplinks={this.props.uplinks || []}
                            errors={this.props.uplinkErrors}
                            slug={this.props.match.params.id}
                            currentUser={this.props.currentUser}/>
                    </div>

                    <footer className='upload-inputchild'>
                        <list-errors errors={this.props.errors}></list-errors>
                        <UplinkInput slug={this.props.upload.slug} currentUser={this.props.currentUser}/>
                    </footer>
                </div>
            </div>
        );
    }
}


const expd = connect(
    state => ({
        ...state.upload,
        currentUser: state.common.currentUser
    }),
    dispatch => ({
        onLoad: payload => dispatch({type: UPLOAD_PAGE_LOADED, payload}),
        onUnload: () => dispatch({type: UPLOAD_PAGE_UNLOADED})
    })
)(Comp);

export default expd;