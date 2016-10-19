import React from 'react';
import configureMockStore from 'redux-mock-store';
import { createRenderer } from 'react-addons-test-utils';
import Immutable from 'immutable';
import RecordEditor from '../../../../src/components/record/RecordEditor';
import RecordEditorContainer from '../../../../src/containers/record/RecordEditorContainer';

import {
  ADD_FIELD_INSTANCE,
  DELETE_FIELD_VALUE,
  MOVE_FIELD_VALUE,
  SET_FIELD_VALUE,
} from '../../../../src/actions/record';

chai.should();

const mockStore = configureMockStore([]);

describe('RecordEditorContainer', function suite() {
  it('should set props on RecordEditor', function test() {
    const csid = '1234';
    const recordType = 'object';
    const data = Immutable.Map();
    const path = ['comments', 'comment'];

    const store = mockStore({
      record: {
        data: {
          [csid]: data,
        },
      },
    });

    const context = { store };
    const shallowRenderer = createRenderer();

    shallowRenderer.render(
      <RecordEditorContainer
        csid={csid}
        recordType={recordType}
      />, context);

    const result = shallowRenderer.getRenderOutput();

    result.type.should.equal(RecordEditor);
    result.props.should.have.property('data', data);
    result.props.should.have.property('onAddInstance').that.is.a('function');
    result.props.should.have.property('onCommit').that.is.a('function');
    result.props.should.have.property('onMoveInstance').that.is.a('function');
    result.props.should.have.property('onRemoveInstance').that.is.a('function');

    let action;

    result.props.onAddInstance(path);

    action = store.getActions()[0];

    action.should.have.property('type', ADD_FIELD_INSTANCE);
    action.should.have.deep.property('meta.csid', csid);
    action.should.have.deep.property('meta.path', path);

    result.props.onCommit(path, 'value');

    action = store.getActions()[1];

    action.should.have.property('type', SET_FIELD_VALUE);
    action.should.have.property('payload', 'value');
    action.should.have.deep.property('meta.csid', csid);
    action.should.have.deep.property('meta.path', path);

    result.props.onMoveInstance(path, '0');

    action = store.getActions()[2];

    action.should.have.property('type', MOVE_FIELD_VALUE);
    action.should.have.deep.property('meta.csid', csid);
    action.should.have.deep.property('meta.path', path);
    action.should.have.deep.property('meta.newPosition', '0');

    result.props.onRemoveInstance(path, '0');

    action = store.getActions()[3];

    action.should.have.property('type', DELETE_FIELD_VALUE);
    action.should.have.deep.property('meta.csid', csid);
    action.should.have.deep.property('meta.path', path);
  });
});