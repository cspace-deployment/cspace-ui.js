import Immutable from 'immutable';
import chaiImmutable from 'chai-immutable';

import {
  createInvocationData,
  normalizeInvocationDescriptor,
} from '../../../src/helpers/invocationHelpers';

chai.use(chaiImmutable);

describe('invocationHelpers', function moduleSuite() {
  const config = {
    recordTypes: {
      collectionobject: {
        serviceConfig: {
          objectName: 'CollectionObject',
        },
      },
    },
  };

  describe('createInvocationData', function suite() {
    it('should create invocation data for no context mode invocation descriptors', function test() {
      const invocationDescriptor = Immutable.Map({
        mode: 'nocontext',
      });

      createInvocationData(config, invocationDescriptor).should.deep.equal({
        'ns2:invocationContext': {
          '@xmlns:ns2': 'http://collectionspace.org/services/common/invocable',
          mode: 'nocontext',
          docType: undefined,
          outputMIME: undefined,
          params: undefined,
        },
      });
    });

    it('should create invocation data for single mode invocation descriptors', function test() {
      const invocationDescriptor = Immutable.Map({
        mode: 'single',
        recordType: 'collectionobject',
        csid: '1234',
      });

      createInvocationData(config, invocationDescriptor).should.deep.equal({
        'ns2:invocationContext': {
          '@xmlns:ns2': 'http://collectionspace.org/services/common/invocable',
          mode: 'single',
          docType: 'CollectionObject',
          singleCSID: '1234',
          outputMIME: undefined,
          params: undefined,
        },
      });
    });

    it('should create invocation data for list mode invocation descriptors', function test() {
      const invocationDescriptor = Immutable.Map({
        mode: 'list',
        recordType: 'collectionobject',
        csid: ['1234', 'abcd'],
      });

      createInvocationData(config, invocationDescriptor).should.deep.equal({
        'ns2:invocationContext': {
          '@xmlns:ns2': 'http://collectionspace.org/services/common/invocable',
          mode: 'list',
          docType: 'CollectionObject',
          listCSIDs: {
            csid: [
              '1234',
              'abcd',
            ],
          },
          outputMIME: undefined,
          params: undefined,
        },
      });
    });

    it('should create invocation data for group mode invocation descriptors', function test() {
      const invocationDescriptor = Immutable.Map({
        mode: 'group',
        csid: '1234',
      });

      createInvocationData(config, invocationDescriptor).should.deep.equal({
        'ns2:invocationContext': {
          '@xmlns:ns2': 'http://collectionspace.org/services/common/invocable',
          mode: 'group',
          docType: undefined,
          groupCSID: '1234',
          outputMIME: undefined,
          params: undefined,
        },
      });
    });

    it('should convert params to key/value pairs', function test() {
      const invocationDescriptor = Immutable.Map({
        mode: 'nocontext',
      });

      const params = {
        foo: '123',
        bar: 'xyz',
      };

      createInvocationData(config, invocationDescriptor, params).should.deep.equal({
        'ns2:invocationContext': {
          '@xmlns:ns2': 'http://collectionspace.org/services/common/invocable',
          mode: 'nocontext',
          docType: undefined,
          outputMIME: undefined,
          params: {
            param: [
              { key: 'foo', value: '123' },
              { key: 'bar', value: 'xyz' },
            ],
          },
        },
      });
    });

    it('should convert array params to multiple key/value pairs with the same key', function test() {
      const invocationDescriptor = Immutable.Map({
        mode: 'nocontext',
      });

      const params = {
        foo: ['123', '456'],
      };

      createInvocationData(config, invocationDescriptor, params).should.deep.equal({
        'ns2:invocationContext': {
          '@xmlns:ns2': 'http://collectionspace.org/services/common/invocable',
          mode: 'nocontext',
          docType: undefined,
          outputMIME: undefined,
          params: {
            param: [
              { key: 'foo', value: '123' },
              { key: 'foo', value: '456' },
            ],
          },
        },
      });
    });
  });

  describe('normalizeInvocationDescriptor', function suite() {
    it('should return an immutable map if the invocation descriptor is undefined', function test() {
      normalizeInvocationDescriptor().should.equal(Immutable.Map());
    });

    it('should set outputMIME to the outputMIME in the metadata if it is not set', function test() {
      const invocationDescriptor = Immutable.Map();

      const metadata = Immutable.fromJS({
        document: {
          'ns2:reports_common': {
            outputMIME: 'foo/bar',
          },
        },
      });

      normalizeInvocationDescriptor(invocationDescriptor, metadata).should.equal(Immutable.Map({
        outputMIME: 'foo/bar',
      }));
    });

    it('should set outputMIME to application/pdf if it is not set, and is also not set in the metadata', function test() {
      const invocationDescriptor = Immutable.Map();

      const metadata = Immutable.fromJS({
        document: {
          'ns2:reports_common': {},
        },
      });

      normalizeInvocationDescriptor(invocationDescriptor, metadata).should.equal(Immutable.Map({
        outputMIME: 'application/pdf',
      }));
    });
  });
});
