import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useSEO } from '@/hooks/useSEO';

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  useSEO({ title: 'Login', description: 'Login to your Manoj Matching Centre account.' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true);
    try { await login(email, password); navigate(searchParams.get('redirect') || '/'); }
    catch (err: any) { setError(err.response?.data?.message || 'Login failed.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="card p-8">
        <h1 className="text-2xl font-serif font-bold text-maroon-900 text-center mb-2">Welcome Back</h1>
        <p className="text-sm text-brown-600 text-center mb-6">Login to your account to continue</p>
        {error && <p className="text-sm text-red-600 bg-red-50 rounded p-3 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="label">Email</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="input-field" /></div>
          <div><label className="label">Password</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="input-field" /></div>
          <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? 'Logging in...' : 'Login'}</button>
        </form>
        <p className="text-sm text-brown-600 text-center mt-6">Don't have an account? <Link to="/register" className="font-medium text-maroon-700 hover:text-gold-600">Register</Link></p>
      </div>
    </div>
  );
}
