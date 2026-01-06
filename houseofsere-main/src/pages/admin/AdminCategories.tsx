import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, FolderOpen, Search, Edit, Eye, Calendar, Package } from 'lucide-react';
import { toast } from 'sonner';

const API_URL = import.meta.env.VITE_API_URL || '';

const AdminCategories = () => {
  const [categories, setCategories] = useState(['']);
  const [savedCategories, setSavedCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [editName, setEditName] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    withProducts: 0,
    empty: 0,
    totalProducts: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [categoriesRes, productsRes] = await Promise.all([
        fetch(`${API_URL}/api/categories`),
        fetch(`${API_URL}/api/products`)
      ]);

      const [categoriesData, productsData] = await Promise.all([
        categoriesRes.ok ? categoriesRes.json() : [],
        productsRes.ok ? productsRes.json() : []
      ]);

      setSavedCategories(categoriesData);
      setProducts(productsData);
      calculateStats(categoriesData, productsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (categoriesData, productsData) => {
    const categoryProductCounts = {};
    productsData.forEach(product => {
      const category = product.category;
      categoryProductCounts[category] = (categoryProductCounts[category] || 0) + 1;
    });

    const withProducts = categoriesData.filter(cat => categoryProductCounts[cat.name] > 0).length;
    const empty = categoriesData.length - withProducts;

    setStats({
      total: categoriesData.length,
      withProducts,
      empty,
      totalProducts: productsData.length
    });
  };

  const getProductCount = (categoryName) => {
    return products.filter(product => product.category === categoryName).length;
  };

  const filteredCategories = savedCategories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCategoryField = () => {
    setCategories([...categories, '']);
  };

  const handleDeleteCategoryField = (index: number) => {
    if (categories.length > 1) {
      const newCategories = categories.filter((_, i) => i !== index);
      setCategories(newCategories);
    }
  };

  const handleCategoryChange = (index: number, value: string) => {
    const newCategories = [...categories];
    newCategories[index] = value;
    setCategories(newCategories);
  };

  const handleSaveCategories = async () => {
    const validCategories = categories.filter(cat => cat.trim() !== '');
    if (validCategories.length > 0) {
      try {
        const response = await fetch(`${API_URL}/api/categories/bulk`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ categories: validCategories }),
        });
        
        if (response.ok) {
          toast.success(`${validCategories.length} categories saved successfully`);
          fetchData();
          setCategories(['']);
        } else {
          toast.error('Failed to save categories');
        }
      } catch (error) {
        toast.error('Error saving categories');
      }
    } else {
      toast.error('Please add at least one category');
    }
  };

  const handleDeleteCategory = async (categoryId: string, categoryName: string) => {
    const productCount = getProductCount(categoryName);
    if (productCount > 0) {
      if (!confirm(`This category has ${productCount} products. Are you sure you want to delete it?`)) {
        return;
      }
    }

    try {
      const response = await fetch(`${API_URL}/api/categories/${categoryId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        toast.success('Category deleted successfully');
        fetchData();
      } else {
        toast.error('Failed to delete category');
      }
    } catch (error) {
      toast.error('Error deleting category');
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category._id);
    setEditName(category.name);
  };

  const handleSaveEdit = async (categoryId: string) => {
    if (!editName.trim()) {
      toast.error('Category name cannot be empty');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/categories/${categoryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: editName.trim() }),
      });

      if (response.ok) {
        toast.success('Category updated successfully');
        setEditingCategory(null);
        setEditName('');
        fetchData();
      } else {
        toast.error('Failed to update category');
      }
    } catch (error) {
      toast.error('Error updating category');
    }
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    setEditName('');
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
          <h1 className="text-3xl font-bold text-gray-900">Category Management</h1>
          <p className="text-gray-600 mt-1">Organize and manage product categories</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar className="h-4 w-4" />
          <span>{new Date().toLocaleDateString()}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Categories</CardTitle>
            <div className="p-2 bg-blue-100 rounded-lg">
              <FolderOpen className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <p className="text-xs text-gray-500 mt-1">All categories</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Categories</CardTitle>
            <div className="p-2 bg-green-100 rounded-lg">
              <Package className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.withProducts}</div>
            <p className="text-xs text-green-600 mt-1">With products</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Empty Categories</CardTitle>
            <div className="p-2 bg-orange-100 rounded-lg">
              <FolderOpen className="h-4 w-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.empty}</div>
            <p className="text-xs text-orange-600 mt-1">No products</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Products</CardTitle>
            <div className="p-2 bg-purple-100 rounded-lg">
              <Package className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.totalProducts}</div>
            <p className="text-xs text-gray-500 mt-1">Across all categories</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Add Categories */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add New Categories
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {categories.map((category, index) => (
              <div key={index} className="flex gap-2 items-center">
                <Input
                  placeholder="Enter category name"
                  value={category}
                  onChange={(e) => handleCategoryChange(index, e.target.value)}
                  className="flex-1 border-gray-300 focus:border-gray-900 focus:ring-gray-900"
                />
                {categories.length > 1 && (
                  <Button
                    onClick={() => handleDeleteCategoryField(index)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <div className="flex gap-2 pt-2">
              <Button 
                onClick={handleAddCategoryField} 
                variant="outline" 
                size="sm"
                className="flex-1"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Field
              </Button>
              <Button 
                onClick={handleSaveCategories} 
                className="bg-gray-900 hover:bg-gray-800 text-white flex-1"
              >
                Save Categories
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Categories List */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FolderOpen className="h-5 w-5" />
                All Categories ({filteredCategories.length})
              </CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredCategories.length === 0 ? (
              <div className="text-center py-8">
                <FolderOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
                <p className="text-gray-500">Add your first category to get started.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredCategories.map((category: any) => {
                  const productCount = getProductCount(category.name);
                  return (
                    <div key={category._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FolderOpen className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          {editingCategory === category._id ? (
                            <div className="flex gap-2">
                              <Input
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className="flex-1 h-8"
                                onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit(category._id)}
                              />
                              <Button
                                onClick={() => handleSaveEdit(category._id)}
                                size="sm"
                                className="h-8 px-2 bg-green-600 hover:bg-green-700"
                              >
                                Save
                              </Button>
                              <Button
                                onClick={handleCancelEdit}
                                variant="outline"
                                size="sm"
                                className="h-8 px-2"
                              >
                                Cancel
                              </Button>
                            </div>
                          ) : (
                            <>
                              <p className="font-medium text-gray-900">{category.name}</p>
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span>{productCount} products</span>
                                <span>Created {new Date(category.createdAt).toLocaleDateString()}</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                      
                      {editingCategory !== category._id && (
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            productCount > 0 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {productCount} items
                          </span>
                          <Button
                            onClick={() => handleEditCategory(category)}
                            variant="outline"
                            size="sm"
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            onClick={() => handleDeleteCategory(category._id, category.name)}
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Category Analytics */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Category Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedCategories
              .sort((a, b) => getProductCount(b.name) - getProductCount(a.name))
              .slice(0, 6)
              .map((category: any) => {
                const productCount = getProductCount(category.name);
                const percentage = stats.totalProducts > 0 ? (productCount / stats.totalProducts) * 100 : 0;
                return (
                  <div key={category._id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{category.name}</h4>
                      <span className="text-sm font-bold text-gray-900">{productCount}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500">{percentage.toFixed(1)}% of total products</p>
                  </div>
                );
              })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCategories;