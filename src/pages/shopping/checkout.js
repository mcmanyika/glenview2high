import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useRouter } from 'next/router';

const Checkout = () => {
  const { cart } = useCart();
  const [shippingDetails, setShippingDetails] = useState({
    name: '',
    address: '',
    city: '',
    zip: '',
    email: '',
  });
  const router = useRouter();

  const handleChange = (e) => {
    setShippingDetails({ ...shippingDetails, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Here you would typically send the order to your server or payment gateway
    console.log('Order submitted:', { shippingDetails, cart });
    alert('Order submitted!'); // Replace with actual payment integration
    // Redirect to confirmation page or clear cart
    router.push('/confirmation');
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0).toFixed(2);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty. Please add items to your cart before checking out.</p>
      ) : (
        <>
          <h2 className="text-lg font-semibold mb-2">Order Summary</h2>
          <table className="w-full mb-4">
            <thead>
              <tr>
                <th className="border px-4 py-2">Product</th>
                <th className="border px-4 py-2">Variant</th>
                <th className="border px-4 py-2">Quantity</th>
                <th className="border px-4 py-2">Price</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{item.product.name}</td>
                  <td className="border px-4 py-2">{item.variant}</td>
                  <td className="border px-4 py-2">{item.quantity}</td>
                  <td className="border px-4 py-2">${(item.product.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mb-4 font-bold">Total: ${calculateTotal()}</div>

          <h2 className="text-lg font-semibold mb-2">Shipping Details</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-1" htmlFor="name">Name:</label>
              <input
                type="text"
                name="name"
                value={shippingDetails.name}
                onChange={handleChange}
                required
                className="border p-2 w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1" htmlFor="address">Address:</label>
              <input
                type="text"
                name="address"
                value={shippingDetails.address}
                onChange={handleChange}
                required
                className="border p-2 w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1" htmlFor="city">City:</label>
              <input
                type="text"
                name="city"
                value={shippingDetails.city}
                onChange={handleChange}
                required
                className="border p-2 w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1" htmlFor="zip">Zip Code:</label>
              <input
                type="text"
                name="zip"
                value={shippingDetails.zip}
                onChange={handleChange}
                required
                className="border p-2 w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1" htmlFor="email">Email:</label>
              <input
                type="email"
                name="email"
                value={shippingDetails.email}
                onChange={handleChange}
                required
                className="border p-2 w-full"
              />
            </div>
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Complete Checkout
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default Checkout;
