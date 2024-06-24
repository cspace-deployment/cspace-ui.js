import messages from '../../../../../src/plugins/recordTypes/intake/messages';

chai.should();

describe('intake record messages', () => {
  it('should contain properties with id and defaultMessage properties', () => {
    messages.should.be.an('object');

    Object.keys(messages).forEach((intakeName) => {
      const intakeMessages = messages[intakeName];

      Object.keys(intakeMessages).forEach((name) => {
        intakeMessages[name].should.contain.all.keys(['id', 'defaultMessage']);
      });
    });
  });
});
