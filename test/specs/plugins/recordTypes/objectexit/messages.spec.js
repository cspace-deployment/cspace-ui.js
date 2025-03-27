import messages from '../../../../../src/plugins/recordTypes/objectexit/messages';

chai.should();

describe('object exit record messages', () => {
  it('should contain properties with id and defaultMessage properties', () => {
    messages.should.be.an('object');

    Object.keys(messages).forEach((objectExitName) => {
      const objectExitMessages = messages[objectExitName];

      Object.keys(objectExitMessages).forEach((name) => {
        objectExitMessages[name].should.contain.all.keys(['id', 'defaultMessage']);
      });
    });
  });
});
