import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Layout from './components/Layout';
import ProtectedRoutes from './context/ProtectedRoutes';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import CreateProduct from './pages/CreateProduct';
import Customers from './pages/Customers';
import Orders from './pages/Orders';
import Income from './pages/Income';
import Chat from './pages/Chat';
import Help from './pages/Help';
import Profile from './pages/Profile';
import PublicPage from './pages/PublicPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/public" element={<PublicPage />} />
        <Route path="/" element={<Layout />}>
          <Route element={<ProtectedRoutes />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="products/create" element={<CreateProduct />} />
            <Route path="customers" element={<Customers />} />
            <Route path="orders" element={<Orders />} />
            <Route path="income" element={<Income />} />
            <Route path="chat" element={<Chat />} />
            <Route path="help" element={<Help />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
