import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { PlusCircle, Info, DollarSign, MapPin, Tag } from 'lucide-react';

const CreateItem = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    category: ''
  });
  const [imageBase64, setImageBase64] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError('Image must be less than 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        pricePerDay: parseFloat(formData.price) || 0,
        location: formData.location,
        category: formData.category,
        imageBase64: imageBase64
      };
      const response = await api.post('/items', payload);
      navigate(`/items/${response.data.id || response.data}`);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Failed to create item.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-primary-100 p-3 rounded-xl">
            <PlusCircle className="text-primary-600" size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">List an Item</h1>
            <p className="text-gray-500">Share your gear and start earning</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 font-medium text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Title</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Info className="text-gray-400" size={18} />
              </div>
              <input 
                type="text" 
                name="title"
                required 
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-primary-500 focus:border-primary-500 transition-colors"
                placeholder="What are you listing?"
                value={formData.title}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
            <textarea 
              name="description"
              required 
              rows="4"
              className="w-full p-4 border border-gray-300 rounded-xl focus:ring-primary-500 focus:border-primary-500 transition-colors resize-none"
              placeholder="Provide details about condition, features, specific rules..."
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Price per Day ($)</label>
              <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="text-gray-400" size={18} />
                </div>
                <input 
                  type="number" 
                  name="price"
                  required 
                  min="1"
                  step="0.01"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Location</label>
              <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="text-gray-400" size={18} />
                </div>
                <input 
                  type="text" 
                  name="location"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  placeholder="City, Neighborhood"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
             <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Tag className="text-gray-400" size={18} />
                </div>
                <select 
                  name="category"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-primary-500 focus:border-primary-500 transition-colors appearance-none bg-white"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="">Select a category</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Tools">Tools</option>
                  <option value="Sports">Sports Equipment</option>
                  <option value="Vehicles">Vehicles</option>
                  <option value="Home">Home & Garden</option>
                  <option value="Other">Other</option>
                </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Item Image (Optional)</label>
            <div className="flex items-center gap-4">
              <input 
                type="file" 
                accept="image/*"
                onChange={handleImageChange}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 transition-colors cursor-pointer border border-gray-300 rounded-xl"
              />
              {imageBase64 && (
                <div className="w-16 h-16 rounded-xl overflow-hidden border border-gray-200 flex-shrink-0">
                  <img src={imageBase64} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              disabled={loading}
              className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-md text-lg ${loading ? 'bg-primary-400 cursor-not-allowed shadow-none' : 'bg-primary-600 hover:bg-primary-700 hover:shadow-xl'}`}
            >
              {loading ? 'Publishing...' : 'Publish Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateItem;
