import createColumns from '../../../../../src/plugins/recordTypes/exhibition/columns';
import createConfigContext from '../../../../../src/helpers/createConfigContext';

chai.should();

describe('exhibition record columns', () => {
  const configContext = createConfigContext();
  const columns = createColumns(configContext);

  it('should have the correct shape', () => {
    columns.should.have.property('default').that.is.an('object');
  });
});
