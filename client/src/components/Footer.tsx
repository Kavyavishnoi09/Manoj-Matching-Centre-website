import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, MessageCircle, Instagram, Facebook, Clock } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';
import { buildWhatsAppLink } from '@/utils/helpers';

export default function Footer() {
  const { settings } = useSettings();
  if (!settings) return null;

  const whatsappLink = buildWhatsAppLink(settings.whatsapp, 'Hello, I would like to know more about the products available at Manoj Matching Centre.');

  return (
    <footer className="bg-maroon-950 text-cream-100 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-serif font-bold text-gold-400 mb-3">Manoj Matching Centre</h3>
            <p className="text-sm text-cream-300 leading-relaxed">{settings.aboutText.slice(0, 150)}...</p>
            <div className="flex gap-3 mt-4">
              {settings.instagram && <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-maroon-800 hover:bg-gold-500 hover:text-brown-950 transition-colors"><Instagram size={18} /></a>}
              {settings.facebook && <a href={settings.facebook} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-maroon-800 hover:bg-gold-500 hover:text-brown-950 transition-colors"><Facebook size={18} /></a>}
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-maroon-800 hover:bg-green-600 transition-colors"><MessageCircle size={18} /></a>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-serif font-bold text-gold-400 mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/products" className="text-cream-300 hover:text-gold-400 transition-colors">All Products</Link></li>
              <li><Link to="/categories" className="text-cream-300 hover:text-gold-400 transition-colors">Categories</Link></li>
              <li><Link to="/about" className="text-cream-300 hover:text-gold-400 transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-cream-300 hover:text-gold-400 transition-colors">Contact Us</Link></li>
              <li><Link to="/orders" className="text-cream-300 hover:text-gold-400 transition-colors">My Orders</Link></li>
              <li><Link to="/cart" className="text-cream-300 hover:text-gold-400 transition-colors">Cart</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-serif font-bold text-gold-400 mb-3">Our Collections</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/category/banarasi-brocade" className="text-cream-300 hover:text-gold-400 transition-colors">Banarasi Brocade</Link></li>
              <li><Link to="/category/banarasi-fabric" className="text-cream-300 hover:text-gold-400 transition-colors">Banarasi Fabric</Link></li>
              <li><Link to="/category/fancy-dupatta" className="text-cream-300 hover:text-gold-400 transition-colors">Fancy Dupatta</Link></li>
              <li><Link to="/category/cotton-printed-fabric" className="text-cream-300 hover:text-gold-400 transition-colors">Cotton Printed Fabric</Link></li>
              <li><Link to="/category/dress-material" className="text-cream-300 hover:text-gold-400 transition-colors">Dress Material</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-serif font-bold text-gold-400 mb-3">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2"><MapPin size={18} className="shrink-0 mt-0.5 text-gold-400" /><span className="text-cream-300">{settings.address}</span></li>
              <li className="flex items-center gap-2"><Phone size={18} className="shrink-0 text-gold-400" /><a href={`tel:${settings.phone}`} className="text-cream-300 hover:text-gold-400 transition-colors">{settings.phone}</a></li>
              <li className="flex items-center gap-2"><Mail size={18} className="shrink-0 text-gold-400" /><a href={`mailto:${settings.email}`} className="text-cream-300 hover:text-gold-400 transition-colors">{settings.email}</a></li>
              <li className="flex items-start gap-2"><Clock size={18} className="shrink-0 mt-0.5 text-gold-400" /><span className="text-cream-300">{settings.businessHours}</span></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-maroon-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-cream-400">&copy; {new Date().getFullYear()} {settings.businessName}. All rights reserved.</p>
          <div className="flex gap-4 text-xs text-cream-400"><Link to="/admin/login" className="hover:text-gold-400 transition-colors">Admin Portal</Link></div>
        </div>
      </div>
    </footer>
  );
}
