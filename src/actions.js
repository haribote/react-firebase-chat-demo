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

/**
 * @type {Object}
 */
export default {
  requestAuthorization: createAction(REQUEST_AUTHORIZATION),
  receiveAuthorization: createAction(RECEIVE_AUTHORIZATION),
  requestUsers        : createAction(REQUEST_USERS),
  receiveUsers        : createAction(RECEIVE_USERS)
};
