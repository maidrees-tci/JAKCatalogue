import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PrescriptionWarning } from '../../components/common/PrescriptionWarning';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { useProducts } from '../../hooks/useProducts';
import { isRequired, isValidEmail } from '../../utils/validation';
import { calculateOrderTotals } from '../../utils/order';
import { formatCurrency } from '../../utils/currency';

function strFromPayload(v: unknown): string {
  if (v == null) return '';
  if (typeof v === 'string') return v.trim();
  return String(v).trim();
}

function readInternationalAddress(d: Record<string, unknown>): Record<string, unknown> {
  const raw = d.internationalAddress ?? d.internationaladdress;
  if (!raw) return {};
  return Array.isArray(raw) ? ((raw[0] as Record<string, unknown>) ?? {}) : (raw as Record<string, unknown>);
}

export function CheckoutPage() {
  const checkoutFieldsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, clearCart } = useCart();
  const { addOrder } = useProducts();
  const [name, setName] = useState(user ? `${user.firstName} ${user.lastName}` : '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [address1, setAddress1] = useState(user?.defaultAddress ?? '');
  const [address2, setAddress2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pin, setPin] = useState('');
  const [country, setCountry] = useState('USA');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card'>('cod');
  const [acknowledged, setAcknowledged] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[src="https://app.jakdelivery.com/sdk/jakplug.js"]',
    );
    if (existing) return;

    const script = document.createElement('script');
    script.src = 'https://app.jakdelivery.com/sdk/jakplug.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  /** Keep React state aligned when JAK SDK (or browser) sets input values on the DOM directly. */
  useEffect(() => {
    const root = checkoutFieldsRef.current;
    if (!root) return;

    const syncFromDom = (e: Event) => {
      const el = e.target as HTMLInputElement;
      if (!el?.name) return;
      const v = el.value;
      switch (el.name) {
        case 'name':
          setName(v);
          break;
        case 'email':
          setEmail(v);
          break;
        case 'address1':
          setAddress1(v);
          break;
        case 'address2':
          setAddress2(v);
          break;
        case 'city':
          setCity(v);
          break;
        case 'state':
          setState(v);
          break;
        case 'postal':
          setPin(v);
          break;
        case 'country':
          setCountry(v);
          break;
        default:
          break;
      }
    };

    root.addEventListener('input', syncFromDom, true);
    root.addEventListener('change', syncFromDom, true);
    return () => {
      root.removeEventListener('input', syncFromDom, true);
      root.removeEventListener('change', syncFromDom, true);
    };
  }, []);

  /** After JAK auth, merge payload into local state so controlled fields stay editable. */
  useEffect(() => {
    const onJakLoggedIn = (event: Event) => {
      const detail = (event as CustomEvent<Record<string, unknown>>).detail;
      if (!detail || typeof detail !== 'object') return;
      const d = detail as Record<string, unknown>;
      const ia = readInternationalAddress(d);

      const nextName = strFromPayload(d.name) || strFromPayload(d.full_name);
      const nextEmail = strFromPayload(d.email);
      const nextA1 =
        strFromPayload(d.street_address) ||
        strFromPayload(d.address1) ||
        strFromPayload(d.street) ||
        strFromPayload(ia.address1);
      const nextA2 = strFromPayload(d.address2) || strFromPayload(ia.address2);
      const nextCity = strFromPayload(d.city) || strFromPayload(d.town) || strFromPayload(ia.city);
      const nextState = strFromPayload(d.state) || strFromPayload(ia.state);
      const nextPostal =
        strFromPayload(d.postal_code) ||
        strFromPayload(d.postalcode) ||
        strFromPayload(d.zip) ||
        strFromPayload(d.zipcode) ||
        strFromPayload(ia.postalcode);
      const nextCountry =
        strFromPayload(d.countryname_en) ||
        strFromPayload(d.country) ||
        strFromPayload(ia.countryname_en) ||
        strFromPayload(ia.country);

      if (nextName) setName(nextName);
      if (nextEmail) setEmail(nextEmail);
      if (nextA1) setAddress1(nextA1);
      if (nextA2) setAddress2(nextA2);
      if (nextCity) setCity(nextCity);
      if (nextState) setState(nextState);
      if (nextPostal) setPin(nextPostal);
      if (nextCountry) setCountry(nextCountry);
    };

    window.addEventListener('jakdeliveryLoggedIn', onJakLoggedIn);
    return () => window.removeEventListener('jakdeliveryLoggedIn', onJakLoggedIn);
  }, []);

  const hasPrescription = items.some((i) => i.requiresPrescription);
  const totals = calculateOrderTotals(items);
  const hasValidAddress =
    isRequired(address1) &&
    isRequired(city) &&
    isRequired(state) &&
    isRequired(pin) &&
    isRequired(country);
  const hasValidForm = isRequired(name) && hasValidAddress && isValidEmail(email);
  const canCompleteOrder =
    items.length > 0 && hasValidForm && (!hasPrescription || acknowledged);

  const placeOrder = () => {
    setSubmitAttempted(true);
    if (!canCompleteOrder) return;
    setIsSubmitting(true);
    const order = {
      id: `ord-${crypto.randomUUID().slice(0, 8)}`,
      customerId: user?.id ?? 'guest',
      items,
      shippingAddress: {
        fullName: name,
        email,
        address1,
        address2,
        city,
        state,
        postalCode: pin,
        country,
      },
      ...totals,
      status: 'paid' as const,
      paymentMethod,
      prescriptionAcknowledged: acknowledged,
      createdAt: new Date().toISOString(),
    };
    addOrder(order);
    localStorage.setItem('latest-order-id', order.id);
    clearCart();
    setIsSubmitting(false);
    navigate('/confirmation');
  };

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div ref={checkoutFieldsRef} className="space-y-4 md:col-span-2">
        <h1 className="text-3xl font-bold">Checkout</h1>
        {hasPrescription && <PrescriptionWarning />}
        <input
          name="name"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full name"
          className="w-full rounded-lg border border-neutral-300 px-3 py-2"
        />
        {submitAttempted && !isRequired(name) && <p className="text-sm text-red-700">Full name is required.</p>}
        <input
          name="email"
          autoComplete="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full rounded-lg border border-neutral-300 px-3 py-2"
        />
        {submitAttempted && !isValidEmail(email) && <p className="text-sm text-red-700">Enter a valid email address.</p>}
        <input
          name="address1"
          autoComplete="address-line1"
          value={address1}
          onChange={(e) => setAddress1(e.target.value)}
          placeholder="Address 1"
          className="w-full rounded-lg border border-neutral-300 px-3 py-2"
        />
        <input
          name="address2"
          autoComplete="address-line2"
          value={address2}
          onChange={(e) => setAddress2(e.target.value)}
          placeholder="Address line 2"
          className="w-full rounded-lg border border-neutral-300 px-3 py-2"
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            name="city"
            autoComplete="address-level2"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="City"
            className="w-full rounded-lg border border-neutral-300 px-3 py-2"
          />
          <input
            name="state"
            autoComplete="address-level1"
            value={state}
            onChange={(e) => setState(e.target.value)}
            placeholder="State"
            className="w-full rounded-lg border border-neutral-300 px-3 py-2"
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            name="postal"
            autoComplete="postal-code"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="Postal code / Zipcode"
            className="w-full rounded-lg border border-neutral-300 px-3 py-2"
          />
          <input
            name="country"
            autoComplete="country-name"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="Country"
            className="w-full rounded-lg border border-neutral-300 px-3 py-2"
          />
        </div>
        <div
          id="jakdelivery-login-btn"
          country-id="us"
          app-key="YOUR_APP_KEY"
        ></div>
        <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value as 'cod' | 'card')} className="w-full rounded-lg border border-neutral-300 px-3 py-2">
          <option value="cod">Cash on delivery</option>
          <option value="card">Card</option>
        </select>
        {hasPrescription && (
          <label className="flex items-start gap-2 text-sm">
            <input type="checkbox" checked={acknowledged} onChange={(e) => setAcknowledged(e.target.checked)} />
            <span>I confirm a valid prescription is available for prescription-required items.</span>
          </label>
        )}
        {submitAttempted && !hasValidAddress && (
          <p className="text-sm text-red-700">Please complete all required shipping fields.</p>
        )}
        {submitAttempted && hasPrescription && !acknowledged && (
          <p className="text-sm text-red-700">Please acknowledge prescription requirements to continue.</p>
        )}
      </div>
      <aside className="space-y-2 rounded-xl border border-neutral-200 bg-white p-4">
        <p className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(totals.subtotal)}</span></p>
        <p className="flex justify-between"><span>Shipping</span><span>{formatCurrency(totals.shipping)}</span></p>
        <p className="flex justify-between"><span>Tax</span><span>{formatCurrency(totals.tax)}</span></p>
        <p className="flex justify-between border-t border-neutral-200 pt-2 font-semibold"><span>Total</span><span>{formatCurrency(totals.total)}</span></p>
        {items.length === 0 && <p className="text-sm text-red-700">Your cart is empty.</p>}
        <button
          type="button"
          onClick={placeOrder}
          disabled={items.length === 0 || isSubmitting}
          className="w-full rounded-lg bg-primary-700 px-4 py-2 font-medium text-white disabled:cursor-not-allowed disabled:bg-neutral-400"
        >
          {isSubmitting ? 'Placing Order...' : 'Place Order'}
        </button>
      </aside>
    </div>
  );
}
