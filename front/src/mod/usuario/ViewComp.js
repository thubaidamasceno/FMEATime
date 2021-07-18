import React from "react";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import "moment/locale/pt-br";
import moment from "moment";
import {t} from "./modconf";
import usuarioAgent from "./agent";
import at, {USUARIO_SERVEACTED} from "./actionTypes";
import DeleteIcon from '@material-ui/icons/Delete';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import AddBoxIcon from '@material-ui/icons/AddBox';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import abl, {ablmk} from "../../ability";

const Promise = global.Promise;

const ListPagination = connect(
    () => ({}),
    (dispatch) => ({
        onSetPage: (page, payload) =>
            dispatch({type: at.SET_PAGEUSUARIO, page, payload}),
    })
)((props) => {
    if (props.usuariosCount <= 10) {
        return null;
    }

    const range = [];
    for (let i = 0; i < Math.ceil(props.usuariosCount / 10); ++i) {
        range.push(i);
    }

    const setPage = (page) => {
        if (props.pager) {
            props.onSetPage(page, props.pager(page));
        } else {
            props.onSetPage(page, usuarioAgent.Usuarios.all(page));
        }
    };

    return (
        <nav>
            <ul className="pagination">
                {range.map((v) => {
                    const isCurrent = v === props.currentPage;
                    const onClick = (ev) => {
                        ev.preventDefault();
                        setPage(v);
                    };
                    return (
                        <li
                            className={isCurrent ? "page-item active" : "page-item"}
                            onClick={onClick}
                            key={v.toString()}
                        >
                            <a className="page-link" href="">
                                {v + 1}
                            </a>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
});

const UsuarioPreview = connect(
    () => ({}),
    (dispatch) => ({
        serveact: (act, username) => dispatch({
            type: USUARIO_SERVEACTED,
            payload: usuarioAgent.Usuarios.serveact(act, username)
        })
    })
)((props) => {
    const usuario = props.usuario;

    const handleClick = opt => ev => {
        switch (opt) {
            case 'deluser':
                if (window.confirm('Tem certeza que deseja excluir o cadastro de ' + props.usuario.username + '?'))
                    props.serveact('deluser', props.usuario.username);
                return;
            case 'changepass':
                if (window.confirm('Tem certeza que deseja gerar uma nova senha para ' + props.usuario.username + '?'))
                    props.serveact('changepass', props.usuario.username);
                return;
            default:
                return;
        }
    };

    return (<div className="oserv-preview-cont">
            <div className="oserv-meta">
                <div>
                    <Link to={''} className="oserv-preview-link">
                        <span className='oserv-ostitle'>{`${usuario.username}`}</span>
                    </Link>
                </div>
                <div className="oserv-meta-info">
                        <span className="date">
                            {(usuario.nome) ? <span className="usuario-negr">Nome: </span> : ''}
                            {(usuario.nome) ? usuario.nome : ''}   </span>
                    <br/>
                    <span className="date">
                            {(usuario.email) ? <span className="usuario-negr">Email: </span> : ''}
                        {(usuario.email) ? usuario.email : ''}   </span>
                    <br/>
                    <span className="date">
                            {(usuario.telefone) ? <span className="usuario-negr">Telefone: </span> : ''}
                        {(usuario.telefone) ? usuario.telefone : ''}   </span>
                    <br/>
                    <span className="date">
                            {(usuario.mensagem1) ? <span className="usuario-negr">Deixou a mensagem: </span> : ''}
                        {(usuario.mensagem1) ? usuario.mensagem1 : ''}   </span>
                </div>
            </div>
            <div className='oserv-prev-actbar'>
                <Link to={`@${usuario.username}`}
                      className='oserv-acticon'>
                    <AccountCircleIcon className='oserv-acticon'/>
                </Link>
                <div className='oserv-acticon'
                     onClick={handleClick('changepass')}>
                    <VpnKeyIcon className='oserv-acticon'/>
                </div>
                <div className='oserv-acticon'
                     onClick={handleClick('deluser')}>
                    <DeleteIcon className='oserv-acticon oserv-btn-del'/>
                </div>
            </div>
        </div>
    );
});

const PedidoPreview = connect(
    () => ({}),
    (dispatch) => ({
        serveact: (act, username) => dispatch({
            type: USUARIO_SERVEACTED,
            payload: usuarioAgent.Usuarios.serveact(act, username)
        })
    })
)((props) => {
    const usuario = props.usuario;
    const handleClick = opt => ev => {
        switch (opt) {
            case 'delpedido':
                if (window.confirm('Tem certeza que deseja excluir esse pedido?'))
                    props.serveact('delpedido', props.usuario.slug);
                return;
            case 'changepass':
                if (window.confirm('Tem certeza que deseja gerar uma nova senha para ' + props.usuario.username + '?'))
                    props.serveact('changepass', props.usuario.username);
                return;
            case 'confirmacadastro':
                let uname = window.prompt('Confirme o nome de usuário. Esse nome nunca' +
                    ' deve ter sido usado antes, e não poderá ser trocado.', props.usuario.username);
                if (uname)
                    props.serveact('confirmacadastro', uname);
                return;
            default:
                return;
        }
    };
    return (
        <div className="oserv-preview-cont">
            <div className="oserv-meta">
                <div>
                    <div className="oserv-preview-link">
                        <span className='oserv-ostitle'>{`Nome: ${usuario.nome}`}</span>
                    </div>
                    <div className="info">
                        <span className="date">
                                    requerido
                            {` em ${moment(usuario.createdAt).format(t.datetimefmt)}`}
                                </span>
                    </div>
                </div>
                <div className="oserv-meta-info">
                    {usuario.username && (<span className='date'><br/> Login: {usuario.username
                    } {((usuario.usernameInvalido !== 1 && usuario.tipo === 'recover') ||
                        (usuario.usernameInvalido === 1 && usuario.tipo === 'register')) && ' (inválido)'}</span>)}
                    {usuario.email && (<span className='date'><br/> Email: {usuario.email}</span>)}
                    {usuario.telefone && (<span className='date'><br/> Telefone: {usuario.telefone}</span>)}
                    {usuario.mensagem1 && (<span className='date'><br/> Deixou a mensagem: {usuario.mensagem1}</span>)}
                </div>
            </div>
            <div className='oserv-prev-actbar'>
                {(usuario.tipo === 'register' && usuario.usernameInvalido !== 1) && (
                    <div className='oserv-acticon'
                         onClick={handleClick('confirmacadastro')}>
                        <AddBoxIcon className='oserv-acticon'/>
                    </div>
                )}
                {(usuario.tipo === 'recover' && usuario.usernameInvalido === 1) && (
                    <div className='oserv-acticon'
                         onClick={handleClick('changepass')}>
                        <VpnKeyIcon className='oserv-acticon'/>
                    </div>
                )}
                <div className='oserv-acticon'
                     onClick={handleClick('delpedido')}>
                    <DeleteIcon className='oserv-acticon oserv-btn-del'/>
                </div>
            </div>
        </div>
    );
});

const Tags = (props) => {
    const tags = props.tags;
    if (tags) {
        return (
            <div className="tag-list">
                {tags.map((tag) => {
                    const handleClick = (ev) => {
                        ev.preventDefault();
                        props.onClickTag(
                            tag,
                            (page) => usuarioAgent.Usuarios.byTag(tag, page),
                            usuarioAgent.Usuarios.byTag(tag)
                        );
                    };

                    return (
                        <a
                            href=""
                            className="tag-default tag-pill"
                            key={tag}
                            onClick={handleClick}
                        >
                            {tag}
                        </a>
                    );
                })}
            </div>
        );
    } else {
        return <div></div>;
    }
};

const ListViewUsuarios = (props) => {
    if (!props.usuarios) {
        return <div className="usuario-preview">Carregando...</div>;
    }
    if (props.usuarios.length === 0) {
        return (
            <div className="usuario-preview">Nenhuma usuario... por enquanto.</div>
        );
    }
    return (
        <div>
            {props.usuarios.map((usuario) => {
                return <UsuarioPreview usuario={usuario} key={usuario.username}/>;
            })}
            <ListPagination
                pager={props.pager}
                usuariosCount={props.usuariosCount}
                currentPage={props.currentPage}
            />
        </div>
    );
};

const ListViewPedidos = (props) => {
    if (!props.usuarios) {
        return <div className="usuario-preview">Carregando...</div>;
    }
    if (props.usuarios.length === 0) {
        return (
            <div className="usuario-preview">Nenhum pedido... por enquanto.</div>
        );
    }
    return (
        <div>
            {props.usuarios.map((usuario) => {
                return <PedidoPreview usuario={usuario} key={usuario.username}/>;
            })}
            <ListPagination
                pager={props.pager}
                usuariosCount={props.usuariosCount}
                currentPage={props.currentPage}
            />
        </div>
    );
};

const PedidosCadastro = (props) => {
    const clickHandler = (ev) => {
        ev.preventDefault();
        props.onTabClick(
            'register',
            usuarioAgent.Usuarios.pedidos,
            usuarioAgent.Usuarios.pedidos({tipo: 'register'})
        );
    };

    return (
        <li className="nav-item">
            <a
                href=""
                className={props.tab === 'register' ? "nav-link active" : "nav-link"}
                onClick={clickHandler}
            >
                Pedidos de Cadastramento
            </a>
        </li>
    );
};

const PedidosRecupera = (props) => {
    const clickHandler = (ev) => {
        ev.preventDefault();
        props.onTabClick(
            'recover',
            usuarioAgent.Usuarios.pedidos,
            usuarioAgent.Usuarios.pedidos({tipo: 'recover'})
        );
    };

    return (
        <li className="nav-item">
            <a
                href=""
                className={props.tab === 'recover' ? "nav-link active" : "nav-link"}
                onClick={clickHandler}
            >
                Trocas de Senha
            </a>
        </li>
    );
};

const GlobalFeedTab = (props) => {
    const clickHandler = (ev) => {
        ev.preventDefault();
        props.onTabClick(
            "all",
            usuarioAgent.Usuarios.all,
            usuarioAgent.Usuarios.all()
        );
    };
    return (
        <li className="nav-item">
            <a
                href=""
                className={props.tab === "all" ? "nav-link active" : "nav-link"}
                onClick={clickHandler}
            >
                {t.usuario(t.n.p, t.c.c)}
            </a>
        </li>
    );
};

const TagFilterTab = (props) => {
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

const MainView = (props) => {
    return (
        <div className="col-md-9">
            <div className="feed-toggle">
                <ul className="nav nav-pills outline-active">
                    <GlobalFeedTab tab={props.tab} onTabClick={props.onTabClick}/>
                    {/*<PedidosCadastro tab={props.tab} onTabClick={props.onTabClick}/>*/}
                    <PedidosRecupera tab={props.tab} onTabClick={props.onTabClick}/>
                </ul>
            </div>
            {props.tab === "all" ? (
                <ListViewUsuarios
                    pager={props.pager}
                    usuarios={props.usuarios}
                    loading={props.loading}
                    usuariosCount={props.usuariosCount}
                    currentPage={props.currentPage}
                />
            ) : (
                <ListViewPedidos
                    pager={props.pager}
                    usuarios={props.usuarios}
                    loading={props.loading}
                    usuariosCount={props.usuariosCount}
                    currentPage={props.currentPage}
                />
            )}

        </div>
    );
};
const UsuarioMainView = connect(
    (state) => ({
        ...state.usuario,
        tags: [],
        token: state.common.token,
    }),
    (dispatch) => ({
        onTabClick: (tab, pager, payload) =>
            dispatch({type: at.CHANGE_TABUSUARIO, tab, pager, payload}),
    })
)(MainView);

class UsuarioViewComp extends React.Component {
    UNSAFE_componentWillMount() {
        const tab = "all";
        const usuariosPromise = usuarioAgent.Usuarios.all;
        this.props.onLoad(tab, usuariosPromise, Promise.all([usuariosPromise()]));
    }

    UNSAFE_componentWillUnmount() {
        this.props.onUnload();
    }

    render() {
        if (abl(this.props.role, 'open', 'usuarios'))
            return (
                <div className="home-page">
                    <div className="container page">
                        <div className="row">
                            <UsuarioMainView/>
                        </div>
                    </div>
                </div>
            );
        return (
            <div className="home-page">
                <div className="container page">
                    <div style={{textAlign:'center'}}>
                        <h3>O acesso a esse módulo não é permitido para o seu nível de acesso!</h3>
                        <h4>Contacte o gerente do sistema.</h4>
                    </div>
                </div>
            </div>
        );
    }
}

const expd = connect(
    (state) => ({
        ...state.usuario,
        role: state.common.role,
        appName: state.common.appName,
        token: state.common.token,
    }),
    (dispatch) => ({
        onClickTag: (tag, pager, payload) =>
            dispatch({type: at.APPLY_TAG_FILTERUSUARIO, tag, pager, payload}),
        onLoad: (tab, pager, payload) =>
            dispatch({type: at.HOME_PAGE_LOADEDUSUARIO, tab, pager, payload}),
        onUnload: () => dispatch({type: at.HOME_PAGE_UNLOADEDUSUARIO}),
    })
)(UsuarioViewComp);

export default expd;