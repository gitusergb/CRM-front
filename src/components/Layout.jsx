import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice.js';
import NotificationBell from './NotificationBell.jsx';

const Layout = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      <nav style={styles.nav}>
        <div style={styles.navContent}>
          <Link to="/dashboard" style={styles.logo}>
            CRM System
          </Link>
          <div style={styles.navLinks}>
            <Link to="/dashboard" style={styles.link}>Dashboard</Link>
            <Link to="/leads" style={styles.link}>Leads</Link>
            {user && (
              <div style={styles.userSection}>
                <NotificationBell />
                <span style={styles.userName}>
                  {user.firstName} {user.lastName} ({user.role})
                </span>
                <button onClick={handleLogout} style={styles.logoutBtn}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
      <main style={styles.main}>{children}</main>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
  },
  nav: {
    backgroundColor: '#fff',
    borderBottom: '1px solid #e0e0e0',
    padding: '1rem 0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  navContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#007bff',
    textDecoration: 'none',
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '2rem',
  },
  link: {
    color: '#333',
    textDecoration: 'none',
    fontWeight: '500',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    transition: 'background-color 0.2s',
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  userName: {
    color: '#666',
    fontSize: '0.9rem',
  },
  logoutBtn: {
    padding: '0.5rem 1rem',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  main: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem',
  },
};

export default Layout;

