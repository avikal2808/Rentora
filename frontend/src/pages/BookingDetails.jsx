import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Calendar, Package, ArrowRight, User, Check, X, MessageCircle, MapPin, DollarSign, Clock, CheckCircle2, XCircle, ArrowLeft } from 'lucide-react';

const BookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBooking = async () => {
    try {
      const response = await api.get(`/bookings/${id}`);
      setBooking(response.data);
    } catch (err) {
      setError('Failed to load booking details.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooking();
  }, [id]);

  const handleStatusUpdate = async (newStatus) => {
    try {
      await api.put(`/bookings/${id}/status?status=${newStatus}`);
      fetchBooking();
    } catch (err) {
      alert('Failed to update status.');
      console.error(err);
    }
  };

  if (loading) return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>;
  if (error || !booking) return <div className="text-center p-12 text-red-500">{error || 'Booking not found'}</div>;

  const isOwner = user?.id === booking.item?.owner?.id;
  const isRenter = user?.id === booking.renter?.id;
  
  const days = Math.max(1, Math.ceil((new Date(booking.endDate) - new Date(booking.startDate)) / (1000 * 60 * 60 * 24)));
  const total = booking.item?.pricePerDay ? (days * booking.item.pricePerDay).toFixed(2) : '0.00';

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full font-bold text-sm"><Clock size={16}/> Pending Request</span>;
      case 'approved': case 'confirmed': return <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-green-100 text-green-800 rounded-full font-bold text-sm"><CheckCircle2 size={16}/> Approved</span>;
      case 'rejected': case 'cancelled': return <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-100 text-red-800 rounded-full font-bold text-sm"><XCircle size={16}/> Rejected</span>;
      default: return <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-100 text-gray-800 rounded-full font-bold text-sm">{status}</span>;
    }
  };

  const otherUser = isOwner ? booking.renter : booking.item?.owner;

  return (
    <div className="max-w-4xl mx-auto px-4 pb-12">
      <Link to="/bookings" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary-600 transition mb-6 font-medium">
        <ArrowLeft size={18} /> Back to Bookings
      </Link>
      
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header section */}
        <div className="bg-gray-50 border-b border-gray-100 p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-extrabold text-gray-900">Booking #{booking.id}</h1>
              {getStatusBadge(booking.status)}
            </div>
            <p className="text-gray-500 font-medium">Requested on {new Date(booking.createdAt || Date.now()).toLocaleDateString()}</p>
          </div>
          
          <div className="flex flex-col items-end">
             <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Total Amount</div>
             <div className="text-3xl font-black text-primary-600">${total}</div>
          </div>
        </div>

        <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* Details Column */}
          <div className="space-y-8">
            {/* Item Details */}
            <div>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Item Details</h3>
              <div className="flex items-start gap-4 p-4 border border-gray-100 rounded-2xl bg-gray-50/50">
                <div className="w-16 h-16 bg-gray-200 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Package className="text-gray-400" size={32} />
                </div>
                <div>
                  <Link to={`/items/${booking.item?.id}`} className="font-bold text-lg text-gray-900 hover:text-primary-600 transition">
                    {booking.item?.title}
                  </Link>
                  <div className="flex items-center gap-3 text-sm text-gray-500 mt-2">
                    <span className="flex items-center gap-1"><DollarSign size={14}/> {booking.item?.pricePerDay}/day</span>
                    {booking.item?.location && <span className="flex items-center gap-1"><MapPin size={14}/> {booking.item.location}</span>}
                  </div>
                </div>
              </div>
            </div>

            {/* Dates */}
            <div>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Rental Period</h3>
              <div className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl bg-gray-50/50 relative">
                 <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white border border-gray-100 rounded-full flex items-center justify-center text-primary-500 shadow-sm z-10">
                   <ArrowRight size={16} />
                 </div>
                 <div className="text-center w-full">
                   <div className="text-xs text-gray-500 font-semibold mb-1">Start Date</div>
                   <div className="font-bold text-gray-900">{new Date(booking.startDate).toLocaleDateString()}</div>
                 </div>
                 <div className="text-center w-full">
                   <div className="text-xs text-gray-500 font-semibold mb-1">End Date</div>
                   <div className="font-bold text-gray-900">{new Date(booking.endDate).toLocaleDateString()}</div>
                 </div>
              </div>
            </div>
          </div>
          
          {/* People & Actions Column */}
          <div className="space-y-8">
            {/* User Info */}
            <div>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">{isOwner ? 'Renter Details' : 'Owner Details'}</h3>
              <div className="p-4 border border-gray-100 rounded-2xl bg-gray-50/50 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-bold">
                    {otherUser?.name ? otherUser.name[0].toUpperCase() : 'U'}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{otherUser?.name || 'User'}</div>
                    <div className="text-sm text-gray-500">{otherUser?.email}</div>
                  </div>
                </div>
                
                <button 
                  onClick={() => navigate('/chat', { state: { userId: otherUser?.id, userName: otherUser?.name || otherUser?.email, itemId: booking.item?.id } })}
                  className="flex items-center justify-center gap-2 w-full py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
                >
                  <MessageCircle size={18} className="text-primary-500" />
                  Chat with {isOwner ? 'Renter' : 'Owner'}
                </button>
              </div>
            </div>

            {/* Actions for Owner */}
            {isOwner && booking.status === 'PENDING' && (
              <div>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Request Actions</h3>
                <div className="flex gap-3">
                  <button 
                    onClick={() => handleStatusUpdate('APPROVED')}
                    className="flex-1 flex justify-center items-center gap-2 bg-green-600 text-white hover:bg-green-700 py-3.5 rounded-xl font-bold transition-all shadow-sm shadow-green-600/20"
                  >
                    <Check size={20} /> Approve Request
                  </button>
                  <button 
                    onClick={() => handleStatusUpdate('REJECTED')}
                    className="flex-1 flex justify-center items-center gap-2 bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 py-3.5 rounded-xl font-bold transition-all"
                  >
                    <X size={20} /> Reject
                  </button>
                </div>
              </div>
            )}

            {/* Status Information for Renter */}
            {!isOwner && (
               <div className="bg-primary-50 p-4 rounded-2xl border border-primary-100 text-primary-800 text-sm">
                 {booking.status === 'PENDING' && <p>Your request is currently waiting for the owner's approval. We will notify you once they respond.</p>}
                 {booking.status === 'APPROVED' && <p className="font-semibold text-green-700">Congratulations! The owner has approved your request. Use the chat feature to coordinate pickup and drop-off times.</p>}
                 {booking.status === 'REJECTED' && <p className="text-red-700">Unfortunately, the owner has rejected this request. You can explore other similar items.</p>}
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;
