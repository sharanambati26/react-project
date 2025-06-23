import { useState } from 'react';
import axios from '../../api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import './Login.css';

function Login() {
    const [form, setForm] = useState({ username: '', password: '' });
    const [msg, setMsg] = useState('');
    const navigate = useNavigate();
    const {login} = useAuth();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/login', form);
            const { accessToken, refreshToken, username } = res.data;

            login(accessToken, refreshToken, username);

            const payload = JSON.parse(atob(accessToken.split('.')[1]));
            const role = payload.role;

            if (role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/home');
            }
        } catch (err) {
            console.log(err)
            setMsg(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2 className="login-title">Sign in</h2>
                <input
                    name="username"
                    className="login-input"
                    placeholder="Username"
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    className="login-input"
                    placeholder="Password"
                    onChange={handleChange}
                    required
                />
                <button className="login-button" type="submit">Login</button>
                {msg && <p className="login-error">{msg}</p>}
            </form>
        </div>
    );
}

export default Login;