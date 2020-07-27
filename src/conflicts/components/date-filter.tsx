import React from "react";
import { useStore } from "../models/rootStore";
import { Button, Popover } from "@material-ui/core";
import { observer } from "mobx-react-lite";
import { DateTimeRangePicker } from "@map-colonies/shared-components";

export const DateFilter: React.FC = observer(() => {
  const { conflictsStore } = useStore();
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const { from, to } = conflictsStore.searchParams;

  const open = Boolean(anchorEl);
  return (
    <>
      <Button variant="outlined" onClick={handleClick}>
        {from ? from.toLocaleString() : "Start of time"} -{" "}
        {to ? to.toLocaleString() : "End of time"}
      </Button>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        keepMounted
      >
        <DateTimeRangePicker
          onChange={({ from, to }) => {
            conflictsStore.searchParams.setDateRange(from, to);
            handleClose();
          }}
        />
      </Popover>
    </>
  );
});
