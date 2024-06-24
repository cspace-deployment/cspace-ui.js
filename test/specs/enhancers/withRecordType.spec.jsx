import React from 'react';
import { createRenderer } from 'react-test-renderer/shallow';

import withRecordType from '../../../src/enhancers/withRecordType';

chai.should();

describe('withRecordType', () => {
  it('should set recordType prop on the base component with recordType from context', () => {
    const recordType = 'object';

    const reactContext = {
      recordType,
    };

    const StubComponent = () => null;
    const EnhancedComponent = withRecordType(StubComponent);
    const shallowRenderer = createRenderer();

    shallowRenderer.render(<EnhancedComponent />, reactContext);

    const result = shallowRenderer.getRenderOutput();

    result.props.should.have.property('recordType', recordType);
  });
});
