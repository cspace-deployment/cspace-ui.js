import { defineMessages } from 'react-intl';

export default (configContext) => {
  const {
    CompoundInput,
    AutocompleteInput,
  } = configContext.inputComponents;

  const {
    configKey: config,
  } = configContext.configHelpers;

  return {
    document: { 
      [config]: {
        view: {
          type: CompoundInput,
        },
      },
      target: {
        [config]: {
          messages: defineMessages({
            name: {
              id: 'field.batch.Merge Authority Items.targetCSID.name',
              defaultMessage: 'Target record',
            },
          }),
          required: true,
          view: {
            type: AutocompleteInput,
            props: {
              disableAltTerms: true,
              source: 'citation/all,concept/all,organization/all,person/all,place/all,location/all,work/all',
              showQuickAdd: false,
            },
          },
        },
      },
    },
  };
};
