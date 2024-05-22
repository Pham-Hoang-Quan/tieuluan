import { useContext } from 'react';
import { Route, Navigate, useNavigate } from 'react-router-dom';
import { AppContext } from 'context/AppContext';

export function AdminRoute({ children }) {
    const { authUser } = useContext(AppContext);
    const navigate = useNavigate();
  
    if (!authUser || authUser.role !== 'admin') {
      navigate('/signIn-pagen');
      return null;
    }
  
    return children;
  
}