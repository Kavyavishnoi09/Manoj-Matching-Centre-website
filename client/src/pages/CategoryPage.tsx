import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import type { Category, Product } from '@/types';
import { categoryAPI, productAPI } from '@/services/api';
import ProductCard from '@/components/ProductCard';
import { useSEO } from '@/hooks/useSEO';

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useSEO({ title: category?.name, description: category?.description });

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    (async () => {
      try {
        const catRes = await categoryAPI.getCategory(slug);
        const cat = catRes.data.data;
        setCategory(cat);
        const prodRes = await productAPI.getProducts({ category: cat.slug });
        setProducts(prodRes.data.data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, [slug]);

  if (!loading && !category) return <div className="max-w-7xl mx-auto px-4 py-20 text-center"><h1 className="text-2xl font-serif font-bold text-maroon-900">Category Not Found</h1><Link to="/categories" className="mt-4 inline-block text-maroon-700 hover:text-gold-600">View All Categories</Link></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="flex items-center gap-1 text-sm text-brown-600 mb-6"><Link to="/" className="hover:text-maroon-700">Home</Link><ChevronRight size={14} /><Link to="/categories" className="hover:text-maroon-700">Categories</Link><ChevronRight size={14} /><span className="text-maroon-800 font-medium">{category?.name}</span></nav>
      <div className="mb-8"><h1 className="text-3xl font-serif font-bold text-maroon-900">{category?.name}</h1><p className="text-brown-600 mt-2">{category?.description}</p></div>
      {loading ? <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">{Array.from({ length: 8 }).map((_, i) => <div key={i} className="aspect-[3/4] bg-cream-100 rounded-lg animate-pulse" />)}</div>
        : products.length === 0 ? <div className="text-center py-20"><p className="text-brown-600 text-lg">No products in this category yet.</p><Link to="/products" className="mt-4 inline-block text-maroon-700 hover:text-gold-600 font-medium">Browse All Products</Link></div>
        : <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">{products.map((p) => <ProductCard key={p._id} product={p} />)}</div>}
    </div>
  );
}
