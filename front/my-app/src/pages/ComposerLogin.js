import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ComposerLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/login/composer', { username, password });
            if (response.data.success) {
                navigate('/composer-dashboard'); // Redirect to composer dashboard after successful login
            }
        } catch (error) {
            // Redirect to signup page if the composer is not found
            if (error.response && error.response.status === 404) {
                navigate('/signup/composer'); // Redirect to signup if not found
            } else {
                console.error("Login error:", error);
            }
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.header}>Composer Login</h2>
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
            <p style={styles.signupText}>
                Don't have an account? <a href="/signup/composer" style={styles.signupLink}>Sign Up</a>
            </p>
        </div>
    );
};

// Inline CSS Styles
const styles = {
    container: {
        textAlign: 'center',
        padding: '20px',
        background: 'url("https://www.example.com/music-poetry-background.jpg") no-repeat center center/cover', // Example background
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
        backgroundColor: 'rgba(0, 0, 0, 0.7)', // Dark background for form
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
        color: '#fff', // Ensure the "Don't have an account?" text is visible
    },
    signupLink: {
        color: '#FFD700', // Use a contrasting color for the signup link
        cursor: 'pointer',
        textDecoration: 'underline',
    },
};

export default ComposerLogin;
