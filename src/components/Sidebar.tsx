import { useState } from 'react';
import Icon from './Icon';

interface SidebarItem {
  icon: string;
  label: string;
  solid?: boolean;
  badge?: boolean;
}

const menuGroups: SidebarItem[][] = [
  [{ icon: 'search', label: 'Buscar' }],
  [
    { icon: 'home', label: 'Início' },
    { icon: 'message', label: 'Atendimentos', badge: true },
    { icon: 'calendar', label: 'Agenda' },
  ],
  [
    { icon: 'contact-card', label: 'Contatos' },
    { icon: 'chart-line', label: 'Analytics', solid: true },
    { icon: 'comments', label: 'Chat Interno', badge: true },
  ],
  [
    { icon: 'sparkles', label: 'OPA! IA' },
    { icon: 'gear', label: 'Configurações' },
  ],
];

export default function Sidebar() {
  const [activeItem, setActiveItem] = useState('Analytics');
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <nav className="flex flex-col gap-[16px] items-start shrink-0 w-[36px] h-full">
      {/* Logo */}
      <div className="relative shrink-0 w-[36px] h-[36px]">
        <div className="w-full h-full rounded-[8px] bg-gradient-to-br from-[var(--color-secondary-600)] to-[var(--color-secondary-500)] flex items-center justify-center">
          <span className="text-white text-[10px] font-bold leading-none">opa!</span>
        </div>
      </div>

      {/* SidebarContent: flex-1, gap-16, centered */}
      <div className="flex flex-col flex-[1_0_0] min-h-0 items-center gap-[16px]">
        {menuGroups.map((group, gi) => (
          <div key={gi} className="flex flex-col items-start shrink-0">
            {group.map((item) => {
              const isActive = activeItem === item.label;
              return (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setHoveredItem(item.label)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <button
                    onClick={() => setActiveItem(item.label)}
                    className={`
                      relative flex gap-[8px] items-center justify-center
                      w-[36px] h-[36px] p-[10px] rounded-[6px]
                      transition-all duration-150
                      ${isActive
                        ? 'bg-[var(--color-gray-300)] border border-[var(--color-gray-500)]'
                        : 'hover:bg-[var(--color-gray-300)]/50'
                      }
                    `}
                  >
                    <div className="flex items-center justify-center shrink-0 w-[16px]">
                      <div className="flex h-[16px] items-center justify-center shrink-0">
                        <Icon
                          name={item.icon}
                          solid={item.solid || isActive}
                          className={
                            isActive
                              ? 'text-[var(--color-semantic-main-content-default)]'
                              : 'text-[var(--color-gray-900)]'
                          }
                        />
                      </div>
                    </div>
                    {item.badge && (
                      <span className="absolute top-[3px] left-[27px] w-[6px] h-[6px] rounded-[999px] bg-[#f97d00] border-2 border-[rgba(249,125,0,0.2)]" />
                    )}
                  </button>

                  {hoveredItem === item.label && (
                    <div className="absolute left-[calc(100%+8px)] top-1/2 -translate-y-1/2 z-50 whitespace-nowrap px-2 py-1 rounded-[6px] bg-[var(--color-gray-1000)] text-[var(--color-gray-100)] text-xs leading-4 shadow-lg pointer-events-none">
                      {item.label}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Bottom: SidebarMenuItem/2 lines — gap-8, centered */}
      <div className="flex flex-col gap-[8px] items-center justify-center w-full rounded-[6px] shrink-0">
        {/* Bell */}
        <div className="relative">
          <button className="flex gap-[8px] items-center justify-center w-[36px] h-[36px] p-[10px] rounded-[6px] hover:bg-[var(--color-gray-300)]/50 transition-colors">
            <div className="flex items-center justify-center shrink-0 w-[16px]">
              <Icon name="bell" className="text-[var(--color-gray-900)]" />
            </div>
          </button>
          <span className="absolute top-[3px] left-[27px] w-[6px] h-[6px] rounded-[999px] bg-[#f97d00] border-2 border-[rgba(249,125,0,0.2)]" />
        </div>

        {/* Avatar */}
        <div className="relative shrink-0 w-[36px] h-[36px]">
          <div className="absolute inset-0 rounded-[10.8px] bg-[var(--color-gray-500)]" />
          <div className="absolute bg-[var(--color-green-600)] border-[1.8px] border-[var(--color-semantic-main-surface-secondary)] rounded-full" style={{ inset: '80% 0 0 80%' }} />
          <div className="absolute flex flex-col justify-end font-normal text-[14.4px] text-[var(--color-gray-1000)] whitespace-nowrap" style={{ inset: '20% 22.5%' }}>
            <p className="leading-[21.6px]">AB</p>
          </div>
        </div>
      </div>
    </nav>
  );
}
