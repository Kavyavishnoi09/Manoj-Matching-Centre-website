import { useEffect, useState, useRef } from 'react';
import { Plus, Pencil, Trash2, Upload, X, Eye, EyeOff } from 'lucide-react';
import type { Category } from '@/types';
import { categoryAPI, uploadAPI } from '@/services/api';
import { cn } from '@/utils/helpers';
import { useSEO } from '@/hooks/useSEO';

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', image: '', active: true });
  useSEO({ title: 'Manage Categories' });

  const load = () => { setLoading(true); categoryAPI.getCategories(false).then((r) => setCategories(r.data.data)).catch(console.error).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm({ name: '', description: '', image: '', active: true }); setShowForm(true); };
  const openEdit = (cat: Category) => { setEditing(cat); setForm({ name: cat.name, description: cat.description, image: cat.image, active: cat.active }); setShowForm(true); };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []); if (files.length === 0) return;
    setUploading(true);
    try { const res = await uploadAPI.uploadImages(files); setForm({ ...form, image: res.data.data[0].url }); }
    catch (err: any) { setError('Upload failed.'); }
    finally { setUploading(false); if (fileRef.current) fileRef.current.value = ''; }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError('');
    if (!form.name.trim()) { setError('Category name is required.'); return; }
    try {
      if (editing) { await categoryAPI.update(editing._id, form); } else { await categoryAPI.create(form); }
      setShowForm(false); load();
    } catch (err: any) { setError(err.response?.data?.message || 'Failed to save category.'); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this category? Products in this category will remain but lose their category link.')) return;
    try { await categoryAPI.delete(id); load(); } catch { alert('Failed to delete.'); }
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap"><h1 className="text-2xl font-serif font-bold text-maroon-900">Categories ({categories.length})</h1><button onClick={openAdd} className="btn-primary"><Plus size={18} /> Add Category</button></div>
      {error && <p className="text-sm text-red-600 bg-red-50 rounded p-3 mb-4">{error}</p>}
      {loading ? <p className="text-brown-600 animate-pulse">Loading...</p>
        : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <div key={cat._id} className="bg-white rounded-lg border border-cream-200 overflow-hidden">
                <div className="aspect-[3/2] bg-gradient-to-br from-maroon-800 to-burgundy-900 relative">{cat.image ? <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><span className="text-cream-100 font-serif text-xl">{cat.name}</span></div>}</div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2"><h3 className="font-serif font-bold text-maroon-900">{cat.name}</h3><span className={cn('text-xs font-medium flex items-center gap-1', cat.active ? 'text-green-700' : 'text-brown-500')}>{cat.active ? <><Eye size={12} /> Visible</> : <><EyeOff size={12} /> Hidden</>}</span></div>
                  <p className="text-sm text-brown-600 mt-1 line-clamp-2">{cat.description}</p>
                  <div className="flex gap-2 mt-3"><button onClick={() => openEdit(cat)} className="flex-1 flex items-center justify-center gap-1 rounded-md border border-cream-300 py-2 text-sm text-blue-600 hover:bg-blue-50 transition-colors"><Pencil size={14} /> Edit</button><button onClick={() => handleDelete(cat._id)} className="flex-1 flex items-center justify-center gap-1 rounded-md border border-cream-300 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"><Trash2 size={14} /> Delete</button></div>
                </div>
              </div>
            ))}
          </div>}

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4"><h2 className="text-lg font-serif font-bold text-maroon-900">{editing ? 'Edit Category' : 'Add Category'}</h2><button onClick={() => setShowForm(false)} className="text-brown-500 hover:text-brown-700"><X size={20} /></button></div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="label">Category Name *</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="input-field" /></div>
              <div><label className="label">Description</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="input-field" /></div>
              <div><label className="label">Category Image</label><input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                {form.image ? <div className="relative mt-2 aspect-[3/2] rounded-md overflow-hidden border border-cream-200"><img src={form.image} alt="" className="w-full h-full object-cover" /><button type="button" onClick={() => setForm({ ...form, image: '' })} className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center"><X size={14} /></button></div>
                  : <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className="w-full border-2 border-dashed border-cream-300 rounded-lg p-4 text-center hover:border-maroon-500 transition-colors">{uploading ? <span className="text-sm animate-pulse">Uploading...</span> : <><Upload size={20} className="mx-auto text-brown-400 mb-1" /><span className="text-sm text-brown-600">Upload image</span></>}</button>}
              </div>
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="w-4 h-4 rounded border-cream-300 text-maroon-700" /><span className="text-sm text-brown-800">Active (visible on store)</span></label>
              <button type="submit" className="btn-primary w-full">{editing ? 'Update Category' : 'Create Category'}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
