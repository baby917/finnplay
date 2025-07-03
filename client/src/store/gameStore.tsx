import { create } from "zustand";
import type { Filter, GameStore } from "../types";

const initalFilter: Filter = {
  search: "",
  providers: [],
  groups: [],
  sort: "",
  columns: 4,
};

const initalState = {
  games: [],
  providers: [],
  groups: [],
  filteredGames: [],
  filters: initalFilter,
};

const useGameStore = create<GameStore>((set, get) => ({
  ...initalState,
  actions: {
    setGames: (games) => set({ games, filteredGames: games }),
    setProviders: (providers) => set({ providers }),
    setGroups: (groups) => set({ groups }),

    setFilter: (key, value) => {
      set((state) => ({
        filters: {
          ...state.filters,
          [key]: value,
        },
      }));

      // 应用筛选条件
      get().actions.applyFilters();
    },

    resetStore: () => {
      set(initalState);
    },

    resetFilters: () => {
      set({
        filters: initalFilter,
      });

      // 应用重置后的筛选条件
      get().actions.applyFilters();
    },

    applyFilters: () => {
      const { games, filters } = get();
      let result = [...games];

      // 应用搜索过滤
      if (filters.search) {
        const searchQuery = filters.search.toLowerCase();
        result = result.filter((game) =>
          game.name.toLowerCase().includes(searchQuery)
        );
      }

      // 应用提供商过滤
      if (filters.providers.length > 0) {
        result = result.filter((game) =>
          filters.providers.includes(game.provider)
        );
      }

      // 应用分组过滤
      if (filters.groups.length > 0) {
        result = result.filter((game) => {
          // 查找包含该游戏的所有分组
          const gameGroups = get().groups.filter((group) =>
            group.games.includes(game.id)
          );

          // 检查这些分组是否包含在选中的分组中
          return gameGroups.some((group) => filters.groups.includes(group.id));
        });
      }

      // 应用排序
      switch (filters.sort) {
        case "A-Z":
          result.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case "Z-A":
          result.sort((a, b) => b.name.localeCompare(a.name));
          break;
        case "Newest":
          result.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );
          break;
      }

      set({ filteredGames: result });
    },
  },
}));

export default useGameStore;
