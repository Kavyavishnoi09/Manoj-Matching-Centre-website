import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, Search, Eye, EyeOff } from 'lucide-react';
import type { Product } from '@/types';
import { adminAPI, productAPI } from '@/services/api';
import { formatPrice, getEffectivePrice, getProductImageUrl, formatDate, cn } from '@/utils/helpers';
import { useSEO } from '@/hooks/useSEO';

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  useSEO({ title: 'Manage Products' });

  const load = () => { setLoading(true); adminAPI.getProducts().then((r) => setProducts(r.data.data)).catch(console.error).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  const filtered = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    setDeleteId(id);
    try { await productAPI.delete(id); setProducts(products.filter((p) => p._id !== id)); }
    catch (err) { alert('Failed to delete product.'); }
    finally { setDeleteId(null); }
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        <h1 className="text-2xl font-serif font-bold text-maroon-900">Products ({products.length})</h1>
        <Link to="/admin/products/new" className="btn-primary"><Plus size={18} /> Add Product</Link>
      </div>
      <div className="mb-4 relative max-w-sm"><Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-brown-400" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." className="input-field pl-10" /></div>
      <div className="bg-white rounded-lg border border-cream-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-cream-100 text-brown-700"><tr><th className="text-left px-4 py-3 font-medium">Product</th><th className="text-left px-4 py-3 font-medium hidden md:table-cell">Category</th><th className="text-left px-4 py-3 font-medium">Price</th><th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Stock</th><th className="text-left px-4 py-3 font-medium hidden lg:table-cell">Status</th><th className="text-right px-4 py-3 font-medium">Actions</th></tr></thead>
            <tbody className="divide-y divide-cream-200">
              {loading ? <tr><td colSpan={6} className="text-center py-8 text-brown-500 animate-pulse">Loading...</td></tr>
              : filtered.length === 0 ? <tr><td colSpan={6} className="text-center py-8 text-brown-500">No products found.</td></tr>
              : filtered.map((p) => (
                <tr key={p._id} className="hover:bg-cream-50 transition-colors">
                  <td className="px-4 py-3"><div className="flex items-center gap-3"><img src={getProductImageUrl(p.images)} alt="" className="w-10 h-10 rounded object-cover border border-cream-200 shrink-0" /><div className="min-w-0"><p className="font-medium text-brown-900 line-clamp-1">{p.name}</p><p className="text-xs text-brown-500">{formatDate(p.createdAt)}</p></div></div></td>
                  <td className="px-4 py-3 hidden md:table-cell text-brown-700">{typeof p.category === 'object' && p.category ? p.category.name : '—'}</td>
                  <td className="px-4 py-3 font-medium text-maroon-800">{formatPrice(getEffectivePrice(p.price, p.discountPrice))}</td>
                  <td className="px-4 py-3 hidden sm:table-cell"><span className={cn('font-medium', p.stock > 0 ? 'text-green-700' : 'text-red-600')}>{p.stock}</span></td>
                  <td className="px-4 py-3 hidden lg:table-cell">{p.active ? <span className="inline-flex items-center gap-1 text-green-700 text-xs"><Eye size={14} /> Visible</span> : <span className="inline-flex items-center gap-1 text-brown-500 text-xs"><EyeOff size={14} /> Hidden</span>}</td>
                  <td className="px-4 py-3"><div className="flex items-center justify-end gap-2"><Link to={`/admin/products/${p._id}/edit`} className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Edit"><Pencil size={16} /></Link><button onClick={() => handleDelete(p._id)} disabled={deleteId === p._id} className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50" title="Delete"><Trash2 size={16} /></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
