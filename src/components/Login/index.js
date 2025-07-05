import { useState } from 'react';
import axios from '../../api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import { MagnifyingGlass, Oval, ThreeDots } from 'react-loader-spinner';
import { Link } from 'react-router-dom';
import './Login.css';


function Login() {
    const [form, setForm] = useState({ username: '', password: '' });
    const [msg, setMsg] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();
    const [disableSubmit, setDisableSubmit] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setDisableSubmit(true);
        setMsg('');
        try {
            const res = await axios.post('/login', form);
            const { accessToken, refreshToken, username, userid } = res.data;
            login(accessToken, refreshToken, username, userid);
            const payload = JSON.parse(atob(accessToken.split('.')[1]));
            const role = payload.role;
            if (role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/home');
            }
        } catch (err) {
            setMsg(err.response?.data?.message || 'Login failed');
            setDisableSubmit(false);
            console.log("Err: " + err.response?.data?.message);
            setForm({ username: '', password: '' });
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2 className="login-title">Sign in</h2>
                <input name="username" className="login-input" placeholder="Username" onChange={handleChange} value={form.username} required />
                <input type="password" name="password" className="login-input" placeholder="Password" onChange={handleChange} value={form.password} required />
                <button disabled={disableSubmit} className={disableSubmit ? 'disable-login' : 'login-button'} type="submit">Login </button>
                {msg && <p className="login-error">{msg}</p>}
                {disableSubmit && <div className='loader-div'>
                    <ThreeDots visible={true} height="10" color="#046bc5" ariaLabel="line-wave-loading" wrapperStyle={{}} wrapperClass="" />
                </div>}

                <div className='register-link-div'>
                    <Link to='/register' className='register-link'>Sign up now!</Link>
                </div>
            </form>

        </div>
    );
}

export default Login;