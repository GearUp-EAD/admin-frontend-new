import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload } from 'lucide-react';

interface ProductForm {
  name: string;
  category: string;
  subcategory: string;
  price: string;
  description: string;
  image: string;
  sizes: { size: string; quantity: string }[]; // Sizes with quantities
}

const categories = {
  Accessories: {
    id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    subcategories: {
      'Caps and Hats': '00000000-0000-0000-0000-000000000001',
      Gloves: '00000000-0000-0000-0000-000000000002',
      'Head and Wrist Bands': '00000000-0000-0000-0000-000000000003',
      Socks: '00000000-0000-0000-0000-000000000004',
      Sunglasses: '00000000-0000-0000-0000-000000000005',
    },
    sizeType: ['One Size'],
  },
  Apparels: {
    id: '4fa85f64-5717-4562-b3fc-2c963f66afa7',
    subcategories: {
      'Compression Wear': '00000000-0000-0000-0000-000000000006',
      'Jackets & Hoodies': '00000000-0000-0000-0000-000000000007',
      Shorts: '00000000-0000-0000-0000-000000000008',
      Swimwear: '00000000-0000-0000-0000-000000000009',
      'T-shirts & Jerseys': '00000000-0000-0000-0000-000000000010',
    },
    sizeType: ['S', 'M', 'L', 'XL', 'XXL'],
  },
  Equipments: {
    id: '5fa85f64-5717-4562-b3fc-2c963f66afa8',
    subcategories: {
      Balls: '00000000-0000-0000-0000-000000000011',
      'Bags and Bottles': '00000000-0000-0000-0000-000000000012',
      'Fitness and Gym': '00000000-0000-0000-0000-000000000013',
      'Rackets and Bats': '00000000-0000-0000-0000-000000000014',
      'Protective Gear': '00000000-0000-0000-0000-000000000015',
    },
    sizeType: ['One Size', 'Custom'],
  },
  Footwear: {
    id: '6fa85f64-5717-4562-b3fc-2c963f66afa9',
    subcategories: {
      Cleats: '00000000-0000-0000-0000-000000000016',
      'Hiking Boots': '00000000-0000-0000-0000-000000000017',
      'Running Shoes': '00000000-0000-0000-0000-000000000018',
      'Sandals & Slippers': '00000000-0000-0000-0000-000000000019',
      Sneakers: '00000000-0000-0000-0000-000000000020',
    },
    sizeType: ['6', '7', '8', '9', '10', '11', '12'],
  },
  'Nutrition & Health': {
    id: '7fa85f64-5717-4562-b3fc-2c963f66afaa',
    subcategories: {
      'Energy Bars & Drinks': '00000000-0000-0000-0000-000000000021',
      'Protein Powders': '00000000-0000-0000-0000-000000000022',
      Supplements: '00000000-0000-0000-0000-000000000023',
    },
    sizeType: ['One Size'],
  },
};

const CreateProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ProductForm>({
    name: '',
    category: '',
    subcategory: '',
    price: '',
    description: '',
    image: '',
    sizes: [{ size: '', quantity: '' }],
  });

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const productData = [{
      name: formData.name,
      description: formData.description,
      basePrice: parseFloat(formData.price),
      categoryId: categories[formData.category].id,
      imageUrl: formData.image,
      variants: formData.sizes.map((item) => ({
        sizeId: categories[formData.category].subcategories[formData.subcategory],
        stockQuantity: parseInt(item.quantity),
        priceAdjustment: 0
      }))
    }];
  
    console.log('Sending product data:', JSON.stringify(productData, null, 2));
  
    try {
      const response = await fetch('http://localhost:8080/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });
  
      if (!response.ok) {
        // Get the error details
        const errorDetails = await response.text();
        console.error('Error details:', errorDetails);
        throw new Error(`Failed to create product: ${errorDetails}`);
      }
  
      navigate('/products');
    } catch (error: any) {
      console.error('Submission error:', error);
      setError(error.message);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSizeChange = (index: number, field: string, value: string) => {
    const updatedSizes = [...formData.sizes];
    updatedSizes[index][field as 'size' | 'quantity'] = value;
    setFormData({ ...formData, sizes: updatedSizes });
  };

  const addSizeField = () => {
    setFormData({ ...formData, sizes: [...formData.sizes, { size: '', quantity: '' }] });
  };

  const removeSizeField = (index: number) => {
    const updatedSizes = formData.sizes.filter((_, i) => i !== index);
    setFormData({ ...formData, sizes: updatedSizes });
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <button onClick={() => navigate('/products')} className="mr-4 p-2 hover:bg-gray-100 rounded-lg">
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
                      setFormData({ ...formData, image: e.target.files[0].name });
                    }
                  }}
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500 mt-2">PNG, JPG, GIF up to 10MB</p>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 gap-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Product Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300"
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

            {/* Subcategory */}
            {formData.category && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Subcategory</label>
                <select
                  name="subcategory"
                  value={formData.subcategory}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300"
                  required
                >
                  <option value="">Select a subcategory</option>
                  {Object.keys(categories[formData.category].subcategories).map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Sizes */}
            {formData.category && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Sizes and Quantities</label>
                {formData.sizes.map((size, index) => (
                  <div key={index} className="flex items-center gap-4 mt-2">
                    <select
                      name="size"
                      value={size.size}
                      onChange={(e) => handleSizeChange(index, 'size', e.target.value)}
                      className="block w-1/2 rounded-md border-gray-300"
                      required
                    >
                      <option value="">Select a size</option>
                      {categories[formData.category].sizeType.map((sizeOption) => (
                        <option key={sizeOption} value={sizeOption}>
                          {sizeOption}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      name="quantity"
                      placeholder="Quantity"
                      value={size.quantity}
                      onChange={(e) => handleSizeChange(index, 'quantity', e.target.value)}
                      className="block w-1/2 rounded-md border-gray-300"
                      min="0"
                      required
                    />
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => removeSizeField(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addSizeField}
                  className="mt-2 text-sm text-[#543310] hover:text-[#A0522D]"
                >
                  + Add another size
                </button>
              </div>
            )}

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Base Price</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300"
                required
              />
            </div>
          </div>

          {error && <p className="text-red-600">{error}</p>}

          <button
            type="submit"
            className="w-full bg-[#543310] text-white py-2 rounded-md hover:bg-[#A0522D]"
          >
            Create Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProduct;