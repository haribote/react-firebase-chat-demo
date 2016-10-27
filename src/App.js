import firebase, { firebaseDb, githubAuthProvider } from './firebase';
import React, { Component } from 'react';
import logo from './logo.svg';
import icon_123_spinner from './icons/icon_123_spinner.svg';
import icon_433_github from './icons/icon_433_github.svg';
import './App.css';
import actions, { RECEIVE_AUTHORIZATION, RECEIVE_USERS } from './actions';

class App extends Component {
  /**
   * @static
   * @returns {{user: null, token: null, uiIsLoading: boolean}}
   */
  static get initialState() {
    return {
      user       : null,
      token      : null,
      users      : {},
      uiIsLoading: true
    }
  }

  /**
   * @static redirect to login
   * @returns {!firebase.Promise.<void>|firebase.Promise<any>}
   */
  static signInWithRedirect() {
    return firebase
      .auth()
      .signInWithRedirect(githubAuthProvider);
  }

  /**
   * @listen click on (.App-login button)
   * @param ev
   */
  static handleClickLoginButton(ev) {
    ev.preventDefault();

    App.signInWithRedirect();
  }

  /**
   * @constructor
   * @param props
   */
  constructor(props) {
    super(props);

    // initialize state
    this.state = App.initialState;
  }

  /**
   * @method lifecycle
   */
  componentWillMount() {
    // bind DB
    firebaseDb
      .ref('users')
      .on('value', (snapShot) => {
        this.dispatch(
          actions.receiveUsers(snapShot.val())
        );
      });

    this.getAuthResult()
      .catch((error) => {
        console.log('error', error);
      });
  }

  /**
   * @method action dispatcher
   * @param action
   */
  dispatch(action) {
    // cache
    const { type, payload } = action;

    // update state
    this.setState(this.reduce(type, payload));
  }

  /**
   * @method reduce action to state
   * @param type
   * @param payload
   * @returns {*}
   */
  reduce(type, payload) {
    switch (type) {

    case RECEIVE_AUTHORIZATION:
      return (() => {
        const { user, token } = payload || {};
        return {
          user,
          token,
          uiIsLoading: Object.keys(this.state.users).length > 0
        };
      })();

    case RECEIVE_USERS:
      return {
        users      : Object.assign({}, this.state.users, payload),
        uiIsLoading: Object.keys(this.state.users).length > 0
      };

    default:
      return this.state;
    }
  }

  /**
   * @method request authentication
   */
  getAuthResult() {
    return firebase
      .auth()
      .getRedirectResult()
      .then(result => {
        if (result.credential) {
          this.dispatch(
            actions.receiveAuthorization({
              user : result.user,
              token: result.credential.accessToken
            })
          );
          return this.saveUser();
        }
        this.dispatch(actions.receiveAuthorization());
        return Promise.resolve();
      });
  }

  /**
   * @method save user
   * @returns {Promise.<*>}
   */
  saveUser() {
    // cache
    const { user } = this.state;

    if (!user) {
      return Promise.reject(new Error('no user'));
    }

    const { uid, displayName, photoURL } = user;
    return firebaseDb
      .ref(`users/${uid}`)
      .set({
        displayName,
        photoURL
      });
  }

  /**
   * @returns {XML}
   */
  render() {
    // cache
    const { user, token, users, uiIsLoading } = this.state;

    // JSX template
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React Firebase Chat</h2>
        </div>
        {(() => {
          if (uiIsLoading) {
            return (
              <div className="App-loading"><img src={icon_123_spinner} alt="Loading..." width={64} height={64} /></div>
            );
          } else if (!(user && token)) {
            return (
              <div className="App-login">
                <button type="button" onClick={App.handleClickLoginButton}><img src={icon_433_github} alt="" width={64} height={64} />Login with GitHub.</button>
              </div>
            );
          }
          return (
            <div className="App-main">
              <div className="Users">
                <ul>
                  {Object.keys(users).map((uid) => (
                    <li><img src={users[uid].photoURL} alt="" width={64} /><span>{users[uid].displayName}</span></li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })()}
      </div>
    );
  }
}

export default App;
