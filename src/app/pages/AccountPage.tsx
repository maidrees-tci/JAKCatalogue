import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useProducts } from '../../hooks/useProducts';
import { formatCurrency } from '../../utils/currency';
import { formatDate } from '../../utils/date';

export function AccountPage() {
  const { user } = useAuth();
  const { orders } = useProducts();
  if (!user) return <Navigate to="/login" replace />;
  const userOrders = orders.filter((order) => order.customerId === user.id || order.customerId === 'guest');

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-neutral-200 bg-white p-5">
        <h1 className="text-3xl font-bold">My Account</h1>
        <p className="mt-2 text-neutral-600">{user.firstName} {user.lastName} - {user.email}</p>
      </section>
      <section className="rounded-xl border border-neutral-200 bg-white p-5">
        <h2 className="mb-3 text-xl font-semibold">Order History</h2>
        {userOrders.length === 0 && <p className="text-neutral-600">No orders yet.</p>}
        <div className="space-y-3">
          {userOrders.map((order) => (
            <div key={order.id} className="rounded-lg border border-neutral-200 p-3">
              <p className="font-semibold">{order.id}</p>
              <p className="text-sm text-neutral-600">{formatDate(order.createdAt)} - {order.status}</p>
              <p className="text-sm">{formatCurrency(order.total)}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
