import React, { useState } from 'react';
import axios from 'axios';

const WriterSignup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    genre: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/signup/writer', {
        name: formData.name,
        email: formData.email,
        username: formData.username,
        password: formData.password,
        genre: formData.genre, // Keep this consistent with backend
      });
      alert(response.data.message);
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      alert('Signup failed. Please try again.');
    }
  };
  

  return (
    <div style={styles.container}>
      <div style={styles.formBox}>
        <h2 style={styles.header}>Writer Signup</h2>
        <form onSubmit={handleSubmit}>
          <label style={styles.label}>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <label style={styles.label}>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <label style={styles.label}>Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <label style={styles.label}>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <label style={styles.label}>Genres:</label>
          <input
            type="text"
            name="genre"
            value={formData.genre}
            onChange={handleChange}
            placeholder="e.g., Fiction, Poetry"
            style={styles.input}
          />

          <button type="submit" style={styles.button}>Signup</button>
        </form>
      </div>
    </div>
  );
};

// Inline CSS Styles
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: 'url("https://www.example.com/music-poetry-background.jpg") no-repeat center center/cover', // Example music/poetry background
    color: '#fff',
  },
  formBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Dark background to contrast text
    padding: '30px',
    borderRadius: '10px',
    width: '400px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
  },
  header: {
    textAlign: 'center',
    color: '#FFD700', // Gold color for header
    marginBottom: '20px',
  },
  label: {
    fontSize: '14px',
    marginBottom: '5px',
    color: '#DDD',
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '20px',
    border: '1px solid #fff',
    borderRadius: '5px',
    backgroundColor: 'transparent',
    color: '#fff',
    fontSize: '14px',
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#FFD700', // Gold button
    border: 'none',
    borderRadius: '5px',
    color: '#000',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
};

// Export the WriterSignup component
export default WriterSignup;
