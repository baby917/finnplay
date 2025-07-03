import React, { useState, useEffect, useMemo } from "react";
import { debounce } from "lodash";
import useGameStore from "../../store/gameStore";
import useWindowSize from "../../utils/useWindowSize";
import { COLUMNS_LIMIT, SORT_LIMIT } from "../../constants";
import "./styles.scss";

const FilterPanel = () => {
  const { filters, providers, groups, filteredGames, actions } = useGameStore();
  const [searchValue, setSearchValue] = useState(filters.search);

  const { isMobile } = useWindowSize();

  const [mobileFiltersVisible, setMobileFiltersVisible] = useState(false);

  useEffect(() => {
    setSearchValue(filters.search);
  }, [filters.search]);

  // 处理提供商选择
  const toggleProvider = (providerId: number) => {
    const newProviders = filters.providers.includes(providerId)
      ? filters.providers.filter((id) => id !== providerId)
      : [...filters.providers, providerId];

    actions.setFilter("providers", newProviders);
  };

  // 处理分组选择
  const toggleGroup = (groupId: number) => {
    const newGroups = filters.groups.includes(groupId)
      ? filters.groups.filter((id) => id !== groupId)
      : [...filters.groups, groupId];

    actions.setFilter("groups", newGroups);
  };

  // 处理排序方式变更
  const handleSortChange = (sort: "A-Z" | "Z-A" | "Newest") => {
    actions.setFilter("sort", sort);
  };

  // 处理列数变更
  const handleColumnChange = (columns: number) => {
    actions.setFilter("columns", columns);
  };

  const debouncedSetFilter = useMemo(
    () =>
      debounce((value: string) => {
        actions.setFilter("search", value);
      }, 500),
    [actions]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    debouncedSetFilter(e.target.value);
  };

  const handleFilterToggle = () => {
    setMobileFiltersVisible(!mobileFiltersVisible);
  };

  // 渲染筛选按钮组
  const renderButtonGroup = (
    items: { id: number; name: string }[],
    selectedIds: number[],
    onClick: (id: number) => void
  ) => (
    <div className="button-group">
      {items.map((item) => {
        const isActive = selectedIds.includes(item.id);
        return (
          <button
            key={item.id}
            className={`filter-btn ${isActive ? "active" : ""}
            }`}
            onClick={() => onClick(item.id)}
          >
            {item.name}
          </button>
        );
      })}
    </div>
  );

  // 渲染排序按钮组
  const renderSortButtons = () => (
    <div className="button-group">
      {SORT_LIMIT.map((option) => (
        <button
          key={option}
          className={`filter-btn ${filters.sort === option ? "active" : ""}`}
          onClick={() => handleSortChange(option as "A-Z" | "Z-A" | "Newest")}
        >
          {option}
        </button>
      ))}
    </div>
  );

  // 渲染列数按钮组
  const renderColumnButtons = () => (
    <div className="column-button-group">
      {COLUMNS_LIMIT.map((column, index) => {
        const isActive = filters.columns >= column;
        return (
          <div key={column} className="column-button-wrapper">
            {index > 0 && (
              <div className={`connection-bar ${isActive ? "active" : ""}`} />
            )}
            <button
              className={`column-button ${isActive ? "active" : ""}`}
              onClick={() => handleColumnChange(column)}
            >
              {column}
            </button>
          </div>
        );
      })}
    </div>
  );

  return (
    <div
      className={`filter-panel-container ${isMobile ? "mobile" : "desktop"}`}
    >
      <div className="filter-panel">
        {/* 搜索框 */}
        <div className="filter-section search-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search"
              value={searchValue}
              onChange={handleSearchChange}
            />
            <i className="iconfont icon-search" />
          </div>
        </div>

        {isMobile && !mobileFiltersVisible && (
          <div className="show-filter-btn" onClick={handleFilterToggle}>
            <i className="iconfont icon-caidan" />
            <span>Show filters</span>
          </div>
        )}
        {((isMobile && mobileFiltersVisible) || !isMobile) && (
          <div className="filter-section-details">
            {/* 提供商筛选 */}
            <div className="filter-section">
              <div className="section-header">
                <h3>Providers</h3>
              </div>
              {renderButtonGroup(providers, filters.providers, toggleProvider)}
            </div>

            {/* 游戏分组筛选 */}
            <div className="filter-section">
              <div className="section-header">
                <h3>Game groups</h3>
              </div>
              {renderButtonGroup(groups, filters.groups, toggleGroup)}
            </div>

            {/* 排序选项 */}
            <div className="filter-section">
              <div className="section-header">
                <h3>Sorting</h3>
              </div>
              {renderSortButtons()}
            </div>

            {/* 列数选择器 */}
            {!isMobile && (
              <div className="filter-section">
                <div className="section-header">
                  <h3>Columns</h3>
                </div>
                {renderColumnButtons()}
              </div>
            )}

            {/* 统计信息和重置按钮 */}
            <div className="stats-section">
              <p>Games amount: {filteredGames.length}</p>
              <button className={`reset-btn`} onClick={actions.resetFilters}>
                Reset
              </button>
            </div>
            {isMobile && mobileFiltersVisible && (
              <div className="hide-filter-btn" onClick={handleFilterToggle}>
                <i className="iconfont icon-caidan" />
                <span>Hide filters</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterPanel;
