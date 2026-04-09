import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const ok = login(email, password);
    if (!ok) return setError('Account not found. Use customer@medicarthq.com or admin@medicarthq.com.');
    navigate(email.includes('admin') ? '/admin' : '/account');
  };

  return (
    <form onSubmit={submit} className="mx-auto max-w-md space-y-4 rounded-2xl border border-neutral-200 bg-white p-6">
      <h1 className="text-3xl font-bold">Login</h1>
      <p className="text-sm text-neutral-600">For demo: customer@medicarthq.com or admin@medicarthq.com (any password).</p>
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full rounded-lg border border-neutral-300 px-3 py-2" />
      <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" className="w-full rounded-lg border border-neutral-300 px-3 py-2" />
      {error && <p className="text-sm text-red-700">{error}</p>}
      <button className="w-full rounded-lg bg-primary-700 px-4 py-2 text-white">Sign In</button>
    </form>
  );
}
