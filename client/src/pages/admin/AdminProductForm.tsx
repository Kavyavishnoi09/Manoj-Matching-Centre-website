import { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Upload, X, Plus, Trash2 } from 'lucide-react';
import type { Category, ProductImage } from '@/types';
import { productAPI, categoryAPI, uploadAPI } from '@/services/api';
import { getProductImageUrl, cn } from '@/utils/helpers';
import { useSEO } from '@/hooks/useSEO';

export default function AdminProductForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const fileRef = useRef<HTMLInputElement>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [colorInput, setColorInput] = useState('');
  const [images, setImages] = useState<ProductImage[]>([]);
  useSEO({ title: isEdit ? 'Edit Product' : 'Add Product' });

  const [form, setForm] = useState({
    name: '', category: '', description: '', fabricType: '', material: '', colors: [] as string[],
    pattern: '', width: '', price: '', discountPrice: '', stock: '0', stockStatus: 'in_stock',
    featured: false, newArrival: false, active: true,
  });

  useEffect(() => {
    categoryAPI.getCategories(false).then((r) => setCategories(r.data.data)).catch(console.error);
    if (isEdit && id) {
      productAPI.getProduct(id).then((r) => {
        const p = r.data.data;
        setForm({
          name: p.name, category: typeof p.category === 'object' && p.category ? p.category._id : p.category || '',
          description: p.description, fabricType: p.fabricType, material: p.material, colors: p.colors || [],
          pattern: p.pattern, width: p.width, price: String(p.price), discountPrice: p.discountPrice ? String(p.discountPrice) : '',
          stock: String(p.stock), stockStatus: p.stockStatus, featured: p.featured, newArrival: p.newArrival, active: p.active,
        });
        setImages(p.images || []);
      }).catch(console.error).finally(() => setLoading(false));
    }
  }, [id, isEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const val = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setForm({ ...form, [e.target.name]: val });
  };

  const addColor = () => { if (colorInput.trim()) { setForm({ ...form, colors: [...form.colors, colorInput.trim()] }); setColorInput(''); } };
  const removeColor = (c: string) => setForm({ ...form, colors: form.colors.filter((x) => x !== c) });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setUploading(true);
    try {
      const res = await uploadAPI.uploadImages(files);
      setImages([...images, ...res.data.data]);
    } catch (err: any) { setError(err.response?.data?.message || 'Upload failed.'); }
    finally { setUploading(false); if (fileRef.current) fileRef.current.value = ''; }
  };

  const removeImage = (i: number) => setImages(images.filter((_, idx) => idx !== i));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setSaving(true);
    try {
      const payload = { ...form, price: Number(form.price), discountPrice: form.discountPrice ? Number(form.discountPrice) : null, stock: Number(form.stock), images, category: form.category || null };
      if (isEdit && id) { await productAPI.update(id, payload); } else { await productAPI.create(payload); }
      navigate('/admin/products');
    } catch (err: any) { setError(err.response?.data?.message || 'Failed to save product.'); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="animate-pulse text-brown-600">Loading...</div>;

  return (
    <div>
      <Link to="/admin/products" className="inline-flex items-center gap-1 text-sm text-brown-600 hover:text-maroon-700 mb-4"><ArrowLeft size={16} /> Back to Products</Link>
      <h1 className="text-2xl font-serif font-bold text-maroon-900 mb-6">{isEdit ? 'Edit Product' : 'Add New Product'}</h1>
      {error && <p className="text-sm text-red-600 bg-red-50 rounded p-3 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg border border-cream-200 p-6">
            <h2 className="text-lg font-serif font-bold text-maroon-900 mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2"><label className="label">Product Name *</label><input name="name" value={form.name} onChange={handleChange} required className="input-field" /></div>
              <div><label className="label">Category</label><select name="category" value={form.category} onChange={handleChange} className="input-field"><option value="">No Category</option>{categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}</select></div>
              <div><label className="label">Fabric Type</label><input name="fabricType" value={form.fabricType} onChange={handleChange} className="input-field" placeholder="e.g. Banarasi Silk" /></div>
              <div><label className="label">Material</label><input name="material" value={form.material} onChange={handleChange} className="input-field" placeholder="e.g. Pure Silk" /></div>
              <div><label className="label">Pattern / Design</label><input name="pattern" value={form.pattern} onChange={handleChange} className="input-field" placeholder="e.g. Floral Brocade" /></div>
              <div><label className="label">Width</label><input name="width" value={form.width} onChange={handleChange} className="input-field" placeholder="e.g. 44 inches" /></div>
              <div className="sm:col-span-2"><label className="label">Description</label><textarea name="description" value={form.description} onChange={handleChange} rows={4} className="input-field" /></div>
              <div className="sm:col-span-2"><label className="label">Colors</label><div className="flex gap-2"><input value={colorInput} onChange={(e) => setColorInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addColor(); } }} placeholder="Add a color and press Enter" className="input-field" /><button type="button" onClick={addColor} className="btn-secondary !px-4"><Plus size={16} /></button></div>{form.colors.length > 0 && <div className="flex flex-wrap gap-2 mt-2">{form.colors.map((c) => <span key={c} className="inline-flex items-center gap-1 rounded-full bg-cream-200 px-3 py-1 text-xs font-medium text-brown-800">{c}<button type="button" onClick={() => removeColor(c)}><X size={12} /></button></span>)}</div>}</div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-cream-200 p-6">
            <h2 className="text-lg font-serif font-bold text-maroon-900 mb-4">Pricing &amp; Stock</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className="label">Price (₹) *</label><input name="price" type="number" step="0.01" value={form.price} onChange={handleChange} required className="input-field" /></div>
              <div><label className="label">Discount Price (₹)</label><input name="discountPrice" type="number" step="0.01" value={form.discountPrice} onChange={handleChange} className="input-field" /></div>
              <div><label className="label">Stock Quantity</label><input name="stock" type="number" value={form.stock} onChange={handleChange} className="input-field" /></div>
              <div><label className="label">Stock Status</label><select name="stockStatus" value={form.stockStatus} onChange={handleChange} className="input-field"><option value="in_stock">In Stock</option><option value="out_of_stock">Out of Stock</option><option value="made_to_order">Made to Order</option></select></div>
            </div>
          </div>
        </div>
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-lg border border-cream-200 p-6">
            <h2 className="text-lg font-serif font-bold text-maroon-900 mb-4">Product Images</h2>
            <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" />
            <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className="w-full border-2 border-dashed border-cream-300 rounded-lg p-6 text-center hover:border-maroon-500 transition-colors mb-4">
              {uploading ? <p className="text-sm text-brown-600 animate-pulse">Uploading...</p> : <><Upload size={24} className="mx-auto text-brown-400 mb-2" /><p className="text-sm text-brown-600">Click to upload images</p><p className="text-xs text-brown-400 mt-1">PNG, JPG up to 5MB</p></>}
            </button>
            {images.length > 0 && <div className="grid grid-cols-3 gap-2">{images.map((img, i) => <div key={i} className="relative group aspect-square rounded-md overflow-hidden border border-cream-200"><img src={img.url} alt="" className="w-full h-full object-cover" /><button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={12} /></button></div>)}</div>}
          </div>
          <div className="bg-white rounded-lg border border-cream-200 p-6">
            <h2 className="text-lg font-serif font-bold text-maroon-900 mb-4">Visibility &amp; Tags</h2>
            <div className="space-y-3">
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" name="active" checked={form.active} onChange={handleChange} className="w-4 h-4 rounded border-cream-300 text-maroon-700" /><span className="text-sm text-brown-800">Active (visible on store)</span></label>
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} className="w-4 h-4 rounded border-cream-300 text-maroon-700" /><span className="text-sm text-brown-800">Featured Product</span></label>
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" name="newArrival" checked={form.newArrival} onChange={handleChange} className="w-4 h-4 rounded border-cream-300 text-maroon-700" /><span className="text-sm text-brown-800">New Arrival</span></label>
            </div>
          </div>
          <button type="submit" disabled={saving} className="btn-primary w-full"><Save size={18} /> {saving ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}</button>
        </div>
      </form>
    </div>
  );
}
