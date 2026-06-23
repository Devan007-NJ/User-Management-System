import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../features/auth/loginPage';
import RegisterPage from '../features/auth/RegisterPage';
import ProtectedRoute from './ProtectedRoute';
import Layout from '../components/Layout';
import UserListPage from '../features/users/UsersListPage';
import UserDetailPage from '../features/users/UserDetailPage';
import UserEditPage from '../features/users/UserEditPage';
import UserCreatePage from '../features/users/UserCreatePage';
import ProfilePage from '../features/profiles/ProfilePage';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<Navigate to="/users" replace />} />
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <Layout><UserListPage /></Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/users/create"
          element={
            <ProtectedRoute>
              <Layout><UserCreatePage /></Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/users/:id"
          element={
            <ProtectedRoute>
              <Layout><UserDetailPage /></Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/users/:id/edit"
          element={
            <ProtectedRoute>
              <Layout><UserEditPage /></Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Layout><ProfilePage /></Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;