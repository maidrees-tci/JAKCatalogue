import { Link } from 'react-router-dom';
import { PrescriptionWarning } from '../../components/common/PrescriptionWarning';
import { useCart } from '../../hooks/useCart';
import { formatCurrency } from '../../utils/currency';
import { calculateOrderTotals } from '../../utils/order';

export function CartPage() {
  const { items, removeItem, updateQuantity } = useCart();
  const totals = calculateOrderTotals(items);
  const hasPrescription = items.some((i) => i.requiresPrescription);

  if (items.length === 0) {
    return <div className="rounded-xl border border-neutral-200 bg-white p-6">Your cart is empty. <Link to="/listing" className="text-primary-700">Browse products</Link>.</div>;
  }

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="space-y-3 md:col-span-2">
        {hasPrescription && <PrescriptionWarning />}
        {items.map((item) => (
          <div key={item.productId} className="flex items-center justify-between rounded-xl border border-neutral-200 bg-white p-4">
            <div>
              <p className="font-semibold">{item.name}</p>
              <p className="text-sm text-neutral-600">{formatCurrency(item.unitPrice)}</p>
            </div>
            <div className="flex items-center gap-2">
              <input type="number" min={1} value={item.quantity} onChange={(e) => updateQuantity(item.productId, Number(e.target.value))} className="w-16 rounded border border-neutral-300 px-2 py-1" />
              <button onClick={() => removeItem(item.productId)} className="text-sm text-red-700">Remove</button>
            </div>
          </div>
        ))}
      </div>
      <aside className="space-y-2 rounded-xl border border-neutral-200 bg-white p-4">
        <p className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(totals.subtotal)}</span></p>
        <p className="flex justify-between"><span>Shipping</span><span>{formatCurrency(totals.shipping)}</span></p>
        <p className="flex justify-between"><span>Tax</span><span>{formatCurrency(totals.tax)}</span></p>
        <p className="flex justify-between border-t border-neutral-200 pt-2 text-lg font-semibold"><span>Total</span><span>{formatCurrency(totals.total)}</span></p>
        <Link to="/checkout" className="mt-3 block rounded-lg bg-primary-700 px-4 py-2 text-center font-medium text-white">Proceed to Checkout</Link>
      </aside>
    </div>
  );
}
