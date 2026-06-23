import axiosInstance from './axiosInstance';

export const loginUser = async (email: string, password: string) => {
  const response = await axiosInstance.post('/auth/login/', { email, password });

  localStorage.setItem('access_token', response.data.access);
  localStorage.setItem('refresh_token', response.data.refresh);
  localStorage.setItem('user_email', response.data.email);
  localStorage.setItem('user_role', response.data.role);

  return response.data;
};

export const registerUser = async (email: string, password: string) => {
  const response = await axiosInstance.post('/auth/register/', {
    email,
    password,
  });

  return response.data;
};

export const logoutUser = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user_email');
  localStorage.removeItem('user_role');
};
