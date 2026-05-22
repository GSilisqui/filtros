import { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faCheck, faAngleDown } from '@fortawesome/pro-regular-svg-icons';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import DatePickerContent from './DatePicker';
import {
  CONDITIONS_DEFAULT,
  type Category,
  type Condition,
} from '@/data/filterCategories';

const VISIBLE_ITEMS = 5;
const ITEM_HEIGHT = 36;

interface FilterValuePopoverProps {
  category: Category;
  selectedValues: string[];
  onValuesChange: (values: string[]) => void;
  condition?: Condition;
  onConditionChange?: (condition: Condition) => void;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

export default function FilterValuePopover({
  category,
  selectedValues,
  onValuesChange,
  condition: conditionProp,
  onConditionChange,
  defaultOpen = false,
  onOpenChange,
  children,
}: FilterValuePopoverProps) {
  const [search, setSearch] = useState('');
  const [internalCondition, setInternalCondition] = useState<Condition>('É');
  const condition = conditionProp ?? internalCondition;
  const setCondition = (c: Condition) => {
    if (onConditionChange) onConditionChange(c);
    else setInternalCondition(c);
  };
  const [conditionOpen, setConditionOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const conditions = CONDITIONS_DEFAULT;

  const filtered = category.options.filter((o) =>
    o.label.toLowerCase().includes(search.toLowerCase())
  );

  function toggleValue(label: string) {
    if (selectedValues.includes(label)) {
      onValuesChange(selectedValues.filter((v) => v !== label));
    } else {
      onValuesChange([...selectedValues, label]);
    }
  }

  // Filtros de data usam o DatePickerContent inteiro (não a lista de valores)
  if (category.type === 'date') {
    return (
      <Popover
        defaultOpen={defaultOpen}
        onOpenChange={(open) => {
          if (!open) setConditionOpen(false);
          onOpenChange?.(open);
        }}
      >
        <PopoverTrigger asChild>{children}</PopoverTrigger>
        <PopoverContent
          align="start"
          sideOffset={4}
          className="w-auto !p-0 !gap-0 !rounded-[12px] !border-0 !shadow-none !bg-transparent overflow-visible"
        >
          <DatePickerContent
            category={category}
            selectedValues={selectedValues}
            onValuesChange={onValuesChange}
            condition={condition}
            onConditionChange={setCondition}
          />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Popover
      defaultOpen={defaultOpen}
      onOpenChange={(open) => {
        if (!open) { setSearch(''); setConditionOpen(false); }
        onOpenChange?.(open);
      }}
    >
      <PopoverTrigger asChild>{children}</PopoverTrigger>

      <PopoverContent
        align="start"
        sideOffset={4}
        className="w-auto min-w-[240px] p-[4px] gap-[4px] rounded-[12px] bg-[var(--color-semantic-main-surface-secondary)] border border-[var(--color-semantic-main-border-default)] shadow-[0px_6px_16px_0px_rgba(0,0,0,0.08)] overflow-visible"
        onOpenAutoFocus={(e) => {
          e.preventDefault();
          inputRef.current?.focus();
        }}
      >
        {/* Header: nome da categoria + condicional inline (logo após o título) */}
        <div className="flex items-center gap-[2px] pl-[12px] w-full">
          <span className="min-w-0 font-normal text-[12px] leading-[16px] text-[var(--color-gray-1000)] whitespace-nowrap truncate">
            {category.label}
          </span>
          <Popover open={conditionOpen} onOpenChange={setConditionOpen}>
            <PopoverTrigger asChild>
              <button className="flex gap-[8px] items-center justify-center px-[8px] py-[4px] rounded-[8px] hover:bg-[var(--color-semantic-main-hover-primary)] transition-colors shrink-0 focus:outline-none">
                <span className="font-normal text-[12px] leading-[16px] text-[var(--color-gray-1000)] whitespace-nowrap">{condition}</span>
                <FontAwesomeIcon icon={faAngleDown} className="w-[12px] h-[12px] text-[var(--color-semantic-main-content-default)]" />
              </button>
            </PopoverTrigger>

            {/* Mini-popover de condições */}
            <PopoverContent
              align="end"
              sideOffset={4}
              className="w-auto !p-[4px] !gap-0 rounded-[12px] bg-[var(--color-semantic-main-surface-secondary)] border border-[var(--color-semantic-main-border-default)] shadow-[0px_6px_16px_0px_rgba(0,0,0,0.08)] overflow-clip"
            >
              <div className="flex flex-col gap-[2px] items-start">
                {conditions.map((cond) => (
                  <button
                    key={cond}
                    onClick={() => { setCondition(cond); setConditionOpen(false); }}
                    className={`flex items-center justify-between gap-[8px] h-[36px] min-w-[140px] px-[12px] py-[8px] rounded-[8px] transition-colors focus:outline-none ${
                      condition === cond
                        ? 'bg-[var(--color-gray-300)]'
                        : 'hover:bg-[var(--color-semantic-main-hover-primary)]'
                    }`}
                  >
                    <span className="font-normal text-[14px] leading-[20px] text-[var(--color-semantic-main-content-default)] whitespace-nowrap">
                      {cond}
                    </span>
                    {condition === cond && (
                      <FontAwesomeIcon icon={faCheck} className="w-[14px] h-[14px] shrink-0 text-[var(--color-gray-900)]" />
                    )}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Input de busca */}
        <div className="flex gap-[4px] h-[36px] items-center px-[12px] py-[8px] rounded-[8px] bg-[var(--color-semantic-main-surface-secondary)] border border-[var(--color-semantic-main-border-primary)] shadow-[0px_0px_0px_2px_rgba(58,47,193,0.1)] w-full overflow-clip shrink-0">
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="text-[var(--color-gray-1000)] shrink-0 w-[14px] h-[14px]"
          />
          <input
            ref={inputRef}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar..."
            className="flex-1 min-w-0 bg-transparent outline-none font-normal text-[14px] leading-[20px] text-[var(--color-gray-1000)] placeholder:text-[var(--color-gray-700)] caret-[var(--color-primary-600)]"
          />
        </div>

        {/* Lista de opções com scroll após 5 itens */}
        <div
          className="flex flex-col gap-[2px] items-start w-full text-[14px] overflow-y-auto"
          style={{ maxHeight: VISIBLE_ITEMS * ITEM_HEIGHT }}
        >
          {filtered.map((option) => {
            const isSelected = selectedValues.includes(option.label);
            return (
              <button
                key={option.label}
                onClick={() => toggleValue(option.label)}
                className={`flex gap-[8px] items-center px-[12px] py-[8px] rounded-[8px] w-full text-left transition-colors focus:outline-none ${
                  isSelected
                    ? 'bg-[var(--color-gray-300)]'
                    : 'hover:bg-[var(--color-semantic-main-hover-primary)]'
                }`}
              >
                <span className="flex-1 font-normal leading-[20px] text-[var(--color-semantic-main-content-default)] whitespace-nowrap">{option.label}</span>
                {isSelected && (
                  <FontAwesomeIcon
                    icon={faCheck}
                    className="w-[14px] h-[14px] shrink-0 text-[var(--color-gray-900)]"
                  />
                )}
              </button>
            );
          })}
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
