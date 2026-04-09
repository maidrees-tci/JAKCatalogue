import { Link } from 'react-router-dom';
import { TrustBadges } from '../../components/common/TrustBadges';
import { ProductCard } from '../../components/product/ProductCard';
import { categories } from '../../data/categories';
import { useProducts } from '../../hooks/useProducts';

export function HomePage() {
  const { products } = useProducts();
  return (
    <div className="space-y-8">
      <section className="rounded-2xl bg-primary-900 p-8 text-white">
        <h1 className="text-3xl font-bold text-white md:text-4xl">Professional Medical Supplies With Trusted Compliance</h1>
        <p className="mt-3 max-w-2xl text-primary-100">Curated equipment and essentials with transparent certifications, clear guidance, and secure checkout.</p>
        <Link to="/listing" className="mt-5 inline-block rounded-lg bg-accent-500 px-5 py-3 font-semibold text-white hover:bg-accent-600">Browse Products</Link>
      </section>
      <TrustBadges />
      <section>
        <h2 className="mb-4 text-2xl font-semibold">Shop by Category</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {categories.map((c) => (
            <Link key={c.key} to={`/listing?category=${c.key}`} className="rounded-xl border border-neutral-200 bg-white p-4 text-lg font-medium shadow-sm hover:border-primary-300">
              {c.label}
            </Link>
          ))}
        </div>
      </section>
      <section>
        <h2 className="mb-4 text-2xl font-semibold">Featured Products</h2>
        <div className="grid gap-4 md:grid-cols-3">{products.slice(0, 6).map((p) => <ProductCard key={p.id} product={p} />)}</div>
      </section>
    </div>
  );
}
