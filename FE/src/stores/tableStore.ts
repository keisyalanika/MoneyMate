import { create } from "zustand";

interface TableSlice {
  search: string;
  filters: Record<string, string>;
  pageIndex: number;
}

interface TableStoreState {
  tables: Record<string, TableSlice>;
  setSearch: (id: string, value: string) => void;
  setFilter: (id: string, key: string, value: string) => void;
  setPageIndex: (id: string, index: number) => void;
  reset: (id: string) => void;
}

const EMPTY: TableSlice = { search: "", filters: {}, pageIndex: 0 };

export const useTableStore = create<TableStoreState>((set) => ({
  tables: {},

  setSearch: (id, value) =>
    set((state) => ({
      tables: {
        ...state.tables,
        [id]: { ...(state.tables[id] ?? EMPTY), search: value },
      },
    })),

  setFilter: (id, key, value) =>
    set((state) => {
      const current = state.tables[id] ?? EMPTY;
      return {
        tables: {
          ...state.tables,
          [id]: {
            ...current,
            filters: { ...current.filters, [key]: value },
            pageIndex: 0,
          },
        },
      };
    }),

  setPageIndex: (id, index) =>
    set((state) => ({
      tables: {
        ...state.tables,
        [id]: { ...(state.tables[id] ?? EMPTY), pageIndex: index },
      },
    })),

  reset: (id) =>
    set((state) => ({ tables: { ...state.tables, [id]: { ...EMPTY } } })),
}));
