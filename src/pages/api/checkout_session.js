// pages/api/checkout_session.js
import { getSession } from 'next-auth/react';
import { Stripe } from 'stripe';

// Initialize Stripe with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { items, customerInfo } = req.body;

      // Ensure customer info and items are provided
      if (!items || !customerInfo) {
        return res.status(400).json({ error: 'Missing customer info or items' });
      }

      // Create a checkout session with Stripe
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: items.map((item) => ({
          price_data: {
            currency: 'usd',
            product_data: {
              name: item.name,
            },
            unit_amount: item.price * 100, // Convert to cents
          },
          quantity: item.quantity,
        })),
        mode: 'payment',
        customer_email: customerInfo.email,
        success_url: `${process.env.NEXTAUTH_URL}/shopping/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXTAUTH_URL}/shopping/cancel`,
      });

      // Send the session ID back to the client
      res.status(200).json({ id: session.id });
    } catch (error) {
      console.error('Error creating checkout session', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
