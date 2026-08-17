import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, User, Phone, Mail, MapPin, CreditCard } from 'lucide-react';
import type { Order } from '@/types';
import { adminAPI } from '@/services/api';
import { formatPrice, formatDate, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS, ORDER_STATUS_FLOW, cn } from '@/utils/helpers';
import { useSEO } from '@/hooks/useSEO';

export default function AdminOrderDetails() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  useSEO({ title: 'Order Details' });

  useEffect(() => { if (id) adminAPI.getOrder(id).then((r) => setOrder(r.data.data)).catch(console.error).finally(() => setLoading(false)); }, [id]);

  const handleStatusChange = async (status: string) => {
    if (!order) return;
    setUpdating(true);
    try { const res = await adminAPI.updateOrderStatus(order._id, status); setOrder(res.data.data); } catch (err: any) { alert(err.response?.data?.message || 'Failed to update status.'); }
    finally { setUpdating(false); }
  };

  if (loading) return <div className="animate-pulse text-brown-600">Loading...</div>;
  if (!order) return <div className="text-red-600">Order not found. <Link to="/admin/orders" className="text-maroon-700 underline">Back to orders</Link></div>;

  const customer = typeof order.customer === 'object' ? order.customer : null;

  return (
    <div>
      <Link to="/admin/orders" className="inline-flex items-center gap-1 text-sm text-brown-600 hover:text-maroon-700 mb-4"><ArrowLeft size={16} /> Back to Orders</Link>
      <div className="flex items-start justify-between gap-4 flex-wrap mb-6"><div><h1 className="text-2xl font-serif font-bold text-maroon-900">Order {order.orderNumber}</h1><p className="text-sm text-brown-500 mt-1">{formatDate(order.createdAt)}</p></div><span className={cn('rounded-full px-4 py-1.5 text-sm font-medium border', ORDER_STATUS_COLORS[order.orderStatus])}>{ORDER_STATUS_LABELS[order.orderStatus]}</span></div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg border border-cream-200 p-6">
            <h2 className="text-lg font-serif font-bold text-maroon-900 mb-4">Items ({order.items.length})</h2>
            <div className="space-y-3">{order.items.map((item, i) => <div key={i} className="flex gap-3"><img src={item.image} alt="" className="w-16 h-16 rounded object-cover border border-cream-200 shrink-0" /><div className="flex-1"><p className="font-medium text-brown-900">{item.productName}</p><p className="text-xs text-brown-500">Qty: {item.quantity} × {formatPrice(item.price)}</p></div><span className="font-medium">{formatPrice(item.price * item.quantity)}</span></div>)}</div>
            <div className="border-t border-cream-200 mt-4 pt-4 space-y-2 text-sm"><div className="flex justify-between"><span className="text-brown-600">Subtotal</span><span>{formatPrice(order.subtotal)}</span></div><div className="flex justify-between"><span className="text-brown-600">Delivery</span><span>{order.deliveryCharge === 0 ? 'FREE' : formatPrice(order.deliveryCharge)}</span></div><div className="flex justify-between text-base font-bold"><span className="text-maroon-900">Total</span><span className="text-maroon-800">{formatPrice(order.total)}</span></div></div>
          </div>
          <div className="bg-white rounded-lg border border-cream-200 p-6">
            <h2 className="text-lg font-serif font-bold text-maroon-900 mb-4 flex items-center gap-2"><User size={20} /> Customer Information</h2>
            {customer && <div className="space-y-2 text-sm"><p className="font-medium text-brown-900">{customer.name}</p><p className="flex items-center gap-2 text-brown-700"><Mail size={14} /> {customer.email}</p><p className="flex items-center gap-2 text-brown-700"><Phone size={14} /> {order.shippingAddress.phone}</p></div>}
            <div className="mt-4 pt-4 border-t border-cream-200 space-y-1 text-sm text-brown-700"><p className="flex items-start gap-2"><MapPin size={16} className="shrink-0 mt-0.5" /> {order.shippingAddress.name}, {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p><p className="flex items-center gap-2 mt-2"><CreditCard size={16} /> {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'} — {order.paymentStatus}</p></div>
          </div>
        </div>
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-cream-200 p-6 sticky top-24">
            <h2 className="text-lg font-serif font-bold text-maroon-900 mb-4">Update Status</h2>
            <div className="space-y-2">{[...ORDER_STATUS_FLOW, 'cancelled'].map((status) => <button key={status} onClick={() => handleStatusChange(status)} disabled={updating || order.orderStatus === status} className={cn('w-full flex items-center justify-between rounded-md border-2 px-4 py-2.5 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed', order.orderStatus === status ? 'border-maroon-700 bg-maroon-50 text-maroon-800' : 'border-cream-200 text-brown-700 hover:border-cream-400')}><span>{ORDER_STATUS_LABELS[status]}</span>{order.orderStatus === status && <span className="text-xs">Current</span>}</button>)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
