import messages from '../../../../../src/plugins/recordTypes/conditioncheck/messages';

chai.should();

describe('condition check record messages', () => {
  it('should contain properties with id and defaultMessage properties', () => {
    messages.should.be.an('object');

    Object.keys(messages).forEach((conditionCheckName) => {
      const conditionCheckMessages = messages[conditionCheckName];

      Object.keys(conditionCheckMessages).forEach((name) => {
        conditionCheckMessages[name].should.contain.all.keys(['id', 'defaultMessage']);
      });
    });
  });
});
