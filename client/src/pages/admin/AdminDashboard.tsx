import { useEffect, useState } from 'react';
import { Package, Users, ShoppingCart, TrendingUp, Clock, CheckCircle, Truck, XCircle, PackageCheck, AlertCircle } from 'lucide-react';
import { adminAPI } from '@/services/api';
import { formatPrice } from '@/utils/helpers';
import { useSEO } from '@/hooks/useSEO';

interface Stats {
  totalProducts: number; totalCustomers: number; totalOrders: number;
  pendingOrders: number; confirmedOrders: number; processingOrders: number;
  shippedOrders: number; deliveredOrders: number; cancelledOrders: number; totalSales: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  useSEO({ title: 'Dashboard' });

  useEffect(() => { adminAPI.getStats().then((r) => setStats(r.data.data)).catch(console.error).finally(() => setLoading(false)); }, []);

  if (loading) return <div className="animate-pulse text-brown-600">Loading dashboard...</div>;
  if (!stats) return <div className="text-red-600">Failed to load stats.</div>;

  const cards = [
    { label: 'Total Products', value: stats.totalProducts, icon: Package, color: 'bg-blue-50 text-blue-700' },
    { label: 'Total Customers', value: stats.totalCustomers, icon: Users, color: 'bg-green-50 text-green-700' },
    { label: 'Total Orders', value: stats.totalOrders, icon: ShoppingCart, color: 'bg-purple-50 text-purple-700' },
    { label: 'Total Sales', value: formatPrice(stats.totalSales), icon: TrendingUp, color: 'bg-gold-50 text-gold-700' },
  ];

  const statusCards = [
    { label: 'Pending', value: stats.pendingOrders, icon: Clock, color: 'bg-amber-50 text-amber-700 border-amber-200' },
    { label: 'Confirmed', value: stats.confirmedOrders, icon: CheckCircle, color: 'bg-blue-50 text-blue-700 border-blue-200' },
    { label: 'Processing', value: stats.processingOrders, icon: PackageCheck, color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    { label: 'Shipped', value: stats.shippedOrders, icon: Truck, color: 'bg-purple-50 text-purple-700 border-purple-200' },
    { label: 'Delivered', value: stats.deliveredOrders, icon: CheckCircle, color: 'bg-green-50 text-green-700 border-green-200' },
    { label: 'Cancelled', value: stats.cancelledOrders, icon: XCircle, color: 'bg-red-50 text-red-700 border-red-200' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-serif font-bold text-maroon-900 mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {cards.map((c) => (
          <div key={c.label} className="bg-white rounded-lg border border-cream-200 p-5 shadow-sm">
            <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full ${c.color} mb-3`}><c.icon size={20} /></div>
            <p className="text-2xl font-bold text-maroon-900">{c.value}</p>
            <p className="text-sm text-brown-600 mt-1">{c.label}</p>
          </div>
        ))}
      </div>
      <h2 className="text-lg font-serif font-bold text-maroon-900 mb-4">Orders by Status</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statusCards.map((c) => (
          <div key={c.label} className={`rounded-lg border p-4 ${c.color}`}>
            <c.icon size={20} className="mb-2" />
            <p className="text-2xl font-bold">{c.value}</p>
            <p className="text-xs mt-1">{c.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
