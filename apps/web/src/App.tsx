// @ts-nocheck
import { Routes, Route } from 'react-router-dom';
import HotelInfo from './views/hotel/merchantHotel/hotelInfo';
import LayoutHotel from './views/hotel/merchantHotel/layout';
import Login from './views/login';

const App: FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/merchant" element={<LayoutHotel />}>
        <Route path="list" element={<HotelInfo />} />
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
  );
};

export default App;
