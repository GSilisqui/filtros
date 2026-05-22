import { useState } from 'react';
import Icon from './Icon';

interface MenuItem {
  icon: string;
  label: string;
  solid?: boolean;
}

const menuItems: MenuItem[] = [
  { icon: 'user-headset', label: 'Atendentes' },
  { icon: 'comment', label: 'Atendimentos', solid: true },
  { icon: 'phone-intercom', label: 'Telefonia' },
];

export default function SubMenu() {
  const [activeItem, setActiveItem] = useState('Atendimentos');

  return (
    <div className="w-[250px] shrink-0 border-r border-[var(--color-semantic-main-border-default)] h-full p-[16px] overflow-clip flex flex-col gap-0 items-start">
      {/* Menu Items: flex-col, no gap */}
      <div className="flex flex-col items-start shrink-0 w-full">
        {menuItems.map((item) => {
          const isActive = activeItem === item.label;
          return (
            <button
              key={item.label}
              onClick={() => setActiveItem(item.label)}
              className={`
                flex gap-[8px] items-center w-full p-[8px] rounded-[6px] overflow-clip shrink-0
                transition-all duration-150
                ${isActive
                  ? 'bg-[var(--color-semantic-main-hover-primary)] border border-[var(--color-semantic-main-border-default)] h-[36px] justify-center'
                  : ''
                }
              `}
            >
              {/* Icon container: 16px wide */}
              <div className="flex items-center justify-center shrink-0 w-[16px]">
                <div className="flex h-[16px] items-center justify-center shrink-0">
                  <Icon
                    name={item.icon}
                    solid={item.solid && isActive}
                    className={`text-[14px] ${
                      isActive
                        ? 'text-[var(--color-gray-1000)]'
                        : 'text-[var(--color-gray-900)]'
                    }`}
                  />
                </div>
              </div>
              {/* Text container: flex-1 */}
              <div className={`flex flex-[1_0_0] gap-[4px] items-center min-w-0 ${isActive ? 'h-full' : ''}`}>
                <span
                  className={`font-normal text-[14px] leading-[20px] overflow-hidden text-ellipsis whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'text-[var(--color-gray-1000)]'
                      : 'text-[var(--color-gray-900)]'
                  }`}
                >
                  {item.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
