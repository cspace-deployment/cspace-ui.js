import { defineMessages } from 'react-intl';

export default (configContext) => {
  const {
    CompoundInput,
    DateInput,
    TextInput,
    AutocompleteInput,
    IDGeneratorInput,
    TermPickerInput,
    CheckboxInput,
    OptionPickerInput,
  } = configContext.inputComponents;

  const {
    configKey: config,
  } = configContext.configHelpers;

  const {
    DATA_TYPE_DATE,
    DATA_TYPE_INT,
    DATA_TYPE_FLOAT,
    DATA_TYPE_BOOL,
  } = configContext.dataTypes;

  const {
    extensions,
  } = configContext.config;

  return {
    document: {
      [config]: {
        view: {
          type: CompoundInput,
          props: {
            defaultChildSubpath: 'ns2:uoc_common',
          },
        },
      },
      ...extensions.core.fields,
      'ns2:uoc_common': {
        [config]: {
          service: {
            ns: 'http://collectionspace.org/services/uoc',
          },
        },
        referenceNumber: {
          [config]: {
            cloneable: false,
            messages: defineMessages({
              name: {
                id: 'field.uoc_common.referenceNumber.name',
                defaultMessage: 'Reference number',
              },
            }),
            required: true,
            searchView: {
              type: TextInput,
            },
            view: {
              type: IDGeneratorInput,
              props: {
                source: 'uoc',
              },
            },
          },
        },
        projectId: {
          [config]: {
            messages: defineMessages({
              name: {
                id: 'field.uoc_common.projectId.name',
                defaultMessage: 'Project ID',
              },
            }),
            view: {
              type: IDGeneratorInput,
              props: {
                source: 'proj',
              },
            },
          },
        },
        projectDescription: {
          [config]: {
            messages: defineMessages({
              name: {
                id: 'field.uoc_common.projectDescription.name',
                defaultMessage: 'Project Description',
              },
            }),
            view: {
              type: TextInput,
              props: {
                multiline: true,
              },
            },
          },
        },
        methodList: {
          [config]: {
            view: {
              type: CompoundInput,
            },
          },
          method: {
            [config]: {
              messages: defineMessages({
                name: {
                  id: 'field.uoc_common.method.name',
                  defaultMessage: 'Method',
                },
              }),
              repeating: true,
              view: {
                type: TermPickerInput,
                props: {
                  source: 'uocmethods',
                },
              },
            },
          },
        },
        title: {
          [config]: {
            cloneable: false,
            messages: defineMessages({
              name: {
                id: 'field.uoc_common.title.name',
                defaultMessage: 'Title',
              },
            }),
            view: {
              type: TextInput,
            },
          },
        },
        authorizationGroupList: {
          [config]: {
            view: {
              type: CompoundInput,
            },
          },
          authorizationGroup: {
            [config]: {
              messages: defineMessages({
                name: {
                  id: 'field.uoc_common.authorizationGroup.name',
                  defaultMessage: 'Authorization',
                },
              }),
              repeating: true,
              view: {
                type: CompoundInput,
                props: {
                  tabular: true,
                },
              },
            },
            authorizedBy: {
              [config]: {
                messages: defineMessages({
                  name: {
                    id: 'field.uoc_common.authorizedBy.name',
                    defaultMessage: 'Authorized by',
                  },
                }),
                view: {
                  type: AutocompleteInput,
                  props: {
                    source: 'person/local,person/shared',
                  },
                },
              },
            },
            authorizationDate: {
              [config]: {
                dataType: DATA_TYPE_DATE,
                messages: defineMessages({
                  fulName: {
                    id: 'field.uoc_common.authorizationDate.fulName',
                    defaultMessage: 'Authorization date',
                  },
                  name: {
                    id: 'field.uoc_common.authorizationDate.name',
                    defaultMessage: 'Date',
                  },
                }),
                view: {
                  type: DateInput,
                },
              },
            },
            authorizationNote: {
              [config]: {
                messages: defineMessages({
                  fullName: {
                    id: 'field.uoc_common.authorizationNote.fullName',
                    defaultMessage: 'Authorization note',
                  },
                  name: {
                    id: 'field.uoc_common.authorizationNote.name',
                    defaultMessage: 'Note',
                  },
                }),
                view: {
                  type: TextInput,
                },
              },
            },
            authorizationStatus: {
              [config]: {
                messages: defineMessages({
                  name: {
                    id: 'field.uoc_common.authorizationStatus.name',
                    defaultMessage: 'Status',
                  },
                }),
                view: {
                  type: TermPickerInput,
                  props: {
                    source: 'uocauthorizationstatuses',
                  },
                },
              },
            },
          },
        },
        useDateGroupList: {
          [config]: {
            view: {
              type: CompoundInput,
            },
          },
          useDateGroup: {
            [config]: {
              messages: defineMessages({
                name: {
                  id: 'field.uoc_common.useDateGroup.name',
                  defaultMessage: 'Use dates', // FIX ME
                },
              }),
              repeating: true,
              view: {
                type: CompoundInput,
                props: {
                  tabular: true,
                },
              },
            },
            useDate: {
              [config]: {
                dataType: DATA_TYPE_DATE,
                messages: defineMessages({
                  name: {
                    id: 'field.uoc_common.useDate.name',
                    defaultMessage: 'Date',
                  },
                }),
                view: {
                  type: DateInput,
                },
              },
            },
            useDateNumberOfVisitors: {
              [config]: {
                messages: defineMessages({
                  name: {
                    id: 'field.uoc_common.useDateNumberOfVisitors.name',
                    defaultMessage: 'No. of vistors',
                  },
                }),
                dataType: DATA_TYPE_INT,
                view: {
                  type: TextInput,
                },
              },
            },
            useDateHoursSpent: {
              [config]: {
                messages: defineMessages({
                  name: {
                    id: 'field.uoc_common.hoursSpent.name',
                    defaultMessage: 'Hours spent',
                  },
                }),
                dataType: DATA_TYPE_FLOAT,
                view: {
                  type: TextInput,
                },
              },
            },
            useDateVisitorNote: {
              [config]: {
                messages: defineMessages({
                  fullName: {
                    id: 'field.uoc_common.useDateVisitorNote.fullName',
                    defaultMessage: 'Visitor note',
                  },
                  name: {
                    id: 'field.uoc_common.useDateVisitorNote.name',
                    defaultMessage: 'Note',
                  },
                }),
                view: {
                  type: TextInput,
                },
              },  
            }
          },
        },
        endDate: {
          [config]: {
            dataType: DATA_TYPE_DATE,
            messages: defineMessages({
              name: {
                id: 'field.uoc_common.endDate.name',
                defaultMessage: 'End date',
              },
            }),
            view: {
              type: DateInput,
            },
          },
        },
        userGroupList: {
          [config]: {
            view: {
              type: CompoundInput,
            },
          },
          userGroup: {
            [config]: {
              messages: defineMessages({
                name: {
                  id: 'field.uoc_common.userGroup.name',
                  defaultMessage: 'User',
                },
              }),
              repeating: true,
              view: {
                type: CompoundInput,
                props: {
                  tabular: true,
                },
              },
            },
            user: {
              [config]: {
                messages: defineMessages({
                  fullName: {
                    id: 'field.uoc_common.user.fullName',
                    defaultMessage: 'User name',
                  },
                  name: {
                    id: 'field.uoc_common.user.name',
                    defaultMessage: 'Name',
                  },
                }),
                view: {
                  type: AutocompleteInput,
                  props: {
                    source: 'person/local,person/shared,organization/local,organization/shared',
                  },
                },
              },
            },
            userType: {
              [config]: {
                messages: defineMessages({
                  fullName: {
                    id: 'field.uoc_common.userType.fullName',
                    defaultMessage: 'User type',
                  },
                  name: {
                    id: 'field.uoc_common.userType.name',
                    defaultMessage: 'Type',
                  },
                }),
                view: {
                  type: TermPickerInput,
                  props: {
                    source: 'uocusertypes',
                  },
                },
              },
            },
            userRole: {
              [config]: {
                messages: defineMessages({
                  fullName: {
                    id: 'field.uoc_common.userRole.fullName',
                    defaultMessage: 'User role',
                  },
                  name: {
                    id: 'field.uoc_common.userRole.name',
                    defaultMessage: 'Role',
                  },
                }),
                view: {
                  type: TermPickerInput,
                  props: {
                    source: 'uocuserroles',
                  },
                },
              },
            },
            userInstitution: {
              [config]: {
                messages: defineMessages({
                  fullName: {
                    id: 'field.uoc_common.userInstitution.fullName',
                    defaultMessage: 'User institution',
                  },
                  name: {
                    id: 'field.uoc_common.userInstitution.name',
                    defaultMessage: 'Institution',
                  },
                }),
                view: {
                  type: AutocompleteInput,
                  props: {
                    source: 'organization/local,organization/all,organization/shared',
                  },
                },
              },
            },
          },
        },
        locationList: {
          [config]: {
            view: {
              type: CompoundInput,
            },
          },
          location: {
            [config]: {
              messages: defineMessages({
                name: {
                  id: 'field.uoc_common.location.name',
                  defaultMessage: 'Location',
                },
              }),
              repeating: true,
              view: {
                type: AutocompleteInput,
                props: {
                  source: 'organization/local,organization/shared,place/local,place/shared,location/local',
                },
              },
            },
          },
        },
        note: {
          [config]: {
            messages: defineMessages({
              name: {
                id: 'field.uoc_common.note.name',
                defaultMessage: 'Note',
              },
            }),
            view: {
              type: TextInput,
              props: {
                multiline: true,
              },
            },
          },
        },
        provisos: {
          [config]: {
            messages: defineMessages({
              name: {
                id: 'field.uoc_common.provisos.name',
                defaultMessage: 'Provisos',
              },
            }),
            view: {
              type: TextInput,
              props: {
                multiline: true,
              },
            },
          },
        },
        result: {
          [config]: {
            messages: defineMessages({
              name: {
                id: 'field.uoc_common.result.name',
                defaultMessage: 'Result',
              },
            }),
            view: {
              type: TextInput,
              props: {
                multiline: true,
              },
            },
          },
        },
        dateRequested: {
          [config]: {
            dataType: DATA_TYPE_DATE,
            messages: defineMessages({
              name: {
                id: 'field.uoc_common.dateRequested.name',
                defaultMessage: 'Date requested',
              },
            }),
            view: {
              type: DateInput,
            },
          },
        },
        dateFulfilled: {
          [config]: {
            dataType: DATA_TYPE_DATE,
            messages: defineMessages({
              name: {
                id: 'field.uoc_common.dateFulfilled.name',
                defaultMessage: 'Date fulfilled',
              },
            }),
            view: {
              type: DateInput,
            },
          },
        },
        feeAmount: {
          [config]: {
            dataType: DATA_TYPE_FLOAT,
            messages: defineMessages({
              fullName: {
                id: 'field.uoc_common.feeAmount.fullName',
                defaultMessage: 'Fee amount charged',
              },
              name: {
                id: 'field.uoc_common.feeAmount.name',
                defaultMessage: 'Amount',
              },
            }),
            view: {
              type: TextInput,
            },
          },    
        },
        feeNote: {
          [config]: {
            messages: defineMessages({
              fullName: {
                id: 'field.uoc_common.feeNote.fullName',
                defaultMessage: 'Fee note',
              },
              name: {
                id: 'field.uoc_common.feeNote.name',
                defaultMessage: 'Note',
              },
            }),
            view: {
              type: TextInput,
            },
          },
        },

        feePaid: {
          [config]: {
            messages: defineMessages({
              name: {
                id: 'field.uoc_common.feePaid.name',
                defaultMessage: 'Fee paid',
              }
            }),
            dataType: DATA_TYPE_BOOL,
            view: {
              type: CheckboxInput,
            },
          },
        },
        occasionList: {
          [config]: {
            view: {
              type: CompoundInput,
            },
          },
          occasion: {
            [config]: {
              messages: defineMessages({
                name: {
                  id: 'field.uoc_common.occasion.name',
                  defaultMessage: 'Occasion',
                },
              }),
              repeating: true,
              view: {
                type: TextInput,
              },
            },
          },
        },
        obligationsFulfilled: {
          [config]: {
            messages: defineMessages({
              name: {
                id: 'field.uoc_common.obligationsFulfilled.name',
                defaultMessage: 'Obligations fulfilled',
              }
            }),
            dataType: DATA_TYPE_BOOL,
            view: {
              type: CheckboxInput,
            },
          },
        },
        staffGroupList: {
          [config]: {
            view: {
              type: CompoundInput,
            },
          },
          staffGroup: {
            [config]: {
              messages: defineMessages({
                name: {
                  id: 'field.uoc_common.staffGroup.name',
                  defaultMessage: 'Staff',
                },
              }),
              repeating: true,
              view: {
                type: CompoundInput,
                props: {
                  tabular: true,
                },
              },
            },
            staffName: {
              [config]: {
                messages: defineMessages({
                  fullName: {
                    id: 'field.uoc_common.staffName.fullName',
                    defaultMessage: 'Staff name',
                  },
                  name: {
                    id: 'field.uoc_common.staffName.name',
                    defaultMessage: 'Name',
                  },
                }),
                view: {
                  type: AutocompleteInput,
                  props: {
                    source: 'person/local,person/shared,organization/local,organization/shared',
                  },
                },
              },
            },
            staffRole: {
              [config]: {
                messages: defineMessages({
                  fullName: {
                    id: 'field.uoc_common.staffRole.fullName',
                    defaultMessage: 'Staff role',
                  },
                  name: {
                    id: 'field.uoc_common.staffRole.name',
                    defaultMessage: 'Role',
                  }
                }),
                view: {
                  type: TermPickerInput,
                  props: {
                    source: 'uocstaffroles'
                  }
                },
              },
            },
            staffHours: {
              [config]: {
                messages: defineMessages({
                  fullName: {
                    id: 'field.uoc_common.staffHours.fullName',
                    defaultMessage: 'Staff hours spent',         
                  },
                  name: {
                    id: 'field.uoc_common.staffHours.name',
                    defaultMessage: 'Hours spent',
                  },
                }),
                dataType: DATA_TYPE_FLOAT,
                view: {
                  type: TextInput,
                },
              },
            },
            staffNote: {
              [config]: {
                messages: defineMessages({
                  name: {
                    id: 'field.uoc_common.staffNote.name',
                    defaultMessage: 'Staff note',
                  },
                }),
                view: {
                  type: TextInput,
                },
              },
            },
          },
        },
        collectionTypeList: {
          [config]: {
            view: {
              type: CompoundInput,
            },
          },
          collectionType: {
            [config]: {
              messages: defineMessages({
                name: {
                  id: 'field.uoc_common.collectionType.name',
                  defaultMessage: 'Collection type',
                },
              }),
              repeating: true,
              view: {
                type: TermPickerInput,
                props: {
                  source: 'uoccollectiontypes',
                },
              },
            },
          },
        },
        materialTypeList: {
          [config]: {
            view: {
              type: CompoundInput,
            },
          },
          materialType: {
            [config]: {
              messages: defineMessages({
                name: {
                  id: 'field.uoc_common.materialType.name',
                  defaultMessage: 'Material type',
                },
              }),
              repeating: true,
              view: {
                type: TermPickerInput,
                props: {
                  source: 'uocmaterialtypes',
                },
              },
            },
          },
        },
      },
    },
  };
};
