import { defineMessages } from 'react-intl';

import {
  getServicePath,
  getVocabularyShortID,
} from 'cspace-refname';

import {
  getRecordTypeConfigByServicePath,
  getVocabularyConfigByShortID,
} from '../../helpers/configHelpers';

import {
  canRead,
} from '../../helpers/permissionHelpers';

export default () => ({
  listTypes: {
    authRef: {
      listNodeName: 'ns3:authority-ref-list',
      itemNodeName: 'authority-ref-item',
      // NB: This is a list of terms, not records: a record may appear multiple times in the list,
      // if multiple synonyms are used by the record. The messages reflect this.
      messages: defineMessages({
        resultCount: {
          id: 'list.authRef.resultCount',
          defaultMessage: `{totalItems, plural,
            =0 {No terms}
            one {1 term}
            other {{startNum, number}–{endNum, number} of {totalItems, number} terms}
          } found`,
        },
        searching: {
          id: 'list.authRef.searching',
          defaultMessage: 'Finding terms...',
        },
      }),
      getItemLocationPath: (item, { config, perms }) => {
        const refName = item.get('refName');
        const servicePath = getServicePath(refName);
        const recordTypeConfig = getRecordTypeConfigByServicePath(config, servicePath);

        if (recordTypeConfig) {
          const recordType = recordTypeConfig.name;

          if (canRead(recordType, perms)) {
            const vocabularyShortID = getVocabularyShortID(refName);

            const vocabularyConfig = getVocabularyConfigByShortID(
              recordTypeConfig,
              vocabularyShortID,
            );

            if (vocabularyConfig) {
              const csid = item.get('csid');

              if (csid) {
                return `/record/${recordTypeConfig.name}/${vocabularyConfig.name}/${csid}`;
              }
            }
          }
        }

        return null;
      },
    },
  },
});
