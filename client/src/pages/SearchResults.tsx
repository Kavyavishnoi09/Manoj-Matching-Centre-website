import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import type { Product } from '@/types';
import { productAPI } from '@/services/api';
import ProductCard from '@/components/ProductCard';
import { useSEO } from '@/hooks/useSEO';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useSEO({ title: `Search: ${query}`, description: `Search results for "${query}".` });

  useEffect(() => {
    if (!query) { setProducts([]); setLoading(false); return; }
    setLoading(true);
    productAPI.getProducts({ search: query }).then((r) => setProducts(r.data.data)).catch(console.error).finally(() => setLoading(false));
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-brown-600 mb-2"><Search size={20} /><h1 className="text-2xl font-serif font-bold text-maroon-900">Search Results</h1></div>
        <p className="text-brown-600">{loading ? 'Searching...' : `${products.length} result${products.length !== 1 ? 's' : ''} for "${query}"`}</p>
      </div>
      {loading ? <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">{Array.from({ length: 8 }).map((_, i) => <div key={i} className="aspect-[3/4] bg-cream-100 rounded-lg animate-pulse" />)}</div>
        : products.length === 0 ? <div className="text-center py-20"><Search size={48} className="mx-auto text-cream-300 mb-4" /><p className="text-brown-600 text-lg">No products found for "{query}".</p><Link to="/products" className="mt-6 inline-block btn-primary">Browse All Products</Link></div>
        : <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">{products.map((p) => <ProductCard key={p._id} product={p} />)}</div>}
    </div>
  );
}
