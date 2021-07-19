// import ArticleList from './ArticleList';
import React from 'react';
import agent from '../agent';
import { connect } from 'react-redux';
import {
  FOLLOW_USER,
  UNFOLLOW_USER,
  PROFILE_PAGE_LOADED,
  PROFILE_PAGE_UNLOADED
} from '../constants/actionTypes';
import {Link,withRouter} from 'react-router-dom';
import abl from "../ability";

const EditProfileSettings = props => {
  if (props.isUser) {
    return (
      <Link
        to="/settings"
        className="btn btn-sm btn-outline-secondary action-btn">
        <i className="ion-gear-a"></i> Editar Perfil
      </Link>
    );
  }
  return null;
};

const mapStateToProps = state => ({
  currentUser: state.common.currentUser,
  profile: state.profile
});

const mapDispatchToProps = dispatch => ({
  onFollow: username => dispatch({
    type: FOLLOW_USER,
    payload: agent.Profile.follow(username)
  }),
  onLoad: payload => dispatch({ type: PROFILE_PAGE_LOADED, payload }),
  onUnfollow: username => dispatch({
    type: UNFOLLOW_USER,
    payload: agent.Profile.unfollow(username)
  }),
  onUnload: () => dispatch({ type: PROFILE_PAGE_UNLOADED })
});

class Profile extends React.Component {
  UNSAFE_componentWillMount() {
    this.props.onLoad(Promise.all([
      agent.Profile.get(this.props.match.params.username),
    ]));
  }

  UNSAFE_componentWillUnmount() {
    this.props.onUnload();
  }

  renderTabs() {
    return (
      <ul className="nav nav-pills outline-active">
        <li className="nav-item">
          <Link
            className="nav-link active"
            to={`/@${this.props.profile.username}`}>
            Minhas OSs
          </Link>
        </li>

        <li className="nav-item">
          <Link
            className="nav-link"
            to={`/@${this.props.profile.username}/favorites`}>
            OSs acompanhadas
          </Link>
        </li>
      </ul>
    );
  }

  render() {
    const profile = this.props.profile;
    if (!profile) {
      return null;
    }

    const isUser = this.props.currentUser &&
      this.props.profile.username === this.props.currentUser.username;


    if (abl(this.props.role, 'open', 'usuarios'))
      return (
          <div className="profile-page">

            <div className="user-info">
              <div className="container">
                <div className="row">
                  <div className="col-xs-12 col-md-10 offset-md-1">

                    <img src={profile.image} className="user-img" alt={profile.username} />
                    <h4>{profile.username}</h4>
                    <p>{profile.bio}</p>

                    <EditProfileSettings isUser={isUser} />
                    {/*<FollowUserButton*/}
                    {/*  isUser={isUser}*/}
                    {/*  user={profile}*/}
                    {/*  follow={this.props.onFollow}*/}
                    {/*  unfollow={this.props.onUnfollow}*/}
                    {/*  />*/}

                  </div>
                </div>
              </div>
            </div>

            <div className="container">
              <div className="row">

                <div className="col-xs-12 col-md-10 offset-md-1">

                  {/*<div className="articles-toggle">*/}
                  {/*  {this.renderTabs()}*/}
                  {/*</div>*/}

                  {/*<ArticleList*/}
                  {/*  pager={this.props.pager}*/}
                  {/*  articles={this.props.articles}*/}
                  {/*  articlesCount={this.props.articlesCount}*/}
                  {/*  state={this.props.currentPage} />*/}
                </div>

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

const expd = connect(mapStateToProps, mapDispatchToProps)( withRouter( Profile));
export { Profile, mapStateToProps };

export default expd;