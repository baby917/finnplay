import { useCallback, useMemo, useEffect } from "react";
import FilterPanel from "../../components/FilterPanel";
import useGameStore from "../../store/gameStore";
import useWindowSize from "../../utils/useWindowSize";
import apiRequest from "../../utils/request";
import { ROWS_LIMIT } from "../../constants";
import type { Game, Group } from "../../types";
import "./styles.scss";

const GameList = () => {
  const { isMobile } = useWindowSize();
  const { filteredGames, filters, actions } = useGameStore();

  // 过滤游戏，只保留分组内有效游戏
  const filterGamesByGroups = (games: Game[], groups: Group[]) => {
    if (groups.length === 0) {
      return games;
    }
    const gameIdMap = new Map<number, Game>(
      games.map((game) => [game.id, game])
    );
    const validGameIds = new Set<number>();
    groups.forEach((group) => {
      if (group.games && Array.isArray(group.games)) {
        group.games.forEach((gameId) => {
          if (gameIdMap.has(gameId)) {
            validGameIds.add(gameId);
          }
        });
      }
    });
    return games.filter((game) => validGameIds.has(game.id));
  };

  const loadData = useCallback(async () => {
    const [filterRes, gameListRes] = await Promise.allSettled([
      apiRequest({ action: "/filters" }),
      apiRequest({ action: "/gameList" }),
    ]);
    let groups = [];
    let games = [];
    if (filterRes.status === "fulfilled" && filterRes.value?.ret_code === 0) {
      groups = filterRes.value?.data.groups || [];
      actions.setProviders(filterRes.value?.data.providers || []);
      actions.setGroups(groups);
    } else {
      actions.setProviders([]);
      actions.setGroups([]);
      console.error(
        filterRes.status === "fulfilled"
          ? filterRes.value?.error
          : filterRes.reason
      );
    }
    if (
      gameListRes.status === "fulfilled" &&
      gameListRes.value?.ret_code === 0
    ) {
      games = gameListRes.value?.data.gameList || [];
      actions.setGames(games);
    } else {
      actions.setGames([]);
      console.error(
        gameListRes.status === "fulfilled"
          ? gameListRes.value?.error
          : gameListRes.reason
      );
    }
    const validGames = filterGamesByGroups(games, groups);
    actions.setGames(validGames || []);
    actions.applyFilters();
  }, [actions]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // 在移动设备上自动切换到2列布局
  useEffect(() => {
    if (isMobile) {
      actions.setFilter("columns", 2);
    } else {
      actions.setFilter("columns", 4);
    }
  }, [isMobile, actions]);

  // 计算网格列数
  const getGridColumns = useMemo(() => {
    if (isMobile) return 2;
    return Math.min(6, Math.max(2, filters.columns));
  }, [filters.columns, isMobile]);

  return (
    <div className={`game-container ${isMobile ? "mobile" : ""}`}>
      <div
        className="game-grid"
        style={{
          gridTemplateColumns: `repeat(${getGridColumns}, 1fr)`,
          gridAutoRows: `${
            isMobile
              ? "130px"
              : ROWS_LIMIT[getGridColumns as keyof typeof ROWS_LIMIT]
          }px`,
        }}
      >
        {filteredGames.map((game) => (
          <div className="game-card" key={game.id}>
            <img src={game.cover} alt={game.name} />
          </div>
        ))}
      </div>
      <FilterPanel />
    </div>
  );
};

export default GameList;
