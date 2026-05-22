import { useState, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import SubMenu from './components/SubMenu';
import Breadcrumbs from './components/Breadcrumbs';
import Header from './components/Header';
import FilterBar from './components/FilterBar';
import { INITIAL_VIEWS, type SavedFilter } from './data/views';
import { totalActiveFilters } from './lib/viewsHelpers';

export default function App() {
  const [views, setViews] = useState(INITIAL_VIEWS);

  const initialView = useMemo(
    () => views.find((v) => v.isDefault) ?? views[0],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const [activeViewId, setActiveViewId] = useState<string>(initialView.id);
  const [currentFilters, setCurrentFilters] = useState<SavedFilter[]>(initialView.filters);
  const [collapsed, setCollapsed] = useState(false);

  const activeFilterCount = totalActiveFilters(currentFilters);

  return (
    <div className="flex h-full w-full gap-[8px] p-[8px] bg-[var(--color-semantic-main-surface-primary)]">
      <Sidebar />

      <div className="flex flex-col flex-1 min-w-0 h-full bg-[var(--color-semantic-main-surface-secondary)] border border-[var(--color-semantic-main-border-default)] rounded-[8px] overflow-hidden">
        <Breadcrumbs />

        <div className="flex flex-1 min-h-0">
          <SubMenu />

          <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
            <Header
              collapsed={collapsed}
              setCollapsed={setCollapsed}
              activeFilterCount={activeFilterCount}
            />

            <FilterBar
              views={views}
              setViews={setViews}
              activeViewId={activeViewId}
              setActiveViewId={setActiveViewId}
              currentFilters={currentFilters}
              setCurrentFilters={setCurrentFilters}
              collapsed={collapsed}
              setCollapsed={setCollapsed}
            />

            <div className="flex-1 min-h-0 overflow-auto" />
          </div>
        </div>
      </div>
    </div>
  );
}
