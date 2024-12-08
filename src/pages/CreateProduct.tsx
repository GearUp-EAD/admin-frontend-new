import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload } from "lucide-react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase.js"; // Import the Firebase storage instance

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
  size: string; // Ensure this is a string matching the 'value' from Sizes
  quantity: number;
  priceAdjustment: number;
}

interface Sizes {
  sizeId: string;
  value: string; // Changed from number to string
  sizeTypeId: string;
}

interface ApiPayload {
  name: string;
  description: string;
  basePrice: number;
  categoryId: string;
  imageUrl: string;
  variants: Variants[];
}

interface Variants {
  sizeId: string;
  stockQuantity: number;
  priceAdjustment: number;
}

const CreateProduct = () => {
  const navigate = useNavigate();

  const [uploading, setUploading] = useState(false);
  const [productImage, setProductImage] = useState<string | null>(null);
  // const sizeOptions = ["XS", "S", "M", "L", "XL", "2XL", "3XL"];
  const [sizeOptions, setSizeOptions] = useState<Sizes[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
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

  const [apiPayload, setApiPayload] = useState<ApiPayload>({
    name: "",
    description: "",
    basePrice: 0,
    categoryId: "",
    imageUrl: "",
    variants: [],
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
    } catch (error) {
      console.error("Error fetching sizes:", error);
    }
  };

  const handleAddSize = () => {
    if (newSize.size) {
      setSizes([
        ...sizes,
        {
          size: newSize.size, // This should be the string value like "Large"
          quantity: newSize.quantity,
          priceAdjustment: newSize.priceAdjustment,
        },
      ]);
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
    setApiPayload((prev) => ({
      ...prev,
      [name]: value,
    }));
    console.log("api Payload", apiPayload);
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
      // Map form data and sizes to API payload
      const payload = mapProductFormToApiPayload(
        formData,
        sizes,
        sizeOptions,
        subcategories
      );
      console.log("payload", payload);

      // Send payload to API
      const response = await fetch("http://localhost:8080/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([payload]),
      });

      if (!response.ok) {
        throw new Error("Failed to create product");
      }

      const result = await response.json();
      console.log("Product created:", result);
      navigate("/products"); // Redirect after successful creation
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  const mapProductFormToApiPayload = (
    formData: ProductForm,
    sizes: Size[],
    sizeOptions: Sizes[],
    subcategories: { id: string; name: string }[]
  ): ApiPayload => {
    // Find the subcategory ID that matches the selected subcategory name
    const matchingSubcategory = subcategories.find(
      (subcategory) => subcategory.name === formData.subcategory
    );

    if (!matchingSubcategory) {
      throw new Error(
        `No matching subcategory found for ${formData.subcategory}`
      );
    }

    const variants = sizes.map((size) => {
      const matchingSizeOption = sizeOptions.find(
        (option) => option.value === size.size
      );

      if (!matchingSizeOption) {
        throw new Error(`No matching size found for ${size.size}`);
      }

      return {
        sizeId: matchingSizeOption.sizeId,
        stockQuantity: size.quantity,
        priceAdjustment: size.priceAdjustment,
      };
    });

    return {
      name: formData.name,
      description: formData.description,
      basePrice: parseFloat(formData.price),
      categoryId: matchingSubcategory.id, // Use the subcategory ID
      imageUrl: formData.image,
      variants,
    };
  };
  // In your handleSubmit or where you prepare the product creation

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCategoryId = e.target.value;
    setFormData({
      ...formData,
      category: selectedCategoryId,
      subcategory: "",
    });
    fetchSubcategories(selectedCategoryId); // Fetch subcategories
    console.log("api payload :", apiPayload);
  };

  const handleSubcategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, subcategory: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const storageRef = ref(storage, `profile-images/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      setUploading(true);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          console.error("Upload failed:", error);
          setUploading(false);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setProductImage(downloadURL);
          console.log("File available at", downloadURL);
          setFormData({ ...formData, image: downloadURL });
          setUploading(false);
          setUploadProgress(0);
        }
      );
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
              onChange={handleCategoryChange}
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
              onChange={handleSubcategoryChange}
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

        <div className="">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            disabled={uploading}
            className="block w-full text-sm text-gray-500
          file:mr-4  file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-brown-50 file:text-brown-500
          hover:file:bg-brown-100
          disabled:opacity-50"
          />
          {uploading && (
            <div className="mt-4 h-5 w-full bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              >
                <span className="text-xs text-white px-2">
                  {uploadProgress.toFixed(0)}%
                </span>
              </div>
            </div>
          )}
          {productImage && (
            <div className="mt-5">
              <img
                src={productImage}
                alt="Uploaded preview"
                className="max-w-[300px] h-auto rounded-lg shadow-md"
              />
            </div>
          )}
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
              value={newSize.priceAdjustment || ""} // Convert 0 to empty string
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
