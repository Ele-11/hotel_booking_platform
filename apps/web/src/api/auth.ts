import request from '../utils/request';

interface UserInfo {
  id: number;
  email: string;
  username: string;
  fullName: string;
  role: 'admin' | 'user';
}

interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: UserInfo;
}
export const login = (data: { email: string; password: string }): Promise<LoginResponse> => {
  return request<LoginResponse>({
    url: '/auth/login',
    method: 'POST',
    data,
  });
};

export const register = (data: {
  email: string;
  username: string;
  fullName: string;
  password: string;
  role: 'admin' | 'user';
}): Promise<LoginResponse> => {
  return request<LoginResponse>({
    url: '/auth/register',
    method: 'POST',
    data,
  });
};
