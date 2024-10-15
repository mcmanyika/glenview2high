import { useState, useEffect } from 'react';
import { ref, get } from 'firebase/database';
import { useRouter } from 'next/router';
import { database } from '../../../utils/firebaseConfig'; // Adjust the path if necessary
import { useCart } from '../../context/CartContext'; // Import cart context
import Image from 'next/image';
import Layout from '../../app/components/Layout2';

const ProductDetail = () => {
  const router = useRouter();
  const { id } = router.query; // Get the product ID from the URL
  const { addToCart } = useCart(); // Access addToCart function from cart context
  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState('');
  const [variantStock, setVariantStock] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch product data from Firebase
  useEffect(() => {
    const fetchProduct = async () => {
      if (id) {
        try {
          const productRef = ref(database, `products/${id}`);
          const snapshot = await get(productRef);

          if (snapshot.exists()) {
            const data = snapshot.val();
            setProduct(data);
            // Set default variant and stock if available
            if (data.variants) {
              const defaultVariant = Object.keys(data.variants)[0]; // Get the first variant as default
              setSelectedVariant(defaultVariant);
              setVariantStock(data.variants[defaultVariant].stock);
            }
          } else {
            console.log('Product not found');
          }
        } catch (error) {
          console.error('Error fetching product data: ', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProduct();
  }, [id]);

  // Handle variant selection
  const handleVariantChange = (variant) => {
    if (product && product.variants[variant]) {
      setSelectedVariant(variant);
      setVariantStock(product.variants[variant].stock);
    }
  };

  // Handle adding the product to the cart
  const handleAddToCart = () => {
    if (selectedVariant && variantStock > 0) {
      addToCart(product, selectedVariant); // Add the product with the selected variant to the cart
    }
  };

  // Navigate to the cart page
  const handleShowCart = () => {
    router.push('/shopping/cart'); // Adjust the path to your cart page
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return <div>Product not found.</div>;
  }

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <div className="flex flex-col lg:flex-row">
          <div className="w-2/5">
            <Image
              src={product.imageUrl}
              alt={product.name}
              height={640}
              width={640}
              className="w-full object-cover mt-4 mb-6"
            />
          </div>

          {/* Variant Selection */}
          <div className="w-2/5 m-4 p-4 pt-0">
            <h1 className="text-3xl font-bold pb-10">{product.name}</h1>
            <hr />
            <p className="text-gray-700 pt-4">{product.description}</p>
          </div>
          <div className='w-52 items-center border rounded-lg p-4'>
            <p className="text-3xl font-bold mt-4 mb-6">${product.price.toFixed(2)}</p>
            <label htmlFor="variant" className="block text-sm font-medium text-gray-700">Choose Size:</label>
            <select
              id="variant"
              value={selectedVariant}
              onChange={(e) => handleVariantChange(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="" disabled>Select a size</option>
              {product.variants && Object.keys(product.variants).map((variant) => (
                <option key={variant} value={variant}>
                  {variant} (Stock: {product.variants[variant].stock})
                </option>
              ))}
            </select>

            {/* Display stock for selected variant */}
            {selectedVariant && (
              <p className="mt-2 text-gray-500">
                Available stock for {selectedVariant}: {variantStock}
              </p>
            )}
            
            {/* Add to Cart Button */}
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
              onClick={handleShowCart}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;
