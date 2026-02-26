// // 封装axios

// import axios from 'axios'

// const httpInstance = axios.create({
//   baseURL: 'http://localhost:3001/api', // 替换为 实际后端地址 //我们的后端接口地址
//   timeout: 5000,
// })

// // 拦截器
// httpInstance.interceptors.request.use(
//   (config) => {
//     return config
//   },
//   (error) => {
//     return Promise.reject(error)
//   }
// )

// httpInstance.interceptors.response.use(
//   (response) => {
//     return response
//   },
//   (error) => {
//     return Promise.reject(error)
//   }
// )

// export { httpInstance }


// utils/http.ts
import axios from 'axios';
import {
  mockFeatureOptions,
  mockHotelList,
  mockLocationOptions,
  mockPriceOptions,
  mockSortOptions,
} from '../mock';

const http = axios.create({
  baseURL: 'http://localhost:3001/api', // 开发阶段可随意
  timeout: 10000,
});

// 添加请求拦截器
http.interceptors.request.use((config) => {
  // 开发环境启用 Mock
  if (__DEV__) { // React Native 中 __DEV__ 表示开发环境
    // 记录请求参数，便于调试
    console.log('Mock Request:', config.url, config.params);
    return config;
  }
  return config;
});

// 添加响应拦截器（处理 Mock）
http.interceptors.response.use(
  (response: any) => {
    // 在开发环境中，始终使用Mock数据
    if (__DEV__) {
      const url = response.config.url;
      
      if (url.includes('/options/sort')) {
        console.log('Using mock data for sort options');
        return { data: mockSortOptions, status: 200 };
      } else if (url.includes('/options/location')) {
        console.log('Using mock data for location options');
        return { data: mockLocationOptions, status: 200 };
      } else if (url.includes('/options/price')) {
        console.log('Using mock data for price options');
        return { data: mockPriceOptions, status: 200 };
      } else if (url.includes('/options/feature')) {
        console.log('Using mock data for feature options');
        return { data: mockFeatureOptions, status: 200 };
      } else if (url.includes('/hotels/list')) {
        // 解析请求参数
        const params = response.config.params || {};
        console.log('Using mock data for hotels with params:', params);
        return { data: mockHotelList(params), status: 200 };
      }
    }
    return response;
  },
  (error) => {
    // 如果是因为网络错误且处于开发环境，尝试返回 Mock 数据
    if (__DEV__) {
      const url = error.config?.url;
      
      // 模拟延迟
      return new Promise((resolve) => {
        setTimeout(() => {
          let mockResponse;
          if (url?.includes('/options/sort')) {
            console.log('Network error, using mock data for sort options');
            mockResponse = { data: mockSortOptions, status: 200 };
          } else if (url?.includes('/options/location')) {
            console.log('Network error, using mock data for location options');
            mockResponse = { data: mockLocationOptions, status: 200 };
          } else if (url?.includes('/options/price')) {
            console.log('Network error, using mock data for price options');
            mockResponse = { data: mockPriceOptions, status: 200 };
          } else if (url?.includes('/options/feature')) {
            console.log('Network error, using mock data for feature options');
            mockResponse = { data: mockFeatureOptions, status: 200 };
          } else if (url?.includes('/hotels/list')) {
            // 解析请求参数
            const params = error.config?.params || {};
            console.log('Network error, using mock data for hotels with params:', params);
            mockResponse = { data: mockHotelList(params), status: 200 };
          }
          if (mockResponse) {
            resolve(mockResponse);
          } else {
            Promise.reject(error);
          }
        }, 500); // 模拟网络延迟
      });
    }
    return Promise.reject(error);
  }
);

export default http;

//  拦截器会在请求失败（网络错误）时，根据 URL 返回对应的 Mock 数据。这样当后端未启动时，前端依然能正常工作。