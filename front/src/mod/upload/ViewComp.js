import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import moment from "moment";
import 'moment/locale/pt-br';
import {t} from './modconf';
import uploadAgent from './agent';
import VisibilityIcon from '@material-ui/icons/Visibility';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import {
    APPLY_TAG_FILTERUPLOAD,
    CHANGE_TABUPLOAD,
    HOME_PAGE_LOADEDUPLOAD,
    HOME_PAGE_UNLOADEDUPLOAD,
    UPLOAD_FAVORITED,
    UPLOAD_SERVEACTED,
    SET_PAGEUPLOAD
} from './actionTypes';

import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';

const Promise = global.Promise;

const ListPagination = connect(
    () => ({}), dispatch => ({
        onSetPage: (page, payload) =>
            dispatch({type: SET_PAGEUPLOAD, page, payload})
    }))(
    props => {
        if (props.uploadsCount <= 10) {
            return null;
        }

        const range = [];
        for (let i = 0; i < Math.ceil(props.uploadsCount / 10); ++i) {
            range.push(i);
        }

        const setPage = page => {
            if (props.pager) {
                props.onSetPage(page, props.pager(page));
            } else {
                props.onSetPage(page, uploadAgent.Uploads.all(page))
            }
        };

        return (
            <nav>
                <ul className="pagination">

                    {
                        range.map(v => {
                            const isCurrent = v === props.currentPage;
                            const onClick = ev => {
                                ev.preventDefault();
                                setPage(v);
                            };
                            return (
                                <li
                                    className={isCurrent ? 'page-item active' : 'page-item'}
                                    onClick={onClick}
                                    key={v.toString()}>

                                    <a className="page-link" href="">{v + 1}</a>

                                </li>
                            );
                        })
                    }

                </ul>
            </nav>
        );
    }
);

const UploadPreview = connect(() => ({}),
    dispatch => ({
        favorite: slug => dispatch({
            type: UPLOAD_FAVORITED,
            payload: uploadAgent.Uploads.favorite(slug)
        }),
        serveact: (act,slug) => dispatch({
            type: UPLOAD_SERVEACTED,
            payload: uploadAgent.Uploads.serveact(act,slug)
        })
    })
)(props => {
        const upload = props.upload;

        const handleClick = ev => {
            ev.preventDefault();
            if (upload.favorited) {
                props.serveact(upload.slug);
            } else {
                props.favorite(upload.slug);
            }
        };

        return (
            <div className="upload-preview-cont">
                <div className="upload-meta">
                    <div>
                        <Link to={`/upload/${upload.slug}`} className="upload-preview-link">
                            <span className='upload-ostitle'>{`[OS ${upload.title}]`}</span>
                            <span className='upload-eqiptitle'> {`${upload.equip}`}</span>
                        </Link>
                        <div className="info">
                        <span className="date">
                                    inserida
                            {(upload.author.username) ? ` por ${upload.author.username}` : ''}
                            {` em ${moment(upload.createdAt).format(t.datetimefmt)}`}
                                </span>
                        </div>
                    </div>
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
                    </div>
                </div>
                <div className='upload-prev-actbar'>
                    <Link to={`/upload/${upload.slug}`} className='upload-acticon'>
                        <VisibilityIcon className='upload-acticon'/>
                    </Link>
                    <Link to={`/uploadEditor/${upload.slug}`} className='upload-acticon'>
                        <EditIcon className='upload-acticon'/>
                    </Link>
                    <div className='upload-acticon' onClick={()=>_handleOpen({CB:()=>()=>props.serveact('delos',upload.slug)})}>
                        <DeleteIcon className='upload-acticon upload-btn-del'/>
                    </div>
                </div>
            </div>
        );
    }
);

const Tags = props => {
    const tags = props.tags;
    if (tags) {
        return (
            <div className="tag-list">
                {
                    tags.map(tag => {
                        const handleClick = ev => {
                            ev.preventDefault();
                            props.onClickTag(tag, page => uploadAgent.Uploads.byTag(tag, page), uploadAgent.Uploads.byTag(tag));
                        };

                        return (
                            <a
                                href=""
                                className="tag-default tag-pill"
                                key={tag}
                                onClick={handleClick}>
                                {tag}
                            </a>
                        );
                    })
                }
            </div>
        );
    } else {
        return null;
        // (
        //     {/*<div>Loading uploadTags...</div>*/}
        // );
    }
};


const ListView = props => {
    if (!props.uploads) {
        return (
            <div className="upload-preview">Carregando...</div>
        );
    }
    if (props.uploads.length === 0) {
        return (
            <div>
                <br/>
                <div className="upload-preview">
                    Nenhuma {t.OS()}... por enquanto.
                </div>
            </div>
        );
    }
    return (
        <div>
            <div>
                {
                    props.uploads.map(upload => {
                        return (
                            <div>
                                <br/>
                                <UploadPreview upload={upload} key={upload.slug}/>
                            </div>
                        );
                    })
                }
            </div>
            <ListPagination
                pager={props.pager}
                uploadsCount={props.uploadsCount}
                currentPage={props.currentPage}/>
        </div>
    );
};

const YourFeedTab = props => {
    if (props.token) {
        const clickHandler = ev => {
            ev.preventDefault();
            props.onTabClick('feed', uploadAgent.Uploads.feed, uploadAgent.Uploads.feed());
        };

        return (
            <li className="nav-item">
                <a href=""
                   className={props.tab === 'feed' ? 'nav-link active' : 'nav-link'}
                   onClick={clickHandler}>
                    Suas {t.OS(t.n.p)}
                </a>
            </li>
        );
    }
    return null;
};

const GlobalFeedTab = props => {
    const clickHandler = ev => {
        ev.preventDefault();
        props.onTabClick('all', uploadAgent.Uploads.all, uploadAgent.Uploads.all());
    };
    return (
        <li className="nav-item">
            <a
                href=""
                className={props.tab === 'all' ? 'nav-link active' : 'nav-link'}
                onClick={clickHandler}>
                Todas {t.oa(t.g.f, t.n.p)} {t.OS(t.n.p)}
            </a>
        </li>
    );
};

const TagFilterTab = props => {
    if (!props.tag) {
        return null;
    }

    return (
        <li className="nav-item">
            <a href="" className="nav-link active">
                <i className="ion-pound"></i> {props.tag}

            </a>
        </li>
    );
};

var _handleOpen = (params)=>{};
var _handleClose = (params)=>{};

const UploadMainView = connect(
    state => ({
        ...state.upload,
        tags: state.upload.tags,
        token: state.common.token
    }),
    dispatch => ({
        onTabClick: (tab, pager, payload) => dispatch({type: CHANGE_TABUPLOAD, tab, pager, payload})
    })
)(props => {
    const [open, setOpen] = React.useState(false);
    const [callback, setCB] = React.useState(()=>{});

    _handleOpen = (params) => {
        setOpen(true);
        setCB(params.CB);
    };

    _handleClose = (params) => {
        setOpen(false);
        if(params && params.ok && callback)
            callback();
    };
    return (
        <div className="col-md-9">
            <div className="feed-toggle">
                <ul className="nav nav-pills outline-active">

                    <GlobalFeedTab tab={props.tab} onTabClick={props.onTabClick}/>

                    <YourFeedTab
                        token={props.token}
                        tab={props.tab}
                        onTabClick={props.onTabClick}/>
                    <TagFilterTab tag={props.tag}/>

                </ul>
            </div>

            <ListView
                pager={props.pager}
                uploads={props.uploads}
                loading={props.loading}
                uploadsCount={props.uploadsCount}
                currentPage={props.currentPage}/>
            <Modal
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={open}
                onClose={_handleClose}
            >
                <div className='upload-divmodal'>
                    Tem certeza que quer apagar essa OS?
                    <br/>
                    <button type="button" onClick={()=>_handleClose({ok:1})}>
                        Sim</button>

                    <button type="button" onClick={_handleClose} >
                        Não</button>
                </div>
            </Modal>
        </div>
    );
});

class UploadViewComp extends React.Component {
    UNSAFE_componentWillMount() {
        const tab = (this.props.token && 0) ? 'feed' : 'all';
        const uploadsPromise = (this.props.token && 0) ? uploadAgent.Uploads.feed : uploadAgent.Uploads.all;
        this.props.onLoad(tab, uploadsPromise, Promise.all([uploadAgent.Tags.getAll(), uploadsPromise()]));
    }

    UNSAFE_componentWillUnmount() {
        this.props.onUnload();
    }

    render() {
        return (
            <div className="home-page">
                <div className="container page">
                    <div className="row">
                        <UploadMainView/>
                        <div className="col-md-3">
                            <div className="sidebar">
                                <p>filtra {t.OS(t.n.p)}</p>
                                <Tags
                                    tags={this.props.tags}
                                    onClickTag={this.props.onClickTag}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const expd = connect(
    state => ({
        ...state.upload,
        appName: state.common.appName,
        token: state.common.token
    }),
    dispatch => ({
        onClickTag: (tag, pager, payload) =>
            dispatch({type: APPLY_TAG_FILTERUPLOAD, tag, pager, payload}),
        onLoad: (tab, pager, payload) =>
            dispatch({type: HOME_PAGE_LOADEDUPLOAD, tab, pager, payload}),
        onUnload: () =>
            dispatch({type: HOME_PAGE_UNLOADEDUPLOAD})
    })
)(UploadViewComp);

export default expd;