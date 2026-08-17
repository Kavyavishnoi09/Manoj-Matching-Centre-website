import { connectDB, disconnectDB } from './config/db.js';
import { User } from './models/User.js';
import { Category } from './models/Category.js';
import { Product } from './models/Product.js';
import { BusinessSettings } from './models/BusinessSettings.js';
import { createUniqueSlug } from './utils/slug.js';

async function seed() {
  await connectDB();

  console.log('Seeding database...');

  // Admin user
  const adminEmail = 'admin@manojmatchingcentre.com';
  let admin = await User.findOne({ email: adminEmail });
  if (!admin) {
    admin = await User.create({
      name: 'Admin',
      email: adminEmail,
      password: 'MmcAdmin#2026!',
      role: 'admin',
      phone: '919876543210',
    });
    console.log('Admin user created: admin@manojmatchingcentre.com / MmcAdmin#2026!');
  } else {
    console.log('Admin user already exists');
  }

  // Business Settings
  let settings = await BusinessSettings.findOne();
  if (!settings) {
    settings = await BusinessSettings.create({
      businessName: 'Manoj Matching Centre',
      phone: '+919876543210',
      whatsapp: '919876543210',
      email: 'info@manojmatchingcentre.com',
      address: 'Main Market Road, Banaras, Uttar Pradesh, India',
      mapUrl: 'https://maps.google.com',
      instagram: 'https://instagram.com',
      facebook: 'https://facebook.com',
      businessHours: 'Mon - Sat: 9:00 AM - 8:00 PM, Sunday: 10:00 AM - 6:00 PM',
      aboutText: 'Manoj Matching Centre is a trusted retail cloth and fabric store offering premium Banarasi fabrics, brocade, fancy dupattas, cotton printed fabrics and more. With years of experience in the textile industry, we pride ourselves on quality fabric selection, the latest designs, and affordable retail prices for every occasion.',
      deliveryCharge: 50,
      freeDeliveryThreshold: 1000,
    });
    console.log('Business settings created');
  } else {
    console.log('Business settings already exist');
  }

  // Categories
  const categoryData = [
    { name: 'Banarasi Brocade', description: 'Rich, handwoven Banarasi brocade fabrics with intricate gold and silver zari work.' },
    { name: 'Banarasi Fabric', description: 'Premium Banarasi fabrics known for their luxurious texture and traditional motifs.' },
    { name: 'Brocade', description: 'A variety of elegant brocade fabrics featuring ornate patterns and designs.' },
    { name: 'Fancy Dupatta', description: 'Beautiful fancy dupattas to complement any outfit for every occasion.' },
    { name: 'Cotton Printed Fabric', description: 'Comfortable and stylish cotton printed fabrics in a range of prints and colors.' },
    { name: 'Poplin', description: 'Smooth, durable poplin fabrics ideal for shirts, dresses, and everyday wear.' },
    { name: 'Lining', description: 'Quality lining fabrics to give your garments a finished, professional look.' },
    { name: 'Dress Material', description: 'Unstitched dress materials in a variety of patterns, colors, and fabrics.' },
    { name: 'Other Fabrics', description: 'A curated selection of other matching fabrics and textiles.' },
  ];

  const categories: Record<string, string> = {};
  for (const cat of categoryData) {
    let existing = await Category.findOne({ name: cat.name });
    if (!existing) {
      const existingSlugs = (await Category.find({}, 'slug')).map((c) => c.slug);
      const slug = createUniqueSlug(cat.name, existingSlugs);
      existing = await Category.create({ ...cat, slug, active: true });
      console.log(`Category created: ${cat.name}`);
    }
    categories[cat.name] = existing._id.toString();
  }

  // Sample products
  const productData = [
    {
      name: 'Royal Gold Banarasi Brocade',
      categoryName: 'Banarasi Brocade',
      description: 'Exquisite handwoven Banarasi brocade with intricate gold zari work. Perfect for bridal wear and special occasions.',
      fabricType: 'Banarasi Brocade', material: 'Pure Silk', colors: ['Gold', 'Red'], pattern: 'Floral Zari', width: '44 inch',
      price: 2500, discountPrice: 2200, stock: 15, stockStatus: 'in_stock',
      images: [{ url: 'https://images.pexels.com/photos/20181020/pexels-photo-20181020.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', publicId: 'seed-1' }],
      featured: true, newArrival: true, popularity: 45,
    },
    {
      name: 'Crimson Banarasi Brocade Silk',
      categoryName: 'Banarasi Brocade',
      description: 'Rich crimson Banarasi brocade with traditional motifs and gold thread work. A timeless classic.',
      fabricType: 'Banarasi Brocade', material: 'Pure Silk', colors: ['Red', 'Gold'], pattern: 'Traditional Motif', width: '44 inch',
      price: 2800, discountPrice: null, stock: 8, stockStatus: 'in_stock',
      images: [{ url: 'https://images.pexels.com/photos/13049903/pexels-photo-13049903.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', publicId: 'seed-2' }],
      featured: true, newArrival: false, popularity: 32,
    },
    {
      name: 'Blue Banarasi Silk Fabric',
      categoryName: 'Banarasi Fabric',
      description: 'Stunning blue Banarasi silk fabric with intricate golden patterns. Ideal for sarees and lehengas.',
      fabricType: 'Banarasi Silk', material: 'Pure Silk', colors: ['Blue', 'Gold'], pattern: 'Golden Pattern', width: '45 inch',
      price: 3200, discountPrice: 2800, stock: 12, stockStatus: 'in_stock',
      images: [{ url: 'https://images.pexels.com/photos/38890438/pexels-photo-38890438.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', publicId: 'seed-3' }],
      featured: true, newArrival: true, popularity: 58,
    },
    {
      name: 'Traditional Banarasi Silk Saree Fabric',
      categoryName: 'Banarasi Fabric',
      description: 'Premium Banarasi silk fabric with classic paisley patterns in golden zari. A wardrobe essential.',
      fabricType: 'Banarasi Silk', material: 'Pure Silk', colors: ['Red', 'Gold'], pattern: 'Paisley', width: '45 inch',
      price: 3500, discountPrice: null, stock: 5, stockStatus: 'in_stock',
      images: [{ url: 'https://images.pexels.com/photos/6167463/pexels-photo-6167463.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', publicId: 'seed-4' }],
      featured: false, newArrival: true, popularity: 20,
    },
    {
      name: 'Gold & Silver Brocade Fabric',
      categoryName: 'Brocade',
      description: 'Luxurious brocade fabric with intricate gold and silver thread work. Perfect for ethnic wear and upholstery.',
      fabricType: 'Brocade', material: 'Silk Blend', colors: ['Gold', 'Silver'], pattern: 'Floral', width: '44 inch',
      price: 1800, discountPrice: 1500, stock: 20, stockStatus: 'in_stock',
      images: [{ url: 'https://images.pexels.com/photos/7232843/pexels-photo-7232843.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', publicId: 'seed-5' }],
      featured: true, newArrival: false, popularity: 40,
    },
    {
      name: 'Ornate Floral Brocade',
      categoryName: 'Brocade',
      description: 'Beautiful ornate floral brocade with vintage-inspired patterns. Great for couture and decorative use.',
      fabricType: 'Brocade', material: 'Polyester Blend', colors: ['Multi'], pattern: 'Floral Vintage', width: '44 inch',
      price: 1200, discountPrice: null, stock: 0, stockStatus: 'out_of_stock',
      images: [{ url: 'https://images.pexels.com/photos/3339215/pexels-photo-3339215.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', publicId: 'seed-6' }],
      featured: false, newArrival: false, popularity: 15,
    },
    {
      name: 'Embroidered Fancy Dupatta - Pink',
      categoryName: 'Fancy Dupatta',
      description: 'Stunning pink embroidered fancy dupatta with intricate Indian designs. Perfect for festive occasions.',
      fabricType: 'Dupatta', material: 'Net', colors: ['Pink'], pattern: 'Embroidered', width: '2.5 meter',
      price: 800, discountPrice: 650, stock: 25, stockStatus: 'in_stock',
      images: [{ url: 'https://images.pexels.com/photos/30541606/pexels-photo-30541606.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', publicId: 'seed-7' }],
      featured: true, newArrival: true, popularity: 50,
    },
    {
      name: 'Designer Fancy Dupatta - Multi',
      categoryName: 'Fancy Dupatta',
      description: 'Colorful designer fancy dupatta with traditional embroidery work. Adds elegance to any outfit.',
      fabricType: 'Dupatta', material: 'Chiffon', colors: ['Multi', 'Pink'], pattern: 'Embroidered', width: '2.5 meter',
      price: 950, discountPrice: null, stock: 18, stockStatus: 'in_stock',
      images: [{ url: 'https://images.pexels.com/photos/4566670/pexels-photo-4566670.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', publicId: 'seed-8' }],
      featured: false, newArrival: true, popularity: 28,
    },
    {
      name: 'Cotton Printed Fabric - Floral Blue',
      categoryName: 'Cotton Printed Fabric',
      description: 'Comfortable cotton printed fabric with beautiful floral patterns in blue. Ideal for daily wear dresses and kurtis.',
      fabricType: 'Cotton', material: 'Pure Cotton', colors: ['Blue', 'White'], pattern: 'Floral Print', width: '44 inch',
      price: 450, discountPrice: 380, stock: 50, stockStatus: 'in_stock',
      images: [{ url: 'https://images.pexels.com/photos/6292/blue-pattern-texture-macro.jpg?auto=compress&cs=tinysrgb&h=650&w=940', publicId: 'seed-9' }],
      featured: true, newArrival: false, popularity: 65,
    },
    {
      name: 'Cotton Printed Fabric - Geometric',
      categoryName: 'Cotton Printed Fabric',
      description: 'Stylish cotton printed fabric with geometric patterns. Soft, breathable, and perfect for summer wear.',
      fabricType: 'Cotton', material: 'Pure Cotton', colors: ['Blue', 'White'], pattern: 'Geometric', width: '44 inch',
      price: 420, discountPrice: null, stock: 40, stockStatus: 'in_stock',
      images: [{ url: 'https://images.pexels.com/photos/7867295/pexels-photo-7867295.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', publicId: 'seed-10' }],
      featured: false, newArrival: true, popularity: 30,
    },
    {
      name: 'Premium Poplin Fabric - Blue Stripes',
      categoryName: 'Poplin',
      description: 'High-quality poplin fabric with blue stripe pattern. Smooth, durable, and perfect for shirts and dresses.',
      fabricType: 'Poplin', material: 'Cotton Blend', colors: ['Blue', 'White'], pattern: 'Striped', width: '58 inch',
      price: 350, discountPrice: 290, stock: 60, stockStatus: 'in_stock',
      images: [{ url: 'https://images.pexels.com/photos/13368318/pexels-photo-13368318.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', publicId: 'seed-11' }],
      featured: true, newArrival: false, popularity: 38,
    },
    {
      name: 'Poplin Fabric - Beige Solid',
      categoryName: 'Poplin',
      description: 'Versatile beige poplin fabric. Smooth texture, ideal for shirts, dresses, and everyday tailoring.',
      fabricType: 'Poplin', material: 'Cotton Blend', colors: ['Beige'], pattern: 'Solid', width: '58 inch',
      price: 300, discountPrice: null, stock: 80, stockStatus: 'in_stock',
      images: [{ url: 'https://images.pexels.com/photos/36013228/pexels-photo-36013228.png?auto=compress&cs=tinysrgb&h=650&w=940', publicId: 'seed-12' }],
      featured: false, newArrival: false, popularity: 22,
    },
    {
      name: 'Premium Lining Fabric - Satin',
      categoryName: 'Lining',
      description: 'High-quality satin lining fabric for a smooth, professional finish inside garments.',
      fabricType: 'Lining', material: 'Polyester', colors: ['Beige'], pattern: 'Solid', width: '58 inch',
      price: 150, discountPrice: 120, stock: 100, stockStatus: 'in_stock',
      images: [{ url: 'https://images.pexels.com/photos/36013228/pexels-photo-36013228.png?auto=compress&cs=tinysrgb&h=650&w=940', publicId: 'seed-13' }],
      featured: false, newArrival: false, popularity: 12,
    },
    {
      name: 'Embroidered Dress Material - Pink',
      categoryName: 'Dress Material',
      description: 'Beautiful unstitched embroidered dress material set. Includes top, bottom, and dupatta fabric.',
      fabricType: 'Dress Material', material: 'Cotton Blend', colors: ['Pink'], pattern: 'Embroidered', width: 'Unstitched',
      price: 1200, discountPrice: 980, stock: 30, stockStatus: 'in_stock',
      images: [{ url: 'https://images.pexels.com/photos/30541606/pexels-photo-30541606.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', publicId: 'seed-14' }],
      featured: true, newArrival: true, popularity: 42,
    },
    {
      name: 'Geometric Dress Material Set',
      categoryName: 'Dress Material',
      description: 'Stylish unstitched dress material with geometric printed patterns. Perfect for casual and semi-formal wear.',
      fabricType: 'Dress Material', material: 'Rayon', colors: ['Multi'], pattern: 'Geometric Print', width: 'Unstitched',
      price: 850, discountPrice: null, stock: 25, stockStatus: 'in_stock',
      images: [{ url: 'https://images.pexels.com/photos/15949827/pexels-photo-15949827.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', publicId: 'seed-15' }],
      featured: false, newArrival: true, popularity: 18,
    },
    {
      name: 'Traditional Red Fabric with Oriental Pattern',
      categoryName: 'Other Fabrics',
      description: 'Vibrant red fabric with authentic oriental ornaments and floral patterns. Great for ethnic wear and decor.',
      fabricType: 'Mixed', material: 'Cotton Blend', colors: ['Red'], pattern: 'Oriental Floral', width: '44 inch',
      price: 700, discountPrice: 550, stock: 35, stockStatus: 'in_stock',
      images: [{ url: 'https://images.pexels.com/photos/6045294/pexels-photo-6045294.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', publicId: 'seed-16' }],
      featured: true, newArrival: false, popularity: 35,
    },
    {
      name: 'Colorful Textile Roll - Mixed Patterns',
      categoryName: 'Other Fabrics',
      description: 'Vibrant assorted fabric rolls with mixed traditional patterns. Great for quilting, crafts, and ethnic tailoring.',
      fabricType: 'Mixed', material: 'Cotton Blend', colors: ['Pink', 'Yellow', 'Blue'], pattern: 'Mixed Patterns', width: '44 inch',
      price: 600, discountPrice: null, stock: 45, stockStatus: 'in_stock',
      images: [{ url: 'https://images.pexels.com/photos/36516572/pexels-photo-36516572.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', publicId: 'seed-17' }],
      featured: false, newArrival: false, popularity: 25,
    },
    {
      name: 'Silk Fabric Roll - Traditional Patterns',
      categoryName: 'Other Fabrics',
      description: 'Premium silk fabric rolls showcasing traditional Indian patterns. Ideal for sarees, lehengas, and ethnic wear.',
      fabricType: 'Silk', material: 'Pure Silk', colors: ['Multi'], pattern: 'Traditional', width: '45 inch',
      price: 2000, discountPrice: 1700, stock: 10, stockStatus: 'in_stock',
      images: [{ url: 'https://images.pexels.com/photos/10317127/pexels-photo-10317127.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', publicId: 'seed-18' }],
      featured: true, newArrival: true, popularity: 48,
    },
  ];

  for (const p of productData) {
    const existing = await Product.findOne({ name: p.name });
    if (!existing) {
      const existingSlugs = (await Product.find({}, 'slug')).map((pr) => pr.slug);
      const slug = createUniqueSlug(p.name, existingSlugs);
      await Product.create({
        ...p,
        slug,
        category: categories[p.categoryName] || null,
        active: true,
      });
      console.log(`Product created: ${p.name}`);
    }
  }

  console.log('Seeding complete!');
  await disconnectDB();
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
