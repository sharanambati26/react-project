import { useState } from 'react';
import axios from '../../api';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { ThreeDots } from 'react-loader-spinner'
import '../Login/Login.css';

function Register() {
    const [form, setForm] = useState({
        email: '',
        name: '',
        password: '',
        confirmPassword: ''
    });
    const [msg, setMsg] = useState('');
    const [disableSubmit, setDisableSubmit] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMsg('');

        if (form.password !== form.confirmPassword) {
            setMsg('Passwords do not match');
            return;
        }

        setDisableSubmit(true);
        try {
            await axios.post('/register', {
                email: form.email,
                name: form.name,
                password: form.password
            });

            setMsg('Registration successful! Please login.');
            setTimeout(() => {
                navigate('/login');
            }, 1500);
        } catch (err) {
            console.log(err);
            setMsg(err.response?.data?.message || 'Registration failed');
            setDisableSubmit(false);
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2 className="login-title">Sign up</h2>

                <input
                    type="email"
                    name="email"
                    className="login-input"
                    placeholder="Email"
                    onChange={handleChange}
                    required
                />
                <input
                    name="name"
                    className="login-input"
                    placeholder="Full Name"
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
                <input
                    type="password"
                    name="confirmPassword"
                    className="login-input"
                    placeholder="Confirm Password"
                    onChange={handleChange}
                    required
                />
                <button disabled={disableSubmit} className={disableSubmit ? 'disable-login' : 'login-button'} type="submit">
                    Register
                </button>
                {msg && <p className={msg.includes('successful') ? 'login-success' : 'login-error'}>{msg}</p>}
                {disableSubmit && <div className='loader-div'>
                    <ThreeDots visible={true} height="10" color="green" ariaLabel="line-wave-loading" wrapperStyle={{}} wrapperClass="" />
                </div>}

                <div className='register-link-div'>
                    <Link to='/login' className='register-link'>Sign in</Link>
                </div>
            </form>
        </div>
    );
}

export default Register;
