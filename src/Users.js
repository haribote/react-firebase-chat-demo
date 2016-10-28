import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import './Users.css';

/**
 * Users component
 */
export default class Users extends Component {
  /**
   * @static propTypes
   * @returns {{currentUser: *, users: *}}
   */
  static get propTypes() {
    return {
      currentUser: PropTypes.object.isRequired,
      users      : PropTypes.array.isRequired
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
    const { currentUser } = this.props;
    const user = this.props.users[uid];

    if (!user) {
      return null;
    }

    return (
      <li className={classNames({
        'Users-me': uid === currentUser.uid
      })}>
        <img
          src={user.photoURL}
          alt=""
          width={32}
          height={32}
        />
        <span>{user.displayName}</span>
      </li>
    );
  }
}
