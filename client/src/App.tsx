import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { SettingsProvider } from '@/context/SettingsContext';
import ScrollToTop from '@/components/ScrollToTop';
import PublicLayout from '@/layouts/PublicLayout';
import AdminLayout from '@/layouts/AdminLayout';
import AdminLayoutShell from '@/layouts/AdminLayoutShell';

import Home from '@/pages/Home';
import Products from '@/pages/Products';
import Categories from '@/pages/Categories';
import CategoryPage from '@/pages/CategoryPage';
import ProductDetails from '@/pages/ProductDetails';
import SearchResults from '@/pages/SearchResults';
import Cart from '@/pages/Cart';
import Checkout from '@/pages/Checkout';
import OrderConfirmation from '@/pages/OrderConfirmation';
import MyOrders from '@/pages/MyOrders';
import OrderDetails from '@/pages/OrderDetails';
import Profile from '@/pages/Profile';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import Login from '@/pages/Login';
import Register from '@/pages/Register';

import AdminLogin from '@/pages/admin/AdminLogin';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminProducts from '@/pages/admin/AdminProducts';
import AdminProductForm from '@/pages/admin/AdminProductForm';
import AdminCategories from '@/pages/admin/AdminCategories';
import AdminOrders from '@/pages/admin/AdminOrders';
import AdminOrderDetails from '@/pages/admin/AdminOrderDetails';
import AdminCustomers from '@/pages/admin/AdminCustomers';
import AdminSettings from '@/pages/admin/AdminSettings';

function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <CartProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/category/:slug" element={<CategoryPage />} />
                <Route path="/products/:slug" element={<ProductDetails />} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-confirmation/:orderNumber" element={<OrderConfirmation />} />
                <Route path="/orders" element={<MyOrders />} />
                <Route path="/orders/:id" element={<OrderDetails />} />
                <Route path="/profile" element={<Profile />} />
              </Route>
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route element={<AdminLayoutShell />}>
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="products/new" element={<AdminProductForm />} />
                  <Route path="products/:id/edit" element={<AdminProductForm />} />
                  <Route path="categories" element={<AdminCategories />} />
                  <Route path="orders" element={<AdminOrders />} />
                  <Route path="orders/:id" element={<AdminOrderDetails />} />
                  <Route path="customers" element={<AdminCustomers />} />
                  <Route path="settings" element={<AdminSettings />} />
                </Route>
              </Route>
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </SettingsProvider>
    </AuthProvider>
  );
}

export default App;
