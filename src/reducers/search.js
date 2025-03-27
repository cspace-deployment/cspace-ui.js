import Immutable from 'immutable';
import { asPairs, diff } from '../helpers/objectHelpers';

import {
  BATCH_INVOKE_FULFILLED,
  LOGIN_FULFILLED,
  LOGOUT_FULFILLED,
  RECORD_SAVE_FULFILLED,
  RECORD_DELETE_FULFILLED,
  RECORD_TRANSITION_FULFILLED,
  SUBRECORD_CREATED,
  CLEAR_SELECTED,
  CLEAR_SEARCH_RESULTS,
  SET_MOST_RECENT_SEARCH,
  CREATE_EMPTY_SEARCH_RESULT,
  SEARCH_STARTED,
  SEARCH_FULFILLED,
  SEARCH_REJECTED,
  SET_ALL_RESULT_ITEMS_SELECTED,
  SET_RESULT_ITEM_SELECTED,
  DESELECT_RESULT_ITEM,
} from '../constants/actionCodes';

import {
  SEARCH_RESULT_PAGE_SEARCH_NAME,
  RECORD_BATCH_PANEL_SEARCH_NAME,
  RECORD_REPORT_PANEL_SEARCH_NAME,
} from '../constants/searchNames';

import {
  deepGet,
} from '../helpers/recordDataHelpers';

/**
 * Generates a search key for a given search descriptor. All search descriptors that represent the
 * same search should have the same search key.
 */
export const searchKey = (searchDescriptor) => {
  // First convert the search descriptor to an array of name/value pairs, sorted by name. This
  // ensures that the key is not sensitive to the order in which properties are iterated out of the
  // search descriptor object.

  const pairs = asPairs(
    Immutable.Map.isMap(searchDescriptor) ? searchDescriptor.toJS() : searchDescriptor,
  );

  // Serialize the name/value pairs to JSON.

  return JSON.stringify(pairs);
};

const handleSetMostRecentSearch = (state, action) => {
  const {
    searchName,
    searchDescriptor,
  } = action.meta;

  const key = searchKey(searchDescriptor);
  const namedSearch = state.get(searchName);

  if (namedSearch && namedSearch.getIn(['byKey', key])) {
    return state.set(searchName, namedSearch.set('mostRecentKey', key));
  }

  return state;
};

const handleSearchStarted = (state, action) => {
  const {
    listTypeConfig,
    searchName,
    searchDescriptor,
  } = action.meta;

  const { listNodeName, itemNodeName } = listTypeConfig;

  const namedSearch = state.get(searchName) || Immutable.Map();

  const key = searchKey(searchDescriptor);
  const mostRecentKey = namedSearch.get('mostRecentKey');

  let updatedNamedSearch = namedSearch;
  let result = null;
  let itemsInPage = null;
  let totalItems = null;
  let items = null;

  if (mostRecentKey) {
    const mostRecentSearchState = namedSearch.getIn(['byKey', mostRecentKey]);
    const mostRecentSearchDescriptor = mostRecentSearchState.get('descriptor');

    const changes = diff(searchDescriptor.toJS(), mostRecentSearchDescriptor.toJS());
    const changeCount = Object.keys(changes).length;

    const pageChanged = 'searchQuery.p' in changes;
    const sortChanged = 'searchQuery.sort' in changes;
    const seqIDChanged = 'seqID' in changes;

    if (pageChanged && changeCount === 1) {
      // Only the page number changed from the last search. Seed these results with the total items
      // count from the previous results, since it probably will remain the same. This allows the
      // UI to render a smooth transition from this page to the next, without the count information
      // and pager blinking out.

      totalItems = mostRecentSearchState.getIn([
        'result', listNodeName, 'totalItems',
      ]);
    } else {
      // Something other than the page number changed from the last search. Clear out stored
      // search states. (If only the page number changed, keep the previous states around as a
      // cache so that flipping between pages will be fast.)

      updatedNamedSearch = updatedNamedSearch.set('byKey', Immutable.Map());

      if (sortChanged && changeCount === 1) {
        // Only the sort changed from the last search. As above, seed these results with the total
        // items count. Also seed the itemsInPage count, since this is not expected to change.

        totalItems = mostRecentSearchState.getIn([
          'result', listNodeName, 'totalItems',
        ]);

        itemsInPage = mostRecentSearchState.getIn([
          'result', listNodeName, 'itemsInPage',
        ]);
      } else if (seqIDChanged && changeCount === 1) {
        // Only the seq id changed from the last search. This means that the search parameters
        // themselves haven't changed, but the search is being triggered because the data may have
        // changed. Seed the result with the previous total items, items in page, and items. This
        // makes for the smoothest possible transition to the new result set.

        totalItems = mostRecentSearchState.getIn([
          'result', listNodeName, 'totalItems',
        ]);

        itemsInPage = mostRecentSearchState.getIn([
          'result', listNodeName, 'itemsInPage',
        ]);

        items = mostRecentSearchState.getIn([
          'result', listNodeName, itemNodeName,
        ]);
      }

      delete changes['searchQuery.p'];
      delete changes['searchQuery.size'];
      delete changes['searchQuery.sort'];
      delete changes.seqID;

      if (Object.keys(changes).length > 0) {
        // Something other than page num, page size, sort, or seq id changed. Clear selected items.
        updatedNamedSearch = updatedNamedSearch.delete('selected');
      }
    }
  }

  // Seed the search state with a blank result that has the page num and size of this search, and
  // the total items and items in page counts from the last search, if they're not expected to
  // change. This allows a blank result table to be rendered while the search is pending,
  // preventing a flash of empty content.

  const searchQuery = searchDescriptor.get('searchQuery');
  const p = searchQuery.get('p');
  const size = searchQuery.get('size');

  const pageNum = (typeof p === 'number') ? p.toString() : p;
  const pageSize = (typeof size === 'number') ? size.toString() : size;

  result = Immutable.fromJS({
    [listNodeName]: {
      itemsInPage,
      totalItems,
      pageNum,
      pageSize,
      [itemNodeName]: items,
    },
  });

  updatedNamedSearch = updatedNamedSearch
    .set('mostRecentKey', key)
    .setIn(['byKey', key], Immutable.fromJS({
      result,
      descriptor: searchDescriptor,
      isPending: true,
    }));

  return state.set(searchName, updatedNamedSearch);
};

const computeIndexesByCsid = (listTypeConfig, result) => {
  const { listNodeName, itemNodeName } = listTypeConfig;

  let indexesByCsid;
  let items = result.getIn([listNodeName, itemNodeName]);

  if (items) {
    if (!Immutable.List.isList(items)) {
      items = Immutable.List.of(items);
    }

    indexesByCsid = Immutable.Map(
      items.map((item, index) => [item.get('csid') || item.get('docId'), index]),
    );
  }

  return indexesByCsid;
};

const setSearchResult = (state, listTypeConfig, searchName, searchDescriptor, result) => {
  const namedSearch = state.get(searchName);
  const key = searchKey(searchDescriptor);

  if (namedSearch && namedSearch.hasIn(['byKey', key])) {
    const {
      itemNodeName,
      listNodeName,
      normalizeListData,
    } = listTypeConfig;

    const normalizedResult = normalizeListData
      ? normalizeListData(result, listTypeConfig)
      : result;

    const searchState = namedSearch.getIn(['byKey', key]);

    const updatedSearchState = searchState
      .set('isPending', false)
      .set('result', normalizedResult)
      .set('indexesByCsid', computeIndexesByCsid(listTypeConfig, normalizedResult))
      .set('listNodeName', listNodeName)
      .set('itemNodeName', itemNodeName)
      .delete('error')
      .delete('isDirty');

    const updatedNamedSearch = namedSearch.setIn(['byKey', key], updatedSearchState);

    return state.set(searchName, updatedNamedSearch);
  }

  return state;
};

const handleCreateEmptySearchResult = (state, action) => {
  const {
    listTypeConfig,
    searchName,
    searchDescriptor,
  } = action.meta;

  const searchQuery = searchDescriptor.get('searchQuery');
  const p = searchQuery.get('p');
  const size = searchQuery.get('size');

  const pageNum = (typeof p === 'number') ? p.toString() : p;
  const pageSize = (typeof size === 'number') ? size.toString() : size;

  const result = Immutable.fromJS({
    [listTypeConfig.listNodeName]: {
      itemsInPage: '0',
      totalItems: '0',
      pageNum,
      pageSize,
    },
  });

  return setSearchResult(state, listTypeConfig, searchName, searchDescriptor, result);
};

const handleSearchFulfilled = (state, action) => {
  const {
    listTypeConfig,
    searchName,
    searchDescriptor,
  } = action.meta;

  return setSearchResult(
    state, listTypeConfig, searchName, searchDescriptor, Immutable.fromJS(action.payload.data),
  );
};

const handleSearchRejected = (state, action) => {
  const {
    searchName,
    searchDescriptor,
  } = action.meta;

  const namedSearch = state.get(searchName);
  const key = searchKey(searchDescriptor);

  if (namedSearch && namedSearch.hasIn(['byKey', key])) {
    const updatedNamedSearch = namedSearch.setIn(['byKey', key], namedSearch.getIn(['byKey', key])
      .set('isPending', false)
      .set('error', Immutable.fromJS(action.payload))
      .delete('result')
      .delete('isDirty'));

    return state.set(searchName, updatedNamedSearch);
  }

  return state;
};

const handleSetAllResultItemsSelected = (state, action) => {
  const isSelected = action.payload;

  const {
    filter,
    listTypeConfig,
    searchName,
    searchDescriptor,
  } = action.meta;

  const { listNodeName, itemNodeName } = listTypeConfig;

  const namedSearch = state.get(searchName);

  if (namedSearch) {
    const key = searchKey(searchDescriptor);
    const path = ['byKey', key, 'result', listNodeName, itemNodeName];

    let items = namedSearch.getIn(path);

    if (!Immutable.List.isList(items)) {
      items = Immutable.List.of(items);
    }

    if (filter) {
      items = items.filter(filter);
    }

    const selectedItems = namedSearch.get('selected') || Immutable.Map();

    let updatedSelectedItems;

    if (isSelected) {
      updatedSelectedItems = selectedItems.withMutations(
        (map) => items.reduce((updatedMap, item) => updatedMap.set(item.get('csid'), item), map),
      );
    } else {
      updatedSelectedItems = selectedItems.withMutations(
        (map) => items.reduce((updatedMap, item) => updatedMap.delete(item.get('csid')), map),
      );
    }

    return state.set(searchName, namedSearch.set('selected', updatedSelectedItems));
  }

  return state;
};

const handleSetResultItemSelected = (state, action) => {
  const isSelected = action.payload;

  const {
    listTypeConfig,
    searchName,
    searchDescriptor,
    index,
  } = action.meta;

  const { listNodeName, itemNodeName } = listTypeConfig;

  const namedSearch = state.get(searchName);

  if (namedSearch) {
    const key = searchKey(searchDescriptor);
    const path = ['byKey', key, 'result', listNodeName, itemNodeName, index];
    const item = deepGet(namedSearch, path);

    const csid = item.get('csid');

    const updatedNamedSearch = isSelected
      ? namedSearch.setIn(['selected', csid], item)
      : namedSearch.deleteIn(['selected', csid]);

    return state.set(searchName, updatedNamedSearch);
  }

  return state;
};

const clearFilteredResults = (state, filter) => {
  let nextState = state;

  state.filter(filter).forEach((searchState, searchName) => {
    nextState = nextState.delete(searchName);
  });

  return nextState;
};

const clearNamedResults = (state, action) => state.delete(action.meta.searchName);

const clearAllResults = (state) => state.clear();

const handleRecordSaveFulfilled = (state) => {
  // We don't really know which search results will be affected by a record being created, so clear
  // them all, with the following exceptions:
  //  - The search result page. We want to keep those results so that if the current record has a
  //    search context, it won't be lost. Instead, the search result page results are only marked
  //    as dirty, so that the next time the page is viewed, the results can be cleared and
  //    reloaded at that point.
  //  - Report and batch panels. These probably won't be affected.

  let nextState = state;

  nextState = clearFilteredResults(nextState, (searchState, searchName) => (
    searchName !== SEARCH_RESULT_PAGE_SEARCH_NAME
    && searchName !== RECORD_BATCH_PANEL_SEARCH_NAME
    && searchName !== RECORD_REPORT_PANEL_SEARCH_NAME
  ));

  const searchResultPageState = nextState.get(SEARCH_RESULT_PAGE_SEARCH_NAME);

  if (searchResultPageState) {
    nextState = nextState.set(
      SEARCH_RESULT_PAGE_SEARCH_NAME, searchResultPageState.set('isDirty', true),
    );
  }

  return nextState;
};

const handleRecordDeleteFulfilled = (state) => clearAllResults(state);

const handleRecordTransitionFulfilled = (state, action) => {
  const {
    transitionName,
  } = action.meta;

  if (transitionName === 'delete') {
    return clearAllResults(state);
  }

  return state;
};

const handleLoginFulfilled = (state, action) => {
  const {
    prevUsername,
    username,
  } = action.meta;

  if (prevUsername !== username) {
    // The logged in user has changed. Remove all search state, because the new user may not be
    // permitted to list some records that the previous user could.

    return clearAllResults(state);
  }

  return state;
};

export default (state = Immutable.Map(), action) => {
  switch (action.type) {
    case BATCH_INVOKE_FULFILLED:
      if (action.meta.numAffected) {
        // We don't really know which search results were affected by the batch job invocation, so
        // clear them all.

        return clearAllResults(state);
      }

      return state;
    case CLEAR_SELECTED:
      return state.deleteIn([action.meta.searchName, 'selected']);
    case CLEAR_SEARCH_RESULTS:
      return clearNamedResults(state, action);
    case SET_MOST_RECENT_SEARCH:
      return handleSetMostRecentSearch(state, action);
    case CREATE_EMPTY_SEARCH_RESULT:
      return handleCreateEmptySearchResult(state, action);
    case SEARCH_STARTED:
      return handleSearchStarted(state, action);
    case SEARCH_FULFILLED:
      return handleSearchFulfilled(state, action);
    case SEARCH_REJECTED:
      return handleSearchRejected(state, action);
    case SET_ALL_RESULT_ITEMS_SELECTED:
      return handleSetAllResultItemsSelected(state, action);
    case SET_RESULT_ITEM_SELECTED:
      return handleSetResultItemSelected(state, action);
    case DESELECT_RESULT_ITEM:
      return state.deleteIn([action.meta.searchName, 'selected', action.meta.csid]);
    case SUBRECORD_CREATED:
      return clearNamedResults(state, action);
    case RECORD_SAVE_FULFILLED:
      return handleRecordSaveFulfilled(state, action);
    case RECORD_DELETE_FULFILLED:
      return handleRecordDeleteFulfilled(state, action);
    case RECORD_TRANSITION_FULFILLED:
      return handleRecordTransitionFulfilled(state, action);
    case LOGIN_FULFILLED:
      return handleLoginFulfilled(state, action);
    case LOGOUT_FULFILLED:
      return clearAllResults(state);
    default:
      return state;
  }
};

export const isDirty = (state, searchName) => state.getIn([searchName, 'isDirty']);

export const isPending = (state, searchName, searchDescriptor) => state.getIn([searchName, 'byKey', searchKey(searchDescriptor), 'isPending']);

export const getState = (state, searchName, searchDescriptor) => state.getIn([searchName, 'byKey', searchKey(searchDescriptor)]);

export const getIndexesByCsid = (state, searchName, searchDescriptor) => state.getIn([searchName, 'byKey', searchKey(searchDescriptor), 'indexesByCsid']);

export const getMostRecentDescriptor = (state, searchName) => state.getIn([searchName, 'byKey', state.getIn([searchName, 'mostRecentKey']), 'descriptor']);

export const getResult = (state, searchName, searchDescriptor) => state.getIn([searchName, 'byKey', searchKey(searchDescriptor), 'result']);

export const getError = (state, searchName, searchDescriptor) => state.getIn([searchName, 'byKey', searchKey(searchDescriptor), 'error']);

export const getSelectedItems = (state, searchName) => state.getIn([searchName, 'selected']);
