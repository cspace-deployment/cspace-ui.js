import React from 'react';
import configureMockStore from 'redux-mock-store';
import { createRenderer } from 'react-addons-test-utils';
import { components as inputComponents } from 'cspace-input';
import { ConnectedOptionListControlledInput } from '../../../../src/containers/input/OptionListControlledInputContainer';

chai.should();

const { OptionListControlledInput } = inputComponents;
const mockStore = configureMockStore([]);

describe('OptionListControlledInputContainer', function suite() {
  it('should set props on OptionListControlledInput', function test() {
    const optionListName = 'units';

    const options = [
      { value: 'cm', label: 'centimeters' },
    ];

    const store = mockStore({
      options: {
        [optionListName]: options,
      },
    });

    const context = {
      store,
      intl: {
        formatDate: () => null,
        formatTime: () => null,
        formatRelative: () => null,
        formatNumber: () => null,
        formatPlural: () => null,
        formatMessage: () => null,
        formatHTMLMessage: () => null,
        now: () => null,
      },
    };

    const shallowRenderer = createRenderer();

    shallowRenderer.render(
      <ConnectedOptionListControlledInput optionListName={optionListName} />, context);

    const result = shallowRenderer.getRenderOutput();

    result.type.should.equal(OptionListControlledInput);
    result.props.options.should.deep.equal(options);
  });
});