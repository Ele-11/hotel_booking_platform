import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Space, Button, Popconfirm, Table, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { FC, useState } from 'react';
import Theme from '@/components/ui/theme';

// 定义数据类型
interface HotelData {
  id: number;
  name: string;
  address: string;
  stars: string;
  roomTypes: string;
  priceRange: string;
  openingDate: string;
}
const HotelInfo: FC = () => {
  const columns: ColumnsType<HotelData> = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: '酒店名称', dataIndex: 'name', key: 'name' },
    { title: '酒店地址', dataIndex: 'address', key: 'address' },
    { title: '酒店星级', dataIndex: 'stars', key: 'stars' },
    { title: '酒店房型', dataIndex: 'roomTypes', key: 'roomTypes' },
    { title: '价格范围', dataIndex: 'priceRange', key: 'priceRange' },
    { title: '开业时间', dataIndex: 'openingDate', key: 'openingDate' },
    {
      title: '操作',
      render: (text: string, record: HotelData) => {
        return (
          <Space size="middle">
            <Button type="primary" shape="circle" icon={<EditOutlined />} />
            <Popconfirm
              title="删除"
              description="确认是否删除该频道？"
              // onConfirm={() => { onConfirm(record)}}
              okText="Yes"
              cancelText="No"
            >
              <Button type="primary" danger shape="circle" icon={<DeleteOutlined />} />
            </Popconfirm>
          </Space>
        );
      },
    },
  ];
  const list: HotelData[] = [
    {
      id: 1,
      name: '酒店名称1',
      address: '酒店地址1',
      stars: '酒店星级1',
      roomTypes: '酒店房型1',
      priceRange: '价格范围1',
      openingDate: '开业时间1',
    },
    {
      id: 2,
      name: '酒店名称2',
      address: '酒店地址2',
      stars: '酒店星级2',
      roomTypes: '酒店房型2',
      priceRange: '价格范围2',
      openingDate: '开业时间2',
    },
  ];

  // const onConfirm = (data:any) => {
  //   message.success('删除成功')
  // }
  return (
    <div style={{ padding: '2rem', fontSize: '1.2rem', color: '#333' }}>
      {/* <h1>商家酒店管理页面</h1> */}
      <Table<HotelData>
        rowKey="id"
        columns={columns}
        dataSource={list}
        className=""
        // loading={loading}
        // pagination={{
        //   // total: count,
        //   pageSize: reqData.per_page,
        //   current: reqData.page,
        //   onChange: onPageChange,
        // }}
      />
    </div>
  );
};

export default HotelInfo;
