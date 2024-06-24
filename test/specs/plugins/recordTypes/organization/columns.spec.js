import createColumns from '../../../../../src/plugins/recordTypes/organization/columns';
import createConfigContext from '../../../../../src/helpers/createConfigContext';

chai.should();

describe('organization record columns', () => {
  const configContext = createConfigContext();
  const columns = createColumns(configContext);

  const config = {
    optionLists: {
      orgTermStatuses: {
        messages: {
          value1: {
            id: 'option.orgTermStatuses.value1',
            defaultMessage: 'Value 1',
          },
        },
      },
    },
    recordTypes: {
      organization: {
        serviceConfig: {
          servicePath: 'organizationauthorities',
        },
        vocabularies: {
          local: {
            messages: {
              name: {
                id: 'vocab.organization.local.name',
              },
            },
            serviceConfig: {
              servicePath: 'urn:cspace:name(organization)',
            },
          },
          ulan: {
            messages: {
              name: {
                id: 'vocab.organization.ulan.name',
              },
            },
            serviceConfig: {
              servicePath: 'urn:cspace:name(ulan_oa)',
            },
          },
        },
      },
    },
  };

  const intl = {
    formatMessage: (message) => `formatted ${message.id}`,
  };

  it('should have correct shape', () => {
    columns.should.have.property('default').that.is.an('object');
  });

  it('should have vocabulary column that is formatted as a vocabulary name from a short id in a ref name', () => {
    const vocabularyColumn = columns.default.vocabulary;

    vocabularyColumn.should.have.property('formatValue').that.is.a('function');

    const refName = 'urn:cspace:core.collectionspace.org:organizationauthorities:name(organization):item:name(Lyrasis1484001439799)\'Lyrasis\'';

    vocabularyColumn.formatValue(refName, { intl, config }).should
      .equal('formatted vocab.organization.local.name');
  });

  it('should have term status column that is formatted as an option list value', () => {
    const termStatusColumn = columns.default.termStatus;

    termStatusColumn.should.have.property('formatValue').that.is.a('function');

    termStatusColumn.formatValue('value1', { intl, config }).should
      .equal('formatted option.orgTermStatuses.value1');
  });
});
