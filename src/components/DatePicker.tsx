import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAngleDown,
  faAngleLeft,
  faAngleRight,
  faCheck,
} from '@fortawesome/pro-regular-svg-icons';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RangeCalendar } from '@heroui/react';
import {
  CalendarDate,
  parseDate,
  type DateValue,
} from '@internationalized/date';
import {
  CONDITIONS_DATE,
  type Category,
  type Condition,
} from '@/data/filterCategories';

function isoFromBR(s: string): string | null {
  const m = s.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!m) return null;
  return `${m[3]}-${m[2]}-${m[1]}`;
}

function brFromCalendarDate(d: DateValue): string {
  return `${String(d.day).padStart(2, '0')}/${String(d.month).padStart(2, '0')}/${d.year}`;
}

function parseStoredRange(values: string[]): { start: CalendarDate; end: CalendarDate } | null {
  const startStr = values[0];
  const endStr = values[1] ?? values[0];
  const startISO = startStr ? isoFromBR(startStr) : null;
  const endISO = endStr ? isoFromBR(endStr) : null;
  if (!startISO || !endISO) return null;
  try {
    return {
      start: parseDate(startISO),
      end: parseDate(endISO),
    };
  } catch {
    return null;
  }
}

interface DatePickerContentProps {
  category: Category;
  selectedValues: string[];
  onValuesChange: (values: string[]) => void;
  condition: Condition;
  onConditionChange: (condition: Condition) => void;
}

export default function DatePickerContent({
  category,
  selectedValues,
  onValuesChange,
  condition,
  onConditionChange,
}: DatePickerContentProps) {
  const [conditionOpen, setConditionOpen] = useState(false);

  const selectedQuickOption = category.options.find((o) => selectedValues.includes(o.label));
  const range = !selectedQuickOption ? parseStoredRange(selectedValues) : null;

  function selectQuickOption(label: string) {
    onValuesChange([label]);
  }

  function handleRangeChange(value: { start: DateValue; end: DateValue } | null) {
    if (!value) return;
    onValuesChange([brFromCalendarDate(value.start), brFromCalendarDate(value.end)]);
  }

  return (
    <div className="flex gap-[12px] items-stretch p-[16px] bg-[var(--color-semantic-main-surface-secondary)] border border-[var(--color-gray-400)] rounded-[12px] drop-shadow-[0px_1px_2px_rgba(0,0,0,0.25)]">
      {/* Left: Quick options */}
      <div className="relative flex flex-col gap-[4px] w-[130px] overflow-y-auto max-h-[320px]">
        {category.options.map((opt) => {
          const isActive = selectedValues.includes(opt.label);
          return (
            <button
              key={opt.label}
              onClick={() => selectQuickOption(opt.label)}
              className={`flex h-[36px] items-center justify-between px-[12px] py-[2px] rounded-[12px] shrink-0 w-full transition-colors focus:outline-none ${
                isActive
                  ? 'bg-[var(--color-gray-300)] border border-[var(--color-gray-400)]'
                  : 'border border-transparent hover:bg-[var(--color-semantic-main-hover-primary)]'
              }`}
            >
              <span className="font-normal text-[12px] leading-[16px] text-[var(--color-gray-1000)] whitespace-nowrap">
                {opt.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Divider */}
      <div className="w-[1px] bg-[var(--color-gray-400)] self-stretch" />

      {/* Right: Calendar */}
      <div className="flex flex-col gap-[12px] items-start justify-start min-w-[280px]">
        {/* Header: "Período" + condicional */}
        <div className="flex gap-[2px] items-center">
          <span className="font-normal text-[12px] leading-[16px] text-[var(--color-gray-1000)] whitespace-nowrap">
            Período
          </span>
          <Popover open={conditionOpen} onOpenChange={setConditionOpen}>
            <PopoverTrigger asChild>
              <button className="flex gap-[4px] items-center justify-center px-[8px] py-[4px] rounded-[8px] hover:bg-[var(--color-semantic-main-hover-primary)] transition-colors focus:outline-none">
                <span className="font-normal text-[12px] leading-[16px] text-[var(--color-gray-1000)] whitespace-nowrap">{condition}</span>
                <FontAwesomeIcon icon={faAngleDown} className="w-[12px] h-[12px] text-[var(--color-semantic-main-content-default)]" />
              </button>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              sideOffset={4}
              className="w-auto !p-[4px] !gap-0 rounded-[12px] bg-[var(--color-semantic-main-surface-secondary)] border border-[var(--color-semantic-main-border-default)] shadow-[0px_6px_16px_0px_rgba(0,0,0,0.08)] overflow-clip"
            >
              <div className="flex flex-col gap-[2px]">
                {CONDITIONS_DATE.map((c) => (
                  <button
                    key={c}
                    onClick={() => { onConditionChange(c); setConditionOpen(false); }}
                    className={`flex items-center justify-between gap-[8px] h-[36px] min-w-[140px] px-[12px] py-[8px] rounded-[8px] transition-colors focus:outline-none ${
                      condition === c ? 'bg-[var(--color-gray-300)]' : 'hover:bg-[var(--color-semantic-main-hover-primary)]'
                    }`}
                  >
                    <span className="font-normal text-[14px] leading-[20px] text-[var(--color-semantic-main-content-default)] whitespace-nowrap">{c}</span>
                    {condition === c && (
                      <FontAwesomeIcon icon={faCheck} className="w-[14px] h-[14px] shrink-0 text-[var(--color-gray-900)]" />
                    )}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* HeroUI RangeCalendar */}
        <RangeCalendar
          aria-label="Período"
          value={range}
          onChange={handleRangeChange}
          className="flex flex-col gap-[8px] w-full"
        >
          <RangeCalendar.Header className="flex items-center justify-between w-full">
            <RangeCalendar.NavButton
              slot="previous"
              className="flex items-center justify-center w-[24px] h-[24px] p-[9px] rounded-[8px] hover:bg-[var(--color-semantic-main-hover-primary)] transition-colors focus:outline-none"
            >
              <FontAwesomeIcon icon={faAngleLeft} className="w-[14px] h-[14px] text-[var(--color-gray-1000)]" />
            </RangeCalendar.NavButton>

            <RangeCalendar.YearPickerTrigger className="flex gap-[4px] items-center justify-center px-[8px] py-[4px] rounded-[8px] hover:bg-[var(--color-semantic-main-hover-primary)] transition-colors focus:outline-none">
              <RangeCalendar.YearPickerTriggerHeading className="font-normal text-[12px] leading-[16px] text-[var(--color-gray-900)] whitespace-nowrap capitalize" />
              <RangeCalendar.YearPickerTriggerIndicator>
                <FontAwesomeIcon icon={faAngleDown} className="w-[12px] h-[12px] text-[var(--color-gray-1000)]" />
              </RangeCalendar.YearPickerTriggerIndicator>
            </RangeCalendar.YearPickerTrigger>

            <RangeCalendar.NavButton
              slot="next"
              className="flex items-center justify-center w-[24px] h-[24px] p-[9px] rounded-[8px] hover:bg-[var(--color-semantic-main-hover-primary)] transition-colors focus:outline-none"
            >
              <FontAwesomeIcon icon={faAngleRight} className="w-[14px] h-[14px] text-[var(--color-gray-1000)]" />
            </RangeCalendar.NavButton>
          </RangeCalendar.Header>

          <div className="bg-[var(--color-gray-400)] h-px w-full rounded-[0.5px]" />

          {/* Grade do calendário (oculta quando year picker aberto) */}
          <RangeCalendar.Grid className="hui-rangecalendar-grid w-full">
            <RangeCalendar.GridHeader>
              {(day) => (
                <RangeCalendar.HeaderCell className="w-[32px] h-[24px] text-center font-normal text-[10px] leading-none uppercase text-[var(--color-gray-800)]">
                  {day.slice(0, 1)}
                </RangeCalendar.HeaderCell>
              )}
            </RangeCalendar.GridHeader>
            <RangeCalendar.GridBody>
              {(date) => (
                <RangeCalendar.Cell
                  date={date}
                  className="hui-rangecalendar-cell w-[32px] h-[32px] text-center text-[12px] cursor-pointer rounded-[8px] outline-none data-[outside-month]:text-[var(--color-gray-700)] data-[outside-month]:opacity-40 data-[hovered]:bg-[var(--color-semantic-main-hover-primary)] data-[selected]:bg-[var(--color-primary-100)] data-[selected]:text-[var(--color-gray-1000)] data-[selection-start]:bg-[var(--color-primary-600)] data-[selection-start]:!text-white data-[selection-end]:bg-[var(--color-primary-600)] data-[selection-end]:!text-white data-[disabled]:opacity-30 flex items-center justify-center"
                />
              )}
            </RangeCalendar.GridBody>
          </RangeCalendar.Grid>

          {/* Year picker grid (visível quando year picker aberto) */}
          <RangeCalendar.YearPickerGrid className="grid grid-cols-3 gap-[4px] w-full">
            <RangeCalendar.YearPickerGridBody>
              {(year) => (
                <RangeCalendar.YearPickerCell
                  year={year}
                  className="flex items-center justify-center h-[36px] px-[8px] rounded-[8px] cursor-pointer outline-none text-[12px] text-[var(--color-gray-1000)] data-[hovered]:bg-[var(--color-semantic-main-hover-primary)] data-[selected]:bg-[var(--color-primary-600)] data-[selected]:text-white data-[disabled]:opacity-30"
                >
                  {year.formattedDate}
                </RangeCalendar.YearPickerCell>
              )}
            </RangeCalendar.YearPickerGridBody>
          </RangeCalendar.YearPickerGrid>
        </RangeCalendar>
      </div>
    </div>
  );
}
