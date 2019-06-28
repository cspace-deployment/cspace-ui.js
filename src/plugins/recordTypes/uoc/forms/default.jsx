import { defineMessages } from 'react-intl';

const template = (configContext) => {
  const {
    React,
  } = configContext.lib;

  const {
    Col,
    Cols,
    Panel,
    Row,
  } = configContext.layoutComponents;

  const {
    Field,
    InputTable,
  } = configContext.recordComponents;

  return (
    <Field name="document">
      <Panel name="useOfCollections" collapsible>

        <Row>
          <Col>
            <Field name="referenceNumber" />
            <Field name="projectId" />
            <Field name="projectDescription" />
          </Col>

          <Col>
            <Field name="methodList">
              <Field name="method" />
            </Field>
          </Col>
        </Row>

        <Field name="title" />

        <Field name="authorizationGroupList">
          <Field name="authorizationGroup">
            <Field name="authorizedBy" />
            <Field name="authorizationDate" />
            <Field name="authorizationNote" />
            <Field name="authorizationStatus" />
          </Field>
        </Field>

        <Cols>
          <Col>
            <Field name="startSingleDateGroupList">
              <Field name="startSingleDateGroup" >
                <Field name="startSingleDate" />
                <Field name="numberOfVisitors" />
                <Field name="hoursSpent" />
              </Field>
            </Field>
            <Field name="endDate" />

            <Field name="userGroupList">
              <Field name="userGroup">
                <Field name="user" />
                <Field name="userType" />
                <Field name="userRole" />
                <Field name="userInstitution" />
              </Field>
            </Field>

            <Field name="locationList">
              <Field name="location" />
            </Field>
          </Col>

          <Col>
            <Field name="note" />
            <Field name="provisos" />
          </Col>
        </Cols>

        <Field name="result" />

        <Field name="citationGroupList">
          <Field name="citationGroup">
            <Field name="citation"/>
            <Field name="permanentId"/>
            <Field name="objectCited"/>
          </Field>
        </Field>

        <Field name="citationDescription" />

        <Cols>
          <Col>
            <Field name="dateRequested" />
            <Field name="dateFulfilled" />
          </Col>
          <Col />
        </Cols>

        <InputTable name="feeCharged">
          <Field name="feeAmount" />
          <Field name="feeNote" />
        </InputTable>

        <Field name="occasionList">
          <Field name="occasion"/>
        </Field>
      </Panel>
    </Field>
  );
};

export default configContext => ({
  messages: defineMessages({
    name: {
      id: 'form.uoc.default.name',
      defaultMessage: 'Standard Template',
    },
  }),
  template: template(configContext),
});
