import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, MessageCircle, Send } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';
import { buildWhatsAppLink } from '@/utils/helpers';
import { useSEO } from '@/hooks/useSEO';

export default function Contact() {
  const { settings } = useSettings();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  useSEO({ title: 'Contact Us', description: 'Get in touch with Manoj Matching Centre for all your fabric needs.' });

  const whatsappLink = settings ? buildWhatsAppLink(settings.whatsapp, `Hello, my name is ${form.name || '[Your Name]'}. ${form.message || 'I would like to know more about your products.'}`) : '#';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.open(whatsappLink, '_blank');
    setSent(true);
    setForm({ name: '', email: '', message: '' });
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-10"><h1 className="text-3xl md:text-4xl font-serif font-bold text-maroon-900">Contact Us</h1><p className="text-brown-600 mt-2">We'd love to hear from you. Reach out with any questions.</p></div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          {settings && (
            <>
              <div className="card p-5 flex items-start gap-4"><div className="shrink-0 w-10 h-10 rounded-full bg-maroon-50 text-maroon-700 flex items-center justify-center"><Phone size={20} /></div><div><h3 className="font-serif font-bold text-maroon-900">Phone</h3><a href={`tel:${settings.phone}`} className="text-sm text-brown-700 hover:text-maroon-700">{settings.phone}</a></div></div>
              <div className="card p-5 flex items-start gap-4"><div className="shrink-0 w-10 h-10 rounded-full bg-maroon-50 text-maroon-700 flex items-center justify-center"><Mail size={20} /></div><div><h3 className="font-serif font-bold text-maroon-900">Email</h3><a href={`mailto:${settings.email}`} className="text-sm text-brown-700 hover:text-maroon-700">{settings.email}</a></div></div>
              <div className="card p-5 flex items-start gap-4"><div className="shrink-0 w-10 h-10 rounded-full bg-maroon-50 text-maroon-700 flex items-center justify-center"><MapPin size={20} /></div><div><h3 className="font-serif font-bold text-maroon-900">Address</h3><p className="text-sm text-brown-700">{settings.address}</p>{settings.mapUrl && <a href={settings.mapUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-maroon-700 hover:text-gold-600 mt-1 inline-block">View on Map</a>}</div></div>
              <div className="card p-5 flex items-start gap-4"><div className="shrink-0 w-10 h-10 rounded-full bg-maroon-50 text-maroon-700 flex items-center justify-center"><Clock size={20} /></div><div><h3 className="font-serif font-bold text-maroon-900">Business Hours</h3><p className="text-sm text-brown-700 whitespace-pre-line">{settings.businessHours}</p></div></div>
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="btn-whatsapp w-full"><MessageCircle size={20} /> Chat on WhatsApp</a>
            </>
          )}
        </div>
        <div className="card p-6">
          <h2 className="text-lg font-serif font-bold text-maroon-900 mb-4">Send a Message</h2>
          {sent && <p className="text-sm text-green-700 bg-green-50 rounded p-3 mb-4">Opening WhatsApp with your message...</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className="label">Your Name</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="input-field" /></div>
            <div><label className="label">Email</label><input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field" /></div>
            <div><label className="label">Message</label><textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={5} required className="input-field" /></div>
            <button type="submit" className="btn-primary w-full"><Send size={16} /> Send via WhatsApp</button>
          </form>
        </div>
      </div>
    </div>
  );
}
