import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Calendar, User, DollarSign, MapPin, Tag } from 'lucide-react';

const ItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Booking state
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await api.get(`/items/${id}`);
        setItem(response.data);
      } catch (err) {
        setError('Failed to load item details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  const handleBook = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login', { state: { from: { pathname: `/items/${id}` } } });
      return;
    }
    
    setBookingLoading(true);
    setBookingError('');
    setBookingSuccess(false);

    try {
      await api.post('/bookings', {
        itemId: id,
        startDate,
        endDate
      });
      setBookingSuccess(true);
      setStartDate('');
      setEndDate('');
    } catch (err) {
      setBookingError(err.response?.data?.message || err.response?.data?.error || 'Failed to book item.');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>;
  if (error || !item) return <div className="text-center p-12 text-red-500">{error || 'Item not found'}</div>;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            
            {/* Item Info */}
            <div>
              {item.imageBase64 && (
                <div className="mb-6 rounded-2xl overflow-hidden shadow-sm aspect-video bg-gray-100 flex items-center justify-center border border-gray-100">
                  <img src={item.imageBase64} alt={item.title} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="mb-4">
                <span className="inline-block bg-primary-50 text-primary-700 font-semibold px-3 py-1 rounded-full text-sm mb-4">
                  {item.category || 'General'}
                </span>
                <h1 className="text-3xl font-extrabold text-gray-900 mb-2">{item.title}</h1>
                <div className="flex items-center gap-4 text-gray-500 text-sm">
                  {item.location && (
                    <div className="flex items-center gap-1.5">
                      <MapPin size={16} />
                      <span>{item.location}</span>
                    </div>
                  )}
                  {item.owner && (
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <User size={16} />
                        <span>{item.owner.name || item.owner.email || 'Owner'}</span>
                      </div>
                      {user && user.id !== item.owner.id && (
                        <button 
                          onClick={() => navigate('/chat', { state: { userId: item.owner.id, userName: item.owner.name || item.owner.email || 'Owner' } })}
                          className="text-primary-600 hover:text-primary-700 text-xs font-semibold border border-primary-200 bg-primary-50 px-3 py-1 rounded-full transition"
                        >
                          Message Owner
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="prose prose-blue mt-8 text-gray-600">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Description</h3>
                <p className="whitespace-pre-wrap">{item.description}</p>
              </div>
            </div>

            {/* Booking Card */}
            <div>
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-2 mb-6">
                  <DollarSign className="text-primary-600 bg-primary-100 rounded-full p-1" size={28} />
                  <span className="text-3xl font-bold text-gray-900">{item.pricePerDay}</span>
                  <span className="text-gray-500">/ day</span>
                </div>

                {bookingSuccess && (
                  <div className="bg-green-50 text-green-700 p-4 rounded-xl mb-6 font-medium">
                    Booking requested successfully! The owner will review your request.
                  </div>
                )}
                {bookingError && (
                  <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 font-medium text-sm">
                    {bookingError}
                  </div>
                )}

                <form onSubmit={handleBook} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                      <input 
                        type="date" 
                        required 
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-primary-500 focus:border-primary-500"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                      <input 
                        type="date" 
                        required 
                        min={startDate || new Date().toISOString().split('T')[0]}
                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-primary-500 focus:border-primary-500"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </div>
                  </div>
                  <button 
                    type="submit" 
                    disabled={bookingLoading || item.owner?.id === user?.id}
                    className={`w-full py-3 rounded-xl font-bold text-white transition-all shadow-md ${bookingLoading || item.owner?.id === user?.id ? 'bg-gray-400 cursor-not-allowed shadow-none' : 'bg-primary-600 hover:bg-primary-700 hover:shadow-lg'}`}
                  >
                    {bookingLoading ? 'Processing...' : item.owner?.id === user?.id ? 'You own this item' : 'Book Now'}
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetails;
