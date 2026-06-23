import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/useAuth';

const inputVariants = {
  idle: { borderColor: 'rgba(255,255,255,0.12)' },
  focus: { borderColor: '#00f0ff', boxShadow: '0 0 0 3px rgba(0,240,255,0.15)' },
};

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export default function Register() {
  const [form, setForm] = useState({ email: '', username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form.email, form.password, form.username);
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="auth-container"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.div className="auth-card" variants={item}>
        <motion.div className="auth-header" variants={item}>
          <div className="auth-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <line x1="19" y1="8" x2="19" y2="14" />
              <line x1="22" y1="11" x2="16" y2="11" />
            </svg>
          </div>
          <h1>Create account</h1>
          <p>Start building something remarkable</p>
        </motion.div>

        <form onSubmit={handleSubmit}>
          <motion.div className="form-group" variants={item}>
            <label htmlFor="email">Email</label>
            <motion.input
              id="email"
              type="email"
              required
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              variants={inputVariants}
              initial="idle"
              whileFocus="focus"
            />
          </motion.div>

          <motion.div className="form-group" variants={item}>
            <label htmlFor="username">Username</label>
            <motion.input
              id="username"
              type="text"
              required
              placeholder="choose a username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              variants={inputVariants}
              initial="idle"
              whileFocus="focus"
            />
          </motion.div>

          <motion.div className="form-group" variants={item}>
            <label htmlFor="password">Password</label>
            <motion.input
              id="password"
              type="password"
              required
              placeholder="minimum 6 characters"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              variants={inputVariants}
              initial="idle"
              whileFocus="focus"
            />
          </motion.div>

          {error && (
            <motion.p
              className="error"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </motion.p>
          )}

          <motion.button
            type="submit"
            className="btn-primary"
            disabled={loading}
            variants={item}
            whileHover={{ scale: 1.02, boxShadow: '0 0 24px rgba(0,240,255,0.3)' }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? (
              <span className="spinner" />
            ) : (
              'Create account'
            )}
          </motion.button>
        </form>

        <motion.p className="auth-footer" variants={item}>
          Already have an account? <Link to="/login">Sign in</Link>
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
