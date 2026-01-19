import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X, LogOut, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '@/stores/useAuthStore';
import useCartStore from '@/stores/useCartStore';
import { Button } from '@/components/ui/button';

const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();
  const itemCount = useCartStore(state => state.getItemCount());

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/books?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-blue-900 shadow-xl sticky top-0 z-50 border-b border-blue-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2"
            >
              <span className="text-3xl">📚</span>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-white font-serif tracking-wide leading-none">ASO</span>
                <span className="text-sm font-medium text-amber-400 tracking-wider">PUBLICATION</span>
              </div>
            </motion.div>
          </Link>

          {/* Desktop Search */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg mx-12">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for exam books..."
                className="w-full px-4 py-2.5 pl-10 pr-4 rounded-lg bg-blue-800 text-white placeholder-blue-300 border border-blue-700 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-400 w-4 h-4" />
            </div>
          </form>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/books">
              <Button variant="ghost" className="text-white hover:text-amber-400 hover:bg-blue-800 font-medium">
                Browse Books
              </Button>
            </Link>
            
            <Link to="/cart" className="relative">
              <Button variant="ghost" className="text-white hover:text-amber-400 hover:bg-blue-800">
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-500 text-blue-900 font-bold text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                    {itemCount}
                  </span>
                )}
              </Button>
            </Link>

            {isAuthenticated ? (
              <>
                <Link to="/orders">
                  <Button variant="ghost" className="text-white hover:text-amber-400 hover:bg-blue-800">
                    <Package className="w-5 h-5 mr-2" />
                    Orders
                  </Button>
                </Link>
                {user?.role === 'admin' && (
                  <Link to="/admin">
                    <Button variant="ghost" className="text-white hover:text-amber-400 hover:bg-blue-800">
                      Admin Panel
                    </Button>
                  </Link>
                )}
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="text-white hover:text-amber-400 hover:bg-blue-800"
                >
                  <LogOut className="w-5 h-5 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="text-white hover:text-amber-400 hover:bg-blue-800">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-amber-500 hover:bg-amber-600 text-blue-900 font-bold">
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white hover:text-amber-400 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden bg-blue-900 border-t border-blue-800"
            >
              <div className="py-4 space-y-4 px-2">
                <form onSubmit={handleSearch} className="px-2">
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search books..."
                      className="w-full px-4 py-3 pl-10 rounded-lg bg-blue-800 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-400 w-4 h-4" />
                  </div>
                </form>

                <Link to="/books" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-lg text-white hover:bg-blue-800">
                  Browse Books
                </Link>
                <Link to="/cart" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-lg text-white hover:bg-blue-800 flex items-center justify-between">
                  <span>Cart</span>
                  {itemCount > 0 && (
                    <span className="bg-amber-500 text-blue-900 font-bold text-xs rounded-full px-2 py-1">
                      {itemCount}
                    </span>
                  )}
                </Link>

                {isAuthenticated ? (
                  <>
                    <Link to="/orders" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-lg text-white hover:bg-blue-800">
                      My Orders
                    </Link>
                    {user?.role === 'admin' && (
                      <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-lg text-white hover:bg-blue-800">
                        Admin Panel
                      </Link>
                    )}
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-3 rounded-lg text-white hover:bg-blue-800">
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-lg text-white hover:bg-blue-800">
                      Login
                    </Link>
                    <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-lg text-white hover:bg-blue-800">
                      Register
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navigation;
