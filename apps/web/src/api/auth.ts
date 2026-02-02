import {
    ILoginRequest,
    ILoginResponse,
    IRegisterRequest,
    IUser,
} from "@hotel_booking_platform/shared-types";
import api from ".";

export const authAPI = {
  login: (data: ILoginRequest): Promise<ILoginResponse> =>
    api.post("/auth/login", data).then((res) => res.data),

  register: (data: IRegisterRequest): Promise<IUser> =>
    api.post("/auth/register", data).then((res) => res.data),

  getCurrentUser: (): Promise<IUser> =>
    api.get("/auth/me").then((res) => res.data),

  refreshToken: (refreshToken: string): Promise<ILoginResponse> =>
    api.post("/auth/refresh", { refreshToken }).then((res) => res.data),

  logout: (): Promise<void> => api.post("/auth/logout"),
};