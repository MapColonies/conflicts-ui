import React from 'react';
import ReactDOM from 'react-dom';
import 'mobx-react-lite/batchingForReactDom';
import './index.css';
import Axios from 'axios';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { StoreProvider, rootStore } from './conflicts/models/rootStore';
import { ConflictResponse } from './conflicts/models/conflictStore';

const store = rootStore.create(
  {},
  {
    fetch: async (url: string, params: Record<string, unknown>) =>
      Axios.post(url, params).then((res) => res.data as ConflictResponse),
  }
);
ReactDOM.render(
  <React.StrictMode>
    <StoreProvider value={store}>
      <App />
    </StoreProvider>
  </React.StrictMode>
  ,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
