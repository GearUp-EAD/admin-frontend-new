import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload } from 'lucide-react';

interface ProductForm {
  name: string;
  category: string;
  subcategory: string;
  price: string;
  description: string;
  image: string;
sizes: Size[]; // Array of Size objects}
}

interface Size {
  size: string;
  quantity: number;
  priceAdjustment: number;
}



const CreateProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ProductForm>({
    name: '',
    category: '',
    subcategory: '',
    price: '',
    description: '',
    image: '',
    sizes: []
  });
  const [newSize, setNewSize] = useState<Size>({
    size: '',
    quantity: 0,
    priceAdjustment: 0
  });

  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);


  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/categories/parents');
      const data = await response.json();
      setCategories(data.map((category: any) => ({ id: category.categoryID, name: category.categoryName })));
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };
  

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddSize = () => {
    setFormData(prev => ({
      ...prev,
      sizes: [...prev.sizes, newSize]
    }));
    setNewSize({ size: '', quantity: 0, priceAdjustment: 0 });
  };

  const handleSizeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewSize(prev => ({
      ...prev,
      [name]: name === 'size' ? value : Number(value)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Add your API call here
      navigate('/products');
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  useEffect(() => {

    fetchCategories();
  }, []);


  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <ArrowLeft className="cursor-pointer" onClick={() => navigate(-1)} />
        <h1 className="text-2xl font-bold ml-4">Create New Product</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
  <label className="block mb-2">Category</label>
  <select
    name="category"
    value={formData.category}
    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
    className="w-full p-2 border rounded"
    required
  >
    <option value="" disabled>
      Select a category
    </option>
    {categories.map((category) => (
      <option key={category.id} value={category.name}>
        {category.name}
      </option>
    ))}
  </select>
</div>



          <div>
            <label className="block mb-2">Subcategory</label>
            <input
              type="text"
              name="subcategory"
              value={formData.subcategory}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-2">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </div>

        <div>
          <label className="block mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            rows={4}
            required
          />
        </div>

        {/* Size Management Section */}
        <div className="border p-4 rounded">
          <h3 className="font-bold mb-4">Add Sizes</h3>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <input
              type="text"
              name="size"
              value={newSize.size}
              onChange={handleSizeInputChange}
              placeholder="Size"
              className="p-2 border rounded"
            />
            <input
              type="number"
              name="quantity"
              value={newSize.quantity}
              onChange={handleSizeInputChange}
              placeholder="Quantity"
              className="p-2 border rounded"
            />
            <input
              type="number"
              name="priceAdjustment"
              value={newSize.priceAdjustment}
              onChange={handleSizeInputChange}
              placeholder="Price Adjustment"
              className="p-2 border rounded"
            />
          </div>
          <button
            type="button"
            onClick={handleAddSize}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Add Size
          </button>

          {/* Display added sizes */}
          <div className="mt-4">
            {formData.sizes.map((size, index) => (
              <div key={index} className="bg-gray-100 p-2 mb-2 rounded">
                Size: {size.size}, Quantity: {size.quantity}, Adjustment: ${size.priceAdjustment}
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="bg-green-500 text-white px-6 py-2 rounded"
        >
          Create Product
        </button>
      </form>
    </div>
  );
};

export default CreateProduct;