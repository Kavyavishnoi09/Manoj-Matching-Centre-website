import type { Response } from 'express';
import { Category } from '../models/Category.js';
import { badRequest, notFound } from '../utils/errors.js';
import { createUniqueSlug } from '../utils/slug.js';
import type { AuthRequest } from '../middleware/auth.js';

export async function getCategories(_req: AuthRequest, res: Response) {
  const { active } = reqQuery(_req);
  const query: Record<string, unknown> = {};
  if (active !== undefined) query.active = active === 'true';

  const categories = await Category.find(query).sort({ name: 1 });
  res.json({ success: true, data: categories });
}

function reqQuery(req: AuthRequest): Record<string, string> {
  return req.query as unknown as Record<string, string>;
}

export async function getCategoryById(req: AuthRequest, res: Response) {
  const { id } = req.params;
  let category;

  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    category = await Category.findById(id);
  } else {
    category = await Category.findOne({ slug: id });
  }

  if (!category) {
    throw notFound('Category not found');
  }

  res.json({ success: true, data: category });
}

export async function createCategory(req: AuthRequest, res: Response) {
  const { name, description, image, active } = req.body;

  if (!name) {
    throw badRequest('Category name is required');
  }

  const existingSlugs = (await Category.find({}, 'slug')).map((c) => c.slug);
  const slug = createUniqueSlug(name, existingSlugs);

  const category = await Category.create({
    name,
    slug,
    description: description || '',
    image: image || '',
    active: active !== undefined ? active : true,
  });

  res.status(201).json({ success: true, data: category });
}

export async function updateCategory(req: AuthRequest, res: Response) {
  const { id } = req.params;
  const updates = { ...req.body };

  if (updates.name) {
    const existingSlugs = (await Category.find({ _id: { $ne: id } }, 'slug')).map((c) => c.slug);
    updates.slug = createUniqueSlug(updates.name, existingSlugs);
  }

  const category = await Category.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
  if (!category) {
    throw notFound('Category not found');
  }

  res.json({ success: true, data: category });
}

export async function deleteCategory(req: AuthRequest, res: Response) {
  const { id } = req.params;
  const category = await Category.findByIdAndDelete(id);
  if (!category) {
    throw notFound('Category not found');
  }
  res.json({ success: true, message: 'Category deleted successfully' });
}
