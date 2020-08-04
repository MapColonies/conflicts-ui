import { Geometry } from 'geojson';
import { conflictSearchParams } from './conflict-search-params';

const geom: Geometry = {
  type: 'Polygon',
  coordinates: [
    [
      [0, 0],
      [0, 1],
      [1, 1],
      [1, 0],
      [0, 0],
    ],
  ],
};

it('isDateRangeValid returns true when both dates are undefined', () => {
  const store = conflictSearchParams.create({});

  expect(store.isDateRangeValid).toEqual(true);
});

it('isDateRangeValid returns true if only one date is defined', () => {
  const store = conflictSearchParams.create({ from: new Date() });

  expect(store.isDateRangeValid).toEqual(true);
});

it('isDateRangeValid returns false if both dates are defined, but from > to', () => {
  const epochTimestamp = 1595222000;
  const fromDate = new Date(epochTimestamp);
  const toDate = new Date(epochTimestamp);
  toDate.setDate(toDate.getDate() - 5);
  const store = conflictSearchParams.create({
    from: fromDate,
    to: toDate,
  });

  expect(store.isDateRangeValid).toBe(false);
});

it('isDateRangeValid returns false if both dates are defined, and from is before to', () => {
  const epochTimestamp = 1595222000;
  const fromDate = new Date(epochTimestamp);
  const toDate = new Date(epochTimestamp);
  toDate.setDate(toDate.getDate() + 5);
  const store = conflictSearchParams.create({
    from: fromDate,
    to: toDate,
  });

  expect(store.isDateRangeValid).toBe(true);
});

it('setLocation updates the geojson in the store', () => {
  const store = conflictSearchParams.create({});

  store.setLocation(geom);

  expect(store.geojson).toEqual(geom);
});

it('setDateRange updates the dates in the store', () => {
  const store = conflictSearchParams.create({});
  const from = new Date();
  const to = new Date();

  store.setDateRange(from, to);

  expect(store.from).toBe(from);
  expect(store.to).toBe(to);
});

it('setResolved updates resolved in the store', () => {
  const store = conflictSearchParams.create({});

  store.setResolved(true);

  expect(store.resolved).toBe(true);
});

it('setKeywords replaces the keywords in the store', () => {
  const store = conflictSearchParams.create({});
  const keywords = ['a', 'b', 'c'];

  store.setKeywords(keywords);

  expect(store.keywords).toEqual(keywords);
});

it('resetLocation sets geojson to be undefined', () => {
  const store = conflictSearchParams.create({ geojson: geom });

  store.resetLocation();

  expect(store.geojson).toBeUndefined();
});
