import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronRight } from 'lucide-react';
import type { Order } from '@/types';
import { adminAPI } from '@/services/api';
import { formatPrice, formatDate, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS, cn } from '@/utils/helpers';
import { useSEO } from '@/hooks/useSEO';

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  useSEO({ title: 'Manage Orders' });

  const load = () => {
    setLoading(true);
    const params: Record<string, unknown> = { limit: 50 };
    if (statusFilter) params.status = statusFilter;
    if (search) params.search = search;
    adminAPI.getOrders(params).then((r) => setOrders(r.data.data)).catch(console.error).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, [statusFilter]);

  return (
    <div>
      <h1 className="text-2xl font-serif font-bold text-maroon-900 mb-6">Orders ({orders.length})</h1>
      <div className="flex gap-3 mb-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px]"><Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-brown-400" /><input value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') load(); }} placeholder="Search by order number, name, phone..." className="input-field pl-10" /></div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input-field !w-auto"><option value="">All Status</option>{Object.entries(ORDER_STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
        <button onClick={load} className="btn-secondary">Refresh</button>
      </div>
      <div className="bg-white rounded-lg border border-cream-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-cream-100 text-brown-700"><tr><th className="text-left px-4 py-3 font-medium">Order #</th><th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Customer</th><th className="text-left px-4 py-3 font-medium hidden md:table-cell">Date</th><th className="text-left px-4 py-3 font-medium">Total</th><th className="text-left px-4 py-3 font-medium">Status</th><th className="text-right px-4 py-3 font-medium"></th></tr></thead>
            <tbody className="divide-y divide-cream-200">
              {loading ? <tr><td colSpan={6} className="text-center py-8 animate-pulse">Loading...</td></tr>
              : orders.length === 0 ? <tr><td colSpan={6} className="text-center py-8 text-brown-500">No orders found.</td></tr>
              : orders.map((o) => (
                <tr key={o._id} className="hover:bg-cream-50 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-maroon-800">{o.orderNumber}</td>
                  <td className="px-4 py-3 hidden sm:table-cell"><p className="font-medium text-brown-900">{o.shippingAddress.name}</p><p className="text-xs text-brown-500">{o.shippingAddress.phone}</p></td>
                  <td className="px-4 py-3 hidden md:table-cell text-brown-600">{formatDate(o.createdAt)}</td>
                  <td className="px-4 py-3 font-bold text-maroon-800">{formatPrice(o.total)}</td>
                  <td className="px-4 py-3"><span className={cn('rounded-full px-2.5 py-1 text-xs font-medium border', ORDER_STATUS_COLORS[o.orderStatus])}>{ORDER_STATUS_LABELS[o.orderStatus]}</span></td>
                  <td className="px-4 py-3 text-right"><Link to={`/admin/orders/${o._id}`} className="inline-flex items-center gap-1 text-maroon-700 hover:text-gold-600 text-sm font-medium">View <ChevronRight size={14} /></Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
