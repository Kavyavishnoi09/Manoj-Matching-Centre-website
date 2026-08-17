import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, FolderTree, ShoppingCart, Users, Settings, LogOut, ExternalLink } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/utils/helpers';

export default function AdminLayoutShell() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => { await logout(); navigate('/admin/login'); };

  const links = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/products', label: 'Products', icon: Package },
    { to: '/admin/categories', label: 'Categories', icon: FolderTree },
    { to: '/admin/orders', label: 'Orders', icon: ShoppingCart },
    { to: '/admin/customers', label: 'Customers', icon: Users },
    { to: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="lg:w-64 bg-maroon-950 text-cream-100 lg:min-h-screen lg:fixed lg:left-0 lg:top-0 z-30">
        <div className="p-5 border-b border-maroon-800">
          <div className="flex flex-col leading-none">
            <span className="text-lg font-serif font-bold text-cream-50">MANOJ</span>
            <span className="text-xs font-serif text-gold-400 tracking-wider">MATCHING CENTRE</span>
            <span className="text-xs text-cream-400 mt-1">Admin Portal</span>
          </div>
        </div>
        <nav className="p-4 space-y-1">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={({ isActive }) => cn(
              'flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium transition-colors',
              isActive ? 'bg-gold-500 text-brown-950' : 'text-cream-300 hover:bg-maroon-800 hover:text-cream-50'
            )}>
              <l.icon size={18} /> {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-maroon-800 mt-4 space-y-2">
          <Link to="/" className="flex items-center gap-2 px-4 py-2 text-sm text-cream-300 hover:text-gold-400 transition-colors">
            <ExternalLink size={16} /> View Store
          </Link>
          <div className="px-4 py-2 text-xs text-cream-400 truncate">{user?.email}</div>
          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-sm text-red-300 hover:text-red-200 transition-colors w-full">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Mobile horizontal nav */}
      <div className="lg:hidden bg-maroon-950 overflow-x-auto">
        <div className="flex gap-1 px-2 py-2 min-w-max">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={({ isActive }) => cn(
              'flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium whitespace-nowrap transition-colors',
              isActive ? 'bg-gold-500 text-brown-950' : 'text-cream-300 hover:bg-maroon-800'
            )}>
              <l.icon size={14} /> {l.label}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 lg:ml-64 p-4 md:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
}
