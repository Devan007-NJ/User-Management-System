import axiosInstance from './axiosInstance';

export interface Profile {
  id: string;
  email: string;
  created_at: string;
  profile_image: string | null;
}

export const fetchProfile = async (): Promise<Profile> => {
  const response = await axiosInstance.get<Profile>('/profile/me/');
  return response.data;
};

export const updateProfile = async (email: string): Promise<Profile> => {
  const response = await axiosInstance.put<Profile>('/profile/me/', { email });
  return response.data;
};

export const uploadProfileImage = async (file: File): Promise<{ profile_image: string }> => {
  const formData = new FormData();
  formData.append('image', file);

  const response = await axiosInstance.post('/profile/me/image/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};