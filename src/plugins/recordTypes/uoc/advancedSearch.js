export default (configContext) => {
  const {
    OP_EQ,
    OP_CONTAIN,
  } = configContext.searchOperators;

  const {
    defaultAdvancedSearchBooleanOp,
    extensions,
  } = configContext.config;

  return {
    op: defaultAdvancedSearchBooleanOp,
    value: [
      {
        op: OP_CONTAIN,
        path: 'ns2:uoc_common/referenceNumber',
      },
      {
        op: OP_EQ,
        path: 'ns2:uoc_common/userGroupList/userGroup/user',
      },
      {
        op: OP_EQ,
        path: 'ns2:uoc_common/authorizationGroupList/authorizationGroup/authorizedBy',
      },
      {
        op: OP_EQ,
        path: 'ns2:uoc_common/staffGroupList/staffGroup/staffName',
      },
      {
        op: OP_EQ,
        path: 'ns2:uoc_common/obligationsFulfilled',
      },
      ...extensions.core.advancedSearch,
    ],
  };
};
