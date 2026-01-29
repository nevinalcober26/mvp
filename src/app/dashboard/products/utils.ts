import type { Product } from './types';

export const getStatusBadgeVariant = (status: Product['status']) => {
  switch (status) {
    case 'Active':
      return 'default';
    case 'Archived':
      return 'secondary';
    case 'Out of Stock':
      return 'destructive';
    case 'Draft':
      return 'outline';
    default:
      return 'outline';
  }
};
