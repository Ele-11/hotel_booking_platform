import Geolocation from '@react-native-community/geolocation';
import { Alert } from 'react-native';

// 高德逆地理编码返回的地址结构类型
interface AMapAddressComponent {
  province: string; // 省份
  city: string; // 城市（直辖市会为空，需用district补充）
  district: string; // 区县
  street?: string; // 街道
  township?: string; // 乡镇
}

interface AMapRegeoResponse {
  status: string; // 1=成功，0=失败
  info: string; // 错误信息
  regeocode?: {
    addressComponent: AMapAddressComponent;
  };
}

// 定位结果类型
export interface LocationResult {
  success: boolean;
  province?: string;
  city?: string;
  latitude?: number; // 纬度
  longitude?: number; // 经度
  errorMsg?: string; // 错误信息
}

/**
 * 获取当前定位信息（含高德逆地理编码解析省份/城市）
 * @param amapKey 高德Web端API Key
 * @param debugCoords 调试模式下的默认坐标 [longitude, latitude]
 * @returns 定位结果（包含省份、城市、经纬度）
 */
export const getCurrentLocation = async (
  amapKey: string,
  debugCoords?: [number, number]
): Promise<LocationResult> => {

  //  获取设备经纬度
  const position = await new Promise<{ latitude: number; longitude: number }>(
    (resolve, reject) => {
      Geolocation.getCurrentPosition(
        (pos) => {
          resolve({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
        },
        (error) => {
          const errorMap = {
            1: '权限被拒绝',
            2: '位置获取失败',
            3: '请求超时',
          };
          reject(new Error('定位失败'));
        },
        {
          timeout: 3000,
          enableHighAccuracy: true,
          maximumAge: 3000,
        }
      );
    }
  );

  let { longitude, latitude } = position;

  // 3. 调试模式下替换坐标
  if (__DEV__ && debugCoords) {
    [longitude, latitude] = debugCoords;
  }

  // 4. 高德逆地理编码解析省份/城市
  try {
    const url = `https://restapi.amap.com/v3/geocode/regeo?location=${longitude},${latitude}&key=${amapKey}&extensions=all`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`网络请求失败：${response.status}`);
    }

    const res: AMapRegeoResponse = await response.json();

    if (res.status !== '1' || !res.regeocode?.addressComponent) {
      return {
        success: false,
        latitude,
        longitude,
        errorMsg: res.info || '无法解析位置信息',
      };
    }

    const comp = res.regeocode.addressComponent;
    // 兼容直辖市（city为空时用district补充）
    const targetProvince = comp.province || '';
    const targetCity = comp.city || comp.district || '';

    return {
      success: true,
      province: targetProvince,
      city: targetCity,
      latitude,
      longitude,
    };
  } catch (e) {
    const errorMsg = e instanceof Error ? e.message : '网络异常或位置解析失败';
    return {
      success: false,
      latitude,
      longitude,
      errorMsg,
    };
  }
};

/**
 * 简化版定位函数（仅返回省份+城市，带弹窗提示）
 * @param amapKey 高德API Key
 * @returns [province, city] | null
 */
export const getCurrentCitySimplified = async (
  amapKey: string
): Promise<[string, string] | null> => {
  const result = await getCurrentLocation(amapKey, [115.85, 28.68]); // 南昌调试坐标

  if (!result.success) {
    Alert.alert('定位失败', result.errorMsg || '无法获取当前位置');
    return null;
  }

  if (!result.province || !result.city) {
    Alert.alert('定位提示', '未解析到具体城市，已使用默认值');
    return ['江西省', '南昌市'];
  }

  return [result.province, result.city];
};