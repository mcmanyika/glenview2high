import Image from 'next/image';
import Layout from '../../app/components/Layout2';
import { useCart } from '../../context/CartContext';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity } = useCart();

  const handleQuantityChange = (productId, variant, newQuantity) => {
    updateQuantity(productId, variant, parseInt(newQuantity));
  };

  // Calculate total price of items in the cart
  const totalPrice = cart.reduce((total, item) => total + item.product.price * item.quantity, 0).toFixed(2);

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            <table className="w-full mb-4">
              <thead>
                <tr>
                <th className="border px-4 py-2"></th>
                  <th className="border px-4 py-2">Product</th>
                  <th className="border px-4 py-2">Variant</th>
                  <th className="border px-4 py-2">Quantity</th>
                  <th className="border px-4 py-2">Price</th>
                  <th className="border px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item, index) => (
                  <tr key={index}>
                    <td className="border px-4 py-2"><Image src={item.product.imageUrl} width={60} height={30} alt='' /></td>
                    <td className="border px-4 py-2">{item.product.name}</td>
                    <td className="border px-4 py-2">{item.variant}</td>
                    <td className="border px-4 py-2">
                      <input
                        type="number"
                        value={item.quantity}
                        min="0"
                        onChange={(e) =>
                          handleQuantityChange(item.product.id, item.variant, e.target.value)
                        }
                        className="w-16 text-center border"
                      />
                    </td>
                    <td className="border px-4 py-2">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </td>
                    <td className="border px-4 py-2">
                      <button
                        onClick={() => removeFromCart(item.product.id, item.variant)}
                        className="bg-red-600 text-white px-2 py-1 rounded"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Total Price Display */}
            <div className="text-lg text-right font-bold">
              Total Price: ${totalPrice}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Cart;
