import React from 'react';
import { observer } from 'mobx-react-lite';

import { Popover } from '@map-colonies/react-components';
import { DateTimeRangePicker } from '@map-colonies/react-components';
import { Button } from '@map-colonies/react-core';

import { useStore } from '../models/rootStore';

export const DateFilter: React.FC = observer(() => {
  const { conflictsStore } = useStore();
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (): void => {
    setAnchorEl(null);
  };

  const { from, to } = conflictsStore.searchParams;

  const open = Boolean(anchorEl);
  return (
    <>
      <Button 
        raised 
        onClick={handleClick}
      > 
        {from ? from.toLocaleString() : 'Start of time'} -{' '}
        {to ? to.toLocaleString() : 'End of time'}
      </Button>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        keepMounted
      >
        <DateTimeRangePicker
          onChange={({ from, to }): void => {
            conflictsStore.searchParams.setDateRange(from, to);
            handleClose();
          }}
        />
      </Popover>
    </>
  );
});
