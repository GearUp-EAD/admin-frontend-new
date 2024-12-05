import React, { useState } from 'react';
import { Edit, Trash2, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

// Categories with item counts
const categories = [
  { id: 1, name: 'Accessories', image: 'https://via.placeholder.com/300', itemCount: 25 },
  { id: 2, name: 'Apparels', image: 'https://via.placeholder.com/300', itemCount: 30 },
  { id: 3, name: 'Equipments', image: 'https://via.placeholder.com/300', itemCount: 20 },
  { id: 4, name: 'Footwear', image: 'https://via.placeholder.com/300', itemCount: 15 },
  { id: 5, name: 'Nutrition & Health', image: 'https://via.placeholder.com/300', itemCount: 10 },
];

// Products categorized by main categories and subcategories
const products = {
  Accessories: {
    'Caps and Hats': [
      { id: 1, name: 'Baseball Cap', price: 9.99, stock: 100, image: 'https://via.placeholder.com/100' },
      { id: 2, name: 'Sun Hat', price: 14.99, stock: 50, image: 'https://via.placeholder.com/100' },
    ],
    Gloves: [
      { id: 3, name: 'Winter Gloves', price: 14.99, stock: 75, image: 'https://via.placeholder.com/100' },
      { id: 4, name: 'Boxing Gloves', price: 19.99, stock: 60, image: 'https://via.placeholder.com/100' },
    ],
    'Head and Wrist Bands': [
      { id: 5, name: 'Sweat Band', price: 7.99, stock: 80, image: 'https://via.placeholder.com/100' },
    ],
    Socks: [
      { id: 6, name: 'Sports Socks', price: 5.99, stock: 120, image: 'https://via.placeholder.com/100' },
    ],
    Sunglasses: [
      { id: 7, name: 'Sports Sunglasses', price: 24.99, stock: 40, image: 'https://via.placeholder.com/100' },
    ],
  },
  Apparels: {
    Compression: [
      { id: 8, name: 'Compression Shirt', price: 29.99, stock: 50, image: 'https://via.placeholder.com/100' },
    ],
    'Running Shorts': [
      { id: 9, name: 'Running Shorts', price: 19.99, stock: 100, image: 'https://via.placeholder.com/100' },
    ],
  },
  Equipments: {
    Basketball: [
      { id: 10, name: 'Basketball', price: 19.99, stock: 200, image: 'https://via.placeholder.com/100' },
    ],
    'Fitness Bands': [
      { id: 11, name: 'Fitness Band', price: 39.99, stock: 70, image: 'https://via.placeholder.com/100' },
    ],
  },
  Footwear: {
    'Running Shoes': [
      { id: 12, name: 'Running Shoes', price: 79.99, stock: 80, image: 'https://via.placeholder.com/100' },
    ],
  },
  'Nutrition & Health': {
    'Energy Bars': [
      { id: 13, name: 'Energy Bar', price: 1.99, stock: 500, image: 'https://via.placeholder.com/100' },
    ],
    'Protein Powder': [
      { id: 14, name: 'Protein Powder', price: 29.99, stock: 40, image: 'https://via.placeholder.com/100' },
    ],
  },
};

const Products = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [productsList, setProductsList] = useState(products);

  const handleCategoryClick = (categoryName) => {
    setSelectedCategory(categoryName);
    setSelectedSubCategory(null);
  };

  const handleSubCategoryClick = (subCategoryName) => {
    setSelectedSubCategory(subCategoryName);
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
      confirmButtonColor: '#543310',
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
        const subCategoryProducts = categoryProducts[selectedSubCategory];
        const productIndex = subCategoryProducts.findIndex((p) => p.id === product.id);

        if (productIndex !== -1) {
          subCategoryProducts[productIndex] = {
            ...subCategoryProducts[productIndex],
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
      confirmButtonColor: '#543310',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedProducts = { ...productsList };
        updatedProducts[selectedCategory][selectedSubCategory] = updatedProducts[selectedCategory][selectedSubCategory].filter(
          (p) => p.id !== product.id
        );
        setProductsList(updatedProducts);

        Swal.fire('Deleted!', 'Product has been deleted.', 'success');
      }
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Products</h2>
      </div>

      {!selectedCategory ? (
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
      ) : !selectedSubCategory ? (
        <div>
          <button
            onClick={() => setSelectedCategory(null)}
            className="mb-6 flex items-center text-[#543310] hover:underline"
          >
            ← Back to Categories
          </button>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.keys(productsList[selectedCategory]).map((subCategory) => (
              <div
                key={subCategory}
                onClick={() => handleSubCategoryClick(subCategory)}
                className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="relative h-48">
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <h3 className="text-white text-2xl font-bold">{subCategory}</h3>
                  </div>
                </div>
                <div className="p-4 flex justify-between items-center">
                  <span className="text-gray-600">
                    {productsList[selectedCategory][subCategory].length} items
                  </span>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <button
            onClick={() => setSelectedSubCategory(null)}
            className="mb-6 flex items-center text-[#543310] hover:underline"
          >
            ← Back to Subcategories
          </button>
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
            <thead>
              <tr>
                <th className="px-6 py-3 text-sm font-medium text-left text-gray-500">Image</th>
                <th className="px-6 py-3 text-sm font-medium text-left text-gray-500">Name</th>
                <th className="px-6 py-3 text-sm font-medium text-left text-gray-500">Price</th>
                <th className="px-6 py-3 text-sm font-medium text-left text-gray-500">Stock</th>
                <th className="px-6 py-3 text-sm font-medium text-left text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {productsList[selectedCategory][selectedSubCategory].map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{product.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">${product.price.toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{product.stock}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex gap-4">
                      <button onClick={() => handleEdit(product)}>
                        <Edit className="text-gray-500 hover:text-[#543310]" />
                      </button>
                      <button onClick={() => handleDelete(product)}>
                        <Trash2 className="text-gray-500 hover:text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Products;
 