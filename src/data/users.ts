import type { Customer } from '../types/models';

export const seedCustomers: Customer[] = [
  {
    id: 'cst-001',
    firstName: 'Ava',
    lastName: 'Morgan',
    email: 'customer@medicarthq.com',
    phone: '+1 (555) 302-9918',
    defaultAddress: '1207 Pine Street, Austin, TX 78701',
    isAdmin: false,
  },
  {
    id: 'adm-001',
    firstName: 'Noah',
    lastName: 'Walters',
    email: 'admin@medicarthq.com',
    phone: '+1 (555) 118-0901',
    defaultAddress: 'Admin Operations Center',
    isAdmin: true,
  },
];
