// @ts-nocheck
import { Route, Routes } from 'react-router-dom';
import MHotel from './views/hotel/merchantHotel';
import Login from './views/login';

const App: FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/merchant/hotel" element={<MHotel />} />
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
