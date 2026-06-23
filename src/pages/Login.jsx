import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/useAuth';

const inputVariants = {
  idle: { borderColor: 'rgba(255,255,255,0.12)' },
  focus: { borderColor: '#ff00ff', boxShadow: '0 0 0 3px rgba(255,0,255,0.15)' },
};

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.username, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed');
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
          <div className="auth-icon magenta">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" y1="12" x2="3" y2="12" />
            </svg>
          </div>
          <h1>Welcome back</h1>
          <p>Sign in to your account</p>
        </motion.div>

        <form onSubmit={handleSubmit}>
          <motion.div className="form-group" variants={item}>
            <label htmlFor="username">Username</label>
            <motion.input
              id="username"
              type="text"
              required
              placeholder="your username"
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
              placeholder="your password"
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
            className="btn-primary magenta"
            disabled={loading}
            variants={item}
            whileHover={{ scale: 1.02, boxShadow: '0 0 24px rgba(255,0,255,0.3)' }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? (
              <span className="spinner" />
            ) : (
              'Sign in'
            )}
          </motion.button>
        </form>

        <motion.p className="auth-footer" variants={item}>
          Don't have an account? <Link to="/register">Create one</Link>
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
