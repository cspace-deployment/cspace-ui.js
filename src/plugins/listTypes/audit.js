import { defineMessages } from 'react-intl';

export default () => ({
  listTypes: {
    audit: {
      listNodeName: 'ns3:audit_common_list',
      itemNodeName: 'audit-list-item',
      messages: defineMessages({
        resultCount: {
          id: 'list.audit.resultCount',
          defaultMessage: `{totalItems, plural,
            =0 {No audit records}
            one {1 audit record}
            other {{startNum, number}–{endNum, number} of {totalItems, number} audit records}
          } found`,
        },
        searching: {
          id: 'list.audit.searching',
          defaultMessage: 'Finding audit records...',
        },
      }),
      normalizeListData: (data, listTypeConfig) => {
        // Make namespace prefixes consistent. audit_common_list is sometimes ns2 and sometimes
        // ns3. The other prefix is used for jaxb, but it's not needed.

        const [listNodeNsPrefix, listNodeName] = listTypeConfig.listNodeName.split(':', 2);
        const [rootNodeFullName, rootNodeData] = data.entrySeq().first();
        const [rootNodeNsPrefix, rootNodeName] = rootNodeFullName.split(':', 2);

        if (rootNodeName === listNodeName && rootNodeNsPrefix !== listNodeNsPrefix) {
          const rootNodeNsUri = rootNodeData.get(`@xmlns:${rootNodeNsPrefix}`);

          const updatedRootNodeData = rootNodeData
            .delete(`@xmlns:${rootNodeNsPrefix}`)
            .set(`@xmlns:${listNodeNsPrefix}`, rootNodeNsUri);

          const updatedData = data
            .delete(`${rootNodeNsPrefix}:${rootNodeName}`)
            .set(`${listNodeNsPrefix}:${listNodeName}`, updatedRootNodeData);

          return updatedData;
        }

        return data;
      },
      getItemLocationPath: (item) => {
        const csid = item.get('csid');

        return `/record/audit/${csid}`;
      },
    },
  },
});
