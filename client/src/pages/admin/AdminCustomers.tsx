import { useEffect, useState } from 'react';
import { Search, Eye, User, Phone, Mail } from 'lucide-react';
import { adminAPI } from '@/services/api';
import { formatDate, cn } from '@/utils/helpers';
import { useSEO } from '@/hooks/useSEO';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  useSEO({ title: 'Manage Customers' });

  const load = () => { setLoading(true); const params: Record<string, unknown> = { limit: 50 }; if (search) params.search = search; adminAPI.getCustomers(params).then((r) => setCustomers(r.data.data)).catch(console.error).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  const toggleActive = async (id: string) => { try { await adminAPI.toggleCustomerActive(id); load(); } catch { alert('Failed to update.'); } };

  return (
    <div>
      <h1 className="text-2xl font-serif font-bold text-maroon-900 mb-6">Customers ({customers.length})</h1>
      <div className="mb-4 relative max-w-sm"><Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-brown-400" /><input value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') load(); }} placeholder="Search by name, email, phone..." className="input-field pl-10" /></div>
      <div className="bg-white rounded-lg border border-cream-200 overflow-hidden">
        <div className="overflow-x-auto"><table className="w-full text-sm"><thead className="bg-cream-100 text-brown-700"><tr><th className="text-left px-4 py-3 font-medium">Customer</th><th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Phone</th><th className="text-left px-4 py-3 font-medium hidden md:table-cell">Joined</th><th className="text-left px-4 py-3 font-medium">Status</th><th className="text-right px-4 py-3 font-medium">Actions</th></tr></thead>
          <tbody className="divide-y divide-cream-200">{loading ? <tr><td colSpan={5} className="text-center py-8 animate-pulse">Loading...</td></tr>
          : customers.length === 0 ? <tr><td colSpan={5} className="text-center py-8 text-brown-500">No customers found.</td></tr>
          : customers.map((c) => (<tr key={c._id} className="hover:bg-cream-50 transition-colors"><td className="px-4 py-3"><p className="font-medium text-brown-900">{c.name}</p><p className="text-xs text-brown-500 flex items-center gap-1"><Mail size={12} /> {c.email}</p></td><td className="px-4 py-3 hidden sm:table-cell text-brown-700">{c.phone || '—'}</td><td className="px-4 py-3 hidden md:table-cell text-brown-600">{formatDate(c.createdAt)}</td><td className="px-4 py-3"><span className={cn('text-xs font-medium', c.active ? 'text-green-700' : 'text-red-600')}>{c.active ? 'Active' : 'Disabled'}</span></td><td className="px-4 py-3 text-right"><button onClick={() => toggleActive(c._id)} className="text-sm text-maroon-700 hover:text-gold-600 font-medium">{c.active ? 'Disable' : 'Enable'}</button></td></tr>))}</tbody>
        </table></div>
      </div>
    </div>
  );
}
