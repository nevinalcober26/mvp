import type { UniqueIdentifier } from '@dnd-kit/core';

export type ScheduleRule = {
  id: string;
  weekday: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday' | 'Everyday';
  allDay: boolean;
  from?: string; // HH:mm
  to?: string; // HH:mm
  disableOrder: boolean;
};

export type CategoryBase = {
  description?: string;
  schedules?: ScheduleRule[];
  // display
  displayFullwidth?: boolean;
  hiddenTitle?: boolean;
  hiddenImage?: boolean;
  cardShadow?: boolean;
  // advanced
  hidden?: boolean;
  disableLink?: boolean;
  externalLink?: string;
  enableSpecial?: boolean;
  specialType?: string;
  displaySeparate?: boolean;
  viewFormat?: string;
  promotions?: string;
  sortOrder?: number;
}

export type Item = CategoryBase & {
  id: UniqueIdentifier;
  name: string;
  children: Item[];
};

export type Column = CategoryBase & {
  id: UniqueIdentifier;
  name: string;
  items: Item[];
};
