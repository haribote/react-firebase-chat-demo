/**
 * action creator
 * @returns {Function}
 */
export function createAction(type) {
  return function(payload) {
    return { type, payload };
  };
}

/** @type {String} **/
export const REQUEST_AUTHORIZATION = 'REQUEST_AUTHORIZATION';

/** @type {String} **/
export const RECEIVE_AUTHORIZATION = 'RECEIVE_AUTHORIZATION';

/** @type {String} **/
export const REQUEST_USERS = 'REQUEST_USERS';

/** @type {String} **/
export const RECEIVE_USERS = 'RECEIVE_USERS';

/** @type {String} **/
export const CHANGE_CURRENT_MESSAGE = 'CHANGE_CURRENT_MESSAGE';

/** @type {String} **/
export const REQUEST_SEND_MESSAGE = 'REQUEST_SEND_MESSAGE';

/** @type {String} **/
export const RECEIVE_MESSAGES = 'RECEIVE_MESSAGES';

/**
 * @type {Object}
 */
export default {
  requestAuthorization: createAction(REQUEST_AUTHORIZATION),
  receiveAuthorization: createAction(RECEIVE_AUTHORIZATION),
  requestUsers        : createAction(REQUEST_USERS),
  receiveUsers        : createAction(RECEIVE_USERS),
  changeCurrentMessage: createAction(CHANGE_CURRENT_MESSAGE),
  requestSendMessage  : createAction(REQUEST_SEND_MESSAGE),
  receiveMessages     : createAction(RECEIVE_MESSAGES)
};
