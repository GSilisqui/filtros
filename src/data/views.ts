import type { Condition } from './filterCategories';

export interface SavedFilter {
  categoryKey: string;
  values: string[];
  condition?: Condition;
}

export interface View {
  id: string;
  name: string;
  isDefault: boolean;
  filters: SavedFilter[];
}

export const INITIAL_VIEWS: View[] = [
  {
    id: 'view-default',
    name: 'Padrão do sistema',
    isDefault: true,
    filters: [
      { categoryKey: 'periodo', values: ['Semana atual'] },
      { categoryKey: 'atendente', values: ['Ana Paula', 'Carlos Silva', 'Fernanda Lima'] },
      { categoryKey: 'canal', values: ['WhatsApp'] },
      { categoryKey: 'cliente', values: ['Alberto Reis', 'Ana Souza', 'Carlos Mendes'] },
      { categoryKey: 'departamento', values: ['Comercial'] },
    ],
  },
  {
    id: 'view-midias',
    name: 'Mídias',
    isDefault: false,
    filters: [
      { categoryKey: 'periodo', values: ['Mês atual'] },
      { categoryKey: 'videoconferencia', values: ['Concluída'] },
    ],
  },
];
