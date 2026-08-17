import type { Response } from 'express';
import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { BusinessSettings } from '../models/BusinessSettings.js';
import { badRequest, notFound, unauthorized } from '../utils/errors.js';
import { generateOrderNumber } from '../utils/jwt.js';
import type { AuthRequest } from '../middleware/auth.js';

export async function createOrder(req: AuthRequest, res: Response) {
  if (!req.user) throw unauthorized();

  const { items, shippingAddress, paymentMethod } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    throw badRequest('Order must contain at least one item');
  }

  if (!shippingAddress || !shippingAddress.name || !shippingAddress.phone || !shippingAddress.address || !shippingAddress.city || !shippingAddress.state || !shippingAddress.pincode) {
    throw badRequest('Complete shipping address is required');
  }

  const settings = await BusinessSettings.findOne();
  const deliveryChargeDefault = settings?.deliveryCharge ?? 50;
  const freeDeliveryThreshold = settings?.freeDeliveryThreshold ?? 1000;

  let subtotal = 0;
  const orderItems: Array<{
    product: typeof Product.prototype._id;
    productName: string;
    image: string;
    price: number;
    quantity: number;
  }> = [];

  for (const item of items) {
    const product = await Product.findById(item.productId);
    if (!product) {
      throw badRequest(`Product not found: ${item.productId}`);
    }
    if (!product.active) {
      throw badRequest(`Product is not available: ${product.name}`);
    }
    if (product.stock < item.quantity) {
      throw badRequest(`Insufficient stock for ${product.name}. Available: ${product.stock}`);
    }

    const price = product.discountPrice && product.discountPrice < product.price ? product.discountPrice : product.price;
    subtotal += price * item.quantity;

    orderItems.push({
      product: product._id,
      productName: product.name,
      image: product.images[0]?.url || '',
      price,
      quantity: item.quantity,
    });
  }

  const deliveryCharge = subtotal >= freeDeliveryThreshold ? 0 : deliveryChargeDefault;
  const total = subtotal + deliveryCharge;

  const orderCount = await Order.countDocuments();
  const orderNumber = generateOrderNumber(orderCount + 1);

  const order = await Order.create({
    orderNumber,
    customer: req.user.id,
    items: orderItems,
    subtotal,
    deliveryCharge,
    total,
    shippingAddress,
    paymentMethod: paymentMethod || 'cod',
    paymentStatus: 'pending',
    orderStatus: 'pending',
  });

  for (const item of orderItems) {
    await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
  }

  res.status(201).json({ success: true, data: order });
}

export async function getMyOrders(req: AuthRequest, res: Response) {
  if (!req.user) throw unauthorized();

  const orders = await Order.find({ customer: req.user.id })
    .sort({ createdAt: -1 });
  res.json({ success: true, data: orders });
}

export async function getOrderById(req: AuthRequest, res: Response) {
  if (!req.user) throw unauthorized();

  const { id } = req.params;
  const order = await Order.findById(id);
  if (!order) {
    throw notFound('Order not found');
  }

  if (order.customer.toString() !== req.user.id && req.user.role !== 'admin') {
    throw unauthorized('You do not have access to this order');
  }

  res.json({ success: true, data: order });
}

export async function cancelOrder(req: AuthRequest, res: Response) {
  if (!req.user) throw unauthorized();

  const { id } = req.params;
  const order = await Order.findById(id);
  if (!order) {
    throw notFound('Order not found');
  }

  if (order.customer.toString() !== req.user.id) {
    throw unauthorized('You can only cancel your own orders');
  }

  if (order.orderStatus !== 'pending') {
    throw badRequest('Only pending orders can be cancelled');
  }

  order.orderStatus = 'cancelled';
  await order.save();

  for (const item of order.items) {
    await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } });
  }

  res.json({ success: true, data: order, message: 'Order cancelled successfully' });
}
