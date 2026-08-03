import React from 'react';
import Navbar from '../components/Navbar';

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex items-center justify-center min-h-[calc(100vh-64px)]">
        <div className="w-full max-w-md p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AuthLayout;
