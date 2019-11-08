import { connect } from 'react-redux';

import {
  addFieldInstance,
  moveFieldValue,
  setFieldValue,
  deleteFieldValue,
  sortFieldInstances,
} from '../../actions/record';

import RecordForm from '../../components/record/RecordForm';

const mapDispatchToProps = (dispatch, ownProps) => {
  const {
    config,
    csid,
    recordTypeConfig,
  } = ownProps;

  return {
    onAddInstance: (path, position) => {
      dispatch(addFieldInstance(recordTypeConfig, csid, path, position));
    },
    onCommit: (path, value) => {
      dispatch(setFieldValue(recordTypeConfig, csid, path, value));
    },
    onMoveInstance: (path, newPosition) => {
      dispatch(moveFieldValue(recordTypeConfig, csid, path, newPosition));
    },
    onRemoveInstance: (path) => {
      dispatch(deleteFieldValue(recordTypeConfig, csid, path));
    },
    onSortInstances: (path, byField) => {
      dispatch(sortFieldInstances(config, recordTypeConfig, csid, path, byField));
    },
  };
};

export default connect(
  undefined,
  mapDispatchToProps
)(RecordForm);
