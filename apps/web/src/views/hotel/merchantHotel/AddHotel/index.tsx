import { PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Radio,
  Row,
  Space,
  Upload,
} from 'antd';
import type { CheckboxOptionType, InputNumberProps, UploadFile, UploadProps } from 'antd';
import dayjs from 'dayjs';
import { FC, useMemo, useState, useEffect } from 'react';
import AddressPicker from '@/components/ui/AddressPicker';
import FormFooterBar from '@/components/ui/FormFooterBar';
import HotelStar from '@/components/ui/HotelStar';
import SectionTitle from '@/components/ui/SectionTitle';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { createHotel, resetCreateHotelState } from '@/store/slices/hotelCreateSlice';
import { fetchHotelList } from '@/store/slices/hotelSlice';
type AddressValue = import('@/components/ui/AddressPicker').AddressValue;

// 调整表单数据类型，适配接口参数
interface HotelFormData {
  name: string; // 酒店名称（中文）
  englishName?: string; // 酒店名称（英文）
  address: AddressValue; // 地址选择器值
  starRating: number; // 星级
  type: number; // 封面类型（无图/单图/三图）
  roomTypes: string[]; // 房型
  minPrice: number; // 最低价格
  maxPrice: number; // 最高价格
  openingDate: string; // 开业时间
  contactPhone: string; // 联系电话
  contactEmail: string; // 联系邮箱
  description?: string; // 酒店描述
  amenities?: string[]; // 设施
  discountInfo?: string; // 优惠信息
  nearbyTransports?: string[]; // 附近交通
  nearbyShopping?: string; // 附近购物
  status?: 'PENDING' | 'PUBLISHED' | 'DRAFT' | 'DISABLED'; // 酒店状态
}

// 上传响应类型
interface UploadResponse {
  data: { url: string };
}

const AddHotel: FC = () => {
  const [form] = Form.useForm<HotelFormData>();
  const coverType = Form.useWatch('type', form) ?? 0;
  const [imageList, setImageList] = useState<UploadFile<UploadResponse>[]>([]);

  // 接入Redux状态
  const dispatch = useAppDispatch();
  const { loading, error, success, createdHotel } = useAppSelector((state) => state.hotelCreate);

  // 价格输入框配置
  const priceInputProps: InputNumberProps<number> = {
    min: 0,
    max: 9999,
    precision: 0,
    formatter: (value) => `${value ?? ''}`,
    parser: (value) => {
      if (!value) return 0;
      const numStr = value.replace(/\D/g, '');
      return Math.min(Math.max(Number(numStr) || 0, 0), 9999);
    },
  };

  // 房型选项
  const roomTypeOptions: CheckboxOptionType<string>[] = useMemo(
    () => [
      { label: '单人间', value: '单人间' },
      { label: '双人间', value: '双人间' },
      { label: '大床房', value: '大床房' },
      { label: '套房', value: '套房' },
    ],
    []
  );

  // 设施选项（新增）
  const amenityOptions: CheckboxOptionType<string>[] = useMemo(
    () => [
      { label: '免费WiFi', value: '免费WiFi' },
      { label: '停车场', value: '停车场' },
      { label: '游泳池', value: '游泳池' },
      { label: '健身房', value: '健身房' },
      { label: '早餐', value: '早餐' },
    ],
    []
  );

  // 自定义上传逻辑（实际项目中替换为真实上传接口）
  const customRequest: UploadProps<UploadResponse>['customRequest'] = ({ file, onSuccess }) => {
    setTimeout(() => {
      const url = URL.createObjectURL(file as Blob);
      onSuccess?.({ data: { url } }, file);
    }, 300);
  };

  // 封面类型变化时清理图片
  const handleValuesChange = (changed: Partial<HotelFormData>) => {
    if (typeof changed.type === 'number') {
      const newType = changed.type;
      if (newType === 0) setImageList([]);
      if (newType > 0 && imageList.length > newType) setImageList(imageList.slice(0, newType));
    }
  };

  // 表单提交逻辑（适配接口参数）
  const handleFormSubmit = async (values: HotelFormData) => {
    console.log('Form values:', values);
    // 1. 验证图片上传
    const doneFiles = imageList.filter((f) => f.status === 'done');
    if (values.type > 0 && doneFiles.length !== values.type) {
      message.warning(`请上传 ${values.type} 张封面图后再提交`);
      return;
    }

    // 2. 组装接口请求参数
    const submitData = {
      name: values.name,
      englishName: values.englishName || '',
      address: `${values.address.regionNames?.join('/') || ''}${values.address.detail || ''}`, // 拼接完整地址
      starRating: values.starRating,
      openingDate: dayjs(values.openingDate).toISOString(),
      contactPhone: values.contactPhone,
      contactEmail: values.contactEmail,
      description: values.description || '',
      city: values.address.regionNames?.[1] || '', // 从地址中提取城市
      country: '中国',
      amenities: values.amenities || [],
      discountInfo: values.discountInfo || '',
      images: doneFiles.map((f) => f.response?.data?.url || f.url || '').filter(Boolean),
      nearbyTransports: [],
      nearbyShopping: '',
      status: values.status || 'PENDING',
    };
    console.log('Submit data:', submitData);

    try {
      // 3. 调用Redux创建酒店action
      await dispatch(createHotel(submitData)).unwrap();
      message.success('酒店创建成功！');
      // 4. 提交成功后重置表单
      form.resetFields();
      setImageList([]);
      fetchHotelList();
    } catch (err) {
      // 错误已由Redux处理，这里仅做兜底提示
      message.error('酒店创建失败，请稍后重试');
    }
  };

  // 预览图片URL
  const previewUrls = imageList
    .filter((f) => f.status === 'done')
    .map((f) => f.response?.data?.url || f.thumbUrl || f.url || '')
    .filter(Boolean);

  // 监听Redux状态，处理反馈和重置
  useEffect(() => {
    // 显示错误提示
    if (error) {
      message.error(error);
    }

    // 组件卸载时重置Redux状态
    return () => {
      dispatch(resetCreateHotelState());
    };
  }, [error, dispatch]);

  return (
    <div className="bg-body px-6 py-6">
      <div className="max-w-[1100px]">
        <Form<HotelFormData>
          form={form}
          layout="vertical"
          onFinish={handleFormSubmit}
          onValuesChange={handleValuesChange}
          initialValues={{
            type: 0,
            roomTypes: ['单人间'],
            minPrice: 0,
            maxPrice: 9999,
            address: {},
            starRating: 1,
          }}
        >
          <div className="space-y-6">
            <SectionTitle title="基础信息" desc="用于列表与详情页展示。">
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="酒店名称（中文）"
                    name="name"
                    rules={[{ required: true, message: '请输入酒店中文名称' }]}
                  >
                    <Input className="input" placeholder="例如：杭州西湖智选假日酒店" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="酒店名称（英文）" name="englishName">
                    <Input
                      className="input"
                      placeholder="例如：Holiday Inn Express Hangzhou West Lake"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    label="开业时间"
                    name="openingDate"
                    rules={[{ required: true, message: '请选择开业时间' }]}
                    getValueProps={(v) => ({ value: v ? dayjs(v) : null })}
                    getValueFromEvent={(d) => (d ? dayjs(d).format('YYYY-MM-DD') : '')}
                  >
                    <DatePicker className="w-full" placeholder="请选择日期" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="酒店星级"
                    name="starRating"
                    rules={[{ required: true, message: '请选择酒店星级' }]}
                  >
                    <HotelStar required />
                  </Form.Item>
                </Col>

                <Col xs={24}>
                  <Form.Item
                    label="酒店地址"
                    name="address"
                    rules={[
                      {
                        validator: (_, v) => {
                          const ok =
                            v?.regionCodes?.length === 3 &&
                            v?.regionNames?.length === 3 &&
                            (v?.detail?.trim()?.length ?? 0) >= 2;
                          return ok
                            ? Promise.resolve()
                            : Promise.reject(new Error('请选择省/市/区并填写详细地址'));
                        },
                      },
                    ]}
                  >
                    <AddressPicker />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    label="联系电话"
                    name="contactPhone"
                    rules={[{ required: true, message: '请输入联系电话' }]}
                  >
                    <Input placeholder="例如：13800138000" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="联系邮箱"
                    name="contactEmail"
                    rules={[
                      { required: true, message: '请输入联系邮箱' },
                      { type: 'email', message: '请输入有效的邮箱地址' },
                    ]}
                  >
                    <Input placeholder="例如：hotel@example.com" />
                  </Form.Item>
                </Col>

                <Col xs={24}>
                  <Form.Item label="酒店描述" name="description">
                    <Input.TextArea rows={4} placeholder="请输入酒店的详细描述（选填）" />
                  </Form.Item>
                </Col>
              </Row>
            </SectionTitle>

            {/* 封面设置区域（无改动） */}
            <SectionTitle title="封面设置" desc="固定样式：无图 / 单图 / 三图。">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Form.Item label="封面类型" name="type" rules={[{ required: true }]}>
                    <Radio.Group>
                      <Radio value={0}>无图</Radio>
                      <Radio value={1}>单图</Radio>
                      <Radio value={3}>三图</Radio>
                    </Radio.Group>
                  </Form.Item>

                  {coverType === 0 ? (
                    <div className="rounded-lg border border-dashed border-box-border bg-gray-50 p-3 text-xs text-heading-3">
                      当前无图：前台将使用默认占位图
                    </div>
                  ) : (
                    <Form.Item label={`上传封面（${coverType} 张）`} required>
                      <Upload<UploadResponse>
                        listType="picture-card"
                        showUploadList
                        customRequest={customRequest}
                        name="image"
                        onChange={({ fileList }) => setImageList(fileList)}
                        maxCount={coverType}
                        fileList={imageList}
                      >
                        {imageList.length >= coverType ? null : (
                          <div className="flex flex-col items-center justify-center">
                            <PlusOutlined className="text-lg" />
                            <div className="mt-1 text-sm">上传</div>
                          </div>
                        )}
                      </Upload>
                    </Form.Item>
                  )}
                </div>
                <div className="rounded-lg border border-box-border bg-gray-50 p-4">
                  <div className="text-sm font-medium text-heading-2">预览</div>
                  <div className="mt-3">
                    {coverType === 0 ? (
                      <div className="aspect-[16/9] rounded-lg border border-dashed border-box-border bg-white flex items-center justify-center text-xs text-heading-3">
                        无图占位
                      </div>
                    ) : coverType === 1 ? (
                      <div className="aspect-[16/9] rounded-lg border border-box-border bg-white overflow-hidden flex items-center justify-center">
                        {previewUrls[0] ? (
                          <img
                            src={previewUrls[0]}
                            alt="cover"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-xs text-heading-3">等待上传</span>
                        )}
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 gap-2">
                        {Array.from({ length: 3 }).map((_, idx) => (
                          <div
                            key={idx}
                            className="aspect-square rounded-lg border border-box-border bg-white overflow-hidden flex items-center justify-center"
                          >
                            {previewUrls[idx] ? (
                              <img
                                src={previewUrls[idx]}
                                alt="cover"
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <span className="text-xs text-heading-3">等待</span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </SectionTitle>

            {/* 房型与价格区域（新增设施、优惠信息） */}
            <SectionTitle title="房型与价格" desc="用于筛选与价格展示。">
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="房型"
                    name="roomTypes"
                    rules={[{ required: true, type: 'array', min: 1, message: '至少选择一个房型' }]}
                  >
                    <Checkbox.Group options={roomTypeOptions} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="酒店设施" name="amenities">
                    <Checkbox.Group options={amenityOptions} />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item label="价格区间" required>
                    <Space.Compact className="w-full">
                      <Form.Item name="minPrice" rules={[{ required: true }]} noStyle>
                        <InputNumber<number>
                          {...priceInputProps}
                          className="w-1/2"
                          placeholder="最低价"
                        />
                      </Form.Item>
                      <div className="px-3 flex items-center text-heading-3">-</div>
                      <Form.Item name="maxPrice" rules={[{ required: true }]} noStyle>
                        <InputNumber<number>
                          {...priceInputProps}
                          className="w-1/2"
                          placeholder="最高价"
                        />
                      </Form.Item>
                    </Space.Compact>
                    <div className="mt-2 text-xs text-heading-3">单位：元</div>
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="优惠信息" name="discountInfo">
                    <Input placeholder="例如：住3晚送1晚，节假日通用（选填）" />
                  </Form.Item>
                </Col>
              </Row>
            </SectionTitle>
          </div>

          {/* 提交按钮区域（添加加载状态） */}
          <FormFooterBar>
            <Button
              onClick={() => {
                form.resetFields();
                setImageList([]);
                dispatch(resetCreateHotelState()); // 重置Redux状态
              }}
            >
              重置
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading} // 绑定加载状态
            >
              提交保存
            </Button>
          </FormFooterBar>
        </Form>
      </div>
    </div>
  );
};

export default AddHotel;
