import React, { useState, useEffect } from "react";

interface Category {
  id: string;
  name: string;
}

interface Subcategory {
  id: string;
  name: string;
}

interface Product {
  category: string;
  subcategory: string;
}

const CategorySelector = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("");
  const [formData, setFormData] = useState<Product>({
    category: '',
    subcategory: '',
  });


  

  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:33000/api/categories/parents");
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
        `http://localhost:33000/api/categories/${parentCategoryId}/subcategories`
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

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCategoryId = e.target.value;
    setSelectedCategory(selectedCategoryId);
    setSelectedSubcategory(""); // Reset subcategory when category changes
    fetchSubcategories(selectedCategoryId); // Fetch subcategories
    setFormData({
      ...formData,
      category: selectedCategoryId,
      subcategory: ''
    });
    console.log(formData);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <label className="block mb-2">Category</label>
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="w-full p-2 border rounded"
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
          value={selectedSubcategory}
          onChange={(e) => setSelectedSubcategory(e.target.value)}
          className="w-full p-2 border rounded"
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
    </div>
  );
};

export default CategorySelector;
