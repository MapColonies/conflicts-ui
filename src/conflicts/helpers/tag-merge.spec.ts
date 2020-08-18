import { rowDataToMergedTags, tagDiffToRowData } from './tag-merge';
import { TagDiff } from '../models/tag-merge/tag-diff';
import { ConflictTagRowData } from '../models/tag-merge/row-data';
import { ChangeType } from '../../common/models/change-type';

it('should create row data with the correct types from tagDiff', () => {
  const tagDiff: TagDiff = {
    created: { source: 'a' },
    modified: { source: 'a', target: 'b' },
    deleted: { target: 'a' },
    unchanged: { source: 'a', target: 'a' },
  };

  const expectedRowData: ConflictTagRowData[] = [
    {key: 'created', type: ChangeType.CREATED, source:'a'},
    {key: 'modified', type: ChangeType.MODIFIED, final:'b', source:'a', target:'b'},
    {key: 'deleted', type: ChangeType.DELETED, final:'a', target:'a'},
    {key: 'unchanged', type: ChangeType.UNCHANGED, final:'a', source:'a', target:'a'}]

  const rowData = tagDiffToRowData(tagDiff);

  expect(rowData).toEqual(expectedRowData)
});

it('extract all the merged values from row data into an object', () => {
  const rowData:ConflictTagRowData[] = [{key:'a', type: ChangeType.CREATED, final:'a'},{key:'b',type: ChangeType.MODIFIED}];
  
  const mergedTags = rowDataToMergedTags(rowData);

  expect(mergedTags).toHaveProperty(rowData[0].key,rowData[0].final);
  expect(mergedTags).toHaveProperty(rowData[1].key, undefined);
});
