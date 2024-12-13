import React, { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";

interface Category {
  categoryID: string;
  categoryName: string;
  imageUrl: string | null;
  parentCategoryID: string | null;
}

interface Product {
  productId: string;
  name: string;
  description: string;
  basePrice: number;
  imageUrl: string | null;
  categoryId: string;
}

const Products = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Category[]>([]);
  const [selectedParentID, setSelectedParentID] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [showProducts, setShowProducts] = useState<boolean>(false);


  

  // Fetch parent categories
  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:33000/api/categories/parents");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching parent categories:", error);
    }
  };

  // Fetch subcategories of a parent category
  const fetchSubcategories = async (parentID: string) => {
    try {
      const response = await fetch(`http://localhost:33000/api/categories/${parentID}/subcategories
`);
      const data = await response.json();
      setSubcategories(data);
      setSelectedParentID(parentID); // Set the selected parent category
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  const fetchProducts = async (categoryId: string) => {
    try {
      const response = await fetch(`http://localhost:33000/api/products?categoryId=${categoryId}`);
      const data = await response.json();
      setProducts(data);
      console.log(data);
      setShowProducts(true);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Products</h2>
      </div>

      {selectedParentID === null ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div
              key={category.categoryID}
              onClick={() => fetchSubcategories(category.categoryID)}
              className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="relative h-48">
                <img
                  src={category.imageUrl ?? "https://via.placeholder.com/300"}
                  alt={category.categoryName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <h3 className="text-white text-2xl font-bold">{category.categoryName}</h3>
                </div>
              </div>
              <div className="p-4 flex justify-between items-center">
                <span className="text-gray-600">5 items</span>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        
        <div>
    {!showProducts ? (
      <div>
        <button
className="mb-4 px-4 py-2 bg-[#8B4513] text-white rounded"
onClick={() => setSelectedParentID(null)}
        >
          Back
        </button>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subcategories.map((subcategory) => (
            <div
              key={subcategory.categoryID}
              onClick={() => fetchProducts(subcategory.categoryID)}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              <div className="relative h-48">
                <img
                  src={subcategory.imageUrl ?? "https://via.placeholder.com/300"}
                  alt={subcategory.categoryName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <h3 className="text-white text-2xl font-bold">{subcategory.categoryName}</h3>
                </div>
              </div>
              <div className="p-4 flex justify-between items-center">
                <span className="text-gray-600">Subcategory Details</span>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          ))}
        </div>
      </div>
    ) : (
      // Products view
      <div>
        <button
          className="mb-4 px-4 py-2 bg-[#8B4513] text-white rounded"
          onClick={() => setShowProducts(false)}
        >
          Back
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.productId}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              <div className="relative h-48">
                <img
                  src={product.imageUrl ?? "https://via.placeholder.com/300"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <h3 className="text-white text-2xl font-bold">{product.name}</h3>
                </div>
              </div>
              <div className="p-4">
                <p className="text-gray-600">{product.description}</p>
                <p className="text-gray-600">Price: Rs.{product.basePrice}</p>
              </div>
            </div>
          ))}
          </div>
      </div>
    )}
  </div>
)}
      <div>
  
  
</div>
    </div>
  );
};

export default Products;
