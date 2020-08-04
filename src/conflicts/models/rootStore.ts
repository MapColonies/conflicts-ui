import { types, Instance, getEnv, onAction } from 'mobx-state-tree';
import { useContext, createContext } from 'react';
import { ResponseState } from '../../common/models/ResponseState';
import { conflictStore, ConflictResponse } from './conflictStore';

type FetchConflicts = (
  url: string,
  params: Record<string, unknown>
) => Promise<ConflictResponse>;

export const baseRootStore = types
  .model({
    conflictsStore: types.optional(conflictStore, {
      state: ResponseState.PENDING,
      searchParams: {},
    }),
    // mapStore: types.optional(ConflictMapState, {})
  })
  .views((self) => ({
    get fetch(): FetchConflicts {
      const env: { fetch: FetchConflicts } = getEnv(self);
      return env.fetch;
    },
  }));

export const rootStore = baseRootStore.actions((self) => ({
  afterCreate(): void {
    self.conflictsStore.fetchConflicts().catch(console.error);

    onAction(
      self,
      (call) => {
        if (call.name === 'setItemsPerPage' || call.name === 'setPage') {
          self.conflictsStore.fetchConflicts().catch(console.error);
        }
      },
      true
    );
  },
}));
export interface IBaseRootStore extends Instance<typeof baseRootStore> {}
export interface IRootStore extends Instance<typeof rootStore> {}
const rootStoreContext = createContext<null | IRootStore | IBaseRootStore>(
  null
);

export const StoreProvider = rootStoreContext.Provider;
export const useStore = (): IRootStore | IBaseRootStore => {
  const store = useContext(rootStoreContext);
  if (store === null) {
    throw new Error('Store cannot be null, please add a context provider');
  }
  return store;
};
