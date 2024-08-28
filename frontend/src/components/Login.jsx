import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';  
import '../styles/Login.css';
import LogoD from '../images/LogoD.png'
const Login = () => {
    const navigate = useNavigate();

    const handleGoogleSignIn = () => {
        const redirectUrl = 'https://Yoriichi17.github.io/ReachInbox-Assignment/';
        const googleLoginUrl = `https://hiring.reachinbox.xyz/api/v1/auth/google-login?redirect_to=${redirectUrl}`;

        window.open(googleLoginUrl, '_self');
    };

    React.useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');

        if (token) {
            localStorage.setItem('authToken', token);
            window.history.replaceState({}, document.title, "/ReachInbox-Assignment");
            navigate('/ReachInbox-Assignment/onebox');
        }
    }, [navigate]);

    return (
        <div className="login-container">
            <header className="login-header">
                <img src={LogoD} alt="ReachInbox Logo" className="logo" />
                <h1>REACHINBOX</h1>
            </header>

            <div className="login-box">
                <h2>Create New Account</h2>
                <button onClick={handleGoogleSignIn} className="google-signin-button">
                    <FcGoogle className="google-icon" /> 
                    Sign in with Google
                </button>
                <button className="create-account-button">Create Account</button>
                <p className="signin-link">Already have an account? <a href="/signin">Sign in</a></p>
                
            </div>

            <footer className="login-footer">
                &copy; 2023 REACHINBOX. All rights reserved.
            </footer>
        </div>
    );
};

export default Login;
