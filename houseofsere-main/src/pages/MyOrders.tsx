import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Package, MapPin, Calendar, CreditCard, Truck } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';

const API_URL = import.meta.env.VITE_API_URL || '';

const MyOrders = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchMyOrders();
  }, [user, navigate]);

  const fetchMyOrders = async () => {
    try {
      const response = await fetch(`${API_URL}/api/orders/user/${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-gray-600">Loading your orders...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple Header */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Package className="h-6 w-6 text-gray-900" />
              <h1 className="text-xl font-semibold text-gray-900">My Orders</h1>
            </div>
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {orders.length === 0 ? (
          <div className="bg-white rounded-lg border p-12 text-center">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-500 mb-6">You haven't placed any orders yet.</p>
            <button
              onClick={() => navigate('/')}
              className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order: any) => (
              <div key={order._id} className="bg-white rounded-lg border p-6">
                {/* Order Header */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Package className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Order #{order._id.slice(-8)}</h3>
                      <p className="text-sm text-gray-500">
                        Placed on {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    order.status === 'pending' 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : order.status === 'delivered'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Product Info */}
                  <div className="lg:col-span-1">
                    <div className="flex gap-4">
                      <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={order.product.imageUrl || '/placeholder.svg'}
                          alt={order.product.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded mb-1">
                          {order.product.category}
                        </span>
                        <h4 className="font-semibold text-gray-900 mb-1">{order.product.title}</h4>
                        <p className="text-lg font-bold text-gray-900">₹{order.product.price}</p>
                        <p className="text-sm text-gray-500">Qty: {order.product.quantity}</p>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Address */}
                  <div className="lg:col-span-1">
                    <div className="flex items-start gap-2 mb-2">
                      <MapPin className="h-4 w-4 text-gray-500 mt-1" />
                      <div>
                        <h5 className="font-medium text-gray-900 mb-1">Delivery Address</h5>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>{order.address.street}</p>
                          <p>{order.address.city}, {order.address.state}</p>
                          <p>{order.address.zipCode}, {order.address.country}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="lg:col-span-1">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Payment Method</p>
                          <p className="text-sm text-gray-600 capitalize">
                            {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="pt-3 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-900">Total Amount</span>
                          <span className="text-lg font-bold text-gray-900">₹{order.total}</span>
                        </div>
                      </div>

                      <div className="pt-2">
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Order Summary Stats */}
        {orders.length > 0 && (
          <div className="mt-8 bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{orders.length}</div>
                <div className="text-sm text-gray-500">Total Orders</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {orders.filter((order: any) => order.status === 'pending').length}
                </div>
                <div className="text-sm text-gray-500">Pending Orders</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  ₹{orders.reduce((total: number, order: any) => {
                    const orderTotal = typeof order.total === 'number' ? order.total : parseFloat(order.total.toString().replace(/[^0-9.]/g, '')) || 0;
                    return total + orderTotal;
                  }, 0).toLocaleString()}
                </div>
                <div className="text-sm text-gray-500">Total Spent</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;