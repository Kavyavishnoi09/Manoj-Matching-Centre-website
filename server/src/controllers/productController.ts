import type { Response } from 'express';
import { Product } from '../models/Product.js';
import { Category } from '../models/Category.js';
import { badRequest, notFound } from '../utils/errors.js';
import { createUniqueSlug } from '../utils/slug.js';
import type { AuthRequest } from '../middleware/auth.js';

export async function getProducts(req: AuthRequest, res: Response) {
  const {
    category,
    search,
    fabricType,
    color,
    minPrice,
    maxPrice,
    inStock,
    sort,
    page = '1',
    limit = '24',
  } = req.query;

  const query: Record<string, unknown> = { active: true };

  if (category) {
    const cat = await Category.findOne({ slug: category });
    if (cat) query.category = cat._id;
  }

  if (search) {
    query.$text = { $search: search as string };
  }

  if (fabricType) {
    query.fabricType = { $regex: fabricType as string, $options: 'i' };
  }

  if (color) {
    query.colors = { $in: [new RegExp(color as string, 'i')] };
  }

  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) (query.price as Record<string, number>).$gte = Number(minPrice);
    if (maxPrice) (query.price as Record<string, number>).$lte = Number(maxPrice);
  }

  if (inStock === 'true') {
    query.stock = { $gt: 0 };
  }

  const pageNum = Math.max(1, parseInt(page as string, 10));
  const limitNum = Math.min(100, parseInt(limit as string, 10));

  let sortOption: Record<string, 1 | -1> = { createdAt: -1 };
  switch (sort) {
    case 'price_low':
      sortOption = { price: 1 };
      break;
    case 'price_high':
      sortOption = { price: -1 };
      break;
    case 'popular':
      sortOption = { popularity: -1 };
      break;
  }

  const [products, total] = await Promise.all([
    Product.find(query)
      .populate('category', 'name slug')
      .sort(sortOption)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Product.countDocuments(query),
  ]);

  res.json({
    success: true,
    data: products,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum),
    },
  });
}

export async function getProductById(req: AuthRequest, res: Response) {
  const { id } = req.params;
  let product;

  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    product = await Product.findById(id).populate('category', 'name slug');
  } else {
    product = await Product.findOne({ slug: id }).populate('category', 'name slug');
  }

  if (!product) {
    throw notFound('Product not found');
  }

  await Product.findByIdAndUpdate(product._id, { $inc: { popularity: 1 } });

  res.json({ success: true, data: product });
}

export async function createProduct(req: AuthRequest, res: Response) {
  const {
    name, category, description, fabricType, material, colors,
    pattern, width, price, discountPrice, stock, stockStatus,
    images, featured, newArrival, active,
  } = req.body;

  if (!name || price === undefined) {
    throw badRequest('Product name and price are required');
  }

  const existingSlugs = (await Product.find({}, 'slug')).map((p) => p.slug);
  const slug = createUniqueSlug(name, existingSlugs);

  let categoryId = null;
  if (category) {
    const cat = await Category.findById(category);
    if (cat) categoryId = cat._id;
  }

  const product = await Product.create({
    name,
    slug,
    category: categoryId,
    description: description || '',
    fabricType: fabricType || '',
    material: material || '',
    colors: colors || [],
    pattern: pattern || '',
    width: width || '',
    price,
    discountPrice: discountPrice || null,
    stock: stock ?? 0,
    stockStatus: stockStatus || 'in_stock',
    images: images || [],
    featured: featured || false,
    newArrival: newArrival || false,
    active: active !== undefined ? active : true,
  });

  res.status(201).json({ success: true, data: product });
}

export async function updateProduct(req: AuthRequest, res: Response) {
  const { id } = req.params;
  const updates = { ...req.body };

  if (updates.name) {
    const existingSlugs = (await Product.find({ _id: { $ne: id } }, 'slug')).map((p) => p.slug);
    updates.slug = createUniqueSlug(updates.name, existingSlugs);
  }

  if (updates.category) {
    const cat = await Category.findById(updates.category);
    if (cat) updates.category = cat._id;
  }

  const product = await Product.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
  if (!product) {
    throw notFound('Product not found');
  }

  res.json({ success: true, data: product });
}

export async function deleteProduct(req: AuthRequest, res: Response) {
  const { id } = req.params;
  const product = await Product.findByIdAndDelete(id);
  if (!product) {
    throw notFound('Product not found');
  }
  res.json({ success: true, message: 'Product deleted successfully' });
}

export async function getFeaturedProducts(_req: AuthRequest, res: Response) {
  const products = await Product.find({ active: true, featured: true })
    .populate('category', 'name slug')
    .sort({ createdAt: -1 })
    .limit(8);
  res.json({ success: true, data: products });
}

export async function getNewArrivals(_req: AuthRequest, res: Response) {
  const products = await Product.find({ active: true, newArrival: true })
    .populate('category', 'name slug')
    .sort({ createdAt: -1 })
    .limit(8);
  res.json({ success: true, data: products });
}

export async function getPopularProducts(_req: AuthRequest, res: Response) {
  const products = await Product.find({ active: true })
    .populate('category', 'name slug')
    .sort({ popularity: -1 })
    .limit(4);
  res.json({ success: true, data: products });
}
