import { Form } from 'antd';
import { Input } from 'antd';
import { FC } from 'react';

const AddHotel: FC = () => (
  <div className="flex flex-col items-center justify-center h-screen">
    <Form>
      <Form.Item
        label="酒店名称"
        name="title"
        rules={[{ required: true, message: '请输入酒店名称' }]}
      >
        <Input placeholder="请输入酒店名称" />
      </Form.Item>
      <Form.Item></Form.Item>
      <Form.Item></Form.Item>
      <Form.Item></Form.Item>
      <Form.Item></Form.Item>
      <Form.Item></Form.Item>
    </Form>
  </div>
);

export default AddHotel;
