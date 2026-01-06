import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Settings, Truck, Video, Save, Upload, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    shippingCost: '',
    heroVideo: null
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [videoFile, setVideoFile] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings({
          shippingCost: data.shippingCost || '',
          heroVideo: data.heroVideo || null
        });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('shippingCost', settings.shippingCost);
      if (videoFile) {
        formData.append('heroVideo', videoFile);
      }

      const response = await fetch('/api/settings', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        toast.success('Settings saved successfully');
        setVideoFile(null);
        fetchSettings();
      } else {
        toast.error('Failed to save settings');
      }
    } catch (error) {
      toast.error('Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
    } else {
      toast.error('Please select a valid video file');
    }
  };

  const handleDeleteVideo = async () => {
    if (!confirm('Are you sure you want to delete the current video?')) return;
    
    try {
      const response = await fetch('/api/settings/delete-video', {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setSettings(prev => ({ ...prev, heroVideo: null }));
        toast.success('Video deleted successfully');
      } else {
        toast.error('Failed to delete video');
      }
    } catch (error) {
      toast.error('Error deleting video');
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
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Manage application settings and configurations</p>
        </div>
        <Button 
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>

      {/* Settings Cards */}
      <div className="space-y-6">
        {/* Hero Section Settings */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="border-b border-gray-100 pb-4">
            <CardTitle className="flex items-center gap-3 text-gray-900">
              <div className="p-2 bg-purple-50 rounded-lg">
                <Video className="h-5 w-5 text-purple-600" />
              </div>
              Hero Section
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Hero Video Upload
                </label>
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center hover:border-gray-300 transition-colors bg-gray-50">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    className="hidden"
                    id="video-upload"
                  />
                  <label htmlFor="video-upload" className="cursor-pointer">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-600 mb-1">
                      {videoFile ? videoFile.name : 'Click to upload video or drag and drop'}
                    </p>
                    <p className="text-xs text-gray-500">
                      MP4, WebM, or other video formats
                    </p>
                  </label>
                </div>
              </div>
              
              {settings.heroVideo && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Current Video
                  </label>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-xs text-green-600 mb-3 flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      {settings.heroVideo}
                    </p>
                    <video 
                      src={`/uploads/${settings.heroVideo}?t=${Date.now()}`} 
                      controls 
                      className="w-full h-32 object-cover rounded border border-gray-200"
                      key={settings.heroVideo}
                    />
                  </div>
                </div>
              )}
            </div>
            
            {settings.heroVideo && (
              <div className="pt-6 border-t border-gray-100 mt-6">
                <Button
                  onClick={handleDeleteVideo}
                  variant="destructive"
                  size="sm"
                  className="bg-red-600 hover:bg-red-700 text-white border-0 shadow-sm"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Video
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Shipping Settings */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="border-b border-gray-100 pb-4">
            <CardTitle className="flex items-center gap-3 text-gray-900">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Truck className="h-5 w-5 text-blue-600" />
              </div>
              Shipping Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="max-w-md">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Shipping Cost (₹)
              </label>
              <Input
                type="number"
                step="0.01"
                placeholder="Enter shipping cost"
                value={settings.shippingCost}
                onChange={(e) => handleInputChange('shippingCost', e.target.value)}
                className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-2">
                Default shipping cost applied to all orders
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminSettings;