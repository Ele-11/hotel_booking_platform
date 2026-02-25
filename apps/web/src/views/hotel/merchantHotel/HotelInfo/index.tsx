import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Space, Button, Popconfirm, Table, message, Alert } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import Theme from '@/components/ui/theme';
import HotelStar from '@/components/ui/HotelStar';
import { AppDispatch, RootState } from '@/store';
import { fetchHotelList } from '@/store/slices/hotelSlice';

interface PricePlan {
  id: string;
  price: number;
  isActive: boolean;
}

interface RoomType {
  id: string;
  name: string;
  pricePlans: PricePlan[];
}
// 定义数据类型
interface HotelData {
  id: string;
  hotelNo?: number | null;
  name: string;
  englishName: string;
  address: string;
  starRating: number;
  city: string;
  country: string;
  status: string;
  roomTypes: RoomType[];
  // priceRange: string;
  // openingDate: string;
}
const HotelInfo: FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const {
    list: hotelList,
    meta = { limit: 10, page: 1, total: 0 },
    loading,
    error,
  } = useSelector((state: RootState) => state.hotels);

  useEffect(() => {
    dispatch(fetchHotelList({ page: 1, limit: 10 }));
  }, [dispatch]);
  const handlePageChange = (page: number, pageSize: number) => {
    dispatch(fetchHotelList({ page, limit: pageSize }));
  };
  const columns: ColumnsType<HotelData> = [
    {
      title: '编号',
      dataIndex: 'hotelNo',
      key: 'hotelNo',
      width: 80,
      render: (v) => (v == null ? '-' : v),
    },
    {
      title: '酒店名称',
      key: 'name',
      render: (_, record) => (
        <div>
          <div className="font-bold">{record.name}</div>
          <div className="text-xs text-gray-500">{record.englishName}</div>
        </div>
      ),
    },
    {
      title: '酒店地址',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '酒店星级',
      dataIndex: 'starRating',
      key: 'starRating',
      width: 200,
      render: (stars) => <HotelStar value={Number(stars)} disabled />,
    },
    {
      title: '酒店房型',
      key: 'roomTypes',
      width: 100,
      render: (_, record) => (
        <div className="space-y-1">
          {record.roomTypes.map((room) => {
            const hotelName = record.name ?? '';
            const rawName = room.name ?? '';

            let displayName = rawName;
            if (hotelName && displayName.startsWith(hotelName)) {
              displayName = displayName.slice(hotelName.length);
              displayName = displayName.replace(/^[-–—\s·：:]+/, '');
            }
            if (!displayName) displayName = rawName;

            return (
              <div key={room.id} className="text-xs">
                {displayName}
              </div>
            );
          })}
        </div>
      ),
    },
    {
      title: '价格范围',
      key: 'priceRange',
      width: 150,
      render: (_, record) => {
        const prices = record.roomTypes
          .flatMap((r) => r.pricePlans ?? [])
          .map((p) => Number(p.price))
          .filter(Number.isFinite);

        if (prices.length === 0) return <span className="text-gray-400">暂无价格</span>;
        const min = Math.min(...prices);
        const max = Math.max(...prices);
        return (
          <span className="font-semibold text-blue-600">
            {min === max ? `¥${min}` : `¥${min} - ¥${max}`}
          </span>
        );
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            shape="circle"
            icon={<EditOutlined />}
            onClick={() => message.info(`点击了编辑: ${record.name}`)}
          />
          <Popconfirm
            title="删除确认"
            description={`确定要删除酒店"${record.name}"吗？`}
            onConfirm={() => message.success('删除成功')}
            okText="是"
            cancelText="否"
          >
            <Button type="primary" danger shape="circle" icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (error) {
    return (
      <div className="p-8">
        <Alert message="加载失败" description={error} type="error" showIcon />
      </div>
    );
  }
  // const list: HotelData[] = [
  //   {
  //     id: 1,
  //     name: '酒店名称1',
  //     address: '酒店地址1',
  //     stars: '酒店星级1',
  //     roomTypes: '酒店房型1',
  //     priceRange: '价格范围1',
  //     openingDate: '开业时间1',
  //   },
  //   {
  //     id: 2,
  //     name: '酒店名称2',
  //     address: '酒店地址2',
  //     stars: '酒店星级2',
  //     roomTypes: '酒店房型2',
  //     priceRange: '价格范围2',
  //     openingDate: '开业时间2',
  //   },
  // ];

  // const onConfirm = (data:any) => {
  //   message.success('删除成功')
  // }
  return (
    <div className="p-8 text-base text-gray-800">
      <Table<HotelData>
        rowKey="id"
        columns={columns}
        dataSource={hotelList}
        loading={loading}
        className="shadow-sm"
        pagination={{
          pageSize: meta.limit,
          current: meta.page,
          total: meta.total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条记录`,
          onChange: handlePageChange,
        }}
      />
    </div>
  );
};

export default HotelInfo;
