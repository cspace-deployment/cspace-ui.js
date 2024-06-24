import messages from '../../../../../src/plugins/recordTypes/exhibition/messages';

chai.should();

describe('exhibition record messages', () => {
  it('should contain properties with id and defaultMessage properties', () => {
    messages.should.be.an('object');

    Object.keys(messages).forEach((exhibitionName) => {
      const exhibitionMessages = messages[exhibitionName];

      Object.keys(exhibitionMessages).forEach((name) => {
        exhibitionMessages[name].should.contain.all.keys(['id', 'defaultMessage']);
      });
    });
  });
});
