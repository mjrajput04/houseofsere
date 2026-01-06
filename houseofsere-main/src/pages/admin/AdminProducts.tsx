import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, X, Edit } from 'lucide-react';
import { toast } from 'sonner';

const API_URL = import.meta.env.VITE_API_URL || '';

const AdminProducts = () => {
  const [savedProducts, setSavedProducts] = useState([]);
  const [savedCategories, setSavedCategories] = useState([]);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    title: '',
    category: '',
    price: '',
    image: null,
    imageUrl: '',
    description: ''
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/api/products`);
      if (response.ok) {
        const data = await response.json();
        setSavedProducts(data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/api/categories`);
      if (response.ok) {
        const data = await response.json();
        setSavedCategories(data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleAddProduct = () => {
    setShowProductForm(true);
  };

  const handleCloseProductForm = () => {
    setShowProductForm(false);
    setEditingProduct(null);
    setProductForm({
      title: '',
      category: '',
      price: '',
      image: null,
      imageUrl: '',
      description: ''
    });
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setProductForm({
      title: product.title,
      category: product.category,
      price: product.price,
      image: null,
      imageUrl: product.imageUrl,
      description: product.description
    });
    setShowProductForm(true);
  };

  const handleProductFormChange = (field: string, value: any) => {
    setProductForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveProduct = async () => {
    if (!productForm.title || !productForm.category || !productForm.price) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      let imageUrl = productForm.imageUrl;
      
      if (productForm.image) {
        const reader = new FileReader();
        imageUrl = await new Promise((resolve) => {
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(productForm.image);
        });
      }

      const url = editingProduct 
        ? `${API_URL}/api/products/${editingProduct._id}`
        : `${API_URL}/api/products`;
      
      const method = editingProduct ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: productForm.title,
          category: productForm.category,
          price: productForm.price,
          imageUrl: imageUrl,
          description: productForm.description
        }),
      });
      
      if (response.ok) {
        toast.success(editingProduct ? 'Product updated successfully' : 'Product added successfully');
        handleCloseProductForm();
        fetchProducts();
      } else {
        toast.error(editingProduct ? 'Failed to update product' : 'Failed to add product');
      }
    } catch (error) {
      toast.error('Error saving product');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      const response = await fetch(`${API_URL}/api/products/${productId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        toast.success('Product deleted successfully');
        fetchProducts();
      } else {
        toast.error('Failed to delete product');
      }
    } catch (error) {
      toast.error('Error deleting product');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Products ({savedProducts.length})</h1>
        <Button onClick={handleAddProduct} className="bg-amber-600 hover:bg-amber-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {savedProducts.map((product: any) => (
              <div key={product._id} className="border rounded-lg p-4 bg-gray-50">
                <div className="w-full h-32 bg-gray-200 rounded mb-3 flex items-center justify-center overflow-hidden">
                  {product.imageUrl ? (
                    <img 
                      src={product.imageUrl} 
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-400 text-sm">No Image</span>
                  )}
                </div>
                <h3 className="font-semibold text-lg mb-2">{product.title}</h3>
                <p className="text-sm text-gray-600 mb-1">Category: {product.category}</p>
                <p className="text-sm text-gray-600 mb-2">Price: {product.price}</p>
                {product.description && (
                  <p className="text-sm text-gray-500 mb-3">{product.description}</p>
                )}
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleEditProduct(product)}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDeleteProduct(product._id)}
                    variant="outline"
                    size="sm"
                    className="flex-1 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Product Form Modal */}
      {showProductForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <Button onClick={handleCloseProductForm} variant="ghost" size="sm">
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <Input
                placeholder="Product Title"
                value={productForm.title}
                onChange={(e) => handleProductFormChange('title', e.target.value)}
              />
              
              <Select
                value={productForm.category}
                onValueChange={(value) => handleProductFormChange('category', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {savedCategories.map((category: any) => (
                    <SelectItem key={category._id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Input
                placeholder="Price (e.g., ₹25,000 or Inquire)"
                value={productForm.price}
                onChange={(e) => handleProductFormChange('price', e.target.value)}
              />
              
              <div>
                <label className="block text-sm font-medium mb-2">Product Image</label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleProductFormChange('image', e.target.files?.[0])}
                  className="mb-2"
                />
                <Input
                  placeholder="Or paste image URL"
                  value={productForm.imageUrl}
                  onChange={(e) => handleProductFormChange('imageUrl', e.target.value)}
                />
              </div>
              
              <Textarea
                placeholder="Description (optional)"
                value={productForm.description}
                onChange={(e) => handleProductFormChange('description', e.target.value)}
                rows={3}
              />
              
              <Button
                onClick={handleSaveProduct}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white"
              >
                {editingProduct ? 'Update Product' : 'Add Product'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;