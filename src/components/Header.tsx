import Icon from './Icon';

interface HeaderProps {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  activeFilterCount: number;
}

export default function Header({ collapsed, setCollapsed, activeFilterCount }: HeaderProps) {
  return (
    <div className="flex items-center justify-between h-[52px] px-[16px] border-b border-[var(--color-semantic-main-border-default)] shrink-0 w-full">
      {/* Left: search → filter → columns */}
      <div className="flex gap-[8px] items-center shrink-0">
        <div className="flex gap-[4px] items-center w-[250px] min-w-[150px] h-[36px] px-[12px] py-[8px] border border-[var(--color-semantic-main-border-default)] rounded-[12px] text-[14px] whitespace-nowrap shrink-0">
          <div className="flex flex-[1_0_0] gap-[4px] items-center min-w-0">
            <Icon name="search" className="text-[var(--color-gray-1000)] shrink-0" />
            <span className="font-normal text-[14px] leading-[20px] text-[var(--color-gray-900)] overflow-hidden text-ellipsis shrink-0">Busque...</span>
          </div>
        </div>

        {/* Funil — imediatamente após search */}
        <div className="relative shrink-0 w-[36px] h-[36px]">
          <button
            onClick={() => setCollapsed(!collapsed)}
            aria-pressed={!collapsed}
            aria-label={collapsed ? 'Expandir filtros' : 'Recolher filtros'}
            className={`absolute left-0 top-0 flex items-center justify-center w-[36px] h-[36px] p-[9px] rounded-[12px] border transition-colors focus:outline-none ${
              collapsed
                ? 'border-[var(--color-gray-400)] hover:bg-[var(--color-gray-200)]'
                : 'border-[var(--color-gray-400)] bg-[rgba(109,116,142,0.1)] hover:bg-[rgba(109,116,142,0.18)]'
            }`}
          >
            <Icon name="bars-filter" className="text-[var(--color-gray-1000)]" />
          </button>
          {activeFilterCount > 0 && (
            <div className="absolute top-[-4px] left-[22px] flex items-center justify-center h-[14px] min-w-[14px] px-[3px] rounded-full bg-[var(--color-blue-600)] pointer-events-none">
              <span className="text-[10px] font-medium leading-[12px] text-[var(--color-gray-100)] text-center whitespace-nowrap">
                {activeFilterCount}
              </span>
            </div>
          )}
        </div>

        {/* Colunas — após o funil */}
        <button className="flex items-center justify-center w-[36px] h-[36px] p-[9px] rounded-[12px] border border-[var(--color-gray-400)] shrink-0 hover:bg-[var(--color-gray-200)] transition-colors">
          <Icon name="columns" className="text-[var(--color-gray-1000)]" />
        </button>
      </div>

      {/* Right: apenas Acessar relatório */}
      <div className="flex items-center shrink-0">
        <button className="flex gap-[8px] items-center justify-center px-[16px] py-[8px] rounded-[12px] bg-[var(--color-gray-400)] text-[14px] text-[var(--color-semantic-main-content-default)] whitespace-nowrap shrink-0 hover:bg-[var(--color-gray-500)] transition-colors">
          <Icon name="external-link" />
          <span className="font-normal leading-[20px]">Acessar relatório</span>
        </button>
      </div>
    </div>
  );
}
