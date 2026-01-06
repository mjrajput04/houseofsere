import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Users, Search, Filter, UserPlus, Mail, Phone, Calendar, Shield, Eye, Edit, Trash2, MoreVertical } from 'lucide-react';
import { toast } from 'sonner';

const API_URL = import.meta.env.VITE_API_URL || '';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [editingUser, setEditingUser] = useState(null);
  const [editData, setEditData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  const [stats, setStats] = useState({
    total: 0,
    admins: 0,
    customers: 0,
    newThisMonth: 0
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, filterType]);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/api/users`);
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
        calculateStats(data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (userData) => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const newThisMonth = userData.filter(user => {
      const userDate = new Date(user.createdAt);
      return userDate.getMonth() === currentMonth && userDate.getFullYear() === currentYear;
    }).length;

    setStats({
      total: userData.length,
      admins: userData.filter(user => user.isAdmin).length,
      customers: userData.filter(user => !user.isAdmin).length,
      newThisMonth
    });
  };

  const filterUsers = () => {
    let filtered = users;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply type filter
    if (filterType === 'admins') {
      filtered = filtered.filter(user => user.isAdmin);
    } else if (filterType === 'customers') {
      filtered = filtered.filter(user => !user.isAdmin);
    }

    setFilteredUsers(filtered);
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      const response = await fetch(`${API_URL}/api/users/${userId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        const updatedUsers = users.filter(user => user._id !== userId);
        setUsers(updatedUsers);
        calculateStats(updatedUsers);
        toast.success('User deleted successfully');
      } else {
        toast.error('Failed to delete user');
      }
    } catch (error) {
      toast.error('Error deleting user');
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user._id);
    setEditData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone || ''
    });
  };

  const handleSaveEdit = async (userId) => {
    try {
      const response = await fetch(`${API_URL}/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editData)
      });

      if (response.ok) {
        const updatedUsers = users.map(user =>
          user._id === userId ? { ...user, ...editData } : user
        );
        setUsers(updatedUsers);
        setEditingUser(null);
        toast.success('User updated successfully');
      } else {
        toast.error('Failed to update user');
      }
    } catch (error) {
      toast.error('Error updating user');
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setEditData({ firstName: '', lastName: '', email: '', phone: '' });
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
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">Manage and monitor all system users</p>
        </div>
        
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Users</CardTitle>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <p className="text-xs text-gray-500 mt-1">All registered users</p>
          </CardContent>
        </Card>



        <Card className="border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Customers</CardTitle>
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.customers}</div>
            <p className="text-xs text-gray-500 mt-1">Regular customers</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">New This Month</CardTitle>
            <div className="p-2 bg-orange-100 rounded-lg">
              <Calendar className="h-4 w-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.newThisMonth}</div>
            <p className="text-xs text-green-600 mt-1">+{Math.round((stats.newThisMonth / stats.total) * 100)}% growth</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              All Users ({filteredUsers.length})
            </CardTitle>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-64"
                />
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Users</option>
                <option value="admins">Administrators</option>
                <option value="customers">Customers</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <div key={user._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      {editingUser === user._id ? (
                        <div className="space-y-2">
                          <div className="flex gap-2">
                            <Input
                              value={editData.firstName}
                              onChange={(e) => setEditData({...editData, firstName: e.target.value})}
                              placeholder="First Name"
                              className="flex-1 h-8"
                            />
                            <Input
                              value={editData.lastName}
                              onChange={(e) => setEditData({...editData, lastName: e.target.value})}
                              placeholder="Last Name"
                              className="flex-1 h-8"
                            />
                          </div>
                          <Input
                            value={editData.email}
                            onChange={(e) => setEditData({...editData, email: e.target.value})}
                            placeholder="Email"
                            className="h-8"
                          />
                          <Input
                            value={editData.phone}
                            onChange={(e) => setEditData({...editData, phone: e.target.value})}
                            placeholder="Phone"
                            className="h-8"
                          />
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-900">
                              {user.firstName} {user.lastName}
                            </h3>
                            {user.isAdmin && (
                              <span className="inline-block px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
                                Admin
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-4 mt-1">
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <Mail className="h-3 w-3" />
                              {user.email}
                            </div>
                            {user.phone && (
                              <div className="flex items-center gap-1 text-sm text-gray-600">
                                <Phone className="h-3 w-3" />
                                {user.phone}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                            <Calendar className="h-3 w-3" />
                            Joined {new Date(user.createdAt).toLocaleDateString()}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {editingUser === user._id ? (
                      <>
                        <Button
                          onClick={() => handleSaveEdit(user._id)}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          Save
                        </Button>
                        <Button
                          onClick={handleCancelEdit}
                          variant="outline"
                          size="sm"
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          onClick={() => handleEditUser(user)}
                          variant="outline"
                          size="sm"
                          className="text-gray-600 hover:text-gray-700"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          onClick={() => handleDeleteUser(user._id)}
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Activity Summary */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Recent Registrations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {users
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .slice(0, 5)
              .map((user) => (
                <div key={user._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                    {user.isAdmin && (
                      <span className="inline-block px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full mt-1">
                        Admin
                      </span>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsers;