import { Link } from 'react-router-dom';
import { ShoppingCart, Eye, MessageCircle, BadgeCheck } from 'lucide-react';
import type { Product } from '@/types';
import { formatPrice, getEffectivePrice, getDiscountPercent, getProductImageUrl, buildWhatsAppLink, cn } from '@/utils/helpers';
import { useCart } from '@/context/CartContext';
import { useSettings } from '@/context/SettingsContext';

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { settings } = useSettings();
  const imageUrl = getProductImageUrl(product.images);
  const effectivePrice = getEffectivePrice(product.price, product.discountPrice);
  const discountPercent = getDiscountPercent(product.price, product.discountPrice);
  const inStock = product.stock > 0 && product.stockStatus === 'in_stock';
  const categoryName = typeof product.category === 'object' && product.category ? product.category.name : '';
  const whatsappLink = settings ? buildWhatsAppLink(settings.whatsapp, `Hello, I am interested in ${product.name}. Please share more details.`) : '#';

  return (
    <div className="group card overflow-hidden flex flex-col">
      <div className="relative overflow-hidden bg-cream-100 aspect-[4/5]">
        <Link to={`/products/${product.slug}`}>
          <img src={imageUrl} alt={product.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        </Link>
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.featured && <span className="rounded bg-gold-500 px-2 py-0.5 text-xs font-medium text-brown-950">Featured</span>}
          {product.newArrival && <span className="rounded bg-maroon-800 px-2 py-0.5 text-xs font-medium text-cream-50">New Arrival</span>}
          {discountPercent > 0 && <span className="rounded bg-green-600 px-2 py-0.5 text-xs font-medium text-white">{discountPercent}% Off</span>}
        </div>
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-2 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <Link to={`/products/${product.slug}`} className="flex items-center justify-center w-9 h-9 rounded-full bg-white text-maroon-800 hover:bg-maroon-800 hover:text-cream-50 transition-colors shadow-md" title="View Details"><Eye size={16} /></Link>
          <button onClick={() => addItem(product)} disabled={!inStock} className="flex items-center justify-center w-9 h-9 rounded-full bg-white text-maroon-800 hover:bg-maroon-800 hover:text-cream-50 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed" title="Add to Cart"><ShoppingCart size={16} /></button>
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-9 h-9 rounded-full bg-white text-green-600 hover:bg-green-600 hover:text-white transition-colors shadow-md" title="WhatsApp Enquiry"><MessageCircle size={16} /></a>
        </div>
      </div>
      <div className="flex flex-col flex-1 p-4">
        {categoryName && <span className="text-xs font-medium text-gold-700 uppercase tracking-wide mb-1">{categoryName}</span>}
        <Link to={`/products/${product.slug}`}><h3 className="text-sm font-serif font-semibold text-maroon-900 line-clamp-2 hover:text-maroon-700 transition-colors">{product.name}</h3></Link>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-lg font-bold text-maroon-800">{formatPrice(effectivePrice)}</span>
          {discountPercent > 0 && <span className="text-sm text-brown-400 line-through">{formatPrice(product.price)}</span>}
        </div>
        <div className="mt-2 flex items-center gap-1.5">
          {inStock ? <span className="flex items-center gap-1 text-xs text-green-700"><BadgeCheck size={14} /> In Stock</span>
            : <span className={cn('text-xs', product.stockStatus === 'made_to_order' ? 'text-amber-700' : 'text-red-700')}>{product.stockStatus === 'made_to_order' ? 'Made to Order' : 'Out of Stock'}</span>}
        </div>
        <div className="mt-3 pt-3 border-t border-cream-200">
          <button onClick={() => addItem(product)} disabled={!inStock} className="flex-1 btn-primary !py-2 !text-xs w-full"><ShoppingCart size={14} /> Add to Cart</button>
        </div>
      </div>
    </div>
  );
}
