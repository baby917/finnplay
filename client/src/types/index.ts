export interface Game {
  id: number;
  name: string;
  provider: number;
  cover: string;
  coverLarge: string;
  date: string;
}

export interface Provider {
  id: number;
  name: string;
  logo: string;
}

export interface Group {
  id: number;
  name: string;
  games: number[];
}

export interface Filter {
  search: string;
  providers: number[]; // provider IDs
  groups: number[]; // group IDs
  sort: "A-Z" | "Z-A" | "Newest" | "";
  columns: number;
}

export interface GameStore {
  games: Game[];
  providers: Provider[];
  groups: Group[];
  filteredGames: Game[];
  filters: Filter;
  actions: {
    setGames: (games: Game[]) => void;
    setProviders: (providers: Provider[]) => void;
    setGroups: (groups: Group[]) => void;
    setFilter: <K extends keyof GameStore["filters"]>(
      key: K,
      value: GameStore["filters"][K]
    ) => void;
    resetFilters: () => void;
    resetStore: () => void;
    applyFilters: () => void;
  };
}
