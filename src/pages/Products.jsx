import React, { useState } from 'react';
import { Edit, Trash2, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const categories = [
  {
    id: 1,
    name: 'Basketball',
    image: 'https://images.unsplash.com/photo-1494199505258-5f95387f933c?w=300&fit=crop',
    itemCount: 45,
  },
  {
    id: 2,
    name: 'Tennis',
    image: 'https://images.unsplash.com/photo-1617083277662-50296a341b93?w=300&fit=crop',
    itemCount: 32,
  },
  {
    id: 3,
    name: 'Football',
    image: 'https://images.unsplash.com/photo-1552318965-6e6be7484ada?w=300&fit=crop',
    itemCount: 28,
  },
  {
    id: 4,
    name: 'Cricket',
    image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=300&fit=crop',
    itemCount: 35,
  },
  {
    id: 5,
    name: 'Swimming',
    image: 'https://images.unsplash.com/photo-1601808881948-aa5cc744c8d9?w=300&fit=crop',
    itemCount: 24,
  },
];

const products = {
  Basketball: [
    {
      id: 1,
      name: 'Professional Basketball',
      price: 29.99,
      stock: 150,
      image: 'https://images.unsplash.com/photo-1494199505258-5f95387f933c?w=100&fit=crop',
    },
    {
      id: 2,
      name: 'Basketball Shoes Elite',
      price: 129.99,
      stock: 75,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&fit=crop',
    },
  ],
  Tennis: [
    {
      id: 3,
      name: 'Tennis Racket Pro',
      price: 199.99,
      stock: 45,
      image: 'https://images.unsplash.com/photo-1617083277662-50296a341b93?w=100&fit=crop',
    },
  ],
  // Add more products for other categories
};

const Products = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [productsList, setProductsList] = useState(products);

  const handleCategoryClick = (categoryName) => {
    setSelectedCategory(categoryName);
  };

  const handleEdit = (product) => {
    Swal.fire({
      title: 'Edit Product',
      html: `
        <input id="name" class="swal2-input" placeholder="Product Name" value="${product.name}">
        <input id="price" class="swal2-input" placeholder="Price" type="number" value="${product.price}">
        <input id="stock" class="swal2-input" placeholder="Stock" type="number" value="${product.stock}">
      `,
      showCancelButton: true,
      confirmButtonText: 'Save',
      confirmButtonColor: '#8B4513',
      cancelButtonColor: '#6B7280',
      preConfirm: () => {
        return {
          name: document.getElementById('name').value,
          price: parseFloat(document.getElementById('price').value),
          stock: parseInt(document.getElementById('stock').value),
        };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedProducts = { ...productsList };
        const categoryProducts = updatedProducts[selectedCategory];
        const productIndex = categoryProducts.findIndex(p => p.id === product.id);
        
        if (productIndex !== -1) {
          categoryProducts[productIndex] = {
            ...categoryProducts[productIndex],
            ...result.value,
          };
          setProductsList(updatedProducts);
          
          Swal.fire('Updated!', 'Product has been updated.', 'success');
        }
      }
    });
  };

  const handleDelete = (product) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#8B4513',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedProducts = { ...productsList };
        updatedProducts[selectedCategory] = updatedProducts[selectedCategory]
          .filter(p => p.id !== product.id);
        setProductsList(updatedProducts);
        
        Swal.fire(
          'Deleted!',
          'Product has been deleted.',
          'success'
        );
      }
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Products</h2>
        <button 
          onClick={() => navigate('/products/create')}
          className="px-4 py-2 bg-[#8B4513] text-white rounded-lg hover:bg-[#A0522D]"
        >
          Add Product
        </button>
      </div>

      {!selectedCategory ? (
        // Categories Grid View
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => handleCategoryClick(category.name)}
              className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="relative h-48">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <h3 className="text-white text-2xl font-bold">{category.name}</h3>
                </div>
              </div>
              <div className="p-4 flex justify-between items-center">
                <span className="text-gray-600">{category.itemCount} items</span>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Products List View
        <div>
          <button
            onClick={() => setSelectedCategory(null)}
            className="mb-6 flex items-center text-[#8B4513] hover:underline"
          >
            ← Back to Categories
          </button>
          
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {productsList[selectedCategory]?.map((product) => (
                    <tr key={product.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={product.image}
                            alt={product.name}
                          />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {product.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              #{product.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${product.price}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.stock}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEdit(product)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(product)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;