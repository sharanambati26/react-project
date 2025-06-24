import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import { AuthProvider } from '../src/AuthContext';
import Header from './components/Header';
import { CartProvider } from '../src/CartContext';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import ProtectedRoute from './ProtectedRoute';

const App = () => {
  return (
    <CartProvider>
            <AuthProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element = {<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
    </CartProvider>

  );
};

export default App;
