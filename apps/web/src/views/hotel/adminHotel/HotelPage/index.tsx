import { FC, useMemo, useState } from 'react';

type HotelStatus = 'published' | 'offline';

interface Hotel {
  id: number;
  name: string;
  merchant: string;
  city: string;
  address: string;
  status: HotelStatus;
  submitTime: string;
  updateTime?: string;
  auditRemark?: string;
}

const statusLabelMap: Record<HotelStatus, string> = {
  published: '上架',
  offline: '下架',
};

const mockHotels: Hotel[] = [
  {
    id: 1,
    name: '星海国际大酒店',
    merchant: '商家 A',
    city: '上海',
    address: '浦东新区世纪大道 100 号',
    status: 'published',
    submitTime: '2026-02-10 10:30:00',
    updateTime: '2026-02-13 18:02:41',
  },
  {
    id: 2,
    name: '阳光海岸度假酒店',
    merchant: '商家 B',
    city: '三亚',
    address: '三亚湾路 88 号',
    status: 'published',
    submitTime: '2026-02-11 09:15:00',
    updateTime: '2026-02-13 15:20:00',
  },
  {
    id: 3,
    name: '城市便捷酒店',
    merchant: '商家 B',
    city: '广州',
    address: '天河区体育东路 66 号',
    status: 'offline',
    submitTime: '2026-02-09 14:20:00',
    updateTime: '2026-02-12 09:30:00',
  },
  {
    id: 4,
    name: '云顶商务酒店',
    merchant: '商家 D',
    city: '杭州',
    address: '西湖区文三路 18 号',
    status: 'offline',
    submitTime: '2026-02-12 16:45:00',
    updateTime: '2026-02-13 17:10:00',
  },
];

const HotelPage: FC = () => {
  const [data, setData] = useState<Hotel[]>(mockHotels);

  const [idKeyword, setIdKeyword] = useState('');
  const [nameKeyword, setNameKeyword] = useState('');
  const [merchantKeyword, setMerchantKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState<HotelStatus | 'all'>('all');

  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const merchantOptions = useMemo(() => {
    const set = new Set<string>();
    data.forEach((h) => set.add(h.merchant));
    return Array.from(set);
  }, [data]);

  const filteredData = useMemo(
    () =>
      data.filter((row) => {
        const matchId = idKeyword.trim() === '' || row.id.toString().includes(idKeyword);
        const matchName =
          nameKeyword.trim() === '' || row.name.toLowerCase().includes(nameKeyword.toLowerCase());
        const matchMerchant = merchantKeyword === '' || row.merchant === merchantKeyword;
        const matchStatus = statusFilter === 'all' ? true : row.status === statusFilter;

        return matchId && matchName && matchMerchant && matchStatus;
      }),
    [data, idKeyword, nameKeyword, merchantKeyword, statusFilter]
  );

  const allVisibleIds = filteredData.map((row) => row.id);
  const allChecked =
    allVisibleIds.length > 0 && allVisibleIds.every((id) => selectedIds.includes(id));

  const toggleCheckAll = () => {
    if (allChecked) {
      setSelectedIds((prev) => prev.filter((id) => !allVisibleIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...allVisibleIds])));
    }
  };

  const toggleCheckOne = (id: number) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const batchPublish = () => {
    if (selectedIds.length === 0) {
      alert('请先勾选需要上架的酒店');
      return;
    }
    setData((prev) =>
      prev.map((row) =>
        selectedIds.includes(row.id) && row.status === 'offline'
          ? { ...row, status: 'published' }
          : row
      )
    );
    setSelectedIds([]);
  };

  const batchOffline = () => {
    if (selectedIds.length === 0) {
      alert('请先勾选需要下架的酒店');
      return;
    }
    setData((prev) =>
      prev.map((row) =>
        selectedIds.includes(row.id) && row.status === 'published'
          ? { ...row, status: 'offline' }
          : row
      )
    );
    setSelectedIds([]);
  };

  const handleRowPublish = (id: number) => {
    setData((prev) =>
      prev.map((row) =>
        row.id === id && row.status === 'offline' ? { ...row, status: 'published' } : row
      )
    );
  };

  const handleRowOffline = (id: number) => {
    setData((prev) =>
      prev.map((row) =>
        row.id === id && row.status === 'published' ? { ...row, status: 'offline' } : row
      )
    );
  };

  const handleReset = () => {
    setIdKeyword('');
    setNameKeyword('');
    setMerchantKeyword('');
    setStatusFilter('all');
  };

  return (
    <div className="flex flex-col gap-4">
      <section className="rounded-lg border border-box-border bg-muted/40 px-4 py-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-muted whitespace-nowrap">酒店ID：</span>
            <input
              className="h-8 w-40 rounded border border-box-border bg-box-bg px-2 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              placeholder="请输入酒店ID"
              value={idKeyword}
              onChange={(e) => setIdKeyword(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-muted whitespace-nowrap">酒店名称：</span>
            <input
              className="h-8 w-56 rounded border border-box-border bg-box-bg px-2 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              placeholder="请输入酒店名称"
              value={nameKeyword}
              onChange={(e) => setNameKeyword(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-muted whitespace-nowrap">所属商家：</span>
            <select
              className="h-8 w-48 rounded border border-box-border bg-box-bg px-2 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              value={merchantKeyword}
              onChange={(e) => setMerchantKeyword(e.target.value)}
            >
              <option value="">全部商家</option>
              {merchantOptions.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-muted whitespace-nowrap">酒店状态：</span>
            <select
              className="h-8 w-40 rounded border border-box-border bg-box-bg px-2 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as HotelStatus | 'all')}
            >
              <option value="all">全部</option>
              <option value="published">上架</option>
              <option value="offline">下架</option>
            </select>
          </div>

          <div className="ml-auto flex gap-2">
            <button
              className="h-8 rounded bg-blue-500 px-4 text-xs text-white hover:bg-blue-600"
              onClick={() => {}}
            >
              搜索
            </button>
            <button
              className="h-8 rounded border border-box-border bg-box-bg px-4 text-xs text-heading-2 hover:bg-muted/40"
              onClick={handleReset}
            >
              重置
            </button>
          </div>
        </div>

        <div className="mt-4 flex gap-3">
          <button
            className="h-8 rounded bg-blue-500 px-4 text-xs text-white hover:bg-blue-600"
            onClick={batchPublish}
          >
            批量上架
          </button>
          <button
            className="h-8 rounded bg-red-500 px-4 text-xs text-white hover:bg-red-600"
            onClick={batchOffline}
          >
            批量下架
          </button>
        </div>
      </section>

      <section className="flex-1 overflow-hidden rounded-lg border border-box-border">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-box-border text-xs">
            <thead className="bg-muted/40">
              <tr>
                <th className="w-10 px-3 py-2 text-left">
                  <input type="checkbox" checked={allChecked} onChange={toggleCheckAll} />
                </th>
                <th className="px-3 py-2 text-left font-medium text-muted">酒店ID</th>
                <th className="px-3 py-2 text-left font-medium text-muted">酒店名称</th>
                <th className="px-3 py-2 text-left font-medium text-muted">所属商家</th>
                <th className="px-3 py-2 text-left font-medium text-muted">城市</th>
                <th className="px-3 py-2 text-left font-medium text-muted">酒店状态</th>
                <th className="px-3 py-2 text-left font-medium text-muted">提交时间</th>
                <th className="px-3 py-2 text-left font-medium text-muted">更新时间</th>
                <th className="px-3 py-2 text-left font-medium text-muted">审核备注</th>
                <th className="px-3 py-2 text-left font-medium text-muted">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-box-border bg-box-bg">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-3 py-6 text-center text-muted">
                    暂无符合条件的记录
                  </td>
                </tr>
              ) : (
                filteredData.map((row) => (
                  <tr key={row.id} className="hover:bg-muted/30">
                    <td className="px-3 py-2 align-top">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(row.id)}
                        onChange={() => toggleCheckOne(row.id)}
                      />
                    </td>
                    <td className="px-3 py-2 align-top text-heading-2">{row.id}</td>
                    <td className="px-3 py-2 align-top text-heading-1">{row.name}</td>
                    <td className="px-3 py-2 align-top text-heading-2">{row.merchant}</td>
                    <td className="px-3 py-2 align-top text-heading-2">{row.city}</td>
                    <td className="px-3 py-2 align-top">
                      <span className="text-primary">{statusLabelMap[row.status]}</span>
                    </td>
                    <td className="px-3 py-2 align-top text-muted">{row.submitTime}</td>
                    <td className="px-3 py-2 align-top text-muted">{row.updateTime}</td>
                    <td className="px-3 py-2 align-top text-muted">{row.auditRemark ?? '-'}</td>
                    <td className="px-3 py-2 align-top">
                      <div className="flex flex-col gap-1 text-[11px] text-blue-600">
                        {row.status === 'offline' && (
                          <button
                            className="text-left hover:underline"
                            onClick={() => handleRowPublish(row.id)}
                          >
                            上架
                          </button>
                        )}
                        {row.status === 'published' && (
                          <button
                            className="text-left hover:underline"
                            onClick={() => handleRowOffline(row.id)}
                          >
                            下架
                          </button>
                        )}
                        <button
                          className="text-left hover:underline"
                          onClick={() => alert('这里可以跳转到酒店详情页')}
                        >
                          查看详情
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default HotelPage;
