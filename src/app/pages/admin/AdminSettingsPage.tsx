import { useState } from 'react';

export function AdminSettingsPage() {
  const [businessName, setBusinessName] = useState('MediCart HQ');
  const [shippingFee, setShippingFee] = useState('12');
  const [taxRate, setTaxRate] = useState('6');
  const [returnsPolicy, setReturnsPolicy] = useState('Returns accepted within 14 days for unopened products.');

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Admin Settings</h1>
      <div className="space-y-3 rounded-xl border border-neutral-200 bg-white p-4">
        <input value={businessName} onChange={(e) => setBusinessName(e.target.value)} className="w-full rounded-lg border border-neutral-300 px-3 py-2" />
        <input value={shippingFee} onChange={(e) => setShippingFee(e.target.value)} className="w-full rounded-lg border border-neutral-300 px-3 py-2" />
        <input value={taxRate} onChange={(e) => setTaxRate(e.target.value)} className="w-full rounded-lg border border-neutral-300 px-3 py-2" />
        <textarea value={returnsPolicy} onChange={(e) => setReturnsPolicy(e.target.value)} rows={4} className="w-full rounded-lg border border-neutral-300 px-3 py-2" />
        <p className="text-sm text-neutral-600">Settings are kept local for this frontend-only build.</p>
      </div>
    </div>
  );
}
