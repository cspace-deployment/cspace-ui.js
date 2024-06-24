import Immutable from 'immutable';
import createTitleGetter from '../../../../../src/plugins/recordTypes/acquisition/title';
import createConfigContext from '../../../../../src/helpers/createConfigContext';

chai.should();

describe('acquisition record title', () => {
  const configContext = createConfigContext();
  const title = createTitleGetter(configContext);

  it('should concat the acquisition reference number and acquisition source', () => {
    const data = Immutable.fromJS({
      document: {
        'ns2:acquisitions_common': {
          acquisitionReferenceNumber: 'AC.2017.2',
          acquisitionSources: {
            acquisitionSource: [
              'urn:cspace:core.collectionspace.org:personauthorities:name(person):item:name(DavidBowie1480570017652)\'David Bowie\'',
              'urn:cspace:core.collectionspace.org:personauthorities:name(person):item:name(BruceSpringsteen1480570017652)\'Bruce Springsteen\'',
            ],
          },
        },
      },
    });

    title(data).should.equal('AC.2017.2 – David Bowie');
  });

  it('should return the acquisition reference number when acquisition source is empty', () => {
    const data = Immutable.fromJS({
      document: {
        'ns2:acquisitions_common': {
          acquisitionReferenceNumber: 'AC.2017.2',
          acquisitionSources: {},
        },
      },
    });

    title(data).should.equal('AC.2017.2');
  });

  it('should return the acquisition source when the acquisition reference number is empty', () => {
    const data = Immutable.fromJS({
      document: {
        'ns2:acquisitions_common': {
          acquisitionReferenceNumber: '',
          acquisitionSources: {
            acquisitionSource: [
              'urn:cspace:core.collectionspace.org:personauthorities:name(person):item:name(DavidBowie1480570017652)\'David Bowie\'',
              'urn:cspace:core.collectionspace.org:personauthorities:name(person):item:name(BruceSpringsteen1480570017652)\'Bruce Springsteen\'',
            ],
          },
        },
      },
    });

    title(data).should.equal('David Bowie');
  });

  it('should return empty string if no data is passed', () => {
    title(null).should.equal('');
    title(undefined).should.equal('');
  });

  it('should return empty string if the common part is not present', () => {
    const data = Immutable.fromJS({
      document: {
        'ns2:acquisitions_extension': {
          acquisitionReferenceNumber: 'AC.2017.2',
          acquisitionSources: {
            acquisitionSource: [
              'urn:cspace:core.collectionspace.org:personauthorities:name(person):item:name(DavidBowie1480570017652)\'David Bowie\'',
              'urn:cspace:core.collectionspace.org:personauthorities:name(person):item:name(BruceSpringsteen1480570017652)\'Bruce Springsteen\'',
            ],
          },
        },
      },
    });

    title(data).should.equal('');
  });
});
