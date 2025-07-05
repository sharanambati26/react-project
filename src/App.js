import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

import Home from './components/Home';
import Register from './components/Register';
import Login from './components/Login';
import Header from './components/Header';
import Cart from './components/Cart';
import Checkout from './components/Checkout';

import { AuthProvider } from '../src/AuthContext';
import { CartProvider } from '../src/CartContext';
import { SearchProvider } from './SearchContext';

const App = () => {
    return (
        <CartProvider>
            <AuthProvider>
                <SearchProvider>
                    <Router>
                        <Header />
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/home" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />                           
                            <Route path="/cart" element={<Cart />} />
                            <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                        </Routes>
                    </Router>
                </SearchProvider>
            </AuthProvider>
        </CartProvider>

    );
};

export default App;
