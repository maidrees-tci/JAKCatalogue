import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductCard } from '../../components/product/ProductCard';
import { categories } from '../../data/categories';
import { useProducts } from '../../hooks/useProducts';

export function ListingPage() {
  const { products } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<'price-asc' | 'price-desc'>('price-asc');
  const category = searchParams.get('category') ?? 'all';

  const filtered = useMemo(() => {
    const base = products.filter((p) => (category === 'all' ? true : p.category === category));
    const searched = base.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
    return searched.sort((a, b) => (sort === 'price-asc' ? a.price - b.price : b.price - a.price));
  }, [products, category, search, sort]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Medical Product Listing</h1>
      <div className="grid gap-3 rounded-xl border border-neutral-200 bg-white p-4 md:grid-cols-4">
        <select value={category} onChange={(e) => setSearchParams(e.target.value === 'all' ? {} : { category: e.target.value })} className="rounded-lg border border-neutral-300 px-3 py-2">
          <option value="all">All categories</option>
          {categories.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
        </select>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products" className="rounded-lg border border-neutral-300 px-3 py-2 md:col-span-2" />
        <select value={sort} onChange={(e) => setSort(e.target.value as 'price-asc' | 'price-desc')} className="rounded-lg border border-neutral-300 px-3 py-2">
          <option value="price-asc">Price low to high</option>
          <option value="price-desc">Price high to low</option>
        </select>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {filtered.map((product) => <ProductCard key={product.id} product={product} />)}
      </div>
    </div>
  );
}
