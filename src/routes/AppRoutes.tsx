import { Link, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { AccountPage } from '../app/pages/AccountPage';
import { CartPage } from '../app/pages/CartPage';
import { CheckoutPage } from '../app/pages/CheckoutPage';
import { ConfirmationPage } from '../app/pages/ConfirmationPage';
import { DetailPage } from '../app/pages/DetailPage';
import { HomePage } from '../app/pages/HomePage';
import { ListingPage } from '../app/pages/ListingPage';
import { LoginPage } from '../app/pages/LoginPage';
import { AdminRoute } from './AdminRoute';
import { ProtectedRoute } from './ProtectedRoute';
import { AdminDashboardPage } from '../app/pages/admin/AdminDashboardPage';
import { AdminProductsPage } from '../app/pages/admin/AdminProductsPage';
import { AdminOrdersPage } from '../app/pages/admin/AdminOrdersPage';
import { AdminCustomersPage } from '../app/pages/admin/AdminCustomersPage';
import { AdminSettingsPage } from '../app/pages/admin/AdminSettingsPage';

function AdminNav() {
  return (
    <div className="mb-6 flex flex-wrap gap-2">
      <Link className="rounded-lg bg-neutral-200 px-3 py-2 text-sm" to="/admin">Dashboard</Link>
      <Link className="rounded-lg bg-neutral-200 px-3 py-2 text-sm" to="/admin/products">Products</Link>
      <Link className="rounded-lg bg-neutral-200 px-3 py-2 text-sm" to="/admin/orders">Orders</Link>
      <Link className="rounded-lg bg-neutral-200 px-3 py-2 text-sm" to="/admin/customers">Customers</Link>
      <Link className="rounded-lg bg-neutral-200 px-3 py-2 text-sm" to="/admin/settings">Settings</Link>
    </div>
  );
}

function AdminLayout() {
  return (
    <>
      <AdminNav />
      <Outlet />
    </>
  );
}

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/listing" element={<ListingPage />} />
        <Route path="/products/:slug" element={<DetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/confirmation" element={<ConfirmationPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/account" element={<AccountPage />} />
        </Route>
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="customers" element={<AdminCustomersPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
