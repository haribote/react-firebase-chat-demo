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
export const RECEIVE_AUTHORIZATION = 'RECEIVE_AUTHORIZATION';

/** @type {String} **/
export const RECEIVE_USERS = 'RECEIVE_USERS';

/**
 * @type {Object}
 */
export default {
  receiveAuthorization: createAction(RECEIVE_AUTHORIZATION),
  receiveUsers        : createAction(RECEIVE_USERS)
};
