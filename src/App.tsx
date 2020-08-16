import React from 'react';
import './App.css';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';
import ConflictsView from './conflicts/views/conflicts-view';
import { TagMerge } from './conflicts/components/tag-merge';
import { TagDiff } from './conflicts/models/tag-merge/tag-diff';

const App: React.FC = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = React.useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: prefersDarkMode ? 'dark' : 'light',
        },
      }),
    [prefersDarkMode]
  );

  const tags: TagDiff = {
    highway: { source: 'primary' },

    building: { source: 'commercial', target: 'park' },

    amenity: {
      target: 'cow shop',
    },
    random: {
      source: 'Random value',
      target: 'Random value'
    },
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* <ConflictsView /> */}
      <TagMerge tags={tags} />
    </ThemeProvider>
  );
};

export default App;
