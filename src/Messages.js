import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import classNames from 'classnames';
import './Messages.css';

export default class Messages extends Component {
  /**
   * @static propTypes
   * @returns {{currentUser: *, users: *, messages: *}}
   */
  static get propTypes() {
    return {
      currentUser: PropTypes.object.isRequired,
      users      : PropTypes.array.isRequired,
      messages   : PropTypes.arrayOf(PropTypes.shape({
        uid     : PropTypes.string.isRequired,
        message : PropTypes.string,
        postedAt: PropTypes.number.isRequired
      })).isRequired
    }
  }

  /**
   * @param props
   */
  constructor(props) {
    super(props);

    this.isScrollNeeded = false;
  }

  componentDidMount() {
    this.scrollToBottom();
  }

  componentWillUpdate() {
    // cache
    const wrapperEl = findDOMNode(this.refs.wrapper);

    this.isScrollNeeded = wrapperEl.scrollTop >= (wrapperEl.scrollHeight - wrapperEl.offsetHeight);
  }

  /**
   * @method
   */
  componentDidUpdate() {
    if (this.isScrollNeeded) {
      this.scrollToBottom();
    }
  }

  scrollToBottom() {
    // cache
    const wrapperEl = findDOMNode(this.refs.wrapper);

    wrapperEl.scrollTop = wrapperEl.scrollHeight - wrapperEl.offsetHeight
  }

  /**
   * @returns {XML}
   */
  render() {
    // cache
    const { currentUser, users, messages } = this.props;
    let count = -1;

    // JSX template
    return (
      <div className="Messages" ref="wrapper">
        {messages
          .reduce((memo, item, i) => {
            if (i === 0 || item.uid !== messages[i - 1].uid) {
              count += 1;
              return memo.concat([{
                uid  : item.uid,
                group: [{
                  message : item.message,
                  postedAt: item.postedAt
                }]
              }]);
            }

            memo[count].group.push({
              message : item.message,
              postedAt: item.postedAt
            });
            return memo;
          }, [])
          .map(item => (
            <div className={classNames('Messages-group', { 'is-self': item.uid === currentUser.uid })}>
              <img
                src={users[item.uid].photoURL}
                alt=""
                width={32}
                height={32}
              />
              <div className="Messages-item">
                {item.group
                  .sort((a, b) => (a.postedAt - b.postedAt))
                  .map(d => (
                    <p>{d.message}</p>
                  ))}
              </div>
            </div>
          ))}
      </div>
    );
  }
}