import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Calendar, Package, ArrowRight, Clock, CheckCircle2, XCircle, Check, X } from 'lucide-react';

const MyBookings = () => {
  const [activeTab, setActiveTab] = useState('rentals'); // 'rentals' or 'incoming'
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const endpoint = activeTab === 'rentals' ? '/bookings/user' : '/bookings/owner';
      const response = await api.get(endpoint);
      setBookings(response.data.content || response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load your bookings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [activeTab]);

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      await api.put(`/bookings/${bookingId}/status?status=${newStatus}`);
      fetchBookings();
    } catch (err) {
      console.error(err);
      alert('Failed to update status.');
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold"><Clock size={14}/> Pending</span>;
      case 'approved':
      case 'confirmed':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold"><CheckCircle2 size={14}/> Approved</span>;
      case 'rejected':
      case 'cancelled':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-bold"><XCircle size={14}/> Rejected</span>;
      default:
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-bold">{status}</span>;
    }
  };

  if (loading && bookings.length === 0) return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>;

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-primary-100 p-3 rounded-xl border border-primary-200">
          <Calendar className="text-primary-600" size={28} />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Bookings</h1>
          <p className="text-gray-500 mt-1">Manage your rentals and incoming requests</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-8">
        <button
          className={`pb-4 px-6 font-bold text-sm transition-colors ${activeTab === 'rentals' ? 'border-b-2 border-primary-600 text-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('rentals')}
        >
          My Rentals
        </button>
        <button
          className={`pb-4 px-6 font-bold text-sm transition-colors ${activeTab === 'incoming' ? 'border-b-2 border-primary-600 text-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('incoming')}
        >
          Incoming Requests
        </button>
      </div>

      {error ? (
        <div className="text-center p-12 text-red-500">{error}</div>
      ) : loading && bookings.length === 0 ? (
        <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <Package className="mx-auto text-gray-300 mb-4" size={64} />
          <h3 className="text-xl font-medium text-gray-700">
            {activeTab === 'rentals' ? 'No rentals yet' : 'No incoming requests'}
          </h3>
          <p className="text-gray-500 mt-2 max-w-md mx-auto">
            {activeTab === 'rentals' 
              ? "You haven't rented any items yet. Explore the marketplace to find what you need."
              : "No one has requested to rent your items yet."}
          </p>
          {activeTab === 'rentals' && (
            <Link to="/" className="mt-8 inline-block bg-primary-600 text-white px-8 py-3 rounded-full font-bold hover:bg-primary-700 hover:shadow-lg transition-all">
              Browse Items
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const days = Math.max(1, Math.ceil((new Date(booking.endDate) - new Date(booking.startDate)) / (1000 * 60 * 60 * 24)));
            const total = booking.item?.pricePerDay ? (days * booking.item.pricePerDay).toFixed(2) : '0.00';
            
            return (
              <div key={booking.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                 <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                   <div className="flex-1">
                     <div className="flex items-center gap-3 mb-2">
                       <h3 className="text-lg font-bold text-gray-900">
                         {booking.item?.title || `Item #${booking.item?.id}`}
                       </h3>
                       {getStatusBadge(booking.status)}
                     </div>
                     <div className="text-sm text-gray-500 mb-2">
                       {activeTab === 'rentals' ? (
                         <span>Owner: {booking.item?.owner?.name || booking.item?.owner?.email}</span>
                       ) : (
                         <span>Renter: {booking.renter?.name || booking.renter?.email}</span>
                       )}
                     </div>
                     <div className="text-sm text-gray-500 font-medium font-mono bg-gray-50 inline-block px-3 py-1 rounded-md border border-gray-200 mt-1">
                       {new Date(booking.startDate).toLocaleDateString()} <ArrowRight size={14} className="inline mx-1" /> {new Date(booking.endDate).toLocaleDateString()}
                     </div>
                   </div>
                   
                   <div className="flex flex-col items-end gap-3">
                     <div className="bg-gray-50 p-4 rounded-xl text-center min-w-[140px] border border-gray-100">
                       <div className="text-xs text-gray-500 mb-1 font-semibold uppercase tracking-wider">Total</div>
                       <div className="text-2xl font-black text-primary-600">${total}</div>
                     </div>
                     
                     {/* Action button leading to details screen */}
                     <Link 
                       to={`/bookings/${booking.id}`}
                       className="flex items-center justify-center gap-2 w-full mt-2 bg-primary-50 text-primary-700 hover:bg-primary-100 py-2.5 rounded-lg font-bold text-sm transition-colors border border-primary-200"
                     >
                       {activeTab === 'incoming' && booking.status === 'PENDING' ? 'Manage Request' : 'View Details'}
                     </Link>
                   </div>
                 </div>
                 {booking.item && (
                   <div className="mt-4 pt-4 border-t border-gray-50">
                      <Link to={`/items/${booking.item.id}`} className="text-sm font-semibold text-primary-600 hover:text-primary-700 transition flex items-center gap-1">
                        View Item Details <ArrowRight size={14} />
                      </Link>
                   </div>
                 )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
