# Manoj Matching Centre

A modern full-stack e-commerce website for **Manoj Matching Centre**, a retail textile and clothing business specializing in traditional and fashionable fabrics.

## 🛍️ About the Project

Manoj Matching Centre is a MERN-stack based online shopping platform where customers can browse textile products, view product details, add products to their cart, place orders, and track their order status.

The website also includes a dedicated **Admin Portal** for managing products, categories, customers, and orders.

## ✨ Features

### 👤 Customer

- User registration and login
- Secure JWT authentication
- Browse textile products
- Search and filter products
- Product categories
- Product details with images
- Add products to wishlist
- Shopping cart
- Checkout
- Place orders
- View order history
- Track order status
- Manage profile
- Contact business through WhatsApp

### 🔐 Admin Portal

- Secure admin authentication
- Admin dashboard
- Add new products
- Edit products
- Delete products
- Upload product images
- Manage product categories
- View customers
- View all orders
- Update order status
- Manage business settings

### 📦 Order Management

Customers can place orders and admins can update the order status:

`Pending → Confirmed → Processing → Shipped → Out for Delivery → Delivered`

### 🖼️ Image Management

Product images are integrated with **Cloudinary** for reliable cloud-based image storage.

## 🧵 Products

The platform is designed for retail textile products such as:

- Banarasi Brocade
- Fancy Dupattas
- Cotton Printed Fabrics
- Lining Fabrics
- Traditional Indian Textiles
- Other Fashion & Dress Materials

## 🛠️ Tech Stack

### Frontend

- React.js
- TypeScript
- Vite
- Tailwind CSS
- Axios
- React Router

### Backend

- Node.js
- Express.js
- TypeScript
- JWT Authentication
- bcrypt
- REST API

### Database & Services

- MongoDB Atlas
- Mongoose
- Cloudinary

## 📁 Project Structure

```text
manoj-matching-centre/
│
├── client/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── controllers/
│   │   └── utils/
│   └── package.json
│
├── .gitignore
└── README.md
