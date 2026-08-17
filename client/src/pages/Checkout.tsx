import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, CreditCard, Banknote } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useSettings } from '@/context/SettingsContext';
import { orderAPI } from '@/services/api';
import { formatPrice, getEffectivePrice, getProductImageUrl, cn } from '@/utils/helpers';
import { useSEO } from '@/hooks/useSEO';

export default function Checkout() {
  const navigate = useNavigate();
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const { settings } = useSettings();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online'>('cod');
  const [form, setForm] = useState({
    name: user?.name || '', email: user?.email || '', phone: user?.phone || '',
    address: user?.address || '', city: user?.city || '', state: user?.state || '', pincode: user?.pincode || '',
  });

  useSEO({ title: 'Checkout', description: 'Complete your order at Manoj Matching Centre.' });

  const deliveryCharge = subtotal >= (settings?.freeDeliveryThreshold || 1000) ? 0 : (settings?.deliveryCharge || 50);
  const total = subtotal + deliveryCharge;

  if (items.length === 0) return <div className="max-w-3xl mx-auto px-4 py-20 text-center"><h1 className="text-2xl font-serif font-bold text-maroon-900">Your Cart is Empty</h1><p className="text-brown-600 mt-2">Add some products before checking out.</p><Link to="/products" className="mt-6 inline-block btn-primary">Browse Products</Link></div>;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError('');
    if (!user) { navigate('/login?redirect=/checkout'); return; }
    for (const f of ['name', 'phone', 'address', 'city', 'state', 'pincode']) { if (!form[f as keyof typeof form].trim()) { setError('Please fill in all required fields.'); return; } }
    setProcessing(true);
    try {
      const orderItems = items.map((item) => ({ productId: item.product._id, quantity: item.quantity }));
      const res = await orderAPI.create({ items: orderItems, shippingAddress: form, paymentMethod });
      clearCart();
      navigate(`/order-confirmation/${res.data.data.orderNumber}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally { setProcessing(false); }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/cart" className="inline-flex items-center gap-1 text-sm text-brown-600 hover:text-maroon-700 mb-4"><ArrowLeft size={16} /> Back to Cart</Link>
      <h1 className="text-3xl font-serif font-bold text-maroon-900 mb-6">Checkout</h1>
      {!user && <div className="card p-4 mb-6 bg-gold-50 border-gold-300"><p className="text-sm text-brown-800">Please <Link to="/login?redirect=/checkout" className="font-medium text-maroon-700 underline">login</Link> or <Link to="/register?redirect=/checkout" className="font-medium text-maroon-700 underline">register</Link> to place your order.</p></div>}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6">
            <h2 className="text-lg font-serif font-bold text-maroon-900 mb-4">Customer Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className="label">Full Name *</label><input name="name" value={form.name} onChange={handleChange} required className="input-field" /></div>
              <div><label className="label">Mobile Number *</label><input name="phone" value={form.phone} onChange={handleChange} required className="input-field" /></div>
              <div className="sm:col-span-2"><label className="label">Email</label><input name="email" type="email" value={form.email} onChange={handleChange} className="input-field" /></div>
            </div>
          </div>
          <div className="card p-6">
            <h2 className="text-lg font-serif font-bold text-maroon-900 mb-4">Shipping Address</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2"><label className="label">Complete Address *</label><textarea name="address" value={form.address} onChange={handleChange} required rows={2} className="input-field" /></div>
              <div><label className="label">City *</label><input name="city" value={form.city} onChange={handleChange} required className="input-field" /></div>
              <div><label className="label">State *</label><input name="state" value={form.state} onChange={handleChange} required className="input-field" /></div>
              <div><label className="label">PIN Code *</label><input name="pincode" value={form.pincode} onChange={handleChange} required className="input-field" /></div>
            </div>
          </div>
          <div className="card p-6">
            <h2 className="text-lg font-serif font-bold text-maroon-900 mb-4">Payment Method</h2>
            <div className="space-y-3">
              <label className={cn('flex items-center gap-3 p-4 rounded-md border-2 cursor-pointer transition-all', paymentMethod === 'cod' ? 'border-maroon-700 bg-maroon-50' : 'border-cream-200 hover:border-cream-400')}>
                <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="w-4 h-4 text-maroon-700" />
                <Banknote size={20} className="text-maroon-700" /><div><p className="text-sm font-medium text-brown-900">Cash on Delivery</p><p className="text-xs text-brown-500">Pay when your order is delivered</p></div>
              </label>
              <label className={cn('flex items-center gap-3 p-4 rounded-md border-2 cursor-pointer transition-all opacity-60', paymentMethod === 'online' ? 'border-maroon-700 bg-maroon-50' : 'border-cream-200')}>
                <input type="radio" name="payment" value="online" checked={paymentMethod === 'online'} onChange={() => setPaymentMethod('online')} className="w-4 h-4 text-maroon-700" />
                <CreditCard size={20} className="text-maroon-700" /><div><p className="text-sm font-medium text-brown-900">Online Payment</p><p className="text-xs text-brown-500">Coming soon (Razorpay integration ready)</p></div>
              </label>
            </div>
          </div>
        </div>
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            <h2 className="text-lg font-serif font-bold text-maroon-900 mb-4">Order Summary</h2>
            <div className="space-y-3 max-h-60 overflow-y-auto mb-4">
              {items.map((item) => { const price = getEffectivePrice(item.product.price, item.product.discountPrice); return (
                <div key={item.product._id} className="flex gap-3 text-sm">
                  <img src={getProductImageUrl(item.product.images)} alt="" className="w-14 h-14 rounded object-cover border border-cream-200 shrink-0" />
                  <div className="flex-1 min-w-0"><p className="font-medium text-brown-900 line-clamp-1">{item.product.name}</p><p className="text-xs text-brown-500">Qty: {item.quantity} × {formatPrice(price)}</p></div>
                  <span className="font-medium text-brown-900">{formatPrice(price * item.quantity)}</span>
                </div>); })}
            </div>
            <div className="border-t border-cream-200 pt-3 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-brown-600">Subtotal</span><span className="font-medium">{formatPrice(subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-brown-600">Delivery</span><span className="font-medium">{deliveryCharge === 0 ? <span className="text-green-700">FREE</span> : formatPrice(deliveryCharge)}</span></div>
              <div className="border-t border-cream-200 pt-2 flex justify-between"><span className="text-base font-bold text-maroon-900">Total</span><span className="text-xl font-bold text-maroon-800">{formatPrice(total)}</span></div>
            </div>
            {error && <p className="mt-3 text-sm text-red-600 bg-red-50 rounded p-2">{error}</p>}
            <button type="submit" disabled={processing} className="btn-primary w-full mt-5">{processing ? 'Placing Order...' : <><span>Place Order</span> <Check size={18} /></>}</button>
          </div>
        </div>
      </form>
    </div>
  );
}
