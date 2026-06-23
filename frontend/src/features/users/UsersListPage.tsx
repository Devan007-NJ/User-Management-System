import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../app/store';
import { fetchUsers, deleteUser } from '../../api/users';

const UserListPage = () => {
  const queryClient = useQueryClient();
  const role = useSelector((state: RootState) => state.auth.role);

  const { data: users, isLoading, isError } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return (
    <div className="terminal-state">
      <p>Loading user records...</p>
    </div>
  );

  if (isError) return (
    <div className="terminal-state danger">
      <p>Failed to load users.</p>
    </div>
  );

  return (
    <div className="panel-page">
      <div className="workspace-header">
        <div>
          <p className="workspace-kicker">[directory]</p>
          <h2>Users</h2>
          <p>{users?.length} total records</p>
        </div>
        {role === 'admin' && (
          <Link
            to="/users/create"
            className="terminal-button compact"
          >
            <span aria-hidden="true">[+]</span>
            New User
          </Link>
        )}
      </div>

      <div className="data-surface">
        <table className="data-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Role</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user) => (
              <tr key={user.id}>
                <td data-label="Email">{user.email}</td>
                <td data-label="Role">
                  <span className={user.role === 'admin' ? 'role-chip admin' : 'role-chip'}>
                    {user.role}
                  </span>
                </td>
                <td data-label="Created" className="muted-cell">
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
                <td data-label="Actions">
                  <div className="table-actions">
                    <Link
                      to={`/users/${user.id}`}
                      className="table-action-link"
                    >
                      View
                    </Link>
                    {role === 'admin' && (
                      <>
                        <Link
                          to={`/users/${user.id}/edit`}
                          className="table-action-link"
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(user.id)}
                          className="table-action-link danger"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users?.length === 0 && (
          <div className="empty-state">
            <p>No users yet.</p>
            {role === 'admin' && (
              <Link
                to="/users/create"
                className="table-action-link"
              >
                Create the first one
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserListPage;
