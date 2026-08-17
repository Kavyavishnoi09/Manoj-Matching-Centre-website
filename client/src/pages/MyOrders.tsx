import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronRight, XCircle } from 'lucide-react';
import type { Order } from '@/types';
import { orderAPI } from '@/services/api';
import { formatPrice, formatDate, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS, cn } from '@/utils/helpers';
import { useAuth } from '@/context/AuthContext';
import { useSEO } from '@/hooks/useSEO';

export default function MyOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  useSEO({ title: 'My Orders', description: 'View your order history at Manoj Matching Centre.' });

  useEffect(() => { if (user) orderAPI.getMyOrders().then((r) => setOrders(r.data.data)).catch(console.error).finally(() => setLoading(false)); }, [user]);

  if (!user) return <div className="max-w-3xl mx-auto px-4 py-20 text-center"><h1 className="text-2xl font-serif font-bold text-maroon-900">Please Login</h1><p className="text-brown-600 mt-2">Login to view your orders.</p><Link to="/login?redirect=/orders" className="mt-6 inline-block btn-primary">Login</Link></div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-serif font-bold text-maroon-900 mb-6">My Orders</h1>
      {loading ? <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-32 bg-cream-100 rounded-lg animate-pulse" />)}</div>
        : orders.length === 0 ? <div className="text-center py-20"><Package size={48} className="mx-auto text-cream-300 mb-4" /><p className="text-brown-600 text-lg">You haven't placed any orders yet.</p><Link to="/products" className="mt-6 inline-block btn-primary">Start Shopping</Link></div>
        : <div className="space-y-4">{orders.map((order) => (
          <Link key={order._id} to={`/orders/${order._id}`} className="card p-5 block hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div><p className="font-mono text-sm font-bold text-maroon-800">{order.orderNumber}</p><p className="text-xs text-brown-500 mt-1">{formatDate(order.createdAt)}</p></div>
              <span className={cn('rounded-full px-3 py-1 text-xs font-medium border', ORDER_STATUS_COLORS[order.orderStatus])}>{ORDER_STATUS_LABELS[order.orderStatus]}</span>
            </div>
            <div className="mt-3 flex items-center gap-3">
              {order.items.slice(0, 3).map((item, i) => <img key={i} src={item.image} alt="" className="w-12 h-12 rounded object-cover border border-cream-200" />)}
              {order.items.length > 3 && <span className="text-sm text-brown-500">+{order.items.length - 3} more</span>}
            </div>
            <div className="mt-3 flex items-center justify-between">
              <p className="text-sm text-brown-600">{order.items.reduce((s, i) => s + i.quantity, 0)} items</p>
              <p className="text-lg font-bold text-maroon-800">{formatPrice(order.total)}</p>
            </div>
          </Link>
        ))}</div>}
    </div>
  );
}
