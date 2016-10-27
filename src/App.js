import React, { Component } from 'react';
import logo from './logo.svg';
import icon_433_github from './icons/icon_433_github.svg';
import './App.css';

class App extends Component {
  /**
   * @returns {XML}
   */
  render() {
    // JSX template
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React Firebase Chat</h2>
        </div>
        <div className="App-login">
          <button type="button"><img src={icon_433_github} alt="" width={64} height={64} />Login with GitHub.</button>
        </div>
      </div>
    );
  }
}

export default App;
