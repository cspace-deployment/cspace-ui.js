import mergeAuthorityItemsBatchJob from './org.collectionspace.services.batch.nuxeo.MergeAuthorityItemsBatchJob';
import updateInventoryStatusBatchJob from './org.collectionspace.services.batch.nuxeo.UpdateInventoryStatusBatchJob';
import  bulkObjectEditBatchJob from './org.collectionspace.services.batch.nuxeo.BulkObjectEditBatchJob';

export default [
  mergeAuthorityItemsBatchJob,
  updateInventoryStatusBatchJob,
  bulkObjectEditBatchJob,
];
