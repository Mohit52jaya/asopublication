import React from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import useCartStore from '@/stores/useCartStore';
import { Button } from '@/components/ui/button';

const ShoppingCart = () => {
  const { items, updateQuantity, removeFromCart, getTotal } = useCartStore();
  const navigate = useNavigate();

  const subtotal = getTotal();
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal + tax;

  if (items.length === 0) {
    return (
      <>
        <Helmet>
          <title>Shopping Cart - BookHub</title>
          <meta name="description" content="View your shopping cart and proceed to checkout." />
        </Helmet>

        <div className="min-h-screen bg-gradient-to-br from-cream-50 to-blue-50 flex flex-col">
          <Navigation />

          <div className="flex-1 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <ShoppingBag className="w-24 h-24 text-gray-400 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
              <p className="text-gray-600 mb-8">Start adding some books to your cart!</p>
              <Link to="/books">
                <Button className="bg-blue-900 hover:bg-blue-800">
                  Browse Books
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </motion.div>
          </div>

          <Footer />
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Shopping Cart - BookHub</title>
        <meta name="description" content="Review your cart items and proceed to checkout." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-cream-50 to-blue-50">
        <Navigation />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold text-blue-900 mb-8">Shopping Cart</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="flex gap-6">
                    <img
                      src={item.coverImage}
                      alt={item.title}
                      className="w-24 h-32 object-cover rounded-lg"
                    />

                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{item.title}</h3>
                      <p className="text-gray-600 mb-2">{item.author}</p>
                      <p className="text-2xl font-bold text-blue-900">₹{item.price}</p>
                    </div>

                    <div className="flex flex-col items-end justify-between">
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>

                      <div className="flex items-center gap-3 bg-gray-100 rounded-lg px-3 py-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="text-blue-900 hover:text-blue-700"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-semibold text-gray-900 w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="text-blue-900 hover:text-blue-700"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <p className="text-lg font-bold text-gray-900">
                        ₹{item.price * item.quantity}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Tax (18% GST)</span>
                    <span className="font-semibold">₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-4 flex justify-between text-xl font-bold text-blue-900">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white py-6 text-lg"
                >
                  Proceed to Checkout
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>

                <Link to="/books">
                  <Button variant="outline" className="w-full mt-4 border-blue-900 text-blue-900 hover:bg-blue-50">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default ShoppingCart;
