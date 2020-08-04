import React, { useState } from 'react';
import { useStore } from '../models/rootStore';

export const KeywordsFilter: React.FC = () => {
  const { conflictsStore } = useStore();
  const [keywords, setKeywords] = useState('');
  const onClick = (): void => {
    conflictsStore.searchParams.setKeywords(keywords.split(','));
  };
  return (
    <div>
      <input
        value={keywords}
        onChange={(e): void => setKeywords(e.target.value)}
        type="text"
      />
      <button onClick={onClick}>set</button>
    </div>
  );
};
