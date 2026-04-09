import { Link } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import { formatCurrency } from '../../utils/currency';
import { formatDate } from '../../utils/date';

export function ConfirmationPage() {
  const { orders } = useProducts();
  const latestOrderId = localStorage.getItem('latest-order-id');
  const order = orders.find((o) => o.id === latestOrderId) ?? orders[0];

  if (!order) return <p>No order found yet.</p>;

  return (
    <div className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-6">
      <h1 className="text-3xl font-bold">Order Confirmed</h1>
      <p className="text-neutral-600">Order ID: <span className="font-medium">{order.id}</span></p>
      <p className="text-neutral-600">Placed on {formatDate(order.createdAt)}</p>
      <div className="rounded-lg bg-neutral-50 p-3 text-sm text-neutral-700">
        <p className="font-semibold text-neutral-900">Shipping To</p>
        <p>{order.shippingAddress.fullName}</p>
        <p>{order.shippingAddress.address1}</p>
        {order.shippingAddress.address2 && <p>{order.shippingAddress.address2}</p>}
        <p>
          {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
        </p>
        <p>{order.shippingAddress.country}</p>
      </div>
      <div className="space-y-2">
        {order.items.map((item) => (
          <p key={item.productId} className="flex justify-between text-sm">
            <span>{item.name} x {item.quantity}</span>
            <span>{formatCurrency(item.unitPrice * item.quantity)}</span>
          </p>
        ))}
      </div>
      <p className="text-lg font-semibold">Total: {formatCurrency(order.total)}</p>
      <p className="text-sm text-neutral-600">You will receive shipping updates and professional support guidance via email.</p>
      <Link to="/account" className="inline-block rounded-lg bg-primary-700 px-4 py-2 text-white">Go to Account</Link>
    </div>
  );
}
