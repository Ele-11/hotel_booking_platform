import { Cascader, Input } from 'antd';
import type { CascaderProps } from 'antd';
import { pcaa } from 'area-data';
import { FC, useMemo } from 'react';

export type AddressValue = {
  regionCodes?: string[];
  regionNames?: string[];
  detail?: string;
  full?: string;
};

type Props = {
  value?: AddressValue;
  onChange?: (v: AddressValue) => void;
  placeholderRegion?: string;
  placeholderDetail?: string;
};

type Pcaa = Record<string, Record<string, string>>;

type Option = {
  value: string;
  label: string;
  children?: Option[];
};

function buildOptionsFromPcaa(pcaaData: Pcaa): Option[] {
  const provinces = pcaaData['86'] ?? {};

  return Object.entries(provinces).map(([pCode, pName]) => {
    const cities = pcaaData[pCode] ?? {};

    return {
      value: pCode,
      label: pName,
      children: Object.entries(cities).map(([cCode, cName]) => {
        const areas = pcaaData[cCode] ?? {};

        return {
          value: cCode,
          label: cName,
          children: Object.entries(areas).map(([aCode, aName]) => ({
            value: aCode,
            label: aName,
          })),
        };
      }),
    };
  });
}

const AddressPicker: FC<Props> = ({
  value,
  onChange,
  placeholderRegion = '请选择省 / 市 / 区',
  placeholderDetail = '请输入详细地址（街道/门牌号）',
}) => {
  const options = useMemo(() => buildOptionsFromPcaa(pcaa as unknown as Pcaa), []);

  const triggerChange = (patch: Partial<AddressValue>) => {
    const next: AddressValue = { ...(value || {}), ...patch };
    const region = next.regionNames?.filter(Boolean) || [];
    const detail = next.detail?.trim() || '';
    next.full = [region.join(''), detail].filter(Boolean).join('');
    onChange?.(next);
  };

  const onRegionChange: CascaderProps<Option>['onChange'] = (codes, selectedOptions) => {
    triggerChange({
      regionCodes: (codes as (string | number)[]).map(String),
      regionNames: (selectedOptions || []).map((o) => o.label),
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <Cascader<Option>
        options={options}
        value={value?.regionCodes}
        onChange={onRegionChange}
        placeholder={placeholderRegion}
        className="w-full"
      />
      <Input
        className="input"
        value={value?.detail}
        onChange={(e) => triggerChange({ detail: e.target.value })}
        placeholder={placeholderDetail}
        allowClear
      />
    </div>
  );
};

export default AddressPicker;
