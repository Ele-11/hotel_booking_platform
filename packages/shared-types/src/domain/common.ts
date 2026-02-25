// 基础类型定义
export interface IBaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// 定义错误接口
export interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

// 分页参数和结果类型定义
export interface IPaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface IPaginationResult<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// 通用 API 响应类型定义
export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
};
