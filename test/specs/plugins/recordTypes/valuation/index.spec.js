import valuationRecordTypePluginFactory from '../../../../../src/plugins/recordTypes/valuation';
import createConfigContext from '../../../../../src/helpers/createConfigContext';

chai.should();

describe('valuation record plugin', () => {
  const config = {};
  const valuationRecordTypePlugin = valuationRecordTypePluginFactory(config);
  const configContext = createConfigContext();

  it('should have the correct shape', () => {
    const pluginConfigContribution = valuationRecordTypePlugin(configContext);

    pluginConfigContribution.should.have.property('idGenerators').that.is.an('object');
    pluginConfigContribution.should.have.property('optionLists').that.is.an('object');

    const {
      recordTypes,
    } = pluginConfigContribution;

    recordTypes.should.have.property('valuation');

    const valuationRecordTypes = recordTypes.valuation;

    valuationRecordTypes.should.have.property('messages').that.is.an('object');
    valuationRecordTypes.should.have.property('serviceConfig').that.is.an('object');
    valuationRecordTypes.should.have.property('title').that.is.a('function');
    valuationRecordTypes.should.have.property('forms').that.is.a('object');
    valuationRecordTypes.should.have.property('fields').that.is.a('object');
    valuationRecordTypes.should.have.property('columns').that.is.an('object');
    valuationRecordTypes.should.have.property('advancedSearch').that.is.an('object');
  });
});
