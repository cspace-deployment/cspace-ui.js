import {
  LOGIN_FULFILLED,
  LOGOUT_FULFILLED,
  RECORD_SAVE_FULFILLED,
  READ_VOCABULARY_ITEMS_STARTED,
  READ_VOCABULARY_ITEMS_FULFILLED,
  READ_VOCABULARY_ITEMS_REJECTED,
} from '../constants/actionCodes';

const normalizeItems = (items) => ((items && !Array.isArray(items)) ? [items] : items);

const clearAll = () => ({});

const handleLoginFulfilled = (state, action) => {
  const {
    prevUsername,
    username,
  } = action.meta;

  if (prevUsername !== username) {
    // The logged in user has changed. Remove all vocabulary state, because the new user may not be
    // permitted to read vocabularies.

    return clearAll(state);
  }

  return state;
};

const handleRecordSaveFulfilled = (state, action) => {
  const {
    recordTypeConfig,
  } = action.meta;

  if (recordTypeConfig.name === 'vocabulary') {
    return clearAll(state);
  }

  return state;
};

export default (state = {}, action) => {
  switch (action.type) {
    case READ_VOCABULARY_ITEMS_STARTED:
      return {
        ...state,
        [action.meta.vocabulary]: {
          isReadPending: true,
          items: null,
        },
      };
    case READ_VOCABULARY_ITEMS_FULFILLED:
      return {
        ...state,
        [action.meta.vocabulary]: {
          items: normalizeItems(action.payload.data['ns2:abstract-common-list']['list-item']),
        },
      };
    case READ_VOCABULARY_ITEMS_REJECTED:
      return {
        ...state,
        [action.meta.vocabulary]: {
          error: action.payload,
        },
      };
    case RECORD_SAVE_FULFILLED:
      return handleRecordSaveFulfilled(state, action);
    case LOGIN_FULFILLED:
      return handleLoginFulfilled(state, action);
    case LOGOUT_FULFILLED:
      return clearAll(state);
    default:
      return state;
  }
};

export function get(state, vocabularyName) {
  return state[vocabularyName];
}
