import Icon from './Icon';

interface BreadcrumbItem {
  label: string;
  active?: boolean;
}

const breadcrumbs: BreadcrumbItem[] = [
  { label: 'Analítico' },
  { label: 'Atendimentos' },
  { label: 'Relatório de atendimentos', active: true },
];

export default function Breadcrumbs() {
  return (
    <div className="flex gap-[4px] items-center border-b border-[var(--color-semantic-main-border-default)] px-[16px] py-[12px] shrink-0 w-full">
      {/* Inner frame: flex-1, gap-4px */}
      <div className="flex flex-[1_0_0] gap-[4px] items-center min-w-0">
        {/* Nav arrows frame: flex items-center, NO gap */}
        <div className="flex items-center shrink-0">
          <button className="flex gap-0 items-center justify-center w-[36px] h-[36px] p-[9px] rounded-[12px] shrink-0 hover:bg-[var(--color-gray-200)] transition-colors">
            <div className="flex items-center justify-center shrink-0 w-[16px]">
              <Icon name="arrow-left" className="text-[var(--color-gray-700)]" />
            </div>
          </button>
          <button className="flex gap-0 items-center justify-center w-[36px] h-[36px] p-[9px] rounded-[12px] shrink-0 hover:bg-[var(--color-gray-200)] transition-colors">
            <div className="flex items-center justify-center shrink-0 w-[16px]">
              <Icon name="arrow-right" className="text-[var(--color-gray-700)]" />
            </div>
          </button>
        </div>

        {/* Breadcrumb path: flex gap-4px h-24px items-center justify-center */}
        <div className="flex gap-[4px] h-[24px] items-center justify-center shrink-0">
          {breadcrumbs.map((item, i) => (
            <div key={item.label} className="contents">
              {i > 0 && (
                <span className="shrink-0 text-[14px] leading-normal text-[var(--color-primary-600)] whitespace-nowrap">
                  <Icon name="angle-right" className="!w-[9px] !h-[14px] text-[var(--color-primary-600)]" />
                </span>
              )}
              <div className="flex items-center justify-center min-w-[24px] shrink-0">
                <span
                  className={`flex-[1_0_0] min-w-0 text-center whitespace-nowrap font-normal ${
                    item.active
                      ? 'text-[14px] leading-[20px] text-[var(--color-gray-1000)]'
                      : 'text-[12px] leading-[16px] text-[var(--color-gray-800)]'
                  }`}
                >
                  {item.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
