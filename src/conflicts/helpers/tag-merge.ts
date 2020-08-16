import { TagDiff } from '../models/tag-merge/tag-diff';
import { ConflictTagRowData } from '../models/tag-merge/row-data';
import { ChangeType } from '../../common/models/change-type';

const getChangetypeFromTag = (source?: string, target?: string): ChangeType => {
  if (source !== undefined && target !== undefined) {
    if (source === target) {
      return ChangeType.UNCHANGED;
    } else {
      return ChangeType.MODIFIED;
    }
  } else if (source === undefined) {
    return ChangeType.DELETED;
  } else {
    return ChangeType.CREATED;
  }
};

export const tagDiffToRowData = (tagDiff: TagDiff): ConflictTagRowData[] => {
  return Object.entries(tagDiff).map(([key, { source, target }]) => {
    const changeType = getChangetypeFromTag(source, target);
    if (changeType === ChangeType.UNCHANGED) {
      return {
        key,
        target,
        type: changeType,
      };
    }
    return {
      key,
      source,
      target,
      type: changeType,
      final: target,
    };
  });
};

export const rowDataToMergedTags = (
  rowData: ConflictTagRowData[]
): Record<string, string> => {
  const mergedTags: Record<string, string> = {};

  rowData.forEach((row) => {
    if (row.final !== undefined && row.final !== '') {
      mergedTags[row.key] = row.final;
    }
  });

  return mergedTags;
};
