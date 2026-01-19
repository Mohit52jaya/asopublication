import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  isAuthenticated: !!localStorage.getItem('user'),
  
  login: (email, password) => {
    // 1. Check Demo Credentials
    if (email === 'admin@bookhub.com' && password === 'admin123') {
      const user = { id: 'admin-1', email, name: 'Admin User', role: 'admin' };
      localStorage.setItem('user', JSON.stringify(user));
      set({ user, isAuthenticated: true });
      return { success: true, role: 'admin' };
    }

    if (email === 'user@test.com' && password === 'password123') {
      const user = { id: 'user-1', email, name: 'Test User', role: 'user' };
      localStorage.setItem('user', JSON.stringify(user));
      set({ user, isAuthenticated: true });
      return { success: true, role: 'user' };
    }

    // 2. Check Registered Users in LocalStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    // Exact match for email and password (case-sensitive for password usually, but here we do simple string comparison)
    const registeredUser = users.find(u => u.email === email && u.password === password);
    
    if (registeredUser) {
      const { password: _, ...userWithoutPassword } = registeredUser;
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      set({ user: userWithoutPassword, isAuthenticated: true });
      return { success: true, role: userWithoutPassword.role };
    }

    return { success: false, error: 'Invalid credentials. Please try again.' };
  },
  
  register: (userData) => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    if (users.find(u => u.email === userData.email)) {
      return { success: false, error: 'Email already exists' };
    }
    
    const newUser = {
      id: Date.now().toString(),
      ...userData,
      // Auto-assign admin role if email contains 'admin' for demo purposes, else 'user'
      role: userData.email.includes('admin') ? 'admin' : 'user',
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    const { password, ...userWithoutPassword } = newUser;
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));
    set({ user: userWithoutPassword, isAuthenticated: true });
    
    return { success: true };
  },
  
  logout: () => {
    localStorage.removeItem('user');
    set({ user: null, isAuthenticated: false });
  },
  
  updateUser: (userData) => {
    const updatedUser = { ...useAuthStore.getState().user, ...userData };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    set({ user: updatedUser });
  }
}));

export default useAuthStore;
