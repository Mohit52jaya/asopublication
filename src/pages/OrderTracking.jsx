import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, Clock, Truck, CheckCircle, XCircle } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import useAuthStore from '@/stores/useAuthStore';
import useOrdersStore from '@/stores/useOrdersStore';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const OrderTracking = () => {
  const { user } = useAuthStore();
  const { getUserOrders, cancelOrder } = useOrdersStore();
  const { toast } = useToast();

  const orders = getUserOrders(user?.id || '').sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const handleCancelOrder = (orderId) => {
    const result = cancelOrder(orderId);
    if (result.success) {
      toast({
        title: "Order Cancelled",
        description: "Your order has been cancelled successfully."
      });
    } else {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive"
      });
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-6 h-6 text-yellow-500" />;
      case 'shipped':
        return <Truck className="w-6 h-6 text-blue-500" />;
      case 'delivered':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-6 h-6 text-red-500" />;
      default:
        return <Package className="w-6 h-6 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (orders.length === 0) {
    return (
      <>
        <Helmet>
          <title>My Orders - BookHub</title>
          <meta name="description" content="Track and manage your book orders." />
        </Helmet>

        <div className="min-h-screen bg-gradient-to-br from-cream-50 to-blue-50 flex flex-col">
          <Navigation />

          <div className="flex-1 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <Package className="w-24 h-24 text-gray-400 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-900 mb-2">No orders yet</h2>
              <p className="text-gray-600 mb-8">Start shopping and your orders will appear here!</p>
              <Link to="/books">
                <Button className="bg-blue-900 hover:bg-blue-800">
                  Browse Books
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
        <title>My Orders - BookHub</title>
        <meta name="description" content="Track and manage your book orders." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-cream-50 to-blue-50">
        <Navigation />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold text-blue-900 mb-8">My Orders</h1>

          <div className="space-y-6">
            {orders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                <div className="bg-gradient-to-r from-blue-900 to-blue-800 px-6 py-4">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="text-amber-400 font-semibold">Order ID: {order.id}</p>
                      <p className="text-blue-100 text-sm">
                        Placed on {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className={`px-4 py-2 rounded-full ${getStatusColor(order.status)} flex items-center gap-2`}>
                      {getStatusIcon(order.status)}
                      <span className="font-semibold capitalize">{order.status}</span>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-2">Items:</h3>
                    <div className="space-y-3">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-4">
                          <img
                            src={item.coverImage}
                            alt={item.title}
                            className="w-16 h-20 object-cover rounded"
                          />
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">{item.title}</p>
                            <p className="text-sm text-gray-600">{item.author}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">₹{item.price}</p>
                            <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t pt-4 mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-700">Total Amount:</span>
                      <span className="text-2xl font-bold text-blue-900">
                        ₹{order.totalAmount.toFixed(2)}
                      </span>
                    </div>
                    {order.estimatedDelivery && (
                      <p className="text-sm text-gray-600">
                        Estimated Delivery: {new Date(order.estimatedDelivery).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Shipping Address:</h4>
                    <p className="text-gray-700 text-sm">
                      {order.shippingAddress.name}<br />
                      {order.shippingAddress.address}<br />
                      {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}<br />
                      Phone: {order.shippingAddress.phone}
                    </p>
                  </div>

                  {/* Status Timeline */}
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Order Status:</h4>
                    <div className="flex items-center justify-between">
                      {['pending', 'shipped', 'delivered'].map((status, idx) => (
                        <div key={status} className="flex items-center flex-1">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            order.status === status || 
                            (['shipped', 'delivered'].includes(order.status) && status === 'pending') ||
                            (order.status === 'delivered' && status === 'shipped')
                              ? 'bg-blue-900 text-white'
                              : 'bg-gray-300 text-gray-600'
                          }`}>
                            {getStatusIcon(status)}
                          </div>
                          {idx < 2 && (
                            <div className={`flex-1 h-1 mx-2 ${
                              order.status === 'delivered' || 
                              (order.status === 'shipped' && status === 'pending')
                                ? 'bg-blue-900'
                                : 'bg-gray-300'
                            }`} />
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-gray-600">
                      <span>Pending</span>
                      <span>Shipped</span>
                      <span>Delivered</span>
                    </div>
                  </div>

                  {order.status === 'pending' && (
                    <Button
                      onClick={() => handleCancelOrder(order.id)}
                      variant="outline"
                      className="w-full border-red-500 text-red-500 hover:bg-red-50"
                    >
                      Cancel Order
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default OrderTracking;
