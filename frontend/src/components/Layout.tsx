import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../app/store';
import { clearAuth } from '../app/store';
import { logoutUser } from '../api/auth';

const navItems = [
  { label: 'Users', path: '/users' },
  { label: 'Profile', path: '/profile' },
];

const Layout = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const email = useSelector((state: RootState) => state.auth.email);
  const role = useSelector((state: RootState) => state.auth.role);

  const handleLogout = () => {
    logoutUser();
    dispatch(clearAuth());
    navigate('/login');
  };

  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <div>
          <div className="app-brand-block">
            <h1>User Panel</h1>
            <p>Management System</p>
          </div>

          <nav className="app-nav" aria-label="Primary">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  isActive ? 'app-nav-link active' : 'app-nav-link'
                }
              >
                <span aria-hidden="true">[</span>
                {item.label}
                <span aria-hidden="true">]</span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="app-session">
          <p title={email || ''}>{email || 'No active email'}</p>
          <span>{role || 'guest'}</span>
          <button onClick={handleLogout} type="button">
            Sign out
          </button>
        </div>
      </aside>

      <main className="app-main">
        <div className="app-workspace">{children}</div>
      </main>
    </div>
  );
};

export default Layout;
