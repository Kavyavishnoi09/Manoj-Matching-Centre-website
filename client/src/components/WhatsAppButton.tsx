import { MessageCircle } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';
import { buildWhatsAppLink } from '@/utils/helpers';

export default function WhatsAppButton() {
  const { settings } = useSettings();
  if (!settings) return null;
  const link = buildWhatsAppLink(settings.whatsapp, 'Hello, I would like to know more about the products available at Manoj Matching Centre.');
  return (
    <a href={link} target="_blank" rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-40 flex items-center justify-center w-14 h-14 rounded-full bg-green-600 text-white shadow-lg hover:bg-green-700 hover:shadow-xl transition-all hover:scale-110 active:scale-95"
      aria-label="Chat on WhatsApp">
      <MessageCircle size={28} />
      <span className="absolute inset-0 rounded-full bg-green-600 animate-ping opacity-20" />
    </a>
  );
}
