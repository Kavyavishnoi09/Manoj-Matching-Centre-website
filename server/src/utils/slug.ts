import slugify from 'slugify';

export function createSlug(text: string): string {
  return slugify(text, { lower: true, strict: true });
}

export function createUniqueSlug(text: string, existing?: string[]): string {
  const base = createSlug(text);
  if (!existing || !existing.includes(base)) return base;
  let i = 1;
  let slug = `${base}-${i}`;
  while (existing.includes(slug)) {
    i++;
    slug = `${base}-${i}`;
  }
  return slug;
}
