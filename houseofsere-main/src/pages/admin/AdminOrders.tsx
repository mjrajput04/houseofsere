import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, User, Package, MapPin, CreditCard, Search, Filter, ShoppingBag, DollarSign, Calendar, Clock, CheckCircle, Eye, Edit } from 'lucide-react';
import { toast } from 'sonner';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    totalRevenue: 0,
    todayOrders: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm, filterStatus]);

  const fetchData = async () => {
    try {
      const [ordersRes, usersRes] = await Promise.all([
        fetch('/api/orders'),
        fetch('/api/users')
      ]);

      const [ordersData, usersData] = await Promise.all([
        ordersRes.ok ? ordersRes.json() : [],
        usersRes.ok ? usersRes.json() : []
      ]);

      setOrders(ordersData);
      setUsers(usersData);
      calculateStats(ordersData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (ordersData) => {
    const totalRevenue = ordersData.reduce((sum, order) => {
      const orderTotal = typeof order.total === 'number' ? order.total : parseFloat(order.total.toString().replace(/[^0-9.]/g, '')) || 0;
      return sum + orderTotal;
    }, 0);

    const today = new Date().toDateString();
    const todayOrders = ordersData.filter(order => 
      new Date(order.createdAt).toDateString() === today
    ).length;

    setStats({
      total: ordersData.length,
      pending: ordersData.filter(order => order.status === 'pending').length,
      completed: ordersData.filter(order => order.status === 'completed' || order.status === 'delivered').length,
      totalRevenue,
      todayOrders
    });
  };

  const filterOrders = () => {
    let filtered = orders;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(order => {
        const user = getUserDetails(order.userId);
        return (
          order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.product?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }

    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(order => order.status === filterStatus);
    }

    setFilteredOrders(filtered);
  };

  const getUserDetails = (userId: string) => {
    return users.find(user => user._id === userId);
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to delete this order?')) return;
    
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        const updatedOrders = orders.filter(order => order._id !== orderId);
        setOrders(updatedOrders);
        calculateStats(updatedOrders);
        toast.success('Order deleted successfully');
      } else {
        toast.error('Failed to delete order');
      }
    } catch (error) {
      toast.error('Error deleting order');
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        const updatedOrders = orders.map(order =>
          order._id === orderId ? { ...order, status: newStatus } : order
        );
        setOrders(updatedOrders);
        calculateStats(updatedOrders);
        toast.success(`Order status updated to ${newStatus}`);
      } else {
        toast.error('Failed to update order status');
      }
    } catch (error) {
      toast.error('Error updating order status');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-600 mt-1">Monitor and manage all customer orders</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar className="h-4 w-4" />
          <span>{new Date().toLocaleDateString()}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card className="border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Orders</CardTitle>
            <div className="p-2 bg-blue-100 rounded-lg">
              <ShoppingBag className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <p className="text-xs text-gray-500 mt-1">All time orders</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pending Orders</CardTitle>
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-4 w-4 text-yellow-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.pending}</div>
            <p className="text-xs text-yellow-600 mt-1">Awaiting processing</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Completed Orders</CardTitle>
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.completed}</div>
            <p className="text-xs text-green-600 mt-1">Successfully delivered</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">₹{stats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">All time revenue</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Today's Orders</CardTitle>
            <div className="p-2 bg-purple-100 rounded-lg">
              <Calendar className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.todayOrders}</div>
            <p className="text-xs text-gray-500 mt-1">Orders today</p>
          </CardContent>
        </Card>
      </div>

      {/* Orders List */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              All Orders ({filteredOrders.length})
            </CardTitle>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-64"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredOrders.map((order: any) => {
                const user = getUserDetails(order.userId);
                return (
                  <div key={order._id} className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                      {/* Order Info */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                          <Package className="h-4 w-4" />
                          Order Details
                        </div>
                        <div className="text-sm">
                          <p className="font-medium">#{order._id.slice(-8)}</p>
                          <p className="text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</p>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs mt-1 ${
                            order.status === 'pending' 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : order.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </div>
                      </div>

                      {/* Customer Info */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                          <User className="h-4 w-4" />
                          Customer
                        </div>
                        <div className="text-sm">
                          <p className="font-medium">{user?.firstName} {user?.lastName}</p>
                          <p className="text-gray-600">{user?.email}</p>
                          {user?.phone && <p className="text-gray-600">{user.phone}</p>}
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                          <Package className="h-4 w-4" />
                          Product
                        </div>
                        <div className="flex gap-3">
                          <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden">
                            <img
                              src={order.product.imageUrl || '/placeholder.svg'}
                              alt={order.product.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="text-sm">
                            <p className="font-medium">{order.product.title}</p>
                            <p className="text-gray-600">{order.product.category}</p>
                            <p className="font-bold text-gray-900">₹{order.product.price}</p>
                          </div>
                        </div>
                      </div>

                      {/* Address Info */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                          <MapPin className="h-4 w-4" />
                          Delivery Address
                        </div>
                        <div className="text-sm text-gray-600">
                          <p>{order.address.street}</p>
                          <p>{order.address.city}, {order.address.state}</p>
                          <p>{order.address.zipCode}</p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="space-y-3">
                        <div className="text-sm">
                          <p className="font-medium text-gray-900">₹{order.total}</p>
                          <p className="text-gray-600 capitalize">{order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</p>
                        </div>
                        <div className="flex flex-col gap-2">
                          {order.status === 'pending' && (
                            <Button
                              onClick={() => updateOrderStatus(order._id, 'completed')}
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white text-xs"
                            >
                              Mark Complete
                            </Button>
                          )}
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-blue-600 hover:text-blue-700 flex-1"
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button
                              onClick={() => handleDeleteOrder(order._id)}
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700 flex-1"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOrders;