import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Award, Users, Truck, ShieldCheck, Tag } from 'lucide-react';
import type { Category, Product } from '@/types';
import { categoryAPI, productAPI } from '@/services/api';
import { useSettings } from '@/context/SettingsContext';
import { buildWhatsAppLink } from '@/utils/helpers';
import ProductCard from '@/components/ProductCard';
import { useSEO } from '@/hooks/useSEO';

export default function Home() {
  const { settings } = useSettings();
  const [categories, setCategories] = useState<Category[]>([]);
  const [featured, setFeatured] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [popular, setPopular] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useSEO({ title: 'Premium Banarasi Fabrics, Brocade & More', description: 'Manoj Matching Centre — Explore premium Banarasi fabrics, brocade, fancy dupattas, cotton printed fabrics, poplin and more.' });

  useEffect(() => {
    (async () => {
      try {
        const [cats, feat, news, pop] = await Promise.all([
          categoryAPI.getCategories(true), productAPI.getFeatured(), productAPI.getNewArrivals(), productAPI.getPopular(),
        ]);
        setCategories(cats.data.data);
        setFeatured(feat.data.data);
        setNewArrivals(news.data.data);
        setPopular(pop.data.data);
      } catch (err) { console.error('Home load error:', err); }
      finally { setLoading(false); }
    })();
  }, []);

  const whatsappLink = settings ? buildWhatsAppLink(settings.whatsapp, 'Hello, I would like to know more about the products available at Manoj Matching Centre.') : '#';

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-maroon-950 via-maroon-900 to-burgundy-950 text-cream-100">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23d4b880%22 fill-opacity=%220.4%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="max-w-2xl">
            <p className="text-gold-400 text-sm font-medium tracking-widest uppercase mb-4 animate-fade-in">{settings?.businessName || 'Manoj Matching Centre'}</p>
            <h1 className="text-4xl md:text-6xl font-serif font-bold leading-tight mb-4 animate-slide-up">Beautiful Fabrics for Every Occasion</h1>
            <p className="text-lg md:text-xl text-cream-300 mb-8 animate-slide-up">Explore Premium Banarasi Fabrics, Brocade, Fancy Dupattas &amp; More</p>
            <div className="flex flex-wrap gap-4 animate-slide-up">
              <Link to="/products" className="btn-gold">Shop Collection <ArrowRight size={18} /></Link>
              <Link to="/categories" className="btn-outline-gold">Explore Fabrics</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10"><h2 className="section-title">Shop by Category</h2><p className="text-brown-600 mt-2">Find the perfect fabric for your needs</p></div>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{Array.from({ length: 8 }).map((_, i) => <div key={i} className="aspect-square bg-cream-100 rounded-lg animate-pulse" />)}</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.slice(0, 8).map((cat) => (
              <Link key={cat._id} to={`/category/${cat.slug}`} className="group relative aspect-square rounded-lg overflow-hidden bg-cream-100 border border-cream-200 hover:shadow-lg transition-all">
                {cat.image ? <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  : <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-maroon-800 to-burgundy-900"><span className="text-cream-100 font-serif text-lg text-center px-4">{cat.name}</span></div>}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3"><h3 className="text-sm md:text-base font-serif font-semibold text-cream-50 group-hover:text-gold-400 transition-colors">{cat.name}</h3></div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Featured */}
      {featured.length > 0 && (
        <section className="bg-cream-100/50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-8">
              <div><h2 className="section-title">Featured Products</h2><p className="text-brown-600 mt-2">Handpicked premium fabrics</p></div>
              <Link to="/products" className="hidden sm:flex items-center gap-1 text-sm font-medium text-maroon-700 hover:text-gold-600 transition-colors">View All <ArrowRight size={16} /></Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{featured.map((p) => <ProductCard key={p._id} product={p} />)}</div>
          </div>
        </section>
      )}

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-end justify-between mb-8">
            <div><h2 className="section-title">New Arrivals</h2><p className="text-brown-600 mt-2">Latest additions to our collection</p></div>
            <Link to="/products" className="hidden sm:flex items-center gap-1 text-sm font-medium text-maroon-700 hover:text-gold-600 transition-colors">View All <ArrowRight size={16} /></Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{newArrivals.map((p) => <ProductCard key={p._id} product={p} />)}</div>
        </section>
      )}

      {/* Why Choose Us */}
      <section className="bg-maroon-950 text-cream-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10"><h2 className="text-2xl md:text-3xl font-serif font-bold text-gold-400">Why Choose Us</h2><p className="text-cream-300 mt-2">Trusted by customers for quality and service</p></div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {[
              { icon: Award, title: 'Premium Quality', desc: 'Only the finest fabrics make it to our store' },
              { icon: Sparkles, title: 'Wide Variety', desc: 'A diverse collection of fabrics and textiles' },
              { icon: Tag, title: 'Latest Designs', desc: 'Fresh patterns and designs added regularly' },
              { icon: Users, title: 'Affordable Retail Prices', desc: 'Quality fabrics at fair retail prices' },
              { icon: ShieldCheck, title: 'Trusted Store', desc: 'Years of experience serving our community' },
              { icon: Truck, title: 'Quality Fabric Selection', desc: 'Carefully curated for every occasion' },
            ].map((item, i) => (
              <div key={i} className="text-center p-6 rounded-lg bg-maroon-900/50 border border-maroon-800 hover:border-gold-500/50 transition-colors">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gold-500/20 text-gold-400 mb-4"><item.icon size={24} /></div>
                <h3 className="text-base font-serif font-semibold text-gold-400 mb-1">{item.title}</h3>
                <p className="text-sm text-cream-300">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular */}
      {popular.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-end justify-between mb-8"><div><h2 className="section-title">Popular Products</h2><p className="text-brown-600 mt-2">Customer favorites</p></div></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{popular.map((p) => <ProductCard key={p._id} product={p} />)}</div>
        </section>
      )}

      {/* CTAs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-xl bg-gradient-to-br from-green-600 to-green-700 p-8 text-center text-white">
            <h3 className="text-xl font-serif font-bold mb-2">Have Questions?</h3>
            <p className="text-green-50 mb-4 text-sm">Chat with us on WhatsApp for quick assistance</p>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-md bg-white px-6 py-3 text-sm font-medium text-green-700 hover:bg-green-50 transition-colors">WhatsApp Us</a>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-maroon-800 to-burgundy-900 p-8 text-center text-cream-100">
            <h3 className="text-xl font-serif font-bold mb-2">Get in Touch</h3>
            <p className="text-cream-300 mb-4 text-sm">Visit our store or contact us for inquiries</p>
            <Link to="/contact" className="inline-flex items-center justify-center gap-2 rounded-md bg-gold-500 px-6 py-3 text-sm font-medium text-brown-950 hover:bg-gold-600 transition-colors">Contact Us <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
