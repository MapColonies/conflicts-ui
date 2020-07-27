import { types, Instance, getEnv, onAction } from "mobx-state-tree";
import { useContext, createContext } from 'react';
import { ConflictStore } from './conflictStore';
import { ResponseState } from "../../common/models/ResponseState";

export const baseRootStore = types
  .model({
    conflictsStore: types.optional(ConflictStore, { state: ResponseState.PENDING, searchParams: {} }),
    // mapStore: types.optional(ConflictMapState, {})
  })
  .views(self => ({
    get fetch() {
      return getEnv(self).fetch;
    }
  }));

export const rootStore = baseRootStore.actions(self => ({
  afterCreate() {
    self.conflictsStore.fetchConflicts();
    
      onAction(self, call => {
        if (call.name === 'setItemsPerPage' || call.name === 'setPage'){
          self.conflictsStore.fetchConflicts();
        }
      }, true)
  }
}));
export interface IBaseRootStore extends Instance<typeof baseRootStore> { };
export interface IRootStore extends Instance<typeof rootStore> { };
const RootStoreContext = createContext<null | IRootStore | IBaseRootStore>(null);

export const StoreProvider = RootStoreContext.Provider;
export const useStore = () => {
  const store = useContext(RootStoreContext);
  if (store === null) {
    throw new Error("Store cannot be null, please add a context provider");
  }
  return store;
}