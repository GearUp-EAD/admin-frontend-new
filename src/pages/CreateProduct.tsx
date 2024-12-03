import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload } from 'lucide-react';

interface ProductForm {
  name: string;
  category: string;
  subcategory: string;
  price: string;
  stock: string;
  description: string;
  image: string;
}

const categories = {
  Accessories: {
    id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    subcategories: {
      'Caps and Hats': 'size-id-1',
      Gloves: 'size-id-2',
      'Head and Wrist Bands': 'size-id-3',
      Socks: 'size-id-4',
      Sunglasses: 'size-id-5',
    },
  },
  Apparels: {
    id: '4fa85f64-5717-4562-b3fc-2c963f66afa7',
    subcategories: {
      'Compression Wear': 'size-id-6',
      'Jackets & Hoodies': 'size-id-7',
      Shorts: 'size-id-8',
      Swimwear: 'size-id-9',
      'T-shirts & Jerseys': 'size-id-10',
    },
  },
  Equipments: {
    id: '5fa85f64-5717-4562-b3fc-2c963f66afa8',
    subcategories: {
      Balls: 'size-id-11',
      'Bags and Bottles': 'size-id-12',
      'Fitness and Gym': 'size-id-13',
      'Rackets and Bats': 'size-id-14',
      'Protective Gear': 'size-id-15',
    },
  },
  Footwear: {
    id: '6fa85f64-5717-4562-b3fc-2c963f66afa9',
    subcategories: {
      Cleats: 'size-id-16',
      'Hiking Boots': 'size-id-17',
      'Running Shoes': 'size-id-18',
      'Sandals & Slippers': 'size-id-19',
      Sneakers: 'size-id-20',
    },
  },
  'Nutrition & Health': {
    id: '7fa85f64-5717-4562-b3fc-2c963f66afaa',
    subcategories: {
      'Energy Bars & Drinks': 'size-id-21',
      'Protein Powders': 'size-id-22',
      Supplements: 'size-id-23',
    },
  },
};

const CreateProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ProductForm>({
    name: '',
    category: '',
    subcategory: '',
    price: '',
    stock: '',
    description: '',
    image: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
    navigate('/products');
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate('/products')}
          className="mr-4 p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold">Create New Product</h2>
      </div>

      <div className="max-w-2xl bg-white rounded-xl shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <div className="text-sm text-gray-600">
              <label className="relative cursor-pointer rounded-md font-medium text-[#543310] hover:text-[#A0522D]">
                <span>Upload a file</span>
                <input
                  type="file"
                  name="image"
                  className="sr-only"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files) {
                      setFormData({
                        ...formData,
                        image: e.target.files[0].name, // Simulate upload
                      });
                    }
                  }}
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500 mt-2">PNG, JPG, GIF up to 10MB</p>
          </div>

          {/* Product Details */}
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Product Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#543310] focus:ring focus:ring-[#543310] focus:ring-opacity-50"
                required
              />
            </div>

            {/* Category Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#543310] focus:ring focus:ring-[#543310] focus:ring-opacity-50"
                required
              >
                <option value="">Select a category</option>
                {Object.keys(categories).map((category) => (
                  <option key={categories[category].id} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Subcategory Selection */}
            {formData.category && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Subcategory</label>
                <select
                  name="subcategory"
                  value={formData.subcategory}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#543310] focus:ring focus:ring-[#543310] focus:ring-opacity-50"
                  required
                >
                  <option value="">Select a subcategory</option>
                  {Object.keys(categories[formData.category].subcategories).map((sub) => (
                    <option
                      key={categories[formData.category].subcategories[sub]}
                      value={sub}
                    >
                      {sub}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Price ($)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#543310] focus:ring focus:ring-[#543310] focus:ring-opacity-50"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Stock</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  min="0"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#543310] focus:ring focus:ring-[#543310] focus:ring-opacity-50"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#543310] focus:ring focus:ring-[#543310] focus:ring-opacity-50"
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/products')}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#543310] text-white rounded-lg hover:bg-[#A0522D]"
            >
              Create Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProduct;
