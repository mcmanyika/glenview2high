'use client';
import CheckoutPage from "../../app/components/CheckoutPage";
import convertToSubcurrency from "../../app/lib/convertToSubcurrency";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import SmartBlankLayout from "../../app/components/SmartBlankLayout";
import { useCart } from '../../context/CartContext';
import { useState, useEffect } from 'react';

if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
  throw new Error("STRIPE_PUBLIC_KEY is not defined");
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

export default function Checkout() {
  const { cart } = useCart();
  const [loading, setLoading] = useState(false);

  // Ensure cart is defined and not empty
  useEffect(() => {
    if (!cart || cart.length === 0) {
      
      window.location.href = '/products';  // Redirect if cart is empty
    }
  }, [cart]);

  // Calculate total price and convert it to a number for Stripe
  const totalPrice = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  const amount = parseFloat(totalPrice.toFixed(2));  // Ensure amount is a float

  return (
    <SmartBlankLayout>
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <p>Processing payment, please wait...</p>
        </div>
      ) : (
        <Elements
          stripe={stripePromise}
          options={{
            mode: "payment",
            amount: convertToSubcurrency(amount),  // Convert amount to subunit (e.g., cents)
            currency: "usd",  // Ensure this is the correct currency code
          }}
        >
          <CheckoutPage amount={amount} />
        </Elements>
      )}
    </SmartBlankLayout>
  );
}
