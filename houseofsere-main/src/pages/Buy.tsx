import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { ArrowLeft, MapPin, CreditCard, Truck, Package, CheckCircle, Clock } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';

const API_URL = import.meta.env.VITE_API_URL || '';

const Buy = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const { user, isLoading: userLoading } = useUser();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shippingCost, setShippingCost] = useState(0);

  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (userLoading) return;
    
    if (!user) {
      navigate('/login');
      return;
    }
    if (productId) {
      fetchProduct();
      fetchShippingCost();
    } else {
      toast.error('Product not found');
      navigate('/');
    }
  }, [user, userLoading, productId, navigate]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`${API_URL}/api/products`);
      if (response.ok) {
        const products = await response.json();
        const foundProduct = products.find((p: any) => p._id === productId);
        if (foundProduct) {
          setProduct(foundProduct);
        } else {
          toast.error('Product not found');
          navigate('/');
        }
      }
    } catch (error) {
      toast.error('Failed to load product');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const fetchShippingCost = async () => {
    try {
      const response = await fetch(`${API_URL}/api/settings`);
      if (response.ok) {
        const settings = await response.json();
        setShippingCost(parseFloat(settings.shippingCost) || 0);
      }
    } catch (error) {
      console.error('Failed to fetch shipping cost:', error);
    }
  };

  const handleAddressChange = (field: string, value: string) => {
    setAddress(prev => ({ ...prev, [field]: value }));
  };

  const handleQuantityChange = (change: number) => {
    setQuantity(prev => Math.max(1, prev + change));
  };

  const getTotalAmount = () => {
    const price = parseFloat(product.price.replace(/[^0-9]/g, '')) || 0;
    return (price * quantity) + shippingCost;
  };

  const getSubtotal = () => {
    const price = parseFloat(product.price.replace(/[^0-9]/g, '')) || 0;
    return price * quantity;
  };

  const handleOrder = async () => {
    if (!address.street || !address.city || !address.state || !address.zipCode || !address.country) {
      toast.error('Please fill in all address fields');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          product: {
            id: product._id,
            title: product.title,
            category: product.category,
            price: product.price,
            imageUrl: product.imageUrl,
            quantity: quantity
          },
          address,
          paymentMethod,
          total: getTotalAmount()
        })
      });

      if (response.ok) {
        toast.success('Order placed successfully!');
        navigate('/my-orders');
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to place order');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (userLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-gray-600">Loading product...</div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple Header */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Package className="h-6 w-6 text-gray-900" />
              <h1 className="text-xl font-semibold text-gray-900">Checkout</h1>
            </div>
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Shop
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Product Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Card */}
            <div className="bg-white rounded-lg border p-6">
              <div className="flex gap-6">
                <div className="w-32 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={product.imageUrl || '/placeholder.svg'}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded mb-2">
                        {product.category}
                      </span>
                      <h2 className="text-xl font-semibold text-gray-900 mb-2">{product.title}</h2>
                      <p className="text-2xl font-bold text-gray-900">₹{product.price}</p>
                    </div>
                    <div className="text-right">
                      <label className="block text-sm text-gray-600 mb-2">Quantity</label>
                      <div className="flex items-center border rounded">
                        <button
                          onClick={() => handleQuantityChange(-1)}
                          className="px-3 py-1 hover:bg-gray-50 transition-colors"
                        >
                          -
                        </button>
                        <span className="px-4 py-1 border-x">{quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(1)}
                          className="px-3 py-1 hover:bg-gray-50 transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-5 w-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">Shipping Address</h3>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <Input
                  placeholder="Street Address"
                  value={address.street}
                  onChange={(e) => handleAddressChange('street', e.target.value)}
                  className="border-gray-300 focus:border-gray-900 focus:ring-gray-900"
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="City"
                    value={address.city}
                    onChange={(e) => handleAddressChange('city', e.target.value)}
                    className="border-gray-300 focus:border-gray-900 focus:ring-gray-900"
                  />
                  <Input
                    placeholder="State"
                    value={address.state}
                    onChange={(e) => handleAddressChange('state', e.target.value)}
                    className="border-gray-300 focus:border-gray-900 focus:ring-gray-900"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="ZIP Code"
                    value={address.zipCode}
                    onChange={(e) => handleAddressChange('zipCode', e.target.value)}
                    className="border-gray-300 focus:border-gray-900 focus:ring-gray-900"
                  />
                  <Input
                    placeholder="Country"
                    value={address.country}
                    onChange={(e) => handleAddressChange('country', e.target.value)}
                    className="border-gray-300 focus:border-gray-900 focus:ring-gray-900"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="h-5 w-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">Payment Method</h3>
              </div>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value="cod" id="cod" />
                  <Label htmlFor="cod" className="flex items-center gap-3 cursor-pointer flex-1">
                    <Truck className="h-5 w-5 text-gray-600" />
                    <div>
                      <div className="font-medium">Cash on Delivery</div>
                      <div className="text-sm text-gray-500">Pay when you receive the product</div>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value="online" id="online" />
                  <Label htmlFor="online" className="flex items-center gap-3 cursor-pointer flex-1">
                    <CreditCard className="h-5 w-5 text-gray-600" />
                    <div>
                      <div className="font-medium">Online Payment</div>
                      <div className="text-sm text-gray-500">Pay securely with card or UPI</div>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border p-6 sticky top-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₹{getSubtotal()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">{shippingCost > 0 ? `₹${shippingCost}` : 'Free'}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-lg font-bold">₹{getTotalAmount()}</span>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleOrder}
                disabled={isLoading}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 rounded-lg transition-colors"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Place Order
                  </div>
                )}
              </Button>

              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>Expected delivery: 3-5 business days</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Buy;