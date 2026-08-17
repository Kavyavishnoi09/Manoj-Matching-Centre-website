import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  type?: string;
}

export function useSEO({ title, description, image, type = 'website' }: SEOProps) {
  useEffect(() => {
    const fullTitle = title
      ? `${title} | Manoj Matching Centre`
      : 'Manoj Matching Centre | Premium Banarasi Fabrics & Brocade';
    const desc = description ||
      'Explore premium Banarasi fabrics, brocade, fancy dupattas, cotton printed fabrics, poplin and more at Manoj Matching Centre.';

    document.title = fullTitle;

    const setMeta = (attr: string, key: string, content: string) => {
      let el = document.head.querySelector(`meta[${attr}="${key}"]`);
      if (!el) { el = document.createElement('meta'); el.setAttribute(attr, key); document.head.appendChild(el); }
      el.setAttribute('content', content);
    };

    setMeta('name', 'description', desc);
    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', desc);
    setMeta('property', 'og:type', type);
    setMeta('property', 'og:site_name', 'Manoj Matching Centre');
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', fullTitle);
    setMeta('name', 'twitter:description', desc);
    if (image) { setMeta('property', 'og:image', image); setMeta('name', 'twitter:image', image); }
  }, [title, description, image, type]);
}
