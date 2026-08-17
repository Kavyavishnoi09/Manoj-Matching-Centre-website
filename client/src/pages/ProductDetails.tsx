import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronRight, ShoppingCart, Zap, MessageCircle, Minus, Plus, BadgeCheck, ArrowLeft } from 'lucide-react';
import type { Product } from '@/types';
import { productAPI } from '@/services/api';
import { formatPrice, getEffectivePrice, getDiscountPercent, getProductImageUrl, buildWhatsAppLink, cn } from '@/utils/helpers';
import { useCart } from '@/context/CartContext';
import { useSettings } from '@/context/SettingsContext';
import { useSEO } from '@/hooks/useSEO';

export default function ProductDetails() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { settings } = useSettings();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [added, setAdded] = useState(false);

  useSEO({ title: product?.name, description: product?.description, image: product ? getProductImageUrl(product.images) : undefined, type: 'product' });

  useEffect(() => {
    if (!slug) return;
    setLoading(true); setProduct(null);
    productAPI.getProduct(slug).then((r) => setProduct(r.data.data)).catch(console.error).finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"><div className="grid grid-cols-1 lg:grid-cols-2 gap-8"><div className="aspect-square bg-cream-100 rounded-lg animate-pulse" /><div className="space-y-4"><div className="h-8 bg-cream-100 rounded animate-pulse w-3/4" /><div className="h-6 bg-cream-100 rounded animate-pulse w-1/2" /><div className="h-24 bg-cream-100 rounded animate-pulse" /></div></div></div>;
  if (!product) return <div className="max-w-7xl mx-auto px-4 py-20 text-center"><h1 className="text-2xl font-serif font-bold text-maroon-900">Product Not Found</h1><Link to="/products" className="mt-4 inline-block text-maroon-700 hover:text-gold-600">Browse All Products</Link></div>;

  const effectivePrice = getEffectivePrice(product.price, product.discountPrice);
  const discountPercent = getDiscountPercent(product.price, product.discountPrice);
  const inStock = product.stock > 0 && product.stockStatus === 'in_stock';
  const images = product.images.length > 0 ? product.images : [{ url: '', publicId: '' }];
  const categoryName = typeof product.category === 'object' && product.category ? product.category.name : '';
  const categorySlug = typeof product.category === 'object' && product.category ? product.category.slug : '';
  const whatsappLink = settings ? buildWhatsAppLink(settings.whatsapp, `Hello, I am interested in ${product.name}. Please share more details.`) : '#';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="flex items-center gap-1 text-sm text-brown-600 mb-6 flex-wrap">
        <Link to="/" className="hover:text-maroon-700">Home</Link><ChevronRight size={14} />
        <Link to="/products" className="hover:text-maroon-700">Products</Link>
        {categorySlug && <><ChevronRight size={14} /><Link to={`/category/${categorySlug}`} className="hover:text-maroon-700">{categoryName}</Link></>}
        <ChevronRight size={14} /><span className="text-maroon-800 font-medium line-clamp-1">{product.name}</span>
      </nav>
      <Link to="/products" className="inline-flex items-center gap-1 text-sm text-brown-600 hover:text-maroon-700 mb-4"><ArrowLeft size={16} /> Back to Products</Link>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="aspect-square rounded-lg overflow-hidden bg-cream-100 border border-cream-200 mb-4"><img src={images[activeImage]?.url || ''} alt={product.name} className="w-full h-full object-cover" /></div>
          {images.length > 1 && <div className="flex gap-2 overflow-x-auto">{images.map((img, i) => <button key={i} onClick={() => setActiveImage(i)} className={cn('w-20 h-20 rounded-md overflow-hidden border-2 transition-all shrink-0', activeImage === i ? 'border-maroon-700' : 'border-cream-200 hover:border-cream-400')}><img src={img.url} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" /></button>)}</div>}
        </div>
        <div>
          {categoryName && <Link to={`/category/${categorySlug}`} className="text-sm font-medium text-gold-700 uppercase tracking-wide hover:text-gold-600">{categoryName}</Link>}
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-maroon-900 mt-1">{product.name}</h1>
          <div className="mt-4 flex items-center gap-3 flex-wrap">
            <span className="text-3xl font-bold text-maroon-800">{formatPrice(effectivePrice)}</span>
            {discountPercent > 0 && <><span className="text-lg text-brown-400 line-through">{formatPrice(product.price)}</span><span className="rounded bg-green-100 text-green-800 px-2 py-0.5 text-sm font-medium">{discountPercent}% Off</span></>}
          </div>
          <div className="mt-3">{inStock ? <span className="flex items-center gap-1.5 text-sm text-green-700"><BadgeCheck size={18} /> In Stock ({product.stock} available)</span> : <span className={cn('text-sm font-medium', product.stockStatus === 'made_to_order' ? 'text-amber-700' : 'text-red-700')}>{product.stockStatus === 'made_to_order' ? 'Made to Order' : 'Out of Stock'}</span>}</div>
          <p className="mt-4 text-brown-700 leading-relaxed">{product.description}</p>
          <div className="mt-6 grid grid-cols-2 gap-4">
            {product.fabricType && <div><span className="label">Fabric Type</span><p className="text-sm text-brown-800">{product.fabricType}</p></div>}
            {product.material && <div><span className="label">Material</span><p className="text-sm text-brown-800">{product.material}</p></div>}
            {product.pattern && <div><span className="label">Pattern / Design</span><p className="text-sm text-brown-800">{product.pattern}</p></div>}
            {product.width && <div><span className="label">Width</span><p className="text-sm text-brown-800">{product.width}</p></div>}
            {product.colors.length > 0 && <div className="col-span-2"><span className="label">Colors</span><div className="flex flex-wrap gap-2 mt-1">{product.colors.map((c) => <span key={c} className="rounded-full bg-cream-200 px-3 py-1 text-xs font-medium text-brown-800">{c}</span>)}</div></div>}
          </div>
          <div className="mt-8 space-y-4">
            {inStock && <div><span className="label">Quantity</span><div className="flex items-center gap-3">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="w-10 h-10 rounded-md border border-cream-300 flex items-center justify-center hover:bg-cream-100 transition-colors"><Minus size={16} /></button>
              <span className="w-12 text-center text-lg font-medium">{quantity}</span>
              <button onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))} className="w-10 h-10 rounded-md border border-cream-300 flex items-center justify-center hover:bg-cream-100 transition-colors"><Plus size={16} /></button>
              <span className="text-sm text-brown-500 ml-2">Max: {product.stock}</span>
            </div></div>}
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={() => { addItem(product, quantity); setAdded(true); setTimeout(() => setAdded(false), 2000); }} disabled={!inStock} className="btn-primary flex-1"><ShoppingCart size={18} /> {added ? 'Added!' : 'Add to Cart'}</button>
              <button onClick={() => { addItem(product, quantity); navigate('/checkout'); }} disabled={!inStock} className="btn-gold flex-1"><Zap size={18} /> Buy Now</button>
            </div>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="btn-whatsapp w-full"><MessageCircle size={18} /> WhatsApp Enquiry</a>
          </div>
        </div>
      </div>
    </div>
  );
}
