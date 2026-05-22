import { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/pro-regular-svg-icons';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CATEGORIES } from '@/data/filterCategories';
import type { Category } from '@/data/filterCategories';

const VISIBLE_ITEMS = 5;
const ITEM_HEIGHT = 36;

interface FilterPopoverProps {
  children: React.ReactNode;
  onCategorySelect: (category: Category) => void;
}

export default function FilterPopover({ children, onCategorySelect }: FilterPopoverProps) {
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = CATEGORIES.filter((c) =>
    c.label.toLowerCase().includes(search.toLowerCase())
  );

  function handleSelect(category: Category) {
    setOpen(false);
    setSearch('');
    onCategorySelect(category);
  }

  return (
    <Popover open={open} onOpenChange={(v) => { setOpen(v); if (!v) setSearch(''); }}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>

      <PopoverContent
        align="start"
        sideOffset={4}
        className="w-auto min-w-[220px] p-[4px] gap-[4px] rounded-[12px] bg-[var(--color-semantic-main-surface-secondary)] border border-[var(--color-semantic-main-border-default)] shadow-[0px_6px_16px_0px_rgba(0,0,0,0.08)] overflow-clip"
        onOpenAutoFocus={(e) => {
          e.preventDefault();
          inputRef.current?.focus();
        }}
      >
        {/* Input de busca */}
        <div className="flex gap-[4px] h-[36px] items-center px-[12px] py-[8px] rounded-[8px] bg-[var(--color-semantic-main-surface-secondary)] border border-[var(--color-semantic-main-border-primary)] shadow-[0px_0px_0px_2px_rgba(58,47,193,0.1)] w-full overflow-clip shrink-0">
          <div className="flex flex-[1_0_0] gap-[4px] items-center min-w-0">
            <FontAwesomeIcon icon={faMagnifyingGlass} className="text-[var(--color-gray-1000)] shrink-0 w-[14px] h-[14px]" />
            <input
              ref={inputRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 min-w-0 bg-transparent outline-none font-normal text-[14px] leading-[20px] text-[var(--color-gray-1000)] placeholder:text-[var(--color-gray-700)] caret-[var(--color-primary-600)]"
            />
          </div>
        </div>

        {/* Lista com scroll após 5 itens */}
        <div
          className="flex flex-col gap-[2px] items-start w-full text-[14px] overflow-y-auto"
          style={{ maxHeight: VISIBLE_ITEMS * ITEM_HEIGHT }}
        >
          {filtered.map((category) => (
            <button
              key={category.key}
              onClick={() => handleSelect(category)}
              className="flex gap-[8px] items-center px-[12px] py-[8px] rounded-[8px] w-full text-left hover:bg-[var(--color-semantic-main-hover-primary)] transition-colors"
            >
              <FontAwesomeIcon icon={category.icon} className="w-[14px] h-[14px] text-[var(--color-gray-1000)] shrink-0" />
              <span className="font-normal leading-[20px] text-[var(--color-semantic-main-content-default)] whitespace-nowrap">
                {category.label}
              </span>
            </button>
          ))}
          {filtered.length === 0 && (
            <p className="px-[12px] py-[8px] text-[14px] text-[var(--color-gray-700)]">
              Nenhum resultado
            </p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
