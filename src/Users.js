import React, { Component, PropTypes } from 'react';
import icon_277_exit from './icons/icon_277_exit.svg';
import './Users.css';

/**
 * Users component
 */
export default class Users extends Component {
  /**
   * @static propTypes
   * @returns {{currentUser: *, users: *, onClickLogout: *}}
   */
  static get propTypes() {
    return {
      currentUser  : PropTypes.object.isRequired,
      users        : PropTypes.array.isRequired,
      onClickLogout: PropTypes.func.isRequired
    }
  }

  /**
   * render list
   * @returns {XML}
   */
  render() {
    // cache
    const { currentUser, users } = this.props;

    // JSX template
    return (
      <div className="Users">
        <ul>
          {this.renderUser(currentUser.uid)}
          {Object.keys(users)
            .filter((uid) => uid !== currentUser.uid)
            .map(this.renderUser.bind(this))}
        </ul>
      </div>
    );
  }

  /**
   * render list item
   * @returns {XML}
   */
  renderUser(uid) {
    // cache
    const { currentUser, onClickLogout } = this.props;
    const user = this.props.users[uid];

    if (!user) {
      return null;
    }

    return (
      <li>
        <img
          src={user.photoURL}
          alt=""
          width={32}
          height={32}
        />
        <span>{user.displayName}</span>
        {(uid === currentUser.uid) && (
          <button type="button" onClick={onClickLogout}>
            <img src={icon_277_exit} alt="Logout" width={16} height={16} />
          </button>
        )}
      </li>
    );
  }
}
