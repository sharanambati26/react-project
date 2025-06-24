import { useAuth } from './AuthContext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { auth } = useAuth();

  return auth?.accessToken ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;