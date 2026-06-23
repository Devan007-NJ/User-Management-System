import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../../api/auth';
import { clearAuth } from '../../app/store';
import { Link } from 'react-router-dom';

const LogoutButton = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    dispatch(clearAuth());
    navigate('/login');
  };
  <Link to="/profile">My Profile</Link>

  return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;