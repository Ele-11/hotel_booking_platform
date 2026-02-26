import { Layout, Menu, Popconfirm, message } from 'antd';
import { FC, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { MenuIcon, LogoutIcon, HomeIcon } from '@/components/ui/icon';
import { Theme } from '@/components/ui/theme';

const { Header, Sider, Content } = Layout;

const LayoutHotelA: FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const selectedKeys = [location.pathname];
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    message.success('已安全退出');
    navigate('/login');
  };

  const items = [
    { label: '审核列表', key: '/admin/audit', icon: <HomeIcon /> },
    { label: '酒店管理', key: '/admin/list', icon: <MenuIcon /> },
  ];
  const onMenuClick = (key: string) => {
    console.log('菜单被点击了', key);
    navigate(key);
  };

  return (
    <Layout className="h-screen bg-body text-heading-2">
      <Header className="bg-box-bg border-b border-box-border shadow-box-sd px-6 py-0 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl font-semibold text-heading-1">易宿酒店管理后台</span>
          <Theme />
        </div>

        <Popconfirm title="是否确认退出？" okText="退出" cancelText="取消" onConfirm={handleLogout}>
          <span className="flex items-center gap-1 text-heading-2 cursor-pointer hover:text-red-500 dark:hover:text-red-400 transition-colors">
            <LogoutIcon /> 退出
          </span>
        </Popconfirm>
      </Header>
      <Layout>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          collapsedWidth={64}
          className="!bg-box-bg !border-r border-box-border transition-all duration-300"
          width={200}
          style={{ minHeight: 'calc(100vh - 64px)' }}
        >
          <Menu
            mode="inline"
            selectedKeys={selectedKeys}
            items={items}
            onClick={({ key }) => onMenuClick(key)}
            inlineCollapsed={collapsed}
            className="h-full border-0 bg-transparent text-heading-2  [&_.ant-menu-item-selected]:!bg-primary/10"
          ></Menu>
        </Sider>

        <Content className="bg-body p-6">
          <div className="bg-box-bg rounded-lg shadow-box-sd p-6 min-h-[calc(100vh-180px)]">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default LayoutHotelA;
