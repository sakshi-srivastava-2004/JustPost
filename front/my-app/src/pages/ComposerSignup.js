import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ComposerSignup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobileNo: '',
    username: '',
    password: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/signup/composer', {
        name: formData.name,
        email: formData.email,
        mobileNo: formData.mobileNo,
        username: formData.username,
        password: formData.password,
      });
      alert(response.data.message);
      navigate('/login/composer');
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      alert('Signup failed. Please try again.');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formBox}>
        <h2 style={styles.header}>Composer Signup</h2>
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

          <label style={styles.label}>Mobile Number:</label>
          <input
            type="text"
            name="mobileNo"
            value={formData.mobileNo}
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

          <button type="submit" style={styles.button}>Signup</button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: 'url("https://www.example.com/music-poetry-background.jpg") no-repeat center center/cover',
    color: '#fff',
  },
  formBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: '30px',
    borderRadius: '10px',
    width: '400px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
  },
  header: {
    textAlign: 'center',
    color: '#FFD700',
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
    backgroundColor: '#FFD700',
    border: 'none',
    borderRadius: '5px',
    color: '#000',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
};

export default ComposerSignup;
