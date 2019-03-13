import { defineMessages } from 'react-intl';

const template = (configContext) => {
  const {
    React,
  } = configContext.lib;

  const {
    Field,
  } = configContext.recordComponents;

  return (
    <Field name="document">
      <Field name="location" />
    </Field>
  );
};

export default configContext => ({
  messages: defineMessages({
    name: {
      id: 'form.report.ucbgDiedInLocation.default.name',
      defaultMessage: 'Standard Template',
    },
  }),
  sortOrder: 0,
  template: template(configContext),
});
