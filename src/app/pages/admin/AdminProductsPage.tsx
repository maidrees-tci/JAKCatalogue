import { useState } from 'react';
import { useProducts } from '../../../hooks/useProducts';
import type { ProductCategory } from '../../../types/models';

export function AdminProductsPage() {
  const { products, upsertProduct } = useProducts();
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ProductCategory>('mobility');
  const [price, setPrice] = useState(0);

  const add = () => {
    if (!name || price <= 0) return;
    upsertProduct({
      id: `prd-${Date.now()}`,
      slug: name.toLowerCase().replaceAll(' ', '-'),
      sku: `NEW-${Date.now()}`,
      name,
      category,
      brand: 'ClinicPro',
      shortDescription: 'Admin added product.',
      description: 'Admin generated product description.',
      price,
      stock: 20,
      requiresPrescription: false,
      imageUrl: 'https://images.unsplash.com/photo-1579684453423-f84349ef60b0?auto=format&fit=crop&w=900&q=80',
      rating: 0,
      reviewCount: 0,
      certifications: ['CE'],
    });
    setName('');
    setPrice(0);
  };

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Admin Products</h1>
      <div className="grid gap-3 rounded-xl border border-neutral-200 bg-white p-4 md:grid-cols-4">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Product name" className="rounded-lg border border-neutral-300 px-3 py-2" />
        <select value={category} onChange={(e) => setCategory(e.target.value as ProductCategory)} className="rounded-lg border border-neutral-300 px-3 py-2">
          <option value="mobility">Mobility</option><option value="monitoring">Monitoring</option><option value="respiratory">Respiratory</option><option value="diagnostics">Diagnostics</option><option value="rehab">Rehab</option><option value="consumables">Consumables</option>
        </select>
        <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} placeholder="Price" className="rounded-lg border border-neutral-300 px-3 py-2" />
        <button onClick={add} className="rounded-lg bg-primary-700 px-3 py-2 text-white">Add Product</button>
      </div>
      <div className="rounded-xl border border-neutral-200 bg-white p-4">
        <p className="mb-3 font-semibold">Current Products ({products.length})</p>
        <div className="space-y-2 text-sm">{products.map((p) => <p key={p.id}>{p.name} - {p.category} - ${p.price}</p>)}</div>
      </div>
    </div>
  );
}
