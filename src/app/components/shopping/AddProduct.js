import React, { useState } from 'react';
import { ref, set } from 'firebase/database';
import { database } from '../../../../utils/firebaseConfig'; // Adjust the path to your firebaseConfig file
import { toast } from 'react-toastify';

const categories = [
  'Uniforms',
  'Sports Equipment',
];

// Predefined sizes for the dropdown
const sizeOptions = ['Small', 'Medium', 'Large', 'X-Large', 'XX-Large'];

const AddProduct = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState(''); // State for selected category
  const [sizes, setSizes] = useState(['']); // Manage sizes
  const [loading, setLoading] = useState(false);

  const handleSizeChange = (index, e) => {
    const { value } = e.target;
    const newSizes = [...sizes];
    newSizes[index] = value;
    setSizes(newSizes);
  };

  const addSize = () => {
    setSizes([...sizes, '']); // Add a new size
  };

  const removeSize = (index) => {
    const newSizes = sizes.filter((_, i) => i !== index); // Remove the size at the index
    setSizes(newSizes);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate price
    if (parseFloat(price) <= 0) {
      toast.error('Please enter a valid price greater than zero.');
      return;
    }

    // Validate sizes
    const invalidSize = sizes.some(size => !size);
    if (invalidSize) {
      toast.error('Please select valid sizes.');
      return;
    }

    // Create a new product object
    const newProduct = {
      name,
      price: parseFloat(price),
      description,
      imageUrl,
      category, // Include category
      sizes, // Include sizes
      createdAt: new Date().toISOString(), // Add a timestamp
    };

    try {
      setLoading(true); // Start loading state
      // Reference to the 'products' node in the database
      const productRef = ref(database, `products/${Date.now()}`); // Use current timestamp as a unique ID
      await set(productRef, newProduct); // Store the product in the database

      // Show success message
      toast.success('Product added successfully!');

      // Clear form fields
      setName('');
      setPrice('');
      setDescription('');
      setImageUrl('');
      setCategory(''); // Reset category
      setSizes(['']); // Reset sizes
    } catch (error) {
      console.error('Error adding product: ', error);
      toast.error('Failed to add product. Please try again.');
    } finally {
      setLoading(false); // End loading state
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded shadow-md">
      <h2 className="text-lg font-bold mb-4">Add New Product</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium" htmlFor="name">Product Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-300 rounded w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            placeholder="Enter product name"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium" htmlFor="price">Price</label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="border border-gray-300 rounded w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            placeholder="Enter price"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium" htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border border-gray-300 rounded w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
            required
            placeholder="Enter product description"
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium" htmlFor="imageUrl">Image URL</label>
          <input
            type="text"
            id="imageUrl"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="border border-gray-300 rounded w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            placeholder="Enter image URL"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium" htmlFor="category">Category</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border border-gray-300 rounded w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select a category</option>
            {categories.map((cat, index) => (
              <option key={index} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <h3 className="text-md font-bold mb-2">Product Sizes</h3>
        {sizes.map((size, index) => (
          <div key={index} className="mb-4 flex space-x-2">
            <select
              name="size"
              value={size}
              onChange={(e) => handleSizeChange(index, e)}
              className="border border-gray-300 rounded w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select a size</option>
              {sizeOptions.map((option, idx) => (
                <option key={idx} value={option}>{option}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => removeSize(index)}
              className="bg-red-500 text-white rounded px-2 py-2"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addSize}
          className="bg-green-500 text-white rounded px-4 py-2 m-4"
        >
          Add Size
        </button>

        <button
          type="submit"
          className={`bg-blue-500 text-white rounded px-4 py-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Product'}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
