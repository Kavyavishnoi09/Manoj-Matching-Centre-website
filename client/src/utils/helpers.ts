export function formatPrice(price: number): string {
  return `₹${Math.round(price).toLocaleString('en-IN')}`;
}

export function getEffectivePrice(price: number, discountPrice: number | null): number {
  return discountPrice && discountPrice > 0 && discountPrice < price ? discountPrice : price;
}

export function getDiscountPercent(price: number, discountPrice: number | null): number {
  if (!discountPrice || discountPrice >= price) return 0;
  return Math.round(((price - discountPrice) / price) * 100);
}

export function getProductImageUrl(images: { url: string }[], fallback = ''): string {
  if (images && images.length > 0 && images[0].url) return images[0].url;
  return fallback;
}

export function buildWhatsAppLink(number: string, message: string): string {
  const clean = number.replace(/[^0-9]/g, '');
  return `https://wa.me/${clean}?text=${encodeURIComponent(message)}`;
}

export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: 'Pending', confirmed: 'Confirmed', processing: 'Processing',
  shipped: 'Shipped', delivered: 'Delivered', cancelled: 'Cancelled',
};

export const ORDER_STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-800 border-amber-200',
  confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
  processing: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  shipped: 'bg-purple-100 text-purple-800 border-purple-200',
  delivered: 'bg-green-100 text-green-800 border-green-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
};

export const ORDER_STATUS_FLOW = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

export function cn(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
