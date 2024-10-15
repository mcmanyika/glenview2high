import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useCart } from '../../context/CartContext'; // Import cart context

const ProductDetailModal = ({ product, onClose }) => {
  const { addToCart } = useCart(); // Access addToCart function from cart context
  const [selectedVariant, setSelectedVariant] = useState('');
  const [variantStock, setVariantStock] = useState(0);
  const modalRef = useRef(null); // Reference to the modal container

  useEffect(() => {
    if (product.variants) {
      const defaultVariant = Object.keys(product.variants)[0];
      setSelectedVariant(defaultVariant);
      setVariantStock(product.variants[defaultVariant].stock);
    }
  }, [product]);

  const handleVariantChange = (variant) => {
    setSelectedVariant(variant);
    setVariantStock(product.variants[variant].stock);
  };

  const handleAddToCart = () => {
    if (selectedVariant && variantStock > 0) {
      addToCart(product, selectedVariant); // Add product to cart
    }
  };

  // Close modal if clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose(); // Close modal when clicking outside
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div ref={modalRef} className="bg-white rounded-lg p-6 max-w-4xl w-11/12 max-h-[90vh] overflow-auto">
        <button className="absolute top-2 right-4 text-gray-700" onClick={onClose}>
          &times;
        </button>
        <div className="flex flex-col lg:flex-row">
          <div className="w-full lg:w-1/2">
            <Image
              src={product.imageUrl}
              alt={product.name}
              height={640}
              width={640}
              className="w-full object-cover mb-4"
            />
          </div>

          {/* Variant Selection */}
          <div className="w-full lg:w-1/2 lg:ml-6">
            <h1 className="text-2xl font-bold">{product.name}</h1>
            <p className="text-3xl font-bold mt-4">${product.price.toFixed(2)}</p>

            <label htmlFor="variant" className="block mt-4 text-sm font-medium text-gray-700">
              Choose Size:
            </label>
            <select
              id="variant"
              value={selectedVariant}
              onChange={(e) => handleVariantChange(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              {product.variants && Object.keys(product.variants).map((variant) => (
                <option key={variant} value={variant}>
                  {variant} (Stock: {product.variants[variant].stock})
                </option>
              ))}
            </select>

            {selectedVariant && (
              <p className="mt-2 text-gray-500">
                Available stock for {selectedVariant}: {variantStock}
              </p>
            )}

            <button
              className="mt-4 w-full bg-main text-white px-4 py-2 rounded-full disabled:opacity-50"
              disabled={!selectedVariant || variantStock === 0}
              onClick={handleAddToCart}
            >
              {variantStock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
            
            {/* Go to Cart Button */}
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
  );
};

export default ProductDetailModal;
