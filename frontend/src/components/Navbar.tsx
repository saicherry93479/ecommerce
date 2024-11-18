import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Home, Search,User } from 'lucide-react';

export default function Navbar({ cart, searchTerm, setSearchTerm }) {
  return (
    <nav className="flex items-center justify-start bg-[#ac8e8e] px-4 py-3 text-white">
      <div className="flex items-center mr-20 ml-10">
        <h2 className="text-2xl font-bold">HR Store</h2>
      </div>
      
      <ul className="flex space-x-20">
        <li>
          <Link 
            to="/" 
            className="flex items-center space-x-2 font-bold hover:scale-110 transition-transform"
          >
            <Home size={20} />
            <span>Home</span>
          </Link>
        </li>
        <li>
          <Link 
            to="/wishlist" 
            className="flex items-center space-x-2 font-bold hover:scale-110 transition-transform"
          >
            <Heart size={20} />
            <span>Wishlist</span>
          </Link>
        </li>
        <li>
          <Link 
            to="/profile" 
            className="flex items-center space-x-2 font-bold hover:scale-110 transition-transform"
          >
            <User size={20} />
            <span>Profile</span>
          </Link>
        </li>
      </ul>

      <div className="ml-auto flex items-center space-x-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ac8e8e] focus:border-transparent w-64 text-gray-800"
          />
        </div>

        <Link to="/cart" className="relative">
          <ShoppingCart size={28} className="hover:scale-110 transition-transform" />
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
              {cart.length}
            </span>
          )}
        </Link>
      </div>
    </nav>
  );
}