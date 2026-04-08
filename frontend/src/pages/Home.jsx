import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { PackageSearch, MapPin, Tag } from 'lucide-react';

const Home = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await api.get('/items');
        setItems(response.data.content || response.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load items. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4 font-medium">{error}</div>
        <button onClick={() => window.location.reload()} className="text-primary-600 hover:underline">Try Again</button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Rent Anything, Anytime</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">Discover a world of items available for rent from people in your community.</p>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <PackageSearch className="mx-auto text-gray-300 mb-4" size={64} />
          <h3 className="text-xl font-medium text-gray-700">No items available</h3>
          <p className="text-gray-500 mt-2">Be the first to list an item for rent!</p>
          <Link to="/create" className="mt-6 inline-block bg-primary-600 text-white px-6 py-2 rounded-full hover:bg-primary-700 transition">
            List an Item
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => (
            <Link key={item.id} to={`/items/${item.id}`} className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full">
              <div className="aspect-video bg-gray-100 relative overflow-hidden flex items-center justify-center">
                 {item.imageBase64 ? (
                   <img src={item.imageBase64} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                 ) : (
                   <PackageSearch size={48} className="text-gray-300 group-hover:scale-110 transition-transform duration-500" />
                 )}
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition line-clamp-1">{item.title}</h3>
                  <span className="font-bold text-primary-600">${item.pricePerDay}<span className="text-xs text-gray-500 font-normal">/day</span></span>
                </div>
                <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-grow">{item.description}</p>
                
                <div className="flex items-center gap-4 text-xs text-gray-500 mt-auto pt-4 border-t border-gray-50">
                  <div className="flex items-center gap-1">
                    <MapPin size={14} className="text-gray-400" />
                    <span>{item.location || 'Anywhere'}</span>
                  </div>
                  {item.category && (
                    <div className="flex items-center gap-1">
                      <Tag size={14} className="text-gray-400" />
                      <span>{item.category}</span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
