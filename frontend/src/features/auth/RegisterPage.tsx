import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../../api/auth';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: () => registerUser(email, password),
    onSuccess: () => {
      navigate('/login');
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
          <p className="auth-subtitle">Create a credential profile _</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-section-title">
            <span>[identity]</span>
          </div>

          <div className="auth-field">
            <label htmlFor="register-email">Email</label>
            <input
              id="register-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="register-password">Password</label>
            <input
              id="register-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              autoComplete="new-password"
              minLength={8}
              required
            />
          </div>

          {mutation.isError && (
            <p className="auth-error">Unable to create this account.</p>
          )}

          <div className="auth-section-title auth-actions-title">
            <span>[action]</span>
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="auth-action-button"
          >
            <span aria-hidden="true">[+]</span>
            {mutation.isPending ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account?{' '}
          <Link to="/login">
            Sign in
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

export default RegisterPage;
