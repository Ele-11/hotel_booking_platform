import { Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import ReactECharts from 'echarts-for-react';
import { useMemo } from 'react';

type OrderRow = {
  key: string;
  orderNo: string;
  hotel: string;
  city: string;
  amount: number;
  status: '已支付' | '待支付' | '已取消' | '已退款';
  createdAt: string;
};

const HomeBigScreen = () => {
  const kpis = [
    { title: '今日订单', value: '128', sub: '较昨日 +12.5%' },
    { title: '今日成交额', value: '¥ 48,920', sub: '较昨日 +8.1%' },
    { title: '入住率', value: '72%', sub: '近7日均值 68%' },
    { title: '现有酒店', value: '36', sub: '本月新增 4' },
  ];

  const trendOption = useMemo(
    () => ({
      tooltip: { trigger: 'axis' },
      grid: {
        left: 48,
        right: 48,
        top: 56,
        bottom: 32,
        containLabel: true,
      },
      legend: {
        data: ['订单量', '成交额'],
        top: 8,
        right: 12,
        orient: 'horizontal',
        itemWidth: 10,
        itemHeight: 10,
        textStyle: { color: '#64748b' },
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      },
      yAxis: [
        { type: 'value', name: '单', splitLine: { lineStyle: { color: 'rgba(0,0,0,0.06)' } } },
        { type: 'value', name: '元', splitLine: { show: false } },
      ],
      series: [
        {
          name: '订单量',
          type: 'line',
          smooth: true,
          areaStyle: { opacity: 0.12 },
          data: [120, 132, 101, 134, 90, 230, 210],
        },
        {
          name: '成交额',
          type: 'line',
          smooth: true,
          yAxisIndex: 1,
          areaStyle: { opacity: 0.08 },
          data: [32000, 28000, 26000, 36000, 24000, 52000, 48920],
        },
      ],
    }),
    []
  );

  const barOption = useMemo(
    () => ({
      tooltip: { trigger: 'axis' },
      grid: { left: 40, right: 20, top: 30, bottom: 30 },
      xAxis: {
        type: 'category',
        data: ['杭州', '上海', '南京', '苏州', '宁波', '合肥'],
      },
      yAxis: { type: 'value', splitLine: { lineStyle: { color: 'rgba(0,0,0,0.06)' } } },
      series: [
        {
          name: '订单量',
          type: 'bar',
          barWidth: 18,
          data: [320, 280, 260, 210, 180, 150],
          itemStyle: { borderRadius: [6, 6, 0, 0] },
        },
      ],
    }),
    []
  );

  const pieOption = useMemo(
    () => ({
      tooltip: { trigger: 'item' },
      legend: { bottom: 0 },
      series: [
        {
          name: '订单状态',
          type: 'pie',
          radius: ['55%', '75%'],
          avoidLabelOverlap: false,
          label: { show: false },
          emphasis: { label: { show: true, fontSize: 14, fontWeight: 'bold' } },
          labelLine: { show: false },
          data: [
            { value: 612, name: '已支付' },
            { value: 92, name: '待支付' },
            { value: 46, name: '已取消' },
            { value: 18, name: '已退款' },
          ],
        },
      ],
    }),
    []
  );

  const tableData: OrderRow[] = [
    {
      key: '1',
      orderNo: 'HT202602240001',
      hotel: '西湖智选假日酒店',
      city: '杭州',
      amount: 699,
      status: '已支付',
      createdAt: '2026-02-24 10:12',
    },
    {
      key: '2',
      orderNo: 'HT202602240002',
      hotel: '外滩商务酒店',
      city: '上海',
      amount: 899,
      status: '待支付',
      createdAt: '2026-02-24 10:35',
    },
    {
      key: '3',
      orderNo: 'HT202602240003',
      hotel: '玄武湖度假酒店',
      city: '南京',
      amount: 1299,
      status: '已取消',
      createdAt: '2026-02-24 11:02',
    },
    {
      key: '4',
      orderNo: 'HT202602240004',
      hotel: '金鸡湖假日酒店',
      city: '苏州',
      amount: 999,
      status: '已支付',
      createdAt: '2026-02-24 11:30',
    },
  ];

  const columns: ColumnsType<OrderRow> = [
    { title: '订单号', dataIndex: 'orderNo', key: 'orderNo', width: 180 },
    { title: '酒店', dataIndex: 'hotel', key: 'hotel' },
    { title: '城市', dataIndex: 'city', key: 'city', width: 90 },
    {
      title: '金额(元)',
      dataIndex: 'amount',
      key: 'amount',
      width: 110,
      render: (v) => <span className="font-medium">{v}</span>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 110,
      render: (s) => {
        const color =
          s === '已支付' ? 'green' : s === '待支付' ? 'gold' : s === '已退款' ? 'cyan' : 'red';
        return <Tag color={color}>{s}</Tag>;
      },
    },
    { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt', width: 160 },
  ];

  return (
    <div className="bg-body px-6 py-6">
      <div className="max-w-[1400px]">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="text-[22px] font-semibold text-heading-2">数据总览</div>
            {/* <div className="mt-1 text-sm text-heading-3">实时掌握经营概况。</div> */}
          </div>
          <div className="text-xs text-heading-3">更新时间：2026-02-24</div>
        </div>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {kpis.map((k) => (
            <div key={k.title} className="card">
              <div className="text-sm text-heading-3">{k.title}</div>
              <div className="mt-2 text-2xl font-semibold text-heading-2">{k.value}</div>
              <div className="mt-2 text-xs text-heading-3">{k.sub}</div>
            </div>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="xl:col-span-2 card">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[15px] font-semibold text-heading-2">近7日趋势</div>
                <div className="mt-1 text-xs text-heading-3">订单量与成交额走势</div>
              </div>
            </div>
            <div className="mt-3">
              <ReactECharts option={trendOption} style={{ height: 320 }} />
            </div>
          </div>

          <div className="card">
            <div>
              <div className="text-[15px] font-semibold text-heading-2">订单状态占比</div>
              <div className="mt-1 text-xs text-heading-3">支付/取消/退款分布</div>
            </div>
            <div className="mt-3">
              <ReactECharts option={pieOption} style={{ height: 320 }} />
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="card xl:col-span-1">
            <div>
              <div className="text-[15px] font-semibold text-heading-2">城市订单 Top</div>
              <div className="mt-1 text-xs text-heading-3">近7日各城市订单量</div>
            </div>
            <div className="mt-3">
              <ReactECharts option={barOption} style={{ height: 300 }} />
            </div>
          </div>

          <div className="card xl:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[15px] font-semibold text-heading-2">最新订单</div>
                <div className="mt-1 text-xs text-heading-3">用于快速查看异常/高价值订单</div>
              </div>
            </div>

            <div className="mt-3">
              <Table
                columns={columns}
                dataSource={tableData}
                pagination={false}
                size="middle"
                scroll={{ x: 900 }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeBigScreen;
