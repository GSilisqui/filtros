import { useState, useMemo, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBarsFilter, faXmark, faPlus } from '@fortawesome/pro-regular-svg-icons';
import FilterPopover from './FilterPopover';
import FilterValuePopover from './FilterValuePopover';
import ViewSelector, { type ViewSelectorHandle } from './ViewSelector';
import SaveChangesMenu from './SaveChangesMenu';
import UndoToast from './UndoToast';
import { CATEGORIES } from '@/data/filterCategories';
import type { Category, Condition } from '@/data/filterCategories';
import type { View, SavedFilter } from '@/data/views';
import { filtersEqual, totalActiveFilters } from '@/lib/viewsHelpers';

function conditionPrefix(condition: Condition | undefined): string {
  if (!condition || condition === 'É') return '';
  switch (condition) {
    case 'Não é': return 'não ';
    case 'Depois de': return 'depois de ';
    case 'Antes de': return 'antes de ';
    case 'Está entre': return 'entre ';
    default: return '';
  }
}

interface FilterBarProps {
  views: View[];
  setViews: React.Dispatch<React.SetStateAction<View[]>>;
  activeViewId: string;
  setActiveViewId: (id: string) => void;
  currentFilters: SavedFilter[];
  setCurrentFilters: React.Dispatch<React.SetStateAction<SavedFilter[]>>;
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
}

interface UndoSnapshot {
  viewId: string;
  filters: SavedFilter[];
}

function chipLabel(values: string[], categoryLabel: string, condition?: Condition): string {
  const prefix = conditionPrefix(condition);
  if (values.length === 0) return categoryLabel;
  if (values.length === 1) return `${prefix}${values[0]}`;
  return `${prefix}${values[0]}, +${values.length - 1}`;
}

export default function FilterBar({
  views,
  setViews,
  activeViewId,
  setActiveViewId,
  currentFilters,
  setCurrentFilters,
  collapsed,
  setCollapsed,
}: FilterBarProps) {
  const activeView = views.find((v) => v.id === activeViewId) ?? views[0];
  const isDirty = useMemo(
    () => !filtersEqual(currentFilters, activeView.filters),
    [currentFilters, activeView.filters]
  );
  const activeCount = totalActiveFilters(currentFilters);

  const [pendingKeys, setPendingKeys] = useState<Set<string>>(new Set());
  const [undoSnapshot, setUndoSnapshot] = useState<UndoSnapshot | null>(null);
  const viewSelectorRef = useRef<ViewSelectorHandle>(null);

  function activateView(id: string) {
    if (id === activeViewId) return;
    if (isDirty) {
      setUndoSnapshot({ viewId: activeViewId, filters: currentFilters });
    }
    const target = views.find((v) => v.id === id);
    if (!target) return;
    setActiveViewId(id);
    setCurrentFilters(target.filters);
    setPendingKeys(new Set());
  }

  function handleCategorySelect(category: Category) {
    setCurrentFilters((prev) =>
      prev.some((f) => f.categoryKey === category.key)
        ? prev
        : [...prev, { categoryKey: category.key, values: [] }]
    );
    setPendingKeys((prev) => new Set(prev).add(category.key));
  }

  function updateValues(categoryKey: string, values: string[]) {
    setCurrentFilters((prev) =>
      prev.map((f) => (f.categoryKey === categoryKey ? { ...f, values } : f))
    );
  }

  function updateCondition(categoryKey: string, condition: Condition) {
    setCurrentFilters((prev) =>
      prev.map((f) => (f.categoryKey === categoryKey ? { ...f, condition } : f))
    );
  }

  function clearPending(categoryKey: string) {
    setPendingKeys((prev) => {
      const next = new Set(prev);
      next.delete(categoryKey);
      return next;
    });
  }

  function removeFilter(categoryKey: string) {
    setCurrentFilters((prev) => prev.filter((f) => f.categoryKey !== categoryKey));
    clearPending(categoryKey);
  }

  function resetToActiveView() {
    setCurrentFilters(activeView.filters);
    setPendingKeys(new Set());
  }

  function clearToDefault() {
    const defaultView = views.find((v) => v.isDefault) ?? views[0];
    if (!defaultView || defaultView.id === activeViewId) return;
    setActiveViewId(defaultView.id);
    setCurrentFilters(defaultView.filters);
    setPendingKeys(new Set());
  }

  const isOnDefault = activeView.isDefault;

  function saveToCurrent() {
    setViews((prev) =>
      prev.map((v) => (v.id === activeViewId ? { ...v, filters: currentFilters } : v))
    );
  }

  function createNewView(name: string, filters: SavedFilter[]) {
    const newView: View = {
      id: `view-${Date.now()}`,
      name,
      isDefault: false,
      filters,
    };
    setViews((prev) => [...prev, newView]);
    setActiveViewId(newView.id);
    setCurrentFilters(filters);
    setPendingKeys(new Set());
  }

  function updateView(id: string, name: string, filters: SavedFilter[]) {
    if (!name.trim()) return;
    setViews((prev) =>
      prev.map((v) => (v.id === id ? { ...v, name: name.trim(), filters } : v))
    );
    if (id === activeViewId) {
      setCurrentFilters(filters);
      setPendingKeys(new Set());
    }
  }

  function duplicateView(id: string) {
    const source = views.find((v) => v.id === id);
    if (!source) return;
    const copy: View = {
      ...source,
      id: `view-${Date.now()}`,
      name: `${source.name} (cópia)`,
      isDefault: false,
    };
    setViews((prev) => {
      const idx = prev.findIndex((v) => v.id === id);
      const next = [...prev];
      next.splice(idx + 1, 0, copy);
      return next;
    });
  }

  function setDefaultView(id: string) {
    setViews((prev) => prev.map((v) => ({ ...v, isDefault: v.id === id })));
  }

  function deleteView(id: string) {
    if (views.length === 1) return;
    setViews((prev) => prev.filter((v) => v.id !== id));
    if (id === activeViewId) {
      const remaining = views.filter((v) => v.id !== id);
      const fallback = remaining.find((v) => v.isDefault) ?? remaining[0];
      setActiveViewId(fallback.id);
      setCurrentFilters(fallback.filters);
      setPendingKeys(new Set());
    }
  }

function undoSwitch() {
    if (!undoSnapshot) return;
    const target = views.find((v) => v.id === undoSnapshot.viewId);
    if (!target) return;
    setActiveViewId(undoSnapshot.viewId);
    setCurrentFilters(undoSnapshot.filters);
    setUndoSnapshot(null);
  }

  if (collapsed) {
    return undoSnapshot ? (
      <UndoToast
        message="Alterações descartadas"
        onUndo={undoSwitch}
        onDismiss={() => setUndoSnapshot(null)}
      />
    ) : null;
  }

  return (
    <>
      <div className="flex gap-[8px] items-start justify-center px-[16px] py-[12px] shrink-0 w-full">
        <div className="flex flex-[1_0_0] flex-wrap content-center items-center gap-[8px] min-w-0 self-stretch">

          {/* Seletor de view com separador direito */}
          <div className="flex flex-col items-start border-r border-[var(--color-semantic-main-border-default)] pr-[8px] shrink-0">
            <ViewSelector
              ref={viewSelectorRef}
              views={views}
              activeViewId={activeViewId}
              isDirty={isDirty}
              currentFilters={currentFilters}
              onActivateView={activateView}
              onUpdateView={updateView}
              onDuplicateView={duplicateView}
              onSetDefault={setDefaultView}
              onDeleteView={deleteView}
              onCreateNewView={createNewView}
            />
          </div>

          {/* Chips de filtro + Filtrar — grupo interno com gap-[4px] */}
          <div className="flex flex-wrap gap-[4px] items-center whitespace-nowrap">
            {currentFilters.map((item) => {
              const category =
                CATEGORIES.find((c) => c.key === item.categoryKey) ??
                ({ key: item.categoryKey, label: item.categoryKey, icon: faBarsFilter, type: 'default', options: [] } as Category);

              return (
                <div key={item.categoryKey} className="flex items-center rounded-[8px] bg-[rgba(0,142,214,0.1)] border border-[rgba(0,142,214,0.1)] shrink-0 overflow-hidden">
                  <FilterValuePopover
                    category={category}
                    selectedValues={item.values}
                    onValuesChange={(values) => updateValues(item.categoryKey, values)}
                    condition={item.condition}
                    onConditionChange={(c) => updateCondition(item.categoryKey, c)}
                    defaultOpen={pendingKeys.has(item.categoryKey)}
                    onOpenChange={(open) => { if (!open) clearPending(item.categoryKey); }}
                  >
                    <button className="flex gap-[4px] items-center justify-center pl-[8px] pr-[6px] py-[2px] text-[var(--color-component-chips-content-info)] whitespace-nowrap hover:bg-[rgba(0,142,214,0.06)] transition-colors focus:outline-none">
                      <FontAwesomeIcon icon={category.icon} className="w-[14px] h-[14px] text-[var(--color-component-chips-content-info)] shrink-0" />
                      <span className="font-normal text-[14px] leading-[20px]">{chipLabel(item.values, category.label, item.condition)}</span>
                    </button>
                  </FilterValuePopover>
                  {/* Divisor vertical — separa "editar" de "remover" (padrão Atlassian RemovableTag) */}
                  <span className="self-stretch w-px bg-[rgba(0,142,214,0.2)]" aria-hidden />
                  <button
                    onClick={() => removeFilter(item.categoryKey)}
                    className="flex items-center justify-center self-stretch px-[6px] text-[var(--color-component-chips-content-info)] hover:bg-[rgba(0,142,214,0.12)] transition-colors focus:outline-none"
                    aria-label={`Remover filtro ${category.label}`}
                  >
                    <FontAwesomeIcon icon={faXmark} className="w-[12px] h-[12px]" />
                  </button>
                </div>
              );
            })}

            {/* + adicionar filtro */}
            <FilterPopover onCategorySelect={handleCategorySelect}>
              <button
                className="flex items-center justify-center w-[24px] h-[24px] rounded-[6px] shrink-0 hover:bg-[var(--color-gray-200)] transition-colors focus:outline-none"
                style={{ color: '#282D37' }}
              >
                <FontAwesomeIcon icon={faPlus} className="w-[12px] h-[12px]" style={{ opacity: 1 }} />
              </button>
            </FilterPopover>
          </div>
        </div>

        {/* Ações: Redefinir+Salvar (dirty) | Limpar (não-dirty fora do padrão) */}
        {isDirty ? (
          <div className="flex gap-[4px] items-center border-l border-[var(--color-semantic-main-border-default)] pl-[8px] shrink-0">
            <button
              onClick={resetToActiveView}
              className="flex items-center justify-center px-[8px] py-[4px] rounded-[8px] shrink-0 hover:bg-[var(--color-gray-200)] transition-colors focus:outline-none"
            >
              <span className="font-normal text-[12px] leading-[16px] text-[var(--color-gray-1000)] whitespace-nowrap">
                Redefinir
              </span>
            </button>

            <SaveChangesMenu
              activeViewName={activeView.name}
              onSaveToCurrent={saveToCurrent}
              onSaveAsNew={() => viewSelectorRef.current?.openCreateNew()}
            />
          </div>
        ) : !isOnDefault ? (
          <div className="flex items-center border-l border-[var(--color-semantic-main-border-default)] pl-[8px] shrink-0">
            <button
              onClick={clearToDefault}
              className="flex items-center justify-center px-[8px] py-[4px] rounded-[8px] shrink-0 hover:bg-[var(--color-gray-200)] transition-colors focus:outline-none"
            >
              <span className="font-normal text-[12px] leading-[16px] text-[var(--color-gray-1000)] whitespace-nowrap">
                Limpar
              </span>
            </button>
          </div>
        ) : null}
      </div>

      {undoSnapshot && (
        <UndoToast
          message="Alterações descartadas"
          onUndo={undoSwitch}
          onDismiss={() => setUndoSnapshot(null)}
        />
      )}
    </>
  );
}
