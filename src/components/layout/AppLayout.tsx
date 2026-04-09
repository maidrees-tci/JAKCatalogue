import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';

const navClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-lg px-3 py-2 text-sm font-medium ${isActive ? 'bg-primary-100 text-primary-800' : 'text-neutral-700 hover:bg-neutral-100'}`;

export function AppLayout() {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 md:px-6">
          <Link to="/" className="text-xl font-bold text-primary-800">MediCart HQ</Link>
          <nav className="flex flex-wrap items-center gap-2">
            <NavLink to="/" className={navClass}>Home</NavLink>
            <NavLink to="/listing" className={navClass}>Products</NavLink>
            <NavLink to="/cart" className={navClass}>Cart ({cartCount})</NavLink>
            {user ? <NavLink to="/account" className={navClass}>Account</NavLink> : <NavLink to="/login" className={navClass}>Login</NavLink>}
            {user?.isAdmin && <NavLink to="/admin" className={navClass}>Admin</NavLink>}
            {user && <button onClick={logout} className="rounded-lg border border-neutral-300 px-3 py-2 text-sm">Logout</button>}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <Outlet />
      </main>
      <footer className="border-t border-neutral-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 text-sm text-neutral-600 md:px-6">
          FDA/CE compliant catalogs. Secure checkout. Dedicated clinical support.
        </div>
      </footer>
    </div>
  );
}
