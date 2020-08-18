import React from 'react';
import { observer } from 'mobx-react-lite';

import { Select } from '@map-colonies/react-core';

import { useStore } from '../models/rootStore';

const options: { [key: string]: boolean | undefined } = {
  all: undefined,
  resolved: true,
  open: false,
};

export const HasResolvedFilter: React.FC = observer(() => {
  const { conflictsStore } = useStore();
  const { searchParams } = conflictsStore;

  const onChange = (option: string): void => {
    const resolveStatus = options[option];
    searchParams.setResolved(resolveStatus);
  };

  return (
    <Select
      enhanced
      value={Object.keys(options).find((key) => options[key] === searchParams.resolved)}
      options={Object.keys(options).map((key) => key)}
      onChange={(e: React.ChangeEvent<HTMLSelectElement>): void => onChange(e.target.value)}
    />
  );
});
