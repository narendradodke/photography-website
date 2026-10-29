import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAdminAuthStore } from '../store/authStore';

export const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, checkAuth } = useAdminAuthStore();
  const [checking, setChecking] = useState(true);
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;
    checkAuth().finally(() => {
      if (isMounted) setChecking(false);
    });
    return () => {
      isMounted = false;
    };
  }, [checkAuth]);

  if (checking) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
        <p className="font-serif text-sm tracking-widest uppercase text-neutral-400">
          Authenticating LensFrame Administrator...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

