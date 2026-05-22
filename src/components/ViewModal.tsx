import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEye,
  faAngleDown,
  faTimesCircle,
  faPlus,
  faBarsFilter,
} from '@fortawesome/pro-regular-svg-icons';
import FilterPopover from './FilterPopover';
import FilterValuePopover from './FilterValuePopover';
import { CATEGORIES, type Category, type Condition } from '@/data/filterCategories';
import type { SavedFilter } from '@/data/views';

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

interface ViewModalProps {
  open: boolean;
  mode: 'create' | 'edit';
  initialName?: string;
  initialFilters?: SavedFilter[];
  onSave: (name: string, filters: SavedFilter[]) => void;
  onCancel: () => void;
  onDelete?: () => void;
}

function chipLabel(values: string[], condition?: Condition): string {
  const prefix = conditionPrefix(condition);
  if (values.length === 0) return '';
  if (values.length === 1) return `${prefix}${values[0]}`;
  return `${prefix}${values[0]}, +${values.length - 1}`;
}

export default function ViewModal({
  open,
  mode,
  initialName = '',
  initialFilters = [],
  onSave,
  onCancel,
  onDelete,
}: ViewModalProps) {
  const [name, setName] = useState(initialName);
  const [filters, setFilters] = useState<SavedFilter[]>(initialFilters);
  const [pendingKeys, setPendingKeys] = useState<Set<string>>(new Set());
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setName(initialName);
      setFilters(initialFilters);
      setPendingKeys(new Set());
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open, initialName, initialFilters]);

  if (!open) return null;

  function handleAddFilter(category: Category) {
    setFilters((prev) =>
      prev.some((f) => f.categoryKey === category.key)
        ? prev
        : [...prev, { categoryKey: category.key, values: [] }]
    );
    setPendingKeys((prev) => new Set(prev).add(category.key));
  }

  function updateValues(key: string, values: string[]) {
    setFilters((prev) => prev.map((f) => (f.categoryKey === key ? { ...f, values } : f)));
  }

  function updateCondition(key: string, condition: Condition) {
    setFilters((prev) => prev.map((f) => (f.categoryKey === key ? { ...f, condition } : f)));
  }

  function removeFilter(key: string) {
    setFilters((prev) => prev.filter((f) => f.categoryKey !== key));
  }

  function clearPending(key: string) {
    setPendingKeys((prev) => {
      const next = new Set(prev);
      next.delete(key);
      return next;
    });
  }

  function handleSave() {
    if (!name.trim()) return;
    onSave(name.trim(), filters);
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[100] bg-black/30"
        onClick={onCancel}
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        className="fixed left-1/2 top-1/2 z-[101] -translate-x-1/2 -translate-y-1/2 w-[448px] max-w-[90vw] bg-[var(--color-gray-100)] border border-[var(--color-gray-400)] rounded-[12px] drop-shadow-[0px_1px_2px_rgba(0,0,0,0.25)] overflow-hidden"
        onKeyDown={(e) => {
          if (e.key === 'Escape') onCancel();
        }}
      >
        {/* Header */}
        <div className="pt-[24px] pb-[16px] px-[24px]">
          <h2 className="font-medium text-[16px] leading-[24px] text-[var(--color-gray-1000)]">
            {mode === 'create' ? 'Criar nova visualização' : 'Editar visualização'}
          </h2>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-[16px] px-[24px]">
          {/* Section: Dê um nome */}
          <div className="flex flex-col gap-[8px] w-full">
            <div className="flex flex-col gap-[4px] w-full">
              <label className="font-medium text-[14px] leading-[20px] text-[var(--color-gray-900)]">
                Dê um nome
              </label>
              <p className="font-normal text-[12px] leading-[16px] text-[var(--color-gray-900)]">
                Como a visualização será exibida para seleção
              </p>
            </div>
            <div className="flex items-stretch w-full">
              {/* Emoji slot (placeholder com ícone de eye) */}
              <div className="flex items-center justify-center w-[36px] h-[36px] border border-[var(--color-gray-400)] rounded-tl-[12px] rounded-bl-[12px] bg-[var(--color-semantic-main-surface-secondary)] -mr-px shrink-0">
                <FontAwesomeIcon
                  icon={faEye}
                  className="w-[14px] h-[14px] text-[var(--color-gray-1000)]"
                />
              </div>
              {/* Input field */}
              <div className="flex flex-1 items-center gap-[4px] h-[36px] px-[12px] py-[8px] bg-[var(--color-semantic-main-surface-secondary)] border border-[var(--color-semantic-main-border-default)] rounded-tr-[12px] rounded-br-[12px] min-w-0">
                <input
                  ref={inputRef}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSave();
                  }}
                  placeholder="Nome da visualização"
                  className="flex-1 min-w-0 bg-transparent outline-none font-normal text-[14px] leading-[20px] text-[var(--color-gray-1000)] placeholder:text-[var(--color-gray-700)] caret-[var(--color-primary-600)]"
                />
              </div>
            </div>
          </div>

          {/* Section: Filtros */}
          <div className="flex flex-col gap-[12px] w-full">
            <div className="flex flex-col gap-[4px] w-full">
              <label className="font-medium text-[14px] leading-[20px] text-[var(--color-gray-900)]">
                Filtros
              </label>
              <p className="font-normal text-[12px] leading-[16px] text-[var(--color-gray-900)]">
                Escolha os critérios para que os atendimentos apareçam na sua pasta
              </p>
            </div>
            <div className="flex flex-col gap-[8px] w-full">
              {filters.map((item) => {
                const category =
                  CATEGORIES.find((c) => c.key === item.categoryKey) ??
                  ({
                    key: item.categoryKey,
                    label: item.categoryKey,
                    icon: faBarsFilter,
                    type: 'default',
                    options: [],
                  } as Category);
                return (
                  <div key={item.categoryKey} className="grid grid-cols-[1fr_36px] gap-[4px] items-center w-full">
                    <FilterValuePopover
                      category={category}
                      selectedValues={item.values}
                      onValuesChange={(values) => updateValues(item.categoryKey, values)}
                      condition={item.condition}
                      onConditionChange={(c) => updateCondition(item.categoryKey, c)}
                      defaultOpen={pendingKeys.has(item.categoryKey)}
                      onOpenChange={(open) => { if (!open) clearPending(item.categoryKey); }}
                    >
                      <button className="flex w-full min-w-0 items-center gap-[4px] px-[12px] h-[36px] border border-[var(--color-semantic-main-border-default)] rounded-[12px] hover:bg-[var(--color-semantic-main-hover-primary)] transition-colors focus:outline-none">
                        <FontAwesomeIcon
                          icon={category.icon}
                          className="w-[12px] h-[12px] text-[var(--color-gray-900)] shrink-0"
                        />
                        <span className="font-normal text-[12px] leading-[16px] text-[var(--color-gray-900)] whitespace-nowrap shrink-0">
                          {category.label}
                        </span>
                        <span className="text-[10px] leading-[12px] text-[var(--color-semantic-main-border-default)] mx-[2px] shrink-0">|</span>
                        {item.values.length > 0 ? (
                          <span className="flex items-center px-[8px] py-[0px] rounded-[4px] bg-[rgba(0,142,214,0.1)] border border-[rgba(0,142,214,0.1)] min-w-0 overflow-hidden">
                            <span className="font-normal text-[12px] leading-[16px] text-[var(--color-component-chips-content-info)] truncate">
                              {chipLabel(item.values, item.condition)}
                            </span>
                          </span>
                        ) : (
                          <span className="font-normal text-[12px] leading-[16px] text-[var(--color-gray-700)] whitespace-nowrap">
                            Selecione…
                          </span>
                        )}
                        <span className="flex-1" />
                        <FontAwesomeIcon
                          icon={faAngleDown}
                          className="w-[12px] h-[12px] text-[var(--color-semantic-main-content-default)] shrink-0"
                        />
                      </button>
                    </FilterValuePopover>
                    <button
                      onClick={() => removeFilter(item.categoryKey)}
                      className="flex items-center justify-center w-[36px] h-[36px] rounded-[12px] hover:bg-[var(--color-gray-200)] transition-colors shrink-0 focus:outline-none"
                      aria-label={`Remover ${category.label}`}
                    >
                      <FontAwesomeIcon
                        icon={faTimesCircle}
                        className="w-[14px] h-[14px] text-[var(--color-semantic-main-content-disabled)]"
                      />
                    </button>
                  </div>
                );
              })}

              {/* Adicionar filtro */}
              <FilterPopover onCategorySelect={handleAddFilter}>
                <button className="flex items-center gap-[8px] px-[16px] py-[8px] rounded-[8px] hover:bg-[var(--color-semantic-main-hover-primary)] transition-colors text-left w-fit focus:outline-none">
                  <FontAwesomeIcon
                    icon={faPlus}
                    className="w-[14px] h-[14px] text-[var(--color-semantic-main-content-default)]"
                  />
                  <span className="font-normal text-[14px] leading-[20px] text-[var(--color-gray-1000)] whitespace-nowrap">
                    Adicionar filtro
                  </span>
                </button>
              </FilterPopover>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-end justify-between pt-[16px] pb-[24px] px-[24px]">
          {mode === 'edit' && onDelete ? (
            <button
              onClick={onDelete}
              className="flex items-center justify-center px-[16px] py-[8px] rounded-[12px] hover:bg-[rgba(169,17,13,0.08)] transition-colors focus:outline-none"
            >
              <span className="font-normal text-[14px] leading-[20px] text-[var(--color-red-700)] whitespace-nowrap">
                Excluir visualização
              </span>
            </button>
          ) : (
            <div />
          )}

          <div className="flex gap-[8px] items-center">
            <button
              onClick={onCancel}
              className="flex items-center justify-center px-[16px] py-[8px] rounded-[12px] bg-[var(--color-gray-400)] hover:bg-[var(--color-gray-500)] transition-colors focus:outline-none"
            >
              <span className="font-normal text-[14px] leading-[20px] text-[var(--color-semantic-main-content-default)] whitespace-nowrap">
                Cancelar
              </span>
            </button>
            <button
              onClick={handleSave}
              disabled={!name.trim()}
              className="flex items-center justify-center px-[16px] py-[8px] rounded-[12px] bg-[var(--color-primary-600)] hover:bg-[var(--color-primary-700)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none"
            >
              <span className="font-normal text-[14px] leading-[20px] text-[var(--color-semantic-main-content-fixed-white,#f6f7f8)] whitespace-nowrap">
                Salvar
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
