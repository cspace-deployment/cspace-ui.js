import Immutable from 'immutable';
import chaiImmutable from 'chai-immutable';

import {
  PERMS_READ_STARTED,
  PERMS_READ_FULFILLED,
  PERMS_READ_REJECTED,
  ROLES_READ_STARTED,
  ROLES_READ_FULFILLED,
  ROLES_READ_REJECTED,
  RECORD_CREATED,
  RECORD_DELETE_FULFILLED,
} from '../../../src/constants/actionCodes';

import reducer, {
  getResourceNames,
  getRoles,
  isPermsReadPending,
  isRolesReadPending,
} from '../../../src/reducers/authz';

const { expect } = chai;

chai.use(chaiImmutable);
chai.should();

describe('authz reducer', () => {
  it('should have an empty immutable initial state', () => {
    reducer(undefined, {}).should.deep.equal(Immutable.Map({}));
  });

  context('on PERMS_READ_STARTED', () => {
    it('should set isPermsReadPending to true', () => {
      const state = reducer(undefined, {
        type: PERMS_READ_STARTED,
      });

      state.should.deep.equal(Immutable.Map({
        isPermsReadPending: true,
      }));

      isPermsReadPending(state).should.equal(true);
    });
  });

  context('on PERMS_READ_FULFILLED', () => {
    const config = {
      recordTypes: {
        group: {
          serviceConfig: {
            servicePath: 'groups',
          },
        },
      },
    };

    const response = {
      data: {
        'ns2:permissions_list': {
          permission: [
            { resourceName: 'groups', actionGroup: 'CRUDL' },
            { resourceName: 'foo', actionGroup: 'CRUDL' },
            { resourceName: 'bar', actionGroup: 'CRUDL' },
          ],
        },
      },
    };

    it('should set resourceNames to contain known records in the response', () => {
      const state = reducer(Immutable.fromJS({
        isPermsReadPending: true,
      }), {
        type: PERMS_READ_FULFILLED,
        payload: response,
        meta: {
          config,
        },
      });

      getResourceNames(state).should.equal(Immutable.List([
        'groups',
      ]));
    });

    it('should unset isPermsReadPending', () => {
      const state = reducer(Immutable.fromJS({
        isPermsReadPending: true,
      }), {
        type: PERMS_READ_FULFILLED,
        payload: response,
        meta: {
          config,
        },
      });

      expect(isPermsReadPending(state)).to.equal(undefined);
    });

    it('should handle a single (non-list) permission', () => {
      const singlePermResponse = {
        data: {
          'ns2:permissions_list': {
            permission: { resourceName: 'groups', actionGroup: 'CRUDL' },
          },
        },
      };

      const state = reducer(Immutable.fromJS({
        isPermsReadPending: true,
      }), {
        type: PERMS_READ_FULFILLED,
        payload: singlePermResponse,
        meta: {
          config,
        },
      });

      getResourceNames(state).should.equal(Immutable.List([
        'groups',
      ]));
    });
  });

  context('on PERMS_READ_REJECTED', () => {
    it('should unset isPermsReadPending', () => {
      const state = reducer(Immutable.fromJS({
        isPermsReadPending: true,
      }), {
        type: PERMS_READ_REJECTED,
      });

      state.should.deep.equal(Immutable.fromJS({}));

      expect(isPermsReadPending(state)).to.equal(undefined);
    });
  });

  context('on ROLES_READ_STARTED', () => {
    it('should set isRolesReadPending to true', () => {
      const state = reducer(undefined, {
        type: ROLES_READ_STARTED,
      });

      state.should.deep.equal(Immutable.Map({
        isRolesReadPending: true,
      }));

      isRolesReadPending(state).should.equal(true);
    });
  });

  context('on ROLES_READ_FULFILLED', () => {
    const response = {
      data: {
        'ns2:roles_list': {
          role: [
            { roleName: 'TENANT_ADMINISTRATOR' },
            { roleName: 'TENANT_READER' },
            { roleName: 'TEST_ROLE' },
          ],
        },
      },
    };

    it('should set roles to the roles in the response', () => {
      const state = reducer(Immutable.fromJS({
        isRolesReadPending: true,
      }), {
        type: ROLES_READ_FULFILLED,
        payload: response,
      });

      getRoles(state).should.equal(Immutable.fromJS(response.data['ns2:roles_list'].role));
    });

    it('should unset isRolesReadPending', () => {
      const state = reducer(Immutable.fromJS({
        isRolesReadPending: true,
      }), {
        type: ROLES_READ_FULFILLED,
        payload: response,
      });

      expect(isRolesReadPending(state)).to.equal(undefined);
    });

    it('should handle a single (non-list) role', () => {
      const singleRoleResponse = {
        data: {
          'ns2:roles_list': {
            role: { roleName: 'TENANT_ADMINISTRATOR' },
          },
        },
      };

      const state = reducer(Immutable.fromJS({
        isRolesReadPending: true,
      }), {
        type: ROLES_READ_FULFILLED,
        payload: singleRoleResponse,
      });

      getRoles(state).should.equal(Immutable.fromJS([
        singleRoleResponse.data['ns2:roles_list'].role,
      ]));
    });
  });

  context('on ROLES_READ_REJECTED', () => {
    it('should unset isRolesReadPending', () => {
      const state = reducer(Immutable.fromJS({
        isRolesReadPending: true,
      }), {
        type: ROLES_READ_REJECTED,
      });

      state.should.deep.equal(Immutable.fromJS({}));

      expect(isRolesReadPending(state)).to.equal(undefined);
    });
  });

  context('on RECORD_DELETE_FULFILLED', () => {
    it('should delete roles if the record type is authrole', () => {
      const recordTypeConfig = {
        name: 'authrole',
      };

      const state = reducer(Immutable.fromJS({
        roles: [],
      }), {
        type: RECORD_DELETE_FULFILLED,
        meta: {
          recordTypeConfig,
        },
      });

      expect(getRoles(state)).to.equal(undefined);
    });

    it('should not delete roles if the record type is not authrole', () => {
      const recordTypeConfig = {
        name: 'group',
      };

      const state = reducer(Immutable.fromJS({
        roles: [],
      }), {
        type: RECORD_DELETE_FULFILLED,
        meta: {
          recordTypeConfig,
        },
      });

      getRoles(state).should.equal(Immutable.List());
    });
  });

  context('on RECORD_CREATED', () => {
    it('should delete roles if the record type is authrole', () => {
      const recordTypeConfig = {
        name: 'authrole',
      };

      const state = reducer(Immutable.fromJS({
        roles: [],
      }), {
        type: RECORD_CREATED,
        meta: {
          recordTypeConfig,
        },
      });

      expect(getRoles(state)).to.equal(undefined);
    });

    it('should not delete roles if the record type is not authrole', () => {
      const recordTypeConfig = {
        name: 'group',
      };

      const state = reducer(Immutable.fromJS({
        roles: [],
      }), {
        type: RECORD_CREATED,
        meta: {
          recordTypeConfig,
        },
      });

      getRoles(state).should.equal(Immutable.List());
    });
  });
});
