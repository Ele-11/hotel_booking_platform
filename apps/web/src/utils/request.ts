import { message } from 'antd';
import axios, { AxiosRequestConfig } from 'axios';

const request = axios.create({
  baseURL: 'http://localhost:3001',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

request.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const errorMsg = error.response?.data?.message || '请求失败，请稍后重试';
    message.error(errorMsg);

    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);
export default <T>(config: AxiosRequestConfig) => {
  return request(config) as Promise<T>;
};
