import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const WriterLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/login/writer', { username, password });

            if (response.data.success) {
                // Save the token in localStorage
                localStorage.setItem('token', response.data.token);

                // Redirect to the writer dashboard
                navigate('/writer-dashboard');
            } else {
                setErrorMessage('Invalid username or password');
            }
        } catch (error) {
            // Handle different error scenarios
            if (error.response && error.response.status === 404) {
                setErrorMessage('Writer not found. Please sign up.');
                navigate('/signup/writer'); // Redirect to signup page if not found
            } else {
                console.error("Login error:", error);
                setErrorMessage('An error occurred. Please try again.');
            }
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.header}>Writer Login</h2>
            <form onSubmit={handleLogin} style={styles.form}>
                <input 
                    type="text" 
                    placeholder="Username" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    required 
                    style={styles.input}
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                    style={styles.input}
                />
                <button 
                    type="submit" 
                    style={styles.button}
                >
                    Login
                </button>
            </form>
            {errorMessage && <p style={styles.errorText}>{errorMessage}</p>}
            <p style={styles.signupText}>
                Don't have an account? <a href="/signup/writer" style={styles.signupLink}>Sign Up</a>
            </p>
        </div>
    );
};

// Inline CSS Styles
const styles = {
    container: {
        textAlign: 'center',
        padding: '20px',
        background: 'url("https://www.example.com/music-poetry-background.jpg") no-repeat center center/cover',
        minHeight: '100vh',
        color: '#fff',
    },
    header: {
        fontSize: '2rem',
        marginBottom: '20px',
        color: '#FFD700', // Gold color
    },
    form: {
        marginBottom: '20px',
        display: 'inline-block',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
    },
    input: {
        display: 'block',
        margin: '10px auto',
        padding: '12px',
        width: '80%',
        maxWidth: '300px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        backgroundColor: 'transparent',
        color: '#fff',
        fontSize: '14px',
    },
    button: {
        padding: '10px 20px',
        marginTop: '10px',
        border: 'none',
        borderRadius: '5px',
        backgroundColor: '#007bff',
        color: '#fff',
        cursor: 'pointer',
        fontSize: '16px',
        transition: 'background-color 0.3s',
    },
    signupText: {
        fontSize: '14px',
        marginTop: '15px',
        color: '#fff',
    },
    signupLink: {
        color: '#FFD700', // Use a contrasting color for the signup link
        cursor: 'pointer',
        textDecoration: 'underline',
    },
    errorText: {
        color: 'red',
        fontSize: '14px',
        marginTop: '10px',
    },
};

export default WriterLogin;
