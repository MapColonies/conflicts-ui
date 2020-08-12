import React from 'react';
import { Typography } from '@map-colonies/react-core';

import { IConflict } from '../models/conflict';

interface ConflictItemProps {
  conflict: IConflict;
}

const ConflictItem: React.FC<ConflictItemProps> = ({ conflict }) => {
  return (
    <div>
      <Typography use='subtitle1'>{'#' + conflict.id}</Typography>
      <div>{conflict.source_server}</div>
      <div>{conflict.target_server}</div>
      <div>{conflict.description}</div>
    </div>
  );
};

export default ConflictItem;
