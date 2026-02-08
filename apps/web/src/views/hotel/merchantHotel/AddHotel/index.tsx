import { Form } from 'antd';
import { Input } from 'antd';
import { FC } from 'react';
import HotelStar from '@/components/ui/HotelStar';

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
      <Form.Item
        label="酒店地址"
        name="address"
        rules={[{ required: true, message: '请输入酒店地址' }]}
      >
        <Input placeholder="请输入酒店地址" />
      </Form.Item>
      <Form.Item
        label="酒店星级"
        name="star"
        rules={[{ required: true, message: '请选择酒店星级' }]}
      >
        <HotelStar required />
      </Form.Item>
      <Form.Item></Form.Item>
      <Form.Item></Form.Item>
      <Form.Item></Form.Item>
    </Form>
  </div>
);

export default AddHotel;
