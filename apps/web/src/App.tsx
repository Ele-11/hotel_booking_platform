import { ConfigProvider, theme } from 'antd';
import { FC } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAppSelector } from './store/hooks';
import AddHotel from './views/hotel/merchantHotel/AddHotel';
import HotelInfo from './views/hotel/merchantHotel/HotelInfo';
import LayoutHotel from './views/hotel/merchantHotel/layout';
import Login from './views/login';
const App: FC = () => {
  const currentTheme = useAppSelector((state) => state.theme.theme);
  return (
    <ConfigProvider
      theme={{
        algorithm: currentTheme === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/merchant" element={<LayoutHotel />}>
          <Route path="list" element={<HotelInfo />} />
          <Route path="add" element={<AddHotel />} />
        </Route>
        <Route
          path="*"
          element={
            <div>
              页面不存在，<a href="/login">返回登录</a>
            </div>
          }
        />
      </Routes>
    </ConfigProvider>
  );
};

export default App;
