import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, MapPin, Package, CheckCircle } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import useCartStore from '@/stores/useCartStore';
import useAuthStore from '@/stores/useAuthStore';
import useOrdersStore from '@/stores/useOrdersStore';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const Checkout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { items, getTotal, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const createOrder = useOrdersStore(state => state.createOrder);

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });

  const subtotal = getTotal();
  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateStep1 = () => {
    const { name, email, phone, address, city, state, pincode } = formData;
    if (!name || !email || !phone || !address || !city || !state || !pincode) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  const handleProceedToPayment = () => {
    if (!validateStep1()) return;
    setStep(2);
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    const res = await loadRazorpayScript();

    if (!res) {
      toast({
        title: "Error",
        description: "Razorpay SDK failed to load. Please check your connection.",
        variant: "destructive"
      });
      return;
    }

    const options = {
      key: 'rzp_test_YOUR_KEY_HERE', // Replace with actual Razorpay key
      amount: Math.round(total * 100), // Amount in paise
      currency: 'INR',
      name: 'BookHub',
      description: 'Book Purchase',
      image: '/logo.png',
      handler: function (response) {
        // Payment successful
        const order = createOrder({
          userId: user?.id,
          items: items,
          totalAmount: total,
          shippingAddress: formData,
          paymentId: response.razorpay_payment_id
        });

        clearCart();
        setStep(3);
        
        setTimeout(() => {
          navigate(`/orders`);
        }, 3000);
      },
      prefill: {
        name: formData.name,
        email: formData.email,
        contact: formData.phone
      },
      theme: {
        color: '#1e3a8a'
      }
    };

    const paymentObject = new window.Razorpay(options);
    
    paymentObject.on('payment.failed', function (response) {
      toast({
        title: "Payment Failed",
        description: response.error.description,
        variant: "destructive"
      });
    });

    paymentObject.open();
  };

  if (items.length === 0 && step !== 3) {
    navigate('/cart');
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Checkout - BookHub</title>
        <meta name="description" content="Complete your purchase securely with our checkout process." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-cream-50 to-blue-50">
        <Navigation />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step >= s ? 'bg-blue-900 text-white' : 'bg-gray-300 text-gray-600'
                  }`}>
                    {step > s ? <CheckCircle className="w-6 h-6" /> : s}
                  </div>
                  {s < 3 && (
                    <div className={`flex-1 h-1 mx-2 ${
                      step > s ? 'bg-blue-900' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-sm">
              <span className={step >= 1 ? 'text-blue-900 font-semibold' : 'text-gray-600'}>Shipping</span>
              <span className={step >= 2 ? 'text-blue-900 font-semibold' : 'text-gray-600'}>Payment</span>
              <span className={step >= 3 ? 'text-blue-900 font-semibold' : 'text-gray-600'}>Confirmation</span>
            </div>
          </div>

          {/* Step 1: Shipping Address */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl shadow-lg p-8"
            >
              <div className="flex items-center mb-6">
                <MapPin className="w-6 h-6 text-blue-900 mr-2" />
                <h2 className="text-2xl font-bold text-gray-900">Shipping Address</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    required
                  />
                </div>
              </div>

              <Button
                onClick={handleProceedToPayment}
                className="w-full mt-8 bg-blue-900 hover:bg-blue-800 text-white py-6 text-lg"
              >
                Continue to Payment
              </Button>
            </motion.div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-center mb-6">
                  <Package className="w-6 h-6 text-blue-900 mr-2" />
                  <h2 className="text-2xl font-bold text-gray-900">Order Summary</h2>
                </div>

                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <img src={item.coverImage} alt={item.title} className="w-16 h-20 object-cover rounded" />
                        <div>
                          <p className="font-semibold text-gray-900">{item.title}</p>
                          <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="font-semibold text-gray-900">₹{item.price * item.quantity}</p>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Tax (18% GST)</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-2xl font-bold text-blue-900 pt-2">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-center mb-6">
                  <CreditCard className="w-6 h-6 text-blue-900 mr-2" />
                  <h2 className="text-2xl font-bold text-gray-900">Payment Method</h2>
                </div>

                <div className="mb-6">
                  <p className="text-gray-700 mb-4">
                    You will be redirected to Razorpay's secure payment gateway to complete your purchase.
                  </p>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-900">
                      <strong>Shipping Address:</strong><br />
                      {formData.name}<br />
                      {formData.address}<br />
                      {formData.city}, {formData.state} - {formData.pincode}<br />
                      Phone: {formData.phone}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={() => setStep(1)}
                    variant="outline"
                    className="flex-1 border-blue-900 text-blue-900"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handlePayment}
                    className="flex-1 bg-amber-500 hover:bg-amber-600 text-white py-6 text-lg"
                  >
                    Pay ₹{total.toFixed(2)}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl shadow-lg p-8 text-center"
            >
              <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Order Placed Successfully!</h2>
              <p className="text-gray-700 mb-8">
                Thank you for your purchase. Your order has been confirmed and will be delivered soon.
              </p>
              <p className="text-sm text-gray-600">Redirecting to your orders...</p>
            </motion.div>
          )}
        </div>

        <Footer />
      </div>
    </>
  );
};

export default Checkout;
