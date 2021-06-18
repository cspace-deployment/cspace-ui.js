import { defineMessages } from 'react-intl';

const template = (configContext) => {
  const {
    React,
  } = configContext.lib;

  const {
    Panel,
    Row,
    Col,
    Cols,
  } = configContext.layoutComponents;

  const {
    Field,
  } = configContext.recordComponents;

  return (
    <Field name="ns3:audit_common">
      <Panel name="auditInfo">
        <Row>
          <Cols>
            <Col>
              <Field name="principal" />
              <Field name="eventType" />
              <Field name="eventDate" />
            </Col>
            <Col>
              <Field name="saveMessage" />
            </Col>
          </Cols>
        </Row>
      </Panel>

      <Panel name="changeInfo">
        <Cols>
          <Col>
            <Field name="resourceType" />
          </Col>
          <Col>
            <Field name="resourceCSID" />
          </Col>
        </Cols>

        <Panel name="fieldChangeInfo" collapsible collapsed>
          <Field name="fieldChangedGroupList">
            <Field name="fieldChangedGroup">
              <Cols>
                <Col>
                  <Field name="fieldName" />
                  <Field name="originalValue" />
                  <Field name="newValue" />
                  <Field name="changeReason" />
                </Col>
              </Cols>
            </Field>
          </Field>
        </Panel>

        <Field name="relationshipGroupList">
          <Field name="relationshipGroup">
            <Row>
              <Field name="relPredicate" />
              <Field name="relObjRecordType" />
              <Field name="relObjectTitle" />
              <Field name="relChange" />
            </Row>
          </Field>
        </Field>

        <Field name="relRecordChecksumList">
          <Field name="relRecordChecksum" />
        </Field>
      </Panel>
    </Field>
  );
};

export default (configContext) => ({
  messages: defineMessages({
    name: {
      id: 'form.audit.default.name',
      defaultMessage: 'Standard Template',
    },
  }),
  template: template(configContext),
});
