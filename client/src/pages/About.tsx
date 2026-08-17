import { useSettings } from '@/context/SettingsContext';
import { useSEO } from '@/hooks/useSEO';
import { Award, Sparkles, Users, ShieldCheck } from 'lucide-react';

export default function About() {
  const { settings } = useSettings();
  useSEO({ title: 'About Us', description: settings?.aboutText?.slice(0, 160) });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-maroon-900">About {settings?.businessName || 'Manoj Matching Centre'}</h1>
        <p className="text-gold-700 mt-2 font-medium">Premium Fabrics & Textiles</p>
      </div>
      <div className="card p-6 md:p-10 mb-8">
        <p className="text-brown-700 leading-relaxed text-lg">{settings?.aboutText || 'Welcome to Manoj Matching Centre, your trusted destination for premium fabrics and textiles. We offer a wide range of Banarasi brocade, Banarasi fabrics, brocade, fancy dupattas, cotton printed fabrics, poplin, lining fabrics, dress materials, and other matching fabrics. Our commitment to quality and customer satisfaction has made us a preferred choice for fabric enthusiasts.'}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {[{ icon: Award, title: 'Premium Quality', desc: 'We source only the finest fabrics, ensuring every product meets our high standards.' },
          { icon: Sparkles, title: 'Wide Variety', desc: 'From Banarasi brocade to cotton prints, we have fabrics for every occasion.' },
          { icon: Users, title: 'Customer First', desc: 'Our customers are at the heart of everything we do. We strive to provide the best service.' },
          { icon: ShieldCheck, title: 'Trusted Store', desc: 'Years of experience serving our community with quality fabrics at fair prices.' },
        ].map((item, i) => (
          <div key={i} className="card p-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-maroon-50 text-maroon-700 mb-4"><item.icon size={24} /></div>
            <h3 className="text-lg font-serif font-bold text-maroon-900 mb-2">{item.title}</h3>
            <p className="text-sm text-brown-700">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
