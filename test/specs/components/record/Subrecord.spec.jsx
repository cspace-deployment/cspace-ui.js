import React from 'react';
import { createRenderer } from 'react-test-renderer/shallow';
import SubrecordEditorContainer from '../../../../src/containers/record/SubrecordEditorContainer';
import Subrecord from '../../../../src/components/record/Subrecord';

const { expect } = chai;

chai.should();

describe('Subrecord', () => {
  const recordType = 'person';
  const csid = '1234';

  const subrecordName = 'contact';
  const subrecordType = 'contact';
  const subrecordVocabulary = 'foo';

  const subrecordConfig = {
    recordType: subrecordType,
    vocabulary: subrecordVocabulary,
  };

  const template = 'default';

  const config = {
    recordTypes: {
      [recordType]: {
        subrecords: {
          [subrecordName]: subrecordConfig,
        },
      },
    },
  };

  const context = {
    config,
    csid,
    recordType,
  };

  it('should render a SubrecordEditorContainer', () => {
    const shallowRenderer = createRenderer();

    shallowRenderer.render(
      <Subrecord
        name={subrecordName}
        template={template}
        showDetachButton
      />, context,
    );

    const result = shallowRenderer.getRenderOutput();

    result.type.should.equal(SubrecordEditorContainer);
    result.props.containerCsid.should.equal(csid);
    result.props.name.should.equal(subrecordName);
    result.props.config.should.equal(config);
    result.props.subrecordConfig.should.equal(subrecordConfig);
    result.props.formName.should.equal(template);
    result.props.showDetachButton.should.equal(true);
  });

  it('should render nothing if the named subrecord is not configured for the record type', () => {
    const shallowRenderer = createRenderer();

    shallowRenderer.render(
      <Subrecord
        name="badName"
        template={template}
      />, context,
    );

    const result = shallowRenderer.getRenderOutput();

    expect(result).to.equal(null);
  });
});
