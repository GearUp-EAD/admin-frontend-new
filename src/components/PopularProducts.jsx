import React from 'react';
import { TrendingUp, ShoppingBag } from 'lucide-react';

const popularProducts = [
  {
    id: 1,
    name: 'Pro Basketball Shoes',
    category: 'Footwear',
    price: 129.99,
    sales: 1234,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80',
  },
  {
    id: 2,
    name: 'Tennis Racket Elite',
    category: 'Tennis',
    price: 199.99,
    sales: 856,
    image: 'https://images.unsplash.com/photo-1617083277662-50296a341b93?w=500&q=80',
  },
  {
    id: 3,
    name: 'Running Track Suit',
    category: 'Apparel',
    price: 89.99,
    sales: 567,
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&q=80',
  },
  {
    id: 4,
    name: 'Pro Soccer Ball',
    category: 'Soccer',
    price: 59.99,
    sales: 982,
    image: 'https://images.unsplash.com/photo-1552318965-6e6be7484ada?w=500&q=80',
  },
];

const PopularProducts = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Popular Products</h3>
        <select className="px-3 py-2 border rounded-lg text-sm">
          <option>This Week</option>
          <option>This Month</option>
          <option>This Year</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {popularProducts.map((product) => (
          <div key={product.id} className="product-card">
            <img
              src={product.image}
              alt={product.name}
              className="product-image"
            />
            <div className="product-details">
              <span className="text-xs font-medium text-gray-500 uppercase">
                {product.category}
              </span>
              <h4 className="product-title">{product.name}</h4>
              <p className="product-price">${product.price}</p>
              <div className="product-stats">
                <div className="flex items-center">
                  <ShoppingBag className="w-4 h-4 mr-1" />
                  <span>{product.sales} sales</span>
                </div>
                <div className="flex items-center text-green-600">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span>+12%</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularProducts;