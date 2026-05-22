import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faPlus, faFloppyDisk } from '@fortawesome/pro-regular-svg-icons';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ButtonGroup } from './ui/button-group';

interface SaveChangesMenuProps {
  activeViewName: string;
  onSaveToCurrent: () => void;
  onSaveAsNew: () => void;
}

export default function SaveChangesMenu({
  activeViewName,
  onSaveToCurrent,
  onSaveAsNew,
}: SaveChangesMenuProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <ButtonGroup>
      <button
        onClick={onSaveToCurrent}
        className="flex gap-[8px] items-center justify-center px-[8px] py-[4px] rounded-tl-[8px] rounded-bl-[8px] bg-[var(--color-gray-400)] shrink-0 hover:bg-[var(--color-gray-500)] transition-colors"
      >
        <span className="font-normal text-[12px] leading-[16px] text-[var(--color-semantic-main-content-default)] whitespace-nowrap">
          Salvar alterações
        </span>
      </button>

      <Popover open={menuOpen} onOpenChange={setMenuOpen}>
        <PopoverTrigger
          className="flex items-center justify-center w-[24px] h-[24px] p-[5px] rounded-tr-[8px] rounded-br-[8px] bg-[var(--color-gray-400)] border-l border-[rgba(109,116,142,0.1)] shrink-0 hover:bg-[var(--color-gray-500)] transition-colors"
        >
          <FontAwesomeIcon icon={faAngleDown} className="w-[12px] h-[12px] text-[var(--color-semantic-main-content-default)]" />
        </PopoverTrigger>
        <PopoverContent
          align="end"
          sideOffset={6}
          className="w-auto min-w-[260px] p-[4px] rounded-[12px] bg-[var(--color-semantic-main-surface-secondary)] border border-[var(--color-semantic-main-border-default)] shadow-[0px_6px_16px_0px_rgba(0,0,0,0.08)] overflow-clip"
        >
          <button
            onClick={() => { setMenuOpen(false); onSaveToCurrent(); }}
            className="flex gap-[8px] items-center px-[10px] py-[8px] rounded-[6px] w-full text-left hover:bg-[var(--color-semantic-main-hover-primary)] transition-colors"
          >
            <FontAwesomeIcon icon={faFloppyDisk} className="w-[14px] h-[14px] text-[var(--color-gray-900)] shrink-0" />
            <span className="font-normal text-[14px] leading-[20px] text-[var(--color-gray-1000)] truncate">
              Salvar alterações em "{activeViewName}"
            </span>
          </button>
          <button
            onClick={() => { setMenuOpen(false); onSaveAsNew(); }}
            className="flex gap-[8px] items-center px-[10px] py-[8px] rounded-[6px] w-full text-left hover:bg-[var(--color-semantic-main-hover-primary)] transition-colors"
          >
            <FontAwesomeIcon icon={faPlus} className="w-[14px] h-[14px] text-[var(--color-gray-900)] shrink-0" />
            <span className="font-normal text-[14px] leading-[20px] text-[var(--color-gray-1000)]">
              Salvar como nova visualização…
            </span>
          </button>
        </PopoverContent>
      </Popover>
    </ButtonGroup>
  );
}
