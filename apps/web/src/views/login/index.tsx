import {
  UserAddOutlined,
  LockOutlined,
  QuestionCircleOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  MailOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Form, Card, Input, Button, Checkbox, Radio, message } from 'antd';
import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register } from '@/api/auth';

const Login: FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      if (isLogin) {
        const res = await login({
          email: values.email,
          password: values.password,
        });
        localStorage.setItem('access_token', res.access_token);
        localStorage.setItem('userInfo', JSON.stringify(res.user));

        if (res.user.role === 'ADMIN') {
          message.success('管理员登录成功');
          navigate('/admin');
        } else if (res.user.role === 'MERCHANT') {
          message.success('商家登录成功');
          navigate('/merchant');
        }
      } else {
        await register({
          email: values.email,
          username: values.username,
          fullName: values.fullName,
          password: values.password,
          role: values.role,
        });
        message.success('注册成功，请登录');
        togglePage(true);
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || '操作失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const togglePage = (status: boolean) => {
    setIsLogin(status);
    form.resetFields();
  };

  const roleOptions = [
    { label: '管理员', value: 'ADMIN' },
    { label: '商家', value: 'MERCHANT' },
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
          initialValues={{
            remember: true,
            ...(isLogin ? {} : { role: 'ADMIN' }),
          }}
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
            name="email"
            validateTrigger="onBlur"
            rules={[
              { required: true, message: '请输入邮箱地址' },
              { type: 'email', message: '请输入有效的邮箱地址' },
            ]}
            className="mb-4"
          >
            <Input
              placeholder={isLogin ? '请输入登录邮箱' : '请输入注册邮箱'}
              prefix={<MailOutlined className="text-gray-400" />}
            />
          </Form.Item>

          {!isLogin && (
            <Form.Item
              name="username"
              rules={[{ required: true, message: '请设置用户名' }]}
              className="mb-4"
            >
              <Input
                placeholder="请设置用户名"
                prefix={<UserOutlined className="text-gray-400" />}
              />
            </Form.Item>
          )}

          {!isLogin && (
            <Form.Item
              name="fullName"
              rules={[{ required: true, message: '请输入真实姓名' }]}
              className="mb-4"
            >
              <Input
                placeholder="请输入真实姓名"
                prefix={<UserAddOutlined className="text-gray-400" />}
              />
            </Form.Item>
          )}

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
              placeholder={isLogin ? '请输入登录密码' : '请设置密码'}
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
              loading={loading}
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
