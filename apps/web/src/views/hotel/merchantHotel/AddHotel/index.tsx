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
import { FC, useMemo, useState } from 'react';
import FormFooterBar from '@/components/ui/FormFooterBar';
import HotelStar from '@/components/ui/HotelStar';
import SectionTitle from '@/components/ui/SectionTitle';

interface HotelFormData {
  title: string;
  address: string;
  star: number;
  type: number;
  roomTypes: string[];
  minPrice: number;
  maxPrice: number;
  openingDate: string;
}
interface SubmitHotelData extends HotelFormData {
  images: string[];
}
interface UploadResponse {
  data: { url: string };
}

const AddHotel: FC = () => {
  const [form] = Form.useForm<HotelFormData>();
  const coverType = Form.useWatch('type', form) ?? 0;

  const [imageList, setImageList] = useState<UploadFile<UploadResponse>[]>([]);

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

  const roomTypeOptions: CheckboxOptionType<string>[] = useMemo(
    () => [
      { label: '单人间', value: '单人间' },
      { label: '双人间', value: '双人间' },
      { label: '大床房', value: '大床房' },
      { label: '套房', value: '套房' },
    ],
    []
  );

  const customRequest: UploadProps<UploadResponse>['customRequest'] = ({ file, onSuccess }) => {
    setTimeout(() => {
      const url = URL.createObjectURL(file as Blob);
      onSuccess?.({ data: { url } }, file);
    }, 300);
  };

  const handleValuesChange = (changed: Partial<HotelFormData>) => {
    if (typeof changed.type === 'number') {
      const newType = changed.type;
      if (newType === 0) setImageList([]);
      if (newType > 0 && imageList.length > newType) setImageList(imageList.slice(0, newType));
    }
  };

  const handleFormSubmit = (values: HotelFormData) => {
    const doneFiles = imageList.filter((f) => f.status === 'done');
    if (values.type > 0 && doneFiles.length !== values.type) {
      message.warning(`请上传 ${values.type} 张封面图后再提交`);
      return;
    }
    const submitData: SubmitHotelData = {
      ...values,
      images: doneFiles.map((f) => f.response?.data?.url || f.url || '').filter(Boolean),
    };
    console.log('提交：', submitData);
    message.success('提交成功（示例：已打印数据）');
  };

  const previewUrls = imageList
    .filter((f) => f.status === 'done')
    .map((f) => f.response?.data?.url || f.thumbUrl || f.url || '')
    .filter(Boolean);

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
          }}
        >
          <div className="space-y-6">
            <SectionTitle title="基础信息" desc="用于列表与详情页展示。">
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="酒店名称"
                    name="title"
                    rules={[{ required: true, message: '请输入酒店名称' }]}
                  >
                    <Input className="input" placeholder="例如：杭州西湖智选假日酒店" />
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

                <Col xs={24}>
                  <Form.Item
                    label="酒店地址"
                    name="address"
                    rules={[{ required: true, message: '请输入酒店地址' }]}
                  >
                    <Input className="input" placeholder="例如：浙江省杭州市西湖区××路××号" />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    label="酒店星级"
                    name="star"
                    rules={[{ required: true, message: '请选择酒店星级' }]}
                  >
                    <HotelStar required />
                  </Form.Item>
                </Col>
              </Row>
            </SectionTitle>

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
                  {/* <div className="mt-2 text-xs text-heading-3">前台样式预览（示意）。</div> */}

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
              </Row>
            </SectionTitle>
          </div>

          <FormFooterBar>
            <Button
              onClick={() => {
                form.resetFields();
                setImageList([]);
              }}
            >
              重置
            </Button>
            <Button type="primary" htmlType="submit">
              提交保存
            </Button>
          </FormFooterBar>
        </Form>
      </div>
    </div>
  );
};

export default AddHotel;
