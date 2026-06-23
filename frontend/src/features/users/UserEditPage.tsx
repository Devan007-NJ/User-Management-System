import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchUserById, updateUser } from '../../api/users';

const UserEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [email, setEmail] = useState<string | null>(null);

  const { data: user, isLoading } = useQuery({
    queryKey: ['users', id],
    queryFn: () => fetchUserById(id!),
    enabled: !!id,
  });

  const emailValue = email ?? user?.email ?? '';

  const mutation = useMutation({
    mutationFn: () => updateUser(id!, { email: emailValue }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      navigate(`/users/${id}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate();
  };

  if (isLoading) return (
    <div className="terminal-state">
      <p>Loading user record...</p>
    </div>
  );

  return (
    <div className="panel-page">
      <div className="workspace-header">
        <div>
          <p className="workspace-kicker">[modify]</p>
          <h2>Edit User</h2>
          <p>Update account details</p>
        </div>
        <Link to={`/users/${id}`} className="table-action-link">
          &lt;- Cancel
        </Link>
      </div>

      <div className="terminal-section narrow">
        <div className="terminal-section-title">
          <span>[account information]</span>
        </div>

        <form onSubmit={handleSubmit} className="terminal-form">
          <div className="terminal-field">
            <label htmlFor="edit-email">Email</label>
            <input
              id="edit-email"
              type="email"
              value={emailValue}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {mutation.isError && (
            <p className="terminal-message danger">Update failed. Please try again.</p>
          )}

          <button
            type="submit"
            disabled={mutation.isPending}
            className="terminal-button"
          >
            <span aria-hidden="true">[-&gt;]</span>
            {mutation.isPending ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserEditPage;
