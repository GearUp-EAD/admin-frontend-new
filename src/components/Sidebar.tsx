import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Package, Users, ShoppingCart, DollarSign, MessageCircle, HelpCircle, LogOut } from 'lucide-react';

const navItems = [
  { icon: <Home className="w-5 h-5 mr-3" />, label: 'Home', path: '/' },
  { icon: <Package className="w-5 h-5 mr-3" />, label: 'Products', path: '/products' },
  { icon: <Users className="w-5 h-5 mr-3" />, label: 'Customers', path: '/customers' },
  { icon: <ShoppingCart className="w-5 h-5 mr-3" />, label: 'Orders', path: '/orders' },
  { icon: <DollarSign className="w-5 h-5 mr-3" />, label: 'Income', path: '/income' },
  { icon: <MessageCircle className="w-5 h-5 mr-3" />, label: 'Chat', path: '/chat' },
];

const Sidebar = () => {
  return (
    <div className="h-full bg-white border-r border-gray-200 p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#8B4513]">SportStore</h1>
      </div>
      
      <nav className="space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'text-white bg-[#8B4513]'
                  : 'text-gray-600 hover:bg-gray-100'
              }`
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="absolute bottom-8 left-6 right-6 space-y-2">
        <NavLink
          to="/help"
          className={({ isActive }) =>
            `flex items-center px-4 py-3 rounded-lg transition-colors ${
              isActive
                ? 'text-white bg-[#8B4513]'
                : 'text-gray-600 hover:bg-gray-100'
            }`
          }
        >
          <HelpCircle className="w-5 h-5 mr-3" />
          Help
        </NavLink>
        <button className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg w-full transition-colors">
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;