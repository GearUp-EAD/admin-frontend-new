import React from 'react';
import { TrendingUp, ShoppingBag } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  sales: number;
  image: string;
}

const popularProducts: Product[] = [
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

      <div className="space-y-4">
        {popularProducts.map((product) => (
          <div key={product.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <img
                src={product.image}
                alt={product.name}
                className="w-16 h-16 rounded-full"
              />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">{product.name}</p>
                <p className="text-xs text-gray-500">{product.category}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">${product.price}</p>
              <div className="flex items-center mt-1">
                <ShoppingBag className="w-4 h-4 mr-1" />
                <span>{product.sales} sales</span>
              </div>
              <div className="flex items-center text-green-600 mt-1">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>+12%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularProducts;
