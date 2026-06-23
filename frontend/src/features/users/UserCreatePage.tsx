import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { createUser } from '../../api/users';

type ApiError = {
  response?: {
    data?: {
      error?: string;
    };
  };
};

const UserCreatePage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => createUser(email, password),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      navigate('/users');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate();
  };

  const errorMessage =
    (mutation.error as ApiError | null)?.response?.data?.error || 'Failed to create user.';

  return (
    <div className="panel-page">
      <div className="workspace-header">
        <div>
          <p className="workspace-kicker">[create]</p>
          <h2>New User</h2>
          <p>Create a new account</p>
        </div>
        <Link to="/users" className="table-action-link">
          &lt;- Cancel
        </Link>
      </div>

      <div className="terminal-section narrow">
        <div className="terminal-section-title">
          <span>[account details]</span>
        </div>

        <form onSubmit={handleSubmit} className="terminal-form">
          <div className="terminal-field">
            <label htmlFor="create-email">Email</label>
            <input
              id="create-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
            />
          </div>

          <div className="terminal-field">
            <label htmlFor="create-password">Password</label>
            <input
              id="create-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 8 characters"
            />
          </div>

          {mutation.isError && (
            <p className="terminal-message danger">{errorMessage}</p>
          )}

          <button
            type="submit"
            disabled={mutation.isPending}
            className="terminal-button"
          >
            <span aria-hidden="true">[+]</span>
            {mutation.isPending ? 'Creating...' : 'Create User'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserCreatePage;
