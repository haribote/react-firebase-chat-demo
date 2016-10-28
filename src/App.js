import firebase, { firebaseDb, githubAuthProvider } from './firebase';
import React, { Component } from 'react';
import logo from './logo.svg';
import icon_123_spinner from './icons/icon_123_spinner.svg';
import icon_433_github from './icons/icon_433_github.svg';
import './App.css';
import Users from './Users';
import actions, { REQUEST_AUTHORIZATION, RECEIVE_AUTHORIZATION, REQUEST_USERS, RECEIVE_USERS } from './actions';

/**
 * App container
 */
class App extends Component {
  /**
   * @static
   * @returns {{user: null, users: {}, uiIsLoading: boolean}}
   */
  static get initialState() {
    return {
      user       : null,
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

    // bind context
    this.bindContextAll(
      'handleClickLogoutButton'
    );
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

    firebase
      .auth()
      .onAuthStateChanged(this.saveUser.bind(this));
    this.getAuthResult();
  }

  /**
   * @returns {boolean}
   */
  get hasUsers() {
    return Object.keys(this.state.users).length > 0;
  }

  /**
   * @method bind context to self
   * @param methodNames
   */
  bindContextAll(...methodNames) {
    methodNames.forEach((methodName) => {
      this[methodName] = this[methodName].bind(this);
    });
  }
  /**
   * @method action dispatcher
   * @param action
   */
  dispatch(action) {
    // cache
    const { type, payload } = action;
    console.log(`dispatch: ${type}`, payload);

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

    case REQUEST_AUTHORIZATION:
    case REQUEST_USERS:
      return {
        uiIsLoading: true
      };

    case RECEIVE_AUTHORIZATION:
      return {
        user       : payload || App.initialState.user,
        uiIsLoading: false
      };

    case RECEIVE_USERS:
      return {
        users      : payload ? Object.assign({}, this.state.users, payload) : App.initialState.users,
        uiIsLoading: false
      };

    default:
      return this.state;
    }
  }

  /**
   * @method request authentication
   */
  getAuthResult() {
    this.dispatch(
      actions.requestAuthorization()
    );

    return firebase
      .auth()
      .getRedirectResult()
      .catch((error) => {
        console.log('error', error);
      });
  }

  requestLogout() {
    this.dispatch(
      actions.requestAuthorization()
    );

    return this.removeUser()
      .then(() => firebase.auth().signOut())
      .catch((error) => {
        console.log('error', error);
      });
  }

  /**
   * @method save user
   * @returns {Promise.<*>}
   */
  saveUser(user) {
    if (!user) {
      this.dispatch(
        actions.receiveAuthorization()
      );
      return Promise.reject(new Error('no user'));
    }

    this.dispatch(
      actions.requestUsers()
    );

    const { uid, displayName, photoURL } = user;
    return firebaseDb
      .ref(`users/${uid}`)
      .set({
        displayName,
        photoURL
      })
      .then(() => {
        this.dispatch(
          actions.receiveAuthorization({
            uid,
            displayName,
            photoURL
          })
        );
      })
      .catch((error) => {
        console.log('error', error);
      });
  }

  removeUser() {
    // cache
    const { user } = this.state;

    this.dispatch(
      actions.requestUsers()
    );

    return firebaseDb
      .ref(`users/${user.uid}`)
      .remove();
  }

  /**
   * @returns {XML}
   */
  render() {
    // cache
    const { user, users, uiIsLoading } = this.state;

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
          } else if (!user) {
            return (
              <div className="App-login">
                <button
                  type="button"
                  onClick={App.handleClickLoginButton}
                >
                  <img src={icon_433_github} alt="" width={64} height={64} />
                  <span>Click to login <br />with GitHub.</span>
                </button>
              </div>
            );
          }
          return (
            <div className="App-main">
              <Users currentUser={user} users={users} onClickLogout={this.handleClickLogoutButton} />
            </div>
          );
        })()}
      </div>
    );
  }

  /**
   * @listen click on (.Users button)
   * @param ev
   */
  handleClickLogoutButton(ev) {
    ev.preventDefault();

    this.requestLogout();
  }
}

export default App;
