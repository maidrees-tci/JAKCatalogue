import { useProducts } from '../../../hooks/useProducts';

export function AdminCustomersPage() {
  const { customers } = useProducts();
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Admin Customers</h1>
      <div className="grid gap-3 md:grid-cols-2">
        {customers.map((customer) => (
          <div key={customer.id} className="rounded-xl border border-neutral-200 bg-white p-4">
            <p className="font-semibold">{customer.firstName} {customer.lastName}</p>
            <p className="text-sm text-neutral-600">{customer.email}</p>
            <p className="text-sm text-neutral-600">{customer.phone}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
