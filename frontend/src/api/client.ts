/// <reference types="vite/client" />

import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

const client: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// リクエストインターセプター
client.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 必要に応じて認証トークンなどを追加
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// レスポンスインターセプター
client.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    // エラーハンドリング
    if (error.response) {
      // サーバーからのレスポンスがある場合
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      // リクエストは送信されたがレスポンスがない場合
      console.error('Network Error:', error.request);
    } else {
      // リクエストの設定中にエラーが発生した場合
      console.error('Request Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// 招待リンク関連のAPI
export const invitationApi = {
  generateLink: async (tenantSlug: string) => {
    const response = await client.get(`/tenants/${tenantSlug}/generate_invitation`);
    return response.data;
  },

  validateToken: async (token: string) => {
    const response = await client.get(`/invitations/validate/${token}`);
    return response.data;
  }
};

export default client; 