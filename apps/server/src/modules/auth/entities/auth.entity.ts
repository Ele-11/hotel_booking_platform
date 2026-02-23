// 主要功能：认证实体定义
// 定义了用户认证成功后返回的数据格式，用于登录、注册等认证接口的响应体

export class AuthEntity {
  id: string;
  email: string;
  username: string;
  fullName: string;
  role: string;
  accessToken: string;
  refreshToken: string;
}