
# Manoj Matching Centre


A modern full-stack e-commerce website for **Manoj Matching Centre**, a retail textile business offering a wide range of traditional, fashionable, and everyday fabrics.


The platform allows customers to browse products, view product details, add items to their cart, place orders, and track their order status. A dedicated Admin Portal allows the business owner to manage products, categories, customers, and orders.


---


## 🛍️ About Manoj Matching Centre


**Manoj Matching Centre** is a retail textile store focused on providing quality fabrics and fashion materials to customers.


The online store is designed to bring the physical shopping experience online, making it easier for customers to explore available fabrics and place orders from anywhere.


### Product Categories


- Banarasi Brocade
- Fancy Dupattas
- Cotton Printed Fabrics
- Lining Fabrics
- Traditional Indian Fabrics
- Fashion Fabrics
- Dress Materials
- Other Textile Products


---


## ✨ Features


### 👤 Customer Features


- Customer registration and login
- Secure JWT authentication
- Browse all products
- Search products
- Filter products by category
- View detailed product information
- Product image gallery
- Add products to cart
- Update cart quantity
- Remove products from cart
- Wishlist functionality
- Checkout
- Place orders
- View order history
- View individual order details
- Track order status
- Manage customer profile
- Contact the business through WhatsApp
- Responsive design for desktop and mobile devices


---


## 🔐 Admin Portal


The website includes a dedicated Admin Portal for managing the complete online store.


### Admin Features


- Secure admin login
- Admin dashboard
- Product management
- Add products
- Edit products
- Delete products
- Upload product images
- Manage product categories
- View registered customers
- View all customer orders
- View individual order details
- Update order status
- Manage business settings
- Manage store information


---


## 📦 Order Management


Customers can place orders through the website.


The Admin can manage the order lifecycle from the Admin Portal.


### Order Status


```text
Pending
   ↓
Confirmed
   ↓
Processing
   ↓
Shipped
   ↓
Out for Delivery
   ↓
Delivered

Orders can also be marked as:

Cancelled

Customers can see the latest order status from their My Orders section.

🖼️ Product Image Management

Product images are managed using Cloudinary.

Admin users can upload product images through the Admin Portal, and the image URLs are stored with the corresponding products.

This allows the business owner to add and update product images without modifying the source code.

🛠️ Technology Stack
Frontend
React.js
TypeScript
Vite
Tailwind CSS
Axios
React Router
Lucide React
Backend
Node.js
Express.js
TypeScript
REST API
JWT Authentication
bcrypt / bcryptjs
Express Rate Limit
Helmet
CORS
Database
MongoDB Atlas
MongoDB
Mongoose
Image Storage
Cloudinary
Development Tools
Git
GitHub
VS Code
npm
TypeScript
🏗️ Project Architecture
                         ┌──────────────────────┐
                         │      Customer        │
                         │  Web Browser / Mobile│
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │   React + Vite       │
                         │      Frontend        │
                         └──────────┬───────────┘
                                    │
                              REST API / Axios
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │ Node.js + Express    │
                         │      Backend         │
                         └───────┬──────┬───────┘
                                 │      │
                    ┌────────────┘      └──────────────┐
                    ▼                                  ▼
          ┌──────────────────┐                ┌──────────────────┐
          │   MongoDB Atlas  │                │    Cloudinary    │
          │ Users / Products │                │ Product Images   │
          │ Orders / etc.    │                │                  │
          └──────────────────┘                └──────────────────┘
📁 Project Structure
manoj-matching-centre/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.tsx
│   │   └── main.tsx
│   │
│   ├── package.json
│   └── vite.config.ts
│
├── server/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/
│   │   ├── index.ts
│   │   └── seed.ts
│   │
│   ├── package.json
│   └── tsconfig.json
│
├── .gitignore
├── README.md
└── package-lock.json
⚙️ Local Installation
1. Clone the Repository
git clone https://github.com/YOUR_USERNAME/manoj-matching-centre.git
cd manoj-matching-centre
🖥️ Backend Setup

Open a terminal:

cd server

Install dependencies:

npm install

Create a .env file inside the server directory.

Example:

MONGO_URI=your_mongodb_atlas_connection_string


JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret


CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret


CLIENT_URL=http://localhost:5173


PORT=5000
NODE_ENV=development
Start Backend
npm run dev

Backend:

http://localhost:5000
🌐 Frontend Setup

Open another terminal:

cd client

Install dependencies:

npm install

Create a .env file inside the client directory:

VITE_API_BASE_URL=http://localhost:5000/api
Start Frontend
npm run dev

Frontend:

http://localhost:5173
🔑 Authentication

The application uses JWT-based authentication.

Customer

Customers can:

Register
Login
Logout
Refresh authentication tokens
Access their profile
View their orders
Admin

Admin users have additional permissions for:

Product management
Category management
Customer management
Order management
Business settings

Role-based authorization prevents normal customers from accessing protected Admin Portal functionality.

🛒 Shopping Flow

The customer shopping flow is:

Browse Products
      ↓
View Product
      ↓
Add to Cart
      ↓
Review Cart
      ↓
Checkout
      ↓
Place Order
      ↓
Order Confirmation
      ↓
Track Order
👨‍💼 Admin Flow

The admin management flow is:

Admin Login
     ↓
Dashboard
     ↓
Manage Products
     ↓
Manage Categories
     ↓
View Customers
     ↓
View Orders
     ↓
Update Order Status
🔒 Security

The application includes:

Password hashing with bcrypt
JWT authentication
Refresh token rotation
Role-based authorization
Protected API routes
Admin-only routes
Environment variables for sensitive credentials
CORS configuration
Helmet security middleware
Express rate limiting
.env excluded from Git

Sensitive credentials should never be committed to the repository.

☁️ Production Deployment

The project can be deployed using services such as:

Frontend
Vercel
Netlify
Render
Backend
Render
Railway
Other Node.js hosting platforms
Database
MongoDB Atlas
Images
Cloudinary

For production, configure:

MONGO_URI=your_production_mongodb_uri
JWT_SECRET=your_production_secret
JWT_REFRESH_SECRET=your_production_refresh_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
CLIENT_URL=https://your-frontend-domain.com
NODE_ENV=production
🚀 Production Checklist

Before making the website publicly available:

 Add real business information
 Add real product categories
 Add real products
 Add real product prices
 Upload real product images
 Add business address
 Add business phone number
 Add WhatsApp number
 Add business opening hours
 Configure MongoDB Atlas
 Configure Cloudinary
 Set production JWT secrets
 Configure production CORS
 Remove test customers
 Remove test orders
 Verify admin login
 Test customer registration
 Test checkout
 Test order creation
 Test admin order management
 Test product image upload
 Test mobile responsiveness
 Deploy frontend
 Deploy backend
 Connect production frontend and backend
🔮 Future Improvements

Possible future features include:

Online payment integration
UPI payments
Payment gateway integration
Real-time delivery tracking
Order notifications
WhatsApp order notifications
Customer reviews and ratings
Advanced inventory management
Product stock tracking
Discount coupons
Promotional offers
Advanced search
Product recommendations
Invoice generation
Email notifications
Custom domain
Progressive Web App
Mobile application
📱 Responsive Design

The website is designed to work across:

Desktop
Laptop
Tablet
Mobile

The customer storefront and Admin Portal are designed with responsive layouts for different screen sizes.

🏪 Business Information
Manoj Matching Centre

Retail Textile & Fashion Store

Products include:

Banarasi Brocade
Fancy Dupattas
Cotton Prints
Lining Fabrics
Traditional Textiles
Fashion Fabrics

Business contact and address details can be configured through the website's Admin settings.

👨‍💻 Developer

Developed as a full-stack MERN e-commerce project for Manoj Matching Centre.

Technologies Used
MongoDB
Express.js
React.js
Node.js
TypeScript
Vite
Tailwind CSS
Cloudinary
JWT
Mongoose
⭐ Project

If you find this project useful, feel free to ⭐ star the repository.

Manoj Matching Centre — Bringing Textile Shopping Online.
