import React, { useState, useCallback } from 'react';
import { Bell, Search, Plus, Menu, LogOut, Settings, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../context/ProtectedRoutes';

const notifications = [
  {
    id: 1,
    title: 'New Order',
    message: 'Order #1234 received for Basketball shoes',
    time: '2 minutes ago',
    unread: true,
  },
  {
    id: 2,
    title: 'Low Stock Alert',
    message: 'Tennis Racket Pro is running low on stock',
    time: '1 hour ago',
    unread: true,
  },
  {
    id: 3,
    title: 'Payment Received',
    message: 'Payment received for Order #1232',
    time: '3 hours ago',
    unread: false,
  },
];

const Header = ({ toggleMobileSidebar }) => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const handleLogout = useCallback(() => {
    const confirmed = window.confirm('Are you sure you want to logout?');
    if (confirmed) {
      logout();
      navigate('/login'); // Redirect to the login page after logout
    }
  }, [navigate]);

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-20">
      <div className="flex justify-between items-center max-w-[2000px] mx-auto">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleMobileSidebar}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products, orders..."
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#543310]"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/products/create')}
            className="flex items-center px-4 py-2 bg-[#543310] text-white rounded-lg hover:bg-[#A0522D] transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            <span className="hidden sm:inline">Add Product</span>
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              className="p-2 hover:bg-gray-100 rounded-full relative"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className="w-6 h-6 text-gray-600" />
              <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                2
              </span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 border border-gray-200">
                <div className="px-4 py-2 border-b border-gray-200">
                  <h3 className="font-semibold">Notifications</h3>
                </div>
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`px-4 py-3 hover:bg-gray-50 cursor-pointer ${
                      notification.unread ? 'bg-gray-50' : ''
                    }`}
                  >
                    <div className="flex justify-between">
                      <p className="text-sm font-medium">{notification.title}</p>
                      <span className="text-xs text-gray-500">{notification.time}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                  </div>
                ))}
                <div className="px-4 py-2 border-t border-gray-200">
                  <button className="text-[#543310] text-sm hover:underline w-full text-center">
                    View All Notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center space-x-2"
            >
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop"
                alt="Admin"
                className="w-8 h-8 rounded-full"
              />
            </button>

            {showProfile && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-200">
                <div className="px-4 py-2 border-b border-gray-200">
                  <p className="text-sm font-medium">EliteGear Admin</p>
                  <p className="text-xs text-gray-500">admin@elitegear.com</p>
                </div>
                <button
                  onClick={() => navigate('/profile')}
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left flex items-center"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </button>
                <button
                  onClick={() => navigate('/help')}
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left flex items-center"
                >
                  <HelpCircle className="w-4 h-4 mr-2" />
                  Help Center
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm text-red-600 hover:bg-gray-50 w-full text-left flex items-center"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
