import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import useAuthStore from '@/stores/useAuthStore';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login, isAuthenticated } = useAuthStore();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    // Validate fields before attempting login
    if (!formData.email || !formData.password) {
      const errorMsg = "Please fill in all fields";
      setError(errorMsg);
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive"
      });
      return;
    }

    const result = login(formData.email, formData.password);
    
    if (result.success) {
      toast({
        title: "Success!",
        description: "You have been logged in successfully."
      });
      
      // Redirect based on role
      if (result.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/books'); // Redirecting to catalog page
      }
    } else {
      setError(result.error);
      toast({
        title: "Login Failed",
        description: result.error,
        variant: "destructive"
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Login - BookHub</title>
        <meta name="description" content="Login to your BookHub account to manage orders and enjoy personalized features." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-blue-900 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Login to your BookHub account</p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center text-sm">
              <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center text-gray-700">
                <input type="checkbox" className="mr-2" />
                Remember me
              </label>
              <a href="#" className="text-blue-900 hover:text-blue-700">
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-900 hover:bg-blue-800 text-white py-6 text-lg"
            >
              <LogIn className="w-5 h-5 mr-2" />
              Login
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-900 hover:text-blue-700 font-semibold">
                Register here
              </Link>
            </p>
          </div>

          <div className="mt-6 pt-6 border-t text-center">
            <p className="text-sm text-gray-600 mb-3">Demo Credentials:</p>
            <div className="bg-blue-50 p-3 rounded-lg text-sm text-left space-y-1">
              <p className="text-gray-700">
                <strong>User:</strong> user@test.com / password123
              </p>
              <p className="text-gray-700">
                <strong>Admin:</strong> admin@bookhub.com / admin123
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Login;
