import React from 'react';
import './App.css';

// Import from react core components
import { ThemeProvider as RMWCThemeProvider, RMWCProvider, Themes } from '@map-colonies/react-core';
import { CssBaseline } from '@map-colonies/react-components';
import { useMediaQuery } from '@map-colonies/react-components';
import '@map-colonies/react-core/dist/theme/styles';
import '@map-colonies/react-core/dist/button/styles';
import '@map-colonies/react-core/dist/tooltip/styles';
import '@map-colonies/react-core/dist/menu/styles';
import '@map-colonies/react-core/dist/select/styles';
import '@map-colonies/react-core/dist/circular-progress/styles';
import '@map-colonies/react-core/dist/typography/styles';

import ConflictsView from './conflicts/views/conflicts-view';

const App: React.FC = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const theme = prefersDarkMode ? Themes.darkTheme : Themes.lightTheme;

  return (
    <RMWCProvider 
      typography={{
        body1: 'p'
      }}
    >
      <RMWCThemeProvider options={theme}>
        <CssBaseline />
        <ConflictsView />
      </RMWCThemeProvider>
    </RMWCProvider>
  );
};

export default App;
