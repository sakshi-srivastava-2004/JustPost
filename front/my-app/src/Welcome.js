import React from 'react';
import { Link } from 'react-router-dom';

const Welcome = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.header}>JustPost</h1>
      <div style={styles.linksContainer}>
        {/* Writer Section */}
        <Link to="/login/writer" style={styles.linkCard}>
          <div style={styles.icon}>
            {/* Writer Icon: Pen */}
            ✍️
          </div>
          <span style={styles.linkText}>Writer</span>
        </Link>
        {/* Composer Section */}
        <Link to="/login/composer" style={styles.linkCard}>
          <div style={styles.icon}>
            {/* Composer Icon: Musical Note */}
            🎵
          </div>
          <span style={styles.linkText}>Composer</span>
        </Link>
      </div>
    </div>
  );
};

// Inline CSS Styles
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '50px 20px',
    backgroundColor: '#f0f0f0', // Light background for the page
    minHeight: '100vh',
  },
  header: {
    fontSize: '3rem',
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: '30px',
  },
  linksContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '40px', // Space between the cards
  },
  linkCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '40px',
    backgroundColor: '#fff',
    borderRadius: '15px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    transition: 'box-shadow 0.3s',
    width: '200px',
    cursor: 'pointer',
  },
  icon: {
    fontSize: '3rem',
    marginBottom: '20px',
    color: '#555',
  },
  linkText: {
    fontSize: '1.2rem',
    fontWeight: '600',
    color: '#333',
  },
};

export default Welcome;
