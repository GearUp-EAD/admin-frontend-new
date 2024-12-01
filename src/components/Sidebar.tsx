import React from 'react';
import { useContext,useCallback} from 'react';

import { NavLink } from 'react-router-dom';
import { Home, Package, Users, ShoppingCart, DollarSign, MessageCircle, HelpCircle, LogOut } from 'lucide-react';
import { useKeycloak } from '@react-keycloak/web';
import { AuthContext } from '../KeycloakProvider';


const navItems = [
  { icon: <Home className="w-5 h-5 mr-3" />, label: 'Home', path: '/' },
  { icon: <Package className="w-5 h-5 mr-3" />, label: 'Products', path: '/products' },
  { icon: <Users className="w-5 h-5 mr-3" />, label: 'Customers', path: '/customers' },
  { icon: <ShoppingCart className="w-5 h-5 mr-3" />, label: 'Orders', path: '/orders' },
  { icon: <DollarSign className="w-5 h-5 mr-3" />, label: 'Income', path: '/income' },
  { icon: <MessageCircle className="w-5 h-5 mr-3" />, label: 'Chat', path: '/chat' },
];

const Sidebar = () => {

  const { logout } = useContext(AuthContext);
  
  const handleLogout = useCallback(() => {
    const confirmed = window.confirm('Are you sure you want to logout?');
    if (confirmed) {
      logout();
    }
  }, [logout]);

  
  return (
    <div className="h-full bg-white border-r border-gray-200 p-3 ">
      <div className="  mb--4 flex items-center justify-between">
  <h1 className="text-2xl font-bold text-[#543310]">EliteGear</h1>
  <img 
    src="./src/assets/Logo.png" 
    alt="EliteGear Logo" 
    className="h-36 w-36 object-contain mb--5" 
  />
</div>

      
      <nav className="space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'text-white bg-[#543310]'
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
                ? 'text-white bg-[#543310]'
                : 'text-gray-600 hover:bg-gray-100'
            }`
          }
        >
          <HelpCircle className="w-5 h-5 mr-3" />
          Help
        </NavLink>
        <button
           onClick={handleLogout}  // Logout when the button is clicked
          className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg w-full transition-colors"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;