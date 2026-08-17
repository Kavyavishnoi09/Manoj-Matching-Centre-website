import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useSEO } from '@/hooks/useSEO';

export default function Register() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', phone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  useSEO({ title: 'Register', description: 'Create a new account at Manoj Matching Centre.' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError('');
    if (form.password !== form.confirmPassword) { setError('Passwords do not match.'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    try { await register(form.name, form.email, form.password, form.phone); navigate(searchParams.get('redirect') || '/'); }
    catch (err: any) { setError(err.response?.data?.message || 'Registration failed.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="card p-8">
        <h1 className="text-2xl font-serif font-bold text-maroon-900 text-center mb-2">Create Account</h1>
        <p className="text-sm text-brown-600 text-center mb-6">Join us for a seamless shopping experience</p>
        {error && <p className="text-sm text-red-600 bg-red-50 rounded p-3 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="label">Full Name</label><input name="name" value={form.name} onChange={handleChange} required className="input-field" /></div>
          <div><label className="label">Email</label><input name="email" type="email" value={form.email} onChange={handleChange} required className="input-field" /></div>
          <div><label className="label">Phone</label><input name="phone" value={form.phone} onChange={handleChange} className="input-field" /></div>
          <div><label className="label">Password</label><input name="password" type="password" value={form.password} onChange={handleChange} required className="input-field" /></div>
          <div><label className="label">Confirm Password</label><input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} required className="input-field" /></div>
          <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? 'Creating account...' : 'Register'}</button>
        </form>
        <p className="text-sm text-brown-600 text-center mt-6">Already have an account? <Link to="/login" className="font-medium text-maroon-700 hover:text-gold-600">Login</Link></p>
      </div>
    </div>
  );
}
