import * as fs from 'fs';
import { when } from 'mobx';
import { rootStore } from './rootStore';
import { IConflict } from './conflict';

console.error = jest.fn();

const locations = [
  {
    properties: {},
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [35.2137, 31.7683],
    },
  },
  {
    properties: {},
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [34.7818, 32.0853],
    },
  },
  {
    properties: {},
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [34.9896, 32.794],
    },
  },
];

const conflicts: IConflict[] = JSON.parse(
  fs.readFileSync('./public/conflicts.json').toString()
) as IConflict[];
const conflictFetcher = async (): Promise<IConflict[]> =>
  Promise.resolve<IConflict[]>(conflicts);

it('return an array of features of the conflicts location', async () => {
  const { conflictsStore } = rootStore.create({}, { fetch: conflictFetcher });

  await when(() => conflictsStore.state === 'done');
  const result = conflictsStore.conflictLocations;

  expect(result).toEqual(locations);
});

it('sets the selected conflict to the correct value', () => {
  const { conflictsStore } = rootStore.create({}, { fetch: conflictFetcher });
  conflictsStore.selectConflict(conflicts[0]);

  conflictsStore.resetSelectedConflict();

  expect(conflictsStore.selectedConflict).toBeUndefined();
});

it('resetSelection set the selected conflict to undefined', () => {
  const { conflictsStore } = rootStore.create({}, { fetch: conflictFetcher });
  conflictsStore.selectConflict(conflicts[0]);

  conflictsStore.resetSelectedConflict();

  expect(conflictsStore.selectedConflict).toBeUndefined();
});

it('format and set the conflicts, and set state to done on fetch', async () => {
  expect.assertions(2);
  const { conflictsStore } = rootStore.create({}, { fetch: conflictFetcher });

  await conflictsStore.fetchConflicts();

  expect(conflictsStore.state).toEqual('done');
  expect(conflictsStore.conflicts).toHaveLength(3);
});

it('set state to error when there is an error fetching the conflicts', async () => {
  expect.assertions(1);
  const { conflictsStore } = rootStore.create(
    {},
    { fetch: async () => Promise.reject(new Error()) }
  );

  await conflictsStore.fetchConflicts();

  expect(conflictsStore.state).toEqual('error');
});
