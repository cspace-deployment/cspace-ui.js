/* global window */

import Immutable from 'immutable';
import chaiImmutable from 'chai-immutable';

import { configKey } from '../../../src/helpers/configHelpers';
import { DATA_TYPE_STRUCTURED_DATE } from '../../../src/constants/dataTypes';
import { AutocompleteInput } from '../../../src/helpers/configContextInputs';

import {
  createInvocationData,
  getExportViewerPath,
  getReportViewerPath,
  loadInvocationDescriptor,
  normalizeInvocationDescriptor,
  storageKey,
  storeInvocationDescriptor,
} from '../../../src/helpers/invocationHelpers';

const { expect } = chai;

chai.use(chaiImmutable);

describe('invocationHelpers', () => {
  const config = {
    basename: 'base',
    recordTypes: {
      collectionobject: {
        serviceConfig: {
          objectName: 'CollectionObject',
        },
        fields: {
          document: {
            'ns2:collectionobjects_common': {
              fieldCollectionDateGroup: {
                [configKey]: {
                  dataType: DATA_TYPE_STRUCTURED_DATE,
                },
              },
              owner: {
                [configKey]: {
                  view: {
                    type: AutocompleteInput,
                    props: {
                      source: 'person/local,organization/local,organization/ulan',
                    },
                  },
                },
              },
              fieldCollectionPlace: {
                [configKey]: {
                  view: {
                    type: AutocompleteInput,
                    props: {
                      source: 'place/local,place/shared',
                    },
                  },
                },
              },
            },
          },
        },
      },
      person: {
        serviceConfig: {
          objectName: 'Person',
          servicePath: 'personauthorities',
        },
        vocabularies: {
          local: {
            serviceConfig: {
              servicePath: 'urn:cspace:name(local)',
            },
          },
        },
      },
      organization: {
        serviceConfig: {
          objectName: 'Organization',
          servicePath: 'orgauthorities',
        },
        vocabularies: {
          local: {
            serviceConfig: {
              servicePath: 'urn:cspace:name(local)',
            },
          },
          ulan: {
            serviceConfig: {
              servicePath: 'urn:cspace:name(ulan)',
            },
          },
        },
      },
      place: {
        serviceConfig: {
          objectName: 'Place',
          servicePath: 'placeauthorities',
        },
        vocabularies: {
          local: {
            serviceConfig: {
              servicePath: 'urn:cspace:name(local)',
            },
          },
          // shared intentionally omitted
        },
      },
    },
  };

  describe('createInvocationData', () => {
    it('should create invocation data for no context mode invocation descriptors', () => {
      const invocationDescriptor = Immutable.Map({
        mode: 'nocontext',
      });

      createInvocationData(config, invocationDescriptor).should.deep.equal({
        'ns2:invocationContext': {
          '@xmlns:ns2': 'http://collectionspace.org/services/common/invocable',
          mode: 'nocontext',
          docType: undefined,
          includeFields: undefined,
          outputMIME: undefined,
          params: undefined,
        },
      });
    });

    it('should create invocation data for single mode invocation descriptors', () => {
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
          includeFields: undefined,
          singleCSID: '1234',
          outputMIME: undefined,
          params: undefined,
        },
      });
    });

    it('should create invocation data for list mode invocation descriptors', () => {
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
          includeFields: undefined,
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

    it('should create invocation data for group mode invocation descriptors', () => {
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
          includeFields: undefined,
          outputMIME: undefined,
          params: undefined,
        },
      });
    });

    it('should convert include fields to part:xpath format', () => {
      const invocationDescriptor = Immutable.fromJS({
        mode: 'nocontext',
        includeFields: [
          'ns2:collectionobjects_common/objectNumber',
          'ns2:collectionobjects_common/titleGroupList/titleGroup/title',
        ],
      });

      createInvocationData(config, invocationDescriptor).should.deep.equal({
        'ns2:invocationContext': {
          '@xmlns:ns2': 'http://collectionspace.org/services/common/invocable',
          mode: 'nocontext',
          docType: undefined,
          includeFields: {
            field: [
              'collectionobjects_common:objectNumber',
              'collectionobjects_common:titleGroupList/titleGroup/title',
            ],
          },
          outputMIME: undefined,
          params: undefined,
        },
      });
    });

    it('should convert include fields that are structured date groups to use the display date', () => {
      const invocationDescriptor = Immutable.fromJS({
        mode: 'nocontext',
        recordType: 'collectionobject',
        includeFields: [
          'ns2:collectionobjects_common/fieldCollectionDateGroup',
        ],
      });

      createInvocationData(config, invocationDescriptor).should.deep.equal({
        'ns2:invocationContext': {
          '@xmlns:ns2': 'http://collectionspace.org/services/common/invocable',
          mode: 'nocontext',
          docType: 'CollectionObject',
          includeFields: {
            field: [
              {
                '@name': 'fieldCollectionDateGroup',
                '.': 'collectionobjects_common:fieldCollectionDateGroup/dateDisplayDate',
              },
            ],
          },
          outputMIME: undefined,
          params: undefined,
        },
      });
    });

    it('should convert include fields that are controlled by multiple vocabularies to separate fields for each vocabulary', () => {
      const invocationDescriptor = Immutable.fromJS({
        mode: 'nocontext',
        recordType: 'collectionobject',
        includeFields: [
          'ns2:collectionobjects_common/owner',
        ],
      });

      createInvocationData(config, invocationDescriptor).should.deep.equal({
        'ns2:invocationContext': {
          '@xmlns:ns2': 'http://collectionspace.org/services/common/invocable',
          mode: 'nocontext',
          docType: 'CollectionObject',
          includeFields: {
            field: [
              {
                '@name': 'ownerPersonLocal',
                '.': 'collectionobjects_common:owner[contains(., \':personauthorities:name(local):\')]',
              },
              {
                '@name': 'ownerOrganizationLocal',
                '.': 'collectionobjects_common:owner[contains(., \':orgauthorities:name(local):\')]',
              },
              {
                '@name': 'ownerOrganizationUlan',
                '.': 'collectionobjects_common:owner[contains(., \':orgauthorities:name(ulan):\')]',
              },
            ],
          },
          outputMIME: undefined,
          params: undefined,
        },
      });
    });

    it('should ignore vocabularies that are not defined when generating fields', () => {
      const invocationDescriptor = Immutable.fromJS({
        mode: 'nocontext',
        recordType: 'collectionobject',
        includeFields: [
          'ns2:collectionobjects_common/fieldCollectionPlace',
        ],
      });

      createInvocationData(config, invocationDescriptor).should.deep.equal({
        'ns2:invocationContext': {
          '@xmlns:ns2': 'http://collectionspace.org/services/common/invocable',
          mode: 'nocontext',
          docType: 'CollectionObject',
          includeFields: {
            field: [
              {
                '@name': 'fieldCollectionPlacePlaceLocal',
                '.': 'collectionobjects_common:fieldCollectionPlace[contains(., \':placeauthorities:name(local):\')]',
              },
            ],
          },
          outputMIME: undefined,
          params: undefined,
        },
      });
    });

    it('should convert params to key/value pairs', () => {
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
          includeFields: undefined,
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

    it('should convert array params to multiple key/value pairs with the same key', () => {
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
          includeFields: undefined,
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

  describe('normalizeInvocationDescriptor', () => {
    it('should return an immutable map if the invocation descriptor is undefined', () => {
      normalizeInvocationDescriptor().should.equal(Immutable.Map());
    });

    it('should set outputMIME to the outputMIME in the metadata if it is not set', () => {
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

    it('should set outputMIME to application/pdf if it is not set, and is also not set in the metadata', () => {
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

  describe('getReportViewerPath', () => {
    const reportCsid = '1234';

    const csid = '8888';
    const recordType = 'collectionobject';

    const invocationDescriptor = Immutable.Map({
      csid,
      recordType,
    });

    const params = {
      foo: 'abc',
    };

    it('should prepend the basename and \'report\' to the report csid, and add query parameters', () => {
      getReportViewerPath(config, reportCsid, invocationDescriptor, params).should
        .equal(`${config.basename}/report/${reportCsid}?csid=${csid}&recordType=${recordType}&params=%7B%22foo%22%3A%22abc%22%7D`);
    });

    it('should not prepend the basename if it is falsy', () => {
      const nullBasenameConfig = {
        ...config,
        basename: null,
      };

      getReportViewerPath(nullBasenameConfig, reportCsid, invocationDescriptor).should
        .equal(`/report/${reportCsid}?csid=${csid}&recordType=${recordType}`);
    });
  });

  describe('getExportViewerPath', () => {
    const csid = Immutable.List(['8888', '9999', '0000']);
    const recordType = 'collectionobject';
    const includeFields = Immutable.List(['title', 'name']);

    const invocationDescriptor = Immutable.Map({
      csid,
      recordType,
      includeFields,
    });

    /* eslint-disable max-len */
    // it('should prepend the basename and \'export\', and add query parameters', () => {
    //   getExportViewerPath(config, invocationDescriptor).should
    //     .equal(`${config.basename}/export?csid%5B%5D=${csid.get(0)}&csid%5B%5D=${csid.get(1)}&csid%5B%5D=${csid.get(2)}&recordType=${recordType}&includeFields%5B%5D=${includeFields.get(0)}&includeFields%5B%5D=${includeFields.get(1)}`);
    // });

    // it('should not prepend the basename if it is falsy', () => {
    //   const nullBasenameConfig = {
    //     ...config,
    //     basename: null,
    //   };

    //   getExportViewerPath(nullBasenameConfig, invocationDescriptor).should
    //     .equal(`/export?csid%5B%5D=${csid.get(0)}&csid%5B%5D=${csid.get(1)}&csid%5B%5D=${csid.get(2)}&recordType=${recordType}&includeFields%5B%5D=${includeFields.get(0)}&includeFields%5B%5D=${includeFields.get(1)}`);
    // });
    /* eslint-enable max-len */

    it('should concat the basename and \'export\'', () => {
      getExportViewerPath(config, invocationDescriptor).should
        .equal(`${config.basename}/export`);
    });

    it('should not prepend the basename if it is falsy', () => {
      const nullBasenameConfig = {
        ...config,
        basename: null,
      };

      getExportViewerPath(nullBasenameConfig, invocationDescriptor).should
        .equal('/export');
    });
  });

  describe('storeInvocationDescriptor', () => {
    it('should store the given invocation descriptor to local storage', () => {
      const invocationDescriptor = Immutable.fromJS({
        csid: [
          '8888',
          '9999',
        ],
        recordType: 'collectionobject',
        includeFields: [
          'title',
          'name',
        ],
      });

      storeInvocationDescriptor(invocationDescriptor);

      Immutable.fromJS(JSON.parse(window.localStorage.getItem(storageKey)))
        .should.equal(invocationDescriptor);
    });
  });

  describe('loadInvocationDescriptor', () => {
    it('should load the invocation descriptor from local storage', () => {
      const invocationDescriptor = Immutable.fromJS({
        csid: [
          '8888',
          '9999',
        ],
        recordType: 'collectionobject',
        includeFields: [
          'title',
          'name',
        ],
      });

      window.localStorage.setItem(storageKey, JSON.stringify(invocationDescriptor.toJS()));

      loadInvocationDescriptor().should.equal(invocationDescriptor);

      window.localStorage.getItem(storageKey).should.not.equal(null);
    });

    it('should return null if no invocation descriptor exists in local storage', () => {
      window.localStorage.removeItem(storageKey);

      expect(loadInvocationDescriptor()).to.equal(null);
    });

    it('should return null if the saved invocation descriptor is not valid JSON', () => {
      window.localStorage.setItem(storageKey, 'foo>bar');

      expect(loadInvocationDescriptor()).to.equal(null);
    });

    it('should delete the invocation descriptor from local storage if deleteAfterLoad is true', () => {
      const invocationDescriptor = Immutable.fromJS({
        csid: [
          '8888',
          '9999',
        ],
        recordType: 'collectionobject',
        includeFields: [
          'title',
          'name',
        ],
      });

      window.localStorage.setItem(storageKey, JSON.stringify(invocationDescriptor.toJS()));

      loadInvocationDescriptor(true).should.equal(invocationDescriptor);

      expect(window.localStorage.getItem(storageKey)).to.equal(null);
    });
  });
});
