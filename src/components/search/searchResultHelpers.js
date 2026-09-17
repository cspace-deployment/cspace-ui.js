import Immutable from 'immutable';
import get from 'lodash/get';

// todo: where should this live?

/**
 * Get the column configuration from the main config. This uses the search descriptor in order
 * to read the recordType or subresource which we're trying to display columnar data for. This
 * is derived from the columns.js files for each procedure.
 *
 * @param {object} config           The cspace config
 * @param {object} searchDescriptor The search descriptor for the current search
 * @param {string} columnSetName    The column set, e.g. default, narrow, etc
 * @returns The configuration for the column set
 */
export function getColumnConfig(config, searchDescriptor, columnSetName) {
  const recordType = searchDescriptor.get('recordType');
  const subresource = searchDescriptor.get('subresource');

  const columnConfigurer = subresource
    ? config.subresources[subresource]
    : config.recordTypes[recordType];

  let columnConfig = get(columnConfigurer, ['columns', columnSetName]);

  if (!columnConfig && columnSetName !== 'default') {
    // Fall back to the default column set if the named one doesn't exist.

    columnConfig = get(columnConfigurer, ['columns', 'default']);
  }

  if (!columnConfig) {
    columnConfig = [];
  }

  return columnConfig;
}

/**
 * Extract the search result list items from a given search result.
 *
 * @param {*} config       The cspace config
 * @param {*} listType     The listType, e.g. abstract-common-list
 * @param {*} searchResult The response object from the search
 * @returns An Immutable.List containing the items for a search
 */
export function readListItems(config, listType, searchResult) {
  if (!searchResult) {
    return {
      list: null,
      items: null,
    };
  }

  const listTypeConfig = config.listTypes[listType];
  const { listNodeName, itemNodeName } = listTypeConfig;

  const list = searchResult.get(listNodeName) || Immutable.Map();
  let items = list.get(itemNodeName);
  if (!items) {
    items = Immutable.List();
  }

  if (!Immutable.List.isList(items)) {
    // If there's only one result, it won't be returned as a list.
    items = Immutable.List.of(items);
  }

  return {
    list,
    items,
  };
}

/**
 * Get the value of a column from a list item. The dataKey may be a single key, or a pipe-separated
 * list of keys to try in order (e.g. 'objectName|title|taxon'); the value of the first key that
 * has a non-empty value is returned. If no key has a value, null is returned.
 *
 * @param {Immutable.Map} item The list item
 * @param {string} dataKey     The column data key, possibly pipe-separated
 * @returns The value for the column, or null
 */
export function getItemValue(item, dataKey) {
  if (!item || !dataKey) {
    return null;
  }

  const keys = dataKey.split('|');

  for (let i = 0; i < keys.length; i += 1) {
    const value = item.get(keys[i]);

    if (value) {
      return value;
    }
  }

  return null;
}

/**
 * Determine if a column can be sorted on for a given search. A column is sortable if the search
 * action can resolve its name to a services sortBy, either through the column's own sortBy or
 * through the record type's sort config. As in SearchResultTable, a field in a repeating group
 * can't be sorted on when searching for related records.
 *
 * @param {object} config           The cspace config
 * @param {object} searchDescriptor The search descriptor for the current search
 * @param {string} columnName       The column name
 * @param {string} columnSetName    The column set, e.g. default, narrow, etc
 * @returns true if the column is sortable; false otherwise
 */
export function isColumnSortable(config, searchDescriptor, columnName, columnSetName = 'default') {
  const recordType = searchDescriptor.get('recordType');

  // Same precedence as getSortParam in actions/search.js: the column's own sortBy first, then
  // the record type's sort config.
  const sortBy = get(config,
    ['recordTypes', recordType, 'columns', columnSetName, columnName, 'sortBy'])
    || get(config, ['recordTypes', recordType, 'sort', columnName, 'sortBy']);

  if (!sortBy) {
    return false;
  }

  return (!searchDescriptor.getIn(['searchQuery', 'rel']) || sortBy.indexOf('/0/') === -1);
}
