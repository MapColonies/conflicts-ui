/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-magic-numbers */
import React, { useState, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import {
  ColDef,
  GridApi,
  CellClickedEvent,
  ColumnApi,
  ValueFormatterParams,
} from 'ag-grid-community';
import './tag-merge.css';

enum ChangeType {
  CREATED,
  MODIFIED,
  DELETED,
  UNCHANGED,
}

interface ConflictTag {
  key: string;
  source?: string;
  target: string | '';
  final?: string;
  type: ChangeType;
}

interface Params {
  data: ConflictTag;
  value: string;
}

const onCellClicked = (e: CellClickedEvent): void => {
  const data = e.data as ConflictTag;
  if (e.colDef.colId !== 'final' && data.type !== ChangeType.UNCHANGED) {
    const node = e.api.getRowNode(e.data.key);
    node.setDataValue('final', e.value);
  }
};

const typeColumnValueFormatter = (params: ValueFormatterParams): string => {
  const data = params.data as ConflictTag;
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
  const data = params.data as ConflictTag;
  const value = params.value as string;
  if (data.type === ChangeType.DELETED && data.final === '') {
    return data.target;
  } else {
    return value;
  }
};

const markCellAsSelected = (params: Params) => {
  return (
    params.data.final === params.value &&
    params.data.type !== ChangeType.UNCHANGED
  );
};

const tags: ConflictTag[] = [
  {
    key: 'highway',
    source: 'primary',
    final: '',
    type: ChangeType.CREATED,
    target: '',
  },
  {
    key: 'building',
    source: 'commercial',
    target: 'park',
    final: 'park',
    type: ChangeType.MODIFIED,
  },
  {
    key: 'Amenity',
    source: '',
    target: 'cow shop',
    final: 'cow shop',
    type: ChangeType.DELETED,
  },
  {
    key: 'another random tag',
    target: 'Random value',
    type: ChangeType.UNCHANGED,
  },
];

export const TagMerge: React.FC = () => {
  const [gridApi, setGridApi] = useState<GridApi>();
  const [columnApi, setColumnApi] = useState<ColumnApi>();
  const [rowData, setRowData] = useState(tags);
  const colDef: ColDef[] = [
    {
      headerName: '',
      valueFormatter: typeColumnValueFormatter,
      width: 20,
    },
    {
      headerName: '',
      field: 'key',
      cellClass: 'key',
    },
    {
      field: 'source',
      headerName: 'source',
      onCellClicked: onCellClicked,
      cellClass: 'source',
      cellClassRules: { selected: markCellAsSelected },
    },
    {
      field: 'target',
      headerName: 'target',
      onCellClicked: onCellClicked,
      cellClassRules: { selected: markCellAsSelected },
    },
    {
      field: 'final',
      headerName: 'merged',
      editable: true,
      cellClassRules: {
        'marked-for-delete': (params: Params): boolean => params.value === '',
      },
      valueFormatter: deletedMergedValueFormatter,
    },
  ];
  //   if (gridApi) {
  //       gridApi.coldef
  //   }
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
        onGridReady={(e): void => {
          setGridApi(e.api);
          setColumnApi(e.columnApi);
        }}
        rowClassRules={{
          'selected-target': (params: Params): boolean =>
            params.data.source === params.data.final,
          created: (params: Params): boolean =>
            params.data.type === ChangeType.CREATED,
          modified: (params: Params): boolean =>
            params.data.type === ChangeType.MODIFIED,
          deleted: (params: Params): boolean =>
            params.data.type === ChangeType.DELETED,
          // unchanged: (params: Params): boolean =>
          //   params.data.type === ChangeType.UNCHANGED,
        }}
        getRowNodeId={(data: ConflictTag): string => data.key}
      ></AgGridReact>
    </div>
  );
};
