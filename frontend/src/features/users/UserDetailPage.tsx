import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../app/store';
import { fetchUserById } from '../../api/users';

const UserDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const role = useSelector((state: RootState) => state.auth.role);

  const { data: user, isLoading, isError } = useQuery({
    queryKey: ['users', id],
    queryFn: () => fetchUserById(id!),
    enabled: !!id,
  });

  if (isLoading) return (
    <div className="terminal-state">
      <p>Loading user record...</p>
    </div>
  );

  if (isError || !user) return (
    <div className="terminal-state danger">
      <p>User not found.</p>
    </div>
  );

  return (
    <div className="panel-page">
      <div className="workspace-header">
        <div>
          <p className="workspace-kicker">[record]</p>
          <h2>User Details</h2>
          <p>Viewing account information</p>
        </div>
        <Link to="/users" className="table-action-link">
          &lt;- Back
        </Link>
      </div>

      <div className="terminal-section">
        <div className="record-heading">
          <div className="record-avatar">{user.email[0]}</div>
          <div>
            <p>{user.email}</p>
            <span className={user.role === 'admin' ? 'role-chip admin' : 'role-chip'}>
              {user.role}
            </span>
          </div>
        </div>

        <div className="record-list">
          <div>
            <span>User ID</span>
            <strong>{user.id}</strong>
          </div>
          <div>
            <span>Email</span>
            <strong>{user.email}</strong>
          </div>
          <div>
            <span>Role</span>
            <strong>{user.role}</strong>
          </div>
          <div>
            <span>Created</span>
            <strong>{new Date(user.created_at).toLocaleString()}</strong>
          </div>
        </div>

        {role === 'admin' && (
          <div className="section-actions">
            <Link to={`/users/${user.id}/edit`} className="terminal-button compact">
              <span aria-hidden="true">[-&gt;]</span>
              Edit User
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDetailPage;
