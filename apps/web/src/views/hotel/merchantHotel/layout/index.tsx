// @ts-nocheck
import { Layout, Menu, Popconfirm } from 'antd';
import { FC, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { HomeIcon, MenuIcon, LogoutIcon } from '@/components/ui/icon';
import { Theme } from '@/components/ui/theme';

const { Header, Sider, Content } = Layout;

const LayoutHotel: FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const selectedKeys = [location.pathname];
  const navigate = useNavigate();

  const items = [
    {
      label: '首页',
      key: '/',
      icon: <HomeIcon style={{ color: selectedKeys[0] === '/merchant' ? '#3b82f6' : 'inherit' }} />,
    },
    { label: '信息管理', key: '/merchant/list', icon: <MenuIcon /> },
  ];
  const onMenuClick = (key) => {
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

        <Popconfirm
          title="是否确认退出？"
          okText="退出"
          cancelText="取消"
          // onConfirm={onConfirm}
        >
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
          className="!bg-box-bg !border-r border-box-border transition-all duration-300"
          width={200}
          style={{ minHeight: 'calc(100vh - 64px)' }}
        >
          <Menu
            mode="inline"
            selectedKeys={selectedKeys}
            items={items}
            onClick={onMenuClick}
            className="h-full border-0 bg-transparent text-heading-2"
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

export default LayoutHotel;
