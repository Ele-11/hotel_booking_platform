import { PlusOutlined } from '@ant-design/icons';
import {
  Form,
  Radio,
  Upload,
  Input,
  RadioChangeEvent,
  DatePicker,
  Space,
  Checkbox,
  InputNumber,
} from 'antd';
import type {
  UploadFile,
  UploadProps,
  DatePickerProps,
  InputNumberProps,
  CheckboxOptionType,
  GetProp,
} from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import { FC, useState } from 'react';
import HotelStar from '@/components/ui/HotelStar';

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
  data: {
    url: string;
  };
}
const AddHotel: FC = () => {
  const [type, setType] = useState<number>(0);
  const [imageList, setImageList] = useState<UploadFile<UploadResponse>[]>([]);

  const priceInputProps: InputNumberProps<number> = {
    min: 0,
    max: 9999,
    precision: 0,
    formatter: (value) => `${value}`,
    parser: (value) => {
      if (!value) return 0;
      const numStr = value.replace(/\D/g, '');
      return Math.min(Math.max(Number(numStr) || 0, 0), 9999);
    },
  };

  const options: CheckboxOptionType<string>[] = [
    { label: '单人间', value: '单人间', className: 'label-1' },
    { label: '双人间', value: '双人间', className: 'label-2' },
    { label: '大床房', value: '大床房', className: 'label-3' },
    { label: '套房', value: '套房', className: 'label-4' },
  ];
  const handleUploadChange: UploadProps<UploadResponse>['onChange'] = ({ fileList }) => {
    const validFileList = fileList.filter((file) => file.status === 'done');
    setImageList(validFileList);
  };
  const handleTypeChange = (e: RadioChangeEvent) => {
    const newValue = e.target.value;
    setType(newValue);

    if (newValue === 0) {
      setImageList([]);
    } else if (imageList.length > newValue) {
      setImageList(imageList.slice(0, newValue));
    }
  };
  const customRequest: UploadProps<UploadResponse>['customRequest'] = ({ file, onSuccess }) => {
    setTimeout(() => {
      const url = URL.createObjectURL(file as Blob);
      onSuccess?.({ data: { url } }, file);
    }, 500);
  };
  const handleFormSubmit = (values: HotelFormData) => {
    const submitData: SubmitHotelData = {
      ...values,
      type: type,
      // 提取图片URL（兼容模拟上传和真实接口返回）
      images: imageList
        .map((file) => {
          // 模拟上传：取file.response.data.url；真实接口：取file.url
          return file.response?.data?.url || file.url || '';
        })
        .filter(Boolean), // 过滤空URL
    };

    console.log('提交的酒店数据（类型安全）：', submitData);
    // 对接真实后端接口示例：
    // fetch('/api/hotel/add', {
    //   method: 'POST',
    //   body: JSON.stringify(submitData)
    // }).then(res => res.json()).then(data => {
    //   console.log('提交成功：', data);
    // });
  };

  const onChange: DatePickerProps['onChange'] = (date, dateString) => {
    console.log(date, dateString);
  };
  const handleChange: GetProp<typeof Checkbox.Group, 'onChange'> = (checkedValues) => {
    console.log('checked = ', checkedValues);
  };

  dayjs.locale('zh-cn');
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 p-8 max-w-3xl mx-auto">
      <Form<HotelFormData>
        className="w-full max-w-2xl"
        onFinish={handleFormSubmit}
        layout="vertical"
      >
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
        <Form.Item label="封面" className="mb-4">
          <Form.Item name="type">
            <Radio.Group value={type} onChange={handleTypeChange}>
              <Radio value={0}>无图</Radio>
              <Radio value={1}>单图</Radio>
              <Radio value={3}>三图</Radio>
            </Radio.Group>
          </Form.Item>
          {type > 0 && (
            <div>
              <Upload<UploadResponse>
                listType="picture-card"
                showUploadList
                customRequest={customRequest}
                name="image"
                onChange={handleUploadChange}
                maxCount={type}
                fileList={imageList}
                className="hotel-upload"
              >
                <div className="flex flex-col items-center justify-center p-4">
                  <PlusOutlined className="text-xl mb-1" />
                  <div className="text-sm">上传</div>
                </div>
              </Upload>
            </div>
          )}
        </Form.Item>
        <Form.Item label="房型">
          <Checkbox.Group defaultValue={['单人间']} onChange={handleChange} options={options} />
        </Form.Item>
        <Form.Item label="价格区间" className="mb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center">
              <Form.Item
                name="minPrice"
                rules={[{ required: true, message: '请输入最低价' }]}
                noStyle
              >
                <InputNumber<number> {...priceInputProps} placeholder="0" className="w-24" />
              </Form.Item>
              <span className="text-sm text-gray-500 ml-2">元</span>
            </div>

            <span className="text-gray-400">-</span>
            <div className="flex items-center">
              <Form.Item
                name="maxPrice"
                rules={[
                  { required: true, message: '请输入最高价' },
                  ({ getFieldValue }) => ({
                    dependencies: ['minPrice'],
                    validator() {
                      const min = getFieldValue('minPrice');
                      const max = getFieldValue('maxPrice');
                      if (min && max && min > max) {
                        return Promise.reject(new Error('最低价不能高于最高价'));
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
                noStyle
              >
                <InputNumber<number> {...priceInputProps} placeholder="9999" className="w-28" />
              </Form.Item>
              <span className="text-sm text-gray-500 ml-2">元</span>
            </div>
          </div>
        </Form.Item>
        <Form.Item label="开业时间">
          <Space vertical>
            <DatePicker onChange={onChange} placeholder="请选择日期" />
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddHotel;
