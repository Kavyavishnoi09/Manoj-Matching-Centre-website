import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, MessageCircle } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useSettings } from '@/context/SettingsContext';
import { formatPrice, getEffectivePrice, getProductImageUrl, buildWhatsAppLink } from '@/utils/helpers';
import { useSEO } from '@/hooks/useSEO';

export default function Cart() {
  const { items, removeItem, updateQuantity, clearCart, subtotal, totalItems } = useCart();
  const { settings } = useSettings();
  useSEO({ title: 'Shopping Cart', description: 'Review your selected fabrics before checkout.' });

  const deliveryCharge = subtotal >= (settings?.freeDeliveryThreshold || 1000) || subtotal === 0 ? 0 : (settings?.deliveryCharge || 50);
  const total = subtotal + deliveryCharge;
  const whatsappLink = settings ? buildWhatsAppLink(settings.whatsapp, 'Hello, I would like to know more about the products in my cart at Manoj Matching Centre.') : '#';

  if (items.length === 0) return <div className="max-w-3xl mx-auto px-4 py-20 text-center"><ShoppingBag size={64} className="mx-auto text-cream-300 mb-4" /><h1 className="text-2xl font-serif font-bold text-maroon-900">Your Cart is Empty</h1><p className="text-brown-600 mt-2">Browse our collection and add some beautiful fabrics.</p><Link to="/products" className="mt-6 inline-block btn-primary">Shop Now <ArrowRight size={16} /></Link></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-serif font-bold text-maroon-900 mb-6">Shopping Cart ({totalItems})</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            const price = getEffectivePrice(item.product.price, item.product.discountPrice);
            const img = getProductImageUrl(item.product.images);
            const maxQty = item.product.stock > 0 ? item.product.stock : 1;
            return (
              <div key={item.product._id} className="card p-4 flex gap-4">
                <Link to={`/products/${item.product.slug}`} className="shrink-0"><img src={img} alt={item.product.name} className="w-24 h-24 sm:w-28 sm:h-28 rounded-md object-cover border border-cream-200" /></Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/products/${item.product.slug}`}><h3 className="font-serif font-semibold text-maroon-900 hover:text-gold-700 transition-colors line-clamp-2">{item.product.name}</h3></Link>
                  {typeof item.product.category === 'object' && item.product.category && <p className="text-xs text-gold-700 mt-0.5">{item.product.category.name}</p>}
                  <div className="mt-2 flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateQuantity(item.product._id, item.quantity - 1)} className="w-8 h-8 rounded border border-cream-300 flex items-center justify-center hover:bg-cream-100"><Minus size={14} /></button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product._id, item.quantity + 1)} disabled={item.quantity >= maxQty} className="w-8 h-8 rounded border border-cream-300 flex items-center justify-center hover:bg-cream-100 disabled:opacity-40 disabled:cursor-not-allowed"><Plus size={14} /></button>
                    </div>
                    <span className="text-lg font-bold text-maroon-800">{formatPrice(price * item.quantity)}</span>
                  </div>
                </div>
                <button onClick={() => removeItem(item.product._id)} className="self-start p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors" aria-label="Remove"><Trash2 size={18} /></button>
              </div>
            );
          })}
          <div className="flex justify-between items-center pt-2"><button onClick={clearCart} className="text-sm text-red-600 hover:text-red-700 font-medium">Clear Cart</button><Link to="/products" className="text-sm text-maroon-700 hover:text-gold-600 font-medium">Continue Shopping</Link></div>
        </div>
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            <h2 className="text-lg font-serif font-bold text-maroon-900 mb-4">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-brown-600">Subtotal ({totalItems} items)</span><span className="font-medium text-brown-900">{formatPrice(subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-brown-600">Delivery Charges</span><span className="font-medium text-brown-900">{deliveryCharge === 0 ? <span className="text-green-700">FREE</span> : formatPrice(deliveryCharge)}</span></div>
              {deliveryCharge === 0 && subtotal > 0 && <p className="text-xs text-green-700 bg-green-50 rounded p-2">You saved {formatPrice(settings?.deliveryCharge || 50)} on delivery!</p>}
              {deliveryCharge > 0 && <p className="text-xs text-brown-500">Add {formatPrice((settings?.freeDeliveryThreshold || 1000) - subtotal)} more for FREE delivery</p>}
              <div className="border-t border-cream-200 pt-3 flex justify-between"><span className="text-base font-bold text-maroon-900">Total</span><span className="text-xl font-bold text-maroon-800">{formatPrice(total)}</span></div>
            </div>
            <Link to="/checkout" className="btn-primary w-full mt-5">Proceed to Checkout <ArrowRight size={16} /></Link>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="btn-whatsapp w-full mt-3"><MessageCircle size={16} /> Ask on WhatsApp</a>
          </div>
        </div>
      </div>
    </div>
  );
}
