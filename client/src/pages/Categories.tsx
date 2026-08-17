import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { Category } from '@/types';
import { categoryAPI } from '@/services/api';
import { useSEO } from '@/hooks/useSEO';

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  useSEO({ title: 'Categories', description: 'Browse all fabric categories at Manoj Matching Centre.' });

  useEffect(() => { categoryAPI.getCategories(true).then((r) => setCategories(r.data.data)).catch(console.error).finally(() => setLoading(false)); }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 text-center"><h1 className="text-3xl font-serif font-bold text-maroon-900">Our Categories</h1><p className="text-brown-600 mt-2">Explore our wide range of premium fabrics by category</p></div>
      {loading ? <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="aspect-[3/2] bg-cream-100 rounded-lg animate-pulse" />)}</div>
        : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <Link key={cat._id} to={`/category/${cat.slug}`} className="group card overflow-hidden">
                <div className="aspect-[3/2] overflow-hidden bg-gradient-to-br from-maroon-800 to-burgundy-900 relative">
                  {cat.image ? <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /> : <div className="w-full h-full flex items-center justify-center"><span className="text-cream-100 font-serif text-2xl">{cat.name}</span></div>}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-serif font-bold text-maroon-900 group-hover:text-gold-700 transition-colors">{cat.name}</h3>
                  <p className="text-sm text-brown-600 mt-1 line-clamp-2">{cat.description}</p>
                  <span className="inline-flex items-center gap-1 mt-3 text-sm font-medium text-maroon-700 group-hover:text-gold-600 transition-colors">Browse Collection <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" /></span>
                </div>
              </Link>
            ))}
          </div>}
    </div>
  );
}
