import React, { createContext, useContext, useEffect } from 'react';

const AdminContext = createContext();

export const AdminProvider = ({ children, isAdmin = false }) => {
  useEffect(() => {
    if (isAdmin) {
      // Load admin-specific CSS
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = '/assets/css/style.css';
      link.id = 'admin-style-css';
      document.head.appendChild(link);

      // Cleanup function to remove CSS when component unmounts
      return () => {
        const existingLink = document.getElementById('admin-style-css');
        if (existingLink) {
          document.head.removeChild(existingLink);
        }
      };
    }
  }, [isAdmin]);

  return (
    <AdminContext.Provider value={{ isAdmin }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export default AdminContext;
