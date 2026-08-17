import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';
import type { Order } from '@/types';
import { orderAPI } from '@/services/api';
import { formatPrice } from '@/utils/helpers';
import { useSEO } from '@/hooks/useSEO';

export default function OrderConfirmation() {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  useSEO({ title: 'Order Confirmed' });

  useEffect(() => {
    // Find by order number — we need to get my orders and filter
    orderAPI.getMyOrders().then((r) => {
      const found = r.data.data.find((o) => o.orderNumber === orderNumber);
      setOrder(found || null);
    }).catch(console.error).finally(() => setLoading(false));
  }, [orderNumber]);

  if (loading) return <div className="max-w-3xl mx-auto px-4 py-20 text-center"><p className="text-brown-600 animate-pulse">Loading...</p></div>;
  if (!order) return <div className="max-w-3xl mx-auto px-4 py-20 text-center"><h1 className="text-2xl font-serif font-bold text-maroon-900">Order Not Found</h1><Link to="/" className="mt-4 inline-block text-maroon-700 hover:text-gold-600">Go Home</Link></div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-8"><CheckCircle size={64} className="mx-auto text-green-600 mb-4" /><h1 className="text-3xl font-serif font-bold text-maroon-900">Order Confirmed!</h1><p className="text-brown-600 mt-2">Thank you for your order. We'll process it shortly.</p>
        <div className="mt-4 inline-flex items-center gap-2 rounded-lg bg-maroon-50 border border-maroon-200 px-4 py-2"><Package size={20} className="text-maroon-700" /><span className="font-mono font-bold text-maroon-800">{order.orderNumber}</span></div>
      </div>
      <div className="card p-6 mb-6">
        <h2 className="text-lg font-serif font-bold text-maroon-900 mb-4">Order Details</h2>
        <div className="space-y-3">{order.items.map((item, i) => <div key={i} className="flex gap-3 text-sm"><img src={item.image} alt="" className="w-16 h-16 rounded object-cover border border-cream-200 shrink-0" /><div className="flex-1"><p className="font-medium text-brown-900">{item.productName}</p><p className="text-xs text-brown-500">Qty: {item.quantity} × {formatPrice(item.price)}</p></div><span className="font-medium">{formatPrice(item.price * item.quantity)}</span></div>)}</div>
        <div className="border-t border-cream-200 mt-4 pt-4 space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-brown-600">Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
          <div className="flex justify-between"><span className="text-brown-600">Delivery</span><span>{order.deliveryCharge === 0 ? 'FREE' : formatPrice(order.deliveryCharge)}</span></div>
          <div className="flex justify-between text-base font-bold"><span className="text-maroon-900">Total</span><span className="text-maroon-800">{formatPrice(order.total)}</span></div>
        </div>
      </div>
      <div className="card p-6 mb-6">
        <h2 className="text-lg font-serif font-bold text-maroon-900 mb-3">Shipping Address</h2>
        <p className="text-sm text-brown-700">{order.shippingAddress.name}</p>
        <p className="text-sm text-brown-700">{order.shippingAddress.address}</p>
        <p className="text-sm text-brown-700">{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
        <p className="text-sm text-brown-700 mt-1">Phone: {order.shippingAddress.phone}</p>
        <p className="text-sm text-brown-700">Payment: {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 justify-center"><Link to="/orders" className="btn-secondary">View My Orders</Link><Link to="/products" className="btn-primary">Continue Shopping <ArrowRight size={16} /></Link></div>
    </div>
  );
}
