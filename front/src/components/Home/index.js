import React from 'react';
import {connect} from 'react-redux';
import {
    HOME_PAGE_LOADED,
    HOME_PAGE_UNLOADED,
    APPLY_TAG_FILTER
} from '../../constants/actionTypes';

const Promise = global.Promise;

const mapStateToProps = state => ({
    ...state.home,
    appName: state.common.appName,
    token: state.common.token
});

const mapDispatchToProps = dispatch => ({
    onClickTag: (tag, pager, payload) =>
        dispatch({type: APPLY_TAG_FILTER, tag, pager, payload}),
    onLoad: (tab, pager, payload) =>
        dispatch({type: HOME_PAGE_LOADED, tab, pager, payload}),
    onUnload: () =>
        dispatch({type: HOME_PAGE_UNLOADED})
});

class Home extends React.Component {
    render() {
        return (
            <div className="home-page">
                <div className="home-page-about">
                    <p>
                        O FMEATime é um sistema de apoio à realização da FMEA (Fail Mode and Effect Analisys ou Análise
                        de Efeito e Modo de Falha).
                    </p>
                    <p>
                        Essencialmente, a FMEA pode ser feita usando formulários (úteis durante o preenchimento em
                        chão-de-fábrica) e pode contar ainda com planilhas eletrônicas, o que facilita sua visualização,
                        modificação, cópia, etc. Em organizações médias, porém, a realização da FMEA pode ser bastante
                        trabalhosa, pois pode envolver numerosos e complexos equipamentos. Dificuldades ainda maiores
                        surgem quando a FMEA é realizada 'por muitas mãos' e a longo prazo.
                    </p>
                    <p>
                        Embora atualmente exista a facilidade da utilização de planilhas compartilhados em 'nuvem'
                        permitindo inclusive a edição simultânea por vários usuários, essa solução pode deixar a desejar
                        em alguns aspectos:<br/>
                        * Não há segurança contra modificações indesejadas ou equivocadas;<br/>
                        * Maior risco de ocorrência de erros humanos;<br/>
                        * Maior dificuldade em acompanhar histórico de modficações e evolução do preenchinmento;<br/>
                        * Maior dificuldade em importar os dados para outras análises e aplicações.
                    </p>
                    <p>
                        O FMEATime oferece uma proposta de uma aplicação WEB baseada em banco de dados, multiusuário e
                        colaborativa, que oferece maior robustez na coleta de dados, modificação e visualização da FMEA.
                        Esse projeto ainda se encontre em 'estágio alpha', ou seja, ainda não é recomendado para
                        utilização com fins de produção, pois ainda não são conhecidos possíveis bugs. Apesar disso são
                        previstas as seguintes metas:<br/>
                        * Rastreabilidade do histórico de modificações da FMEA;<br/>
                        * Concessão de direitos de visualização e edição com base em grupos e usuários;<br/>
                        * Adequações à utilização em dispositivos móveis.

                    </p>
                    <p>
                        O FMEATime é um projeto de software desenvolvido por Thubaí Damasceno Chaves, quando então
                        discente
                        do curso de Engenharia Mecânica, ofertado pelo Departamento de Engenharia Mecânica (DMEC), do
                        Centro
                        de Cieências Exatas e Tecnologia, na Universidade Federal de Sergipe (UFS), entre Janeiro e
                        Abril de
                        2021.
                    </p>
                    <p>
                        O código fonte do FMEATime é licenciado segundo os termos da licensa GPL tem por objetivo servir
                        a
                        comunidade técnica e acadêmica. Embora seja um projeto de código livre, o FMEATime possui
                        registro no Instituto Nacional da
                        Propriedade Industrial (INPI), pois este é um requisito para a reconhecimento desse trabalho
                        como atividade complementar no curso de Engenharia Mecânica, segundo a resoluçãos N° 143/2009/CONEPE.
                    </p>
                    <p>

                    </p>
                </div>
            </div>
        );
    }
}

const expd = connect(mapStateToProps, mapDispatchToProps)(Home);

export default expd;