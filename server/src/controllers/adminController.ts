import type { Response } from 'express';
import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { User } from '../models/User.js';
import { notFound, badRequest } from '../utils/errors.js';
import type { AuthRequest } from '../middleware/auth.js';

export async function getStats(_req: AuthRequest, res: Response) {
  const [
    totalProducts,
    totalCustomers,
    totalOrders,
    pendingOrders,
    confirmedOrders,
    processingOrders,
    shippedOrders,
    deliveredOrders,
    cancelledOrders,
    salesAgg,
  ] = await Promise.all([
    Product.countDocuments(),
    User.countDocuments({ role: 'customer' }),
    Order.countDocuments(),
    Order.countDocuments({ orderStatus: 'pending' }),
    Order.countDocuments({ orderStatus: 'confirmed' }),
    Order.countDocuments({ orderStatus: 'processing' }),
    Order.countDocuments({ orderStatus: 'shipped' }),
    Order.countDocuments({ orderStatus: 'delivered' }),
    Order.countDocuments({ orderStatus: 'cancelled' }),
    Order.aggregate([
      { $match: { orderStatus: { $ne: 'cancelled' } } },
      { $group: { _id: null, totalSales: { $sum: '$total' } } },
    ]),
  ]);

  res.json({
    success: true,
    data: {
      totalProducts,
      totalCustomers,
      totalOrders,
      pendingOrders,
      confirmedOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      totalSales: salesAgg[0]?.totalSales || 0,
    },
  });
}

export async function getAllOrders(req: AuthRequest, res: Response) {
  const { status, search, page = '1', limit = '20' } = req.query;

  const query: Record<string, unknown> = {};
  if (status) query.orderStatus = status;
  if (search) {
    query.$or = [
      { orderNumber: { $regex: search as string, $options: 'i' } },
      { 'shippingAddress.name': { $regex: search as string, $options: 'i' } },
      { 'shippingAddress.phone': { $regex: search as string, $options: 'i' } },
    ];
  }

  const pageNum = Math.max(1, parseInt(page as string, 10));
  const limitNum = Math.min(100, parseInt(limit as string, 10));

  const [orders, total] = await Promise.all([
    Order.find(query)
      .populate('customer', 'name email phone')
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Order.countDocuments(query),
  ]);

  res.json({
    success: true,
    data: orders,
    pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) },
  });
}

export async function getAdminOrderById(req: AuthRequest, res: Response) {
  const { id } = req.params;
  const order = await Order.findById(id).populate('customer', 'name email phone address city state pincode');
  if (!order) {
    throw notFound('Order not found');
  }
  res.json({ success: true, data: order });
}

export async function updateOrderStatus(req: AuthRequest, res: Response) {
  const { id } = req.params;
  const { orderStatus } = req.body;

  const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
  if (!validStatuses.includes(orderStatus)) {
    throw badRequest('Invalid order status');
  }

  const order = await Order.findById(id);
  if (!order) {
    throw notFound('Order not found');
  }

  if (orderStatus === 'cancelled' && order.orderStatus !== 'cancelled') {
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } });
    }
  }

  order.orderStatus = orderStatus;
  if (orderStatus === 'delivered' && order.paymentMethod === 'cod') {
    order.paymentStatus = 'paid';
  }
  await order.save();

  res.json({ success: true, data: order });
}

export async function getCustomers(req: AuthRequest, res: Response) {
  const { search, page = '1', limit = '20' } = req.query;

  const query: Record<string, unknown> = { role: 'customer' };
  if (search) {
    query.$or = [
      { name: { $regex: search as string, $options: 'i' } },
      { email: { $regex: search as string, $options: 'i' } },
      { phone: { $regex: search as string, $options: 'i' } },
    ];
  }

  const pageNum = Math.max(1, parseInt(page as string, 10));
  const limitNum = Math.min(100, parseInt(limit as string, 10));

  const [customers, total] = await Promise.all([
    User.find(query).select('-password').sort({ createdAt: -1 }).skip((pageNum - 1) * limitNum).limit(limitNum),
    User.countDocuments(query),
  ]);

  res.json({
    success: true,
    data: customers,
    pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) },
  });
}

export async function getCustomerById(req: AuthRequest, res: Response) {
  const { id } = req.params;
  const customer = await User.findById(id).select('-password');
  if (!customer) {
    throw notFound('Customer not found');
  }

  const orders = await Order.find({ customer: id }).sort({ createdAt: -1 });

  res.json({ success: true, data: { customer, orders } });
}

export async function toggleCustomerActive(req: AuthRequest, res: Response) {
  const { id } = req.params;
  const customer = await User.findById(id);
  if (!customer) {
    throw notFound('Customer not found');
  }

  customer.active = !customer.active;
  await customer.save();

  res.json({ success: true, data: { id: customer._id, active: customer.active } });
}

export async function getAdminProducts(_req: AuthRequest, res: Response) {
  const products = await Product.find().populate('category', 'name slug').sort({ createdAt: -1 });
  res.json({ success: true, data: products });
}
