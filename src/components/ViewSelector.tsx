import { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAngleDown,
  faMagnifyingGlass,
  faPlus,
  faEllipsis,
  faPenToSquare,
  faCopy,
  faStar,
  faTrash,
  faEye,
} from '@fortawesome/pro-regular-svg-icons';
import { faStar as faStarSolid } from '@fortawesome/pro-solid-svg-icons';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import ViewModal from './ViewModal';
import type { View, SavedFilter } from '@/data/views';

interface ViewSelectorProps {
  views: View[];
  activeViewId: string;
  isDirty: boolean;
  currentFilters: SavedFilter[];
  onActivateView: (id: string) => void;
  onUpdateView: (id: string, name: string, filters: SavedFilter[]) => void;
  onDuplicateView: (id: string) => void;
  onSetDefault: (id: string) => void;
  onDeleteView: (id: string) => void;
  onCreateNewView: (name: string, filters: SavedFilter[]) => void;
}

type ModalState =
  | { mode: 'create' }
  | { mode: 'edit'; viewId: string }
  | null;

export interface ViewSelectorHandle {
  openCreateNew: () => void;
}

const ViewSelector = forwardRef<ViewSelectorHandle, ViewSelectorProps>(function ViewSelector({
  views,
  activeViewId,
  isDirty,
  currentFilters,
  onActivateView,
  onUpdateView,
  onDuplicateView,
  onSetDefault,
  onDeleteView,
  onCreateNewView,
}, ref) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [modalState, setModalState] = useState<ModalState>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    openCreateNew: () => {
      setOpen(false);
      setModalState({ mode: 'create' });
    },
  }));

  const editingView =
    modalState?.mode === 'edit'
      ? views.find((v) => v.id === modalState.viewId)
      : null;

  const activeView = views.find((v) => v.id === activeViewId) ?? views[0];

  const filtered = views
    .filter((v) => v.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0));

  function handleActivate(id: string) {
    onActivateView(id);
    setOpen(false);
    setSearch('');
  }

  function openCreateModal() {
    setOpen(false);
    setModalState({ mode: 'create' });
  }

  function openEditModal(viewId: string) {
    setOpen(false);
    setModalState({ mode: 'edit', viewId });
  }

  function handleModalSave(name: string, filters: SavedFilter[]) {
    if (modalState?.mode === 'create') {
      onCreateNewView(name, filters);
    } else if (modalState?.mode === 'edit') {
      onUpdateView(modalState.viewId, name, filters);
    }
    setModalState(null);
  }

  function handleModalDelete() {
    if (modalState?.mode === 'edit') {
      onDeleteView(modalState.viewId);
    }
    setModalState(null);
  }

  return (
    <>
      <Popover
        open={open}
        onOpenChange={(v) => {
          setOpen(v);
          if (!v) setSearch('');
        }}
      >
        <PopoverTrigger
          className="flex gap-[8px] items-center px-[8px] py-[2px] rounded-[8px] bg-[rgba(109,116,142,0.1)] border border-[rgba(109,116,142,0.1)] text-[14px] text-[var(--color-gray-900)] shrink-0 hover:bg-[rgba(109,116,142,0.18)] transition-colors whitespace-nowrap focus:outline-none"
        >
          <div className="flex gap-[4px] items-center justify-center shrink-0 text-[14px]">
            <FontAwesomeIcon icon={faEye} className="w-[14px] h-[14px] text-[var(--color-gray-900)]" />
            <span className="font-normal leading-[20px]">{activeView.name}</span>
          </div>
          {isDirty && (
            <span
              className="w-[6px] h-[6px] rounded-full bg-[var(--color-primary-600)]"
              aria-label="Visualização modificada"
            />
          )}
          <FontAwesomeIcon icon={faAngleDown} className="w-[12px] h-[12px] text-[var(--color-gray-900)]" />
        </PopoverTrigger>

        <PopoverContent
          align="start"
          sideOffset={6}
          className="w-[240px] !p-0 !gap-0 rounded-[12px] bg-[var(--color-semantic-main-surface-secondary)] border border-[var(--color-semantic-main-border-default)] shadow-[0px_6px_16px_0px_rgba(0,0,0,0.08)] overflow-clip"
          onOpenAutoFocus={(e) => {
            e.preventDefault();
            searchRef.current?.focus();
          }}
        >
          {/* Topo: busca + lista */}
          <div className="flex flex-col gap-[4px] p-[4px] w-full">
            {/* Busca */}
            <div className="flex gap-[4px] h-[36px] items-center px-[12px] py-[8px] rounded-[8px] bg-[var(--color-semantic-main-surface-secondary)] border border-[var(--color-semantic-main-border-default)] focus-within:border-[var(--color-semantic-main-border-primary)] focus-within:shadow-[0px_0px_0px_2px_rgba(58,47,193,0.1)] transition-[border-color,box-shadow] w-full overflow-clip shrink-0">
              <FontAwesomeIcon icon={faMagnifyingGlass} className="text-[var(--color-gray-1000)] shrink-0 w-[14px] h-[14px]" />
              <input
                ref={searchRef}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Procure uma visualização..."
                className="flex-1 min-w-0 bg-transparent outline-none font-normal text-[14px] leading-[20px] text-[var(--color-gray-1000)] placeholder:text-[var(--color-gray-700)] caret-[var(--color-primary-600)]"
              />
            </div>

            {/* Lista de views */}
            <div className="flex flex-col gap-[2px] items-start w-full max-h-[280px] overflow-y-auto">
              {filtered.map((view) => (
                <ViewListItem
                  key={view.id}
                  view={view}
                  isActive={view.id === activeViewId}
                  isDirty={isDirty && view.id === activeViewId}
                  onActivate={() => handleActivate(view.id)}
                  onEdit={() => openEditModal(view.id)}
                  onDuplicate={() => onDuplicateView(view.id)}
                  onSetDefault={() => onSetDefault(view.id)}
                  onDelete={() => {
                    if (window.confirm(`Excluir "${view.name}"?`)) {
                      onDeleteView(view.id);
                    }
                  }}
                />
              ))}
              {filtered.length === 0 && (
                <p className="px-[12px] py-[8px] text-[14px] text-[var(--color-gray-700)]">
                  Nenhuma visualização encontrada
                </p>
              )}
            </div>
          </div>

          {/* Rodapé: Nova visualização */}
          <div className="border-t border-[var(--color-semantic-main-border-default)] pb-[4px] px-[4px] w-full">
            <button
              onClick={openCreateModal}
              className="flex gap-[8px] items-center px-[16px] py-[8px] rounded-[8px] w-full text-left hover:bg-[var(--color-semantic-main-hover-primary)] transition-colors mt-[4px] focus:outline-none"
            >
              <FontAwesomeIcon icon={faPlus} className="w-[14px] h-[14px] text-[var(--color-semantic-main-content-default)] shrink-0" />
              <span className="font-normal text-[14px] leading-[20px] text-[var(--color-gray-1000)]">
                Nova visualização
              </span>
            </button>
          </div>
        </PopoverContent>
      </Popover>

      {/* Modal de criação/edição */}
      <ViewModal
        open={modalState !== null}
        mode={modalState?.mode ?? 'create'}
        initialName={editingView?.name ?? ''}
        initialFilters={editingView?.filters ?? currentFilters}
        onSave={handleModalSave}
        onCancel={() => setModalState(null)}
        onDelete={modalState?.mode === 'edit' ? handleModalDelete : undefined}
      />
    </>
  );
});

export default ViewSelector;

interface ViewListItemProps {
  view: View;
  isActive: boolean;
  isDirty: boolean;
  onActivate: () => void;
  onEdit: () => void;
  onDuplicate: () => void;
  onSetDefault: () => void;
  onDelete: () => void;
}

function ViewListItem({
  view,
  isActive,
  isDirty,
  onActivate,
  onEdit,
  onDuplicate,
  onSetDefault,
  onDelete,
}: ViewListItemProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      className={`flex gap-[8px] h-[36px] items-center pl-[12px] pr-[8px] py-[8px] rounded-[8px] w-full transition-colors ${
        isActive ? 'bg-[var(--color-gray-300)]' : 'hover:bg-[var(--color-semantic-main-hover-primary)]'
      }`}
    >
      <button
        onClick={onActivate}
        className="flex flex-1 items-center gap-[4px] min-w-0 text-left focus:outline-none"
      >
        <FontAwesomeIcon
          icon={faEye}
          className="w-[14px] h-[14px] text-[var(--color-semantic-main-content-default)] shrink-0"
        />
        <div className="flex items-center gap-[2px] min-w-0">
          <span className="font-normal text-[14px] leading-[20px] text-[var(--color-semantic-main-content-default)] truncate">
            {view.name}
          </span>
          {view.isDefault && (
            <FontAwesomeIcon
              icon={faStarSolid}
              className="w-[14px] h-[14px] text-[var(--color-yellow-400)] shrink-0"
            />
          )}
          {isDirty && (
            <span
              className="w-[6px] h-[6px] rounded-full bg-[var(--color-primary-600)] shrink-0 ml-[4px]"
              aria-label="Modificada"
            />
          )}
        </div>
      </button>

      {/* Menu ⋯ */}
      <Popover open={menuOpen} onOpenChange={setMenuOpen}>
        <PopoverTrigger
          className="flex items-center justify-center w-[24px] h-[24px] p-[9px] rounded-[8px] hover:bg-[rgba(0,0,0,0.05)] transition-colors shrink-0 focus:outline-none"
          onClick={(e) => e.stopPropagation()}
        >
          <FontAwesomeIcon icon={faEllipsis} className="w-[12px] h-[12px] text-[var(--color-semantic-main-content-default)]" />
        </PopoverTrigger>
        <PopoverContent
          align="end"
          sideOffset={4}
          className="w-auto min-w-[180px] !p-0 !gap-0 rounded-[12px] bg-[var(--color-semantic-main-surface-secondary)] border border-[var(--color-semantic-main-border-default)] shadow-[0px_6px_16px_0px_rgba(0,0,0,0.08)] overflow-clip"
        >
          {/* Topo: ações não-destrutivas */}
          <div className="flex flex-col gap-[2px] pt-[4px] pb-[2px] px-[4px] w-full">
            <ActionMenuItem
              icon={faStar}
              label="Favoritar"
              onClick={() => { setMenuOpen(false); onSetDefault(); }}
            />
            <ActionMenuItem
              icon={faPenToSquare}
              label="Renomear"
              onClick={() => { setMenuOpen(false); onEdit(); }}
            />
            <ActionMenuItem
              icon={faCopy}
              label="Duplicar"
              onClick={() => { setMenuOpen(false); onDuplicate(); }}
            />
          </div>
          {/* Rodapé: ação destrutiva */}
          <div className="border-t border-[var(--color-semantic-main-border-default)] pt-[2px] pb-[4px] px-[4px] w-full">
            <ActionMenuItem
              icon={faTrash}
              label="Excluir"
              destructive
              onClick={() => { setMenuOpen(false); onDelete(); }}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

function ActionMenuItem({
  icon,
  label,
  onClick,
  destructive,
}: {
  icon: typeof faPlus;
  label: string;
  onClick: () => void;
  destructive?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex gap-[8px] items-center px-[16px] py-[8px] rounded-[8px] w-full text-left transition-colors focus:outline-none ${
        destructive
          ? 'text-[var(--color-red-700)] hover:bg-[rgba(169,17,13,0.08)]'
          : 'text-[var(--color-gray-1000)] hover:bg-[var(--color-semantic-main-hover-primary)]'
      }`}
    >
      <FontAwesomeIcon icon={icon} className="w-[14px] h-[14px] shrink-0" />
      <span className="font-normal text-[14px] leading-[20px]">{label}</span>
    </button>
  );
}
