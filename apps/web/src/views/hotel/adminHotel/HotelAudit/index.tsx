import { FC, useMemo, useState } from 'react';

type AuditStatus = 'pending' | 'approved' | 'rejected';

interface HotelAudit {
  id: number;
  name: string;
  merchant: string;
  status: AuditStatus;
  submitTime: string;
  auditor?: string;
  auditTime?: string;
  auditRemark?: string;
}

const auditStatusLabelMap: Record<AuditStatus, string> = {
  pending: '待审核',
  approved: '审核通过',
  rejected: '审核拒绝',
};

const mockAudits: HotelAudit[] = [
  {
    id: 50,
    name: '星海国际大酒店',
    merchant: '商家 A',
    status: 'approved',
    submitTime: '2025-09-30 22:30:32',
    auditor: '管理员',
    auditTime: '2025-09-30 22:31:07',
    auditRemark: '资料完整，审核通过。',
  },
  {
    id: 51,
    name: '阳光海岸度假酒店',
    merchant: '商家 B',
    status: 'pending',
    submitTime: '2025-10-01 09:15:20',
  },
  {
    id: 52,
    name: '城市便捷酒店',
    merchant: '商家 B',
    status: 'rejected',
    submitTime: '2025-08-15 17:54:12',
    auditor: '管理员',
    auditTime: '2025-08-15 18:01:33',
    auditRemark: '缺少酒店图片和价格信息，请补充后重新提交。',
  },
];

const HotelAuditPage: FC = () => {
  const [data] = useState<HotelAudit[]>(mockAudits);
  const [idKeyword, setIdKeyword] = useState('');
  const [nameKeyword, setNameKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState<AuditStatus | 'all'>('all');

  const filteredData = useMemo(
    () =>
      data.filter((row) => {
        const matchId = idKeyword.trim() === '' || String(row.id).includes(idKeyword.trim());
        const matchName =
          nameKeyword.trim() === '' || row.name.toLowerCase().includes(nameKeyword.toLowerCase());
        const matchStatus = statusFilter === 'all' ? true : row.status === statusFilter;

        return matchId && matchName && matchStatus;
      }),
    [data, idKeyword, nameKeyword, statusFilter]
  );

  const handleReset = () => {
    setIdKeyword('');
    setNameKeyword('');
    setStatusFilter('all');
  };

  return (
    <div className="flex flex-col gap-4">
      <section className="rounded-lg border border-box-border bg-muted/40 px-4 py-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="whitespace-nowrap text-muted">酒店ID：</span>
            <input
              className="h-8 w-40 rounded border border-box-border bg-box-bg px-2 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              placeholder="请输入酒店ID"
              value={idKeyword}
              onChange={(e) => setIdKeyword(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="whitespace-nowrap text-muted">酒店名称：</span>
            <input
              className="h-8 w-56 rounded border border-box-border bg-box-bg px-2 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              placeholder="请输入酒店名称"
              value={nameKeyword}
              onChange={(e) => setNameKeyword(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="whitespace-nowrap text-muted">审核状态：</span>
            <select
              className="h-8 w-40 rounded border border-box-border bg-box-bg px-2 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as AuditStatus | 'all')}
            >
              <option value="all">全部</option>
              <option value="pending">待审核</option>
              <option value="approved">审核通过</option>
              <option value="rejected">审核拒绝</option>
            </select>
          </div>

          {/* 这里可以扩展提交时间范围，用日期组件，先留空位 */}
          {/* <div className="flex items-center gap-2">
            <span className="whitespace-nowrap text-muted">提交时间：</span>
            <input className="h-8 w-40 ..." type="date" />
            <span>→</span>
            <input className="h-8 w-40 ..." type="date" />
          </div> */}

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
      </section>

      <section className="flex-1 overflow-hidden rounded-lg border border-box-border">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-box-border text-xs">
            <thead className="bg-muted/40">
              <tr>
                <th className="px-3 py-2 text-left font-medium text-muted">酒店ID</th>
                <th className="px-3 py-2 text-left font-medium text-muted">酒店名称</th>
                <th className="px-3 py-2 text-left font-medium text-muted">所属商家</th>
                <th className="px-3 py-2 text-left font-medium text-muted">审核状态</th>
                <th className="px-3 py-2 text-left font-medium text-muted">提交时间</th>
                <th className="px-3 py-2 text-left font-medium text-muted">审核人</th>
                <th className="px-3 py-2 text-left font-medium text-muted">审核时间</th>
                <th className="px-3 py-2 text-left font-medium text-muted">审核备注</th>
                <th className="px-3 py-2 text-left font-medium text-muted">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-box-border bg-box-bg">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-3 py-6 text-center text-muted">
                    暂无符合条件的审核记录
                  </td>
                </tr>
              ) : (
                filteredData.map((row) => (
                  <tr key={row.id} className="hover:bg-muted/30">
                    <td className="px-3 py-2 align-top text-heading-2">{row.id}</td>
                    <td className="px-3 py-2 align-top text-heading-1">{row.name}</td>
                    <td className="px-3 py-2 align-top text-heading-2">{row.merchant}</td>
                    <td className="px-3 py-2 align-top text-primary">
                      {auditStatusLabelMap[row.status]}
                    </td>
                    <td className="px-3 py-2 align-top text-muted">{row.submitTime}</td>
                    <td className="px-3 py-2 align-top text-heading-2">{row.auditor ?? '-'}</td>
                    <td className="px-3 py-2 align-top text-muted">{row.auditTime ?? '-'}</td>
                    <td className="px-3 py-2 align-top text-muted">{row.auditRemark ?? '-'}</td>
                    <td className="px-3 py-2 align-top">
                      <button
                        className="text-[11px] text-blue-600 hover:underline"
                        onClick={() => alert('这里可以跳转到审核详情/酒店详情页面')}
                      >
                        查看详情
                      </button>
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

export default HotelAuditPage;
