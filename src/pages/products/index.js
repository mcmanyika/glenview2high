import { useEffect, useState, useRef } from 'react';
import { ref, get } from 'firebase/database';
import { database } from '../../../utils/firebaseConfig';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '../../app/components/Layout2';
import { useCart } from '../../context/CartContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { setTotalItems } from '../../app/store'; 

const Products = () => {
  const { addToCart, cart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [categories, setCategories] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null); // Track the selected product
  const [isModalOpen, setIsModalOpen] = useState(false);  // State for controlling modal

  const [selectedVariant, setSelectedVariant] = useState('');
  const [variantStock, setVariantStock] = useState(0);

  const modalRef = useRef(null); // Reference for the modal

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsRef = ref(database, 'products');
        const snapshot = await get(productsRef);

        if (snapshot.exists()) {
          const data = snapshot.val();
          const productList = Object.keys(data).map((key) => ({ id: key, ...data[key] }));
          console.log('Fetched Products:', productList);
          setProducts(productList);

          const uniqueCategories = Array.from(new Set(productList.map(product => product.category)));
          setCategories(['All Categories', ...uniqueCategories]);
        } else {
          setError('No products available.');
        }
      } catch (error) {
        console.error('Error fetching products: ', error);
        setError('Failed to load products.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    setTotalItems(cart.length);
  }, [cart]);

  useEffect(() => {
    if (selectedProduct && selectedProduct.variants) {
      const defaultVariant = Object.keys(selectedProduct.variants)[0];
      setSelectedVariant(defaultVariant);
      setVariantStock(selectedProduct.variants[defaultVariant].stock);
    }
  }, [selectedProduct]);

  const handleVariantChange = (variant) => {
    setSelectedVariant(variant);
    setVariantStock(selectedProduct.variants[variant].stock);
  };

  const handleAddToCart = () => {
    if (selectedVariant && variantStock > 0) {
      addToCart(selectedProduct, selectedVariant); // Add product to cart
    }
  };

  const handleIconClick = (product) => {
    setSelectedProduct(product); // Set selected product to state
    setIsModalOpen(true); // Open the modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
    setSelectedProduct(null); // Clear selected product
  };

  const handleOverlayClick = (e) => {
    // Check if the click was on the overlay (background)
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      handleCloseModal();
    }
  };

  const sortProducts = (products, option) => {
    const sorted = [...products];
    switch (option) {
      case 'priceAsc':
        return sorted.sort((a, b) => a.price - b.price);
      case 'priceDesc':
        return sorted.sort((a, b) => b.price - a.price);
      case 'nameAsc':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'nameDesc':
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      default:
        return sorted;
    }
  };

  const filteredProducts = selectedCategory === 'All Categories' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  const sortedProducts = sortProducts(filteredProducts, sortOption);

  // Pagination logic
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = sortedProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

  if (loading) return <div className="text-center"><div className="spinner"></div></div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between">
          {/* Category Filter */}
          <aside className="w-full md:w-1/3 lg:w-1/4 p-4">
            <h1 className="text-2xl font-bold mb-4">Categories</h1>
            <div className="mt-2">
              {categories.map((category, index) => (
                <label key={index} className="flex items-center mb-2">
                  <input
                    type="radio"
                    value={category}
                    checked={selectedCategory === category}
                    onChange={() => setSelectedCategory(category)}
                    className="hidden peer"
                  />
                  <span className="inline-flex items-center justify-center w-5 h-5 bg-gray-200 border border-gray-300 rounded-full mr-2 peer-checked:bg-blue-500 peer-checked:border-transparent transition"></span>
                  {category}
                </label>
              ))}
            </div>
            <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mt-4">Sort By</label>
            <select
              id="sort"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="">None</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
              <option value="nameAsc">Name: A to Z</option>
              <option value="nameDesc">Name: Z to A</option>
            </select>
          </aside>
          
          {/* Product List */}
          <main className="w-full md:w-2/3 lg:w-3/4 p-4">
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 w-full">
              {currentProducts.map((product) => (
                <div key={product.id} className="relative border p-4 rounded transition-shadow hover:shadow-lg">
                  <div className="relative group">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      width={640}
                      height={640}
                      className="w-full h-40 object-cover rounded"
                    />
                    {/* Shopping Cart Icon */}
                    <FontAwesomeIcon
                      icon={faShoppingCart}
                      onClick={() => handleIconClick(product)}
                      className="absolute bottom-2 right-2 text-white border border-white rounded-full w-4 h-4 p-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100 cursor-pointer"
                    />
                  </div>
                  <div className=' cursor-pointer' onClick={() => handleIconClick(product)}>
                    <h2 className="text-lg font-bold mt-2">{product.name}</h2>
                  </div>
                  <p className="text-gray-700">${product.price.toFixed(2)}</p>
                </div>
              ))}
            </div>
            {/* Pagination Controls */}
            <div className="flex justify-center mt-10">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="px-4 py-2 mx-2 bg-gray-200 hover:bg-gray-300 rounded"
              >
                Previous
              </button>
              <span className="mx-2">{currentPage} / {totalPages}</span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="px-4 py-2 mx-2 bg-gray-200 hover:bg-gray-300 rounded"
              >
                Next
              </button>
            </div>
          </main>
        </div>

        {/* Modal for Product Details */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" onClick={handleOverlayClick}>
            <div ref={modalRef} className="bg-white rounded-lg p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
              
              <Image
                src={selectedProduct.imageUrl}
                alt={selectedProduct.name}
                width={640}
                height={640}
                className="w-full h-40 object-cover pb-2 rounded"
              />
              <h2 className="text-2xl font-bold mb-2">{selectedProduct.name}</h2>
              <p className="text-lg font-semibold mt-2">${selectedProduct.price.toFixed(2)}</p>

              <h3 className="mt-4 font-bold">Choose a variant:</h3>
<div className="mt-2 flex space-x-2">
  {Object.keys(selectedProduct.variants || {}).map((variant) => (
    <label
      key={variant}
      className="cursor-pointer flex items-center justify-center border-2 border-gray-300 rounded-md p-2 transition hover:bg-gray-100"
    >
      <input
        type="radio"
        value={variant}
        checked={selectedVariant === variant}
        onChange={() => handleVariantChange(variant)}
        className="hidden peer"
      />
      <span
        className={`block w-6 h-6 rounded-sm ${
          selectedVariant === variant
            ? 'bg-blue-500 border-blue-500'
            : 'bg-white border-gray-300'
        } peer-checked:bg-blue-500 peer-checked:border-blue-500`}
      ></span>
      <span className="ml-2">{variant} - {selectedProduct.variants[variant].stock} in stock</span>
    </label>
  ))}
</div>

              <div className="mt-4">
                <div className='w-full'>
                  <button
                  onClick={handleAddToCart}
                  disabled={variantStock <= 0}
                  className={`w-full px-4 py-2 bg-main text-white rounded-full ${variantStock <= 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Add to Cart
                </button>

                </div>
                <div className='w-full'>
                <button
                    className="mt-2 w-full bg-blue-500 text-white px-4 py-2 rounded-full"
                    onClick={() => {
                      // Redirect to the cart page, adjust according to your routing
                      window.location.href = '/shopping/cart';
                    }}
                  >
                    Go to Cart
                  </button>
                </div>
                
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Products;
