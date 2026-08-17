import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, XCircle } from 'lucide-react';
import type { Order } from '@/types';
import { orderAPI } from '@/services/api';
import { formatPrice, formatDate, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS, ORDER_STATUS_FLOW, cn } from '@/utils/helpers';
import { useSEO } from '@/hooks/useSEO';

export default function OrderDetails() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  useSEO({ title: 'Order Details' });

  useEffect(() => { if (id) orderAPI.getOrder(id).then((r) => setOrder(r.data.data)).catch(console.error).finally(() => setLoading(false)); }, [id]);

  const handleCancel = async () => {
    if (!order || !confirm('Are you sure you want to cancel this order?')) return;
    setCancelling(true);
    try { const res = await orderAPI.cancel(order._id); setOrder(res.data.data); } catch (err: any) { alert(err.response?.data?.message || 'Failed to cancel order'); }
    finally { setCancelling(false); }
  };

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-20 text-center animate-pulse">Loading...</div>;
  if (!order) return <div className="max-w-4xl mx-auto px-4 py-20 text-center"><h1 className="text-2xl font-serif font-bold text-maroon-900">Order Not Found</h1><Link to="/orders" className="mt-4 inline-block text-maroon-700 hover:text-gold-600">View All Orders</Link></div>;

  const currentStep = ORDER_STATUS_FLOW.indexOf(order.orderStatus);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/orders" className="inline-flex items-center gap-1 text-sm text-brown-600 hover:text-maroon-700 mb-4"><ArrowLeft size={16} /> Back to Orders</Link>
      <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
        <div><h1 className="text-2xl font-serif font-bold text-maroon-900">Order {order.orderNumber}</h1><p className="text-sm text-brown-500 mt-1">Placed on {formatDate(order.createdAt)}</p></div>
        <span className={cn('rounded-full px-4 py-1.5 text-sm font-medium border', ORDER_STATUS_COLORS[order.orderStatus])}>{ORDER_STATUS_LABELS[order.orderStatus]}</span>
      </div>

      {order.orderStatus !== 'cancelled' && (
        <div className="card p-6 mb-6">
          <h2 className="text-lg font-serif font-bold text-maroon-900 mb-4">Order Tracking</h2>
          <div className="flex items-center justify-between">
            {ORDER_STATUS_FLOW.map((status, i) => (
              <div key={status} className="flex flex-col items-center flex-1 relative">
                {i < ORDER_STATUS_FLOW.length - 1 && <div className={cn('absolute top-4 left-1/2 w-full h-0.5', i < currentStep ? 'bg-green-500' : 'bg-cream-200')} />}
                <div className={cn('relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2', i <= currentStep ? 'bg-green-500 text-white border-green-500' : 'bg-cream-100 text-brown-400 border-cream-300')}>{i + 1}</div>
                <span className={cn('text-xs mt-2 text-center', i <= currentStep ? 'text-green-700 font-medium' : 'text-brown-400')}>{ORDER_STATUS_LABELS[status]}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6"><h2 className="text-lg font-serif font-bold text-maroon-900 mb-4">Items</h2><div className="space-y-3">{order.items.map((item, i) => <div key={i} className="flex gap-3"><img src={item.image} alt="" className="w-16 h-16 rounded object-cover border border-cream-200 shrink-0" /><div className="flex-1"><p className="font-medium text-brown-900">{item.productName}</p><p className="text-xs text-brown-500">Qty: {item.quantity} × {formatPrice(item.price)}</p></div><span className="font-medium">{formatPrice(item.price * item.quantity)}</span></div>)}</div>
            <div className="border-t border-cream-200 mt-4 pt-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-brown-600">Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-brown-600">Delivery</span><span>{order.deliveryCharge === 0 ? 'FREE' : formatPrice(order.deliveryCharge)}</span></div>
              <div className="flex justify-between text-base font-bold"><span className="text-maroon-900">Total</span><span className="text-maroon-800">{formatPrice(order.total)}</span></div>
            </div>
          </div>
          <div className="card p-6"><h2 className="text-lg font-serif font-bold text-maroon-900 mb-3">Shipping Address</h2><p className="text-sm text-brown-700">{order.shippingAddress.name}</p><p className="text-sm text-brown-700">{order.shippingAddress.address}</p><p className="text-sm text-brown-700">{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p><p className="text-sm text-brown-700 mt-1">Phone: {order.shippingAddress.phone}</p><p className="text-sm text-brown-700">Payment: {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'} ({order.paymentStatus})</p></div>
        </div>
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            <h2 className="text-lg font-serif font-bold text-maroon-900 mb-4">Actions</h2>
            {order.orderStatus === 'pending' ? <button onClick={handleCancel} disabled={cancelling} className="w-full flex items-center justify-center gap-2 rounded-md border-2 border-red-300 text-red-700 px-4 py-3 text-sm font-medium hover:bg-red-50 transition-colors disabled:opacity-50"><XCircle size={18} /> {cancelling ? 'Cancelling...' : 'Cancel Order'}</button>
              : order.orderStatus === 'cancelled' ? <p className="text-sm text-red-600 text-center">This order has been cancelled.</p>
              : <p className="text-sm text-brown-600 text-center">Your order is being processed. For changes, please contact us.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
