import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useSEO } from '@/hooks/useSEO';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  useSEO({ title: 'Admin Login' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      await login(email, password);
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid admin credentials.');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-maroon-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold-500 text-brown-950 mb-4"><ShieldCheck size={32} /></div>
          <h1 className="text-2xl font-serif font-bold text-cream-50">Admin Portal</h1>
          <p className="text-sm text-cream-400 mt-1">Manoj Matching Centre</p>
        </div>
        <div className="bg-cream-50 rounded-xl p-8 shadow-2xl">
          {error && <p className="text-sm text-red-600 bg-red-50 rounded p-3 mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className="label">Admin Email</label><div className="relative"><Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-brown-400" /><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="input-field pl-10" placeholder="admin@example.com" /></div></div>
            <div><label className="label">Password</label><div className="relative"><Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-brown-400" /><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="input-field pl-10" placeholder="••••••••" /></div></div>
            <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? 'Authenticating...' : 'Login to Dashboard'}</button>
          </form>
          <Link to="/" className="mt-6 flex items-center justify-center gap-1 text-sm text-brown-600 hover:text-maroon-700 transition-colors"><ArrowLeft size={14} /> Back to Store</Link>
        </div>
      </div>
    </div>
  );
}
