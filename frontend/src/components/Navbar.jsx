import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, LogOut, MessageCircle, Package, Calendar, PlusCircle } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-primary-600 text-white p-2 rounded-xl group-hover:bg-primary-700 transition">
              <Package size={24} />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">Rentora</span>
          </Link>

          <div className="flex items-center gap-6">
            <Link to="/" className="text-gray-600 hover:text-primary-600 transition font-medium">Home</Link>
            
            {user ? (
              <>
                <Link to="/bookings" className="flex items-center gap-1.5 text-gray-600 hover:text-primary-600 transition">
                  <Calendar size={18} />
                  <span>Bookings</span>
                </Link>
                <Link to="/chat" className="flex items-center gap-1.5 text-gray-600 hover:text-primary-600 transition">
                  <MessageCircle size={18} />
                  <span>Chat</span>
                </Link>
                <Link to="/create" className="flex items-center gap-1.5 bg-primary-50 text-primary-700 px-4 py-2 rounded-full hover:bg-primary-100 transition font-medium">
                  <PlusCircle size={18} />
                  <span>List Item</span>
                </Link>
                <div className="w-px h-6 bg-gray-200 mx-2"></div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-tr from-primary-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {user.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 text-gray-500 hover:text-red-600 transition text-sm"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="flex items-center gap-1.5 text-gray-600 hover:text-primary-600 transition font-medium">
                  <LogIn size={18} />
                  <span>Login</span>
                </Link>
                <Link to="/signup" className="bg-primary-600 text-white px-5 py-2 rounded-full hover:bg-primary-700 transition font-medium shadow-sm shadow-primary-500/30">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
