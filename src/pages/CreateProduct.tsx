import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload } from "lucide-react";

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

interface Sizes {
  sizeId: string;
  sizeTypeId: string;
  value: number;
}

interface ApiPayload {
  productId: string;
  name: string;
  description: string;
  basePrice: number;
  categoryName: string;
  imageUrl: string;
  variants: Variants[];
}

interface Variants {
  variantId: string;
  quantity: number;
  priceAdjustment: number;
}

const CreateProduct = () => {
  const navigate = useNavigate();
  // const sizeOptions = ["XS", "S", "M", "L", "XL", "2XL", "3XL"];
  const [sizeOptions, setSizeOptions] = useState<Sizes[]>([]);

  const [selectedSizeType, setSelectedSizeType] = useState<string>("");
  const [sizes, setSizes] = useState<Size[]>([]);
  const [formData, setFormData] = useState<ProductForm>({
    name: "",
    category: "",
    subcategory: "",
    price: "",
    description: "",
    image: "",
    sizes: [],
  });
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );
  const [subcategories, setSubcategories] = useState<
    { id: string; name: string }[]
  >([]);
  const [sizeTypes, setSizeTypes] = useState<
    { sizeTypeId: string; name: string }[]
  >([]);
  const [newSize, setNewSize] = useState<Size>({
    size: "",
    quantity: 0,
    priceAdjustment: 0,
  });

  const fetchSizes = async (sizeTypeId: string) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/sizes/type/${sizeTypeId}`
      );
      const data = await response.json();
      setSizeOptions(data);

      // setSizes(data);
    } catch (error) {
      console.error("Error fetching sizes:", error);
    }
  };

  const handleAddSize = () => {
    if (newSize.size) {
      setSizes([...sizes, newSize]);
      setNewSize({ size: "", quantity: 0, priceAdjustment: 0 });
    }
  };

  const handleRemoveSize = (index: number) => {
    setSizes(sizes.filter((_, i) => i !== index));
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/categories/parents"
      );
      const data = await response.json();
      setCategories(
        data.map((category: any) => ({
          id: category.categoryID,
          name: category.categoryName,
        }))
      );
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  const fetchSubcategories = async (parentCategoryId: string) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/categories/${parentCategoryId}/subcategories`
      );
      const data = await response.json();
      setSubcategories(
        data.map((subcategory: any) => ({
          id: subcategory.categoryID,
          name: subcategory.categoryName,
        }))
      );
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };
  const fetchSizeTypes = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/sizes/type");
      const data = await response.json();
      setSizeTypes(data);
    } catch (error) {
      console.error("Error fetching size types:", error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSizeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewSize((prev) => ({
      ...prev,
      [name]: name === "size" ? value : Number(value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log("Creating product:", formData);
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchSizeTypes();
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
              onChange={(e) => {
                const selectedCategoryId = e.target.value;
                setFormData({
                  ...formData,
                  category: selectedCategoryId,
                  subcategory: "",
                });
                fetchSubcategories(selectedCategoryId); // Fetch subcategories
              }}
              className="w-full p-2 border rounded"
              required
            >
              <option value="" disabled>
                Select a category
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2">Subcategory</label>
            <select
              name="subcategory"
              value={formData.subcategory}
              onChange={(e) =>
                setFormData({ ...formData, subcategory: e.target.value })
              }
              className="w-full p-2 border rounded"
              required
              disabled={!subcategories.length}
            >
              <option value="" disabled>
                Select a subcategory
              </option>
              {subcategories.map((subcategory) => (
                <option key={subcategory.id} value={subcategory.name}>
                  {subcategory.name}
                </option>
              ))}
            </select>
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
        <div>
          <label className="block mb-2">Size Type</label>
          <select
            name="sizeType"
            value={selectedSizeType} // or defaultValue for uncontrolled
            onChange={(e) => {
              setSelectedSizeType(e.target.value);
              fetchSizes(e.target.value);
            }}
            className="w-full p-2 border rounded"
            required
          >
            <option value="" disabled>
              Select a size type
            </option>
            {sizeTypes.map((type) => (
              <option key={type.sizeTypeId} value={type.sizeTypeId}>
                {type.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-4">
            <select
              value={newSize.size}
              onChange={(e) => setNewSize({ ...newSize, size: e.target.value })}
              className="p-2 border rounded"
            >
              <option value="">Select Size</option>
              {sizeOptions.map((size) => (
                <option key={size.sizeId} value={size.value}>
                  {size.value}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Quantity"
              className="p-2 border rounded"
              value={newSize.quantity || ""} // Convert 0 to empty string
              onChange={(e) =>
                setNewSize({ ...newSize, quantity: parseInt(e.target.value) })
              }
            />
            <input
              type="number"
              placeholder="Price Adjustment"
              className="p-2 border rounded"
              value={newSize.priceAdjustment|| ""} // Convert 0 to empty string
              onChange={(e) =>
                setNewSize({
                  ...newSize,
                  priceAdjustment: parseFloat(e.target.value),
                })
              }
            />
            <button
              onClick={handleAddSize}
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Add Size
            </button>
          </div>

          <div className="space-y-2">
            {sizes.map((size, index) => (
              <div key={index} className="grid grid-cols-4 gap-4 items-center">
                <span>{size.size}</span>
                <span>{size.quantity}</span>
                <span>${size.priceAdjustment}</span>
                <button
                  onClick={() => handleRemoveSize(index)}
                  className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                >
                  Remove
                </button>
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

{
  /* <div className="border p-4 rounded">
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

          {/* Display added sizes */
}
//   <div className="mt-4">
//     {formData.sizes.map((size, index) => (
//       <div key={index} className="bg-gray-100 p-2 mb-2 rounded">
//         Size: {size.size}, Quantity: {size.quantity}, Adjustment: $
//         {size.priceAdjustment}
//       </div>
//     ))}
//   </div>
// </div>
