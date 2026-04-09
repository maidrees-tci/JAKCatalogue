import { useProducts } from '../../../hooks/useProducts';
import { formatDate } from '../../../utils/date';

export function AdminOrdersPage() {
  const { orders, updateOrderStatus } = useProducts();
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Admin Orders</h1>
      <div className="space-y-3">
        {orders.length === 0 && <p className="rounded-xl bg-white p-4">No orders yet.</p>}
        {orders.map((order) => (
          <div key={order.id} className="rounded-xl border border-neutral-200 bg-white p-4">
            <p className="font-semibold">{order.id}</p>
            <p className="text-sm text-neutral-600">{formatDate(order.createdAt)}</p>
            <div className="mt-2 flex items-center gap-2">
              <span className="rounded-full bg-primary-100 px-2 py-1 text-xs text-primary-800">{order.status}</span>
              <select value={order.status} onChange={(e) => updateOrderStatus(order.id, e.target.value as typeof order.status)} className="rounded border border-neutral-300 px-2 py-1 text-sm">
                <option value="pending">pending</option><option value="paid">paid</option><option value="processing">processing</option><option value="shipped">shipped</option><option value="delivered">delivered</option><option value="cancelled">cancelled</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
