import { types, Instance } from 'mobx-state-tree';

const STARTING_PAGE = 0;
const ITEMS_PER_PAGE = 5;
const STARTING_ITEM_COUNT = 0;

export const pagination = types
  .model({
    page: types.optional(types.number, STARTING_PAGE),
    itemsPerPage: types.optional(types.number, ITEMS_PER_PAGE),
    totalItemsCount: types.optional(types.number, STARTING_ITEM_COUNT),
  })
  .actions((self) => ({
    reset(): void {
      self.page = 0;
    },
    setPage(page: number): void {
      self.page = page;
    },
    setItemsPerPage(itemsPerPage: number): void {
      self.itemsPerPage = itemsPerPage;
      self.page = 0;
    },
    setTotalItems(count: number): void {
      self.totalItemsCount = count;
    },
  }));

export interface IPaginationStore extends Instance<typeof pagination> {}
