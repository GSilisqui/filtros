import {
  faCalendar,
  faHeadset,
  faFaceSmile,
  faPlug,
  faAddressCard,
  faUsers,
  faTag,
  faComments,
  faVideo,
} from '@fortawesome/pro-regular-svg-icons';
import type { IconDefinition } from '@fortawesome/pro-regular-svg-icons';

export interface CategoryOption {
  label: string;
}

export type CategoryType = 'default' | 'date';

export const CONDITIONS_DEFAULT = ['É', 'Não é'] as const;
export const CONDITIONS_DATE = ['É', 'Não é', 'Depois de', 'Antes de', 'Está entre'] as const;
export type Condition = (typeof CONDITIONS_DEFAULT)[number] | (typeof CONDITIONS_DATE)[number];

export interface Category {
  key: string;
  label: string;
  icon: IconDefinition;
  type: CategoryType;
  options: CategoryOption[];
}

export const CATEGORIES: Category[] = [
  {
    key: 'periodo',
    label: 'Período',
    icon: faCalendar,
    type: 'date',
    options: [
      { label: 'Hoje' },
      { label: 'Ontem' },
      { label: 'Semana atual' },
      { label: 'Semana passada' },
      { label: 'Mês atual' },
      { label: 'Mês passado' },
      { label: 'Últimos 7 dias' },
      { label: 'Últimos 30 dias' },
    ],
  },
  {
    key: 'atendente',
    label: 'Atendente',
    icon: faHeadset,
    type: 'default',
    options: [
      { label: 'Ana Paula' },
      { label: 'Carlos Silva' },
      { label: 'Fernanda Lima' },
      { label: 'João Oliveira' },
      { label: 'Maria Santos' },
      { label: 'Patrícia Costa' },
      { label: 'Ricardo Mendes' },
    ],
  },
  {
    key: 'avaliacao',
    label: 'Avaliação',
    icon: faFaceSmile,
    type: 'default',
    options: [
      { label: '5 — Excelente' },
      { label: '4 — Ótimo' },
      { label: '3 — Bom' },
      { label: '2 — Regular' },
      { label: '1 — Ruim' },
    ],
  },
  {
    key: 'canal',
    label: 'Canal',
    icon: faPlug,
    type: 'default',
    options: [
      { label: 'WhatsApp' },
      { label: 'E-mail' },
      { label: 'Chat' },
      { label: 'Telefone' },
      { label: 'Instagram' },
      { label: 'Facebook' },
    ],
  },
  {
    key: 'cliente',
    label: 'Cliente',
    icon: faAddressCard,
    type: 'default',
    options: [
      { label: 'Alberto Reis' },
      { label: 'Ana Souza' },
      { label: 'Carlos Mendes' },
      { label: 'João Lima' },
      { label: 'Maria Silva' },
      { label: 'Pedro Santos' },
    ],
  },
  {
    key: 'departamento',
    label: 'Departamento',
    icon: faUsers,
    type: 'default',
    options: [
      { label: 'Comercial' },
      { label: 'Financeiro' },
      { label: 'Marketing' },
      { label: 'RH' },
      { label: 'Suporte' },
      { label: 'TI' },
    ],
  },
  {
    key: 'etiqueta',
    label: 'Etiqueta',
    icon: faTag,
    type: 'default',
    options: [
      { label: 'Aguardando' },
      { label: 'Cancelado' },
      { label: 'Em progresso' },
      { label: 'Feedback' },
      { label: 'Resolvido' },
      { label: 'Urgente' },
    ],
  },
  {
    key: 'motivo',
    label: 'Motivo do atendimento',
    icon: faComments,
    type: 'default',
    options: [
      { label: 'Cancelamento' },
      { label: 'Dúvida' },
      { label: 'Elogio' },
      { label: 'Outro' },
      { label: 'Reclamação' },
      { label: 'Solicitação' },
    ],
  },
  {
    key: 'videoconferencia',
    label: 'Videoconferência',
    icon: faVideo,
    type: 'default',
    options: [
      { label: 'Agendada' },
      { label: 'Cancelada' },
      { label: 'Concluída' },
      { label: 'Em andamento' },
    ],
  },
];
