import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" 
          onClick={() => setIsMobileSidebarOpen(false)}
        >
          <div 
            className="fixed inset-y-0 left-0 w-64 bg-white"
            onClick={e => e.stopPropagation()}
          >
            <Sidebar />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 flex-shrink-0">
        <div className="fixed h-full w-64">
          <Sidebar />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <Header toggleMobileSidebar={toggleMobileSidebar} />
        <main className="p-4 md:p-8 lg:ml-64">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;