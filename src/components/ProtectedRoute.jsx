import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Loading from './Loading';

export default function ProtectedRoute({ children }) {
  const { user, authLoading } = useContext(AuthContext);
  if (authLoading) return <Loading />;
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
