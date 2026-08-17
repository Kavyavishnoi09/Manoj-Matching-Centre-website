import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingCart, Search, User, LogOut, Package } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/utils/helpers';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) { navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`); setMobileOpen(false); }
  };

  const handleLogout = async () => { await logout(); setUserMenuOpen(false); navigate('/'); };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    cn('text-sm font-medium transition-colors hover:text-gold-600', isActive ? 'text-gold-600' : 'text-brown-800');

  return (
    <header className="sticky top-0 z-50 bg-cream-50/95 backdrop-blur-md border-b border-cream-200 shadow-sm">
      <div className="bg-maroon-900 text-cream-100 text-xs text-center py-1.5 px-4">
        Premium Banarasi Fabrics &amp; Brocade | Retail Store | Quality You Can Trust
      </div>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="flex flex-col leading-none">
              <span className="text-lg md:text-xl font-serif font-bold text-maroon-900">MANOJ</span>
              <span className="text-xs md:text-sm font-serif text-gold-700 tracking-wider">MATCHING CENTRE</span>
            </div>
          </Link>

          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search fabrics..." className="w-full rounded-full border border-cream-300 bg-white pl-4 pr-10 py-2 text-sm focus:border-maroon-600 focus:outline-none focus:ring-1 focus:ring-maroon-600" />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-brown-500 hover:text-maroon-700"><Search size={18} /></button>
            </div>
          </form>

          <div className="hidden lg:flex items-center gap-6">
            <NavLink to="/" end className={navLinkClass}>Home</NavLink>
            <NavLink to="/products" className={navLinkClass}>Products</NavLink>
            <NavLink to="/categories" className={navLinkClass}>Categories</NavLink>
            <NavLink to="/about" className={navLinkClass}>About</NavLink>
            <NavLink to="/contact" className={navLinkClass}>Contact</NavLink>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <Link to="/cart" className="relative p-2 text-brown-800 hover:text-maroon-700 transition-colors" aria-label="Cart">
              <ShoppingCart size={22} />
              {totalItems > 0 && <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 rounded-full bg-maroon-800 text-cream-50 text-xs font-bold">{totalItems}</span>}
            </Link>

            {user ? (
              <div className="relative">
                <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="flex items-center gap-1 p-2 text-brown-800 hover:text-maroon-700 transition-colors">
                  <User size={22} />
                </button>
                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 mt-2 w-48 rounded-lg bg-white shadow-lg border border-cream-200 py-2 z-50 animate-slide-down">
                      <div className="px-4 py-2 border-b border-cream-200">
                        <p className="text-sm font-medium text-maroon-900">{user.name || 'Account'}</p>
                        <p className="text-xs text-brown-500 truncate">{user.email}</p>
                      </div>
                      <Link to="/profile" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-brown-800 hover:bg-cream-100 transition-colors"><User size={16} /> Profile</Link>
                      <Link to="/orders" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-brown-800 hover:bg-cream-100 transition-colors"><Package size={16} /> My Orders</Link>
                      {user.role === 'admin' && <Link to="/admin/dashboard" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-maroon-800 hover:bg-cream-100 transition-colors font-medium">Admin Dashboard</Link>}
                      <button onClick={handleLogout} className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-700 hover:bg-cream-100 transition-colors"><LogOut size={16} /> Sign Out</button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link to="/login" className="hidden sm:flex items-center gap-1 p-2 text-brown-800 hover:text-maroon-700 transition-colors"><User size={22} /></Link>
            )}

            <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 text-brown-800 hover:text-maroon-700 transition-colors" aria-label="Menu">
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {mobileOpen && (
        <div className="lg:hidden border-t border-cream-200 bg-cream-50 animate-slide-down">
          <div className="px-4 py-4 space-y-3">
            <form onSubmit={handleSearch} className="relative">
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search fabrics..." className="w-full rounded-full border border-cream-300 bg-white pl-4 pr-10 py-2 text-sm focus:border-maroon-600 focus:outline-none" />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-brown-500"><Search size={18} /></button>
            </form>
            <NavLink to="/" end className={navLinkClass} onClick={() => setMobileOpen(false)}><span className="block py-1">Home</span></NavLink>
            <NavLink to="/products" className={navLinkClass} onClick={() => setMobileOpen(false)}><span className="block py-1">Products</span></NavLink>
            <NavLink to="/categories" className={navLinkClass} onClick={() => setMobileOpen(false)}><span className="block py-1">Categories</span></NavLink>
            <NavLink to="/about" className={navLinkClass} onClick={() => setMobileOpen(false)}><span className="block py-1">About</span></NavLink>
            <NavLink to="/contact" className={navLinkClass} onClick={() => setMobileOpen(false)}><span className="block py-1">Contact</span></NavLink>
            {!user && <Link to="/login" onClick={() => setMobileOpen(false)} className="block py-1 text-sm font-medium text-brown-800 hover:text-gold-600">Login / Register</Link>}
            {user?.role === 'admin' && <Link to="/admin/dashboard" onClick={() => setMobileOpen(false)} className="block py-1 text-sm font-medium text-maroon-800">Admin Dashboard</Link>}
          </div>
        </div>
      )}
    </header>
  );
}
