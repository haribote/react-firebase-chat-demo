import React, { Component, PropTypes } from 'react';
import './Editor.css';


export default class Editor extends Component {
  /**
   * @static propTypes
   * @returns {{message: *, disabled: *, onChange: *, onSubmit: *}}
   */
  static get propTypes() {
    return {
      message : PropTypes.string.isRequired,
      disabled: PropTypes.bool,
      onChange: PropTypes.func.isRequired,
      onSubmit: PropTypes.func.isRequired
    }
  }

  render() {
    // cache
    const { message, disabled, onChange, onSubmit } = this.props;

    // JSX template
    return (
      <div className="Editor">
        <form action="" disabled={disabled} onSubmit={onSubmit}>
          <input
            type="text"
            value={message}
            maxLength={100}
            disabled={disabled}
            placeholder="Message"
            onChange={onChange}
          />
          <span>{message.length} / 100</span>
          <button
            type="submit"
            disabled={message.length === 0 || message.length > 100 || disabled}
          >
            Send
          </button>
        </form>
      </div>
    );
  }
}
