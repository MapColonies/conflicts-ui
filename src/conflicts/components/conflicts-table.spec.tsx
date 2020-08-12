import * as fs from 'fs';
import React from 'react';
import { mount } from 'enzyme';
import { when } from 'mobx';
import { act } from 'react-dom/test-utils';
import { Typography, CircularProgress } from '@map-colonies/react-core';

import { baseRootStore, StoreProvider } from '../models/rootStore';
import { ResponseState } from '../../common/models/ResponseState';
import ConflictItem from './conflict-item';
import { ConflictsTable } from './conflicts-table';
import { IConflict } from '../models/conflict';

console.error = jest.fn();

const originalWarn = console.warn.bind(console.warn);
beforeAll(() => {
  console.warn = (msg: string) =>
    !msg.toString().includes('observer batching') && originalWarn(msg);
});
afterAll(() => {
  console.warn = originalWarn;
});
const conflicts = JSON.parse(
  fs.readFileSync('./public/conflicts.json').toString()
) as IConflict[];
const conflictFetcher = async (): Promise<IConflict[]> =>
  Promise.resolve<IConflict[]>(conflicts);

it('render correctly and switch between status messages and content', async () => {
  expect.assertions(2);

  const mockStore = baseRootStore.create({}, { fetch: conflictFetcher });
  const wrapper = mount(
    <StoreProvider value={mockStore}>
      <ConflictsTable />
    </StoreProvider>
  );
  expect(wrapper.find(CircularProgress)).toHaveLength(1);
  await act(async () => mockStore.conflictsStore.fetchConflicts());
  await when(() => mockStore.conflictsStore.state === ResponseState.DONE);
  wrapper.update();
  expect(wrapper.exists(ConflictsTable)).toBeTruthy();
});

it("renders correctly and doesn't show any item if conflicts is empty", async () => {
  const mockStore = baseRootStore.create(
    {},
    { fetch: async () => Promise.resolve({ data: { data: [] } }) }
  );

  await mockStore.conflictsStore.fetchConflicts();

  await when(() => mockStore.conflictsStore.state === ResponseState.DONE);
  const wrapper = mount(
    <StoreProvider value={mockStore}>
      <ConflictsTable />
    </StoreProvider>
  );
  expect(wrapper.findWhere((n) => n.type() === ConflictItem)).toHaveLength(0);
});

it('shows an error message when there is an error fetching the conflicts', async () => {
  const mockStore = baseRootStore.create(
    {},
    {
      fetch: async () => Promise.reject(new Error()),
    }
  );

  await mockStore.conflictsStore.fetchConflicts();

  await when(() => mockStore.conflictsStore.state === ResponseState.ERROR);
  const wrapper = mount(
    <StoreProvider value={mockStore}>
      <ConflictsTable />
    </StoreProvider>
  );
  expect(wrapper.findWhere((n) => n.type() === ConflictItem)).toHaveLength(0);
  expect(wrapper.find(Typography).props()).toHaveProperty(
    'children',
    'Something went horribly wrong, please try again later'
  );
});
