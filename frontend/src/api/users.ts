import axiosInstance from './axiosInstance';

export interface User {
  id: string;
  email: string;
  role: string;
  created_at: string;
}

export const fetchUsers = async (): Promise<User[]> => {
  const response = await axiosInstance.get<User[]>('/users/');
  return response.data;
};

export const deleteUser = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/users/${id}/`);
};

export const fetchUserById = async (id: string): Promise<User> => {
  const response = await axiosInstance.get<User>(`/users/${id}/`);
  return response.data;
};

export const updateUser = async (id: string, data: Partial<User>): Promise<User> => {
  const response = await axiosInstance.put<User>(`/users/${id}/`, data);
  return response.data;
};
export const createUser = async (email: string, password: string): Promise<User> => {
  const response = await axiosInstance.post<User>('/users/', { email, password });
  return response.data;
};