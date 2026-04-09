import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { PrescriptionWarning } from '../../components/common/PrescriptionWarning';
import { useCart } from '../../hooks/useCart';
import { useProducts } from '../../hooks/useProducts';
import { formatCurrency } from '../../utils/currency';

export function DetailPage() {
  const { slug } = useParams();
  const { products } = useProducts();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const product = products.find((p) => p.slug === slug);

  if (!product) return <p className="text-lg">Product not found.</p>;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <img src={product.imageUrl} alt={product.name} className="h-80 w-full rounded-2xl object-cover shadow-md" />
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="text-neutral-600">{product.description}</p>
        <p className="text-2xl font-semibold text-primary-700">{formatCurrency(product.price)}</p>
        <p className="text-sm text-neutral-600">Certifications: {product.certifications.join(', ')}</p>
        {product.requiresPrescription && <PrescriptionWarning />}
        <div className="flex items-center gap-3">
          <input type="number" min={1} max={10} value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} className="w-24 rounded-lg border border-neutral-300 px-3 py-2" />
          <button onClick={() => addToCart(product, quantity)} className="rounded-lg bg-primary-700 px-5 py-2 font-medium text-white hover:bg-primary-800">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
