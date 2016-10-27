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

/**
 * @type {Object}
 */
export default {
  receiveAuthorization: createAction(RECEIVE_AUTHORIZATION)
};
