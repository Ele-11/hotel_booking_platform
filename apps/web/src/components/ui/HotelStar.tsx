import { StarOutlined, StarFilled } from '@ant-design/icons';
import { Rate, Tooltip, Typography } from 'antd';
import { FC } from 'react';

const { Text } = Typography;

interface HotelStarProps {
  value?: number;
  onChange?: (star: number) => void;
  placeholder?: string;
  required?: boolean;
}
const HotelStar: FC<HotelStarProps> = ({
  value = 0,
  onChange = () => {},
  required = false,
  placeholder = '请选择酒店星级（1-5星）',
}) => {
  const validValue = value && value >= 1 && value <= 5 ? value : 0;

  const getCss = (varName: string, defaultValue: string) => {
    const value = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
    return value || defaultValue;
  };

  const handleStarChange = (star: number) => {
    if (star >= 1 && star <= 5) {
      onChange(star);
    }
  };

  return (
    <div className="hotel-star-container">
      <Tooltip title={validValue === 0 ? placeholder : `${validValue} 星级酒店 `} placement="top">
        <Rate
          disabled={false}
          value={validValue}
          count={5}
          allowHalf={false}
          character={
            <span className="star-icon-wrapper">
              <StarOutlined className="star-empty" />
              <StarFilled className="star-filled" />
            </span>
          }
          onChange={handleStarChange}
          className="hotel-star"
        />
      </Tooltip>
      {/* {required && validValue === 0 && <Text className="hotel-star-tip">请选择酒店星级</Text>} */}
    </div>
  );
};

export default HotelStar;
