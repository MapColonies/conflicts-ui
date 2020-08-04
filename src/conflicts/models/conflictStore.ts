/* eslint-disable camelcase */
import {
  types,
  Instance,
  flow,
  cast,
  getParent,
  onSnapshot,
  getSnapshot,
} from 'mobx-state-tree';
import { feature } from '@turf/helpers';
import { Feature } from 'geojson';
import { ApiHttpResponse } from '../../common/models/api-response';
import { PaginationResult } from '../../common/models/pagination-result';
import { ResponseState } from '../../common/models/ResponseState';
import { conflictSearchParams } from './conflict-search-params';
import { IRootStore } from './rootStore';
import { pagination } from './pagination';
import { Conflict, IConflict } from './conflict';

export type ConflictResponse = ApiHttpResponse<PaginationResult<IConflict[]>>;

const MILISECONDS_IN_SECOND = 1000;

const conflictFormatter = (conflict: IConflict): IConflict => {
  const newConflict = { ...conflict };
  newConflict.created_at = new Date(conflict.created_at);
  newConflict.updated_at = new Date(conflict.updated_at);
  newConflict.resolved_at = conflict.resolved_at
    ? new Date(conflict.resolved_at)
    : null;
  newConflict.deleted_at = conflict.deleted_at
    ? new Date(conflict.deleted_at)
    : null;
  return newConflict;
};

export const conflictStore = types
  .model({
    conflicts: types.array(Conflict),
    state: types.enumeration<ResponseState>(
      'State',
      Object.values(ResponseState)
    ),
    selectedConflict: types.safeReference(Conflict),
    searchParams: types.optional(conflictSearchParams, {}),
    pagination: types.optional(pagination, {}),
  })
  .views((self) => ({
    get conflictLocations(): Feature[] {
      return self.conflicts.map((conflict) => feature(conflict.location, {}));
    },
    get root(): IRootStore {
      return getParent(self);
    },
  }))
  .actions((self) => {
    const resetSelectedConflict = (): void => {
      self.selectedConflict = undefined;
    };

    const selectConflict = (conflict: IConflict): void => {
      self.selectedConflict = conflict;
    };

    const fetchConflicts: () => Promise<void> = flow(
      function* fetchConflicts(): Generator<
        Promise<ConflictResponse>,
        void,
        ConflictResponse
      > {
        self.conflicts = cast([]);
        self.state = ResponseState.PENDING;
        const snapshot = getSnapshot(self.searchParams);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const params: Record<string, unknown> = {};
        if (snapshot.from !== undefined) {
          params.from = Math.floor(snapshot.from / MILISECONDS_IN_SECOND);
        }
        if (snapshot.to !== undefined) {
          params.to = Math.floor(snapshot.to / MILISECONDS_IN_SECOND);
        }
        params.geojson = snapshot.geojson;
        params.resolved = snapshot.resolved;
        params.page = self.pagination.page + 1;
        params.limit = self.pagination.itemsPerPage;

        try {
          const result = yield self.root.fetch('/conflicts', params);
          const conflicts = result.data.data;
          resetSelectedConflict();
          self.conflicts.replace(conflicts.map(conflictFormatter));
          self.pagination.setTotalItems(result.data.total);
          self.state = ResponseState.DONE;
        } catch (error) {
          console.error(error);
          self.state = ResponseState.ERROR;
        }
      }
    );

    const afterCreate = (): void => {
      onSnapshot(self.searchParams, () => {
        if (self.searchParams.isDateRangeValid) {
          // @ts-ignore the property exist already, but because of mobx typescript doesn't recognise it.
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          self.fetchConflicts();
        }
      });
    };

    return {
      fetchConflicts,
      selectConflict,
      resetSelectedConflict,
      afterCreate,
    };
  });

export interface IConflictsStore extends Instance<typeof conflictStore> {}
