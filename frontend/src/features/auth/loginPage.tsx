import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../../api/auth';
import { setAuth } from '../../app/store';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: () => loginUser(email, password),
    onSuccess: (data) => {
      dispatch(setAuth({ email: data.email, role: data.role }));
      navigate('/users');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate();
  };

  return (
    <div className="auth-page">
      <div className="auth-panel">
        <div className="auth-header">
          <div className="auth-brand-row">
            <h1 className="auth-brand">User Panel</h1>
            <span className="auth-dot" aria-hidden="true" />
            <span className="auth-mode">Access</span>
          </div>
          <p className="auth-subtitle">Authenticate credentials _</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-section-title">
            <span>[identity]</span>
          </div>

          <div className="auth-field">
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              autoComplete="current-password"
              required
            />
          </div>

          {mutation.isError && (
            <p className="auth-error">Invalid email or password.</p>
          )}

          <div className="auth-section-title auth-actions-title">
            <span>[action]</span>
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="auth-action-button"
          >
            <span aria-hidden="true">[-&gt;]</span>
            {mutation.isPending ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account?{' '}
          <Link to="/register">
            Register
          </Link>
        </p>

        <div className="auth-footer">
          <span>User management system v1.0.0</span>
          <span className="auth-status">Operational</span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
