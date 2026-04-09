import { Link } from 'react-router-dom';
import { formatCurrency } from '../../utils/currency';
import type { Product } from '../../types/models';

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
      <img src={product.imageUrl} alt={product.name} className="h-44 w-full object-cover" />
      <div className="space-y-2 p-4">
        <p className="text-xs uppercase tracking-wide text-neutral-500">{product.brand}</p>
        <h3 className="text-lg font-semibold">{product.name}</h3>
        <p className="text-sm text-neutral-600">{product.shortDescription}</p>
        <div className="flex items-center justify-between">
          <p className="font-semibold text-primary-700">{formatCurrency(product.price)}</p>
          <Link className="rounded-lg bg-primary-700 px-3 py-2 text-sm font-medium text-white hover:bg-primary-800" to={`/products/${product.slug}`}>
            View
          </Link>
        </div>
      </div>
    </article>
  );
}
