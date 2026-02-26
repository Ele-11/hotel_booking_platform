import { FC, useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. 引入 useNavigate

type HotelStatus = 'published' | 'offline';
type AuditStatus = 'pending' | 'approved' | 'rejected';

interface Hotel {
  id: number;
  name: string;
  englishName: string;
  merchant: string;
  city: string;
  address: string;
  status: HotelStatus;
  auditStatus: AuditStatus;
  submitTime: string;
  updateTime?: string;
}

const statusLabelMap: Record<HotelStatus, string> = {
  published: '上架',
  offline: '下架',
};

const mockHotels: Hotel[] = [
  {
    id: 1,
    name: '星海国际大酒店',
    englishName: 'Xinghai International Hotel',
    merchant: 'zz',
    city: '上海',
    address: '浦东新区...',
    status: 'published',
    auditStatus: 'approved',
    submitTime: '2026-02-20 10:30:00',
  },
  {
    id: 2,
    name: '阳光海岸度假酒店',
    englishName: 'Sunshine Coast Resort Hotel',
    merchant: 'zz',
    city: '三亚',
    address: '三亚湾路...',
    status: 'published',
    auditStatus: 'approved',
    submitTime: '2026-02-11 09:15:00',
  },
  {
    id: 3,
    name: '城市便捷酒店',
    englishName: 'City Convenient Hotel',
    merchant: 'zhangzhang',
    city: '广州',
    address: '体育东路...',
    status: 'offline',
    auditStatus: 'rejected',
    submitTime: '2026-02-09 14:20:00',
  },
  {
    id: 4,
    name: '洲际酒店',
    englishName: 'InterContinental Hotel',
    merchant: 'zz',
    city: '天津',
    address: '解放北路...',
    status: 'published',
    auditStatus: 'approved',
    submitTime: '2026-02-16 11:10:00',
  },
  {
    id: 5,
    name: '里白酒店',
    englishName: 'LiBai Hotel',
    merchant: 'zhangzhang',
    city: '北京',
    address: '大学城...',
    status: 'offline',
    auditStatus: 'pending',
    submitTime: '2026-02-24 16:45:00',
  },
  {
    id: 9,
    name: '锦江之星酒店',
    englishName: 'Jinjiang Inn Hotel',
    merchant: '张三',
    city: '南京',
    address: '中山南路...',
    status: 'published',
    auditStatus: 'approved',
    submitTime: '2026-02-15 08:40:00',
  },
  {
    id: 10,
    name: '铂尔曼大酒店',
    englishName: 'Pullman Grand Hotel',
    merchant: '里斯',
    city: '成都',
    address: '人民南路...',
    status: 'published',
    auditStatus: 'approved',
    submitTime: '2026-02-18 11:25:00',
  },
  {
    id: 13,
    name: '香格里拉酒店',
    englishName: 'Shangri-La Hotel',
    merchant: '张三',
    city: '西安',
    address: '曲江路...',
    status: 'published',
    auditStatus: 'approved',
    submitTime: '2026-02-22 09:50:00',
  },
  {
    id: 14,
    name: '维也纳酒店',
    englishName: 'Vienna Hotel',
    merchant: '孙刘',
    city: '长沙',
    address: '五一大道...',
    status: 'published',
    auditStatus: 'approved',
    submitTime: '2026-02-17 10:20:00',
  },
  {
    id: 17,
    name: '万豪酒店',
    englishName: 'Marriott Hotel',
    merchant: '孙刘',
    city: '厦门',
    address: '环岛南路...',
    status: 'published',
    auditStatus: 'approved',
    submitTime: '2026-02-14 08:30:00',
  },
  {
    id: 18,
    name: '全季酒店',
    englishName: 'Ji Hotel',
    merchant: '孙刘',
    city: '苏州',
    address: '观前街...',
    status: 'published',
    auditStatus: 'approved',
    submitTime: '2026-02-19 12:10:00',
  },
  {
    id: 21,
    name: '希尔顿酒店',
    englishName: 'Hilton Hotel',
    merchant: '王五',
    city: '大连',
    address: '人民路...',
    status: 'published',
    auditStatus: 'approved',
    submitTime: '2026-02-13 09:40:00',
  },
];

const HotelPage: FC = () => {
  const navigate = useNavigate(); // 2. 初始化 navigate
  const [data, setData] = useState<Hotel[]>(() => {
    // 优先从共享存储读取数据
    const saved = localStorage.getItem('HOTEL_DB');
    return saved ? JSON.parse(saved) : mockHotels;
  });

  const [idKeyword, setIdKeyword] = useState('');
  const [nameKeyword, setNameKeyword] = useState('');
  const [merchantKeyword, setMerchantKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState<HotelStatus | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // 监听数据变化，同步到存储中以保持跨页面数据一致
  useEffect(() => {
    localStorage.setItem('HOTEL_DB', JSON.stringify(data));
  }, [data]);

  const merchantOptions = useMemo(() => {
    const set = new Set<string>();
    data.filter((h) => h.auditStatus === 'approved').forEach((h) => set.add(h.merchant));
    return Array.from(set);
  }, [data]);

  const approvedFilteredData = useMemo(() => {
    return data.filter((row) => {
      const isApproved = row.auditStatus === 'approved';
      const matchId = idKeyword.trim() === '' || row.id.toString().includes(idKeyword);
      const matchName =
        nameKeyword.trim() === '' || row.name.toLowerCase().includes(nameKeyword.toLowerCase());
      const matchMerchant = merchantKeyword === '' || row.merchant === merchantKeyword;
      const matchStatus = statusFilter === 'all' ? true : row.status === statusFilter;

      return isApproved && matchId && matchName && matchMerchant && matchStatus;
    });
  }, [data, idKeyword, nameKeyword, merchantKeyword, statusFilter]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return approvedFilteredData.slice(start, start + pageSize);
  }, [approvedFilteredData, currentPage, pageSize]);

  const totalPages = Math.ceil(approvedFilteredData.length / pageSize);

  useEffect(() => {
    setCurrentPage(1);
  }, [idKeyword, nameKeyword, merchantKeyword, statusFilter, pageSize]);

  const isCurrentPageAllChecked =
    paginatedData.length > 0 && paginatedData.every((item) => selectedIds.includes(item.id));

  const toggleCheckCurrentPage = () => {
    if (isCurrentPageAllChecked) {
      setSelectedIds((prev) => prev.filter((id) => !paginatedData.map((p) => p.id).includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...paginatedData.map((p) => p.id)])));
    }
  };

  const toggleCheckOne = (id: number) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const batchPublish = () => {
    if (selectedIds.length === 0) return alert('请先勾选酒店');
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
    if (selectedIds.length === 0) return alert('请先勾选酒店');
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
    setData((prev) => prev.map((row) => (row.id === id ? { ...row, status: 'published' } : row)));
  };

  const handleRowOffline = (id: number) => {
    setData((prev) => prev.map((row) => (row.id === id ? { ...row, status: 'offline' } : row)));
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
            <span className="text-muted">酒店ID：</span>
            <input
              className="h-8 w-40 rounded border border-box-border bg-box-bg px-2 outline-none"
              value={idKeyword}
              onChange={(e) => setIdKeyword(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted">酒店名称：</span>
            <input
              className="h-8 w-56 rounded border border-box-border bg-box-bg px-2 outline-none"
              value={nameKeyword}
              onChange={(e) => setNameKeyword(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted">所属商家：</span>
            <select
              className="h-8 w-48 rounded border border-box-border bg-box-bg px-2 outline-none"
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
            <span className="text-muted">上架状态：</span>
            <select
              className="h-8 w-40 rounded border border-box-border bg-box-bg px-2 outline-none"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
            >
              <option value="all">全部</option>
              <option value="published">已上架</option>
              <option value="offline">已下架</option>
            </select>
          </div>
          <button className="h-8 rounded bg-blue-500 px-4 text-white ml-auto">搜索</button>
          <button
            className="h-8 rounded border border-box-border bg-box-bg px-4"
            onClick={handleReset}
          >
            重置
          </button>
        </div>
        <div className="mt-4 flex gap-3">
          <button
            className="h-8 rounded bg-blue-500 px-4 text-white hover:bg-blue-600 transition-colors"
            onClick={batchPublish}
          >
            批量上架
          </button>
          <button
            className="h-8 rounded bg-red-500 px-4 text-white hover:bg-red-600 transition-colors"
            onClick={batchOffline}
          >
            批量下架
          </button>
        </div>
      </section>

      <section className="flex-1 overflow-hidden rounded-lg border border-box-border bg-white flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="min-w-full divide-y divide-box-border text-xs">
            <thead className="bg-muted/40">
              <tr>
                <th className="w-10 px-3 py-2 text-left">
                  <input
                    type="checkbox"
                    checked={isCurrentPageAllChecked}
                    onChange={toggleCheckCurrentPage}
                  />
                </th>
                <th className="px-3 py-2 text-left font-medium text-muted">酒店ID</th>
                <th className="px-3 py-2 text-left font-medium text-muted">酒店名称</th>
                <th className="px-3 py-2 text-left font-medium text-muted">所属商家</th>
                <th className="px-3 py-2 text-left font-medium text-muted">城市</th>
                <th className="px-3 py-2 text-left font-medium text-muted">当前状态</th>
                <th className="px-3 py-2 text-left font-medium text-muted">审核结论</th>
                <th className="px-3 py-2 text-left font-medium text-muted">提交时间</th>
                <th className="px-3 py-2 text-left font-medium text-muted">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-box-border bg-box-bg">
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-3 py-6 text-center text-muted">
                    暂无已审核通过的酒店数据
                  </td>
                </tr>
              ) : (
                paginatedData.map((row) => (
                  <tr key={row.id} className="hover:bg-muted/30">
                    <td className="px-3 py-2">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(row.id)}
                        onChange={() => toggleCheckOne(row.id)}
                      />
                    </td>
                    <td className="px-3 py-2">{row.id}</td>
                    <td className="px-3 py-2 text-blue-600 font-medium">{row.name}</td>
                    <td className="px-3 py-2">{row.merchant}</td>
                    <td className="px-3 py-2">{row.city}</td>
                    <td className="px-3 py-2">
                      <span
                        className={row.status === 'published' ? 'text-green-600' : 'text-gray-500'}
                      >
                        ● {statusLabelMap[row.status]}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-green-600 font-medium">已通过审核</td>
                    <td className="px-3 py-2 text-muted">{row.submitTime.split(' ')[0]}</td>
                    <td className="px-3 py-2">
                      <div className="flex flex-col gap-1 text-blue-600">
                        {row.status === 'offline' ? (
                          <button
                            className="text-left hover:underline"
                            onClick={() => handleRowPublish(row.id)}
                          >
                            上架酒店
                          </button>
                        ) : (
                          <button
                            className="text-left hover:underline text-red-500"
                            onClick={() => handleRowOffline(row.id)}
                          >
                            下架酒店
                          </button>
                        )}
                        <button
                          className="text-left hover:underline"
                          // onClick={() => navigate(`/admin/detail/${row.id}`)}
                        >
                          查看资料
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-box-border bg-muted/20 px-4 py-3 text-xs text-muted">
          <div className="flex items-center gap-4">
            <span>共展示 {approvedFilteredData.length} 家通过审核的酒店</span>
            <select
              className="h-8 rounded border border-box-border bg-box-bg px-2"
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
            >
              <option value={10}>10 条/页</option>
              <option value={20}>20 条/页</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="h-8 rounded border border-box-border bg-box-bg px-3 disabled:opacity-50"
            >
              上一页
            </button>
            <span className="font-medium">
              {currentPage} / {totalPages || 1}
            </span>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="h-8 rounded border border-box-border bg-box-bg px-3 disabled:opacity-50"
            >
              下一页
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HotelPage;
