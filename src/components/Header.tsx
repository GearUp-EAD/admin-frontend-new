import React from 'react';
import { Bell, Search, Plus, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  toggleMobileSidebar: () => void;
}

const Header = ({ toggleMobileSidebar }: HeaderProps) => {
  const navigate = useNavigate();

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
              placeholder="Search or type a command"
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B4513]"
            />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate('/products/create')}
            className="flex items-center px-4 py-2 bg-[#8B4513] text-white rounded-lg hover:bg-[#A0522D] transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            <span className="hidden sm:inline">Create</span>
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Bell className="w-6 h-6 text-gray-600" />
          </button>
          <img
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop"
            alt="Profile"
            className="w-10 h-10 rounded-full"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;