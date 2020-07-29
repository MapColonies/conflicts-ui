import { types, Instance } from 'mobx-state-tree';

export const pagination = types
  .model({
    page: types.optional(types.number, 0),
    itemsPerPage: types.optional(types.number, 5),
    totalItemsCount: types.optional(types.number, 0),
  })
  .actions((self) => ({
    reset () {
      self.page = 0;
    },
    setPage (page: number) {
      self.page = page;
    },
    setItemsPerPage (itemsPerPage: number) {
      self.itemsPerPage = itemsPerPage;
      self.page = 0;
    },
    setTotalItems (count: number) {
      self.totalItemsCount = count;
    },
  }));

export interface IPaginationStore extends Instance<typeof pagination> {}
