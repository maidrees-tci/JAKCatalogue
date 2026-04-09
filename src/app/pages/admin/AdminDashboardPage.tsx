import { useProducts } from '../../../hooks/useProducts';
import { formatCurrency } from '../../../utils/currency';

export function AdminDashboardPage() {
  const { orders, customers, products } = useProducts();
  const revenue = orders.reduce((sum, order) => sum + order.total, 0);
  const lowStock = products.filter((p) => p.stock < 10).length;

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl bg-white p-4 shadow-sm">Orders: {orders.length}</div>
        <div className="rounded-xl bg-white p-4 shadow-sm">Revenue: {formatCurrency(revenue)}</div>
        <div className="rounded-xl bg-white p-4 shadow-sm">Customers: {customers.length}</div>
        <div className="rounded-xl bg-white p-4 shadow-sm">Low Stock: {lowStock}</div>
      </div>
    </div>
  );
}
