import React from 'react';
import { observer } from 'mobx-react-lite';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { CircularProgress, Typography } from '@map-colonies/react-core';
import { CellMetadata, SmartTable } from '@map-colonies/react-components';

import { useStore } from '../models/rootStore';
import { IConflict } from '../models/conflict';
import { ResponseState } from '../../common/models/ResponseState';
import ConflictItem from './conflict-item';

const SPACING = 2;

type ConflictsPerPage = 5 | 10;

const useStyle = makeStyles((theme: Theme) =>
  createStyles({
    infoContainer: {
      padding: theme.spacing(SPACING),
    },
    infoContent: {
      display: 'block',
      marginRight: 'auto',
      marginLeft: 'auto',
    },
  })
);

const cellsMetaData: CellMetadata<IConflict>[] = [
  {
    disablePadding: false,
    id: 'source_server',
    label: 'Source Server',
    numeric: false,
  },
  {
    disablePadding: false,
    id: 'target_server',
    label: 'Target Server',
    numeric: false,
  },
  {
    disablePadding: false,
    id: 'created_at',
    label: 'Created at',
    numeric: false,
    transform: (c: Date): string => c.toLocaleString(),
  },
];

export const ConflictsTable: React.FC = observer(() => {
  const classes = useStyle();
  const { conflictsStore } = useStore();

  if (conflictsStore.state === ResponseState.PENDING) {
    return (
      <div className={classes.infoContainer}>
        <CircularProgress size="xlarge" className={classes.infoContent} />
      </div>
    );
  } else if (conflictsStore.state === ResponseState.ERROR) {
    return (
      <div className={classes.infoContainer}>
        <Typography use="body1">
          Something went horribly wrong, please try again later
        </Typography>
      </div>
    );
  } else {
    return (
      <div>
        {
          <SmartTable
            rowsPerPage={
              conflictsStore.pagination.itemsPerPage as ConflictsPerPage
            }
            handleChangePage={(e, page): void =>
              conflictsStore.pagination.setPage(page)
            }
            handleChangeRowsPerPage={(e): void =>
              conflictsStore.pagination.setItemsPerPage(+e.target.value)
            }
            page={conflictsStore.pagination.page}
            count={conflictsStore.pagination.totalItemsCount}
            items={conflictsStore.conflicts as IConflict[]}
            isCollapseable={true}
            collapsedElement={(item): JSX.Element => (
              <ConflictItem conflict={item} />
            )}
            // placeholder for backend changes
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            onRequestSort={(): void => {}}
            cellsMetadata={cellsMetaData}
            // placeholder for backend changes
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            onRowSelected={(): void => {}}
            isDense={true}
          />
        }
      </div>
    );
  }
});
