import {
  LOGIN_FULFILLED,
  LOGOUT_FULFILLED,
  RECORD_SAVE_FULFILLED,
  READ_VOCABULARY_ITEMS_STARTED,
  READ_VOCABULARY_ITEMS_FULFILLED,
  READ_VOCABULARY_ITEMS_REJECTED,
} from '../../../src/constants/actionCodes';

import reducer, {
  get,
} from '../../../src/reducers/vocabulary';

chai.should();

describe('vocabulary reducer', () => {
  it('should have an empty initial state', () => {
    reducer(undefined, {}).should.deep.equal({});
  });

  it('should handle READ_VOCABULARY_ITEMS_STARTED', () => {
    const vocabulary = 'languages';

    const state = reducer({}, {
      type: READ_VOCABULARY_ITEMS_STARTED,
      meta: {
        vocabulary,
      },
    });

    state.should.deep.equal({
      [vocabulary]: {
        isReadPending: true,
        items: null,
      },
    });

    get(state, vocabulary).should.deep.equal({
      isReadPending: true,
      items: null,
    });
  });

  it('should handle READ_VOCABULARY_ITEMS_FULFILLED', () => {
    const vocabulary = 'states';

    const items = [
      { displayName: 'California' },
      { displayName: 'New York' },
    ];

    const data = {
      'ns2:abstract-common-list': {
        'list-item': items,
      },
    };

    const state = reducer({}, {
      type: READ_VOCABULARY_ITEMS_FULFILLED,
      payload: {
        data,
      },
      meta: {
        vocabulary,
      },
    });

    state.should.deep.equal({
      [vocabulary]: {
        items,
      },
    });

    get(state, vocabulary).should.deep.equal({
      items,
    });
  });

  it('should handle READ_VOCABULARY_ITEMS_REJECTED', () => {
    const vocabulary = 'languages';
    const error = new Error();

    const state = reducer({}, {
      type: READ_VOCABULARY_ITEMS_REJECTED,
      payload: error,
      meta: {
        vocabulary,
      },
    });

    state.should.deep.equal({
      [vocabulary]: {
        error,
      },
    });

    get(state, vocabulary).should.deep.equal({
      error,
    });
  });

  context('on RECORD_SAVE_FULFILLED', () => {
    it('should clear all state if the saved record is a vocabulary', () => {
      const initialState = {
        currency: {},
        language: {},
        era: {},
      };

      const state = reducer(initialState, {
        type: RECORD_SAVE_FULFILLED,
        meta: {
          recordTypeConfig: {
            name: 'vocabulary',
          },
        },
      });

      state.should.deep.equal({});
    });

    it('should not change the state if the saved record is not a vocabulary', () => {
      const initialState = {
        currency: {},
        language: {},
        era: {},
      };

      const state = reducer(initialState, {
        type: RECORD_SAVE_FULFILLED,
        meta: {
          recordTypeConfig: {
            name: 'collectionobject',
          },
        },
      });

      state.should.deep.equal(initialState);
    });
  });

  context('on LOGIN_FULFILLED', () => {
    const initialState = {
      vocab1: {},
      vocab2: {},
    };

    it('should clear vocabulary state if the user has changed', () => {
      const prevUsername = 'prevUser@collectionspace.org';
      const username = 'newUser@collectionspace.org';

      const state = reducer(initialState, {
        type: LOGIN_FULFILLED,
        meta: {
          prevUsername,
          username,
        },
      });

      state.should.deep.equal({});
    });

    it('should not clear vocabulary state if the user has not changed', () => {
      const prevUsername = 'user@collectionspace.org';
      const username = 'user@collectionspace.org';

      const state = reducer(initialState, {
        type: LOGIN_FULFILLED,
        meta: {
          prevUsername,
          username,
        },
      });

      state.should.deep.equal(initialState);
    });
  });

  it('should handle LOGOUT_FULFILLED', () => {
    const state = reducer({
      vocab1: {},
      vocab2: {},
    }, {
      type: LOGOUT_FULFILLED,
    });

    state.should.deep.equal({});
  });
});
