import type { ProductCategory } from '../types/models';

export const categories: { key: ProductCategory; label: string }[] = [
  { key: 'mobility', label: 'Mobility' },
  { key: 'monitoring', label: 'Monitoring' },
  { key: 'respiratory', label: 'Respiratory' },
  { key: 'diagnostics', label: 'Diagnostics' },
  { key: 'rehab', label: 'Rehab' },
  { key: 'consumables', label: 'Consumables' },
];
