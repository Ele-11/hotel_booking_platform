import {
  UserAddOutlined,
  LockOutlined,
  QuestionCircleOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons';
import { Form, Card, Input, Button, Checkbox, Radio } from 'antd';
import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login: FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const handleSubmit = () => {
    if (isLogin) {
      navigate('/merchant/hotel');
    } else {
      navigate('/login');
      togglePage(true);
    }
  };
  const togglePage = (status: boolean) => {
    setIsLogin(status);
    form.resetFields(); // 重置表单
  };

  const roleOptions = [
    { label: '管理员', value: 'admin' },
    { label: '商家', value: 'user' },
  ];

  return (
    <div className="fixed inset-0 bg-gradient-to-r from-blue-600 to-purple-500 flex items-center justify-center">
      <Card className="w-[400px] p-8 shadow-lg rounded-lg bg-white">
        <h2 className="text-center text-2xl font-bold mb-8 text-gray-800">
          {isLogin ? '用户登录' : '用户注册'}
        </h2>
        <Form
          form={form}
          onFinish={handleSubmit}
          size="large"
          layout="vertical"
          initialValues={{ remember: true, role: 'admin' }}
        >
          {!isLogin && (
            <Form.Item
              name="role"
              rules={[{ required: true, message: '请选择你的用户角色' }]}
              className="mb-4"
            >
              <Radio.Group options={roleOptions} size="large" block />
            </Form.Item>
          )}
          <Form.Item
            name="username"
            validateTrigger="onBlur"
            rules={[
              { required: true },
              { min: 3, max: 20, message: '用户名长度应在3到20个字符之间' },
              { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名仅支持字母、数字和下划线' },
            ]}
            className="mb-4"
          >
            <Input
              placeholder={isLogin ? '请输入用户名' : '请设置用户名'}
              prefix={<UserAddOutlined className="text-gray-400" />}
            />
          </Form.Item>
          <Form.Item
            name="password"
            validateTrigger="onBlur"
            rules={[
              { required: true, message: '密码长度为6-20位！' },
              { min: 6, max: 20, message: '密码长度为6-20位！' },
              {
                pattern: /^[a-zA-Z0-9@#$%^&*_]+$/,
                message: '密码仅支持字母、数字、特殊符号(@#$%^&*_)！',
              },
            ]}
            className="mb-6"
          >
            <Input.Password
              placeholder={isLogin ? '请输入密码' : '请设置密码'}
              prefix={<LockOutlined className="text-gray-400" />}
            />
          </Form.Item>
          {!isLogin && (
            <Form.Item
              name="confirmPwd"
              dependencies={['password']}
              validateTrigger="onBlur"
              rules={[
                { required: true, message: '请再次输入密码' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    // 校验两次密码是否一致
                    if (!value || getFieldValue('password') === value) return Promise.resolve();
                    return Promise.reject(new Error('两次输入的密码不一致，请重新输入'));
                  },
                }),
              ]}
              className="mb-4"
            >
              <Input.Password
                placeholder="请确认密码"
                prefix={<LockOutlined className="text-gray-400" />}
              />
            </Form.Item>
          )}
          {isLogin && (
            <div className="flex items-center justify-between mb-6">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox className="text-base">记住密码</Checkbox>
              </Form.Item>
              <a href="/forgot-password" className="text-base">
                <QuestionCircleOutlined className="mr-1" />
                忘记密码
              </a>
            </div>
          )}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLogin ? '登录' : '注册'}
            </Button>
          </Form.Item>
          <div className="text-center mt-4">
            {isLogin ? (
              <a
                onClick={() => togglePage(false)}
                className="text-blue-600 text-base hover:underline cursor-pointer"
              >
                <ArrowRightOutlined className="mr-1" />
                注册
              </a>
            ) : (
              <a
                onClick={() => togglePage(true)}
                className="text-blue-600 text-base hover:underline cursor-pointer flex items-center justify-center"
              >
                <ArrowLeftOutlined className="mr-1" /> 返回登录
              </a>
            )}
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
