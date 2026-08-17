import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X } from 'lucide-react';
import type { Category, Product } from '@/types';
import { productAPI, categoryAPI } from '@/services/api';
import ProductCard from '@/components/ProductCard';
import { useSEO } from '@/hooks/useSEO';
import { cn } from '@/utils/helpers';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  useSEO({ title: 'All Products', description: 'Browse our complete collection of premium fabrics including Banarasi brocade, silk, cotton, dupattas and more.' });

  const params = useMemo(() => ({
    category: searchParams.get('category') || undefined,
    search: searchParams.get('q') || undefined,
    fabricType: searchParams.get('fabricType') || undefined,
    minPrice: searchParams.get('minPrice') || undefined,
    maxPrice: searchParams.get('maxPrice') || undefined,
    inStock: searchParams.get('inStock') || undefined,
    sort: searchParams.get('sort') || 'newest',
  }), [searchParams]);

  useEffect(() => { categoryAPI.getCategories(true).then((r) => setCategories(r.data.data)).catch(console.error); }, []);

  useEffect(() => {
    setLoading(true);
    productAPI.getProducts(params)
      .then((r) => setProducts(r.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [params]);

  const updateFilter = (key: string, value: string | undefined) => {
    const next = new URLSearchParams(searchParams);
    if (!value) next.delete(key); else next.set(key, value);
    setSearchParams(next);
  };

  const clearFilters = () => setSearchParams({ sort: 'newest' });
  const activeFilterCount = Array.from(searchParams.keys()).filter((k) => k !== 'sort').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6"><h1 className="text-3xl font-serif font-bold text-maroon-900">All Products</h1><p className="text-brown-600 mt-1">Browse our complete fabric collection</p></div>
      <div className="flex gap-6">
        <aside className={cn('fixed lg:sticky inset-0 lg:inset-auto z-50 lg:z-auto top-0 left-0 h-full lg:h-auto w-80 lg:w-64 shrink-0 bg-cream-50 lg:bg-transparent overflow-y-auto lg:overflow-visible transition-transform duration-300 lg:translate-x-0', showFilters ? 'translate-x-0' : '-translate-x-full lg:translate-x-0')}>
          <div className="lg:bg-white lg:border lg:border-cream-200 lg:rounded-lg lg:p-5 p-6 mt-16 lg:mt-0">
            <div className="flex items-center justify-between mb-4 lg:mb-5"><h2 className="text-lg font-serif font-bold text-maroon-900">Filters</h2><button onClick={() => setShowFilters(false)} className="lg:hidden text-brown-600"><X size={20} /></button></div>
            <div className="mb-5"><h3 className="label">Category</h3>
              <select value={searchParams.get('category') || ''} onChange={(e) => updateFilter('category', e.target.value || undefined)} className="input-field">
                <option value="">All Categories</option>
                {categories.map((c) => <option key={c._id} value={c.slug}>{c.name}</option>)}
              </select>
            </div>
            <div className="mb-5"><h3 className="label">Fabric Type</h3><input type="text" value={searchParams.get('fabricType') || ''} onChange={(e) => updateFilter('fabricType', e.target.value || undefined)} placeholder="e.g. Silk, Cotton..." className="input-field" /></div>
            <div className="mb-5"><h3 className="label">Price Range</h3><div className="flex gap-2"><input type="number" value={searchParams.get('minPrice') || ''} onChange={(e) => updateFilter('minPrice', e.target.value || undefined)} placeholder="Min" className="input-field" /><input type="number" value={searchParams.get('maxPrice') || ''} onChange={(e) => updateFilter('maxPrice', e.target.value || undefined)} placeholder="Max" className="input-field" /></div></div>
            <div className="mb-5"><label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={searchParams.get('inStock') === 'true'} onChange={(e) => updateFilter('inStock', e.target.checked ? 'true' : undefined)} className="w-4 h-4 rounded border-cream-300 text-maroon-700 focus:ring-maroon-600" /><span className="text-sm text-brown-800">In Stock Only</span></label></div>
            {activeFilterCount > 0 && <button onClick={clearFilters} className="w-full text-sm text-red-600 hover:text-red-700 font-medium py-2">Clear All Filters</button>}
          </div>
        </aside>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-4 mb-5">
            <button onClick={() => setShowFilters(true)} className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-md border border-cream-300 bg-white text-sm font-medium text-brown-800"><SlidersHorizontal size={16} /> Filters {activeFilterCount > 0 && `(${activeFilterCount})`}</button>
            <p className="hidden lg:block text-sm text-brown-600">{loading ? 'Loading...' : `${products.length} products`}</p>
            <div className="flex items-center gap-2"><span className="text-sm text-brown-600 hidden sm:inline">Sort:</span>
              <select value={searchParams.get('sort') || 'newest'} onChange={(e) => updateFilter('sort', e.target.value)} className="rounded-md border border-cream-300 bg-white px-3 py-2 text-sm focus:border-maroon-600 focus:outline-none">
                <option value="newest">Newest</option><option value="price_low">Price: Low to High</option><option value="price_high">Price: High to Low</option><option value="popular">Popular</option>
              </select>
            </div>
          </div>
          {loading ? <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">{Array.from({ length: 8 }).map((_, i) => <div key={i} className="aspect-[3/4] bg-cream-100 rounded-lg animate-pulse" />)}</div>
            : products.length === 0 ? <div className="text-center py-20"><p className="text-brown-600 text-lg">No products found matching your filters.</p>{activeFilterCount > 0 && <button onClick={clearFilters} className="mt-4 text-maroon-700 font-medium hover:text-maroon-900">Clear filters and show all</button>}</div>
            : <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">{products.map((p) => <ProductCard key={p._id} product={p} />)}</div>}
        </div>
      </div>
      {showFilters && <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={() => setShowFilters(false)} />}
    </div>
  );
}
