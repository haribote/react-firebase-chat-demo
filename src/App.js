import firebase, { githubAuthProvider } from './firebase';
import React, { Component } from 'react';
import logo from './logo.svg';
import icon_123_spinner from './icons/icon_123_spinner.svg';
import icon_433_github from './icons/icon_433_github.svg';
import './App.css';
import actions, { RECEIVE_AUTHORIZATION } from './actions';

class App extends Component {
  /**
   * @static
   * @returns {{user: null, token: null, uiIsLoading: boolean}}
   */
  static get initialState() {
    return {
      user       : null,
      token      : null,
      uiIsLoading: true
    }
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
    // auth
    firebase
      .auth()
      .getRedirectResult()
      .then(result => {
        this.dispatch(
          actions.receiveAuthorization(
            result.credential ? {
              user : result.user,
              token: result.credential.accessToken
            } : (
              undefined
            )
          )
        );
      })
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
          uiIsLoading: false
        };
      })();

    default:
      return this.state;
    }

  }

  /**
   * @returns {XML}
   */
  render() {
    // cache
    const { user, token, uiIsLoading } = this.state;

    // JSX template
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React Firebase Chat</h2>
        </div>
        {(() => {
          if (user && token) {
            return (
              <p className="App-intro">hoge</p>
            );
          } else if (!uiIsLoading) {
            return (
              <div className="App-login">
                <button type="button" onClick={App.handleClickLoginButton}><img src={icon_433_github} alt="" width={64} height={64} />Login with GitHub.</button>
              </div>
            );
          }
          return (
            <div className="App-loading"><img src={icon_123_spinner} alt="Loading..." width={64} height={64} /></div>
          );
        })()}
      </div>
    );
  }

  /**
   * @listen click on (.App-login button)
   * @param ev
   */
  static handleClickLoginButton(ev) {
    ev.preventDefault();

    firebase
      .auth()
      .signInWithRedirect(githubAuthProvider);
  }
}

export default App;
