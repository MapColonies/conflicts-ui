import { types, Instance } from 'mobx-state-tree';
import { Geometry } from 'geojson';
import { isBefore } from 'date-fns';

export const conflictSearchParams = types
  .model({
    geojson: types.maybe(types.frozen<Geometry>()),
    from: types.maybe(types.Date),
    to: types.maybe(types.Date),
    resolved: types.maybe(types.boolean),
    keywords: types.array(types.string),
  })
  .views((self) => ({
    get isDateRangeValid(): boolean {
      return !(!!self.from && !!self.to && !isBefore(self.from, self.to));
    },
  }))
  .actions((self) => ({
    setLocation: function setLocation(geometry: Geometry): void {
      self.geojson = geometry;
    },

    setDateRange(from?: Date, to?: Date): void {
      self.from = from;
      self.to = to;
    },

    setResolved(isResolved?: boolean): void {
      self.resolved = isResolved;
    },

    setKeywords(keywords: string[]): void {
      self.keywords.replace(keywords);
    },

    resetLocation(): void {
      self.geojson = undefined;
    },
  }));

export interface IConflictSearchParams
  extends Instance<typeof conflictSearchParams> {}
