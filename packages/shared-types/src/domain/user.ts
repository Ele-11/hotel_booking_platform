//  创建用户相关类型
import { IBaseEntity } from '../index';

// 用户角色
export type UserRole = 'admin' | 'merchant' | 'customer';

// 用户状态
export type UserStatus = 'active' | 'inactive' | 'suspended';

// 用户基本信息
export interface IUser extends IBaseEntity {
  email: string;
  username: string;
  fullName: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  lastLoginAt?: Date;
}

// 商户信息
export interface IMerchant extends IUser {
  companyName: string;
  businessLicense?: string;
  taxId?: string;
  hotels?: string[]; // 管理的酒店ID数组
}

// 登录请求
export interface ILoginRequest {
  email: string;
  password: string;
}

// 登录响应
export interface ILoginResponse {
  accessToken: string;
  refreshToken: string;
  user: IUser;
  expiresIn: number;
}

// 注册请求
export interface IRegisterRequest {
  email: string;
  password: string;
  username: string;
  fullName: string;
  phone?: string;
  role: UserRole;
  companyName?: string; // 商户注册时需要
}

// 更新用户信息
export interface IUpdateUserRequest {
  fullName?: string;
  phone?: string;
  avatar?: string;
}
