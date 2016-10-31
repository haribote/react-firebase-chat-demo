import firebase, { firebaseDb, githubAuthProvider } from './firebase';
import React, { Component } from 'react';
import logo from './logo.svg';
import icon_123_spinner from './icons/icon_123_spinner.svg';
import icon_433_github from './icons/icon_433_github.svg';
import './App.css';
import Users from './Users';
import Editor from './Editor';
import Messages from './Messages';
import actions, {
  REQUEST_AUTHORIZATION,
  RECEIVE_AUTHORIZATION,
  REQUEST_USERS,
  RECEIVE_USERS,
  CHANGE_CURRENT_MESSAGE,
  REQUEST_SEND_MESSAGE,
  RECEIVE_MESSAGES
} from './actions';

/**
 * App container
 */
class App extends Component {
  /**
   * @static
   * @returns {{user: null, users: {}, currentMessage: string, uiIsLoading: boolean, uiIsMessaging: boolean}}
   */
  static get initialState() {
    return {
      user          : null,
      users         : {},
      currentMessage: '',
      messages      : [],
      uiIsLoading   : true,
      uiIsMessaging : false
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
      'handleClickLogoutButton',
      'handleChangeCurrentMessage',
      'handleSubmitMessage'
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
    firebaseDb
      .ref('messages')
      .on('value', (snapShot) => {
        this.dispatch(
          actions.receiveMessages(snapShot.val())
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

    case CHANGE_CURRENT_MESSAGE:
      return {
        currentMessage: payload.slice(0, 100)
      };

    case REQUEST_SEND_MESSAGE:
      return {
        uiIsMessaging: true
      };

    case RECEIVE_MESSAGES:
      return {
        currentMessage: App.initialState.currentMessage,
        messages      : payload !== null ? (
          Object.keys(payload)
            .map((key) => payload[key])
            .sort((a, b) => (a - b))
        ) : (
          this.state.messages
        ),
        uiIsMessaging : false
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
      return Promise.resolve();
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

  requestSendMessage() {
    // cache
    const { user, currentMessage, uiIsMessaging } = this.state;

    if (currentMessage.length === 0 || currentMessage.length > 100 || uiIsMessaging) {
      return Promise.reject();
    }

    this.dispatch(
      actions.requestSendMessage(currentMessage)
    );

    return firebaseDb
      .ref('messages')
      .push()
      .set({
        uid     : user.uid,
        message : currentMessage,
        postedAt: firebase.database.ServerValue.TIMESTAMP
      });
  }

  /**
   * @returns {XML}
   */
  render() {
    // cache
    const { user, users, currentMessage, messages, uiIsLoading, uiIsMessaging } = this.state;

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
              {messages.length && (<Messages currentUser={user} users={users} messages={messages} />)}
              <Editor message={currentMessage} disabled={uiIsMessaging} onChange={this.handleChangeCurrentMessage} onSubmit={this.handleSubmitMessage} />
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

  /**
   * @listen change on (.Editor input)
   * @param ev
   */
  handleChangeCurrentMessage(ev) {
    this.dispatch(
      actions.changeCurrentMessage(ev.currentTarget.value)
    );
  }

  /**
   * @listen submit on (.Editor form)
   * @param ev
   */
  handleSubmitMessage(ev) {
    ev.preventDefault();

    this.requestSendMessage()
      .catch(() => {
        ev.stopPropagation();
      });
  }
}

export default App;
