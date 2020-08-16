import React, { useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import {
  ColDef,
  CellClickedEvent,
  ValueFormatterParams,
  IsColumnFuncParams,
  ValueParserParams,
} from 'ag-grid-community';
import './tag-merge.css';
import { ConflictTagRowData } from '../models/tag-merge/row-data';
import { ChangeType } from '../../common/models/change-type';
import { TagDiff } from '../models/tag-merge/tag-diff';
import { tagDiffToRowData, rowDataToMergedTags } from '../helpers/tag-merge';

interface RowClassRulesParams {
  data: ConflictTagRowData;
  value: string;
}

const allDataCellClass = 'cells';

const onCellClicked = (e: CellClickedEvent): void => {
  const data = e.data as ConflictTagRowData;
  if (e.colDef.colId !== 'final' && data.type !== ChangeType.UNCHANGED) {
    const node = e.api.getRowNode(data.key);
    node.setDataValue('final', e.value);
  }
};

const changeTypeColumnValueFormatter = (params: ValueFormatterParams): string => {
  const data = params.data as ConflictTagRowData;
  switch (data.type) {
    case ChangeType.CREATED:
      return 'C';
    case ChangeType.MODIFIED:
      return 'M';
    case ChangeType.DELETED:
      return 'D';
    case ChangeType.UNCHANGED:
      return 'U';
  }
};

const deletedMergedValueFormatter = (params: ValueFormatterParams): string => {
  const data = params.data as ConflictTagRowData;
  const value = params.value as string;
  if (data.type === ChangeType.DELETED && data.final === '') {
    return data.target ?? '';
  } else {
    return value;
  }
};

const markCellAsSelected = (params: RowClassRulesParams): boolean => {
  return (
    params.data.final === params.value &&
    params.data.type !== ChangeType.UNCHANGED
  );
};

const mergedValueParser = (params: ValueParserParams): string => {
  if (params.newValue === undefined) {
    return '';
  }
  return params.newValue as string;
};

const colDef: ColDef[] = [
  {
    headerName: '',
    valueFormatter: changeTypeColumnValueFormatter,
    width: 20,
  },
  {
    headerName: '',
    field: 'key',
    cellClass: ['key'],
  },
  {
    headerName: 'source',
    field: 'source',
    cellClass: [allDataCellClass],
    cellClassRules: { selected: markCellAsSelected },
    onCellClicked: onCellClicked,
  },
  {
    field: 'target',
    headerName: 'target',
    cellClass: allDataCellClass,
    cellClassRules: { selected: markCellAsSelected },
    onCellClicked: onCellClicked,
  },
  {
    field: 'final',
    headerName: 'merged',
    valueParser: mergedValueParser,
    editable: (params: IsColumnFuncParams):boolean => {
      const data = params.data as ConflictTagRowData;
      return data.type === ChangeType.CREATED || data.type === ChangeType.MODIFIED
    },
    cellClass: allDataCellClass,
    cellClassRules: {
      'marked-for-delete': (params: RowClassRulesParams): boolean => params.value === '',
    },
    valueFormatter: deletedMergedValueFormatter,
  },
];

const gridRowClassRules = {
  'selected-target': (params: RowClassRulesParams): boolean =>
    params.data.source === params.data.final,
  created: (params: RowClassRulesParams): boolean =>
    params.data.type === ChangeType.CREATED,
  modified: (params: RowClassRulesParams): boolean =>
    params.data.type === ChangeType.MODIFIED,
  deleted: (params: RowClassRulesParams): boolean =>
    params.data.type === ChangeType.DELETED,
}

interface TagMergeProps {
  tags: TagDiff;
  onValueChange?: (mergedTags: {[key:string]:string}) => void
}

export const TagMerge: React.FC<TagMergeProps> = (props) => {
  // const [gridApi, setGridApi] = useState<GridApi>();
  // const [columnApi, setColumnApi] = useState<ColumnApi>();
  const [rowData, setRowData] = useState(tagDiffToRowData(props.tags));

  return (
    <div
      className="ag-theme-alpine"
      style={{
        height: '250px',
        width: '850px',
      }}
    >
      <AgGridReact
        columnDefs={colDef}
        rowData={rowData}
        // onGridReady={(e): void => {
        //   setGridApi(e.api);
        //   setColumnApi(e.columnApi);
        // }}
        onCellValueChanged={() => props.onValueChange?.(rowDataToMergedTags(rowData))}
        rowClassRules={gridRowClassRules}
        getRowNodeId={(data: ConflictTagRowData): string => data.key}
      ></AgGridReact>
    </div>
  );
};
