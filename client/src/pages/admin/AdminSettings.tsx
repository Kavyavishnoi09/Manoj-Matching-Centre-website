import { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { settingsAPI } from '@/services/api';
import { useSEO } from '@/hooks/useSEO';

export default function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [form, setForm] = useState<any>(null);
  useSEO({ title: 'Business Settings' });

  useEffect(() => { settingsAPI.get().then((r) => setForm(r.data.data)).catch(console.error).finally(() => setLoading(false)); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setMsg(''); setError(''); setSaving(true);
    try { await settingsAPI.update(form); setMsg('Settings saved successfully.'); }
    catch (err: any) { setError(err.response?.data?.message || 'Failed to save settings.'); }
    finally { setSaving(false); }
  };

  if (loading || !form) return <div className="animate-pulse text-brown-600">Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-serif font-bold text-maroon-900 mb-6">Business Settings</h1>
      {msg && <p className="text-sm text-green-700 bg-green-50 rounded p-3 mb-4">{msg}</p>}
      {error && <p className="text-sm text-red-600 bg-red-50 rounded p-3 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
        <div className="bg-white rounded-lg border border-cream-200 p-6">
          <h2 className="text-lg font-serif font-bold text-maroon-900 mb-4">Business Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="label">Business Name</label><input name="businessName" value={form.businessName || ''} onChange={handleChange} className="input-field" /></div>
            <div><label className="label">Phone</label><input name="phone" value={form.phone || ''} onChange={handleChange} className="input-field" /></div>
            <div><label className="label">WhatsApp Number</label><input name="whatsapp" value={form.whatsapp || ''} onChange={handleChange} className="input-field" placeholder="e.g. 919876543210" /></div>
            <div><label className="label">Email</label><input name="email" value={form.email || ''} onChange={handleChange} className="input-field" /></div>
            <div className="sm:col-span-2"><label className="label">Address</label><textarea name="address" value={form.address || ''} onChange={handleChange} rows={2} className="input-field" /></div>
            <div><label className="label">Google Maps URL</label><input name="mapUrl" value={form.mapUrl || ''} onChange={handleChange} className="input-field" /></div>
            <div><label className="label">Business Hours</label><input name="businessHours" value={form.businessHours || ''} onChange={handleChange} className="input-field" placeholder="Mon-Sat: 10AM-8PM" /></div>
            <div><label className="label">Instagram URL</label><input name="instagram" value={form.instagram || ''} onChange={handleChange} className="input-field" /></div>
            <div><label className="label">Facebook URL</label><input name="facebook" value={form.facebook || ''} onChange={handleChange} className="input-field" /></div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-cream-200 p-6">
          <h2 className="text-lg font-serif font-bold text-maroon-900 mb-4">About Us</h2>
          <textarea name="aboutText" value={form.aboutText || ''} onChange={handleChange} rows={6} className="input-field" />
        </div>
        <div className="bg-white rounded-lg border border-cream-200 p-6">
          <h2 className="text-lg font-serif font-bold text-maroon-900 mb-4">Delivery Settings</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="label">Delivery Charge (₹)</label><input name="deliveryCharge" type="number" value={form.deliveryCharge ?? 50} onChange={handleChange} className="input-field" /></div>
            <div><label className="label">Free Delivery Above (₹)</label><input name="freeDeliveryThreshold" type="number" value={form.freeDeliveryThreshold ?? 1000} onChange={handleChange} className="input-field" /></div>
          </div>
        </div>
        <button type="submit" disabled={saving} className="btn-primary"><Save size={18} /> {saving ? 'Saving...' : 'Save Settings'}</button>
      </form>
    </div>
  );
}
