import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/useAuth';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const glowPulse = {
  animate: {
    boxShadow: [
      '0 0 20px rgba(0,240,255,0.2)',
      '0 0 40px rgba(0,240,255,0.35)',
      '0 0 20px rgba(0,240,255,0.2)',
    ],
    transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
  },
};

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : '??';

  return (
    <motion.div
      className="dashboard-container"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.nav className="dash-nav" variants={item}>
        <div className="dash-logo">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00f0ff" strokeWidth="2">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
          <span>AuthFlow</span>
        </div>
        <motion.button
          className="btn-ghost"
          onClick={handleLogout}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Sign out
        </motion.button>
      </motion.nav>

      <motion.div className="dash-content" variants={item}>
        <motion.div className="avatar-ring" variants={glowPulse} animate="animate">
          <div className="avatar">
            {user?.avatar?.url ? (
              <img src={user.avatar.url} alt={user.username} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
              initials
            )}
          </div>
        </motion.div>

        <motion.h1 variants={item}>
          Welcome, <span className="neon-text">{user?.username || 'User'}</span>
        </motion.h1>

        <motion.p className="dash-subtitle" variants={item}>
          You are authenticated and ready to build.
        </motion.p>

        <motion.div className="dash-grid" variants={container}>
          <motion.div className="dash-card" variants={item} whileHover={{ y: -4, boxShadow: '0 8px 32px rgba(0,240,255,0.15)' }}>
            <div className="dash-card-icon cyan">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <h3>Profile</h3>
            <p>{user?.email || 'No email'}</p>
            <p className="dash-card-meta">{user?.role || 'USER'}</p>
          </motion.div>

          <motion.div className="dash-card" variants={item} whileHover={{ y: -4, boxShadow: '0 8px 32px rgba(255,0,255,0.15)' }}>
            <div className="dash-card-icon magenta">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <h3>Session</h3>
            <p>Active and secure</p>
          </motion.div>

          <motion.div className="dash-card" variants={item} whileHover={{ y: -4, boxShadow: '0 8px 32px rgba(123,45,255,0.15)' }}>
            <div className="dash-card-icon purple">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            </div>
            <h3>Status</h3>
            <p>All systems operational</p>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
